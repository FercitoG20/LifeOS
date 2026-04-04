import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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
    width: 180, 
    height: 180, 
    alignSelf: 'center', 
    marginBottom: -50 
  },

  fakeBackBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    padding: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fakeBackText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginLeft: 5,
  },

  headerTextContainer: { alignItems: 'center', marginBottom: 20 },
  logoText: { color: 'white', fontSize: 36, fontFamily: 'Poppins-SemiBold', letterSpacing: 2 },
  tagline: { color: 'white', fontSize: 16, fontFamily: 'Poppins-Regular', opacity: 0.9, textAlign: 'center' },
  welcomeMsg: { color: 'white', fontSize: 12, fontFamily: 'Poppins-Light', opacity: 0.6, marginTop: 5, textAlign: 'center' },
  
  loginCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 25, 
    borderWidth: 1, 
    borderColor: '#e1e1e1', 
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }
    })
  },
  label: { fontSize: 12, fontFamily: 'Poppins-SemiBold', marginBottom: 5, color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 8, paddingHorizontal: 12, marginBottom: 5, borderWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, paddingVertical: 12, fontFamily: 'Poppins-Regular', fontSize: 14, color: '#333', outlineStyle: 'none' },
  
  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff5f5' },
  errorText: { color: '#ff4d4d', fontSize: 11, fontFamily: 'Poppins-Regular', marginBottom: 10, marginLeft: 5 },
  eyeBtn: { padding: 5 },
  
  btnLogin: { backgroundColor: '#1a1a3a', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  createAccount: { textAlign: 'center', marginTop: 20, color: '#6200ee', fontFamily: 'Poppins-SemiBold', fontSize: 14 }
});