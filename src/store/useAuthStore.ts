import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { Usuario } from '../types';

interface AuthState {
  usuario: Usuario | null;
  sesion: Session | null;
  cargando: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  loginInvitado: () => void;
  logout: () => Promise<void>;
  cargarSesion: () => Promise<void>;
  esDocente: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  sesion: null,
  cargando: false,
  error: null,
  
  esDocente: (): boolean => {
    const estado = get();
    // Verificamos si es admin o docente
    const rol = estado.usuario?.rol_id;
    return rol === 'ca0f5ec0-745a-424d-b988-a7ed1e707758' || rol === '5a6b2e1d-3288-4fec-bd2d-74bdd9c1e69d';
  },

  // Autenticación con email y contraseña mediante Supabase
  login: async (email, password) => {
    set({ cargando: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Consultar la tabla de usuarios públicos para tener los datos de perfil
      if (data.user) {
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (usuarioError) throw usuarioError;

        set({
          sesion: data.session,
          usuario: usuarioData as Usuario,
          cargando: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message, cargando: false });
    }
  },

  // Registro de nuevo usuario
  register: async (email, password, nombre) => {
    set({ cargando: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
          }
        }
      });

      if (error) throw error;

      // Hacemos login automáticamente o esperamos a cargar sesión
      // (Supabase a veces autologuea si no hay confirmación de email)
      if (data.session) {
        // Darle 1 segundo al trigger para que inserte en public.usuarios antes de consultar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user!.id)
          .single();

        if (usuarioError) throw usuarioError;

        set({
          sesion: data.session,
          usuario: usuarioData as Usuario,
          cargando: false,
        });
      } else {
        set({ cargando: false });
      }
    } catch (err: any) {
      set({ error: err.message, cargando: false });
    }
  },

  // Modo invitado sin autenticación real en Supabase
  loginInvitado: () => {
    const usuarioInvitado: Usuario = {
      id: 'invitado',
      nombre: 'Usuario Invitado',
      email: 'invitado@app.com',
      rol_id: '00000000-0000-0000-0000-000000000000',
      avatar_url: null,
      es_invitado: true,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set({
      usuario: usuarioInvitado,
      sesion: {
        access_token: 'fake-token',
        refresh_token: 'fake-refresh-token',
        expires_in: 3600,
        expires_at: 3600,
        token_type: 'bearer',
        user: { id: 'invitado', app_metadata: {}, user_metadata: {}, aud: '', created_at: '' }
      } as Session,
      error: null,
      cargando: false,
    });
  },

  // Cerrar sesión
  logout: async () => {
    set({ cargando: true, error: null });
    try {
      await supabase.auth.signOut();
      set({ usuario: null, sesion: null, cargando: false });
    } catch (err: any) {
      set({ error: err.message, cargando: false });
    }
  },

  // Carga inicial de sesión al arrancar la app
  cargarSesion: async () => {
    set({ cargando: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: usuarioData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          sesion: session, 
          usuario: usuarioData as Usuario, 
          cargando: false 
        });
      } else {
        set({ sesion: null, usuario: null, cargando: false });
      }
    } catch (err: any) {
      set({ error: err.message, cargando: false });
    }
  },
}));
