import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  PermissionResponse,
  BarcodeScanningResult,
  CameraType, // Si vous voulez switcher front/back
} from 'expo-camera'; // Importez CameraView ici !

const CameraScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<PermissionResponse | null>(null);

  useEffect(() => {
    // Demandez les permissions au montage du composant
    requestPermission();
  }, []);

  useEffect(() => {
    if (permission) {
      setCameraPermission(permission);
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    // Évitez les scans multiples en désactivant après le premier
    if (scanned) return;
    setScanned(true);
    Alert.alert(
      `Scan réussi !`,
      `Type: ${type}\nDonnées: ${data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }] // Réactivez pour re-scanner
    );
    // Ici, vous pouvez naviguer ou traiter les données (ex: API pour recyclage)
  };

  // Si permissions en cours
  if (cameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Demande de permission caméra...</Text>
      </View>
    );
  }

  // Si refusées
  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text>Accès à la caméra refusé</Text>
        <Button onPress={requestPermission} title="Demander à nouveau" />
      </View>
    );
  }

  // Caméra active
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back" // 'front' ou 'back'
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'code128'], // Adaptez aux types pour recyclage (ex: QR pour étiquettes)
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Désactive après scan
      />
      {/* Overlay optionnel pour guider l'utilisateur */}
      <View style={styles.overlay}>
        <Text style={styles.instruction}>Pointez sur le code-barres/QR</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CameraScreen;