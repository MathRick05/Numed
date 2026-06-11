import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMedicineDto } from "@numed-health/medicines/application/dto/create-medicine.dto";
import { MedicineDto } from "@numed-health/medicines/application/dto/medicine.dto";
import { UpdateMedicineDto } from "@numed-health/medicines/application/dto/update-medicine.dto";
import { MedicineMessagingService } from "@numed-health/medicines/application/services/medicine-messaging.service";
import { Medicine } from "@numed-health/medicines/domain/models/medicine.entity";
import {
  MEDICINE_REPOSITORY,
  type MedicineRepository,
} from "@numed-health/medicines/domain/repositories/medicine-repository.interface";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";

@Injectable()
export class MedicineService {
  constructor(
    @Inject(MEDICINE_REPOSITORY)
    private readonly medicineRepository: MedicineRepository,
    private readonly messagingService: MedicineMessagingService,
  ) {}

  async create(userId: string, dto: CreateMedicineDto): Promise<void> {
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

    const rows = await this.medicineRepository.findAllByUserId(userId);
    const created = rows.at(-1);
    if (created) {
      await this.messagingService.publishMedicineCreated(MedicineDto.from(created)!);
    }
  }

  async edit(userId: string, id: string, dto: UpdateMedicineDto): Promise<void> {
    const medicine = await this.medicineRepository.findById(userId, id);
    if (!medicine) throw new NotFoundException("Medicine not found");

    if (dto.nome) medicine.withNome(dto.nome);
    if (dto.tipo) medicine.withTipo(dto.tipo);
    if (dto.numeroDosagem !== undefined) medicine.withNumeroDosagem(dto.numeroDosagem);
    if (dto.unidadeDosagem) medicine.withUnidadeDosagem(dto.unidadeDosagem);
    if (dto.quantidadeGuardada !== undefined) medicine.withQuantidadeGuardada(dto.quantidadeGuardada);
    if (dto.instrucoes !== undefined) medicine.withInstrucoes(dto.instrucoes);

    await this.medicineRepository.update(medicine);
    await this.messagingService.publishMedicineUpdated(MedicineDto.from(medicine)!);
  }

  async remove(userId: string, id: string): Promise<void> {
    const medicine = await this.medicineRepository.findById(userId, id);
    if (!medicine) throw new NotFoundException("Medicine not found");

    await this.medicineRepository.delete(userId, id);
    await this.messagingService.publishMedicineDeleted(MedicineDto.from(medicine)!);
  }

  async listByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<MedicineDto>> {
    const { rows, total } = await this.medicineRepository.findAllByUserIdPaginated(userId, params);
    return {
      data: rows.map((m) => MedicineDto.from(m)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(userId: string, id: string): Promise<MedicineDto | null> {
    const medicine = await this.medicineRepository.findById(userId, id);
    return MedicineDto.from(medicine);
  }
}
