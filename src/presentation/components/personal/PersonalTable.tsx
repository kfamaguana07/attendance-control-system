'use client';

import { useState, useEffect } from 'react';
import { Personal } from '@/src/domain/entities/Personal';
import { Turno as TurnoEntity } from '@/src/domain/entities/Turno';
import { AreaLabels } from '@/src/domain/enums/Catalogos';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/presentation/components/ui/table';
import { Button } from '@/src/presentation/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/presentation/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalTableProps {
  personal: Personal[];
  isLoading: boolean;
  onSelectPersonal?: (personal: Personal) => void;
  onEdit?: (personal: Personal) => void;
  onDelete?: (ci: string) => void;
}

export function PersonalTable({ personal, isLoading, onSelectPersonal, onEdit, onDelete }: PersonalTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; personal?: Personal }>({
    open: false,
  });
  const [turnos, setTurnos] = useState<TurnoEntity[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const turnosRes = await fetch('/api/orchestrator?resource=turnos');
        
        if (turnosRes.ok) {
          const turnosData = await turnosRes.json();
          setTurnos(turnosData.data || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const getTurnoNombre = (idT: number) => {
    const turno = turnos.find(t => t.id === idT);
    return turno ? turno.nombre : `ID: ${idT}`;
  };

  const confirmDelete = async () => {
    if (deleteDialog.personal && onDelete) {
      try {
        await onDelete(deleteDialog.personal.ci);
        toast.success('Personal eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el personal');
      }
    }
    setDeleteDialog({ open: false });
  };

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
    <>
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CI</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Fecha Ingreso</TableHead>
              <TableHead className="text-right">Salario</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personal.map((p) => (
              <TableRow 
                key={p.cl} 
                className="hover:bg-slate-50"
              >
                <TableCell className="font-medium">{p.ci}</TableCell>
                <TableCell>{AreaLabels[p.id_a as keyof typeof AreaLabels]}</TableCell>
                <TableCell>{loadingData ? 'Cargando...' : getTurnoNombre(p.id_t)}</TableCell>
                <TableCell>{p.nombres}</TableCell>
                <TableCell>{p.apellidos}</TableCell>
                <TableCell>{p.telefonos}</TableCell>
                <TableCell>{p.correo}</TableCell>
                <TableCell>{p.fechaIngreso}</TableCell>
                <TableCell className="text-right">
                  ${p.salario.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(p);
                      }}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialog({ open: true, personal: p });
                      }}
                      title="Eliminar"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el personal{' '}
              <span className="font-semibold">&quot;{deleteDialog.personal?.nombres} {deleteDialog.personal?.apellidos}&quot;</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
