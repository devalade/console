export default class FlyApiCaller {
  private static readonly REST_BASE_URL = 'https://api.machines.dev/v1'
  private static readonly GRAPHQL_BASE_URL = 'https://api.fly.io/graphql'

  constructor(private readonly token: string) {}

  public async callGraphQLApi(input?: any) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.token}`)
    headers.append('Content-Type', 'application/json')

    const body = input ? JSON.stringify(input) : undefined
    const response = await fetch(FlyApiCaller.GRAPHQL_BASE_URL, {
      headers,
      method: 'POST',
      body,
    })

    const text = await response.text()
    if (!response.ok) {
      throw new Error(`${response.status}: ${text}`)
    }
    const { data, errors } = JSON.parse(text)
    if (errors) {
      throw new Error(JSON.stringify(errors))
    }

    return data
  }

  public async callRestApi(
    method: string,
    path: string,
    input?: any,
    noResponseData: boolean = false,
    baseUrl: string = FlyApiCaller.REST_BASE_URL
  ): Promise<any> {
    try {
      const headers = new Headers()
      headers.append('Authorization', `Bearer ${this.token}`)

      const body = input ? JSON.stringify(input) : undefined
      const url = `${baseUrl}${path}`
      const response = await fetch(url, {
        headers,
        method,
        body,
      })
      if (!response.ok) {
        const text = await response.text()
        console.error('[ApiCaller]', text)
        return
      }
      if (noResponseData) {
        return
      }

      const responseData = await response.json()

      return responseData
    } catch (error) {
      console.error('[ApiCaller]', error)
    }
  }
}
