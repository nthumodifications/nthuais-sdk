export class NTHUAISError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NTHUAISError'
  }
}

export class RetryableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RetryableError'
  }
}