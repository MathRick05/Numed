import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CaregiverDependentResponseDto } from "@caregiver-dependents/application/dto/caregiver-dependent-response.dto";
import { CaregiverDependent } from "@caregiver-dependents/domain/models/caregiver-dependent.entity";
import {
  CAREGIVER_DEPENDENT_REPOSITORY,
  type CaregiverDependentRepository,
} from "@caregiver-dependents/domain/repositories/caregiver-dependent-repository.interface";

@Injectable()
export class CaregiverDependentService {
  constructor(
    @Inject(CAREGIVER_DEPENDENT_REPOSITORY)
    private readonly caregiverDependentRepository: CaregiverDependentRepository,
  ) {}

  async addDependent(caregiverId: string, dependentId: string): Promise<void> {
    const exists = await this.caregiverDependentRepository.exists(
      caregiverId,
      dependentId,
    );
    if (exists) throw new ConflictException("Relationship already exists");

    const link = CaregiverDependent.restore({ caregiverId, dependentId })!;
    await this.caregiverDependentRepository.create(link);
  }

  async removeDependent(caregiverId: string, dependentId: string): Promise<void> {
    await this.caregiverDependentRepository.delete(caregiverId, dependentId);
  }

  async listDependents(caregiverId: string): Promise<CaregiverDependentResponseDto[]> {
    const links = await this.caregiverDependentRepository.listDependents(caregiverId);
    return links.map(CaregiverDependentResponseDto.from);
  }
}
