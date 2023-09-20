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

  let data: ServerResponse | null = null

  try {
    data = await response.json()
  } catch (error) {}

  if (!response.ok) {
    const errMsg = data?.message
      ? `Error status code: ${response.status}. ${data.message}`
      : `Error status code: ${response.status}.`

    const err = new FetchError(errMsg, response, response.status, data?.message)
    throw err
  }

  return data?.data ?? data
}
