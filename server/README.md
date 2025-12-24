<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with MariaDB database integration.

## Database Setup

This project uses MariaDB as the database. Make sure you have MariaDB installed and running.

1. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

2. Update the database configuration in `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=verdict_db
PORT=3333
JWT_SECRET=your-secret-key-change-this-in-production
```

3. Create the database in MariaDB:
```sql
CREATE DATABASE verdict_db;
```

## Database Migrations

This project uses TypeORM migrations for database schema management.

### Available Migration Commands

```bash
# Generate a new migration based on entity changes
npm run migration:generate migrations/MigrationName

# Create an empty migration file
npm run migration:create migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Migration Workflow

1. Create or modify entities in `src/entities/`
2. Generate migration: `npm run migration:generate migrations/YourMigrationName`
3. Review the generated migration file in `migrations/`
4. Run migrations: `npm run migration:run`

**Note**: In development mode, `synchronize: true` is enabled, but migrations are recommended for production environments.

## Docker Setup

This project includes Docker configuration for local development with MariaDB.

### Prerequisites

- Docker and Docker Compose installed on your system

### Quick Start

1. Copy `.env.local.example` to `.env.local` and update the database credentials:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and set your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=verdict_db
PORT=3333
NODE_ENV=development
```

3. Build and start the containers:
```bash
# Production mode
docker-compose up -d

# Development mode (with hot reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

4. The server will be available at `http://localhost:3333`

**Note**: Docker Compose will automatically load environment variables from `.env.local` file.

### Docker Commands

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f server
docker-compose logs -f mariadb

# Stop services
docker-compose down

# Stop services and remove volumes (CAUTION: This will delete database data)
docker-compose down -v

# Rebuild containers
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Execute commands in the server container
docker-compose exec server npm run migration:run
```

### Database Connection in Docker

When running in Docker, the database host is `mariadb` (the service name in docker-compose.yml), not `localhost`. The `.env.local` file is automatically loaded by docker-compose, but the `DB_HOST` will be overridden to `mariadb` in the docker-compose.yml for the server container.

### Running Migrations in Docker

```bash
# Run migrations inside the container
docker-compose exec server npm run migration:run

# Generate migration (requires local node_modules)
# Recommended: run on host machine with database connection configured
```

## Project setup

```bash
$ npm install
```

## API Documentation (Swagger)

서버를 실행한 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

- Swagger UI: `http://localhost:3333/api`

Swagger 문서에는 다음 내용이 포함됩니다:
- 모든 API 엔드포인트 목록
- 요청/응답 스키마
- 인증 방법 (Bearer Token)
- API 테스트 기능

### 인증 사용 방법

1. `/auth/register` 엔드포인트로 회원가입
2. `/auth/login` 엔드포인트로 로그인하여 `access_token` 받기
3. Swagger UI 우측 상단의 "Authorize" 버튼 클릭
4. `Bearer {access_token}` 형식으로 토큰 입력
5. 보호된 엔드포인트 테스트 가능

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
