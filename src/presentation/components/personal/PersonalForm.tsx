'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/src/presentation/components/ui/button';
import { Input } from '@/src/presentation/components/ui/input';
import { Label } from '@/src/presentation/components/ui/label';
import { personalSchema } from '@/src/presentation/validators/personalSchema';
import { MockPersonalRepository } from '@/src/infrastructure/repositories/MockPersonalRepository';
import { CreatePersonalUseCase } from '@/src/application/use-cases/CreatePersonalUseCase';

const personalRepository = new MockPersonalRepository();
const createPersonalUseCase = new CreatePersonalUseCase(personalRepository);

interface PersonalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PersonalForm({ onSuccess, onCancel }: PersonalFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      // Convertir campos numéricos
      const data = Object.fromEntries(formData.entries());
      const parsedData = {
        ...data,
        id_a: Number(data.id_a),
        id_t: Number(data.id_t),
        id_b: Number(data.id_b),
        id_ba: Number(data.id_ba),
        salario: Number(data.salario),
      };
      
      return parseWithZod(new URLSearchParams(Object.entries(parsedData).map(([k, v]) => [k, String(v)])), { 
        schema: personalSchema 
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    async onSubmit(event, context) {
      event.preventDefault();
      
      const data = Object.fromEntries(context.formData.entries());
      const parsedData = {
        ...data,
        id_a: Number(data.id_a),
        id_t: Number(data.id_t),
        id_b: Number(data.id_b),
        id_ba: Number(data.id_ba),
        salario: Number(data.salario),
      };

      const submission = parseWithZod(
        new URLSearchParams(Object.entries(parsedData).map(([k, v]) => [k, String(v)])), 
        { schema: personalSchema }
      );

      if (submission.status !== 'success') {
        return submission.reply();
      }

      setIsLoading(true);

      try {
        await createPersonalUseCase.execute({
          id_a: submission.value.id_a,
          id_t: submission.value.id_t,
          id_b: submission.value.id_b,
          id_ba: submission.value.id_ba,
          nombres: submission.value.nombres,
          apellidos: submission.value.apellidos,
          direccion: submission.value.direccion,
          telefonos: submission.value.telefonos,
          correo: submission.value.correo,
          fechaNacimiento: submission.value.fechaNacimiento,
          fechaIngreso: submission.value.fechaIngreso,
          fechaContrato: submission.value.fechaContrato,
          salario: submission.value.salario,
        });

        onSuccess();
      } catch (error) {
        toast.error('Error al crear personal', {
          description: error instanceof Error ? error.message : 'Error desconocido',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={fields.nombres.id}>Nombres *</Label>
          <Input
            key={fields.nombres.key}
            id={fields.nombres.id}
            name={fields.nombres.name}
            defaultValue={fields.nombres.initialValue}
            disabled={isLoading}
            placeholder="Juan"
          />
          {fields.nombres.errors && (
            <p className="text-sm text-red-500">{fields.nombres.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.apellidos.id}>Apellidos *</Label>
          <Input
            key={fields.apellidos.key}
            id={fields.apellidos.id}
            name={fields.apellidos.name}
            defaultValue={fields.apellidos.initialValue}
            disabled={isLoading}
            placeholder="Pérez García"
          />
          {fields.apellidos.errors && (
            <p className="text-sm text-red-500">{fields.apellidos.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.correo.id}>Correo Electrónico *</Label>
          <Input
            key={fields.correo.key}
            id={fields.correo.id}
            name={fields.correo.name}
            type="email"
            defaultValue={fields.correo.initialValue}
            disabled={isLoading}
            placeholder="juan.perez@example.com"
          />
          {fields.correo.errors && (
            <p className="text-sm text-red-500">{fields.correo.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.telefonos.id}>Teléfono *</Label>
          <Input
            key={fields.telefonos.key}
            id={fields.telefonos.id}
            name={fields.telefonos.name}
            defaultValue={fields.telefonos.initialValue}
            disabled={isLoading}
            placeholder="555-0001"
          />
          {fields.telefonos.errors && (
            <p className="text-sm text-red-500">{fields.telefonos.errors}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={fields.direccion.id}>Dirección *</Label>
          <Input
            key={fields.direccion.key}
            id={fields.direccion.id}
            name={fields.direccion.name}
            defaultValue={fields.direccion.initialValue}
            disabled={isLoading}
            placeholder="Av. Principal 123"
          />
          {fields.direccion.errors && (
            <p className="text-sm text-red-500">{fields.direccion.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.fechaNacimiento.id}>Fecha de Nacimiento *</Label>
          <Input
            key={fields.fechaNacimiento.key}
            id={fields.fechaNacimiento.id}
            name={fields.fechaNacimiento.name}
            type="date"
            defaultValue={fields.fechaNacimiento.initialValue}
            disabled={isLoading}
          />
          {fields.fechaNacimiento.errors && (
            <p className="text-sm text-red-500">{fields.fechaNacimiento.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.fechaIngreso.id}>Fecha de Ingreso *</Label>
          <Input
            key={fields.fechaIngreso.key}
            id={fields.fechaIngreso.id}
            name={fields.fechaIngreso.name}
            type="date"
            defaultValue={fields.fechaIngreso.initialValue}
            disabled={isLoading}
          />
          {fields.fechaIngreso.errors && (
            <p className="text-sm text-red-500">{fields.fechaIngreso.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.fechaContrato.id}>Fecha de Contrato *</Label>
          <Input
            key={fields.fechaContrato.key}
            id={fields.fechaContrato.id}
            name={fields.fechaContrato.name}
            type="date"
            defaultValue={fields.fechaContrato.initialValue}
            disabled={isLoading}
          />
          {fields.fechaContrato.errors && (
            <p className="text-sm text-red-500">{fields.fechaContrato.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.salario.id}>Salario *</Label>
          <Input
            key={fields.salario.key}
            id={fields.salario.id}
            name={fields.salario.name}
            type="number"
            step="0.01"
            defaultValue={fields.salario.initialValue}
            disabled={isLoading}
            placeholder="2500.00"
          />
          {fields.salario.errors && (
            <p className="text-sm text-red-500">{fields.salario.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.id_a.id}>ID_A *</Label>
          <Input
            key={fields.id_a.key}
            id={fields.id_a.id}
            name={fields.id_a.name}
            type="number"
            defaultValue={fields.id_a.initialValue || '1'}
            disabled={isLoading}
          />
          {fields.id_a.errors && (
            <p className="text-sm text-red-500">{fields.id_a.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.id_t.id}>ID_T *</Label>
          <Input
            key={fields.id_t.key}
            id={fields.id_t.id}
            name={fields.id_t.name}
            type="number"
            defaultValue={fields.id_t.initialValue || '1'}
            disabled={isLoading}
          />
          {fields.id_t.errors && (
            <p className="text-sm text-red-500">{fields.id_t.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.id_b.id}>ID_B *</Label>
          <Input
            key={fields.id_b.key}
            id={fields.id_b.id}
            name={fields.id_b.name}
            type="number"
            defaultValue={fields.id_b.initialValue || '1'}
            disabled={isLoading}
          />
          {fields.id_b.errors && (
            <p className="text-sm text-red-500">{fields.id_b.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fields.id_ba.id}>ID_BA *</Label>
          <Input
            key={fields.id_ba.key}
            id={fields.id_ba.id}
            name={fields.id_ba.name}
            type="number"
            defaultValue={fields.id_ba.initialValue || '1'}
            disabled={isLoading}
          />
          {fields.id_ba.errors && (
            <p className="text-sm text-red-500">{fields.id_ba.errors}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Personal'}
        </Button>
      </div>
    </form>
  );
}
