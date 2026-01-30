'use client';

import { useState } from 'react';
import { Pausa } from '@/src/domain/entities/Pausa';
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

interface PausaTableProps {
  pausas: Pausa[];
  onEdit: (pausa: Pausa) => void;
  onDelete: (id: number) => void;
  onSearch: (query: string) => void;
}

export function PausaTable({ pausas, onEdit, onDelete, onSearch }: PausaTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; pausa?: Pausa }>({
    open: false,
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Filtrado por frontend: no llamamos a onSearch para evitar recargas de API
    // onSearch(value); 
  };

  const filteredPausas = pausas.filter((pausa) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();

    // Búsqueda en todos los campos visibles y relevantes
    return (
      pausa.id.toString().includes(lowerQuery) ||
      pausa.estado.toLowerCase().includes(lowerQuery) ||
      pausa.subEstado.toLowerCase().includes(lowerQuery) ||
      pausa.fechaPausa.includes(lowerQuery) ||
      pausa.horaInicio.includes(lowerQuery) ||
      pausa.horaFin.includes(lowerQuery) ||
      (pausa.empleadoNombre && pausa.empleadoNombre.toLowerCase().includes(lowerQuery)) ||
      pausa.observacion.toLowerCase().includes(lowerQuery)
    );
  });

  const confirmDelete = async () => {
    if (deleteDialog.pausa) {
      try {
        await onDelete(deleteDialog.pausa.id);
        toast.success('Tiempo fuera de trabajo eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el registro');
      }
    }
    setDeleteDialog({ open: false });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tiempos Fuera de Trabajo</CardTitle>
            <div className="flex flex-col items-end gap-1">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sub Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora Inicio</TableHead>
                  <TableHead>Hora Fin</TableHead>
                  <TableHead>Empleados</TableHead>
                  <TableHead>Observación</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPausas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPausas.map((pausa) => (
                    <TableRow key={pausa.id}>
                      <TableCell className="font-medium">{pausa.id}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pausa.estado === 'Visita'
                            ? 'bg-blue-100 text-blue-800'
                            : pausa.estado === 'Permisos'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                            }`}
                        >
                          {pausa.estado}
                        </span>
                      </TableCell>
                      <TableCell>{pausa.subEstado}</TableCell>
                      <TableCell>{pausa.fechaPausa}</TableCell>
                      <TableCell>{pausa.horaInicio}</TableCell>
                      <TableCell>{pausa.horaFin}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {pausa.empleadoNombre ? (
                            <span className="font-medium text-slate-700">{pausa.empleadoNombre}</span>
                          ) : (
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {pausa.empleadosIds.length} empleado(s)
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {pausa.observacion}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(pausa)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ open: true, pausa })}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
              <span className="font-semibold">{deleteDialog.pausa?.estado}</span> del{' '}
              <span className="font-semibold">{deleteDialog.pausa?.fechaPausa}</span>.
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
