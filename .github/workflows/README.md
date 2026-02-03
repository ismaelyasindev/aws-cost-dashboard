# GitHub Actions CI/CD Setup

## Overview

This directory contains GitHub Actions workflows for automated CI/CD of the AWS Cost Dashboard.

## Workflows

### 1. CI (Continuous Integration) - `ci.yaml`

**Triggers:** Push to `main` branch

**What it does:**
- Builds Docker image
- Scans for vulnerabilities (Trivy)
- Pushes to ECR
- Scans Terraform code (Checkov)

**Output:** Docker image tagged with Git commit SHA

### 2. CD (Continuous Deployment) - `cd.yaml`

**Triggers:** After successful CI workflow

**What it does:**
- Terraform plan (preview changes)
- Manual approval required (GitHub Environment)
- Terraform apply (deploy infrastructure)
- Health check verification

**Output:** Deployed application at `https://dashboard.yourdomain.com`

## Required GitHub Secrets

Set these in your GitHub repository settings:

1. **AWS_GITHUB_ROLE_ARN**
   - Value: ARN of the IAM role created by persistent layer
   - Example: `arn:aws:iam::123456789012:role/aws-cost-dashboard-github-role`
   - Get from: `cd infrastructure/persistent && terraform output github_actions_role_arn`

2. **DOMAIN_NAME**
   - Value: Your domain name
   - Example: `yourdomain.com`

3. **TERRAFORM_STATE_BUCKET**
   - Value: S3 bucket name for Terraform state
   - Example: `terraform-state-aws-cost-dashboard-YOUR-NAME`

## Required GitHub Environment

Create a GitHub Environment named `production`:

1. Go to: Repository → Settings → Environments
2. Create new environment: `production`
3. Enable "Required reviewers" (optional but recommended)
4. Add yourself as a reviewer

This adds a manual approval gate before deployment.

## How to Set Up

### Step 1: Get IAM Role ARN

```bash
cd infrastructure/persistent
terraform output github_actions_role_arn
```

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the three secrets listed above

### Step 3: Create Production Environment

1. Settings → Environments
2. New environment: `production`
3. Add required reviewers (optional)

### Step 4: Test the Pipeline

```bash
git add .
git commit -m "Add CI/CD workflows"
git push origin main
```

The CI workflow will run automatically. After it succeeds, the CD workflow will trigger and wait for approval.

## Workflow Flow

```
┌─────────────┐
│ Push to main│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CI Workflow │
│  - Build     │
│  - Scan      │
│  - Push ECR  │
└──────┬──────┘
       │ Success
       ▼
┌─────────────┐
│  CD Workflow │
│  - Plan      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Approval   │  (GitHub Environment)
│  Required   │
└──────┬──────┘
       │ Approved
       ▼
┌─────────────┐
│  Apply      │
│  - Deploy   │
│  - Health   │
└─────────────┘
```

## Troubleshooting

### Workflow fails at "Configure AWS credentials"

- Check that `AWS_GITHUB_ROLE_ARN` secret is set correctly
- Verify the IAM role exists and has correct trust policy
- Check OIDC provider is configured in AWS

### Workflow fails at "Terraform Plan"

- Verify `TERRAFORM_STATE_BUCKET` secret is correct
- Check S3 bucket exists and is accessible
- Verify backend configuration in `infrastructure/ephemeral/backend.tf`

### Health check fails

- ECS tasks may still be starting (wait 2-3 minutes)
- Check ECS service status in AWS Console
- Verify ALB target group health
- Check CloudWatch logs for errors

## Manual Deployment

If you need to deploy manually:

```bash
cd infrastructure/ephemeral
terraform apply -var="image_tag=<commit-sha>"
```
