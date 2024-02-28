[![](/banner.jpg)]()

# [WIP] Software Citadel - Console

> An open-source collaborative cloud platform for development teams.

[![](https://dcbadge.vercel.app/api/server/DPrfmDttMb)](https://discord.gg/DPrfmDttMb)

## About

Software Citadel Console consists in :

- a PaaS (Platform as a Service) that allows developers to deploy their applications and databases in a cloud environment, supporting multiple drivers, such as Docker, Fly.io, and more to come;
- a development teams platform, that allows developers to plan tasks, chat, and share code.

## Why

Today, developers have to juggle between tons of different services to get their work done. They have to use GitHub for code hosting, Slack for communication, Trello for task management, and more. We believe that it's time to bring all these services together in a single platform, to make it easier for developers to get their work done.

## Stack

- [AdonisJS](https://adonisjs.com/) - A fully-featured Node.js framework
- [React](https://react.dev/) - The library for web and native user interfaces
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - A collection of TailwindCSS components
- [Inertia.js](https://inertiajs.com/) - A glue that connects AdonisJS and React
- [Docker](https://www.docker.com/) - A containerization platform
- [Traefik](https://traefik.io/) - A reverse proxy and load balancer
- [PostgreSQL](https://www.postgresql.org/) - A relational database management system
- [Redis](https://redis.io/) - An in-memory data structure store
- [Resend](https://resend.com) - A transactional email service
- [Gitea](https://gitea.io/) - A self-hosted Git service, used in the Console for code hosting

## Development Setup

### Docker

#### Requirements

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [npm](https://www.npmjs.com/) - Node.js package manager
- [Docker](https://www.docker.com/) - A containerization platform

#### Installation

```bash
# Clone the repository
git clone https://github.com/SoftwareCitadel/console.git
cd console

# Install dependencies
npm install

# Create a .env file
node ace install

# Run the migrations
node ace migration:run

# Start development containers (as defined in zarf/dev/docker-compose.yml)
# and the development server.
npm run dev
```

#### Set up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/apps) and create some new OAuth/regular app.

2. Fill in the form with the following values :

- Application name : `Software Citadel Console`
- Homepage URL : `http://127.0.0.1:3333`
- Callback URL : `http://127.0.0.1:3333/auth/github/callback`

3. Once the app is created, you will be able to see the `Client ID` and `Client Secret`. Add them to the `.env` file :

```env
GITHUB_CLIENT_ID=<your_client_id>
GITHUB_CLIENT_SECRET=<your_client_secret>
```

You now should be able to log in with GitHub.

Please remember to use `http://127.0.0.1:3333` as your development URL, instead of `http://localhost:3333`.

### Fly.io Setup

#### Requirements

- [Fly.io](https://fly.io/) - A Fly.io account with a registered billing card
- [Flyctl](https://fly.io/docs/getting-started/installing-flyctl/) - The Fly.io CLI

#### Set up the logs shipper

```bash
# Set up Smee.io, to deliver webhooks to your local development environment
npm install -g smee-client
smee --target http://127.0.0.1:3333/fly/webhooks/logs --url https://smee.io/<your_smee_id>

# Create a new directory for the logs shipper
mkdir logshippper
cd logshippper

# Don't deploy just yet. We need to set up the secrets first.
fly launch --image ghcr.io/superfly/fly-log-shipper:latest --no-deploy

# Let's set up the secrets
fly secrets set ORG=personal # Replace with something else if you're using some organization
fly secrets set HTTP_URL=https://smee.io/<your_smee_id>
fly secrets set HTTP_TOKEN=<replace_this_with_your_http_bearer>

# Now, you can deploy the logs shipper
fly deploy
```

## Production Setup

### Fly.io

#### Requirements

- [Fly.io](https://fly.io/) - A Fly.io account with a registered billing card
- [Flyctl](https://fly.io/docs/getting-started/installing-flyctl/) - The Fly.io CLI

#### Launch the application


#### Set up the PostgreSQL database

```bash
fly postgres create
```

Now, you can set the environment variables : DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE.

#### Set up the Redis database

```bash
fly redis create
```

Now, you can set the environment variables : REDIS_HOST, REDIS_PORT, REDIS_PASSWORD.

#### Set up the storage bucket

```bash
fly storage create
```

Now, you can set the environment variables : S3_ENDPOINT, S3_BUCKET, S3_AVATAR_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY.

#### Set up the logs shipper

```bash
# Create a new directory for the logs shipper
mkdir logshippper
cd logshippper

# Don't deploy just yet. We need to set up the secrets first.
fly launch --image ghcr.io/superfly/fly-log-shipper:latest

# Let's set up the secrets
fly secrets set ORG=personal # Replace with something else if you're using some organization
fly secrets set HTTP_URL=https://console.<your_domain>/fly/webhooks/logs
fly secrets set HTTP_TOKEN=<replace_this_with_your_http_bearer>
fly secrets set ACCESS_TOKEN=<replace_this_with_your_access_token>

# Now, you can deploy the logs shipper
fly deploy
```

#### Deploy the application

```bash
# Deploy the application
fly deploy
```


## FAQ

### How to contribute?

The best way to contribute is to solve one of the [issues](https://github.com/softwarecitadel/console/issues) marked with the `open for external contributions` tag. And please comment on the issue to let us know that you're working on it.

To get started, you can fork the repository, create a new branch, and start working on the issue. Once you're done, you can create a pull request.

For more information, you can contact us on the [Discord server](https://discord.gg/DPrfmDttMb) or through this [contact form](https://softwarecitadel.com/contact).

If you want to contribute with a new feature, please open an issue first, so we can discuss it.

### What if I want to use it with some not-supported orchestration driver?

You can create a new driver by copy/pasting the blank driver like such :

```bash
cp -r app/drivers/blank app/drivers/<your_driver>
```

Then, you can iterate on the driver to make it work with your orchestration platform.

For example, you might have to have to add some environment variables to the `.env` file, and validating them in the `start/env.ts` file, etc.

If you need some help, feel free to [contact us](https://softwarecitadel.com/contact).

## License

This project is open-source and available under the [MIT License](https://github.com/SoftwareCitadel/console/blob/main/LICENSE).
