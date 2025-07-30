import React, { useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CarouselProps = {
  children: React.ReactNode[];
  style?: any;
  itemStyle?: any;
};

const Carousel = ({ children, style, itemStyle }: CarouselProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get("window").width;

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: width * index, animated: true });
      setCurrentIndex(index);
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < children.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <View style={[styles.carouselContainer, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        style={styles.carouselScroll}
      >
        {children.map((child, idx) => (
          <View key={idx} style={[styles.carouselItem, { width }, itemStyle]}>
            {child}
          </View>
        ))}
      </ScrollView>
      <View style={styles.carouselNav}>
        <CarouselPrevious onPress={scrollPrev} disabled={currentIndex === 0} />
        <Text style={styles.carouselIndicator}>{currentIndex + 1} / {children.length}</Text>
        <CarouselNext onPress={scrollNext} disabled={currentIndex === children.length - 1} />
      </View>
    </View>
  );
};

type CarouselNavButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const CarouselPrevious = ({ onPress, disabled }: CarouselNavButtonProps) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.navButton, disabled && styles.navButtonDisabled]}>
    <Text style={styles.navButtonText}>{"<"}</Text>
  </TouchableOpacity>
);

const CarouselNext = ({ onPress, disabled }: CarouselNavButtonProps) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.navButton, disabled && styles.navButtonDisabled]}>
    <Text style={styles.navButtonText}>{">"}</Text>
  </TouchableOpacity>
);

const CarouselContent = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

const CarouselItem = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={style}>{children}</View>
);

const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  carouselScroll: {
    width: "100%",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  carouselNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 12,
  },
  navButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  carouselIndicator: {
    fontSize: 14,
    color: "#888",
    marginHorizontal: 8,
  },
});

export {
  Carousel,
  CarouselContent,
  CarouselItem, CarouselNext, CarouselPrevious
};

