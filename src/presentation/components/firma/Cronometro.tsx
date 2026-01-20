"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card";
import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import { Separator } from "@/src/presentation/components/ui/separator";
import { useEffect, useState } from "react";
import { Firma } from "@/src/domain/entities/Firma";

interface CronometroProps {
  firma: Firma | null;
}

export function Cronometro({ firma }: CronometroProps) {
  const [tiempoBreak, setTiempoBreak] = useState("00:00:00");
  const [tiempoAlmuerzo, setTiempoAlmuerzo] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      if (firma) {
        // Si hay hora de inicio de break pero no de fin, calcular tiempo transcurrido
        if (firma.hIBreak && !firma.hFBreak) {
          const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });
          setTiempoBreak(Firma.calcularTiempoTranscurrido(firma.hIBreak, horaActual));
        } else if (firma.hIBreak && firma.hFBreak) {
          // Si ya terminó el break, mostrar el tiempo total
          setTiempoBreak(firma.getTiempoBreak());
        } else {
          setTiempoBreak("00:00:00");
        }

        // Lo mismo para almuerzo
        if (firma.hIAlmuerzo && !firma.hFAlmuerzo) {
          const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });
          setTiempoAlmuerzo(Firma.calcularTiempoTranscurrido(firma.hIAlmuerzo, horaActual));
        } else if (firma.hIAlmuerzo && firma.hFAlmuerzo) {
          setTiempoAlmuerzo(firma.getTiempoAlmuerzo());
        } else {
          setTiempoAlmuerzo("00:00:00");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [firma]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronómetro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Break:</Label>
          <Input
            value={tiempoBreak}
            disabled
            className="bg-gray-50 text-center text-lg font-mono"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Almuerzo:</Label>
          <Input
            value={tiempoAlmuerzo}
            disabled
            className="bg-gray-50 text-center text-lg font-mono"
          />
        </div>
      </CardContent>
    </Card>
  );
}
