import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService, UnidadConTemas } from '../../services/unidadesService';

export default function UnidadesScreen() {
  const navigation = useNavigation<any>();
  const [unidades, setUnidades] = useState<UnidadConTemas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnidades = async () => {
      const data = await unidadesService.getUnidades();
      setUnidades(data);
      setLoading(false);
    };
    fetchUnidades();
  }, []);

  const getBackgroundForUnidad = (index: number) => {
    const colors = ['#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5'];
    return colors[index % colors.length];
  };

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
        <Text style={styles.headerTitle}>Unidades</Text>
        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.subtitle}>Selecciona la unidad que desees estudiar</Text>

      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: getBackgroundForUnidad(index) }]}
            onPress={() => navigation.navigate('Temas', { 
              unidadId: item.id, 
              unidadTitulo: `Unidad ${item.numero}`, 
              unidadNumero: item.numero 
            })}
          >
            <View style={styles.cardContent}>
              <Text style={styles.unidadNumero}>Unidad {['I', 'II', 'III', 'IV', 'V'][item.numero - 1] || item.numero}</Text>
              <Text style={styles.unidadTitulo}>{item.titulo}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{item.imagen_url || '📚'}</Text>
            </View>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 15,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    paddingRight: 15,
  },
  unidadNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 5,
  },
  unidadTitulo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    lineHeight: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 45,
  }
});
