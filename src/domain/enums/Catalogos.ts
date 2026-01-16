export enum Area {
  ADMINISTRACION = 1,
  OPERACIONES = 2,
  VENTAS = 3,
  SOPORTE = 4,
}

export enum Turno {
  MANANA = 1,
  TARDE = 2,
  NOCHE = 3,
}

export enum Break {
  MANANA_10 = 1,
  TARDE_15 = 2,
}

export enum Almuerzo {
  MEDIO_DIA = 1,
  TARDE = 2,
}

export const AreaLabels: Record<Area, string> = {
  [Area.ADMINISTRACION]: 'Administración',
  [Area.OPERACIONES]: 'Operaciones',
  [Area.VENTAS]: 'Ventas',
  [Area.SOPORTE]: 'Soporte Técnico',
};

export const TurnoLabels: Record<Turno, string> = {
  [Turno.MANANA]: 'Mañana (8:00 - 16:00)',
  [Turno.TARDE]: 'Tarde (14:00 - 22:00)',
  [Turno.NOCHE]: 'Noche (22:00 - 6:00)',
};

export const BreakLabels: Record<Break, string> = {
  [Break.MANANA_10]: 'Break 10:00',
  [Break.TARDE_15]: 'Break 15:00',
};

export const AlmuerzoLabels: Record<Almuerzo, string> = {
  [Almuerzo.MEDIO_DIA]: 'Almuerzo 12:00',
  [Almuerzo.TARDE]: 'Almuerzo 14:00',
};
