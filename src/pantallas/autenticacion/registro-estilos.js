import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // 1. EL CONTENEDOR MAESTRO ESTRICTO
  // ==========================================
  masterContainer: { 
    flex: 1, 
    backgroundColor: '#090a0f',
    position: 'relative',
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
  // 2. CONFIGURACIÓN DEL SCROLL (Mantenida igual)
  // ==========================================
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    paddingHorizontal: 15,
    width: '100%'
  },
  contentWrapper: { 
    width: '100%', 
    maxWidth: 1000, 
  },

  // ==========================================
  // 3. CRISTAL Y LOGO
  // ==========================================
  glassCard: { 
    backgroundColor: 'rgba(26, 26, 58, 0.85)', 
    borderRadius: 30, 
    padding: Platform.OS === 'web' ? 35 : 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({
      web: { backdropFilter: 'blur(15px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
      default: { elevation: 12 }
    })
  },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 10 },
  headerInfo: { alignItems: 'center', marginBottom: 20 },
  badge: { backgroundColor: '#6200ee', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 },
  badgeText: { color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
  tagline: { color: '#fff', fontSize: 13, marginTop: 10, opacity: 0.8, textAlign: 'center' },
  
  // ==========================================
  // 4. DISEÑO ORIGINAL DEL FORMULARIO
  // ==========================================
  whiteForm: { backgroundColor: '#fff', borderRadius: 25, padding: Platform.OS === 'web' ? 30 : 20 },
  mainColumnsRow: { flexDirection: Platform.OS === 'web' ? 'row' : 'column' },
  sideBlock: { flex: 1, paddingHorizontal: Platform.OS === 'web' ? 15 : 0 },
  groupTitle: { color: '#6200ee', fontFamily: 'Poppins-SemiBold', fontSize: 14, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 5 },
  
  // AVATAR
  avatarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 20 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eee', borderWidth: 2, borderColor: '#6200ee' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 35 },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6200ee', borderRadius: 10, padding: 4 },
  
  // INPUTS
  label: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#f5f7fa', borderRadius: 12, padding: 14, fontSize: 14, borderWidth: 1, borderColor: '#e2e8f0', color: '#000', marginBottom: 5 },
  inputSmall: { backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 12, borderWidth: 1, borderColor: '#ddd' },
  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff5f5' },
  errorLabel: { color: '#ff4d4d', fontSize: 10, fontFamily: 'Poppins-Regular', marginBottom: 10, marginLeft: 5 },

  // PICKER
  pickerBox: { backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15, overflow: 'hidden' },
  pickerStyle: { height: 50, width: '100%' },

  // PASSWORD (Mejorado para el ojo)
  passContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5f7fa', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    overflow: 'hidden' 
  },
  passInput: { 
    flex: 1, 
    padding: 14, 
    fontSize: 14, 
    ...Platform.select({ web: { outlineStyle: 'none' } }) 
  },
  eyeBtn: { 
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center'
  },

  innerRow: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, marginBottom: 10 },

  footer: { marginTop: 30, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 20 },
  mainBtn: { backgroundColor: '#1a1a3a', paddingVertical: 18, paddingHorizontal: 60, borderRadius: 15, width: Platform.OS === 'web' ? 'auto' : '100%', alignItems: 'center' },
  mainBtnText: { color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  backBtn: { marginTop: 15 },
  backBtnText: { color: '#6200ee', fontSize: 13, fontFamily: 'Poppins-SemiBold' }
});