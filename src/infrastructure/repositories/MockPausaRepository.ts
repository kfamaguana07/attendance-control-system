import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';
import { Pausa } from '@/src/domain/entities/Pausa';

export class MockPausaRepository implements IPausaRepository {
  private pausas: Pausa[] = [
    new Pausa(
      1,
      'Visita',
      'V_proveedores',
      'Visita a proveedores para revisión de productos',
      ['001', '002'],
      '2026-01-18',
      '08:00',
      '10:00',
      'Juan Pérez'
    ),
    new Pausa(
      2,
      'Permisos',
      'P_con_descuento',
      'Cita médica de rutina',
      ['001'],
      '2026-01-19',
      '14:00',
      '16:00',
      'Juan Pérez'
    ),
    new Pausa(
      3,
      'Reunión',
      'R_interna',
      'Reunión mensual del departamento de ventas',
      ['002'],
      '2026-01-20',
      '09:00',
      '11:00',
      'María González'
    ),
  ];

  private nextId = 4;

  async getAll(): Promise<Pausa[]> {
    return Promise.resolve([...this.pausas]);
  }

  async getById(id: number): Promise<Pausa | null> {
    const pausa = this.pausas.find((p) => p.id === id);
    return Promise.resolve(pausa || null);
  }

  async create(pausaData: Omit<Pausa, 'id'>): Promise<Pausa> {
    const newPausa = new Pausa(
      this.nextId++,
      pausaData.estado,
      pausaData.subEstado,
      pausaData.observacion,
      pausaData.empleadosIds,
      pausaData.fechaPausa,
      pausaData.horaInicio,
      pausaData.horaFin,
      ''
    );
    this.pausas.push(newPausa);
    return Promise.resolve(newPausa);
  }

  async update(id: number, pausaData: Partial<Pausa>): Promise<Pausa> {
    const index = this.pausas.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Pausa no encontrada');
    }

    const updatedPausa = new Pausa(
      id,
      pausaData.estado ?? this.pausas[index].estado,
      pausaData.subEstado ?? this.pausas[index].subEstado,
      pausaData.observacion ?? this.pausas[index].observacion,
      pausaData.empleadosIds ?? this.pausas[index].empleadosIds,
      pausaData.fechaPausa ?? this.pausas[index].fechaPausa,
      pausaData.horaInicio ?? this.pausas[index].horaInicio,
      pausaData.horaFin ?? this.pausas[index].horaFin,
      this.pausas[index].empleadoNombre
    );

    this.pausas[index] = updatedPausa;
    return Promise.resolve(updatedPausa);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.pausas.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.pausas.splice(index, 1);
    return Promise.resolve(true);
  }

  async search(query: string): Promise<Pausa[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.pausas.filter(
      (pausa) =>
        pausa.estado.toLowerCase().includes(lowerQuery) ||
        pausa.subEstado.toLowerCase().includes(lowerQuery) ||
        pausa.observacion.toLowerCase().includes(lowerQuery) ||
        pausa.fechaPausa.includes(lowerQuery)
    );
    return Promise.resolve(filtered);
  }

  async getFiltered(filters: { ci?: string; fechaInicio?: string; fechaFin?: string; }): Promise<Pausa[]> {
    let filtered = [...this.pausas];

    if (filters.ci) {
      // Nota: En un entorno real, la búsqueda por CI debería verificar si el empleado existe.
      // Aquí buscamos si el CI está en la lista de empleados de la pausa (que guardamos como IDs)
      // O si tuviéramos acceso a los datos completos del empleado.
      // Asumiendo que empleadosIds contiene CIs o IDs que podemos comparar.
      const ci = filters.ci;
      filtered = filtered.filter(p => p.empleadosIds.includes(ci));
    }

    if (filters.fechaInicio) {
      filtered = filtered.filter(p => p.fechaPausa >= filters.fechaInicio!);
    }

    if (filters.fechaFin) {
      filtered = filtered.filter(p => p.fechaPausa <= filters.fechaFin!);
    }

    return Promise.resolve(filtered);
  }
}
