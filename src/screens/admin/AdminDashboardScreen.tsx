import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { unidadesService } from '../../services/unidadesService';
import { adminService } from '../../services/adminService';
import { Unidad } from '../../types';
import { COLORS } from '../../constants/colors';

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnidades = async () => {
    setLoading(true);
    try {
      const data = await unidadesService.getUnidades();
      setUnidades(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las unidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUnidades();
    });
    return unsubscribe;
  }, [navigation]);

  const handleEliminarUnidad = (id: string) => {
    Alert.alert('Eliminar Unidad', '¿Estás seguro de que deseas eliminar esta unidad? Se eliminarán también todos sus temas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await adminService.eliminarUnidad(id);
          fetchUnidades();
        } catch (error) {
          Alert.alert('Error', 'No se pudo eliminar la unidad');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: Unidad }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={() => navigation.navigate('AdminTemas', { unidadId: item.id, unidadTitulo: item.titulo })}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.emoji}>{item.imagen_url || '📁'}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Unidad {item.numero}: {item.titulo}</Text>
        </View>
        <TouchableOpacity onPress={() => handleEliminarUnidad(item.id)} style={styles.deleteBtn}>
          <Icon name="delete" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AdminPreguntas', { unidadId: item.id, unidadTitulo: item.titulo })}
        >
          <Icon name="brain" size={20} color={COLORS.primary} style={{ marginRight: 5 }} />
          <Text style={styles.actionBtnText}>Gestionar Preguntas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header profesional */}
      <View style={styles.header}>
        <Icon name="shield-crown" size={26} color="#FFF" />
        <Text style={styles.headerTitle}>Panel Docente</Text>
        <View style={{ width: 26 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Unidades</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={unidades}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay unidades registradas.</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Aviso', 'Funcionalidad de crear unidad en desarrollo')}>
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
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
