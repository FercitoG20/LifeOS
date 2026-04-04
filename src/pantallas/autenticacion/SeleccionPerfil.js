import React, { useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  Animated, Platform, StyleSheet, Image, KeyboardAvoidingView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

// 1. IMPORTAMOS LOS NUEVOS ESTILOS
import { styles } from './seleccion-estilos'; 

export default function SeleccionPerfil({ navigation }) {
  // 2. ANIMACIONES DEL FONDO GALÁCTICO
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const twinkleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const isNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: isNative }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: isNative }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(twinkleAnim, { toValue: 0.7, duration: 2500, useNativeDriver: isNative }),
          Animated.timing(twinkleAnim, { toValue: 0.3, duration: 2500, useNativeDriver: isNative }),
        ])
      )
    ]).start();
  }, []);

  // 3. FUENTES
  let [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  // 4. DATOS ORIGINALES
  const perfiles = [
    { id: 'General', titulo: 'General', desc: 'Equilibrio personal, salud y finanzas.', icono: 'user' },
    { id: 'Profesionista', titulo: 'Profesionista', desc: 'Productividad laboral y gestión.', icono: 'briefcase' }
  ];

  return (
    <View style={styles.masterContainer}>
      {/* FONDO ANIMADO Y ESTRELLAS */}
      <LinearGradient colors={['#1b2735', '#090a0f']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.starsOverlay, { opacity: twinkleAnim }]} pointerEvents="none" />

      {/* LA JAULA DE HIERRO PARA EL SCROLL */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={StyleSheet.absoluteFill} 
        enabled={Platform.OS !== 'web'} 
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ESPACIADOR TOP */}
          <View style={{ flex: 1, minHeight: 30 }} />

          <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.glassContainer}>
              
              {/* LOGO */}
              <Image 
                source={require('../../../assets/img/Logo-LifeOS.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />

              <View style={styles.header}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Configuración Inicial</Text>
                </View>
                <Text style={styles.tagline}>¿Cómo prefieres que LifeOS organice tu vida?</Text>
              </View>

              <View style={styles.grid}>
                {perfiles.map(p => (
                  <TouchableOpacity 
                    key={p.id} 
                    style={styles.card} 
                    onPress={() => navigation.navigate('RegistroGeneral', { tipoPerfil: p.id })}
                  >
                    <View style={styles.cardIcon}>
                      <FontAwesome name={p.icono} size={20} color="#6200ee" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{p.titulo}</Text>
                      <Text style={styles.cardDesc}>{p.desc}</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={12} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnBack}>
                <Text style={styles.btnBackText}>Ya tengo una cuenta</Text>
              </TouchableOpacity>

            </View>
          </Animated.View>

          {/* ESPACIADOR BOTTOM */}
          <View style={{ flex: 1, minHeight: 40 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}