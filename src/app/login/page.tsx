'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/src/presentation/components/ui/button';
import { Input } from '@/src/presentation/components/ui/input';
import { Label } from '@/src/presentation/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/presentation/components/ui/card';
import { loginSchema } from '@/src/presentation/validators/loginSchema';
import { MockAuthRepository } from '@/src/infrastructure/repositories/MockAuthRepository';
import { LoginUseCase } from '@/src/application/use-cases/LoginUseCase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const authRepository = new MockAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    async onSubmit(event, context) {
      event.preventDefault();
      
      const submission = parseWithZod(context.formData, {
        schema: loginSchema,
      });

      if (submission.status !== 'success') {
        return submission.reply();
      }

      setIsLoading(true);

      try {
        const user = await loginUseCase.execute(
          submission.value.username,
          submission.value.password
        );

        toast.success('Inicio de sesión exitoso', {
          description: `Bienvenido ${user.username}`,
        });

        router.push('/dashboard');
      } catch (error) {
        toast.error('Error de autenticación', {
          description: error instanceof Error ? error.message : 'Usuario o contraseña incorrectos',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">
              Acceso Administrativo
            </CardTitle>
          </div>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id={form.id} onSubmit={form.onSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={fields.username.id}>Usuario</Label>
              <Input
                key={fields.username.key}
                id={fields.username.id}
                name={fields.username.name}
                defaultValue={fields.username.initialValue}
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                disabled={isLoading}
              />
              {fields.username.errors && (
                <p className="text-sm text-red-500">{fields.username.errors}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fields.password.id}>Contraseña</Label>
              <Input
                key={fields.password.key}
                id={fields.password.id}
                name={fields.password.name}
                type="password"
                defaultValue={fields.password.initialValue}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                disabled={isLoading}
              />
              {fields.password.errors && (
                <p className="text-sm text-red-500">{fields.password.errors}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
