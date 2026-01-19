import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';

export class MockTurnoRepository implements ITurnoRepository {
  private turnos: Turno[] = [
    new Turno(
      1,
      '07:00:00',
      '15:00:00',
      '08:00:00',
      'Turno Mañana',
      'Turno regular de la mañana para personal administrativo',
      'NORMAL'
    ),
    new Turno(
      2,
      '15:00:00',
      '23:00:00',
      '08:00:00',
      'Turno Tarde',
      'Turno regular de la tarde para personal operativo',
      'NORMAL'
    ),
    new Turno(
      3,
      '23:00:00',
      '07:00:00',
      '08:00:00',
      'Turno Noche',
      'Turno nocturno para vigilancia y seguridad',
      'NORMAL'
    ),
    new Turno(
      4,
      '08:00:00',
      '12:00:00',
      '04:00:00',
      'Medio Turno',
      'Turno parcial para personal de apoyo',
      'ADICIONAL'
    ),
  ];

  private nextId = 5;

  async getAll(): Promise<Turno[]> {
    return Promise.resolve([...this.turnos]);
  }

  async getById(id: number): Promise<Turno | null> {
    const turno = this.turnos.find((t) => t.id === id);
    return Promise.resolve(turno || null);
  }

  async create(turnoData: Omit<Turno, 'id'>): Promise<Turno> {
    const newTurno = new Turno(
      this.nextId++,
      turnoData.horaInicio,
      turnoData.horaFin,
      turnoData.horaTotal,
      turnoData.nombre,
      turnoData.descripcion,
      turnoData.tipo
    );
    this.turnos.push(newTurno);
    return Promise.resolve(newTurno);
  }

  async update(id: number, turnoData: Partial<Turno>): Promise<Turno> {
    const index = this.turnos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Turno no encontrado');
    }

    const updatedTurno = new Turno(
      id,
      turnoData.horaInicio ?? this.turnos[index].horaInicio,
      turnoData.horaFin ?? this.turnos[index].horaFin,
      turnoData.horaTotal ?? this.turnos[index].horaTotal,
      turnoData.nombre ?? this.turnos[index].nombre,
      turnoData.descripcion ?? this.turnos[index].descripcion,
      turnoData.tipo ?? this.turnos[index].tipo
    );

    this.turnos[index] = updatedTurno;
    return Promise.resolve(updatedTurno);
  }

  async delete(id: number): Promise<boolean> {
    const index = this.turnos.findIndex((t) => t.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.turnos.splice(index, 1);
    return Promise.resolve(true);
  }

  async search(query: string): Promise<Turno[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.turnos.filter(
      (turno) =>
        turno.nombre.toLowerCase().includes(lowerQuery) ||
        turno.descripcion.toLowerCase().includes(lowerQuery) ||
        turno.tipo.toLowerCase().includes(lowerQuery) ||
        turno.horaInicio.includes(lowerQuery) ||
        turno.horaFin.includes(lowerQuery)
    );
    return Promise.resolve(filtered);
  }
}
