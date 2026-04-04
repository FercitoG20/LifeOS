import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../EstilosDashboard';

export default function Encabezado({ isSidebarOpen, setSidebarOpen, usuario }) {
  return (
    <View style={[styles.topHeader, localStyles.headerOverride]}>
      <View style={styles.headerLeft}>
        {/* MENÚ HAMBURGUESA INTACTO (ahora con el color cyan de tu diseño) */}
        <TouchableOpacity 
          onPress={() => setSidebarOpen(!isSidebarOpen)} 
          style={styles.menuIconBtn}
        >
          <FontAwesome5 name="bars" size={18} color="#00f2ff" />
        </TouchableOpacity>
        
        {/* LOGO ADAPTADO DE LA PRESENTACIÓN */}
        <View style={localStyles.logoWrapper}>
          <Image 
            source={require('../../../../assets//img/Logo-LifeOS.png')} 
            style={localStyles.logoImage} 
            resizeMode="contain"
          />
        </View>
        <Text style={localStyles.logoText}>
          Sistema <Text style={{fontWeight:'bold'}}>LifeOS</Text>
        </Text>
      </View>

      {/* BUSCADOR INTACTO */}
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={14} color="rgba(255,255,255,0.4)" />
        <TextInput 
          placeholder="Buscar módulo..." 
          placeholderTextColor="rgba(255,255,255,0.4)" 
          style={styles.searchInput} 
        />
      </View>
    </View>
  );
}

// Estilos locales para fusionar el diseño de "Presentacion" sin romper el layout
const localStyles = StyleSheet.create({
  headerOverride: {
    backgroundColor: 'rgba(5, 8, 16, 0.98)',
    borderBottomColor: 'rgba(0, 242, 255, 0.1)',
  },
  logoWrapper: { 
    width: 35, 
    height: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 20 
  },
  logoImage: { width: '250%', height: '250%' }, 
  logoText: { color: 'white', fontSize: 16 }
});