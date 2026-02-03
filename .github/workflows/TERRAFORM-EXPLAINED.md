# How Terraform Works Through GitHub Actions

## 🔐 Overview: Secure, Automated Infrastructure Deployment

Your setup uses **OIDC (OpenID Connect)** authentication - GitHub Actions authenticates to AWS **without storing AWS credentials** in GitHub secrets. This is the modern, secure way to deploy.

---

## 📊 The Complete Flow

```
┌─────────────────┐
│  You Push Code  │
│   to GitHub     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  CI Workflow (ci.yaml)          │
│  ────────────────────────────   │
│  1. Build Docker image          │
│  2. Scan with Trivy             │
│  3. Scan Terraform (Checkov)    │
│  4. Push image to ECR           │
└────────┬────────────────────────┘
         │
         │ (if CI succeeds)
         ▼
┌─────────────────────────────────┐
│  CD Workflow (cd.yaml)          │
│  ────────────────────────────   │
│  1. Terraform Init              │
│  2. Terraform Plan              │
│  3. Upload Plan Artifact        │
│  4. ⏸️ Manual Approval          │
│  5. Terraform Apply             │
│  6. Health Check                │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  AWS Resources Created          │
│  ────────────────────────────   │
│  • VPC, Subnets, NAT Gateway   │
│  • ECS Cluster & Service       │
│  • Application Load Balancer    │
│  • Security Groups             │
│  • WAF Rules                   │
│  • CloudWatch Alarms           │
└─────────────────────────────────┘
```

---

## 🔑 Step-by-Step: How Authentication Works

### 1. **OIDC Provider Setup** (One-time, in `infrastructure/persistent/iam.tf`)

When you deploy the **persistent layer**, Terraform creates:

```hcl
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  # This tells AWS: "Trust tokens from GitHub Actions"
}
```

**What this does:**
- Creates a trust relationship between AWS and GitHub
- AWS can verify that tokens come from GitHub Actions
- No AWS credentials stored in GitHub!

### 2. **IAM Role for GitHub Actions**

```hcl
resource "aws_iam_role" "github_actions" {
  name = "aws-cost-dashboard-github-role"
  # This role has permissions to:
  # - Push to ECR
  # - Read/write Terraform state in S3
  # - Create/update/delete AWS resources
}
```

**Permissions granted:**
- ✅ ECR: Push Docker images
- ✅ S3: Read/write Terraform state
- ✅ EC2: Create VPC, subnets, security groups
- ✅ ECS: Create cluster, service, task definitions
- ✅ ELB: Create load balancers
- ✅ Route53: Update DNS records
- ✅ CloudWatch: Create alarms
- ✅ WAF: Create web ACLs

### 3. **GitHub Actions Assumes the Role**

In your workflows (`ci.yaml` and `cd.yaml`):

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v5
  with:
    role-to-assume: ${{ secrets.AWS_GITHUB_ROLE_ARN }}
    aws-region: eu-west-2
```

**What happens:**
1. GitHub Actions requests a token from GitHub's OIDC endpoint
2. Token includes: repository name, branch, workflow run ID
3. GitHub Actions calls AWS STS: `AssumeRoleWithWebIdentity`
4. AWS verifies the token and checks conditions:
   - ✅ Token is from GitHub Actions
   - ✅ Repository matches: `repo:YOUR_USERNAME/REPO_NAME`
   - ✅ Branch is `main` or environment is `production`
5. AWS returns temporary credentials (valid for 1 hour)
6. GitHub Actions uses these credentials to run Terraform

---

## 🔄 Workflow Details

### **CI Workflow** (`ci.yaml`)

**Triggers:** Push to `main` branch

**What it does:**
1. **Build Docker Image**
   ```bash
   docker build -t ECR_URL:COMMIT_SHA .
   ```

2. **Security Scans**
   - **Trivy**: Scans Docker image for vulnerabilities
   - **Checkov**: Scans Terraform files for misconfigurations

3. **Push to ECR**
   ```bash
   docker push ECR_URL:COMMIT_SHA
   ```

**Output:** Docker image tagged with commit SHA in ECR

---

### **CD Workflow** (`cd.yaml`)

**Triggers:** After CI workflow completes successfully

**Two Jobs:**

#### **Job 1: `terraform-plan`**

```yaml
steps:
  - terraform init          # Initialize backend (S3)
  - terraform plan          # Preview changes
  - Upload plan artifact    # Save plan for apply job
```

**What Terraform Plan does:**
- Reads current state from S3: `s3://terraform-state-bucket/aws-cost-dashboard/ephemeral/terraform.tfstate`
- Compares desired state (`.tf` files) vs current state
- Shows what will be created/updated/deleted
- Creates a plan file (`tfplan`) saved as artifact

**Example Plan Output:**
```
Plan: 15 to add, 2 to change, 0 to destroy.
  + aws_vpc.main
  + aws_subnet.public[0]
  + aws_subnet.public[1]
  + aws_ecs_cluster.main
  + aws_ecs_service.main
  ...
```

#### **Job 2: `terraform-apply`** (Requires Manual Approval)

```yaml
environment: production  # This triggers manual approval!
steps:
  - Download plan artifact
  - terraform init
  - terraform apply -auto-approve
  - Health check
```

