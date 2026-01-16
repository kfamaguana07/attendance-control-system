export interface PersonalData {
  ci: string;
  id_a: number;
  id_t: number;
  id_b: number;
  id_ba: number;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefonos: string;
  correo: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  fechaContrato: string;
  salario: number;
}

export class Personal {
  constructor(
    public cl: string,
    public ci: string,
    public id_a: number,
    public id_t: number,
    public id_b: number,
    public id_ba: number,
    public nombres: string,
    public apellidos: string,
    public direccion: string,
    public telefonos: string,
    public correo: string,
    public fechaNacimiento: string,
    public fechaIngreso: string,
    public fechaContrato: string,
    public salario: number
  ) {}

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }
}
