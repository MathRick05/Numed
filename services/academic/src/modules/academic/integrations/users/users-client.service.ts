import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersClientService {
  constructor(private readonly configService: ConfigService) {}

  async findById(userId: string): Promise<{ id: string } | null> {
    const baseUrl =
      this.configService.get<string>("USERS_BASE_URL") ??
      this.configService.get<string>("USER_SERVICE_URL") ??
      this.configService.get<string>("USER_AUTH_BASE_URL");

    if (!baseUrl) {
      return { id: userId };
    }

    const token =
      this.configService.get<string>("USER_SERVICE_TOKEN") ??
      this.configService.get<string>("USERS_SERVICE_TOKEN");

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new ServiceUnavailableException("User service unavailable");
    }

    return { id: userId };
  }
}
