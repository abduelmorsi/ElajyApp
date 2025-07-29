
import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

// Custom OTP Input for React Native
type InputOTPProps = {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  style?: any;
  inputStyle?: any;
  containerStyle?: any;
  disabled?: boolean;
};

function InputOTP({ value, onChange, length = 6, style, inputStyle, containerStyle, disabled }: InputOTPProps) {
  const inputsRef = React.useRef<Array<TextInput | null>>([]);
  const chars = value.split("");

  return (
    <View style={[styles.otpContainer, containerStyle, style]}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={ref => { inputsRef.current[idx] = ref; }}
          style={[styles.otpInput, inputStyle]}
          value={chars[idx] || ""}
          onChangeText={text => {
            let newVal = chars.slice();
            newVal[idx] = text.replace(/[^0-9a-zA-Z]/g, "").slice(0, 1);
            // Fill next input if available
            if (text && idx < length - 1) {
              inputsRef.current[idx + 1]?.focus();
            }
            onChange(newVal.join(""));
          }}
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          selectTextOnFocus
          autoCorrect={false}
          autoCapitalize="none"
        />
      ))}
    </View>
  );
}

type InputOTPGroupProps = {
  children: React.ReactNode;
  style?: any;
};
function InputOTPGroup({ children, style }: InputOTPGroupProps) {
  return <View style={[styles.otpGroup, style]}>{children}</View>;
}

type InputOTPSlotProps = {
  value: string;
  isActive?: boolean;
  hasFakeCaret?: boolean;
  style?: any;
};
function InputOTPSlot({ value, isActive, hasFakeCaret, style }: InputOTPSlotProps) {
  return (
    <View style={[styles.otpInput, isActive && styles.activeInput, style]}>
      <Text style={styles.otpChar}>{value}</Text>
      {hasFakeCaret && <View style={styles.fakeCaret} />}
    </View>
  );
}

function InputOTPSeparator() {
  return (
    <Text style={styles.separator}>-</Text>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8, // Not supported in React Native
  },
  otpGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 4, // Not supported in React Native
  },
  otpInput: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeInput: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  otpChar: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
  fakeCaret: {
    width: 2,
    height: 20,
    backgroundColor: '#222',
    marginTop: 2,
    alignSelf: 'center',
  },
  separator: {
    fontSize: 18,
    color: '#888',
    marginHorizontal: 4,
  },
});

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };

