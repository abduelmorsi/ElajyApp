import React from 'react';
import { Text, View } from 'react-native';

// Define the interface for PharmacistInventory's props
interface PharmacistInventoryProps {
  navigateTo: (screen: string, data?: any) => void;
  // Based on your App.tsx, userData is passed, so include it here.
  // Mark as optional if it's not strictly used in this specific component's logic right now
  userData?: {
    id?: string;
    name?: string;
    email?: string;
    pharmacy?: {
      name?: string;
    };
    // Add other relevant user data properties if this component will use them
  };
}

// Define the type for an Inventory Item for better type safety
interface InventoryItem {
  id: number;
  name: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  supplier: string;
  expiryDate: string; // ISO 8601 string or Date if parsed
  location: string;
  status: 'normal' | 'low' | 'critical'; // Specific literal types
}

const inventoryItems: InventoryItem[] = [ // Apply the InventoryItem type to the array
  {
    id: 1,
    name: "Paracetamol 500mg",
    brand: "Generic",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    price: 12.99,
    supplier: "MedSupply Inc",
    expiryDate: "2025-06-15",
    location: "A1-B2",
    status: "normal"
  },
  {
    id: 2,
    name: "Vitamin D3 1000IU",
    brand: "HealthPlus",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    price: 24.99,
    supplier: "VitaCorr",
    expiryDate: "2025-12-30",
    location: "B2-C1",
    status: "low"
  },
  {
    id: 3,
    name: "Amoxicillin 250mg",
    brand: "Amoxil",
    currentStock: 3,
    minStock: 10,
    maxStock: 30,
    price: 25.99,
    supplier: "PharmaCorp",
    expiryDate: "2024-08-20",
    location: "C1-D3",
    status: "critical"
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    brand: "Advil",
    currentStock: 67,
    minStock: 25,
    maxStock: 75,
    price: 18.99,
    supplier: "MedSupply Inc",
    expiryDate: "2025-03-10",
    location: "A2-B1",
    status: "normal"
  }
];

// Apply the interface to the component's function signature

export default function PharmacistInventory({ navigateTo, userData }: PharmacistInventoryProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2563eb' }}>Pharmacist Inventory (React Native shell)</Text>
      {/* TODO: Convert the rest of the UI to React Native */}
    </View>
  );
}