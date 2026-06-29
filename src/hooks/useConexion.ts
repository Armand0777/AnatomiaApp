import { useEffect, useState } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

interface EstadoConexion {
  online: boolean;
  tipo: NetInfoStateType | null;
}

// Hook simple para saber si el dispositivo tiene conexión a internet.
// Se usará en las partes 2 y 3 para decidir cuándo sincronizar con Supabase
// y cuándo mostrar el contenido cacheado localmente.
export function useConexion(): EstadoConexion {
  const [estado, setEstado] = useState<EstadoConexion>({ online: true, tipo: null });

  useEffect(() => {
    // Lee el estado actual una vez al montar
    NetInfo.fetch().then((resultado) => {
      setEstado({ online: !!resultado.isConnected, tipo: resultado.type });
    });

    // Se suscribe a los cambios de conexión (ej. activar/desactivar modo avión)
    const desuscribir = NetInfo.addEventListener((resultado) => {
      setEstado({ online: !!resultado.isConnected, tipo: resultado.type });
    });

    return () => desuscribir();
  }, []);

  return estado;
}
