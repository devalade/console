export type Deployment = {
  id: number
  origin: 'cli' | 'github'
  status: DeploymentStatus
  createdAt: Date
  updatedAt: Date
}

export enum DeploymentStatus {
  Building = 'building',
  BuildFailed = 'build-failed',
  Deploying = 'deploying',
  DeploymentFailed = 'deployment-failed',
  Stopped = 'stopped',
  Success = 'success',
}
