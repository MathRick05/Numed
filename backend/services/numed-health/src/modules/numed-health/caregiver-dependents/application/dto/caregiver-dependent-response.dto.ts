import { ApiProperty } from "@nestjs/swagger";
import type { CaregiverDependent } from "@numed-health/caregiver-dependents/domain/models/caregiver-dependent.entity";

export class CaregiverDependentResponseDto {
  @ApiProperty() caregiverId: string;
  @ApiProperty() dependentId: string;

  private constructor(caregiverId: string, dependentId: string) {
    this.caregiverId = caregiverId;
    this.dependentId = dependentId;
  }

  static from(link: CaregiverDependent): CaregiverDependentResponseDto {
    return new CaregiverDependentResponseDto(link.caregiverId, link.dependentId);
  }
}
