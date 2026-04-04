import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // 1. EL CONTENEDOR MAESTRO ESTRICTO
  // ==========================================
  masterContainer: { 
    flex: 1, 
    backgroundColor: '#090a0f',
    position: 'relative', // Para que el degradado y estrellas no se escapen
    ...Platform.select({
      web: { height: '100vh', width: '100vw', overflow: 'hidden' }
    })
  },
  starsOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 150px, #fff, rgba(0,0,0,0))',
        backgroundSize: '250px 250px',
      }
    })
  },
  
  // ==========================================
  // 2. CONFIGURACIÓN DEL SCROLL
  // ==========================================
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    paddingHorizontal: 15,
    width: '100%'
  },
  mainWrapper: { 
    width: '100%', 
    maxWidth: 420, 
  },

  // ==========================================
  // 3. CRISTAL Y LOGO
  // ==========================================
  glassContainer: {
    backgroundColor: 'rgba(26, 26, 58, 0.85)',
    borderRadius: 25,
    padding: Platform.OS === 'web' ? 35 : 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      web: { backdropFilter: 'blur(15px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
      default: { elevation: 12 }
    })
  },
  logo: { 
    width: 150, 
    height: 150, 
    alignSelf: 'center', 
    marginBottom: -20
  },

  // ==========================================
  // 4. DISEÑO ORIGINAL DE SELECCIÓN DE PERFIL
  // ==========================================
  header: { alignItems: 'center', marginBottom: 25 },
  roleBadge: { backgroundColor: '#6200ee', paddingVertical: 4, paddingHorizontal: 15, borderRadius: 20, marginBottom: 10 },
  roleBadgeText: { color: '#fff', fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  tagline: { color: '#fff', fontSize: 15, fontFamily: 'Poppins-Regular', textAlign: 'center' },
  
  grid: { width: '100%', gap: 15 },
  card: { backgroundColor: '#fff', flexDirection: 'row', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#e1e1e1' },
  cardIcon: { width: 45, height: 45, backgroundColor: '#f0f2f5', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#333' },
  cardDesc: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#666', marginTop: 2 },
  
  btnBack: { marginTop: 20, alignItems: 'center' },
  btnBackText: { color: '#6200ee', fontFamily: 'Poppins-SemiBold', fontSize: 14 }
});