# Numed Monorepo

Projeto de microservicos para saude e bem-estar, organizado como monorepo com servicos NestJS independentes, bancos separados por contexto e comunicacao assincrona via RabbitMQ.

Cada micro-servico possui:

- API HTTP com prefixo global `/v1`
- Documentacao Swagger em `/docs`
- Banco PostgreSQL proprio
- Integracao por eventos para manter projecoes locais entre contextos
- Autenticacao JWT e autorizacao por permissoes

## Micro-servicos

| Servico | Porta | Banco | Responsabilidade |
| --- | --- | --- | --- |
| `user-auth` | `4005` | `numed_user_auth` | Usuarios, login, JWT e permissoes |
| `numed-health` | `4008` | `numed_health` | Medicamentos, consumo e vinculos cuidador-dependente |
| `reminders` | `4009` | `numed_reminders` | Lembretes e consultas medicas |

## Relacao entre os servicos

| Servico | Publica | Consome |
| --- | --- | --- |
| `user-auth` | `user.created/updated/deleted` | — |
| `numed-health` | `medicine.created/updated/deleted`, `medicine-consumption.upserted` | `user.created/updated/deleted` |
| `reminders` | `appointment.created/updated/deleted`, `reminder.created/updated/deleted` | `user.created/updated/deleted`, `medicine-consumption.upserted` |

Quando o consumo de um medicamento e configurado no `numed-health`, o `reminders` cria automaticamente lembretes para cada horario definido.

## Pre-requisitos

- Node.js com `npm`
- Docker e Docker Compose

## Como rodar

### Infraestrutura

```bash
docker compose up -d postgres rabbitmq
```

### Servicos (cada um em um terminal)

```bash
npm run start:user-auth      # porta 4005
npm run start:numed-health   # porta 4008
npm run start:reminders      # porta 4009
```

Na primeira execucao, rode as migrations:

```bash
npm run db:migrate --prefix services/user-auth
npm run db:migrate --prefix services/numed-health
npm run db:migrate --prefix services/reminders
```

## Variaveis de ambiente

Cada servico tem um `.env` na sua pasta. Exemplo:

```env
PORT=4008
JWT_SECRET=super-secret
DATABASE_URL=postgres://postgres:postgres@localhost:5433/numed_health
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

O `JWT_SECRET` deve ser o mesmo em todos os servicos.

## Ferramentas

| Ferramenta | URL | Credenciais |
| --- | --- | --- |
| Swagger user-auth | http://localhost:4005/docs | — |
| Swagger numed-health | http://localhost:4008/docs | — |
| Swagger reminders | http://localhost:4009/docs | — |
| Adminer (banco) | http://localhost:8080 | postgres / postgres |
| RabbitMQ Management | http://localhost:15672 | admin / admin |

No Adminer use servidor `postgres` e escolha entre `numed_user_auth`, `numed_health` ou `numed_reminders`.

## Autenticacao

1. Crie um usuario em `POST /v1/users` no user-auth
2. Faca login em `POST /v1/auth/login`
3. Use o token JWT como `Bearer Token` nos demais servicos

## Permissoes disponiveis

| Permissao | Descricao |
| --- | --- |
| `users:read/write/delete` | Gerenciar usuarios |
| `medicines:read/write/delete` | Gerenciar medicamentos |
| `caregiver-dependents:read/write/delete` | Gerenciar vinculos cuidador-dependente |
| `appointments:read/write/delete` | Gerenciar consultas |
| `reminders:read/write/delete` | Gerenciar lembretes |

## Fluxo de teste sugerido

1. Criar usuario no `user-auth`
2. Fazer login e pegar o JWT
3. Criar medicamento no `numed-health`
4. Configurar consumo com horarios — lembretes sao criados automaticamente no `reminders`
5. Consultar lembretes no `reminders`
