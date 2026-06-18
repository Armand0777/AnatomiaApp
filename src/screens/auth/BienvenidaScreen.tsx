import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';

type AuthStackParamList = {
  Bienvenida: undefined;
  Login: undefined;
};

type NavigationProps = StackNavigationProp<AuthStackParamList, 'Bienvenida'>;

export default function BienvenidaScreen() {
  const navigation = useNavigation<NavigationProps>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  const loginInvitado = useAuthStore(state => state.loginInvitado);

  // Animación de entrada suave
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
        <Image source={require('../../../assets/logocentral.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Anatomía de</Text>
        <Text style={styles.titleBold}>Cabeza y Cuello</Text>
        <Text style={styles.subtitle}>Explora el cuerpo humano como nunca antes</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={loginInvitado}
          >
            <Text style={styles.secondaryButtonText}>Continuar como Invitado</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  titleBold: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimaryBg,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.buttonPrimaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.buttonSecondaryBorder,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.buttonSecondaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
