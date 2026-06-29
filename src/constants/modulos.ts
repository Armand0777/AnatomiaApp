import { COLORS } from './colors';

// Identidad visual por módulo: cada área de la app tiene su propio ícono e
// color de acento, reutilizados tanto en el Drawer como en las tarjetas del Home.
export interface ModuloVisual {
  icon: string;
  color: string;
}

export const MODULOS: Record<string, ModuloVisual> = {
  inicio: { icon: 'view-dashboard-outline', color: COLORS.primary },
  unidades: { icon: 'head-outline', color: COLORS.primary },
  biblioteca: { icon: 'play-box-multiple-outline', color: COLORS.secondary },
  autoevaluacion: { icon: 'clipboard-pulse-outline', color: '#673AB7' },
  panelDocente: { icon: 'shield-account-outline', color: '#C62828' },
  gestion: { icon: 'cog-outline', color: '#455A64' },
  acercaDe: { icon: 'school-outline', color: '#757575' },
  perfil: { icon: 'account-circle-outline', color: '#0288D1' },
};
