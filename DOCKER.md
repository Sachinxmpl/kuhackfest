

### 1. Setup Environment Variables

```
cp .env.example .env
```

### 2. Build and Start All Services

```bash
docker-compose up -d --build 

// start 
docker compose up -d 
```

### 3. Run Database Migrations


```bash

docker-compose exec backend npm run db:migrate

```

### 4. Access the Applications

- **Frontend**: http://localhost:3000 (hot-reload enabled)
- **Backend API**: http://localhost:4000 (hot-reload enabled)
- **Database**: localhost:5432 (PostgreSQL)


### View Logs (Great for Debugging)

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down

docker-compose down -v
```

