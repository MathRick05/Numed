import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMedicineDto } from "@medicine/application/dto/create-medicine.dto";
import { MedicineResponseDto } from "@medicine/application/dto/medicine-response.dto";
import { UpdateMedicineDto } from "@medicine/application/dto/update-medicine.dto";
import { Medicine } from "@medicine/domain/models/medicine.entity";
import {
  MEDICINE_REPOSITORY,
  type MedicineRepository,
} from "@medicine/domain/repositories/medicine-repository.interface";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";
import { UserService } from "@users/application/services/user.service";

@Injectable()
export class MedicineService {
  constructor(
    @Inject(MEDICINE_REPOSITORY)
    private readonly medicineRepository: MedicineRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateMedicineDto): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const medicine = Medicine.restore({
      userId,
      nome: dto.nome,
      tipo: dto.tipo,
      numeroDosagem: dto.numeroDosagem,
      unidadeDosagem: dto.unidadeDosagem,
      quantidadeGuardada: dto.quantidadeGuardada,
      instrucoes: dto.instrucoes ?? "",
    })!;

    await this.medicineRepository.create(medicine);
  }

  async edit(userId: string, id: string, dto: UpdateMedicineDto): Promise<void> {
    const medicine = await this.medicineRepository.findById(userId, id);
    if (!medicine) throw new NotFoundException("Medicine not found");

    if (dto.nome) medicine.withNome(dto.nome);
    if (dto.tipo) medicine.withTipo(dto.tipo);
    if (dto.numeroDosagem !== undefined)
      medicine.withNumeroDosagem(dto.numeroDosagem);
    if (dto.unidadeDosagem) medicine.withUnidadeDosagem(dto.unidadeDosagem);
    if (dto.quantidadeGuardada !== undefined)
      medicine.withQuantidadeGuardada(dto.quantidadeGuardada);
    if (dto.instrucoes !== undefined) medicine.withInstrucoes(dto.instrucoes);

    await this.medicineRepository.update(medicine);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.medicineRepository.delete(userId, id);
  }

  async listByUserId(userId: string): Promise<MedicineResponseDto[]> {
    const rows = await this.medicineRepository.findAllByUserId(userId);
    return rows.map((m) => MedicineResponseDto.from(m)!);
  }

  async listByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<MedicineResponseDto>> {
    const { rows, total } = await this.medicineRepository.findAllByUserIdPaginated(
      userId,
      params,
    );

    return {
      data: rows.map((m) => MedicineResponseDto.from(m)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(userId: string, id: string): Promise<MedicineResponseDto | null> {
    const medicine = await this.medicineRepository.findById(userId, id);
    return MedicineResponseDto.from(medicine);
  }
}
