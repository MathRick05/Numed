import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";
import { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UpdateUserDto } from "@users/application/dto/update-user.dto";
import { UserResponseDto } from "@users/application/dto/user-response.dto";
import { UserService } from "@users/application/services/user.service";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("premium")
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: "Listar usuários premium" })
  @HateoasList<UserResponseDto>({
    basePath: "/v1/users/premium",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.id}`, method: "DELETE" },
    }),
  })
  async findAllPremium() {
    const users = await this.userService.listPremium();
    return { data: users, total: users.length, page: 1, limit: users.length };
  }

  @Get()
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: "Listar usuários" })
  @ApiQuery({ name: "_page", required: false, type: Number })
  @ApiQuery({ name: "_limit", required: false, type: Number })
  @HateoasList<UserResponseDto>({
    basePath: "/v1/users",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.id}`, method: "DELETE" },
    }),
  })
  async findAll(
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.listPaginated({ page, limit });
  }

  @Get(":id")
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: "Buscar usuário por ID" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  @HateoasItem<UserResponseDto>({
    basePath: "/v1/users",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.id}`, method: "DELETE" },
      list: { href: "/v1/users", method: "GET" },
      create: { href: "/v1/users", method: "POST" },
    }),
  })
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Criar usuário" })
  @ApiOkResponse({ description: "Usuário criado com sucesso" })
  async create(@Body() body: CreateUserDto) {
    await this.userService.create(body);
    return { message: "Usuário criado com sucesso" };
  }

  @Put(":id")
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiOkResponse({ description: "Usuário atualizado com sucesso" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    await this.userService.edit(id, body);
    return { message: "Usuário atualizado com sucesso" };
  }

  @Delete(":id")
  @RequirePermissions(Permission.USERS_DELETE)
  @ApiOperation({ summary: "Remover usuário" })
  @ApiOkResponse({ description: "Usuário removido com sucesso" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  async remove(@Param("id") id: string) {
    await this.userService.remove(id);
    return { message: "Usuário removido com sucesso" };
  }

  @Patch(":id/premium")
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Ativar premium do usuário" })
  @ApiOkResponse({ description: "Premium ativado com sucesso" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  async activatePremium(@Param("id") id: string) {
    await this.userService.upgradeToPremium(id);
    return { message: "Premium ativado com sucesso" };
  }

  @Delete(":id/premium")
  @RequirePermissions(Permission.USERS_WRITE)
  @ApiOperation({ summary: "Desativar premium do usuário" })
  @ApiOkResponse({ description: "Premium desativado com sucesso" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  async deactivatePremium(@Param("id") id: string) {
    await this.userService.downgradeToPremium(id);
    return { message: "Premium desativado com sucesso" };
  }
}
