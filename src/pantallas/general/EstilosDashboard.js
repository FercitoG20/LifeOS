import { StyleSheet, Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#090a0f',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    overflow: 'hidden' 
  },
  
  // --- HEADER CLAVADO ARRIBA ---
  topHeader: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.08)', 
    backgroundColor: '#0f1019', 
    zIndex: 3000, // Máxima prioridad
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBtn: { marginRight: 15, padding: 5 },
  brandTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    width: '30%', 
    height: 35 
  },
  searchInput: { color: '#fff', marginLeft: 10, fontSize: 12, flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  systemStatus: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' },
  
  // --- SIDEBAR CLAVADO A LA IZQUIERDA ---
  sidebar: { 
    width: 240, 
    backgroundColor: '#0f1019', 
    borderRightWidth: 1, 
    borderRightColor: 'rgba(255,255,255,0.05)', 
    justifyContent: 'space-between',
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    left: 0,
    top: 60, 
    bottom: 40, 
    zIndex: 2500
  },
  menuItems: { flex: 1, paddingTop: 15 },
  menuLink: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 5,
    marginHorizontal: 10
  },
  menuLinkActive: { backgroundColor: '#6200ee' },
  menuLinkText: { color: 'rgba(255,255,255,0.4)', marginLeft: 12, fontSize: 13 },
  
  // --- PERFIL EN SIDEBAR ---
  profileSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 12,
    margin: 15
  },
  avatar: { 
    width: 32, 
    height: 32, 
    backgroundColor: '#6200ee', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8,
    overflow: 'hidden'
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  userName: { color: '#fff', fontSize: 11, fontWeight: '600' },
  userRole: { color: '#00f2ff', fontSize: 8 },

  // --- ÁREA DE CONTENIDO (CONTENEDOR DINÁMICO) ---
  mainContent: { 
    flex: 1, 
    height: Platform.OS === 'web' ? '100vh' : '100%',
    // LA SOLUCIÓN DEL SCROLL: Usamos padding en lugar de margin
    paddingTop: 80,    // 60px del Header + 20px de respiro
    paddingBottom: 80, // 40px del Footer + 40px de respiro
    paddingHorizontal: 20, 
  },

  // --- FOOTER CLAVADO ABAJO ---
  footer: { 
    height: 40, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', 
    backgroundColor: '#090a0f',
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3000,
    width: '100%'
  },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 8, letterSpacing: 1 },
  footerLink: { color: 'rgba(255,255,255,0.2)', fontSize: 8 },

  // --- ELEMENTOS DE MÓDULOS ---
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { width: '23%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 20, padding: 10 },
  day: { width: '13.2%', margin: '0.54%', minHeight: 90, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dayToday: { borderColor: '#00f2ff', backgroundColor: 'rgba(0, 242, 255, 0.05)', borderWidth: 2 },
  dayNumber: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold' },
});