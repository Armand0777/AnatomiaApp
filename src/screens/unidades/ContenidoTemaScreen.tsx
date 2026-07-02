import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { MEDIA_LINKS } from '../../constants/mediaLinks';
import { unidadesService } from '../../services/unidadesService';
import { ContenidoTema } from '../../types';
import { useFavoritesStore } from '../../store/useFavoritesStore';

// Parámetros de navegación del screen
interface ContenidoTemaParams {
  temaId: string;
  temaTitulo: string;
  temaOrden: number;
  unidadNumero: number;
  unidadId: string;
  unidadTitulo: string;
}

export default function ContenidoTemaScreen() {
  const navigation = useNavigation<{ navigate: (screen: string, params: Record<string, unknown>) => void; goBack: () => void }>();
  const route = useRoute();
  const { temaId, temaTitulo, temaOrden, unidadNumero, unidadId, unidadTitulo } = (route.params ?? {}) as ContenidoTemaParams;

  const { esFavorito, agregarFavorito, eliminarFavorito, cargarFavoritos } = useFavoritesStore();

  const [activeTab, setActiveTab] = useState<'contenido' | 'funciones' | 'relaciones'>('contenido');
  const [contenido, setContenido] = useState<ContenidoTema[]>([]);
  const [imagenTemaUrl, setImagenTemaUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFavoritos();
  }, []);

  useEffect(() => {
    if (temaId) {
      const fetchDatos = async () => {
        const [dataContenido, dataMultimedia] = await Promise.all([
          unidadesService.getContenidoTema(temaId),
          unidadesService.getMultimedia(temaId)
        ]);
        
        setContenido(dataContenido);
        
        // Buscar la primera imagen
        const imagen = dataMultimedia.find(m => m.tipo === 'imagen');
        if (imagen && imagen.url) {
          setImagenTemaUrl(imagen.url);
        }
        
        setLoading(false);
      };
      fetchDatos();
    }
  }, [temaId]);

  const imagenUrl = imagenTemaUrl;

  // Separar datos según tipo y convención de orden
  const parrafoPrincipal = contenido.find(
    (c) => c.tipo === 'contenido' && c.orden === 1
  );
  const estructuras = contenido.filter(
    (c) => c.tipo === 'contenido' && c.orden > 1
  );
  const funciones = contenido.filter((c) => c.tipo === 'funciones');
  const relaciones = contenido.filter((c) => c.tipo === 'relaciones');

  // Params compartidos para navegación inferior
  const sharedNavParams = {
    temaId,
    temaTitulo,
    temaOrden,
    unidadNumero,
    unidadId,
    unidadTitulo
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ── Pestaña CONTENIDO ──
  const renderContenido = () => (
    <View>
      {/* Imagen del tema */}
      {imagenUrl !== '' && (
        <Image
          source={{ uri: imagenUrl }}
          style={styles.temaImage}
          contentFit="cover"
          transition={300}
        />
      )}

      {/* Tarjeta destacada con el párrafo principal */}
      {parrafoPrincipal && (
        <View style={styles.highlightCard}>
          <Text style={styles.highlightText}>{parrafoPrincipal.cuerpo}</Text>
        </View>
      )}

      {/* Separador verde suave */}
      <View style={styles.divider} />

      {/* Subtítulo de estructuras */}
      {estructuras.length > 0 && (
        <>
          <Text style={styles.sectionSubtitle}>Estructuras principales</Text>
          <View style={styles.chipsContainer}>
            {estructuras.map((item) => (
              <View key={item.id} style={styles.chip}>
                <Text style={styles.chipText}>{item.cuerpo}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  // ── Pestaña FUNCIONES ──
  const renderFunciones = () => (
    <View>
      <Text style={styles.sectionTitle}>🎯 Funciones</Text>
      {funciones.map((item, idx) => (
        <View key={item.id} style={styles.funcionCard}>
          <View style={styles.funcionNumber}>
            <Text style={styles.funcionNumberText}>{idx + 1}</Text>
          </View>
          <Text style={styles.funcionText}>{item.cuerpo}</Text>
        </View>
      ))}
    </View>
  );

  // ── Pestaña RELACIONES ──
  const renderRelaciones = () => (
    <View>
      <Text style={styles.sectionTitle}>🔗 Relaciones anatómicas</Text>
      <View style={styles.timelineContainer}>
        {relaciones.map((item, idx) => (
          <View key={item.id} style={styles.timelineRow}>
            {/* Línea conectora vertical */}
            {idx < relaciones.length - 1 && (
              <View style={styles.timelineLine} />
            )}
            {/* Punto/círculo con icono */}
            <View style={styles.timelineDot}>
              <Icon name="arrow-right" size={14} color="#FFF" />
            </View>
            {/* Texto de la relación */}
            <Text style={styles.timelineText}>{item.cuerpo}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {temaTitulo || 'Tema'}
        </Text>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={async () => {
            if (esFavorito(temaId)) {
              await eliminarFavorito(temaId);
            } else {
              await agregarFavorito(temaId);
            }
          }}
        >
          <Icon name={esFavorito(temaId) ? "bookmark" : "bookmark-outline"} size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['contenido', 'funciones', 'relaciones'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido dinámico según pestaña activa */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'contenido' && renderContenido()}
        {activeTab === 'funciones' && renderFunciones()}
        {activeTab === 'relaciones' && renderRelaciones()}
      </ScrollView>

      {/* Barra inferior de acciones */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('ImagenAmpliada', { ...sharedNavParams })}
        >
          <Icon name="magnify-plus-outline" size={24} color={COLORS.primary} />
          <Text style={styles.bottomBtnText}>Imagen ampliada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('Video', { ...sharedNavParams })}
        >
          <Icon name="play-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.bottomBtnText}>Ver videos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('Resumen', { ...sharedNavParams })}
        >
          <Icon name="file-document-outline" size={24} color={COLORS.primary} />
          <Text style={styles.bottomBtnText}>Resumen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Contenedores generales ──
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // ── Header ──
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: COLORS.headerText,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },

  // ── Tabs ──
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: '#9E9E9E',
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primary,
  },

  // ── ScrollView ──
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // ── Pestaña CONTENIDO ──
  temaImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: COLORS.card,
  },
  highlightCard: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
  },
  highlightText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1B1B1B',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionSubtitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Pestaña FUNCIONES ──
  sectionTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  funcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  funcionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  funcionNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  funcionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },

  // ── Pestaña RELACIONES (timeline) ──
  timelineContainer: {
    paddingLeft: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: -10,
    width: 2,
    backgroundColor: COLORS.border,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineText: {
    paddingLeft: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 22,
  },

  // ── Barra inferior ──
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '31%',
  },
  bottomBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
