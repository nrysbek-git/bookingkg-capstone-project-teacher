# Teacher Guide — BookingKG Capstone

## Назначение

Это итоговый практический проект второго семестра программы Training of Trainers
«DevOps с нуля до production». Он проверяет способность студента связать
application layer, containers, cloud infrastructure, Kubernetes и CI/CD в одну
воспроизводимую систему.

Студент получает только repository `bookingkg-capstone-project-starter`. Этот repository
с эталонной инфраструктурой студентам не выдаётся.

## Рекомендуемый формат

- индивидуально: 2 недели, 25–40 часов;
- команда из двух студентов: 7–10 дней с индивидуальной защитой вклада;
- checkpoint 1: Docker и localhost;
- checkpoint 2: Terraform и AWS;
- checkpoint 3: Kubernetes и CI/CD;
- финальная live-защита: 20–30 минут.

## Что подготовить преподавателю

- AWS sandbox, quotas, region и budget policy;
- GitHub repositories или template repository;
- решение: индивидуальный или общий EKS cluster;
- student subdomains, только если DNS/TLS включены;
- deadline, правила использования AI и формат evidence;
- окно проверки и обязательный cleanup deadline.

Студент не должен покупать domain или использовать личную банковскую карту.

Reference Terraform использует `AdministratorAccess` только в отдельном
одноразовом учебном AWS sandbox. Это не является least privilege. В общем или
production account преподаватель обязан выдать отдельные ограниченные роли для
Terraform и application deployment либо исключить cloud apply из задания.

## Границы помощи

Можно объяснять концепции, помогать читать events/logs и задавать диагностические
вопросы. Не следует выдавать готовые Terraform, Kubernetes или workflow files из
эталонного решения. Подсказка должна учить процессу диагностики.

## Чек-лист защиты

1. Проверить repository, branches, commits и отсутствие secrets.
2. Открыть localhost application через Docker Compose.
3. Проверить Terraform backend, plan и основные AWS resources.
4. Сопоставить ECR image tag с Git SHA.
5. Проверить replicas, probes, services и ingress.
6. Открыть AWS Load Balancer URL; domain/HTTPS — если применимо.
7. Зарегистрировать пользователя и сохранить бронирование в RDS.
8. Удалить Pod и проверить самовосстановление.
9. Проверить rollout/rollback и GitHub Actions через OIDC.
10. Попросить студента объяснить полный request и secret flow.

## После защиты

Зафиксируйте баллы и feedback до cleanup. Затем убедитесь, что дорогостоящие AWS
resources удалены. Не требуйте удаления общего course infrastructure или remote
state до подтверждения преподавателя.

## Проверка публичного входа

Reference solution устанавливает ingress-nginx Helm chart версии `4.15.1`.
Frontend и backend остаются внутренними `ClusterIP` Services. После появления
external address у Service `ingress-nginx-controller` примените
`kubernetes/ingress.yml` и проверьте через один адрес главную страницу и
`/api/health`. Перед занятием сверяйте совместимость закреплённой версии chart с
выбранной версией Kubernetes.
