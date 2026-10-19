import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoDate, setPhotoDate] = useState(null);
  const [facing, setFacing] = useState('back'); // 'back' | 'front'
  const [flash, setFlash] = useState('off'); // 'off' | 'on'
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Solicitud de permisos de cámara
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      // Recuperación de foto y fecha guardadas localmente
      const savedPhoto = await AsyncStorage.getItem('ultimaFoto');
      const savedDate = await AsyncStorage.getItem('fechaFoto');
      if (savedPhoto) setPhoto(savedPhoto);
      if (savedDate) setPhotoDate(savedDate);
    })();
  }, []);

  // Función para tomar la fotografía y almacenar en AsyncStorage
  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const currentDate = new Date().toLocaleString();

      setPhoto(data.uri);
      setPhotoDate(currentDate);

      // Guardar localmente mediante AsyncStorage
      await AsyncStorage.setItem('ultimaFoto', data.uri);
      await AsyncStorage.setItem('fechaFoto', currentDate);
    }
  };

  // Alternar entre cámara frontal y trasera
  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // Alternar activación de flash
  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  // Manejo de estados de permiso
  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Permiso de cámara denegado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {photo ? (
        // Visualización de la foto capturada
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          
          {/* Mostrar fecha y hora de la captura */}
          {photoDate && (
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>📅 {photoDate}</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setPhoto(null)}
            >
              <Text style={styles.buttonText}>Volver a la cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Vista activa de la cámara
        <CameraView
          style={styles.camera}
          facing={facing}
          enableTorch={flash === 'on'}
          ref={cameraRef}
        >
          <View style={styles.overlayContainer}>
            {/* Controles superiores: Cambio de cámara y Flash */}
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleFacing}>
                <Text style={styles.iconText}>
                  🔄 {facing === 'back' ? 'Trasera' : 'Frontal'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                <Text style={styles.iconText}>
                  ⚡ Flash: {flash.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Controles inferiores: Capturar foto */}
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.innerCaptureButton} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    flex: 1,
    resizeMode: 'contain',
  },
  dateBadge: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    position: 'absolute',
    bottom: 40,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});