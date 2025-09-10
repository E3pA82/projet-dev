import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { getTrashBin } from '../utils/trashUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { photoUri } = route.params;

  // Pour l'instant : catégorie simulée
  const detectedCategory = 'Plastique';
  const trashBin = getTrashBin(detectedCategory);

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.photo} />
      <Text>Catégorie détectée : {detectedCategory}</Text>
      <Text>Jetez-le dans : {trashBin}</Text>
      <Button title="Prendre une nouvelle photo" onPress={() => navigation.navigate('Camera')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photo: { width: 200, height: 200, marginBottom: 20 },
});
