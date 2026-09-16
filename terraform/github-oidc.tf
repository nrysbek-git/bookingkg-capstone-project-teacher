data "tls_certificate" "github" {
  count = var.github_repository == "" ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.github_repository == "" ? 0 : 1

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github[0].certificates[0].sha1_fingerprint]
}

resource "aws_iam_role" "github_actions" {
  count = var.github_repository == "" ? 0 : 1
  name  = "${local.name}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github[0].arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = [
            "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}",
            "repo:${var.github_repository}:pull_request"
          ]
        }
      }
    }]
  })
}

# EDUCATIONAL SANDBOX ONLY: AdministratorAccess is intentionally retained so a
# short-lived, isolated student account can create and destroy the complete lab.
# This is NOT least privilege and must not be used in a shared or production
# account. Production implementations must separate the Terraform role from the
# application deploy role and scope both roles to project-specific resources.
resource "aws_iam_role_policy_attachment" "github_actions" {
  count      = var.github_repository == "" ? 0 : 1
  role       = aws_iam_role.github_actions[0].name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
