# Quick Screenshot Guide for GitHub Actions

This is a quick reference for capturing deployment screenshots for your README.

## 🎯 What to Screenshot

### Option 1: Full Workflow Overview (Recommended)
**Location**: Actions → CD → Click on a completed workflow run

**What to capture**:
- ✅ Workflow header (showing status, commit message, branch)
- ✅ All completed steps with green checkmarks
- ✅ The entire workflow run page

**Best for**: Showing the complete deployment process

---

### Option 2: Deployment Summary Section (Most Useful)
**Location**: Actions → CD → Workflow run → "Deployment Summary" step

**What to capture**:
- 🎉 "Deployment Complete!" header
- 📊 Deployment details table (Dashboard URL, ECS info, etc.)
- 🔗 Quick links section

**Best for**: README documentation (most informative)

---

### Option 3: Step-by-Step Screenshots
Capture these individual steps:

1. **Terraform Plan** - Shows planned changes
2. **Terraform Apply** - Shows deployment progress  
3. **Deployment Summary** - Shows final details
4. **Health Check** - Shows validation results

**Best for**: Detailed documentation

---

## 📸 How to Take Screenshots

### macOS
1. **Full screen**: `Cmd + Shift + 3`
2. **Selected area**: `Cmd + Shift + 4` (then drag to select)
3. **Window**: `Cmd + Shift + 4` then press `Space` and click window

### Windows
1. **Full screen**: `Windows + Print Screen`
2. **Selected area**: `Windows + Shift + S` (Snipping Tool)
3. **Window**: `Alt + Print Screen`

### Linux
1. **Full screen**: `Print Screen`
2. **Selected area**: Use `gnome-screenshot` or `scrot`
3. **Window**: `Alt + Print Screen`

---

## 📁 Where to Save

1. Create folder: `images_gifs/` (if it doesn't exist)
2. Save with descriptive names:
   - `github-actions-deployment.png`
   - `deployment-summary.png`
   - `workflow-overview.png`

---

## 📝 How to Add to README

Add this section to your README.md:

```markdown
## 🚀 CI/CD Deployment

### Automated Infrastructure Deployment

Our infrastructure is automatically deployed via GitHub Actions:

![GitHub Actions Deployment](images_gifs/github-actions-deployment.png)

### Deployment Details

After each deployment, view detailed information in GitHub Actions:

![Deployment Summary](images_gifs/deployment-summary.png)

**View live deployments**: [Actions Tab](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
```

---

## ✨ Pro Tips

1. **Wait for completion**: Take screenshots after workflow completes (all green ✅)
2. **Zoom level**: Use 100-125% zoom for best quality
3. **Hide clutter**: Hide browser bookmarks/toolbars
4. **Optimize**: Compress images before committing (use TinyPNG or ImageOptim)
5. **Update regularly**: Keep screenshots current with latest UI

---

## 🔍 Finding the Right Workflow Run

1. Go to **Actions** tab
2. Click **"CD"** in the left sidebar
3. Find a **successful** run (green checkmark ✅)
4. Click on it to see details
5. Scroll to find the **"Deployment Summary"** step

---

## 📐 Recommended Sizes

- **Full workflow**: 1200-1600px width
- **Summary section**: 800-1000px width  
- **File size**: Keep under 500KB (optimize if larger)

---

## 🎨 Example Screenshot Locations

```
GitHub Repository
└── Actions Tab
    └── CD Workflow
        └── [Select a workflow run]
            ├── ✅ Checkout code
            ├── ✅ Configure AWS credentials
            ├── ✅ Setup Terraform
            ├── ✅ Terraform Init
            ├── ✅ Terraform Plan ← Screenshot here
            ├── ✅ Terraform Apply ← Screenshot here
            ├── ✅ Get Terraform Outputs
            ├── ✅ Health Check ← Screenshot here
            └── ✅ Deployment Summary ← BEST SCREENSHOT HERE
```

---

## 🚀 Quick Start

1. **Deploy**: Push code to trigger deployment
2. **Wait**: Wait for workflow to complete
3. **Navigate**: Go to Actions → CD → Latest run
4. **Screenshot**: Capture "Deployment Summary" step
5. **Save**: Save to `images_gifs/deployment-summary.png`
6. **Add**: Add markdown image link to README

**Done!** 🎉

---

For more detailed information, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
