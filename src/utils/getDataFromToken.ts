import { GetDataFromToken } from './dto/getDataFromToken.dto';
import { DataFromTokenDto } from './dto/dataFromToken.dto';
import { JwtService } from '@nestjs/jwt';

export const getDataFromToken = async (
  data: GetDataFromToken,
): Promise<DataFromTokenDto> => {
  const { token, secretKey } = data;
  const jwtService = new JwtService();
  const dec = jwtService.verifyAsync(token, { secret: secretKey });
  return dec;
};
