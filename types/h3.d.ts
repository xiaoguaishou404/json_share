declare module 'h3' {
  interface H3Event {
    context: {
      params: Record<string, string>
    }
    headers: {
      get(name: string): string | null
    }
  }

  function defineEventHandler<T>(handler: (event: H3Event) => Promise<T>): unknown
  function readBody<T = unknown>(event: H3Event): Promise<T>
} 