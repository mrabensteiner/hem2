# Heuristic Evaluation Manager 2 (HEM2)
> A Modern Web Application to Support the Expert Review Process

Martin Rabensteiner

Master's Thesis, Graz University of Technology

## Run Development Servers

Each in one terminal

`docker compose up`

`cd api; pnpm install; pnpm dev`

`cd ui; pnpm install; pnpm dev`

Open [http://localhost:5173/](http://localhost:5173/)


## Database initialisation

Setup environment variable (.env)

```
echo 'POSTGRES_USER="admin"
POSTGRES_PASSWORD="hem2admin"
POSTGRES_DB="hem2_db"

DATABASE_URL="postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@localhost:5432/$(hem2_db)?schema=public"
' > .env
```


Generate database and model

```
cd api
pnpm prisma migrate dev --name init
pnpm prisma generate
```


Create sample data

`pnpm prisma db seed`



## Reset

Clear old data (development only!)

`pnpm prisma migrate reset -f`
