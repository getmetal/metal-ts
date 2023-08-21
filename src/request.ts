interface ServerResponse {
  data?: any
  message?: string
}

class FetchError extends Error {
  response: Response
  status: number
  serverMessage?: string

  constructor(message: string, response: Response, status: number, serverMessage?: string) {
    super(message)
    this.name = 'FetchError'
    this.response = response
    this.status = status
    this.serverMessage = serverMessage
  }
}

export async function request(url: string, options: RequestInit): Promise<any> {
  const response: Response = await fetch(url, options)
  const data: ServerResponse = await response.json()

  if (!response.ok) {
    const errMsg = `Error status code: ${response.status}. ${data.message ?? ''}`.trim()
    const err = new FetchError(errMsg, response, response.status, data.message)
    throw err
  }

  return data?.data ?? data
}
