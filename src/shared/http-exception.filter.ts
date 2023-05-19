import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus() ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: status !== HttpStatus.INTERNAL_SERVER_ERROR ? exception.message || null : 'Internal Server Error',
        };

        return response.status(status).json(errorResponse);
    }
}
