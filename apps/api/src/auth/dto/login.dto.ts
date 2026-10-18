import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email or password.' })
  @IsNotEmpty({ message: 'Invalid email or password.' })
  email!: string;

  @IsString({ message: 'Invalid email or password.' })
  @IsNotEmpty({ message: 'Invalid email or password.' })
  @MinLength(8, { message: 'Invalid email or password.' })
  password!: string;
}
