import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  lastName: string;

  @IsString()
  @IsOptional()
  countryIso2?: string;

  @IsString()
  @IsOptional()
  stateIso2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  gender?: string;
}
