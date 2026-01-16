export interface PersonalDTO {
  cl: string;
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

export interface CreatePersonalDTO {
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
