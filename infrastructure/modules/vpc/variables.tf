variable "cidr_blockvpc" {
  description = "CIDR block for VPC"
  type        = string
}

variable "cidr_public_subnet_web" {
  description = "CIDR blocks for public subnets (ALB tier)"
  type        = list(string)
}

variable "cidr_private_subnet_app" {
  description = "CIDR blocks for private subnets (ECS tier)"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones to deploy to"
  type        = list(string)
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "AWS-Cost-Dashboard"
}


