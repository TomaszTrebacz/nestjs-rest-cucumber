import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type as ClassType,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
// eslint-disable-next-line import/no-unresolved
import { Observable } from 'rxjs';
// eslint-disable-next-line import/no-deprecated
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      // eslint-disable-next-line import/no-deprecated
      map((data) =>
        plainToClass(this.classType, data, { strategy: 'excludeAll' }),
      ),
    );
  }
}
