import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  supplier: string;
  expiryDate: string;
  location: string;
  lastUpdated: Date;
  pharmacyId: string;
  batchNumber?: string;
  reserved?: number;
}

interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  isMainLocation: boolean;
}

interface StockMovement {
  id: string;
  itemId: string;
  pharmacyId: string;
  type: 'sale' | 'restock' | 'transfer' | 'expired' | 'adjustment';
  quantity: number;
  fromPharmacy?: string;
  toPharmacy?: string;
  timestamp: Date;
  userId: string;
  notes?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  pharmacyLocations: PharmacyLocation[];
  stockMovements: StockMovement[];
  currentPharmacy: PharmacyLocation | null;
  isOnline: boolean;
  updateStock: (itemId: string, newStock: number, notes?: string) => void;
  transferStock: (itemId: string, fromPharmacy: string, toPharmacy: string, quantity: number) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  getItemAvailability: (itemId: string) => { pharmacy: PharmacyLocation; stock: number }[];
  setCurrentPharmacy: (pharmacy: PharmacyLocation) => void;
  syncInventory: () => Promise<void>;
  getLowStockItems: (pharmacyId?: string) => InventoryItem[];
  getExpiringItems: (days?: number, pharmacyId?: string) => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: React.ReactNode;
  pharmacyId?: string;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ 
  children, 
  pharmacyId = 'central-pharmacy' 
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pharmacyLocations, setPharmacyLocations] = useState<PharmacyLocation[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [currentPharmacy, setCurrentPharmacy] = useState<PharmacyLocation | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Mock pharmacy locations
  useEffect(() => {
    const locations: PharmacyLocation[] = [
      {
        id: 'central-pharmacy',
        name: 'Central Pharmacy',
        address: '123 Main St, New York, NY',
        coordinates: { lat: 40.7484, lng: -73.9857 },
        isMainLocation: true
      },
      {
        id: 'healthfirst-pharmacy',
        name: 'HealthFirst Pharmacy',
        address: '456 Broadway, New York, NY',
        coordinates: { lat: 40.7505, lng: -73.9934 },
        isMainLocation: false
      },
      {
        id: 'wellcare-drugs',
        name: 'WellCare Drugs',
        address: '789 5th Ave, New York, NY',
        coordinates: { lat: 40.7614, lng: -73.9776 },
        isMainLocation: false
      }
    ];

    setPharmacyLocations(locations);
    setCurrentPharmacy(locations.find(p => p.id === pharmacyId) || locations[0]);
  }, [pharmacyId]);

  // Mock inventory data for multiple locations
  useEffect(() => {
    const generateInventory = (): InventoryItem[] => {
      const baseItems = [
        {
          name: 'Paracetamol 500mg',
          brand: 'Generic',
          minStock: 20,
          maxStock: 100,
          price: 12.99,
          supplier: 'MedSupply Inc',
          expiryDate: '2025-06-15',
          location: 'A1-B2'
        },
        {
          name: 'Vitamin D3 1000IU',
          brand: 'HealthPlus',
          minStock: 15,
          maxStock: 50,
          price: 24.99,
          supplier: 'VitaCorr',
          expiryDate: '2025-12-30',
          location: 'B2-C1'
        },
        {
          name: 'Amoxicillin 250mg',
          brand: 'Amoxil',
          minStock: 10,
          maxStock: 30,
          price: 25.99,
          supplier: 'PharmaCorp',
          expiryDate: '2024-08-20',
          location: 'C1-D3'
        },
        {
          name: 'Ibuprofen 400mg',
          brand: 'Advil',
          minStock: 25,
          maxStock: 75,
          price: 18.99,
          supplier: 'MedSupply Inc',
          expiryDate: '2025-03-10',
          location: 'A2-B1'
        }
      ];

      const allItems: InventoryItem[] = [];

      pharmacyLocations.forEach((pharmacy, pharmIndex) => {
        baseItems.forEach((item, itemIndex) => {
          const stockVariation = pharmacy.isMainLocation ? 1 : 0.3 + Math.random() * 0.7;
          const currentStock = Math.floor((item.minStock + Math.random() * (item.maxStock - item.minStock)) * stockVariation);
          
          allItems.push({
            id: `${pharmacy.id}-${itemIndex}`,
            ...item,
            currentStock,
            pharmacyId: pharmacy.id,
            lastUpdated: new Date(),
            batchNumber: `B${pharmIndex}${itemIndex}${Math.floor(Math.random() * 1000)}`,
            reserved: Math.floor(Math.random() * 5)
          });
        });
      });

      return allItems;
    };

    setInventory(generateInventory());
  }, [pharmacyLocations]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncInventory(); // Sync when back online
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time inventory updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random stock changes across all locations
      setInventory(prev => {
        const newInventory = [...prev];
        const randomItem = newInventory[Math.floor(Math.random() * newInventory.length)];
        
        if (randomItem && Math.random() > 0.8) { // 20% chance of stock change
          const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
          const newStock = Math.max(0, randomItem.currentStock + change);
          
          randomItem.currentStock = newStock;
          randomItem.lastUpdated = new Date();

          // Add stock movement record
          const movement: StockMovement = {
            id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            itemId: randomItem.id,
            pharmacyId: randomItem.pharmacyId,
            type: change > 0 ? 'restock' : 'sale',
            quantity: Math.abs(change),
            timestamp: new Date(),
            userId: 'system',
            notes: 'Automated update'
          };

          setStockMovements(prev => [movement, ...prev.slice(0, 49)]); // Keep last 50 movements

          // Check for low stock alerts
          if (newStock <= randomItem.minStock) {
            toast.warning('Low Stock Alert', {
              description: `${randomItem.name} at ${pharmacyLocations.find(p => p.id === randomItem.pharmacyId)?.name} is running low (${newStock} remaining)`
            });
          }
        }

        return newInventory;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [pharmacyLocations]);

  const updateStock = (itemId: string, newStock: number, notes?: string) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, currentStock: newStock, lastUpdated: new Date() }
          : item
      )
    );

    // Add movement record
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        itemId,
        pharmacyId: item.pharmacyId,
        type: 'adjustment',
        quantity: newStock - item.currentStock,
        timestamp: new Date(),
        userId: 'current-user', // Replace with actual user ID
        notes
      };

      addStockMovement(movement);
    }
  };

  const transferStock = (itemId: string, fromPharmacy: string, toPharmacy: string, quantity: number) => {
    setInventory(prev => 
      prev.map(item => {
        if (item.id.includes(itemId)) {
          if (item.pharmacyId === fromPharmacy) {
            return { ...item, currentStock: item.currentStock - quantity, lastUpdated: new Date() };
          } else if (item.pharmacyId === toPharmacy) {
            return { ...item, currentStock: item.currentStock + quantity, lastUpdated: new Date() };
          }
        }
        return item;
      })
    );

    // Add transfer movements
    const outMovement: StockMovement = {
      id: `mov-out-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      itemId,
      pharmacyId: fromPharmacy,
      type: 'transfer',
      quantity: -quantity,
      toPharmacy,
      timestamp: new Date(),
      userId: 'current-user'
    };

    const inMovement: StockMovement = {
      id: `mov-in-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      itemId,
      pharmacyId: toPharmacy,
      type: 'transfer',
      quantity,
      fromPharmacy,
      timestamp: new Date(),
      userId: 'current-user'
    };

    setStockMovements(prev => [inMovement, outMovement, ...prev]);
    
    toast.success('Stock Transfer', {
      description: `Transferred ${quantity} units from ${pharmacyLocations.find(p => p.id === fromPharmacy)?.name} to ${pharmacyLocations.find(p => p.id === toPharmacy)?.name}`
    });
  };

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date()
    };

    setStockMovements(prev => [newMovement, ...prev]);
  };

  const getItemAvailability = (itemId: string): { pharmacy: PharmacyLocation; stock: number }[] => {
    const itemName = inventory.find(item => item.id.includes(itemId))?.name;
    if (!itemName) return [];

    return pharmacyLocations.map(pharmacy => {
      const item = inventory.find(inv => 
        inv.name === itemName && inv.pharmacyId === pharmacy.id
      );
      return {
        pharmacy,
        stock: item?.currentStock || 0
      };
    }).filter(availability => availability.stock > 0);
  };

  const syncInventory = async (): Promise<void> => {
    if (!isOnline) {
      toast.error('Cannot sync', { description: 'No internet connection' });
      return;
    }

    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process sync queue
      setSyncQueue([]);
      
      toast.success('Inventory synced', { 
        description: 'All locations updated successfully' 
      });
    } catch (error) {
      toast.error('Sync failed', { 
        description: 'Failed to sync inventory. Changes saved locally.' 
      });
    }
  };

  const getLowStockItems = (pharmacyId?: string): InventoryItem[] => {
    return inventory.filter(item => {
      const matchesPharmacy = !pharmacyId || item.pharmacyId === pharmacyId;
      return matchesPharmacy && item.currentStock <= item.minStock;
    });
  };

  const getExpiringItems = (days = 30, pharmacyId?: string): InventoryItem[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return inventory.filter(item => {
      const matchesPharmacy = !pharmacyId || item.pharmacyId === pharmacyId;
      const expiryDate = new Date(item.expiryDate);
      return matchesPharmacy && expiryDate <= cutoffDate;
    });
  };

  const value: InventoryContextType = {
    inventory,
    pharmacyLocations,
    stockMovements,
    currentPharmacy,
    isOnline,
    updateStock,
    transferStock,
    addStockMovement,
    getItemAvailability,
    setCurrentPharmacy,
    syncInventory,
    getLowStockItems,
    getExpiringItems
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};