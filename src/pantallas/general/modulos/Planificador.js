import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Modal, TextInput, 
  Alert, StyleSheet, FlatList, Dimensions, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../EstilosDashboard';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function Planificador() {
  const [fechaVista, setFechaVista] = useState(new Date());
  const [db, setDb] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPicker, setModalPicker] = useState({ visible: false, tipo: '' });
  const [verLista, setVerLista] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [nuevaTarea, setNuevaTarea] = useState({ h: '12', m: '00', p: 'PM', titulo: '', id: null });

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diasSemana = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const anios = Array.from({ length: 11 }, (_, i) => 2024 + i);

  const hoyStr = new Date().toISOString().split('T')[0];
  const esFechaPasada = (fecha) => fecha < hoyStr;

  // --- ANIMACIÓN AL CAMBIAR VISTA ---
  const toggleVista = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVerLista(!verLista);
  };

  // --- LÓGICA DE RELOJ ---
  const handleHoraManual = (val) => {
    let clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNuevaTarea({...nuevaTarea, h: ''}); return; }
    let n = parseInt(clean);
    setNuevaTarea({...nuevaTarea, h: n > 12 ? '12' : String(n)});
  };

  const handleMinManual = (val) => {
    let clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNuevaTarea({...nuevaTarea, m: ''}); return; }
    let n = parseInt(clean);
    setNuevaTarea({...nuevaTarea, m: n > 59 ? '59' : String(n).padStart(2, '0')});
  };

  const salvarTarea = () => {
    if (esFechaPasada(fechaSeleccionada)) return;
    if (!nuevaTarea.titulo.trim() || !nuevaTarea.h) return;
    
    const horaFinal = `${nuevaTarea.h.padStart(2,'0')}:${nuevaTarea.m.padStart(2,'0')} ${nuevaTarea.p}`;
    const actuales = db[fechaSeleccionada] || [];
    let nuevas = nuevaTarea.id !== null 
      ? actuales.map((t, idx) => idx === nuevaTarea.id ? { ...t, hora: horaFinal, titulo: nuevaTarea.titulo } : t)
      : [...actuales, { hora: horaFinal, titulo: nuevaTarea.titulo, completada: false }];

    setDb({ ...db, [fechaSeleccionada]: nuevas });
    setNuevaTarea({ h: '12', m: '00', p: 'PM', titulo: '', id: null });
    toggleVista(); // Animado
  };

  const toggleCompletada = (idx) => {
    if (esFechaPasada(fechaSeleccionada)) return;
    const nuevas = db[fechaSeleccionada].map((t, i) => i === idx ? { ...t, completada: !t.completada } : t);
    setDb({ ...db, [fechaSeleccionada]: nuevas });
  };

  // --- RENDER DÍAS CON PUNTOS INTELIGENTES ---
  const renderDias = () => {
    const y = fechaVista.getFullYear(), m = fechaVista.getMonth();
    const primerDia = new Date(y, m, 1).getDay();
    const totalDias = new Date(y, m + 1, 0).getDate();
    const celdas = [];
    for (let i = 0; i < primerDia; i++) celdas.push(<View key={`e-${i}`} style={[styles.day, styles.dayEmpty]} />);
    
    for (let d = 1; d <= totalDias; d++) {
      const id = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const esHoy = hoyStr === id;
      const tareasDia = db[id] || [];
      const tieneTareas = tareasDia.length > 0;
      // MEJORA 2: Punto inteligente (Si todo está completado, se apaga)
      const todasCompletadas = tieneTareas && tareasDia.every(t => t.completada);

      celdas.push(
        <TouchableOpacity 
          key={d} 
          style={[styles.day, esHoy && { borderColor: '#00f2ff', borderWidth: 1.5 }]} 
          onPress={() => { 
            setFechaSeleccionada(id); 
            setVerLista(esFechaPasada(id) || tieneTareas); 
            setModalVisible(true); 
          }}
        >
          <Text style={[styles.dayNumber, esHoy && {color: '#00f2ff'}, esFechaPasada(id) && {opacity: 0.4}]}>{d}</Text>
          {tieneTareas && (
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
              <View style={[
                localStyles.puntoBase, 
                { backgroundColor: todasCompletadas ? '#333' : (esFechaPasada(id) ? '#006633' : '#00ff88') },
                !todasCompletadas && !esFechaPasada(id) && localStyles.puntoBrillo
              ]} />
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return celdas;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#050505' }}>
      
      {/* HEADER SELECTORES DARK */}
      <View style={localStyles.headerContainer}>
        <TouchableOpacity style={localStyles.navBtn} onPress={() => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() - 1, 1))}>
          <FontAwesome5 name="chevron-left" color="#00f2ff" size={14} />
        </TouchableOpacity>

        <View style={localStyles.pickerGroup}>
          <TouchableOpacity style={localStyles.capsulaSelector} onPress={() => setModalPicker({ visible: true, tipo: 'mes' })}>
            <Text style={localStyles.selectorText}>{meses[fechaVista.getMonth()]}</Text>
            <FontAwesome5 name="sort-down" size={12} color="#00f2ff" style={{marginTop: -4}} />
          </TouchableOpacity>

          <TouchableOpacity style={[localStyles.capsulaSelector, { width: 95, marginLeft: 8 }]} onPress={() => setModalPicker({ visible: true, tipo: 'anio' })}>
            <Text style={localStyles.selectorText}>{fechaVista.getFullYear()}</Text>
            <FontAwesome5 name="sort-down" size={12} color="#00f2ff" style={{marginTop: -4}} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={localStyles.navBtn} onPress={() => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() + 1, 1))}>
          <FontAwesome5 name="chevron-right" color="#00f2ff" size={14} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>{diasSemana.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}{renderDias()}</View>

      {/* SELECTOR DARK MES/AÑO */}
      <Modal visible={modalPicker.visible} transparent animationType="fade">
        <TouchableOpacity style={localStyles.modalOverlaySimple} activeOpacity={1} onPress={() => setModalPicker({ visible: false, tipo: '' })}>
          <View style={localStyles.miniModalContent}>
            <FlatList
              data={modalPicker.tipo === 'mes' ? meses : anios}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  style={localStyles.miniModalItem} 
                  onPress={() => {
                    const nueva = modalPicker.tipo === 'mes' ? new Date(fechaVista.getFullYear(), index, 1) : new Date(item, fechaVista.getMonth(), 1);
                    setFechaVista(nueva);
                    setModalPicker({ visible: false, tipo: '' });
                  }}
                >
                  <Text style={[localStyles.miniModalItemText, (modalPicker.tipo === 'mes' ? fechaVista.getMonth() === index : fechaVista.getFullYear() === item) && { color: '#00f2ff', fontWeight: 'bold' }]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL DE TAREAS (CON MEJORAS 3 Y FIX) */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentMobile, {borderColor: esFechaPasada(fechaSeleccionada) ? '#444' : '#00ff88'}]}>
            <View style={styles.modalHeaderMobile}>
              <View>
                <Text style={styles.modalTitleMobile}>{esFechaPasada(fechaSeleccionada) ? "BITÁCORA HISTÓRICA" : "LIFEOS PLANNER"}</Text>
                <Text style={{color: '#666', fontSize: 10}}>{fechaSeleccionada}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}><FontAwesome5 name="times" size={20} color="#fff" /></TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={{backgroundColor: esFechaPasada(fechaSeleccionada) ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,136,0.1)', padding: 12, borderRadius: 12, marginBottom: 15, alignItems: 'center'}} 
              onPress={() => !esFechaPasada(fechaSeleccionada) && toggleVista()}
            >
              <Text style={{color: esFechaPasada(fechaSeleccionada) ? '#888' : '#00ff88', fontWeight: 'bold'}}>
                {verLista ? (esFechaPasada(fechaSeleccionada) ? "LISTA DE ACTIVIDADES" : "+ AGREGAR NUEVA") : "📂 VER LISTA DEL DÍA"}
              </Text>
            </TouchableOpacity>

            {verLista ? (
              <ScrollView style={{maxHeight: 350}} showsVerticalScrollIndicator={false}>
                {(db[fechaSeleccionada] || []).map((t, i) => (
                  <View key={i} style={[localStyles.itemTarea, {opacity: t.completada ? 0.4 : 1}]}>
                    <TouchableOpacity onPress={() => toggleCompletada(i)} disabled={esFechaPasada(fechaSeleccionada)} style={{marginRight: 15}}>
                        <FontAwesome5 name={t.completada ? "check-circle" : "circle"} size={22} color={t.completada ? "#00ff88" : "rgba(255,255,255,0.2)"} />
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                      <Text style={{color: '#00ff88', fontSize: 10, fontWeight: 'bold'}}>{t.hora}</Text>
                      <Text style={{color: '#fff', textDecorationLine: t.completada ? 'line-through' : 'none'}}>{t.titulo}</Text>
                    </View>
                    {!esFechaPasada(fechaSeleccionada) && (
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => prepararEdicion(i, t)} style={{padding: 8}}><FontAwesome5 name="edit" color="#6200ee" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => setDb({...db, [fechaSeleccionada]: db[fechaSeleccionada].filter((_,idx)=>idx!==i)})} style={{padding: 8}}><FontAwesome5 name="trash" color="#ff4444" /></TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View>
                <Text style={styles.inputLabelMobile}>NUEVA ACTIVIDAD</Text>
                <TextInput style={styles.inputMobile} placeholder="¿Qué vamos a lograr?" placeholderTextColor="#444" value={nuevaTarea.titulo} onChangeText={v => setNuevaTarea({...nuevaTarea, titulo: v})} />

                <Text style={[styles.inputLabelMobile, {marginTop: 15}]}>HORA CONFIGURADA</Text>
                <View style={localStyles.relojContenedor}>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => handleHoraManual(String(parseInt(nuevaTarea.h || 0) + 1))}><FontAwesome5 name="chevron-up" color="#6200ee" /></TouchableOpacity>
                    <TextInput style={localStyles.relojInput} keyboardType="numeric" maxLength={2} value={nuevaTarea.h} onChangeText={handleHoraManual} />
                    <TouchableOpacity onPress={() => handleHoraManual(String(parseInt(nuevaTarea.h || 2) - 1))}><FontAwesome5 name="chevron-down" color="#6200ee" /></TouchableOpacity>
                  </View>
                  <Text style={{color: '#6200ee', fontSize: 26}}>:</Text>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => handleMinManual(String(parseInt(nuevaTarea.m || 0) + 5))}><FontAwesome5 name="chevron-up" color="#6200ee" /></TouchableOpacity>
                    <TextInput style={localStyles.relojInput} keyboardType="numeric" maxLength={2} value={nuevaTarea.m} onChangeText={handleMinManual} />
                    <TouchableOpacity onPress={() => handleMinManual(String(parseInt(nuevaTarea.m || 5) - 5))}><FontAwesome5 name="chevron-down" color="#6200ee" /></TouchableOpacity>
                  </View>
                  <TouchableOpacity style={localStyles.pBtn} onPress={() => setNuevaTarea({...nuevaTarea, p: nuevaTarea.p === 'AM' ? 'PM' : 'AM'})}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>{nuevaTarea.p}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.btnGuardarMobile, {marginTop: 25}]} onPress={salvarTarea}>
                  <Text style={styles.btnGuardarTextMobile}>{nuevaTarea.id !== null ? "ACTUALIZAR" : "CONFIRMAR PLAN"}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, backgroundColor: '#0a0a0a' },
  navBtn: { width: 35, height: 35, backgroundColor: '#151515', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  pickerGroup: { flexDirection: 'row', marginHorizontal: 10 },
  capsulaSelector: { backgroundColor: '#111', borderRadius: 12, borderWidth: 1, borderColor: '#333', height: 45, width: 135, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  selectorText: { color: '#00f2ff', fontWeight: 'bold', fontSize: 14 },
  modalOverlaySimple: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  miniModalContent: { width: 180, maxHeight: 300, backgroundColor: '#0f0f0f', borderRadius: 20, borderWidth: 1, borderColor: '#00f2ff44', padding: 10 },
  miniModalItem: { paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  miniModalItemText: { color: '#888', fontSize: 16 },
  puntoBase: { width: 7, height: 7, borderRadius: 4 },
  puntoBrillo: { shadowColor: '#00ff88', shadowRadius: 5, elevation: 10 },
  itemTarea: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#090a0f', padding: 12, borderRadius: 15, marginBottom: 10 },
  relojContenedor: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#6200ee44' },
  relojInput: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', width: 45 },
  pBtn: { backgroundColor: '#6200ee', padding: 12, borderRadius: 12 }
});