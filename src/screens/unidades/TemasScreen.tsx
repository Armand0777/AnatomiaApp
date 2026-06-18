import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService } from '../../services/unidadesService';
import { getUnidadVisual } from '../../constants/unidadesVisual';
import { Tema } from '../../types';

export default function TemasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo, unidadNumero } = route.params || {};
  const visual = getUnidadVisual(unidadNumero);

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (unidadId) {
      const fetchTemas = async () => {
        const data = await unidadesService.getTemas(unidadId);
        setTemas(data);
        setLoading(false);
      };
      fetchTemas();
    }
  }, [unidadId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{unidadTitulo || 'Temas'}</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={temas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.row}
            onPress={() => navigation.navigate('ContenidoTema', { 
              temaId: item.id, 
              temaTitulo: item.titulo,
              temaOrden: item.orden,
              unidadNumero,
              unidadId,
              unidadTitulo
            })}
          >
            <View style={[styles.iconWrapper, { backgroundColor: visual.color + '26' }]}>
              <Icon name={visual.icon as any} size={22} color={visual.color} />
            </View>
            <Text style={styles.temaTitle}>{item.orden}. {item.titulo}</Text>
            <Icon name="chevron-right" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  listContainer: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  temaTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1B1B1B',
    fontWeight: '600',
  },
});
