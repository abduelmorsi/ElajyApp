
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

// Label component for React Native

type LabelProps = {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
};
const Label = ({ children, style, ...props }: LabelProps) => (
  <Text style={[styles.label, style]} {...props}>{children}</Text>
);

const Form = FormProvider;


type FormFieldContextValue = {
  name: string;
};


const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);



type FormFieldProps = React.ComponentProps<typeof Controller> & { name: string };
const FormField = (props: FormFieldProps) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};


const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};


type FormItemContextValue = {
  id: string;
};


const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);



type FormItemProps = {
  style?: any;
  children?: React.ReactNode;
  [key: string]: any;
};
function FormItem({ style, children, ...props }: FormItemProps) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.formItem, style]} {...props}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}


function FormLabel({ style, children, ...props }: { style?: any; children: React.ReactNode; [key: string]: any }) {
  const { error } = useFormField();
  return (
    <Label
      style={[styles.formLabel, error && styles.errorLabel, style]}
      {...props}
    >
      {children}
    </Label>
  );
}


function FormControl({ children, style, ...props }) {
  // In React Native, we don't have Slot or aria props, so just render children in a View
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}


function FormDescription({ style, children, ...props }) {
  return (
    <Text style={[styles.formDescription, style]} {...props}>
      {children}
    </Text>
  );
}


function FormMessage({ style, children, ...props }) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return (
    <Text style={[styles.formMessage, style]} {...props}>
      {body}
    </Text>
  );
}


const styles = StyleSheet.create({
  formItem: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorLabel: {
    color: 'red',
  },
  formDescription: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  formMessage: {
    color: 'red',
    fontSize: 13,
    marginTop: 2,
  },
});

export {
  Form, FormControl,
  FormDescription, FormField, FormItem,
  FormLabel, FormMessage, useFormField
};

