import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateCaregiverDependentDto {
  @ApiProperty({ example: "uuid-do-dependente" })
  @IsUUID()
  @IsNotEmpty()
  dependentId: string;
}
