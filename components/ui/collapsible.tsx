import React, { createContext, useContext, useState } from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";

type CollapsibleContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

type CollapsibleProps = ViewProps & {
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function Collapsible({ defaultOpen = false, children, ...props }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <View {...props}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

type CollapsibleTriggerProps = {
  children: React.ReactNode;
  style?: any;
};

function CollapsibleTrigger({ children, style }: CollapsibleTriggerProps) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleTrigger must be used within a Collapsible");
  return (
    <TouchableOpacity onPress={() => ctx.setOpen(!ctx.open)} style={style}>
      {children}
    </TouchableOpacity>
  );
}

type CollapsibleContentProps = {
  children: React.ReactNode;
  style?: any;
};

function CollapsibleContent({ children, style }: CollapsibleContentProps) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleContent must be used within a Collapsible");
  if (!ctx.open) return null;
  return <View style={style}>{children}</View>;
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };

