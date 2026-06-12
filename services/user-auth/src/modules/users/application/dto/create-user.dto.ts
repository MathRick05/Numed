import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Maria Souza" })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: "user@school.com" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: "+55 11 99999-9999" })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  @IsNotEmpty()
  password!: string;

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
    example: [Permission.MEDICINES_READ],
    required: false,
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: Permission[];
}
