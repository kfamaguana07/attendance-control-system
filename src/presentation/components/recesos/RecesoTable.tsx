'use client';

import { useState } from 'react';
import { Receso } from '@/src/domain/entities/Receso';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/presentation/components/ui/table';
import { Button } from '@/src/presentation/components/ui/button';
import { Input } from '@/src/presentation/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/presentation/components/ui/card';
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
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface RecesoTableProps {
  recesos: Receso[];
  onEdit: (receso: Receso) => void;
  onDelete: (id: number) => void;
  onSearch: (query: string) => void;
}

export function RecesoTable({ recesos, onEdit, onDelete, onSearch }: RecesoTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; receso?: Receso }>({
    open: false,
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const confirmDelete = async () => {
    if (deleteDialog.receso) {
      try {
        await onDelete(deleteDialog.receso.id);
        toast.success('Receso eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el receso');
      }
    }
    setDeleteDialog({ open: false });
  };

  const getTurnoNombre = (id_t: number): string => {
    const turnos: Record<number, string> = {
      1: 'Turno Mañana',
      2: 'Turno Tarde',
      3: 'Turno Noche',
    };
    return turnos[id_t] || 'Desconocido';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recesos</CardTitle>
            <div className="flex items-center gap-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Hora Inicio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recesos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No se encontraron recesos
                    </TableCell>
                  </TableRow>
                ) : (
                  recesos.map((receso) => (
                    <TableRow key={receso.id}>
                      <TableCell className="font-medium">{receso.id}</TableCell>
                      <TableCell>{receso.hora_inicio}</TableCell>
                      <TableCell>{receso.hora_fin}</TableCell>
                      <TableCell>{receso.hora_total}</TableCell>
                      <TableCell>{receso.nombre}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {receso.descripcion}
                      </TableCell>
                      <TableCell>{getTurnoNombre(receso.id_t)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            receso.tipo === 'BREAK'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {receso.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(receso)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ open: true, receso })}
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el receso{' '}
              <span className="font-semibold">&quot;{deleteDialog.receso?.nombre}&quot;</span>.
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
