import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService } from '../../services/unidadesService';

interface TemaBusqueda {
  id: string;
  unidad_id: string;
  titulo: string;
  orden: number;
  unidades?: {
    numero: number;
    titulo: string;
  };
}

export default function BuscarScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<TemaBusqueda[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResultados([]);
      setBuscado(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      ejecutarBusqueda();
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const ejecutarBusqueda = async () => {
    if (query.trim() === '') return;
    setLoading(true);
    try {
      const data = await unidadesService.buscarTemas(query);
      setResultados(data);
      setBuscado(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setQuery('');
    setResultados([]);
    setBuscado(false);
    Keyboard.dismiss();
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

  const renderItem = ({ item }: { item: TemaBusqueda }) => {
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
          <Icon name="chevron-right" size={20} color={COLORS.primary} />
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
          <Text style={styles.headerTitle}>Buscar</Text>
          <Text style={styles.headerSubtitle}>Temas anatómicos</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Input de Búsqueda */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInner}>
          <Icon name="magnify" size={22} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar por hueso, músculo, órgano..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={ejecutarBusqueda}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={limpiarBusqueda} style={styles.clearButton}>
              <Icon name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido / Listado */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Buscando estructuras...</Text>
        </View>
      ) : resultados.length > 0 ? (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : buscado ? (
        <View style={styles.centerContainer}>
          <Icon name="database-search-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptyDesc}>
            No encontramos temas que coincidan con "{query}". Intenta con otras palabras.
          </Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Icon name="book-open-page-variant-outline" size={72} color={COLORS.border} />
          <Text style={styles.emptyTitle}>¿Qué deseas aprender hoy?</Text>
          <Text style={styles.emptyDesc}>
            Escribe palabras clave como "cráneo", "temporal", "masetero", "olfatorio" o "faringe".
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
  searchBarContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
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
    marginBottom: 4,
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
    paddingHorizontal: 30,
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
  },
  emptyDesc: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
