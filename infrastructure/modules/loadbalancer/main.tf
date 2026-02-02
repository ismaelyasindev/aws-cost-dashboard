terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

resource "aws_lb" "main" {
  #checkov:skip=CKV_AWS_150:Deletion protection disabled to allow ephemeral layer teardown
  name                       = "${lower(replace(var.project_name, "_", "-"))}-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [var.alb_sg_id]
  subnets                    = values(var.public_subnet_ids)
  idle_timeout               = 300
  drop_invalid_header_fields = true

  tags = {
    Name = "${var.project_name}-alb"
  }
}

resource "aws_lb_target_group" "main" {
  name                 = "${lower(replace(var.project_name, "_", "-"))}-tg"
  target_type          = "ip"
  port                 = 3001
  protocol             = "HTTP"
  vpc_id               = var.vpc_id
  deregistration_delay = 300

  health_check {
    enabled             = true
    interval            = 30
    timeout             = 5
    matcher             = "200"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = {
    Name = "${var.project_name}-target-group"
  }
}

# HTTP listener redirects to HTTPS
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
      host        = "#{host}"
      path        = "/#{path}"
      query       = "#{query}"
    }
  }
}

# HTTPS listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# Redirect root domain to subdomain
resource "aws_lb_listener_rule" "redirect_root" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 1

  action {
    type = "redirect"

    redirect {
      host        = var.alt_domain
      path        = "/#{path}"
      query       = "#{query}"
      port        = "#{port}"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    host_header {
      values = [var.domain_name]
    }
  }
}


