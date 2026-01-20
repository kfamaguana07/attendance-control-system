"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card";
import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import { Separator } from "@/src/presentation/components/ui/separator";
import { FirmaDTO } from "@/src/presentation/dtos/FirmaDTO";

interface DatosFirmaProps {
  firma: FirmaDTO | null;
  empleadoNombre: string;
}

export function DatosFirma({ firma, empleadoNombre }: DatosFirmaProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Datos de tu firma</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Empleado */}
        <div className="space-y-2">
          <Label>Empleado:</Label>
          <Input value={empleadoNombre} disabled className="bg-gray-50" />
        </div>

        <Separator />

        {/* Ingreso de jornada */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ingreso de tu jornada:</Label>
            <Input
              value={firma?.hIJornada || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
          <div className="space-y-2">
            <Label>Atraso:</Label>
            <Input
              value={firma?.aIJornada || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
        </div>

        {/* Salida al break */}
        <div className="space-y-2">
          <Label>Salida al break:</Label>
          <Input
            value={firma?.hIBreak || ""}
            disabled
            className="bg-gray-50"
            placeholder="--:--:--"
          />
        </div>

        {/* Regreso del break */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Regreso del break:</Label>
            <Input
              value={firma?.hFBreak || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
          <div className="space-y-2">
            <Label>Atraso:</Label>
            <Input
              value={firma?.aFBreak || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
        </div>

        {/* Salida al almuerzo */}
        <div className="space-y-2">
          <Label>Salida al almuerzo:</Label>
          <Input
            value={firma?.hIAlmuerzo || ""}
            disabled
            className="bg-gray-50"
            placeholder="--:--:--"
          />
        </div>

        {/* Regreso del almuerzo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Regreso del almuerzo:</Label>
            <Input
              value={firma?.hFAlmuerzo || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
          <div className="space-y-2">
            <Label>Atraso:</Label>
            <Input
              value={firma?.aFAlmuerzo || ""}
              disabled
              className="bg-gray-50"
              placeholder="--:--:--"
            />
          </div>
        </div>

        {/* Salida de jornada */}
        <div className="space-y-2">
          <Label>Salida de tu jornada:</Label>
          <Input
            value={firma?.hFJornada || ""}
            disabled
            className="bg-gray-50"
            placeholder="--:--:--"
          />
        </div>
      </CardContent>
    </Card>
  );
}
