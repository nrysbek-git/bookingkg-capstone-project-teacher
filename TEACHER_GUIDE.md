# Teacher Guide — BookingKG Capstone

## Назначение

Это итоговый практический проект второго семестра программы Training of Trainers
«DevOps с нуля до production». Он проверяет способность студента связать
application layer, containers, cloud infrastructure, Kubernetes и CI/CD в одну
воспроизводимую систему.

Студент получает только repository `bookingkg-capstone-starter`. Этот repository
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
7. Создать пользователя и сохранить assessment result в RDS.
8. Удалить Pod и проверить самовосстановление.
9. Проверить rollout/rollback и GitHub Actions через OIDC.
10. Попросить студента объяснить полный request и secret flow.

## После защиты

Зафиксируйте баллы и feedback до cleanup. Затем убедитесь, что дорогостоящие AWS
resources удалены. Не требуйте удаления общего course infrastructure или remote
state до подтверждения преподавателя.

