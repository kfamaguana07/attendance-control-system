import { IPersonalRepository } from '@/src/domain/interfaces/IPersonalRepository';
import { Personal, PersonalData } from '@/src/domain/entities/Personal';

export class MockPersonalRepository implements IPersonalRepository {
  private personal: Personal[] = [
    new Personal(
      '001',
      '1234567',
      1,
      1,
      1,
      1,
      'Kevin',
      'Amaguana',
      'Av. Principal 123',
      '555-0001',
      'kevin.amaguana@example.com',
      '1990-01-15',
      '2020-03-01',
      '2020-03-01',
      2500.00
    ),
    new Personal(
      '002',
      '7654321',
      2,
      1,
      2,
      1,
      'Reishel',
      'Tipan',
      'Calle Secundaria 456',
      '555-0002',
      'reishel.tipan@example.com',
      '1985-06-20',
      '2019-07-15',
      '2019-07-15',
      3000.00
    ),
  ];

  async findAll(): Promise<Personal[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.personal];
  }

  async findById(id: string): Promise<Personal | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.personal.find(p => p.cl === id) || null;
  }

  async create(personalData: PersonalData): Promise<Personal> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPersonal = new Personal(
      String(this.personal.length + 1).padStart(3, '0'),
      personalData.ci,
      personalData.id_a,
      personalData.id_t,
      personalData.id_b,
      personalData.id_ba,
      personalData.nombres,
      personalData.apellidos,
      personalData.direccion,
      personalData.telefonos,
      personalData.correo,
      personalData.fechaNacimiento,
      personalData.fechaIngreso,
      personalData.fechaContrato,
      personalData.salario
    );
    this.personal.push(newPersonal);
    return newPersonal;
  }

  async update(id: string, personalData: Partial<PersonalData>): Promise<Personal> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.personal.findIndex(p => p.cl === id);
    if (index === -1) throw new Error('Personal no encontrado');
    
    const current = this.personal[index];
    this.personal[index] = new Personal(
      current.cl,
      personalData.ci ?? current.ci,
      personalData.id_a ?? current.id_a,
      personalData.id_t ?? current.id_t,
      personalData.id_b ?? current.id_b,
      personalData.id_ba ?? current.id_ba,
      personalData.nombres ?? current.nombres,
      personalData.apellidos ?? current.apellidos,
      personalData.direccion ?? current.direccion,
      personalData.telefonos ?? current.telefonos,
      personalData.correo ?? current.correo,
      personalData.fechaNacimiento ?? current.fechaNacimiento,
      personalData.fechaIngreso ?? current.fechaIngreso,
      personalData.fechaContrato ?? current.fechaContrato,
      personalData.salario ?? current.salario
    );
    return this.personal[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.personal.findIndex(p => p.cl === id);
    if (index === -1) throw new Error('Personal no encontrado');
    
    this.personal.splice(index, 1);
  }
}
