# BookingKG — Teacher Reference

BookingKG is a travel-booking application and a complete DevOps capstone using
React, Node.js, PostgreSQL, Docker, Kubernetes, Terraform, AWS and GitHub Actions.

The application includes authentication, destination search, favorites,
availability checks, optional services, promotional discounts, bookings,
cancellation and printable vouchers.

## Local start

```bash
docker compose up --build -d
curl http://localhost:8080/api/health
```

Open <http://localhost:8080>.

The AWS track provisions VPC, EKS, ECR, private RDS and Secrets Manager with
Terraform. GitHub Actions uses OIDC to publish images and deploy Kubernetes
workloads. See [ASSIGNMENT.md](ASSIGNMENT.md) for the complete requirements.
