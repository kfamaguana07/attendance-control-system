"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card";
import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import { Button } from "@/src/presentation/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { firmaSchema } from "@/src/presentation/validators/firmaSchema";

interface RegistroFirmaProps {
  onRegistrarFirma: (firma: string) => Promise<void>;
}

export function RegistroFirma({ onRegistrarFirma }: RegistroFirmaProps) {
  const [firma, setFirma] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: firmaSchema });
    },
    shouldValidate: "onSubmit",
    async onSubmit(event) {
      event.preventDefault();
      
      const formData = new FormData(event.currentTarget);
      const submission = parseWithZod(formData, { schema: firmaSchema });

      if (submission.status !== "success") {
        return;
      }

      setIsLoading(true);

      try {
        await onRegistrarFirma(submission.value.firma);
        setFirma("");
        // No mostrar toast aquí, lo maneja la función onRegistrarFirma
      } catch (error) {
        // Solo mostrar error si la función lanza una excepción
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firma</CardTitle>
      </CardHeader>
      <CardContent>
        <form id={form.id} onSubmit={form.onSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={fields.firma.id}>Ingresa tu firma:</Label>
            <Input
              key={fields.firma.key}
              id={fields.firma.id}
              name={fields.firma.name}
              value={firma}
              onChange={(e) => setFirma(e.target.value)}
              placeholder="Ingresa tu firma digital"
              className={fields.firma.errors ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {fields.firma.errors && (
              <p className="text-sm text-red-500">{fields.firma.errors[0]}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar Firma"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
