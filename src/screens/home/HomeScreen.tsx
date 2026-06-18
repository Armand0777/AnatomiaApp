import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { MODULOS } from '../../constants/modulos';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: '💀 Nueva Estructura Cefálica', description: 'Se agregaron imágenes de alta calidad del Hueso Temporal. ¡Revísalas en la Unidad 1!', time: 'Hace 10 min' },
    { id: '2', title: '📋 Autoevaluación disponible', description: 'Ya está habilitado el banco de preguntas de las 4 unidades.', time: 'Hace 2 horas' },
    { id: '3', title: '🎉 ¡Bienvenido a AnatomíaApp!', description: 'Explora las 4 unidades de cabeza y cuello con teoría, resúmenes, videos y autoevaluaciones.', time: 'Ayer' },
  ];

  const modulos = [
    { id: 'unidades', titulo: 'Unidades', desc: 'Contenido teórico organizado por unidades', ...MODULOS.unidades, route: 'UnidadesStack' },
    { id: 'multimedia', titulo: 'Biblioteca multimedia', desc: 'Videos, imágenes y esquemas interactivos', ...MODULOS.biblioteca, route: 'Biblioteca' },
    { id: 'evaluacion', titulo: 'Autoevaluación', desc: 'Simulaciones de examen y evaluaciones', ...MODULOS.autoevaluacion, route: 'Autoevaluacion' },
    { id: 'acerca', titulo: 'Acerca de', desc: 'Información sobre la aplicación y el proyecto', ...MODULOS.acercaDe, route: 'AcercaDe' },
  ];

  return (
    <View style={styles.container}>
      {/* Custom Header similar a la referencia */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Anatomía</Text>
          <Text style={styles.headerSubtitle}>Cabeza y Cuello</Text>
        </View>
        <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.iconButton}>
          <Icon name="bell-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Modal de Notificaciones */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="bell" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Notificaciones</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Icon name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 15 }}
              renderItem={({ item }) => (
                <View style={styles.notiCard}>
                  <Text style={styles.notiTitle}>{item.title}</Text>
                  <Text style={styles.notiDesc}>{item.description}</Text>
                  <Text style={styles.notiTime}>{item.time}</Text>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyNoti}>
                  <Icon name="bell-off-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyNotiText}>No tienes notificaciones pendientes</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Superior */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/800px-24701-nature-natural-beauty.jpg' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>APLICACIÓN EDUCATIVA</Text>
          </View>
        </View>

        {/* Módulos */}
        <View style={styles.modulosContainer}>
          {modulos.map((mod) => {
            // Fondo con 10% de opacidad del color principal del ícono
            const bgColor = mod.color + '1A'; 
            
            return (
              <TouchableOpacity 
                key={mod.id} 
                style={[styles.card, { backgroundColor: bgColor }]}
                onPress={() => navigation.navigate(mod.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: mod.color }]}>
                  <Icon name={mod.icon as any} size={30} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{mod.titulo}</Text>
                  {/* Descripcion comentada para replicar UI de imagen 1 exacta, aunque el prompt lo pide, en la imagen no se ve */}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
    paddingTop: 50, // Safe area aprox
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
    fontSize: 14,
    opacity: 0.9,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  bannerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bannerImage: {
    width: '60%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  bannerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  modulosContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  
  // Estilos de Notificaciones
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '40%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  notiCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  notiTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  notiDesc: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 6,
  },
  notiTime: {
    fontSize: 11,
    color: '#888888',
    fontStyle: 'italic',
  },
  emptyNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyNotiText: {
    marginTop: 10,
    color: '#888888',
    fontSize: 14,
  },
});
