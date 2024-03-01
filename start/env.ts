/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_URL: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),

  DRIVER: Env.schema.enum(['blank', 'docker', 'fly'] as const),

  /**
   * Variables for configuring the OpenAI API
   */
  OPENAI_API_KEY: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring feature flags
  |----------------------------------------------------------
  */
  ALLOW_PUBLIC_SIGNUP: Env.schema.boolean(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the builder image
  |----------------------------------------------------------
  */
  REGISTRY_HOST: Env.schema.string(),
  REGISTRY_TOKEN: Env.schema.string.optional(),
  BUILDER_IMAGE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the Fly.io driver
  |----------------------------------------------------------
  */
  FLY_ORG: Env.schema.string.optional(),
  FLY_TOKEN: Env.schema.string.optional(),
  FLY_WEBHOOK_SECRET: Env.schema.string.optional(),
  FLY_DEV_MACHINE_PREFIX: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the Docker driver
  |----------------------------------------------------------
  */
  DOCKER_SOCKET_PATH: Env.schema.string.optional(),
  DOCKER_APPLICATION_NAME_PREFIX: Env.schema.string.optional(),
  DOCKER_BUILDER_NAME_PREFIX: Env.schema.string.optional(),
  DOCKER_DATABASE_NAME_PREFIX: Env.schema.string.optional(),
  TRAEFIK_WILDCARD_DOMAIN: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  GITHUB_CLIENT_ID: Env.schema.string.optional(),
  GITHUB_CLIENT_SECRET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  RESEND_API_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring Redis connection
  |----------------------------------------------------------
  */
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for Minio connection
  |----------------------------------------------------------
  */
  S3_ENDPOINT: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),
  S3_AVATAR_BUCKET: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_ACCESS_KEY: Env.schema.string(),
  S3_SECRET_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for GitHub-based deployments
  |----------------------------------------------------------
  */
  GITHUB_APP_ID: Env.schema.number.optional(),
  GITHUB_APP_PRIVATE_KEY: Env.schema.string.optional(),
  GITHUB_APP_WEBHOOK_SECRET: Env.schema.string.optional(),
})
