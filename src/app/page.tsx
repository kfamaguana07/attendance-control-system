"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DatosFirma } from "@/src/presentation/components/firma/DatosFirma";
import { Cronometro } from "@/src/presentation/components/firma/Cronometro";
import { RegistroFirma } from "@/src/presentation/components/firma/RegistroFirma";
import { LoginSheet } from "@/src/presentation/components/firma/LoginSheet";
import { FirmasApiClient } from "@/src/infrastructure/api-clients/FirmasApiClient";
import { Firma } from "@/src/domain/entities/Firma";
import { FirmaDTO } from "@/src/presentation/dtos/FirmaDTO";
import { Button } from "@/src/presentation/components/ui/button";
import { LogIn } from "lucide-react";

const firmasApiClient = new FirmasApiClient();

export default function HomePage() {
  const [firma, setFirma] = useState<Firma | null>(null);
  const [firmaDTO, setFirmaDTO] = useState<FirmaDTO | null>(null);
  const [empleadoNombre, setEmpleadoNombre] = useState("Empleado");
  const [loginOpen, setLoginOpen] = useState(false);

  const handleRegistrarFirma = async (firmaInput: string) => {
    if (!firmaInput) {
      toast.error('Por favor ingresa tu cédula primero');
      return;
    }

    try {
      // Procesar firma usando SOLO el endpoint /firmas/procesar
      const today = new Date().toISOString().split('T')[0];
      const horaActual = new Date().toLocaleTimeString('es-EC', { hour12: false });
      
      const response = await firmasApiClient.procesarFirma({
        ci: firmaInput,
        fecha_firma: today,
        hora_actual: horaActual
      });
      
      if (response.success && response.data) {
        toast.success(response.message || 'Firma registrada correctamente');
        
        // Actualizar inmediatamente con los datos de la respuesta
        const firmaData = new Firma(
          response.data.fecha_firma,
          response.data.h_i_jornada,
          response.data.a_i_jornada,
          response.data.h_i_break,
          response.data.h_f_break,
          response.data.a_f_break,
          response.data.h_i_almuerzo,
          response.data.h_f_almuerzo,
          response.data.a_f_almuerzo,
          response.data.h_f_jornada,
          response.data.ci,
          response.data.id_t,
          response.data.id_b,
          response.data.id_ba
        );
        
        setFirma(firmaData);
        
        // Convertir a DTO para mostrar en los inputs
        const dto: FirmaDTO = {
          fechaFirma: response.data.fecha_firma,
          hIJornada: response.data.h_i_jornada,
          aIJornada: response.data.a_i_jornada,
          hIBreak: response.data.h_i_break,
          hFBreak: response.data.h_f_break,
          aFBreak: response.data.a_f_break,
          hIAlmuerzo: response.data.h_i_almuerzo,
          hFAlmuerzo: response.data.h_f_almuerzo,
          aFAlmuerzo: response.data.a_f_almuerzo,
          hFJornada: response.data.h_f_jornada,
          ci: response.data.ci,
          idT: response.data.id_t,
          idB: response.data.id_b,
          idBa: response.data.id_ba,
        };
        setFirmaDTO(dto);
        
        // Actualizar nombre del empleado si viene en la respuesta
        if (response.data.empleado) {
          setEmpleadoNombre(`${response.data.empleado.nombres.trim()} ${response.data.empleado.apellidos.trim()}`);
        }
      } else {
        // Mostrar el error específico que retorna la API
        const errorMessage = (response as any).error || response.message || 'Error al registrar firma';
        
        // Limpiar los campos cuando hay error para que no se muestren datos antiguos
        setFirma(null);
        setFirmaDTO(null);
        setEmpleadoNombre("Empleado");
        
        // Determinar el tipo de toast según el error
        if (errorMessage.includes('ya ha sido completada')) {
          toast.warning(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Error al registrar firma:', error);
      
      // Manejar errores específicos
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('ya ha sido completada')) {
        toast.warning('Tu jornada de hoy ya está completa. No puedes registrar más eventos.');
      } else if (errorMsg.includes('404') || errorMsg.includes('no encontrado')) {
        toast.error('Empleado no encontrado. Verifica tu cédula.');
      } else if (errorMsg.includes('400')) {
        toast.error(errorMsg.replace('HTTP Error: 400 Bad Request', '').trim() || 'Error en la solicitud');
      } else {
        toast.error('Error al registrar la firma. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sistema de Control de Asistencias
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Base de Firmas
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setLoginOpen(true)}>
              <LogIn className="h-4 w-4" />
              Acceso Administrativo
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Datos de firma */}
          <div className="lg:col-span-2">
            <DatosFirma firma={firmaDTO} empleadoNombre={empleadoNombre} />
          </div>

          {/* Panel derecho - Cronómetro y firma */}
          <div className="space-y-6">
            <Cronometro firma={firma} />
            <RegistroFirma onRegistrarFirma={handleRegistrarFirma} />
          </div>
        </div>
      </div>

      {/* Login Sheet */}
      <LoginSheet open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
