import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { getDataFromToken } from 'src/utils/getDataFromToken';

@Injectable()
export class DecodedTokenMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.cookies['access_token'];
    const decodedData = await getDataFromToken({
      token: token,
      secretKey: '123',
    });

    if (!decodedData)
      throw new HttpException(
        'Error in data retrieval',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    req.userTokenData = decodedData;
    next();
  }
}
