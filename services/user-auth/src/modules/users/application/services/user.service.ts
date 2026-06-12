import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";
import { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UpdateUserDto } from "@users/application/dto/update-user.dto";
import { UserPayload } from "@users/application/dto/user-payload.interface";
import { UserResponseDto } from "@users/application/dto/user-response.dto";
import { UserMessagingService } from "@users/application/services/user-messaging.service";
import { User } from "@users/domain/models/user.entity";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "@users/domain/repositories/user-repository.interface";
import bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly userMessagingService: UserMessagingService,
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = User.restore({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      password: hashedPassword,
      isCaregiver: dto.isCaregiver,
      isPremium: dto.isPremium,
      permissions: (dto.permissions ?? []) as string[],
    })!;

    await this.userRepository.create(user);

    const created = await this.userRepository.findByEmail(user.email);
    if (created) {
      await this.userMessagingService.publishUserCreated(UserResponseDto.from(created)!);
    }
  }

  async edit(id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");

    if (dto.fullName) user.withFullName(dto.fullName);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) throw new ConflictException("Email already registered");
      user.withEmail(dto.email.toLowerCase());
    }

    if (dto.phone) user.withPhone(dto.phone);

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user.withPassword(hashedPassword);
    }

    if (dto.isCaregiver !== undefined) user.withIsCaregiver(dto.isCaregiver);
    if (dto.isPremium !== undefined) user.withIsPremium(dto.isPremium);

    if (dto.permissions !== undefined)
      user.withPermissions(dto.permissions as string[]);

    await this.userRepository.update(user);
    await this.userMessagingService.publishUserUpdated(UserResponseDto.from(user)!);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await this.userMessagingService.publishUserDeleted(id);
  }

  async list(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => UserResponseDto.from(u)!);
  }

  async listPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const { rows, total } = await this.userRepository.findAllPaginated(params);
    return {
      data: rows.map((u) => UserResponseDto.from(u)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return UserResponseDto.from(user);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return { id: user.id!, email: user.email, permissions: user.permissions };
  }
}
