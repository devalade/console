export default interface IDriver {
  initializeDriver(): void | Promise<void>

  igniteApplication(config: {
    name: string
    image: string
    environmentVariables: Record<string, string>
    ports: Record<string, number>
  }): void | Promise<void>
}
