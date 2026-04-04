import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform, ScrollView, Image, Dimensions, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContenedorGalactico({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const twinkleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(twinkleAnim, { toValue: 0.7, duration: 2500, useNativeDriver: true }),
          Animated.timing(twinkleAnim, { toValue: 0.3, duration: 2500, useNativeDriver: true }),
        ])
      )
    ]).start();
  }, []);

  return (
    <View style={styles.fullScreen}>
      <LinearGradient colors={['#1b2735', '#090a0f']} style={StyleSheet.absoluteFill} />
      
      {/* Fondo de estrellas animado */}
      <Animated.View style={[styles.starsOverlay, { opacity: twinkleAnim }]} pointerEvents="none" />

      {/* KeyboardAvoidingView para que el teclado no tape los inputs en móviles */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.glassContainer}>
              <Image 
                source={require('../../../assets/img/Logo-LifeOS.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
              {children}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#090a0f' },
  starsOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 150px, #fff, rgba(0,0,0,0))',
        backgroundSize: '250px 250px',
      }
    })
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 50 // Espacio suficiente para que el botón no pegue abajo
  },
  mainWrapper: { 
    width: '100%', 
    maxWidth: 500, // Tamaño ideal para lectura
    alignSelf: 'center' 
  },
  glassContainer: {
    backgroundColor: 'rgba(26, 26, 58, 0.85)',
    borderRadius: 30,
    padding: Platform.OS === 'web' ? 40 : 25,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      web: { backdropFilter: 'blur(15px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
      default: { elevation: 12 }
    })
  },
  logo: { 
    width: '100%', 
    height: 100, 
    alignSelf: 'center', 
    marginBottom: 20 
  }
});