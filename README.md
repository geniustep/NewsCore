# NewsCore - Professional News CMS Backend

A scalable, modern News Content Management System backend built with NestJS, Prisma, and TypeScript.

## 🚀 Features

- **Multi-language Support**: Built-in support for Arabic, English, and French
- **Advanced RBAC**: Role-Based Access Control with fine-grained permissions
- **Content Ingestion**: RSS, API, and web scraping capabilities
- **AI Integration**: Content summarization, translation, and classification
- **Analytics**: Real-time analytics and trending content detection
- **Media Management**: S3-compatible storage with image processing
- **Search**: Full-text search with Meilisearch
- **Queue System**: BullMQ for background job processing
- **Caching**: Redis for high-performance caching
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation

## 🏗️ Tech Stack

- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **Cache**: Redis 7.x (ioredis)
- **Queue**: BullMQ
- **Search**: Meilisearch
- **Storage**: S3-compatible (MinIO/DigitalOcean Spaces)
- **Auth**: JWT + Refresh Tokens + Passport.js
- **Testing**: Jest + Supertest
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NewsCore
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start infrastructure services:
```bash
npm run docker:dev
```

5. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. (Optional) Seed the database:
```bash
npm run prisma:seed
```

7. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

## 🐳 Docker Commands

```bash
# Start all services (development)
npm run docker:dev

# Stop all services
npm run docker:dev:down

# Start all services (production)
npm run docker:up

# Stop all services
npm run docker:down
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:deploy

# Seed the database
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📦 Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
NewsCore/
├── prisma/
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts              # Database seed script
├── src/
│   ├── common/              # Shared utilities, decorators, guards
│   ├── config/              # Configuration files
│   ├── database/            # Database service
│   ├── health/              # Health check module
│   ├── modules/             # Feature modules (to be added)
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── docker-compose.yml       # Production Docker Compose
├── docker-compose.dev.yml   # Development Docker Compose
└── package.json
```

## 🔒 Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Helmet for HTTP headers security
- CORS configuration
- Input validation with class-validator
- SQL injection prevention via Prisma
- Rate limiting

## 🌍 Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`, `REDIS_PORT`: Redis configuration
- `JWT_SECRET`: Secret for JWT tokens
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: S3 storage configuration
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`: AI provider keys

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📧 Support

For support, email support@newscore.com or create an issue in the repository.
