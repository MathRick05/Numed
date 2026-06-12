import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "Maria Souza", required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: "user@school.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "+55 11 99999-9999", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: "novaSenha123", required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isCaregiver?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({
    enum: Permission,
    isArray: true,
    required: false,
    example: [Permission.MEDICINES_READ],
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: Permission[];
}
