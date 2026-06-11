import { ApiProperty } from "@nestjs/swagger";
import type { User } from "@users/domain/models/user.entity";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isCaregiver: boolean;

  @ApiProperty()
  isPremium: boolean;

  @ApiProperty({ isArray: true, type: String })
  permissions: string[];

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  private constructor(
    id: string,
    fullName: string,
    email: string,
    phone: string,
    isCaregiver: boolean,
    isPremium: boolean,
    permissions: string[],
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.isCaregiver = isCaregiver;
    this.isPremium = isPremium;
    this.permissions = permissions;
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
      user.permissions,
      user.createdAt,
      user.updatedAt,
    );
  }
}
