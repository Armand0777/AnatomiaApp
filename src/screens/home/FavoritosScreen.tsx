import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { unidadesService } from '../../services/unidadesService';

interface TemaFavorito {
  id: string;
  unidad_id: string;
  titulo: string;
  orden: number;
  unidades?: {
    numero: number;
    titulo: string;
  };
}

export default function FavoritosScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  
  const { favoritos, cargando, cargarFavoritos, eliminarFavorito } = useFavoritesStore();
  const [detallesTemas, setDetallesTemas] = useState<TemaFavorito[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Recargar favoritos de AsyncStorage cuando el screen entra en foco
  useEffect(() => {
    if (isFocused) {
      cargarFavoritos();
    }
  }, [isFocused]);

  // Consultar Supabase cuando cambie la lista de ids favoritos de la store
  useEffect(() => {
    const fetchDetalles = async () => {
      if (favoritos.length === 0) {
        setDetallesTemas([]);
        return;
      }
      
      setLoadingData(true);
      try {
        const data = await unidadesService.getTemasPorIds(favoritos);
        
        // Ordenar los favoritos según aparezcan en favoritos de la store para consistencia
        const sorted = data.sort((a, b) => favoritos.indexOf(a.id) - favoritos.indexOf(b.id));
        setDetallesTemas(sorted);
      } catch (error) {
        console.error('Error cargando detalles de favoritos:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDetalles();
  }, [favoritos]);

  const handleQuitarFavorito = async (temaId: string) => {
    await eliminarFavorito(temaId);
  };

  const getUnidadEmoji = (numero: number) => {
    switch (numero) {
      case 1: return '💀';
      case 2: return '💪';
      case 3: return '👁️';
      case 4: return '🫁';
      default: return '📖';
    }
  };

  const renderItem = ({ item }: { item: TemaFavorito }) => {
    const unidadNum = item.unidades?.numero || 1;
    const unidadTit = item.unidades?.titulo || 'Unidad';
    const emoji = getUnidadEmoji(unidadNum);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('ContenidoTema', {
            temaId: item.id,
            temaTitulo: item.titulo,
            temaOrden: item.orden,
            unidadNumero: unidadNum,
            unidadId: item.unidad_id,
            unidadTitulo: unidadTit,
          });
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardUnidad}>
            {emoji} Unidad {unidadNum}
          </Text>
          <TouchableOpacity
            style={styles.heartIcon}
            onPress={() => handleQuitarFavorito(item.id)}
          >
            <Icon name="heart" size={24} color="#E53935" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {unidadTit}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header con Hamburguesa y Campana */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Favoritos</Text>
          <Text style={styles.headerSubtitle}>Mis temas guardados</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {cargando || loadingData ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando tus apuntes...</Text>
        </View>
      ) : detallesTemas.length > 0 ? (
        <FlatList
          data={detallesTemas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Icon name="heart-outline" size={72} color={COLORS.border} />
          <Text style={styles.emptyTitle}>¡Tus favoritos están vacíos!</Text>
          <Text style={styles.emptyDesc}>
            Guarda temas de Anatomía tocando el ícono de marcador en la esquina superior derecha del contenido teórico.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  iconButton: {
    padding: 5,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.headerText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.headerText,
    fontSize: 12,
    opacity: 0.8,
  },
  listContent: {
    padding: 15,
    paddingBottom: 100, // Espacio para el navbar flotante
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardUnidad: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heartIcon: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
