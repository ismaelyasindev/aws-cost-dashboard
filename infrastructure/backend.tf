terraform {
  backend "s3" {
    # Update bucket name to match your S3 bucket
    bucket         = "terraform-state-aws-cost-dashboard-ismael-yasin"
    key            = "aws-cost-dashboard/terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock-aws-cost-dashboard"
  }
}
