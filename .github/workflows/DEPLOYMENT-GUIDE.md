# GitHub Actions Terraform Deployment Guide

This guide explains how Terraform infrastructure deployment works through GitHub Actions and how to capture deployment screenshots for your README.

## 📋 Table of Contents

1. [How It Works](#how-it-works)
2. [Deployment Flow](#deployment-flow)
3. [Viewing Deployment Details](#viewing-deployment-details)
4. [Capturing Screenshots](#capturing-screenshots)
5. [Adding Screenshots to README](#adding-screenshots-to-readme)
6. [Troubleshooting](#troubleshooting)

## How It Works

### Architecture Overview

The deployment process uses two GitHub Actions workflows:

1. **CI Workflow** (`ci.yaml`): Builds, scans, and pushes Docker images
2. **CD Workflow** (`cd.yaml`): Plans and applies Terraform infrastructure

### Key Components

- **OIDC Authentication**: Secure AWS access without static credentials
- **Terraform State**: Stored in S3 bucket for state management
- **Manual Approval**: Production deployments require approval via GitHub Environments
- **Health Checks**: Automatic validation after deployment
- **Detailed Summaries**: Rich deployment information in GitHub Actions UI

## Deployment Flow

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Workflow   │
│  - Build Image  │
│  - Scan (Trivy) │
│  - Push to ECR  │
└────────┬────────┘
         │ Success
         ▼
┌─────────────────┐
│   CD Workflow   │
│  - Terraform Plan│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Manual Approval │ ← GitHub Environment
│   (Production)  │
└────────┬────────┘
         │ Approved
         ▼
┌─────────────────┐
│ Terraform Apply │
│  - Deploy Infra │
│  - Update ECS   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Health Check   │
│  - Verify App   │
└─────────────────┘
```

## Viewing Deployment Details

### Step 1: Navigate to Actions Tab

1. Go to your GitHub repository
2. Click on the **"Actions"** tab at the top
3. You'll see a list of all workflow runs

### Step 2: Select a Workflow Run

1. Click on the **"CD"** workflow (or "CI" for build details)
2. You'll see the workflow run summary with:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - 🟡 Yellow circle = In Progress

### Step 3: View Detailed Steps

Click on a specific workflow run to see:

#### **Terraform Plan Step**
- Shows planned infrastructure changes
- Displays parameters (image tag, region, domain)
- Preview of resources to be created/modified

#### **Terraform Apply Step**
- Shows real-time deployment progress
- Displays Terraform output messages
- Shows resource creation status

#### **Deployment Summary**
After successful deployment, you'll see a rich summary with:

| Resource | Value |
|----------|-------|
| **Dashboard URL** | Link to your deployed application |
| **ALB DNS** | Load balancer DNS name |
| **ECS Cluster** | ECS cluster name |
| **ECS Service** | ECS service name |
| **Image Tag** | Git commit SHA |
| **Region** | AWS region |
| **Deployed At** | Timestamp |

#### **Health Check Step**
- Shows health check attempts
- Displays final status (✅ Passed or ❌ Failed)
- Shows the health check URL

### Step 4: View Logs

Click on any step to see detailed logs:
- **Expand logs**: Click the step name
- **Download logs**: Click the three dots (⋯) → Download log
- **Search logs**: Use browser search (Cmd/Ctrl + F)

## Capturing Screenshots

### Method 1: Full Workflow Run Screenshot

**Best for**: Overview of entire deployment process

1. Navigate to: **Actions** → **CD** → Click on a workflow run
2. Wait for deployment to complete
3. Scroll to see all steps
4. Take a screenshot of:
   - The workflow run header (showing status, commit, branch)
   - All completed steps (green checkmarks)
   - The deployment summary section

**Screenshot Tips**:
- Use browser zoom (Cmd/Ctrl + 0) to fit more content
- Hide browser bookmarks bar for cleaner look
- Use full-screen mode if possible

### Method 2: Deployment Summary Screenshot

**Best for**: Showing deployment details in README

1. Navigate to: **Actions** → **CD** → Click on a workflow run
2. Scroll to the **"Deployment Summary"** step
3. Expand the step to see the full summary table
4. Take a screenshot of the summary section

**What to capture**:
- The "🎉 Deployment Complete!" header
- The deployment details table
- The quick links section

### Method 3: Step-by-Step Screenshots

**Best for**: Detailed documentation

Capture screenshots of:
1. **Terraform Plan** step (showing planned changes)
2. **Terraform Apply** step (showing deployment progress)
3. **Deployment Summary** step (showing final details)
4. **Health Check** step (showing validation)

### Method 4: Animated GIF (Advanced)

**Best for**: Showing deployment process dynamically

1. Use a screen recording tool (e.g., LICEcap, Kap, or QuickTime)
2. Record the workflow run from start to finish
3. Convert to GIF format
4. Upload to your repository's `images_gifs/` folder

**Recommended Tools**:
- **macOS**: QuickTime Player, Kap
- **Windows**: ScreenToGif, ShareX
- **Linux**: Peek, SimpleScreenRecorder

## Adding Screenshots to README

### Step 1: Create Images Folder

```bash
mkdir -p images_gifs
```

### Step 2: Save Screenshots

Save your screenshots with descriptive names:
- `github-actions-deployment.png`
- `deployment-summary.png`
- `workflow-run-overview.png`

### Step 3: Add to README

Add a new section in your README.md:

```markdown
## 🚀 CI/CD Pipeline

### Deployment Process

Our infrastructure is automatically deployed through GitHub Actions when code is pushed to the `main` branch.

![GitHub Actions Deployment](images_gifs/github-actions-deployment.png)

### Deployment Details

After each successful deployment, you can view detailed information in the GitHub Actions UI:

![Deployment Summary](images_gifs/deployment-summary.png)

**What you'll see:**
- ✅ Deployment status and timestamp
- 🔗 Dashboard URL and quick links
- 📊 Infrastructure details (ECS cluster, service, ALB)
- 🏥 Health check validation results

### View Live Deployments

Check the [Actions tab](https://github.com/YOUR_USERNAME/YOUR_REPO/actions) to see:
- Real-time deployment progress
- Terraform plan preview
- Deployment summaries
- Health check results
```

### Step 4: Optimize Images

Before committing, optimize your screenshots:

**Using ImageOptim (macOS)**:
```bash
# Install ImageOptim
brew install --cask imageoptim

# Optimize images
imageoptim images_gifs/*.png
```

**Using online tools**:
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)

**Recommended sizes**:
- Full workflow: 1200-1600px width
- Summary section: 800-1000px width
- Keep file size under 500KB

## Example README Section

Here's a complete example you can add to your README:

```markdown
## 🚀 Automated Deployment

This project uses GitHub Actions for automated CI/CD. Every push to `main` triggers:

1. **Build & Scan**: Docker image build with security scanning (Trivy, Checkov)
2. **Terraform Plan**: Preview infrastructure changes
3. **Manual Approval**: Production deployments require approval
4. **Terraform Apply**: Deploy infrastructure to AWS
5. **Health Check**: Validate deployment success

### View Deployment Details

![GitHub Actions Workflow](images_gifs/github-actions-workflow.png)

**Deployment Summary Example:**

![Deployment Summary](images_gifs/deployment-summary.png)

### Access Deployment Information

- **GitHub Actions**: [View all workflow runs](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
- **Deployment Status**: Check the Actions tab for real-time status
- **Deployment Logs**: Click any workflow run to see detailed logs

### Deployment Resources

After successful deployment, the workflow provides:

| Resource | Description |
|----------|-------------|
| Dashboard URL | Link to deployed application |
| ECS Cluster | AWS ECS cluster name |
| ECS Service | ECS service name |
| ALB DNS | Application Load Balancer DNS |
| Image Tag | Git commit SHA used for deployment |
```

## Troubleshooting

### Screenshot Not Showing in README

**Issue**: Image appears broken in README

**Solutions**:
1. Check file path is correct (relative to README.md)
2. Ensure image is committed to repository
3. Use absolute path: `https://raw.githubusercontent.com/USER/REPO/main/images_gifs/image.png`
4. Check file extension matches (.png, .jpg, etc.)

### Workflow Run Not Visible

**Issue**: Can't see workflow runs in Actions tab

**Solutions**:
1. Ensure workflows are committed to `.github/workflows/`
2. Check you're on the correct branch
3. Verify GitHub Actions is enabled in repository settings
4. Check repository permissions

### Deployment Summary Not Showing

**Issue**: Summary step is empty or missing

**Solutions**:
1. Check Terraform outputs are configured correctly
2. Verify `terraform-outputs` step completed successfully
3. Check workflow logs for errors
4. Ensure Terraform apply completed successfully

### Screenshot Quality Issues

**Issue**: Screenshots are blurry or too large

**Solutions**:
1. Use PNG format for screenshots (better quality)
2. Optimize images before committing
3. Use appropriate zoom level (100-150%)
4. Consider using SVG for diagrams instead

## Best Practices

1. **Update Screenshots Regularly**: Keep them current with latest UI
2. **Use Descriptive Names**: `deployment-summary-2024.png` > `img1.png`
3. **Optimize File Size**: Compress images before committing
4. **Add Alt Text**: Always include descriptive alt text in markdown
5. **Version Control**: Commit screenshots to git (don't ignore them)
6. **Document Changes**: Update screenshots when workflow changes

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Terraform GitHub Actions](https://github.com/hashicorp/setup-terraform)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/best-practices)

---

**Need Help?** Open an issue or check the [main README](../README.md) for more information.
