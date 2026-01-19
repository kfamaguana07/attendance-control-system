export class Receso {
  constructor(
    public id: number,
    public id_t: number,
    public hora_inicio: string,
    public hora_fin: string,
    public hora_total: string,
    public nombre: string,
    public descripcion: string,
    public tipo: string
  ) {}
}
