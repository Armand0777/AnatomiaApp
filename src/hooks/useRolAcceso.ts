import { useAuthStore } from '../store/useAuthStore';

// Mismos UUIDs usados en useAuthStore.esDocente()
const ROL_ADMIN_ID = 'ca0f5ec0-745a-424d-b988-a7ed1e707758';
const ROL_DOCENTE_ID = '5a6b2e1d-3288-4fec-bd2d-74bdd9c1e69d';

interface RolAcceso {
  esAdmin: boolean;
  esDocente: boolean;
  esEstudiante: boolean;
  esInvitado: boolean;
  puedeEvaluar: boolean;
  puedeGestionar: boolean;
  puedeVerReportes: boolean;
}

// Centraliza las reglas de acceso por rol para todo el módulo de Autoevaluación
export function useRolAcceso(): RolAcceso {
  const usuario = useAuthStore((state) => state.usuario);

  const esInvitado = usuario?.es_invitado === true;
  const esAdmin = !esInvitado && usuario?.rol_id === ROL_ADMIN_ID;
  const esDocente = !esInvitado && usuario?.rol_id === ROL_DOCENTE_ID;
  const esEstudiante = !!usuario && !esInvitado && !esAdmin && !esDocente;

  return {
    esAdmin,
    esDocente,
    esEstudiante,
    esInvitado,
    puedeEvaluar: !!usuario && !esInvitado,
    puedeGestionar: esAdmin || esDocente,
    puedeVerReportes: esAdmin || esDocente,
  };
}
