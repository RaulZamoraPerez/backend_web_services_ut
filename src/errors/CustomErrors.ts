export class CustomError extends Error {
  //*Declaracion e iniciliazacion de atributos
  constructor(public readonly statusCode: number, public readonly message: string) {
    super(message);
  }

  static Ok(message: string): CustomError {
    return new CustomError(200, message);
  }

  static badRequest(message: string): CustomError {
    return new CustomError(400, message);
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(401, message);
  }

  static forbidden(message: string): CustomError {
    return new CustomError(403, message);
  }

  static notFound(message: string): CustomError {
    return new CustomError(404, message);
  }

  static payloadTooLarge(message: string): CustomError {
    return new CustomError(413, message);
  }

  static UnsuportedMedia(message: string): CustomError {
    return new CustomError(415, message);
  }

  static invalidFileType(message: string): CustomError {
    return new CustomError(422, message);
  }

  static internalServer(message: string): CustomError {
    console.log('CustomError.internalServer -> message', message);
    return new CustomError(500, message);
  }
}