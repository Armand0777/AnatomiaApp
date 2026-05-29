import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';

export default function PerfilScreen() {
  const usuario = useAuthStore(state => state.usuario);
  const logout = useAuthStore(state => state.logout);

  // Obtener iniciales para el avatar
  const getIniciales = () => {
    if (!usuario?.nombre) return 'U';
    const partes = usuario.nombre.split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return usuario.nombre.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {usuario?.es_invitado && (
        <View style={styles.bannerInvitado}>
          <Text style={styles.bannerText}>
            Modo Invitado — Registra tu cuenta para guardar tu progreso
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getIniciales()}</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {usuario?.es_invitado ? 'Invitado' : 'Estudiante'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Aquí irían más opciones del perfil en el futuro */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerInvitado: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    alignItems: 'center',
  },
  bannerText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 32,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  badgeContainer: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  logoutButton: {
    margin: 24,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
