export class VerifyPasswordDto {
  username: string;
  password: string;
  heshedPassword: string;
  salt: string;
}
