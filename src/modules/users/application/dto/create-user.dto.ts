import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Maria da Silva" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nomeCompleto: string;

  @ApiProperty({ example: "user@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "+55 (11) 99999-9999" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[0-9+()\-.\s]{8,30}$/)
  telefone: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  senha: string;
}
