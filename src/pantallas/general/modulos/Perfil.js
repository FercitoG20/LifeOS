import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  StyleSheet, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 

// Importamos tus herramientas de conexión
import { obtenerPerfilInfo, actualizarPerfilConFoto, SERVER_URL } from '../../../api/usuarioGeneral'; 

export default function Perfil({ usuario, setUsuario }) {
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [usarLinkUrl, setUsarLinkUrl] = useState(false); 
  const [errorImagen, setErrorImagen] = useState(false); 
  
  const [form, setForm] = useState({
    nombres: '', 
    apellido_paterno: '', 
    apellido_materno: '', 
    foto_perfil: '', 
    foto_link: '',   
    email: '', 
    ciudad_pais: ''
  });

  const [fotoTemporalLocal, setFotoTemporalLocal] = useState(null); 

  // 1. Cargar datos iniciales desde el servidor
  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario?.id) return;
      const res = await obtenerPerfilInfo(usuario.id);
      
      if (!res.error && res.perfil) {
        let urlFoto = res.perfil.foto_perfil || '';
        if (urlFoto.startsWith('/uploads')) {
            urlFoto = `${SERVER_URL}${urlFoto}`;
        }
        setForm({
          ...form,
          ...res.perfil,
          foto_perfil: urlFoto,
          email: res.perfil.email || '',
        });
      }
      setCargando(false);
    };
    cargarDatos();
  }, [usuario?.id]);

  const handleChange = (campo, valor) => setForm({ ...form, [campo]: valor });

  // 2. Selección de imagen de galería
  const elegirFotoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso Denegado", "Necesitamos acceso a tus fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });

    if (!result.canceled) {
      setFotoTemporalLocal(result.assets[0].uri); 
      setUsarLinkUrl(false);
      setEditando(true);
      setErrorImagen(false);
    }
  };

  // 3. Guardar cambios y actualizar el menú INSTANTÁNEAMENTE
  const handleGuardar = async () => {
    setGuardando(true);
    const res = await actualizarPerfilConFoto(usuario.id, form, fotoTemporalLocal);
    setGuardando(false);

    if (res.error) {
      Alert.alert("Error", res.mensaje);
    } else {
      // 🚀 ACTUALIZACIÓN GLOBAL (PARA EL MENÚ DE HAMBURGUESA)
      if (setUsuario) {
        setUsuario({
          ...usuario,
          nombres: form.nombres,
          nombre: form.nombres, // Respaldo por si el menú usa .nombre
          foto: res.foto_actualizada // Nueva ruta de la foto
        });
      }

      // Actualización del estado local de la pantalla Perfil
      let fotoFinal = res.foto_actualizada || '';
      if (fotoFinal.startsWith('/uploads')) {
        fotoFinal = `${SERVER_URL}${fotoFinal}?t=${Date.now()}`;
      }

      setForm({...form, foto_perfil: fotoFinal, foto_link: ''});
      setFotoTemporalLocal(null);
      setEditando(false);
      setErrorImagen(false); 

      Alert.alert("✅ ÉXITO", "Núcleo sincronizado e identidad actualizada.");
    }
  };

  if (cargando) return (
    <View style={localStyles.cargando}>
      <ActivityIndicator size="large" color="#00f2ff" />
      <Text style={{color: '#00f2ff', marginTop: 10, letterSpacing: 2}}>CONECTANDO...</Text>
    </View>
  );

  return (
    <ScrollView style={localStyles.scrollRoot} contentContainerStyle={localStyles.scrollContent}>
      
      {/* CABECERA CON AVATAR */}
      <View style={localStyles.headerCard}>
        <View style={localStyles.photoContainer}>
          <View style={[localStyles.photoCircle, errorImagen && {borderColor: '#ff4d4d'}]}>
            {fotoTemporalLocal ? (
              <Image source={{ uri: fotoTemporalLocal }} style={localStyles.image} />
            ) : (form.foto_perfil && !errorImagen) ? (
              <Image 
                source={{ uri: form.foto_perfil }} 
                style={localStyles.image} 
                onError={() => setErrorImagen(true)}
              />
            ) : (
              <FontAwesome5 name="user-astronaut" size={50} color={errorImagen ? "#ff4d4d" : "#00f2ff"} />
            )}
          </View>
          
          <TouchableOpacity 
            style={[localStyles.cameraBtn, { backgroundColor: editando ? '#00f2ff' : '#1a1b26' }]} 
            onPress={elegirFotoGaleria}
          >
            <FontAwesome5 name="camera" size={14} color={editando ? "#000" : "#00f2ff"} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.mainTitle}>CONFIGURACIÓN DE NÚCLEO</Text>
        <View style={localStyles.badge}>
          <Text style={localStyles.badgeText}>{form.email}</Text>
        </View>
      </View>

      {/* TARJETA DE FORMULARIO GLASSMORPHISM */}
      <View style={localStyles.glassCard}>
        <Text style={localStyles.sectionLabel}>SISTEMA DE IDENTIDAD</Text>
        
        <View style={localStyles.dualPhotoSelector}>
          <TouchableOpacity 
            style={[localStyles.btnDual, !usarLinkUrl && localStyles.btnDualActive]} 
            onPress={() => {setUsarLinkUrl(false); elegirFotoGaleria();}}
          >
            <FontAwesome5 name="image" size={12} color={!usarLinkUrl ? "#000" : "#fff"} />
            <Text style={[localStyles.btnDualText, !usarLinkUrl && {color: '#000'}]}>GALERÍA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[localStyles.btnDual, usarLinkUrl && localStyles.btnDualActive]} 
            onPress={() => {setUsarLinkUrl(true); setFotoTemporalLocal(null); setEditando(true);}}
          >
            <FontAwesome5 name="link" size={12} color={usarLinkUrl ? "#000" : "#fff"} />
            <Text style={[localStyles.btnDualText, usarLinkUrl && {color: '#000'}]}>URL LINK</Text>
          </TouchableOpacity>
        </View>

        {usarLinkUrl && editando && (
          <TextInput 
            style={localStyles.inputCyber} 
            placeholder="Pega el link de la imagen aquí..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={form.foto_link}
            onChangeText={(v) => handleChange('foto_link', v)}
          />
        )}

        <Text style={[localStyles.sectionLabel, {marginTop: 20}]}>DATOS DEL USUARIO</Text>
        
        <View style={localStyles.inputWrapper}>
          <Text style={localStyles.inputLabel}>NOMBRES</Text>
          <TextInput 
            style={[localStyles.inputCyber, !editando && localStyles.inputLocked]} 
            value={form.nombres} 
            editable={editando} 
            onChangeText={(v) => handleChange('nombres', v)} 
          />
        </View>

        <View style={localStyles.row}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={localStyles.inputLabel}>AP. PATERNO</Text>
            <TextInput 
              style={[localStyles.inputCyber, !editando && localStyles.inputLocked]} 
              value={form.apellido_paterno} 
              editable={editando} 
              onChangeText={(v) => handleChange('apellido_paterno', v)} 
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={localStyles.inputLabel}>AP. MATERNO</Text>
            <TextInput 
              style={[localStyles.inputCyber, !editando && localStyles.inputLocked]} 
              value={form.apellido_materno} 
              editable={editando} 
              onChangeText={(v) => handleChange('apellido_materno', v)} 
            />
          </View>
        </View>

        <View style={localStyles.inputWrapper}>
          <Text style={localStyles.inputLabel}>LOCALIZACIÓN (CIUDAD / PAÍS)</Text>
          <TextInput 
            style={[localStyles.inputCyber, !editando && localStyles.inputLocked]} 
            value={form.ciudad_pais} 
            editable={editando} 
            onChangeText={(v) => handleChange('ciudad_pais', v)} 
          />
        </View>

        {/* BOTONES DE ACCIÓN */}
        {editando ? (
          <View style={localStyles.actionRow}>
            <TouchableOpacity 
                style={localStyles.btnCancel} 
                onPress={() => {setEditando(false); setFotoTemporalLocal(null);}}
            >
              <Text style={localStyles.btnCancelText}>CANCELAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={localStyles.btnSave} onPress={handleGuardar} disabled={guardando}>
              {guardando ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={localStyles.btnSaveText}>GUARDAR CAMBIOS</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={localStyles.btnEdit} onPress={() => setEditando(true)}>
            <FontAwesome5 name="user-edit" size={14} color="#00f2ff" />
            <Text style={localStyles.btnEditText}>MODIFICAR PARÁMETROS</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  cargando: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050810' },
  scrollRoot: { flex: 1, backgroundColor: '#050810' },
  scrollContent: { alignItems: 'center', paddingBottom: 50, paddingTop: 20 },
  headerCard: { alignItems: 'center', marginBottom: 20 },
  mainTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 3, textAlign: 'center' },
  badge: { backgroundColor: 'rgba(0, 242, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8, borderWidth: 1, borderColor: 'rgba(0, 242, 255, 0.2)' },
  badgeText: { color: '#00f2ff', fontSize: 10, fontWeight: '600' },
  photoContainer: { position: 'relative', marginBottom: 15 },
  photoCircle: { width: 125, height: 125, borderRadius: 62.5, backgroundColor: '#0f1019', borderWidth: 2, borderColor: '#00f2ff', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#050810' },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', width: '92%', maxWidth: 500, padding: 25, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  sectionLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', marginBottom: 15, letterSpacing: 2, borderLeftWidth: 2, borderLeftColor: '#00f2ff', paddingLeft: 10 },
  inputWrapper: { marginBottom: 15 },
  inputLabel: { color: '#00f2ff', fontSize: 9, fontWeight: 'bold', marginBottom: 6, opacity: 0.8 },
  inputCyber: { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: 12, padding: 15, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  inputLocked: { opacity: 0.4, backgroundColor: 'transparent' },
  row: { flexDirection: 'row', marginBottom: 15 },
  dualPhotoSelector: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  btnDual: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 242, 255, 0.3)' },
  btnDualActive: { backgroundColor: '#00f2ff', borderColor: '#00f2ff' },
  btnDualText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 8 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btnSave: { flex: 2, backgroundColor: '#00f2ff', padding: 16, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnSaveText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  btnCancel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnCancelText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  btnEdit: { marginTop: 20, padding: 16, borderRadius: 15, borderWidth: 1, borderColor: '#00f2ff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 242, 255, 0.05)' },
  btnEditText: { color: '#00f2ff', fontWeight: 'bold', marginLeft: 10, fontSize: 13, letterSpacing: 1 }
});