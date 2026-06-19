import type { ForgotPasswordDto } from "@auth/application/dto/forgot-password.dto";
import type { LoginDto } from "@auth/application/dto/login.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@users/application/services/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.validateCredentials(
      dto.email,
      dto.password,
    );

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
    });

    return { accessToken };
  }

  async requestPasswordRecovery(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const email = dto.email.toLowerCase();
    await this.userService.emailExists(email);

    return {
      message:
        "Se o e-mail estiver cadastrado, enviaremos instrucoes para recuperar sua senha.",
    };
  }
}
