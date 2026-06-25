export class DatabaseError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
    this.cause = cause;
  }
}

export class NotFoundError extends DatabaseError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" was not found.`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof ValidationError || error instanceof DatabaseError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export function wrapDatabaseError(error: unknown, context: string): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message : 'Unknown database error';

  return new DatabaseError(`${context}: ${message}`, error);
}
