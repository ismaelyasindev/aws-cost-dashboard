variable "ecr_url" {
  description = "ECR repository URL"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "ecs_tasks_sg_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "target_group_arn" {
  description = "ARN of ALB target group"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "AWS-Cost-Dashboard"
}

variable "cpu" {
  description = "CPU units for the task"
  type        = string
  default     = "512"
}

variable "memory" {
  description = "Memory for the task in MB"
  type        = string
  default     = "1024"
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 1
}