**Manual Approval Gate:**
- GitHub shows a button: "Review deployments"
- You must click "Approve" before `terraform apply` runs
- This prevents accidental deployments

**What Terraform Apply does:**
1. Reads the plan file (`tfplan`)
2. Creates/updates AWS resources:
   - VPC, subnets, NAT gateway
   - ECS cluster and service
   - Load balancer
   - Security groups
   - WAF rules
   - CloudWatch alarms
3. Updates state file in S3
4. Outputs dashboard URL

**Health Check:**
- Waits for ECS service to be healthy
- Checks `/health` endpoint
- Reports success/failure

---

## 📦 Terraform State Management

### **Where State is Stored**

**Persistent Layer:**
```
s3://terraform-state-bucket/aws-cost-dashboard/persistent/terraform.tfstate
```
- ECR repository
- IAM roles
- ACM certificate
- Route53 hosted zone

**Ephemeral Layer:**
```
s3://terraform-state-bucket/aws-cost-dashboard/ephemeral/terraform.tfstate
```
- VPC, subnets
- ECS cluster/service
- Load balancer
- WAF, CloudWatch

### **State Locking**

DynamoDB table: `terraform-state-lock-aws-cost-dashboard`

**Why locking?**
- Prevents two Terraform runs from modifying state simultaneously
- If Plan job is running, Apply job waits
- Prevents state corruption

---

## 🔧 Required GitHub Secrets

You need to configure these in GitHub:

1. **`AWS_GITHUB_ROLE_ARN`**
   ```
   arn:aws:iam::ACCOUNT_ID:role/aws-cost-dashboard-github-role
   ```
   - Get this from Terraform output after deploying persistent layer:
     ```bash
     cd infrastructure/persistent
     terraform output github_role_arn
     ```

2. **`DOMAIN_NAME`**
   ```
   yourdomain.com
   ```

3. **`TERRAFORM_STATE_BUCKET`**
   ```
   terraform-state-aws-cost-dashboard-ismael-yasin
   ```

---

## 🚀 How to Enable This

### **Step 1: Deploy Persistent Layer** (One-time, manual)

```bash
cd infrastructure/persistent
terraform init
terraform apply
```

This creates:
- ECR repository
- OIDC provider
- IAM role for GitHub Actions

### **Step 2: Get Role ARN**

```bash
terraform output github_role_arn
# Output: arn:aws:iam::123456789012:role/aws-cost-dashboard-github-role
```

### **Step 3: Configure GitHub Secrets**

Go to: `https://github.com/YOUR_USERNAME/REPO/settings/secrets/actions`

Add:
- `AWS_GITHUB_ROLE_ARN` = (from Step 2)
- `DOMAIN_NAME` = yourdomain.com
- `TERRAFORM_STATE_BUCKET` = terraform-state-aws-cost-dashboard-ismael-yasin

### **Step 4: Enable Manual Approval**

Go to: `https://github.com/YOUR_USERNAME/REPO/settings/environments`

1. Click "New environment"
2. Name: `production`
3. Enable "Required reviewers" (optional but recommended)
4. Save

### **Step 5: Push Code**

```bash
git push origin main
```

**What happens:**
1. CI workflow runs → Builds and pushes Docker image
2. CD workflow runs → Terraform plan
3. You approve → Terraform apply
4. Dashboard deployed! 🎉

---

## 🔍 Troubleshooting

### **"Role cannot be assumed"**

**Problem:** GitHub Actions can't assume the IAM role

**Check:**
1. OIDC provider exists: `aws iam list-open-id-connect-providers`
2. Role trust policy matches your repo: Check `infrastructure/persistent/iam.tf`
3. GitHub secret `AWS_GITHUB_ROLE_ARN` is correct

### **"State locked"**

**Problem:** Another Terraform run is in progress

**Solution:** Wait for the other run to finish, or manually unlock:
```bash
aws dynamodb delete-item \
  --table-name terraform-state-lock-aws-cost-dashboard \
  --key '{"LockID":{"S":"s3://bucket/key"}}'
```

### **"Plan file not found"**

**Problem:** Plan job didn't upload artifact

**Check:** Plan job must complete successfully before Apply job runs

---

## 📚 Key Concepts

### **Why Two Workflows?**

- **CI**: Fast feedback on code quality (build, scan)
- **CD**: Infrastructure changes (Terraform) happen separately

### **Why Manual Approval?**

- Prevents accidental deployments
- Lets you review Terraform plan before applying
- Production safety gate

### **Why OIDC Instead of Access Keys?**

- ✅ No credentials stored in GitHub
- ✅ Temporary credentials (1 hour expiry)
- ✅ Auditable (CloudTrail logs show which workflow ran)
- ✅ Scoped permissions (only your repo can assume role)

---

## 🎯 Summary

**Terraform runs through GitHub Actions by:**

1. **Authentication**: OIDC provider trusts GitHub Actions
2. **Authorization**: IAM role grants permissions
3. **Execution**: GitHub Actions assumes role, runs Terraform
4. **State**: Stored in S3, locked with DynamoDB
5. **Safety**: Manual approval gate before apply

**Result:** Push code → Automated build → Review plan → Approve → Deploy! 🚀
