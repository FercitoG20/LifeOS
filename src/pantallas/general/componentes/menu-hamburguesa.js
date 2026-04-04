import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../EstilosDashboard';
// Importamos la URL del servidor para poder armar la ruta de la imagen
import { SERVER_URL } from '../../../api/usuarioGeneral'; 

export default function MenuHamburguesa({ activeSection, setActiveSection, navigation, usuario }) {
  
  const opciones = [
    { id: 'resumen', label: 'Resumen', icon: 'th-large' },
    { id: 'planificador', label: 'Planificador', icon: 'calendar-alt' },
    { id: 'finanzas', label: 'Finanzas', icon: 'wallet' },
    { id: 'salud', label: 'Salud', icon: 'heart' },
    { id: 'perfil', label: 'Ajustes', icon: 'cog' },
  ];

  // Función para sacar iniciales si no hay foto
  const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // 🛠️ LÓGICA DE FOTO MEJORADA:
  const urlFoto = useMemo(() => {
    if (!usuario?.foto) return null;

    let ruta = usuario.foto;

    // 1. Si la ruta trae 'localhost' (común en usuarios nuevos), la limpiamos
    if (ruta.includes('localhost')) {
        // Extraemos solo la parte de /uploads/...
        const partes = ruta.split('/uploads/');
        if (partes.length > 1) {
            ruta = '/uploads/' + partes[1];
        }
    }

    // 2. Construimos la URL final con un timestamp (?t=...) 
    // Esto obliga al componente Image a refrescarse si la foto cambió.
    if (ruta.startsWith('/uploads')) {
        return `${SERVER_URL}${ruta}?t=${Date.now()}`;
    }

    // 3. Si es un link externo (http), lo pasamos directo
    return ruta;
  }, [usuario?.foto]); // Solo se recalcula si cambia la foto del objeto usuario

  return (
    <View style={styles.sidebar}>
      
      <ScrollView 
        style={styles.menuItems}
        showsVerticalScrollIndicator={false}
      >
        {opciones.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={[styles.menuLink, activeSection === item.id && styles.menuLinkActive]} 
            onPress={() => setActiveSection(item.id)}
          >
            <FontAwesome5 
              name={item.icon} 
              size={16} 
              color={activeSection === item.id ? '#fff' : '#666'} 
            />
            <Text style={[styles.menuLinkText, activeSection === item.id && { color: '#fff' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- SECCIÓN DE PERFIL (PIE DEL MENÚ) --- */}
      <TouchableOpacity 
        style={styles.profileSection}
        onPress={() => setActiveSection('perfil')}
      >
        <View style={styles.avatar}>
          {urlFoto ? (
            <Image 
              key={urlFoto} // 🔥 Importante: Forzar el re-renderizado visual
              source={{ 
                uri: urlFoto,
                cache: 'reload' // En iOS ayuda a ignorar el caché viejo
              }} 
              style={localStyles.avatarImage} 
            />
          ) : (
            <Text style={styles.avatarText}>
              {obtenerIniciales(usuario?.nombres || usuario?.nombre)}
            </Text>
          )}
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.userName} numberOfLines={1}>
            {usuario?.nombres || usuario?.nombre || 'Usuario'}
          </Text>
          <Text style={styles.userRole}>
            {usuario?.perfil || usuario?.rol || 'LifeOS User'}
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ padding: 5 }}>
          <FontAwesome5 name="sign-out-alt" size={14} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </TouchableOpacity>
      
    </View>
  );
}

const localStyles = StyleSheet.create({
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20, 
    resizeMode: 'cover',
  }
});