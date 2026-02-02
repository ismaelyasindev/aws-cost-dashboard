variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "alb_sg_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "public_subnet_ids" {
  description = "Map of public subnet IDs for ALB"
  type        = map(string)
}

variable "certificate_arn" {
  description = "ARN of ACM certificate"
  type        = string
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "alt_domain" {
  description = "Alternative domain name (subdomain)"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "AWS-Cost-Dashboard"
}


