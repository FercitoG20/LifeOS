import React from 'react';
import { View, Text, ProgressBarAndroid, Platform, ProgressViewIOS } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../EstilosDashboard';

export default function Salud() {
  const MetricaSalud = ({ icon, label, value, color, percent }) => (
    <View style={[styles.chartCard, {width: '100%', marginBottom: 10, flexDirection: 'row', alignItems: 'center'}]}>
      <FontAwesome5 name={icon} size={20} color={color} style={{marginRight: 20}} />
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
          <Text style={{color: '#fff', fontSize: 12}}>{label}</Text>
          <Text style={{color: color, fontSize: 12, fontWeight: 'bold'}}>{value}</Text>
        </View>
        <View style={{height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2}}>
          <View style={{height: 4, backgroundColor: color, width: `${percent}%`, borderRadius: 2}} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.modulePadding}>
      <Text style={styles.moduleTitle}>ESTADO <Text style={{color: '#ff4b2b'}}>BIO-VITAL</Text></Text>
      <Text style={[styles.moduleSubtitle, {marginBottom: 20}]}>Sincronización de biosensores activa</Text>
      
      <MetricaSalud icon="tint" label="Hidratación" value="2.5L / 3L" color="#00f2ff" percent={80} />
      <MetricaSalud icon="running" label="Actividad Física" value="6,400 / 10,000 pasos" color="#00e676" percent={64} />
      <MetricaSalud icon="moon" label="Descanso" value="7h / 8h" color="#ffcc00" percent={87} />
    </View>
  );
}