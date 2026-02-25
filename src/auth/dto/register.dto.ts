import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/roles.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  role?: UserRole; // Optional, defaults to STUDENT
}
