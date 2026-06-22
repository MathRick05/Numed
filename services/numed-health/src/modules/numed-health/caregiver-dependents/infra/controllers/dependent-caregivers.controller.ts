import { CaregiverDependentResponseDto } from "@numed-health/caregiver-dependents/application/dto/caregiver-dependent-response.dto";
import { CaregiverDependentService } from "@numed-health/caregiver-dependents/application/services/caregiver-dependent.service";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("caregivers")
@ApiBearerAuth()
@Controller("users/:dependentId/caregivers")
export class DependentCaregiversController {
  constructor(private readonly caregiverDependentService: CaregiverDependentService) {}

  @Get()
  @ApiOperation({ summary: "Listar cuidadores do dependente" })
  async list(@Param("dependentId") dependentId: string): Promise<CaregiverDependentResponseDto[]> {
    return this.caregiverDependentService.listCaregivers(dependentId);
  }
}
