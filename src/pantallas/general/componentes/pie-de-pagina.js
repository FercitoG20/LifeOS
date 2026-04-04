import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../EstilosDashboard';

export default function PieDePagina() {
  return (
    <View style={[styles.footer, localStyles.footerOverride]}>
      <Text style={localStyles.footerLogo}>LifeOS</Text>
      <Text style={localStyles.footerText}>
        GESTIÓN INTELIGENTE © 2026 | INPUT PROTEGIDO
      </Text>
    </View>
  );
}

// Estilos locales de la presentación para el footer
const localStyles = StyleSheet.create({
  footerOverride: {
    backgroundColor: 'rgba(5, 8, 16, 0.98)',
    borderTopColor: 'rgba(0, 242, 255, 0.1)',
    justifyContent: 'space-between', // Manda el logo a la izq y el texto a la der
  },
  footerLogo: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  footerText: { 
    color: 'rgba(255,255,255,0.3)', 
    fontSize: 9, 
    letterSpacing: 1
  }
});