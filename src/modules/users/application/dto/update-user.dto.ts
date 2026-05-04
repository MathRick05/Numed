import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  IsString,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "Maria da Silva", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  nomeCompleto?: string;

  @ApiProperty({ example: "user@gmail.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "+55 (11) 99999-9999", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[0-9+()\-.\s]{8,30}$/)
  @IsOptional()
  telefone?: string;

  @ApiProperty({ example: "novaSenha123", required: false })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @IsOptional()
  senha?: string;
}
