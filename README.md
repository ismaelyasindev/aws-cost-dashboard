# AWS Cost Dashboard Deployment

This repository contains the infrastructure and CI/CD configuration for deploying an application to AWS using Terraform and GitHub Actions.

## Architecture

The deployment system uses GitHub Actions to build Docker images and deploy infrastructure changes automatically. When code is pushed to the main branch, it triggers a pipeline that builds the container image, pushes it to ECR, and updates the AWS infrastructure.

![Deployment Architecture](assets/deployment-architecture-colorful.png)

## Project Structure

```
aws-cost-dashboard/
├── docker/
│   └── Dockerfile              # Docker image definition
├── infrastructure/             # Terraform infrastructure code
│   ├── modules/               # Reusable Terraform modules
│   │   ├── ecs/              # ECS cluster and service configuration
│   │   ├── loadbalancer/      # Application Load Balancer setup
│   │   ├── security/          # Security groups and WAF rules
│   │   └── vpc/               # VPC and networking configuration
│   ├── main.tf                # Main infrastructure resources
│   ├── variables.tf           # Input variables
│   ├── outputs.tf             # Output values
│   ├── backend.tf             # Terraform state backend configuration
│   └── terraform.tfvars.example # Example variables file
└── .github/
    └── workflows/              # GitHub Actions workflows
        ├── deploy.yaml         # Build and push Docker image to ECR
        ├── apply.yaml          # Plan and apply Terraform changes
        └── health-check.yml    # Post-deployment health verification
```

## Prerequisites

Before deploying, ensure you have:

- AWS account with administrator access
- Domain name registered and accessible
- Terraform installed locally
- GitHub repository with Actions enabled
- S3 bucket for Terraform state storage
- DynamoDB table for Terraform state locking

## Initial Setup

### 1. Create Terraform State Backend

Create an S3 bucket and DynamoDB table for Terraform state:

```bash
aws s3 mb s3://terraform-state-aws-cost-dashboard-ismael-yasin --region eu-west-2
aws dynamodb create-table \
  --table-name terraform-state-lock-aws-cost-dashboard \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-west-2
```

### 2. Configure Terraform Variables

Copy the example variables file and update it with your values:

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:

- `domain_name`: Your domain name
- `github_repo`: Your GitHub repository in format owner/repo
- `alert_email`: Email address for CloudWatch alerts
- `terraform_state_bucket`: Your S3 bucket name
- `aws_region`: AWS region for deployment

### 3. Deploy Infrastructure

Initialize Terraform and apply the configuration:

```bash
terraform init
terraform plan
terraform apply
```

This creates all AWS resources including:

- ECR repository for Docker images
- VPC with public and private subnets
- ECS Fargate cluster and service
- Application Load Balancer
- Route53 hosted zone and DNS records
- ACM certificate for HTTPS
- WAF rules for security
- CloudWatch alarms and logging
- IAM roles for GitHub Actions

### 4. Get IAM Role ARN

After Terraform apply completes, get the GitHub Actions role ARN:

```bash
terraform output github_actions_role_arn
```

Copy this ARN value for the next step.

### 5. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

Go to Settings > Secrets and variables > Actions > New repository secret

Add these secrets:

- `AWS_GITHUB_ROLE_ARN`: The ARN from terraform output
- `DOMAIN_NAME`: Your domain name
- `TERRAFORM_STATE_BUCKET`: Your S3 bucket name
- `ALERT_EMAIL`: Your email address

### 6. Create GitHub Environment

Create a production environment for manual approval:

Go to Settings > Environments > New environment

- Name: `production`
- Deployment branches: Select `main` branch
- Optional: Add required reviewers for approval

## Deployment Process

### Automatic Deployment

Once setup is complete, pushing code to the main branch triggers automatic deployment:

1. **Deploy Workflow**: Builds Docker image and pushes to ECR
2. **Apply Workflow**: Runs Terraform plan and waits for approval
3. **Manual Approval**: Review and approve the production environment
4. **Terraform Apply**: Updates infrastructure with new changes
5. **Health Check**: Verifies application is responding

