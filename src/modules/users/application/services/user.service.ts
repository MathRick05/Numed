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
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.senha, 10);
    const user = User.restore({
      fullName: dto.nomeCompleto,
      email: dto.email.toLowerCase(),
      phone: dto.telefone,
      password: hashedPassword,
      isCaregiver: dto.cuidador ?? false,
      permissions: [],
    })!;

    await this.userRepository.create(user);
  }

  async edit(id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");

    if (dto.nomeCompleto) user.withFullName(dto.nomeCompleto);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) throw new ConflictException("Email already registered");
      user.withEmail(dto.email.toLowerCase());
    }

    if (dto.telefone) user.withPhone(dto.telefone);

    if (dto.senha) {
      const hashedPassword = await bcrypt.hash(dto.senha, 10);
      user.withPassword(hashedPassword);
    }

    if (dto.cuidador !== undefined) user.withIsCaregiver(dto.cuidador);

    await this.userRepository.update(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
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

  async listPremium(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAllPremium();
    return users.map((u) => UserResponseDto.from(u)!);
  }

  async upgradeToPremium(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");
    user.withIsPremium(true);
    await this.userRepository.update(user);
  }

  async downgradeToPremium(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");
    user.withIsPremium(false);
    await this.userRepository.update(user);
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
