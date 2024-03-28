import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CalcModule } from './calc/calc.module';
import { RouteLoggingMiddleware } from './middlewares/route-logging.middleware.ts';

@Module({
  imports: [CalcModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RouteLoggingMiddleware).forRoutes('*');
  }
}
