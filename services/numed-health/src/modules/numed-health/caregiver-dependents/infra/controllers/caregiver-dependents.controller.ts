import { CaregiverDependentResponseDto } from "@numed-health/caregiver-dependents/application/dto/caregiver-dependent-response.dto";
import { CreateCaregiverDependentDto } from "@numed-health/caregiver-dependents/application/dto/create-caregiver-dependent.dto";
import { CaregiverDependentService } from "@numed-health/caregiver-dependents/application/services/caregiver-dependent.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { Public } from "@shared/infra/decorators/public.decorator";

@ApiTags("caregivers")
@ApiBearerAuth()
@Controller("users/:caregiverId/dependents")
export class CaregiverDependentsController {
  constructor(private readonly caregiverDependentService: CaregiverDependentService) {}

  @Get()
  @Public() // @RequirePermissions(Permission.CAREGIVER_DEPENDENTS_READ)
  @ApiOperation({ summary: "Listar dependentes do cuidador" })
  async list(@Param("caregiverId") caregiverId: string): Promise<CaregiverDependentResponseDto[]> {
    return this.caregiverDependentService.listDependents(caregiverId);
  }

  @Post()
  @Public() // @RequirePermissions(Permission.CAREGIVER_DEPENDENTS_WRITE)
  @ApiOperation({ summary: "Vincular dependente ao cuidador" })
  async create(
    @Param("caregiverId") caregiverId: string,
    @Body() body: CreateCaregiverDependentDto,
  ) {
    return this.caregiverDependentService.addDependent(caregiverId, body.dependentId);
  }

  @Delete(":dependentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public() // @RequirePermissions(Permission.CAREGIVER_DEPENDENTS_DELETE)
  @ApiOperation({ summary: "Remover vínculo cuidador-dependente" })
  @ApiNoContentResponse({ description: "Vínculo removido" })
  async remove(
    @Param("caregiverId") caregiverId: string,
    @Param("dependentId") dependentId: string,
  ) {
    return this.caregiverDependentService.removeDependent(caregiverId, dependentId);
  }
}
