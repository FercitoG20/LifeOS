import Constants from 'expo-constants';
import { Platform } from 'react-native';
export const SERVER_URL = 'http://10.40.8.218:3000'; 
const API_URL = `${SERVER_URL}/api/general`;

console.log("🔗 Servidor Base en:", SERVER_URL);
export const loginGeneral = async (credenciales) => {
    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales),
        });
        return await respuesta.json();
    } catch (error) { return { error: true, mensaje: "Error de conexión." }; }
};

export const registrarGeneral = async (datos) => {
    try {
        const respuesta = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });
        return await respuesta.json();
    } catch (error) { return { error: true, mensaje: "Error al registrar." }; }
};
export const obtenerPerfilInfo = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/perfil/${id}`);
        return await respuesta.json();
    } catch (error) { return { error: true, mensaje: "No se pudo cargar el perfil." }; }
};
export const actualizarPerfilConFoto = async (id, datos, fotoLocalUri) => {
    try {
        const formData = new FormData();
        formData.append('nombres', datos.nombres || '');
        formData.append('apellido_paterno', datos.apellido_paterno || '');
        formData.append('apellido_materno', datos.apellido_materno || '');
        formData.append('ciudad_pais', datos.ciudad_pais || '');
        if (fotoLocalUri) {
            if (Platform.OS === 'web') {
                const response = await fetch(fotoLocalUri);
                const blob = await response.blob();
                formData.append('foto', blob, 'avatar_insano.jpg');
                console.log("📤 Enviando foto desde la WEB...");
            } else {
                const filename = fotoLocalUri.split('/').pop() || 'avatar_insano.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                formData.append('foto', {
                    uri: fotoLocalUri,
                    name: filename,
                    type: type,
                });
                console.log("📤 Enviando foto desde el CELULAR...");
            }
        } else if (datos.foto_link) {
            formData.append('foto_link', datos.foto_link);
            console.log("📤 Enviando Link URL...");
        }
        const respuesta = await fetch(`${API_URL}/perfil/${id}`, {
            method: 'PUT',
            body: formData, 
        });

        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error en API Perfil:", error);
        return { error: true, mensaje: "Error de conexión al guardar" };
    }
};