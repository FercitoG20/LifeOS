import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Animated, Platform, Alert, Image, KeyboardAvoidingView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; 
import { FontAwesome } from '@expo/vector-icons'; 

import { registrarGeneral } from '../../api/usuarioGeneral';
import { styles } from './registro-estilos'; // NUESTRA MAGIA

export default function RegistroGeneral({ navigation }) {
  const route = useRoute();
  const { tipoPerfil } = route.params || { tipoPerfil: 'General' };
  
  // ANIMACIONES
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const twinkleAnim = useRef(new Animated.Value(0.3)).current;

  // ESTADOS DE INTERFAZ (OJO DE CONTRASEÑA)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para el segundo ojo
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    tipoPerfil: tipoPerfil,
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    sexo: 'Masculino', 
    email: '',
    ciudad: 'Puebla', 
    password: '',
    confirmarPassword: '',
    fotoPerfil: ''
  });

  const updateField = (name, value) => {
    setErrors({ ...errors, [name]: '' });
    setFormData({ ...formData, [name]: value });
  };

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso", "Se requiere acceso a la galería.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) updateField('fotoPerfil', result.assets[0].uri);
  };

  const handleRegistro = async () => {
    let tempErrors = {};

    if (!formData.nombres) tempErrors.nombres = "El nombre es obligatorio";
    if (!formData.apellidoPaterno) tempErrors.apellidoPaterno = "El apellido es obligatorio";
    
    if (!formData.email) {
      tempErrors.email = "El correo es obligatorio";
    } else if (!validarEmail(formData.email)) {
      tempErrors.email = "Formato de correo inválido";
    }

    if (!formData.password) {
      tempErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Mínimo 6 caracteres";
    }

    if (formData.password !== formData.confirmarPassword) {
      tempErrors.confirmarPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      const respuesta = await registrarGeneral(formData);
      if (respuesta.error) {
        setErrors({ email: respuesta.mensaje });
        Alert.alert("Atención", respuesta.mensaje);
      } else {
        Alert.alert("¡Éxito!", `Tu cuenta de ${tipoPerfil} está lista.`);
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert("Error", "No hay conexión con LifeOS.");
    }
  };

  let [fontsLoaded] = useFonts({ 'Poppins-Regular': Poppins_400Regular, 'Poppins-SemiBold': Poppins_600SemiBold });
  
  useEffect(() => { 
    if (fontsLoaded) {
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
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.masterContainer}>
      <LinearGradient colors={['#1b2735', '#090a0f']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.starsOverlay, { opacity: twinkleAnim }]} pointerEvents="none" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
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

          <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            <View style={styles.glassCard}>
              <Image source={require('../../../assets/img/Logo-LifeOS.png')} style={styles.logo} resizeMode="contain" />
              
              <View style={styles.headerInfo}>
                <View style={styles.badge}><Text style={styles.badgeText}>Registro{tipoPerfil}</Text></View>
                <Text style={styles.tagline}>Formulario LifeOS</Text>
              </View>

              <View style={styles.whiteForm}>
                <View style={styles.mainColumnsRow}>
                  
          
                  <View style={styles.sideBlock}>
                    <Text style={styles.groupTitle}>1. Información de Identidad</Text>
                    
                    <View style={styles.avatarContainer}>
                      <TouchableOpacity onPress={seleccionarImagen} style={styles.avatarCircle}>
                          <Image source={{ uri: formData.fotoPerfil || 'https://via.placeholder.com/150' }} style={styles.avatarImg} />
                          <View style={styles.editIcon}><FontAwesome name="camera" size={10} color="#fff" /></View>
                      </TouchableOpacity>
                      <View style={{flex: 1, marginLeft: 15}}>
                          <Text style={styles.label}>Foto de Perfil (Opcional)</Text>
                          <TextInput 
                            style={styles.inputSmall} 
                            placeholder="URL de imagen..." 
                            value={formData.fotoPerfil} 
                            onChangeText={(v) => updateField('fotoPerfil', v)} 
                          />
                      </View>
                    </View>

                    <View style={styles.innerRow}>
                      <View style={styles.field}>
                        <Text style={styles.label}>Nombre(s) *</Text>
                        <TextInput style={[styles.input, errors.nombres && styles.inputError]} placeholder="Juan" onChangeText={(v)=>updateField('nombres', v)} />
                        {errors.nombres && <Text style={styles.errorLabel}>{errors.nombres}</Text>}
                      </View>
                      <View style={styles.field}>
                        <Text style={styles.label}>Ap. Paterno *</Text>
                        <TextInput style={[styles.input, errors.apellidoPaterno && styles.inputError]} placeholder="Paterno" onChangeText={(v)=>updateField('apellidoPaterno', v)} />
                        {errors.apellidoPaterno && <Text style={styles.errorLabel}>{errors.apellidoPaterno}</Text>}
                      </View>
                    </View>

                    <View style={styles.innerRow}>
                      <View style={[styles.field, {flex: 0.4}]}>
                        <Text style={styles.label}>Edad</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="25" onChangeText={(v)=>updateField('edad', v)} />
                      </View>
                      <View style={styles.field}>
                        <Text style={styles.label}>Sexo</Text>
                        <View style={styles.pickerBox}>
                          <Picker selectedValue={formData.sexo} onValueChange={(v)=>updateField('sexo', v)} style={styles.pickerStyle}>
                            <Picker.Item label="Masculino" value="Masculino" />
                            <Picker.Item label="Femenino" value="Femenino" />
                            <Picker.Item label="Otro" value="Otro" />
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* COLUMNA 2: ACCESO */}
                  <View style={styles.sideBlock}>
                    <Text style={styles.groupTitle}>2. Acceso y Ubicación</Text>
                    
                    <View style={styles.field}>
                      <Text style={styles.label}>Correo Electrónico *</Text>
                      <TextInput 
                        style={[styles.input, errors.email && styles.inputError]} 
                        placeholder="tu@email.com" 
                        autoCapitalize="none" 
                        onChangeText={(v)=>updateField('email', v)} 
                      />
                      {errors.email && <Text style={styles.errorLabel}>{errors.email}</Text>}
                    </View>

                    <View style={styles.field}>
                      <Text style={styles.label}>Ciudad de Residencia</Text>
                      <View style={styles.pickerBox}>
                        <Picker selectedValue={formData.ciudad} onValueChange={(v)=>updateField('ciudad', v)} style={styles.pickerStyle}>
                          <Picker.Item label="Puebla" value="Puebla" />
                          <Picker.Item label="CDMX" value="Ciudad de México" />
                          <Picker.Item label="Guadalajara" value="Guadalajara" />
                          <Picker.Item label="Monterrey" value="Monterrey" />
                          <Picker.Item label="Querétaro" value="Querétaro" />
                        </Picker>
                      </View>
                    </View>

                    <View style={styles.innerRow}>
                      <View style={styles.field}>
                        <Text style={styles.label}>Contraseña *</Text>
                        <View style={[styles.passContainer, errors.password && styles.inputError]}>
                          <TextInput 
                            style={styles.passInput} 
                            secureTextEntry={!showPassword} 
                            placeholder="••••••••" 
                            onChangeText={(v)=>updateField('password', v)} 
                          />
                          <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color="#6200ee" />
                          </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorLabel}>{errors.password}</Text>}
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.label}>Confirmar *</Text>
                        {/* APLICADO passContainer PARA EL OJO DE CONFIRMACIÓN */}
                        <View style={[styles.passContainer, errors.confirmarPassword && styles.inputError]}>
                          <TextInput 
                            style={styles.passInput} 
                            secureTextEntry={!showConfirmPassword} 
                            placeholder="••••••••" 
                            onChangeText={(v)=>updateField('confirmarPassword', v)} 
                          />
                          <TouchableOpacity onPress={()=>setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                            <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={16} color="#6200ee" />
                          </TouchableOpacity>
                        </View>
                        {errors.confirmarPassword && <Text style={styles.errorLabel}>{errors.confirmarPassword}</Text>}
                      </View>
                    </View>
                  </View>

                </View>

                <View style={styles.footer}>
                  <TouchableOpacity style={styles.mainBtn} onPress={handleRegistro}>
                    <Text style={styles.mainBtnText}>Finalizar Sincronización</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>← Volver a selección de perfil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </Animated.View>

          <View style={{ flex: 1, minHeight: 40 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}