import { ApiProperty } from "@nestjs/swagger";
import type { User } from "@users/domain/models/user.entity";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nomeCompleto: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  cuidador: boolean;

  @ApiProperty()
  premium: boolean;

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  private constructor(
    id: string,
    nomeCompleto: string,
    email: string,
    telefone: string,
    cuidador: boolean,
    premium: boolean,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.telefone = telefone;
    this.cuidador = cuidador;
    this.premium = premium;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(user: User | null): UserResponseDto | null {
    if (!user) return null;
    return new UserResponseDto(
      user.id!,
      user.fullName,
      user.email,
      user.phone,
      user.isCaregiver,
      user.isPremium,
      user.createdAt,
      user.updatedAt,
    );
  }
}
