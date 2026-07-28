# Heuristic Evaluation Manager 2 (HEM2)
> A Modern Web Application to Support the Expert Review Process

Martin Rabensteiner

Master's Thesis, Graz University of Technology



## Database Initialisation

Set up your database environment variables in the `.env` file.
When using included the docker file, the content of `.env.example` can be used.

Start the docker container either with the Docker app or command line:
```
pnpm docker
```

Install dependencies
```
pnpm install
```

Generate database and model
```
pnpm db:setup
```


Create sample data
```
pnpm db:seed
```


## Run Development Servers

To start both API and UI

```
pnpm dev
```

Open [http://localhost:5173/](http://localhost:5173/)

Alternative commands - start API and UI togehter with docker, or each separately;

```
pnpm dev:all
pnpm dev:api
pnpm dev:ui
```

## Example User
Adminstrator - Username: `admin`, Password: `admin`


## Reset

Clear old data (development only!)

```
pnpm  -filter hem2-api db:cleanup
```
