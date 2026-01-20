import { IFirmaRepository } from "@/src/domain/interfaces/IFirmaRepository";
import { Firma } from "@/src/domain/entities/Firma";

export class GetTodayFirmaUseCase {
  constructor(private firmaRepository: IFirmaRepository) {}

  async execute(ci: string): Promise<Firma | null> {
    return await this.firmaRepository.getTodayFirma(ci);
  }
}
