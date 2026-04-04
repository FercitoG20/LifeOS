import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Platform, Image, useWindowDimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Presentacion({ navigation }) {
  const [ingreso, setIngreso] = useState('');
  
  // LA MAGIA DE LA RESPONSIVIDAD EN TIEMPO REAL
  const { width } = useWindowDimensions(); 

  // CÁLCULO OPTIMIZADO: Solo números positivos, sin letras ni caracteres especiales
  const calculos = useMemo(() => {
    const num = Math.max(0, parseFloat(ingreso) || 0);

    const formato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

    return {
      quincena: formato.format(num / 2),
      semana: formato.format(num / 4.33),
      dia: formato.format(num / 30),
      hora: formato.format(num / 160),
    };
  }, [ingreso]);

  // Función de control de entrada: Bloquea letras, signos y negativos en tiempo real
  const handleTextChange = (text) => {
    const cleanNumber = text.replace(/[^0-9.]/g, '');
    setIngreso(cleanNumber);
  };

  const hoy = new Date().getDate();
  const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const diasMes = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.master}>
      <LinearGradient colors={['#050810', '#0a1227', '#050810']} style={StyleSheet.absoluteFill} />
      
      {/* 1. HEADER FIJO */}
      <View style={styles.header}>
        <View style={styles.logoGroup}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../assets/img/Logo-LifeOS.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>
          {/* Ocultamos el texto del logo en pantallas muy pequeñas para que no rompa el diseño */}
          {width > 600 && (
            <Text style={styles.logoText}>
              Sistema de administración <Text style={{fontWeight:'bold'}}>LifeOS</Text>
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.btnStart} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      </View>

      {/* 2. ÁREA DE CONTENIDO ANCLADA (SCROLL PERFECTO) */}
      <View style={styles.bodyContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          alwaysBounceVertical={false}
        >
          {/* El layout cambia de fila (row) a columna (column) según el ancho */}
          <View style={[styles.mainLayout, { flexDirection: width > 1100 ? 'row' : 'column' }]}>
            
            {/* COLUMNA IZQUIERDA (DISEÑO RECUPERADO) */}
            <View style={[styles.infoCol, { width: width > 1100 ? 450 : '100%' }]}>
              <Text style={styles.title}>Tu vida en un{"\n"}<Text style={styles.cyan}>Ecosistema Digital.</Text></Text>
              
              <View style={styles.userList}>
                {[
                  { icon: 'user-graduate', t: 'Estudiantes', d: 'Control de materias y presupuestos.' },
                  { icon: 'briefcase', t: 'Profesionales', d: 'Flujo de trabajo y tiempo.' },
                  { icon: 'rocket', t: 'Emprendedores', d: 'Finanzas de proyectos.' },
                  { icon: 'users', t: 'Usuario General', d: 'Orden diario y ahorros.' }
                ].map((item, i) => (
                  <View key={i} style={styles.userItem}>
                    <View style={styles.userIconBox}>
                      <FontAwesome5 name={item.icon} size={16} color="#00f2ff" />
                    </View>
                    <View>
                      <Text style={styles.userT}>{item.t}</Text>
                      <Text style={styles.userD}>{item.d}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* COLUMNA DERECHA (DASHBOARD) */}
            <View style={styles.toolsCol}>
              {/* Aquí controlamos que no se encimen. Si hay espacio van lado a lado, si no, uno arriba de otro */}
              <View style={[styles.toolsRow, { flexDirection: width > 800 ? 'row' : 'column' }]}>
                
                {/* CALENDARIO */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>MARZO 2026</Text>
                  <View style={styles.calGrid}>
                    {diasSemana.map((d, i) => <Text key={i} style={styles.calDayHead}>{d}</Text>)}
                    {diasMes.map(d => (
                      <View key={d} style={[styles.calDay, d === hoy && styles.calDayActive]}>
                        <Text style={[styles.calDayText, d === hoy && {color: '#000', fontWeight:'bold'}]}>{d}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* CALCULADORA */}
                <View style={styles.calcWrapper}>
                  <View style={[styles.card, styles.cardGlow]}>
                    <Text style={styles.cardTitle}>Calcular salario</Text>
                    <View style={styles.inputWrap}>
                      <Text style={styles.money}>$</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ingreso Mensual"
                        placeholderTextColor="#444"
                        keyboardType="decimal-pad" 
                        value={ingreso}
                        onChangeText={handleTextChange} 
                      />
                    </View>
                    <View style={styles.resWrap}>
                      <View style={styles.resRow}><Text style={styles.resL}>Quincena</Text><Text style={styles.resV}>{calculos.quincena}</Text></View>
                      <View style={styles.resRow}><Text style={styles.resL}>Semana</Text><Text style={styles.resV}>{calculos.semana}</Text></View>
                      <View style={styles.resRow}><Text style={styles.resL}>Día</Text><Text style={styles.resV}>{calculos.dia}</Text></View>
                      <View style={[styles.resRow, {borderBottomWidth: 0}]}><Text style={[styles.resL, {color:'#00f2ff'}]}>Valor Hora</Text><Text style={[styles.resV, {color:'#00f2ff'}]}>{calculos.hora}</Text></View>
                    </View>
                  </View>
                  
                  <View style={styles.experienceBox}>
                    <Text style={styles.expText}>
                      Puedes hacer esto y más. <Text style={styles.expCyan}>Logéate o crea tu cuenta</Text> para más experiencias como esta.
                    </Text>
                  </View>
                </View>

              </View>
            </View>

          </View>
        </ScrollView>
      </View>

      {/* 3. FOOTER FIJO */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>LifeOS</Text>
        <Text style={styles.footerText}>TODOS LOS DERECHOS RESERVADOS © 2026 | LIFEOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  master: { 
    flex: 1, 
    backgroundColor: '#050810',
    ...(Platform.OS === 'web' && { height: '100vh', overflow: 'hidden' })
  },
  header: {
    height: 70, 
    paddingHorizontal: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderColor: 'rgba(0, 242, 255, 0.1)',
    backgroundColor: 'rgba(5, 8, 16, 0.98)', 
    zIndex: 10
  },
  logoGroup: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoWrapper: { width: 105, height: 105, justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: '100%', height: '100%' },
  logoText: { color: 'white', fontSize: 18 },
  btnStart: { backgroundColor: '#00f2ff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6 },
  btnText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5, color: '#000' },
  bodyContainer: { 
    position: 'absolute',
    top: 70,
    bottom: 70,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  mainLayout: { justifyContent: 'center', gap: 50, maxWidth: 1200, width: '100%' },
  infoCol: { alignItems: 'flex-start' },
  title: { color: 'white', fontSize: 42, fontWeight: 'bold', lineHeight: 50, marginBottom: 35 },
  cyan: { color: '#00f2ff' },
  userList: { gap: 25 },
  userItem: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  userIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(0, 242, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 242, 255, 0.2)' },
  userT: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  userD: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 3 },
  toolsCol: { flex: 1, alignItems: 'center' },
  toolsRow: { gap: 30, alignItems: 'center', justifyContent: 'center' }, // Controla las tarjetas sin que se rompan
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', width: 320 },
  cardGlow: { borderColor: 'rgba(0, 242, 255, 0.3)' },
  cardTitle: { color: '#00f2ff', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, letterSpacing: 1 },
  calcWrapper: { gap: 15, width: 320 },
  experienceBox: { paddingHorizontal: 10 },
  expText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  expCyan: { color: '#00f2ff', fontWeight: 'bold' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  calDayHead: { width: '13%', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 10, marginBottom: 12 },
  calDay: { width: '13%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderRadius: 8 },
  calDayActive: { backgroundColor: '#00f2ff' },
  calDayText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#00f2ff' },
  money: { color: '#00f2ff', fontSize: 20, fontWeight: 'bold' },
  input: { flex: 1, height: 50, color: 'white', fontSize: 18, marginLeft: 10, outlineStyle: 'none' },
  resWrap: { gap: 10 },
  resRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  resL: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  resV: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  footer: { height: 70, backgroundColor: 'rgba(5, 8, 16, 0.98)', borderTopWidth: 1, borderColor: 'rgba(0, 242, 255, 0.1)', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  footerLogo: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 9, marginTop: 4, letterSpacing: 1 }
});