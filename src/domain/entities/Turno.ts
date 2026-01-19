export interface TurnoData {
  id?: number;
  horaInicio: string;
  horaFin: string;
  horaTotal: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export class Turno {
  constructor(
    public id: number,
    public horaInicio: string,
    public horaFin: string,
    public horaTotal: string,
    public nombre: string,
    public descripcion: string,
    public tipo: string
  ) {}

  static calcularHoraTotal(horaInicio: string, horaFin: string): string {
    if (!horaInicio || !horaFin || horaInicio === '<<SELECCIONA>>' || horaFin === '<<SELECCIONA>>') {
      return '00:00:00';
    }

    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [finHoras, finMinutos] = horaFin.split(':').map(Number);

    const inicioEnMinutos = inicioHoras * 60 + inicioMinutos;
    const finEnMinutos = finHoras * 60 + finMinutos;

    let diferenciaMinutos = finEnMinutos - inicioEnMinutos;
    
    // Si la hora de fin es menor que la de inicio, asumimos que cruza la medianoche
    if (diferenciaMinutos < 0) {
      diferenciaMinutos += 24 * 60;
    }

    const horas = Math.floor(diferenciaMinutos / 60);
    const minutos = diferenciaMinutos % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
  }

  get esAdicional(): boolean {
    return this.tipo === 'ADICIONAL';
  }
}
