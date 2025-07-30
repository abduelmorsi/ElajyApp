import React, { useState } from 'react'
import { View, Image, ImageProps, StyleSheet } from 'react-native'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: ImageProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { source, style, ...rest } = props

  return didError ? (
    <View style={[styles.errorContainer, style]}>
      <Image 
        source={{ uri: ERROR_IMG_SRC }} 
        style={styles.errorImage}
        {...rest} 
      />
    </View>
  ) : (
    <Image 
      source={source} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorImage: {
    width: 88,
    height: 88,
  },
})
