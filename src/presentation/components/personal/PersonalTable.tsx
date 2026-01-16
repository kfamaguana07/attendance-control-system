'use client';

import { Personal } from '@/src/domain/entities/Personal';
import { AreaLabels, TurnoLabels, BreakLabels, AlmuerzoLabels } from '@/src/domain/enums/Catalogos';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/presentation/components/ui/table';

interface PersonalTableProps {
  personal: Personal[];
  isLoading: boolean;
  onSelectPersonal?: (personal: Personal) => void;
}

export function PersonalTable({ personal, isLoading, onSelectPersonal }: PersonalTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando personal...
      </div>
    );
  }

  if (personal.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No hay personal registrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CI</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Break</TableHead>
            <TableHead>Almuerzo</TableHead>
            <TableHead>Nombres</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead className="text-right">Salario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personal.map((p) => (
            <TableRow 
              key={p.cl} 
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onSelectPersonal?.(p)}
            >
              <TableCell className="font-medium">{p.ci}</TableCell>
              <TableCell>{AreaLabels[p.id_a as keyof typeof AreaLabels]}</TableCell>
              <TableCell>{TurnoLabels[p.id_t as keyof typeof TurnoLabels]}</TableCell>
              <TableCell>{BreakLabels[p.id_b as keyof typeof BreakLabels]}</TableCell>
              <TableCell>{AlmuerzoLabels[p.id_ba as keyof typeof AlmuerzoLabels]}</TableCell>
              <TableCell>{p.nombres}</TableCell>
              <TableCell>{p.apellidos}</TableCell>
              <TableCell>{p.telefonos}</TableCell>
              <TableCell>{p.correo}</TableCell>
              <TableCell>{p.fechaIngreso}</TableCell>
              <TableCell className="text-right">
                ${p.salario.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
