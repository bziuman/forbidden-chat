import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RemoveTokenUserDataMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: (error?: any) => void) {
    delete res.userTokenData;
    next();
  }
}
