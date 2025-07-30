import React from "react";
import { Image, ImageProps, StyleSheet, Text, TextProps, View, ViewProps } from "react-native";

type AvatarProps = ViewProps & {
  children?: React.ReactNode;
};

function Avatar({ style, children, ...props }: AvatarProps) {
  return (
    <View style={[styles.avatar, style]} {...props}>
      {children}
    </View>
  );
}

type AvatarImageProps = ImageProps;

function AvatarImage({ style, ...props }: AvatarImageProps) {
  return <Image style={[styles.avatarImage, style]} {...props} />;
}

type AvatarFallbackProps = TextProps & {
  children?: React.ReactNode;
};

function AvatarFallback({ style, children, ...props }: AvatarFallbackProps) {
  // Split style into ViewStyle and TextStyle keys
  const flat = StyleSheet.flatten(style) || {};
  // ViewStyle keys
  const viewKeys = [
    'width', 'height', 'backgroundColor', 'borderRadius', 'alignItems', 'justifyContent', 'overflow', 'position', 'top', 'left', 'right', 'bottom', 'zIndex', 'flex', 'flexDirection', 'flexWrap', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'paddingVertical', 'borderWidth', 'borderColor', 'borderStyle', 'opacity', 'elevation', 'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'display', 'direction', 'rowGap', 'columnGap', 'gap', 'aspectRatio', 'start', 'end', 'pointerEvents', 'backfaceVisibility', 'background', 'backgroundPosition', 'backgroundRepeat', 'backgroundSize', 'boxShadow', 'resizeMode', 'transform', 'transformMatrix', 'decomposedMatrix', 'scaleX', 'scaleY', 'rotation', 'translateX', 'translateY', 'borderTopWidth', 'borderTopColor', 'borderRightWidth', 'borderRightColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth', 'borderLeftColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
  ];
  // TextStyle keys
  const textKeys = [
    'color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight', 'textAlign', 'textDecorationLine', 'textDecorationStyle', 'textDecorationColor', 'textShadowColor', 'textShadowOffset', 'textShadowRadius', 'textTransform', 'writingDirection', 'includeFontPadding', 'textAlignVertical', 'fontVariant', 'textDecoration', 'textRendering', 'textOverflow', 'whiteSpace', 'wordBreak', 'overflowWrap', 'hyphens', 'verticalAlign', 'textIndent', 'textJustify', 'textOrientation', 'unicodeBidi', 'userSelect', 'direction', 'fontFeatureSettings', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures', 'fontVariantNumeric', 'fontVariationSettings', 'fontSynthesis', 'textCombineUpright', 'textEmphasis', 'textEmphasisColor', 'textEmphasisStyle', 'textEmphasisPosition', 'textSizeAdjust', 'textUnderlineOffset', 'textUnderlinePosition',
  ];
  const viewStyle: any = {};
  const textStyle: any = {};
  Object.keys(flat).forEach((key) => {
    if (viewKeys.includes(key)) {
      viewStyle[key] = flat[key];
    } else if (textKeys.includes(key)) {
      textStyle[key] = flat[key];
    }
  });
  return (
    <View style={[styles.avatarFallback, viewStyle]}>
      <Text style={[styles.avatarFallbackText, textStyle]} {...props}>
        {children}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  avatar: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0", // fallback bg
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: "#bdbdbd",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  avatarFallbackText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export { Avatar, AvatarFallback, AvatarImage };

