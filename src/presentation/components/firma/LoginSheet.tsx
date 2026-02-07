"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/presentation/components/ui/button";
import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/presentation/components/ui/sheet";
import { loginSchema } from "@/src/presentation/validators/loginSchema";
import { login } from "@/src/infrastructure/utils/auth-client";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginSheet({ open, onOpenChange }: LoginSheetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onSubmit",
    async onSubmit(event, context) {
      event.preventDefault();

      const submission = parseWithZod(context.formData, {
        schema: loginSchema,
      });

      if (submission.status !== "success") {
        return submission.reply();
      }

      setIsLoading(true);

      try {
        const result = await login({
          ci: submission.value.ci,
          clave: submission.value.clave,
        });

        toast.success("Inicio de sesión exitoso", {
          description: `Bienvenido ${result.user.nombres} ${result.user.apellidos}`,
        });

        onOpenChange(false);
        router.push("/dashboard");
      } catch (error) {
        toast.error("Error de autenticación", {
          description:
            error instanceof Error
              ? error.message
              : "CI o contraseña incorrectos",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Acceso Administrativo</SheetTitle>
          <SheetDescription>
            Ingresa tus credenciales para acceder al panel de administración
          </SheetDescription>
        </SheetHeader>

        <form id={form.id} onSubmit={form.onSubmit} noValidate className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor={fields.ci.id}>Cédula de Identidad</Label>
            <Input
              key={fields.ci.key}
              id={fields.ci.id}
              name={fields.ci.name}
              defaultValue={fields.ci.initialValue}
              placeholder="Ingresa tu cédula"
              autoComplete="username"
              disabled={isLoading}
            />
            {fields.ci.errors && (
              <p className="text-sm text-red-500">{fields.ci.errors}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={fields.clave.id}>Contraseña</Label>
            <Input
              key={fields.clave.key}
              id={fields.clave.id}
              name={fields.clave.name}
              type="password"
              defaultValue={fields.clave.initialValue}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              disabled={isLoading}
            />
            {fields.clave.errors && (
              <p className="text-sm text-red-500">{fields.clave.errors}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
