import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Modal, TextInput, 
  StyleSheet, SafeAreaView, ScrollView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur';

export default function Finanzas() {
  const [inputValue, setInputValue] = useState("14000"); 
  const [unidad, setUnidad] = useState('Mensual');
  const [baseMensual, setBaseMensual] = useState(14000);
  const [modalVisible, setModalVisible] = useState(false);
  const [montoPrincipal, setMontoPrincipal] = useState(14000);

  // --- LÓGICA DE AHORRO PERSONALIZADO ---
  const [esPorcentaje, setEsPorcentaje] = useState(true);
  const [valorAhorro, setValorAhorro] = useState("10");

  const [gastos, setGastos] = useState([
    { id: 1, nombre: 'Renta', monto: 5000, tipo: 'Mensual' },
    { id: 2, nombre: 'Internet', monto: 500, tipo: 'Mensual' }
  ]);

  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  
  const ahorroCalculado = esPorcentaje 
    ? (montoPrincipal * (parseFloat(valorAhorro) / 100) || 0)
    : (parseFloat(valorAhorro) || 0);

  const disponible = montoPrincipal - ahorroCalculado - totalGastos;

  // Validación estricta para el ahorro (Solo números positivos)
  const validarAhorro = (texto) => {
    let limpio = texto.replace(/[^0-9.]/g, ''); // Bloquea letras, símbolos y negativos
    setValorAhorro(limpio);
  };

  const validarYSetear = (texto) => {
    let limpio = texto.replace(/[^0-9.]/g, ''); 
    setInputValue(limpio);
    let valor = parseFloat(limpio) || 0;
    let nuevaBase = unidad === 'Hora' ? valor * 160 : unidad === 'Dia' ? valor * 30 : unidad === 'Semana' ? valor * 4 : unidad === 'Quincena' ? valor * 2 : valor;
    setBaseMensual(nuevaBase);
  };

  const cambiarUnidad = (nuevaUnidad) => {
    let n = nuevaUnidad === 'Hora' ? baseMensual / 160 : nuevaUnidad === 'Dia' ? baseMensual / 30 : nuevaUnidad === 'Semana' ? baseMensual / 4 : nuevaUnidad === 'Quincena' ? baseMensual / 2 : baseMensual;
    setInputValue(Number.isInteger(n) ? n.toString() : n.toFixed(2));
    setUnidad(nuevaUnidad);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. TARJETA PRINCIPAL */}
      <TouchableOpacity 
        style={styles.cardPrincipal} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardLabel}>INGRESO MENSUAL ACTUAL (PESOS MEXICANOS)</Text>
        <Text style={styles.montoGrande}>$ {montoPrincipal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
        <View style={styles.hintContainer}>
          <Ionicons name="finger-print-outline" size={18} color="rgba(255,255,255,0.3)" />
          <Text style={styles.hintText}>PRESIONA AQUÍ PARA CONFIGURAR TU SALARIO</Text>
        </View>
      </TouchableOpacity>

      {/* 2. DASHBOARD DE AHORRO Y GASTOS */}
      <View style={styles.miniDashboard}>
        <View style={[styles.miniBox, { borderColor: '#6200ee' }]}>
          <Text style={[styles.labelPersonalizado, styles.neonTextVioleta]}>
            {esPorcentaje ? "VALOR PERSONALIZADO EN PORCENTAJE" : "VALOR PERSONALIZADO"}
          </Text>
          
          <View style={styles.rowInputAhorro}>
            <TextInput 
              style={[styles.miniMontoInput, styles.neonTextVioleta]}
              value={valorAhorro}
              onChangeText={validarAhorro}
              placeholder="Ingresa una cantidad" // Texto de ayuda
              placeholderTextColor="rgba(98, 0, 238, 0.3)"
              keyboardType="numeric" // Solo teclado numérico
            />
            <Text style={[styles.simboloFuerte, styles.neonTextVioleta]}>{esPorcentaje ? "%" : "$"}</Text>
          </View>
          
          {/* CORRECCIÓN: Botón con relleno verde sólido (no neón) */}
          <TouchableOpacity 
            onPress={() => setEsPorcentaje(!esPorcentaje)} 
            style={styles.btnTipoVerdeSolido}
          >
             <Text style={styles.btnTipoTxtNegro}>CAMBIAR A {esPorcentaje ? 'MONTO' : 'PORCENTAJE'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.miniBox, { borderColor: '#ff4d4d' }]}>
          <Text style={[styles.miniLabel, styles.neonTextRojo]}>TOTAL GASTOS</Text>
          <Text style={[styles.miniMontoStatic, styles.neonTextRojo]}>$ {totalGastos.toLocaleString()}</Text>
          <Text style={styles.labelEquivale}>ACTUALIZADO</Text>
        </View>
      </View>

      <View style={styles.disponibleBar}>
        <Text style={styles.disponibleTxt}>DISPONIBLE: $ {disponible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
      </View>

      <View style={styles.headerLista}>
        <Text style={styles.seccionTitle}>LISTADO DE GASTOS</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={24} color="#00f2ff" />
        </TouchableOpacity>
      </View>

      {/* 3. LISTADO DE GASTOS */}
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {gastos.map(g => (
          <View key={g.id} style={styles.gastoRow}>
            <View>
              <Text style={styles.gastoName}>{g.nombre}</Text>
              <Text style={styles.gastoType}>{g.tipo}</Text>
            </View>
            <Text style={styles.gastoMonto}>-$ {g.monto.toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>

      {/* MODAL (TU PLANTILLA ORIGINAL) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.glassModalMaster}>
            <View style={styles.modalHeaderGrid}>
              <Text style={styles.headerTitleMain}>CONFIGURAR SALARIO</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close-circle-outline" size={26} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGlassWrapperMaster}>
              <Text style={styles.cianDollarMain}>$</Text>
              <TextInput 
                style={styles.textInputMainMaster}
                keyboardType="decimal-pad"
                value={inputValue}
                onChangeText={validarYSetear}
                selectionColor="#00f2ff"
              />
            </View>

            <View style={styles.tabsGridMaster}>
              {['Hora', 'Dia', 'Semana', 'Quincena', 'Mensual'].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  onPress={() => cambiarUnidad(item)}
                  style={[styles.tabBtnMaster, unidad === item && styles.tabActiveMaster]}
                >
                  <Text style={[styles.tabText, unidad === item && {color: '#fff'}]}>{item}</Text>
                  {unidad === item && <View style={styles.activeDot} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tableGlassMaster}>
              <View style={styles.filaGlass}><Text style={styles.labelGlassMaster}>Quincena:</Text><Text style={styles.valGlassMaster}>$ {(baseMensual / 2).toLocaleString('es-MX', {minimumFractionDigits: 2})}</Text></View>
              <View style={styles.filaGlass}><Text style={styles.labelGlassMaster}>Semana:</Text><Text style={styles.valGlassMaster}>$ {(baseMensual / 4).toLocaleString('es-MX', {minimumFractionDigits: 2})}</Text></View>
              <View style={styles.filaGlass}><Text style={styles.labelGlassMaster}>Día:</Text><Text style={styles.valGlassMaster}>$ {(baseMensual / 30).toLocaleString('es-MX', {minimumFractionDigits: 2})}</Text></View>
              <View style={[styles.filaGlass, {borderBottomWidth: 0}]}><Text style={styles.labelCianMaster}>Valor Hora:</Text><Text style={styles.valCianMaster}>$ {(baseMensual / 160).toLocaleString('es-MX', {minimumFractionDigits: 2})}</Text></View>
            </View>

            <TouchableOpacity style={styles.btnAceptarFormal} onPress={() => { setMontoPrincipal(baseMensual); setModalVisible(false); }}>
              <Text style={styles.btnAceptarTextMaster}>GUARDAR CAMBIOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  cardPrincipal: { backgroundColor: '#050505', paddingVertical: 45, borderRadius: 25, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#0a0a0a' },
  cardLabel: { color: '#00ff88', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 10 },
  montoGrande: { color: '#fff', fontSize: 42, fontWeight: '900' }, 
  hintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20, opacity: 0.5 },
  hintText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginLeft: 8 },

  miniDashboard: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  miniBox: { backgroundColor: '#080808', width: '48%', padding: 15, borderRadius: 18, borderWidth: 1, justifyContent: 'center' },
  
  labelPersonalizado: { fontSize: 11, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  rowInputAhorro: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  miniMontoInput: { fontSize: 32, fontWeight: 'bold', padding: 0, minWidth: 60, textAlign: 'center' },
  simboloFuerte: { fontSize: 24, fontWeight: 'bold', marginLeft: 5 },
  
  // CORRECCIÓN: Botón con relleno verde sólido (no neón y sin resplandor)
  btnTipoVerdeSolido: { 
    marginTop: 15, 
    backgroundColor: '#00cc6a', // Verde sólido y sobrio
    paddingVertical: 10, 
    borderRadius: 12, 
    alignItems: 'center',
  },
  btnTipoTxtNegro: { color: '#000', fontSize: 10, fontWeight: '900' },

  miniLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  miniMontoStatic: { fontSize: 32, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  labelEquivale: { color: '#222', fontSize: 9, fontWeight: 'bold', marginTop: 4, textAlign: 'center' },

  neonTextVioleta: { color: '#6200ee', textShadowColor: '#6200ee', textShadowRadius: 8 },
  neonTextRojo: { color: '#ff4d4d', textShadowColor: '#ff4d4d', textShadowRadius: 8 },

  disponibleBar: { backgroundColor: 'rgba(0,242,255,0.05)', padding: 12, borderRadius: 12, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#00f2ff' },
  disponibleTxt: { color: '#00f2ff', fontSize: 13, fontWeight: 'bold' },
  headerLista: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  seccionTitle: { color: '#333', fontSize: 11, fontWeight: 'bold' },
  gastoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#050505', borderRadius: 15, marginBottom: 8, borderWidth: 1, borderColor: '#0a0a0a' },
  gastoName: { color: '#eee', fontSize: 14 },
  gastoType: { color: '#222', fontSize: 10 },
  gastoMonto: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 14 },

  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  glassModalMaster: { width: '90%', maxWidth: 450, backgroundColor: 'rgba(10, 10, 10, 0.85)', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  modalHeaderGrid: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  headerTitleMain: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  closeBtn: { position: 'absolute', right: 0 },
  inputGlassWrapperMaster: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 20 },
  cianDollarMain: { color: '#00f2ff', fontSize: 22, fontWeight: 'bold', marginRight: 15 },
  textInputMainMaster: { color: '#fff', fontSize: 30, fontWeight: 'bold', flex: 1 },
  tabsGridMaster: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  tabBtnMaster: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(17, 17, 17, 0.5)', marginHorizontal: 3, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center' },
  tabActiveMaster: { backgroundColor: '#6200ee' },
  tabText: { color: '#444', fontSize: 10, fontWeight: 'bold' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', marginTop: 4 },
  tableGlassMaster: { backgroundColor: 'rgba(8, 8, 8, 0.5)', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 25 },
  filaGlass: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  labelGlassMaster: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  valGlassMaster: { color: '#fff', fontWeight: '900', fontSize: 14 },
  labelCianMaster: { color: '#00f2ff', fontWeight: 'bold', fontSize: 14 },
  valCianMaster: { color: '#00f2ff', fontWeight: '900', fontSize: 14 },
  btnAceptarFormal: { backgroundColor: '#00f2ff', padding: 20, borderRadius: 15, alignItems: 'center' },
  btnAceptarTextMaster: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 4 }
});