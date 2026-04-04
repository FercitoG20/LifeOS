import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Importación de Estilos Globales
import { styles } from './EstilosDashboard';

// Importación de Componentes de Estructura
import Encabezado from './componentes/encabezado';
import MenuHamburguesa from './componentes/menu-hamburguesa';
import PieDePagina from './componentes/pie-de-pagina';

// Importación de Módulos de Contenido
import Resumen from './modulos/Resumen';
import Planificador from './modulos/Planificador';
import Finanzas from './modulos/Finanzas';
import Salud from './modulos/Salud';
import Perfil from './modulos/Perfil';

export default function DashboardGeneral({ route, navigation }) {
  
  // 1. 🔥 LA CLAVE: Convertimos el usuario en un ESTADO
  // Esto permite que cuando llamemos a setDatosUsuario, el menú cambie al instante.
  const [datosUsuario, setDatosUsuario] = useState({
    id: route.params?.usuario?.id || null,
    nombres: route.params?.usuario?.nombres || 'Usuario LifeOS',
    nombre: route.params?.usuario?.nombres || 'Usuario LifeOS', // Doble referencia por compatibilidad
    apellido_paterno: route.params?.usuario?.apellido_paterno || '',
    rol: route.params?.usuario?.perfil || 'rol', 
    email: route.params?.usuario?.email || 'config@lifeos.com',
    foto: route.params?.usuario?.foto || null 
  });

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('resumen');

  // 2. Selector dinámico de contenido
  // Pasamos 'setDatosUsuario' como prop al Perfil para que pueda avisar de los cambios
  const renderMainContent = () => {
    switch(activeSection) {
      case 'resumen': 
        return <Resumen isSidebarOpen={isSidebarOpen} usuario={datosUsuario} />;
      case 'planificador': 
        return <Planificador />;
      case 'finanzas': 
        return <Finanzas />;
      case 'salud': 
        return <Salud />;
      case 'perfil': 
        return (
          <Perfil 
            usuario={datosUsuario} 
            setUsuario={setDatosUsuario} // 🔥 Pasamos la función de actualización
            isSidebarOpen={isSidebarOpen} 
          />
        );
      default: 
        return <Resumen isSidebarOpen={isSidebarOpen} usuario={datosUsuario} />;
    }
  };

  return (
    <View style={layout.window}>
      <LinearGradient colors={['#090a0f', '#151726']} style={StyleSheet.absoluteFill} />

      {/* 3. HEADER FIJO */}
      <Encabezado 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        usuario={datosUsuario} 
      />

      {/* 4. SIDEBAR FIJO (Ahora reaccionará a datosUsuario) */}
      {isSidebarOpen && (
        <MenuHamburguesa 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          navigation={navigation}
          usuario={datosUsuario} // 🔥 El menú ahora escucha el estado dinámico
        />
      )}

      {/* 5. ÁREA DE TRABAJO */}
      <View style={[
        layout.mainArea, 
        { left: isSidebarOpen ? 240 : 0 } 
      ]}>
        
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ 
            flexGrow: 1, 
            padding: 20, 
            paddingBottom: 80 
          }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          {renderMainContent()}
        </ScrollView>
        
      </View>

      {/* 6. FOOTER FIJO */}
      <PieDePagina />
    </View>
  );
}

const layout = StyleSheet.create({
  window: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: '#090a0f',
    overflow: 'hidden', 
  },
  mainArea: {
    position: 'absolute',
    top: 60,    
    bottom: 40, 
    right: 0,
    overflow: 'hidden', 
    ...(Platform.OS === 'web' && { transition: 'left 0.3s ease' }),
  }
});