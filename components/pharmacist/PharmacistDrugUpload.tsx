import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PharmacistDrugUploadProps {
  navigateTo: (screen: string, data?: any) => void;
}

const PharmacistDrugUpload: React.FC<PharmacistDrugUploadProps> = ({ navigateTo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pharmacist Drug Upload</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
});

export default PharmacistDrugUpload;