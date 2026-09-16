variable "project_name" {
  description = "Short name used as a prefix for AWS resources."
  type        = string
  default     = "bookingkg"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "eks_cluster_version" {
  description = "Amazon EKS Kubernetes minor version. Verify current AWS standard support before every lab run."
  type        = string
  default     = "1.35"
}

variable "vpc_cidr" {
  description = "CIDR block allocated to the VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "db_name" {
  description = "Initial PostgreSQL database name."
  type        = string
  default     = "bookingkg"
}

variable "db_username" {
  description = "PostgreSQL administrator username."
  type        = string
  default     = "bookingkg_admin"
}

variable "github_repository" {
  description = "GitHub repository in owner/name format. Empty disables the Actions OIDC role."
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "Branch allowed to assume the GitHub Actions role."
  type        = string
  default     = "main"
}
