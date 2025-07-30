import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Edit, AlertTriangle, Package, Filter, Barcode } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<InventoryItem['status'] | 'all'>('all'); // Typed filterStatus
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null); // Typed selectedItem

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: InventoryItem['status']) => { // Typed status parameter
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockPercentage = (current: number, max: number) => { // Typed parameters
    return (current / max) * 100;
  };

  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const lowItems = inventoryItems.filter(item => item.status === 'low').length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigateTo('pharmacist-dashboard')}>
          <ArrowLeft size={16} />
        </Button>
        <h3>Inventory Management</h3>
        <Button size="sm">
          <Plus size={16} className="mr-1" />
          Add Item
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="p-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">All Items</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 px-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package size={16} className="text-blue-600" />
                  <span className="text-sm">Total Items</span>
                </div>
                <p className="text-2xl">{inventoryItems.length}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-sm">Low Stock</span>
                </div>
                <p className="text-2xl text-red-600">{criticalItems + lowItems}</p>
              </Card>
            </div>

            {/* Stock Status Overview */}
            <Card className="p-4">
              <h4 className="mb-3">Stock Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Normal Stock</span>
                  <Badge className="bg-green-100 text-green-800">
                    {inventoryItems.filter(item => item.status === 'normal').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {lowItems}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical Stock</span>
                  <Badge className="bg-red-100 text-red-800">
                    {criticalItems}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-4">
              <h4 className="mb-3">Recent Activity</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Paracetamol 500mg sold</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitamin D3 restocked</span>
                  <span className="text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Amoxicillin low stock alert</span>
                  <span className="text-muted-foreground">3 hours ago</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="flex-1 px-4 space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <p className="text-xs text-muted-foreground">Location: {item.location}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Stock Level</span>
                      <span>{item.currentStock}/{item.maxStock}</span>
                    </div>
                    <Progress
                      value={getStockPercentage(item.currentStock, item.maxStock)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                    <span>${item.price}</span>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Barcode size={14} className="mr-1" />
                      Scan
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 px-4 space-y-4">
            <div className="space-y-3">
              {inventoryItems
                .filter(item => item.status === 'critical' || item.status === 'low')
                .map((item) => (
                  <Card key={item.id} className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h4 className="text-sm text-red-800 dark:text-red-200">{item.name}</h4>
                        <p className="text-xs text-red-600 dark:text-red-300">
                          {item.status === 'critical' ? 'Critical stock level' : 'Low stock'}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">
                          Current: {item.currentStock} | Minimum: {item.minStock}
                        </p>
                        <Button size="sm" className="mt-2">
                          Reorder Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}