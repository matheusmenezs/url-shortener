import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { NestResponse } from './nestResponse';

@Injectable()
export class NestResponseInterceptor implements NestInterceptor {
  private readonly httpAdapter: AbstractHttpAdapter;

  constructor(adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((controllerResponse: any) => {
        if (controllerResponse instanceof NestResponse) {
          const httpContext = context.switchToHttp();
          const response = httpContext.getResponse();
          const { status, headers, body } = controllerResponse;

          Object.entries(headers).forEach(([key, value]) => {
            this.httpAdapter.setHeader(response, key, value as string);
          });

          this.httpAdapter.status(response, status);

          return body;
        }

        return controllerResponse;
      }),
    );
  }
}
