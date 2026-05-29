import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favoritos: string[]; // Lista de ids de temas favoritos
  cargando: boolean;
  cargarFavoritos: () => Promise<void>;
  agregarFavorito: (temaId: string) => Promise<void>;
  eliminarFavorito: (temaId: string) => Promise<void>;
  esFavorito: (temaId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoritos: [],
  cargando: false,

  cargarFavoritos: async () => {
    set({ cargando: true });
    try {
      const stored = await AsyncStorage.getItem('@AnatomiaApp:favoritos');
      if (stored) {
        set({ favoritos: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error al cargar favoritos de AsyncStorage:', error);
    } finally {
      set({ cargando: false });
    }
  },

  agregarFavorito: async (temaId: string) => {
    try {
      const { favoritos } = get();
      if (!favoritos.includes(temaId)) {
        const nuevosFavoritos = [...favoritos, temaId];
        set({ favoritos: nuevosFavoritos });
        await AsyncStorage.setItem('@AnatomiaApp:favoritos', JSON.stringify(nuevosFavoritos));
      }
    } catch (error) {
      console.error('Error al agregar tema a favoritos:', error);
    }
  },

  eliminarFavorito: async (temaId: string) => {
    try {
      const { favoritos } = get();
      const nuevosFavoritos = favoritos.filter(id => id !== temaId);
      set({ favoritos: nuevosFavoritos });
      await AsyncStorage.setItem('@AnatomiaApp:favoritos', JSON.stringify(nuevosFavoritos));
    } catch (error) {
      console.error('Error al eliminar tema de favoritos:', error);
    }
  },

  esFavorito: (temaId: string) => {
    return get().favoritos.includes(temaId);
  },
}));
