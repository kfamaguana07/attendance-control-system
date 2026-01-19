import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';

export class MockRecesoRepository implements IRecesoRepository {
  private recesos: Receso[] = [
    new Receso(1, 1, '10:00:00', '10:15:00', '00:15:00', 'Break Mañana', 'Receso matutino', 'BREAK'),
    new Receso(2, 1, '12:00:00', '13:00:00', '01:00:00', 'Almuerzo', 'Hora de almuerzo', 'ALMUERZO'),
    new Receso(3, 1, '15:00:00', '15:15:00', '00:15:00', 'Break Tarde', 'Receso vespertino', 'BREAK'),
    new Receso(4, 2, '14:00:00', '14:15:00', '00:15:00', 'Break Nocturno', 'Receso de noche', 'BREAK'),
    new Receso(5, 2, '18:00:00', '19:00:00', '01:00:00', 'Cena', 'Hora de cena', 'ALMUERZO'),
  ];
  private nextId = 6;

  async getAll(): Promise<Receso[]> {
    return Promise.resolve([...this.recesos]);
  }

  async getById(id: number): Promise<Receso | null> {
    const receso = this.recesos.find((r) => r.id === id);
    return Promise.resolve(receso || null);
  }

  async create(recesoData: Omit<Receso, 'id'>): Promise<Receso> {
    const newReceso = new Receso(
      this.nextId++,
      recesoData.id_t,
      recesoData.hora_inicio,
      recesoData.hora_fin,
      recesoData.hora_total,
      recesoData.nombre,
      recesoData.descripcion,
      recesoData.tipo
    );
    this.recesos.push(newReceso);
    return Promise.resolve(newReceso);
  }

  async update(id: number, recesoData: Partial<Receso>): Promise<Receso> {
    const index = this.recesos.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Receso no encontrado');
    }

    this.recesos[index] = {
      ...this.recesos[index],
      ...recesoData,
      id: this.recesos[index].id, // Mantener el ID original
    };

    return Promise.resolve(this.recesos[index]);
  }

  async delete(id: number): Promise<void> {
    const index = this.recesos.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Receso no encontrado');
    }
    this.recesos.splice(index, 1);
    return Promise.resolve();
  }

  async search(query: string): Promise<Receso[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.recesos.filter(
      (receso) =>
        receso.nombre.toLowerCase().includes(lowerQuery) ||
        receso.descripcion.toLowerCase().includes(lowerQuery) ||
        receso.tipo.toLowerCase().includes(lowerQuery) ||
        receso.hora_inicio.includes(query)
    );
    return Promise.resolve(filtered);
  }
}
