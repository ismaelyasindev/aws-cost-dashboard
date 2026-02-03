# Terraform Deployment Through GitHub Actions - Explained

## 🎯 Overview

This document explains **how Terraform infrastructure is deployed through GitHub Actions** and how you can view deployment details in the Actions section.

## 🔄 How It Works

### The Two-Workflow System

Your project uses **two GitHub Actions workflows** that work together:

#### 1. CI Workflow (`ci.yaml`)
**Triggers**: Every push to `main` branch

**What it does**:
- ✅ Checks out your code
- ✅ Builds Docker image
- ✅ Scans for vulnerabilities (Trivy)
- ✅ Scans Terraform code (Checkov)
- ✅ Pushes image to AWS ECR

**Output**: A Docker image tagged with your Git commit SHA

#### 2. CD Workflow (`cd.yaml`)
**Triggers**: Automatically after CI workflow succeeds

**What it does**:
1. **Terraform Plan** - Shows what will be deployed
2. **Manual Approval** - Requires approval (via GitHub Environment)
3. **Terraform Apply** - Actually deploys the infrastructure
4. **Health Check** - Verifies deployment worked

**Output**: Deployed infrastructure (VPC, ECS, ALB, etc.)

---

## 📍 Where to See Deployment Details

### Step-by-Step Guide

1. **Go to your GitHub repository**
2. **Click the "Actions" tab** (top navigation)
3. **Click "CD"** in the left sidebar (or "CI" for build details)
4. **Click on any workflow run** to see details

### What You'll See

#### In the Workflow Run Page:

**Header Section**:
- ✅ Status badge (green = success, red = failed)
- 📝 Commit message that triggered deployment
- 🌿 Branch name (usually `main`)
- ⏰ When it ran

**Steps Section**:
Each step shows:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow circle = In progress

**Key Steps to Look For**:

1. **Terraform Plan** 📋
   - Shows planned infrastructure changes
   - Displays parameters (image tag, region, domain)
   - Preview of what will be created/modified

2. **Terraform Apply** 🚀
   - Shows real-time deployment progress
   - Displays Terraform output messages
   - Shows resource creation status

3. **Deployment Summary** 🎉
   - **This is the most important section!**
   - Shows all deployment details in a nice table:
     - Dashboard URL
     - ALB DNS name
     - ECS Cluster name
     - ECS Service name
     - Image tag (Git commit SHA)
     - AWS region
     - Deployment timestamp
   - Includes quick links to dashboard and AWS console

4. **Health Check** 🏥
   - Shows health check attempts
   - Displays final status
   - Shows the health check URL

---

## 📸 Capturing Screenshots for README

### Quick Method (Recommended)

1. **After deployment completes**, navigate to:
   - Actions → CD → Latest workflow run

2. **Scroll to "Deployment Summary" step**

3. **Click to expand** the step

4. **Take a screenshot** of the summary table

5. **Save as**: `images_gifs/deployment-summary.png`

6. **Add to README**:
   ```markdown
   ![Deployment Summary](images_gifs/deployment-summary.png)
   ```

### What Makes a Good Screenshot

✅ **Good**:
- Shows the complete "Deployment Summary" section
- Includes the table with all details
- Clear and readable
- Optimized file size (< 500KB)

❌ **Avoid**:
- Blurry images
- Too much whitespace
- Cut-off text
- Very large file sizes

---

## 🔍 Understanding the Deployment Process

### What Happens Behind the Scenes

```
You push code to GitHub
         ↓
GitHub Actions CI workflow runs
         ↓
Docker image built and pushed to ECR
         ↓
CD workflow automatically starts
         ↓
Terraform Plan (preview changes)
         ↓
Manual Approval Required ⏸️
         ↓
You approve in GitHub Environments
         ↓
Terraform Apply (deploy infrastructure)
         ↓
Health Check (verify deployment)
         ↓
✅ Deployment Complete!
```

### Terraform Deployment Details

When Terraform runs, it:

1. **Initializes** - Connects to S3 backend for state
2. **Plans** - Calculates what needs to change
3. **Applies** - Creates/updates AWS resources:
   - VPC and subnets
   - Security groups
   - Application Load Balancer
   - ECS cluster and service
   - CloudWatch alarms
   - WAF rules
   - Route 53 DNS records

4. **Outputs** - Provides URLs and resource names

All of this is visible in the GitHub Actions UI!

---

## 📊 Deployment Summary Explained

The deployment summary shows:

| Field | What It Means |
|-------|---------------|
| **Dashboard URL** | The URL where your app is accessible |
| **ALB DNS** | Load balancer DNS name (AWS internal) |
| **ECS Cluster** | Name of your ECS cluster |
| **ECS Service** | Name of your ECS service |
| **Image Tag** | Git commit SHA used for this deployment |
| **Region** | AWS region where resources are deployed |
| **Deployed At** | Timestamp of deployment |

---

## 🎬 Example: Viewing a Real Deployment

1. **Navigate**: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

2. **Click**: "CD" workflow

3. **Click**: Latest workflow run (top of list)

4. **Scroll down** to see:
   - All steps with checkmarks ✅
   - Terraform plan output
   - Deployment summary table
   - Health check results

5. **Click any step** to see detailed logs

6. **Take screenshot** of the Deployment Summary step

---

## 🛠️ Troubleshooting

### Can't see workflow runs?
- Make sure workflows are in `.github/workflows/` folder
- Check you're on the correct branch
- Verify GitHub Actions is enabled in repo settings

### Deployment Summary is empty?
- Check Terraform outputs are configured
- Verify Terraform apply completed successfully
- Check workflow logs for errors

### Screenshot not showing in README?
- Verify file path is correct
- Ensure image is committed to repository
- Check file extension (.png, .jpg)

---

## 📚 Additional Resources

- **Detailed Guide**: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
- **Screenshot Guide**: [SCREENSHOT-GUIDE.md](SCREENSHOT-GUIDE.md)
- **GitHub Actions Docs**: https://docs.github.com/en/actions

---

## ✅ Quick Checklist

- [ ] Understand CI workflow builds images
- [ ] Understand CD workflow deploys infrastructure
- [ ] Know where to find Actions tab
- [ ] Know how to view workflow runs
- [ ] Know how to find Deployment Summary
- [ ] Know how to take screenshots
- [ ] Know how to add screenshots to README

**You're all set!** 🎉
