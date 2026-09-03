# Reference Solution Guide

Этот repository демонстрирует один допустимый вариант решения, а не единственно
правильную архитектуру.

## Реализовано

- multi-container localhost environment через Docker Compose;
- frontend image с React build и Nginx;
- backend image для Node.js/Express API;
- PostgreSQL initialization;
- Terraform для VPC, ECR, EKS, RDS, Secrets Manager и GitHub OIDC;
- Kubernetes manifests для namespace, frontend, backend и database init job;
- GitHub Actions для инфраструктуры и application deployment.

Подробности infrastructure находятся в [INFRASTRUCTURE.md](INFRASTRUCTURE.md),
а пользовательская инструкция — в [README.md](README.md).

## Важные замечания

- Helm не обязателен и собственный application chart отсутствует;
- NGINX Ingress, ExternalDNS и cert-manager могут быть добавлены manifests или
  Helm в зависимости от варианта курса;
- custom domain и HTTPS выполняются только при предоставленном course subdomain
  либо как bonus;
- teacher solution нельзя копировать в student starter.

## Допустимые альтернативы студента

При сохранении acceptance criteria разрешены другая структура Terraform,
Kustomize, Helm, AWS Load Balancer Controller, иной безопасный secrets mechanism
и согласованный GCP track. Оценивается результат, воспроизводимость, безопасность
и понимание решений, а не посимвольное совпадение с reference implementation.

