'use client';

import { Users, Home, LogOut, Clock, Coffee, PauseCircle, FileText, ChevronDown, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/infrastructure/utils/utils';
import { Separator } from '@/src/presentation/components/ui/separator';
import { Button } from '@/src/presentation/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '@/src/presentation/hooks/useAuth';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Inicio',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Personal',
    icon: Users,
    href: '/dashboard/personal',
  },
  {
    title: 'Turnos',
    icon: Clock,
    href: '/dashboard/turnos',
  },
  {
    title: 'Tiempos Fuera de Trabajo',
    icon: PauseCircle,
    href: '/dashboard/pausas',
  },
  {
    title: 'Recesos',
    icon: Coffee,
    href: '/dashboard/recesos',
  },
];

const reportesItems = [
  {
    title: 'Jornada Total',
    href: '/dashboard/reportes/jornada-total',
  },
  {
    title: 'Pausas, Visitas, Reuniones',
    href: '/dashboard/reportes/pausas-visitas',
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout: handleLogout } = useAuth();
  const [isReportesOpen, setIsReportesOpen] = useState(pathname.startsWith('/dashboard/reportes'));

  const onLogout = () => {
    handleLogout();
    toast.success('Sesión cerrada exitosamente');
  };

  return (
    <div className={cn('pb-12 min-h-screen border-r bg-slate-50/50', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-2 px-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Control de Asistencias
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sistema de Gestión
            </p>
          </div>
          <Separator className="my-4" />
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100',
                      isActive
                        ? 'bg-slate-200 text-slate-900 font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                </Link>
              );
            })}

            {/* Menú desplegable de Reportes */}
            <div>
              <button
                onClick={() => setIsReportesOpen(!isReportesOpen)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100',
                  pathname.startsWith('/dashboard/reportes')
                    ? 'bg-slate-200 text-slate-900 font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <FileText className="h-4 w-4" />
                <span className="flex-1 text-left">Reportes</span>
                {isReportesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {isReportesOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                  {reportesItems.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100',
                            isActive
                              ? 'bg-slate-200 text-slate-900 font-medium'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          {item.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white space-y-3">
        {user && (
          <div className="px-3 py-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.nombres} {user.apellidos}
                </p>
                <p className="text-xs text-slate-500 truncate">CI: {user.ci}</p>
              </div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