### Manual Deployment

To trigger deployment manually:

1. Push changes to main branch
2. Monitor GitHub Actions tab for workflow progress
3. Approve the Apply workflow when prompted
4. Wait for health check to complete

## Infrastructure Components

The deployment creates the following AWS resources:

**Networking**
- VPC spanning two availability zones
- Public subnets for load balancer and NAT gateway
- Private subnets for ECS tasks
- Internet Gateway for public access
- NAT Gateway for private subnet outbound access

**Compute**
- ECS Fargate cluster
- ECS service running containerized application
- Task definition with resource limits

**Load Balancing**
- Application Load Balancer in public subnets
- Target group routing to ECS tasks
- HTTPS listener with ACM certificate
- HTTP to HTTPS redirect

**Security**
- Security groups restricting network traffic
- WAF rules protecting against attacks
- IAM roles with least privilege permissions
- Private subnet isolation

**Monitoring**
- CloudWatch log groups for application logs
- CloudWatch alarms for CPU and memory
- SNS topic for email notifications
- Container Insights for ECS metrics

**DNS and Certificates**
- Route53 hosted zone for domain management
- ACM certificate for SSL/TLS
- DNS records pointing to load balancer

## Updating Infrastructure

To modify infrastructure:

1. Edit Terraform files in the `infrastructure` directory
2. Commit and push changes to main branch
3. GitHub Actions runs Terraform plan
4. Review the plan output in Actions logs
5. Approve the production environment
6. Terraform apply executes the changes

## Troubleshooting

**Deployment fails with permission errors**

Check that the IAM role has all required permissions. Run `terraform apply` locally to update the role if needed.

**Docker build fails**

Verify the Dockerfile path in the workflow matches the actual location. The workflow uses `docker/Dockerfile`.

**Terraform plan shows unexpected changes**

Review the Terraform state and ensure no manual changes were made in AWS console. Import any manually created resources.

**Health check fails**

Check CloudWatch logs for application errors. Verify the health endpoint is responding at `/health`.

**Email alerts not working**

Confirm the SNS email subscription in AWS console. Check your email for the confirmation link.

## State Management

Terraform state is stored in S3 and locked with DynamoDB. This allows:

- Team collaboration without conflicts
- State history through S3 versioning
- Safe concurrent operations
- Remote state access for CI/CD

Never commit `terraform.tfvars` or state files to version control. These contain sensitive information.

## CI/CD Workflow Details

**Deploy Workflow** (`deploy.yaml`)
- Triggers on push to main branch
- Uses OIDC to assume AWS IAM role
- Logs into ECR
- Builds Docker image with commit SHA tag
- Pushes image to ECR repository

**Apply Workflow** (`apply.yaml`)
- Triggers after Deploy workflow completes
- Runs Terraform plan with all variables
- Uploads plan as artifact
- Waits for production environment approval
- Downloads plan artifact
- Applies Terraform changes

**Health Check Workflow** (`health-check.yml`)
- Triggers after Apply workflow completes
- Waits 60 seconds for deployment to stabilize
- Checks health endpoint repeatedly
- Fails if health check does not pass

## Cost Considerations

Estimated monthly costs for this infrastructure:

- ECS Fargate: Approximately $15 per task
- Application Load Balancer: Approximately $20
- NAT Gateway: Approximately $32
- Route53 Hosted Zone: $0.50
- CloudWatch Logs: Approximately $1
- Data transfer: Variable based on usage

Total estimated cost: Around $68 per month plus data transfer.

## Security Best Practices

- ECS tasks run in private subnets without public IPs
- Security groups restrict traffic to necessary ports only
- WAF protects against common web vulnerabilities
- IAM roles follow least privilege principle
- HTTPS enforced for all traffic
- Container images scanned for vulnerabilities
- Secrets stored in GitHub Secrets, never in code

## License

MIT
