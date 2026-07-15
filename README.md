# Heuristic Evaluation Manager 2 (HEM2)
> A Modern Web Application to Support the Expert Review Process

Martin Rabensteiner

Master's Thesis, Graz University of Technology



## Database initialisation

Setup environment variable (.env)

```
echo 'POSTGRES_USER="admin"
POSTGRES_PASSWORD="hem2admin"
POSTGRES_DB="hem2_db"

DATABASE_URL="postgresql://admin:hem2admin@localhost:5432/hem2_db?schema=public"
' > .env
```

Install dependencies
```
cd api; pnpm install; cd ..
cd ui; pnpm install; cd ..
```

Generate database and model

```
docker compose up -d
cd api
pnpm prisma migrate dev --name init
pnpm prisma generate
```


Create sample data

```
pnpm prisma db seed
```

Stop the docker server (optional)
```
docker stop hem2_postgres_db
```


## Run Development Servers

Each in one terminal

```
docker compose up
```
```
cd api; pnpm dev
```
```
cd ui; pnpm dev
```

Open [http://localhost:5173/](http://localhost:5173/)


## Reset

Clear old data (development only!)

```
pnpm prisma migrate reset -f
```
