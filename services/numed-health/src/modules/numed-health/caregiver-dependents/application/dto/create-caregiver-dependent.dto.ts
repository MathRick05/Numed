import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCaregiverDependentDto {
  @ApiProperty({ example: "uuid-do-dependente" })
  @IsUUID()
  dependentId: string;
}
