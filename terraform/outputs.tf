output "cluster_name" {
  value = module.eks.cluster_name
}

output "ecr_repository_urls" {
  value = { for name, repository in aws_ecr_repository.app : name => repository.repository_url }
}

output "database_secret_arn" {
  value = aws_secretsmanager_secret.database.arn
}

output "github_actions_role_arn" {
  value = try(aws_iam_role.github_actions[0].arn, null)
}
