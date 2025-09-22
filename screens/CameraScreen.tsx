import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
; // ⚠️ mets ta clé ici

const CameraScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

 const takePicture = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    console.log("Photo capturée:", photo.uri);

    if (photo.base64) {
      classifyImage(photo.base64);
    } else {
      console.error("Erreur: photo.base64 est undefined");
    }
  }
};


  const classifyImage = async (base64Image: string) => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/resnet-50",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `data:image/jpeg;base64,${base64Image}`,
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.error) {
        Alert.alert("Erreur", result.error);
      } else {
        const label = result[0].label;
        Alert.alert("Résultat", `Objet détecté : ${label}`);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de contacter l’API");
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Autorise la caméra dans les paramètres</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureText}>📸 Scanner Déchet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 50,
  },
  captureText: { color: "white", fontWeight: "bold" },
});

export default CameraScreen;
