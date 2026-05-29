import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { unidadesService } from '../../services/unidadesService';
import { Tema } from '../../types';

export default function TemasScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { unidadId, unidadTitulo, unidadNumero } = route.params || {};
  
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
            <View style={styles.iconWrapper}>
               <Text style={styles.emoji}>💀</Text> 
            </View>
            <Text style={styles.temaTitle}>{item.orden}. {item.titulo}</Text>
            <Icon name="chevron-right" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity 
              style={styles.quizBtn}
              onPress={() => navigation.navigate('Quiz', { unidadId, unidadTitulo })}
            >
              <Icon name="brain" size={24} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.quizBtnText}>Tomar Evaluación de la Unidad</Text>
            </TouchableOpacity>
          </View>
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
    marginRight: 15,
  },
  emoji: {
    fontSize: 30,
  },
  temaTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1B1B1B',
    fontWeight: '600',
  },
  footerContainer: {
    padding: 20,
    marginTop: 10,
  },
  quizBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  quizBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
