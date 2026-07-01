import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { unidadesService } from '../../services/unidadesService';
import { adminService } from '../../services/adminService';
import { Tema } from '../../types';
import { COLORS } from '../../constants/colors';

export default function AdminTemasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo } = route.params;

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemas = async () => {
    setLoading(true);
    try {
      const data = await unidadesService.getTemas(unidadId);
      setTemas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los temas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTemas();
    });
    return unsubscribe;
  }, [navigation, unidadId]);

  const handleEliminarTema = (id: string) => {
    Alert.alert('Eliminar Tema', '¿Estás seguro de que deseas eliminar este tema? Se borrarán todos sus contenidos.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await adminService.eliminarTema(id);
          fetchTemas();
        } catch (error) {
          Alert.alert('Error', 'No se pudo eliminar el tema');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: Tema }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('AdminContenido', { temaId: item.id, temaTitulo: item.titulo })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
      </View>
      <TouchableOpacity onPress={() => handleEliminarTema(item.id)} style={styles.deleteBtn}>
        <Icon name="delete" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header profesional */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{unidadTitulo}</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={temas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay temas en esta unidad.</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Aviso', 'Funcionalidad de crear tema en desarrollo')}>
        <Icon name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerBackBtn: {
    padding: 5,
    width: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deleteBtn: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
