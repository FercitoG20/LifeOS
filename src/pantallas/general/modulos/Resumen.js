import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart, ContributionGraph, ProgressChart } from "react-native-chart-kit";
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../EstilosDashboard';

const screenWidth = Dimensions.get("window").width;

export default function Resumen({ isSidebarOpen }) {
  // Ajuste dinámico de ancho para que las gráficas no se corten
  const getAvailableWidth = () => {
    const sidebarWidth = isSidebarOpen ? 240 : 0;
    return screenWidth - sidebarWidth - 60; // Margen de seguridad
  };

  const chartConfig = {
    backgroundGradientFrom: "#151726",
    backgroundGradientTo: "#151726",
    color: (opacity = 1) => `rgba(0, 242, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <View>
      {/* GRID DE MÉTRICAS SUPERIORES */}
      <View style={styles.metricsGrid}>
        {[
          { label: 'AGUA', value: '0/8', icon: 'tint', color: '#00f2ff' },
          { label: 'SUEÑO', value: '0h', icon: 'moon', color: '#ffcc00' },
          { label: 'TAREAS', value: '0', icon: 'check-square', color: '#00e676' },
          { label: 'GASTOS', value: '$0', icon: 'piggy-bank', color: '#ff4b2b' },
        ].map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <FontAwesome5 name={m.icon} size={12} color={m.color} />
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
          </View>
        ))}
      </View>

      {/* FILA DE GRÁFICAS PRINCIPALES */}
      <View style={styles.chartsWrapper}>
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>BALANCE FINANCIERO</Text>
          <BarChart 
            data={{ labels: ["E", "F", "M"], datasets: [{ data: [3500, 4200, 2800] }] }} 
            width={getAvailableWidth() * 0.31} height={180} chartConfig={chartConfig} 
            style={{ borderRadius: 16 }} fromZero 
          />
        </View>
        
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>EQUILIBRIO BIO-VITAL</Text>
          <ProgressChart
            data={{ labels: ["Salud", "Agua", "Sueño"], data: [0.8, 0.6, 0.7] }}
            width={getAvailableWidth() * 0.31} height={180} strokeWidth={8} radius={32}
            chartConfig={{...chartConfig, color: (op) => `rgba(147, 51, 234, ${op})` }} 
            hideLegend={false}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>TENDENCIA VITAL</Text>
          <LineChart 
            data={{ labels: ["L", "M", "X"], datasets: [{ data: [4, 7, 5] }] }} 
            width={getAvailableWidth() * 0.31} height={180} 
            chartConfig={{...chartConfig, color: () => '#00f2ff'}} 
            bezier style={{ borderRadius: 16 }} 
          />
        </View>
      </View>

      {/* MAPA DE ACTIVIDAD (LOG DEL SISTEMA) */}
      <View style={styles.logContainer}>
          <Text style={styles.logTitle}><FontAwesome5 name="terminal" size={14} color="#00f2ff" /> LOG DEL SISTEMA</Text>
          <ContributionGraph
            values={[{ date: "2026-03-18", count: 5 }]} 
            endDate={new Date("2026-03-18")} 
            numDays={105}
            width={getAvailableWidth()} 
            height={200} 
            chartConfig={chartConfig}
          />
      </View>
    </View>
  );
}