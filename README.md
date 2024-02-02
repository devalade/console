# [WIP] Software Citadel - Console

> An open-source cloud platform for developers.

## About

Software Citadel Console consists in a PaaS (Platform as a Service) that allows developers to deploy their applications and databases in a cloud environment, supporting multiple drivers, such as Docker and Fly.io.

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

## Development Setup

### Requirements

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [npm](https://www.npmjs.com/) - Node.js package manager
- [Docker](https://www.docker.com/) - A containerization platform

### Installation

```bash
# Clone the repository
git clone https://github.com/software-citadel/console.git
cd console

# Install dependencies
npm install

# Create a .env file
node ace install

# Start the development server
npm run dev
```
