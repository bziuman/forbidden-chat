import jwt from 'jsonwebtoken';
import { GetDataFromToken } from './dto/getDataFromToken.dto';
import { DataFromTokenDto } from './dto/dataFromToken.dto';

export const getDataFromToken = async (
  data: GetDataFromToken,
): Promise<DataFromTokenDto> => {
  return new Promise((resolve, reject) => {
    const { token, secretKey } = data;
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) reject(error);
      const userData = decoded as DataFromTokenDto;
      resolve(userData);
    });
  });
};
