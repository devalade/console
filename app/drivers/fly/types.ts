export type FlyLogEntry = {
  message: string
  timestamp: string
  fly: { app: { name: string; instance: string } }
}
