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
import { COLORS } from '../../constants/colors';
import { unidadesService } from '../../services/unidadesService';
import { Multimedia } from '../../types';

// Parámetros de navegación del screen
interface ResumenParams {
  temaId: string;
  temaTitulo: string;
  temaOrden: number;
  unidadNumero: number;
  unidadId: string;
  unidadTitulo: string;
}

export default function ResumenScreen() {
  const navigation = useNavigation<{ navigate: (screen: string, params?: Record<string, unknown>) => void; goBack: () => void }>();
  const route = useRoute();
  const { temaId, temaTitulo, temaOrden, unidadNumero, unidadId, unidadTitulo } = (route.params ?? {}) as ResumenParams;

  const [resumen, setResumen] = useState<Multimedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (temaId) {
      const fetchResumen = async () => {
        const data = await unidadesService.getResumen(temaId);
        setResumen(data);
        setLoading(false);
      };
      fetchResumen();
    }
  }, [temaId]);

  // Separar la descripción en puntos individuales usando saltos de línea
  const puntosResumen = resumen?.descripcion
    ? resumen.descripcion.split('\n').filter((p) => p.trim() !== '')
    : [];

  // Calcular progreso del tema dentro de la unidad (5 temas por unidad)
  const totalTemas = 5;
  const progresoPorcentaje = temaOrden ? (temaOrden / totalTemas) * 100 : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumen</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Icon name="download" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjeta superior destacada */}
        <View style={styles.topCard}>
          <Text style={styles.topCardUnit}>Unidad {unidadNumero}</Text>
          <Text style={styles.topCardTitle}>{temaTitulo || resumen?.titulo || 'Tema'}</Text>
          <Icon
            name="clipboard-text-outline"
            size={32}
            color="rgba(255,255,255,0.6)"
            style={styles.topCardIcon}
          />
        </View>

        {/* Lista de puntos del resumen */}
        {puntosResumen.length > 0 ? (
          <View style={styles.puntosContainer}>
            {puntosResumen.map((punto, index) => (
              <React.Fragment key={index}>
                <View style={styles.puntoRow}>
                  <Icon name="check-circle" size={22} color={COLORS.primary} />
                  <Text style={styles.puntoText}>{punto}</Text>
                </View>
                {index < puntosResumen.length - 1 && (
                  <View style={styles.puntoDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="text-box-remove-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>Aún no hay resumen disponible para este tema.</Text>
          </View>
        )}

        {/* Barra de progreso */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Progreso del tema {temaOrden} de {totalTemas}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progresoPorcentaje}%` }]} />
          </View>
        </View>

      </ScrollView>
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
  },

  // ── Contenido principal ──
  content: {
    paddingBottom: 40,
  },

  // ── Tarjeta superior ──
  topCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    margin: 20,
  },
  topCardUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  topCardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  topCardIcon: {
    marginTop: 4,
  },

  // ── Puntos del resumen ──
  puntosContainer: {
    paddingHorizontal: 20,
  },
  puntoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  puntoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  puntoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },

  // ── Estado vacío ──
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  // ── Barra de progreso ──
  progressSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },

  // ── Botón principal ──
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 20,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
