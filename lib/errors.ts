export class AuthenticationError extends Error {}

export class EmailUnverifiedError extends AuthenticationError {
  constructor(message?: string) {
    if (!message) message = "Please verify your email before logging in."
    super(message)
  }
}
