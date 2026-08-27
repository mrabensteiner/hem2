# Heuristic Evaluation Manager 2 (HEM2)
> A Modern Web Application to Support the Expert Review Process

Martin Rabensteiner

Master's Thesis, Graz University of Technology

[https://github.com/mrabensteiner/hem2](https://github.com/mrabensteiner/hem2)



## Software Installation

Install [Docker](https://www.docker.com/)

Clone the repository to a local folder:
```
git clone git@github.com:mrabensteiner/hem2.git
```

Install dependencies:
```
pnpm install
```


## Database Setup

Set up your database environment variables in the `.env` file.
When using the included docker file, the content of `.env.example` can be used.


Start Docker and initialise the HEM2 container either with the command:
```
pnpm docker
```

Generate database and model:
```
pnpm db:setup
```


Create sample data:
```
pnpm db:seed
```

When database changes in the development happen, the following command can reset
the database and make a new setup and seed:
```
pnpm db:dev
```




## Run Development Servers

If the HEM2 Docker container is not already running, start it either with
the Docker app, or using the command:
```
pnpm docker
```

Start both the API and UI servers:
```
pnpm dev
```

Then, open a web browser at [http://localhost:5173/](http://localhost:5173/)



Alternatively, start the docker container, the API server, and the UI
server all together with the single command:

```
pnpm dev:all
```

The API server and the UI server can also be started individually with
separate commands:
```
pnpm dev:api
pnpm dev:ui
```


## Example Users

Initially, a default admin user is created:  
Username: `admin`  
Password: `admin`

Some other users are created as well. by default, they have the
same password as their user name.



## Reset

Clear old data (during development only!):
```
pnpm  -filter hem2-api db:cleanup
```



## Contributors
- Martin Rabensteiner (Conception and Development as Master's Thesis)
- Keith Andrews (Supervisor)


## Acknowledgements
- Martin Loitz, who developed the [initial version of HEM](https://github.com/mloitzl/hem) in 2005



