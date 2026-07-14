/**
 * Sistema de logging estructurado para el backend
 * Proporciona logging consistente y contextual
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error && {
        errorMessage: error.message,
        errorName: error.name,
        errorCode: error.code,
        ...(this.isDevelopment && error.stack && { stack: error.stack }),
      }),
    };
    console.error(this.formatLog(LogLevel.ERROR, message, errorContext));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog(LogLevel.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatLog(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatLog(LogLevel.DEBUG, message, context));
    }
  }

  // Logs específicos para operaciones de BD
  dbError(operation: string, error: any, context?: LogContext): void {
    this.error(`Database error during ${operation}`, error, {
      ...context,
      operation,
      dbError: true,
    });
  }

  dbQuery(query: string, duration?: number, context?: LogContext): void {
    this.debug(`DB Query: ${query}`, {
      ...context,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  // Logs específicos para operaciones de red/API
  apiRequest(method: string, path: string, status: number, duration?: number, context?: LogContext): void {
    const level = status >= 500 ? LogLevel.ERROR : status >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, `${method} ${path} - ${status}`, {
      ...context,
      method,
      path,
      status,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  // Logs específicos para operaciones de archivos
  fileOperation(operation: string, filePath: string, success: boolean, context?: LogContext): void {
    const message = `File ${operation}: ${filePath} - ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      this.info(message, context);
    } else {
      this.error(message, undefined, context);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case LogLevel.ERROR:
        console.error(this.formatLog(level, message, context));
        break;
      case LogLevel.WARN:
        console.warn(this.formatLog(level, message, context));
        break;
      case LogLevel.INFO:
        console.log(this.formatLog(level, message, context));
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.log(this.formatLog(level, message, context));
        }
        break;
    }
  }
}

export const logger = new Logger();
export default logger;
