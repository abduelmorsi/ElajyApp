import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { getMedicineImage } from '../services/LocalizationService';

interface MedicineImageProps {
  medicine?: any;
  medicineId?: number;
  size?: number;
  style?: ImageStyle;
  showBorder?: boolean;
  borderRadius?: number;
}

const MedicineImage: React.FC<MedicineImageProps> = ({
  medicine,
  medicineId,
  size = 80,
  style,
  showBorder = true,
  borderRadius = 8
}) => {
  const imageSource = medicine ? getMedicineImage(medicine) : 
                     medicineId ? getMedicineImage({ id: medicineId }) : 
                     require('../../assets/images/medicines/default-medicine.png');

  const imageStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius,
    ...style
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius,
    borderWidth: showBorder ? 1 : 0,
    borderColor: showBorder ? '#e5e7eb' : 'transparent',
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={imageSource}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
        defaultSource={require('../../assets/images/medicines/default-medicine.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default MedicineImage; 