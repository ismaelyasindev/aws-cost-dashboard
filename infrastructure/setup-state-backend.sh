#!/usr/bin/env bash
# One-time setup: create DynamoDB table for Terraform state locking.
# Run after creating the S3 state bucket (Step 1.2 in DEPLOYMENT.md).
# Usage: ./setup-state-backend.sh [region]

set -e
REGION="${1:-eu-west-2}"
TABLE_NAME="terraform-state-lock-aws-cost-dashboard"

echo "Creating DynamoDB table for state lock: $TABLE_NAME (region: $REGION)"
aws dynamodb create-table \
  --region "$REGION" \
  --table-name "$TABLE_NAME" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

echo "Waiting for table to be active..."
aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$REGION"
echo "Done. You can now run: cd persistent && terraform init"
