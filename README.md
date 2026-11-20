# Heuristic Evaluation Manager 2 (HEM2)
> A Modern Web Application to Support the Expert Review Process

Martin Rabensteiner

Master's Thesis, Graz University of Technology

[https://github.com/mrabensteiner/hem2](https://github.com/mrabensteiner/hem2)



## Software Installation

Prerequisites: Install [Docker](https://www.docker.com/) and [PNPM](https://pnpm.io/installation)

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


Start Docker and initialise the HEM2 container either with
the Docker app, or using the command:
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

The default users are:

* Administrator - Username: `admin` Password: `admin`
* Manager - Username: `manager` Password: `manager`
* Reviewer - Username: `reviewer` Password: `reviewer`


## Open Ports for other Devices (Development)

To use the tool on other devices in the local network, the IP address and the port needs to be changed in the `.env` file.
Within the `VITE_API_URL` and `VITE_UI_URL` variables, `localhost` needs to be replaced with the local IP e.g. `192.168.1.1`.
Further, the `--host` flag needs to be added to the PNPM command, e.g. `pnpm dev --host` to start the UI in the local network mode,
and both ports (per default `3000` for the API and `5173` for the UI) need to be enabled by the firewall.


## GitHub and GitLab Linkage

Issues of a project can be exported to GitHub and GitLab within the Export settings.
The host (only for GitLab), owner (organisation or user), repository ID and a personal 
access token needs to be set for each project individually. Cf. a repository link is normally
compound from `https://host/owner/repositoryID`, e.g. `https://github.com/mrabensteiner/HEM2`.
The find-grained personal access token (PAT) can be generated at https://github.com/settings/personal-access-tokens, resp.
https://gitlab.com/-/user_settings/personal_access_tokens, or in your personal instance with
similar link. When setting the PAT, it is important to set the rights for `Issues` to `Read and Write` (GitHub),
resp. `Work Item` to `Update` (GitLab).


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



