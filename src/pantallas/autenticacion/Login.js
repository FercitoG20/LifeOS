import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, Platform, ScrollView, Animated, Image, KeyboardAvoidingView, StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

import { styles } from './login-estilos'; 
import { loginGeneral } from '../../api/usuarioGeneral';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [secureText, setSecureText] = useState(true); 
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPass, setErrorPass] = useState('');

  // 1. Referencia para saltar al input de password
  const passwordRef = useRef(null);

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

  let [fontsLoaded] = useFonts({
    'Poppins-Light': Poppins_300Light,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  const handleFakeBack = () => {
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      navigation.replace('Login');
    }
  };

  const handleLogin = async () => {
    setErrorEmail('');
    setErrorPass('');

    let valido = true;
    // Validaciones básicas de cliente
    if (!email.trim()) { setErrorEmail('Ingresa tu correo'); valido = false; }
    if (!password) { setErrorPass('Ingresa tu contraseña'); valido = false; }
    
    if (!valido) return;

    setCargando(true);
    try {
      const respuesta = await loginGeneral({ email: email.trim(), password });
      
      if (respuesta.usuario) {
        navigation.replace('DashboardGeneral', { usuario: respuesta.usuario });
      } else {
        // 2. Lógica para detectar qué campo está mal según el mensaje del servidor
        const msg = respuesta.mensaje?.toLowerCase() || "";
        if (msg.includes("correo") || msg.includes("email") || msg.includes("usuario")) {
          setErrorEmail(respuesta.mensaje || "Correo no encontrado");
        } else if (msg.includes("contraseña") || msg.includes("password") || msg.includes("incorrecta")) {
          setErrorPass(respuesta.mensaje || "Contraseña incorrecta");
        } else {
          Alert.alert("Acceso Denegado", respuesta.mensaje || "Credenciales incorrectas.");
        }
      }
    } catch (error) {
      Alert.alert("Error de Conexión", "No se pudo contactar con el servidor LifeOS.");
    } finally {
      setCargando(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.masterContainer}>
      <LinearGradient colors={['#1b2735', '#090a0f']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.starsOverlay, { opacity: twinkleAnim }]} pointerEvents="none" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={StyleSheet.absoluteFill} 
        enabled={Platform.OS !== 'web'} 
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={{ flex: 1, minHeight: 30 }} />
          
          <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.glassContainer}>
              <TouchableOpacity style={styles.fakeBackBtn} onPress={handleFakeBack}>
                <FontAwesome name="arrow-left" size={12} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.fakeBackText}>Regresar</Text>
              </TouchableOpacity>

              <Image 
                source={require('../../../assets/img/Logo-LifeOS.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.logoText}>LifeOS</Text>
                <Text style={styles.tagline}>Organiza tu vida en un solo lugar</Text>
                <Text style={styles.welcomeMsg}>Bienvenido a tu sistema de administración personal</Text>
              </View>

              <View style={styles.loginCard}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <View style={[styles.inputWrapper, errorEmail ? styles.inputError : null]}>
                  <FontAwesome name="envelope" size={14} color={errorEmail ? "#ff4d4d" : "#666"} style={{marginRight: 10}} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="tu@email.com" 
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setErrorEmail(''); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.inputWrapper, errorPass ? styles.inputError : null]}>
                  <FontAwesome name="lock" size={16} color={errorPass ? "#ff4d4d" : "#666"} style={{marginRight: 10}} />
                  <TextInput 
                    ref={passwordRef}
                    style={styles.input} 
                    placeholder="••••••••" 
                    secureTextEntry={secureText}
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setErrorPass(''); }}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn}>
                    <FontAwesome5 name={secureText ? "eye-slash" : "eye"} size={16} color="#999" />
                  </TouchableOpacity>
                </View>
                {errorPass ? <Text style={styles.errorText}>{errorPass}</Text> : null}

                <TouchableOpacity 
                  style={[styles.btnLogin, cargando && { opacity: 0.7 }]} 
                  onPress={handleLogin}
                  disabled={cargando}
                >
                  {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Iniciar sesión</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SeleccionPerfil')}>
                  <Text style={styles.createAccount}>¿No tienes cuenta? Crear cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <View style={{ flex: 1, minHeight: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}