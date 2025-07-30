import React, { useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, X, Phone, MapPin, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

// Define the interface for PharmacistOrders's props
interface PharmacistOrdersProps {
  navigateTo: (screen: string, data?: any) => void;
  // Based on your App.tsx, userData is passed, so include it here.
  // If this component doesn't actually need it, you could consider not passing it from App.tsx.
  // For consistency with other pharmacist components, let's include it.
  userData?: { // Mark as optional if it's not strictly used in this specific component's logic right now
    id?: string;
    name?: string;
    email?: string;
    // Add other relevant user data properties if this component will use them
  };
}


const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 12.99 },
      { name: "Vitamin D3 1000IU", quantity: 1, price: 24.99 }
    ],
    total: 50.97,
    status: "pending",
    orderTime: "2024-01-15T10:30:00",
    paymentMethod: "Credit Card",
    deliveryType: "pickup"
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, New York, NY 10002",
    items: [
      { name: "Ibuprofen 400mg", quantity: 1, price: 18.99 }
    ],
    total: 23.98,
    status: "processing",
    orderTime: "2024-01-15T09:45:00",
    paymentMethod: "Insurance",
    deliveryType: "delivery"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, New York, NY 10003",
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 25.99 },
      { name: "Omega-3 Fish Oil", quantity: 1, price: 29.99 }
    ],
    total: 61.97,
    status: "ready",
    orderTime: "2024-01-15T08:15:00",
    paymentMethod: "Cash",
    deliveryType: "pickup"
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, New York, NY 10004",
    items: [
      { name: "Vitamin D3 1000IU", quantity: 2, price: 24.99 }
    ],
    total: 54.97,
    status: "completed",
    orderTime: "2024-01-14T16:20:00",
    paymentMethod: "Credit Card",
    deliveryType: "delivery"
  }
];

// Apply the interface to the component's function signature
export default function PharmacistOrders({ navigateTo, userData }: PharmacistOrdersProps) { // Added userData here
  const [selectedOrder, setSelectedOrder] = useState(null);

  // If you decide to use userData in this component in the future,
  // you can access it like: console.log(userData?.id);


  const getStatusColor = (status: string) => { // Added type for status
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => { // Added type for status
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'processing': return <Package size={16} className="text-blue-600" />;
      case 'ready': return <CheckCircle size={16} className="text-green-600" />;
      case 'completed': return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled': return <X size={16} className="text-red-600" />;
      default: return <Package size={16} className="text-gray-600" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => { // Added types for parameters
    // In a real app, this would update the order in the backend
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // You'd typically update your local state (orders array) here as well
    // For now, it's just a console log
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const completedOrders = orders.filter(order => ['completed', 'cancelled'].includes(order.status));

  // Define a type for your Order object for better type safety
  interface Order {
    id: string;
    customer: string;
    phone: string;
    address: string;
    items: { name: string; quantity: number; price: number; }[];
    total: number;
    status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled'; // Specific literal types
    orderTime: string;
    paymentMethod: string;
    deliveryType: 'pickup' | 'delivery'; // Specific literal types
  }

  // Define a type for OrderCardProps
  interface OrderCardProps {
    order: Order; // Use the Order type here
    showActions?: boolean; // Optional prop
  }

  const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true }) => (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedOrder(order)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon(order.status)}
            <h4 className="text-sm">Order #{order.id}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{order.customer}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.orderTime).toLocaleString()}
          </p>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{order.items.length} item(s):</p>
          {order.items.slice(0, 2).map((item, index) => (
            <p key={index} className="text-sm">
              {item.name} x{item.quantity}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-muted-foreground">+{order.items.length - 2} more items</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Total: ${order.total.toFixed(2)}</span>
          <Badge variant="outline" className="text-xs">
            {order.deliveryType}
          </Badge>
        </div>
      </div>

      {showActions && order.status === 'pending' && (
        <div className="flex space-x-2 mt-3">
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'processing');
            }}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'cancelled');
            }}
          >
            Decline
          </Button>
        </div>
      )}
    </Card>
  );

  if (selectedOrder) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
            <ArrowLeft size={16} />
          </Button>
          <h3>Order Details</h3>
          <div></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Order Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4>Order #{selectedOrder.id}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.orderTime).toLocaleString()}
                </p>
              </div>
              <Badge className={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm">{selectedOrder.customer}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{selectedOrder.deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup'}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.address}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-4">
            <h4 className="mb-3">Items Ordered</h4>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  {index < selectedOrder.items.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between">
              <span>Total</span>
              <span>${selectedOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment</span>
              <span>{selectedOrder.paymentMethod}</span>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {selectedOrder.status === 'pending' && (
              <>
                <Button className="w-full" onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                  Accept Order
                </Button>
                <Button variant="outline" className="w-full" onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}>
                  Decline Order
                </Button>
              </>
            )}
            {selectedOrder.status === 'processing' && (
              <Button className="w-full" onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}>
                Mark as Ready
              </Button>
            )}
            {selectedOrder.status === 'ready' && (
              <Button className="w-full" onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}>
                Mark as Completed
              </Button>
            )}
            <Button variant="outline" className="w-full">
              <Phone size={16} className="mr-2" />
              Call Customer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigateTo('pharmacist-dashboard')}>
          <ArrowLeft size={16} />
        </Button>
        <h3>Order Management</h3>
        <div></div>
      </div>

      <Tabs defaultValue="pending" className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({readyOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="flex-1 overflow-y-auto px-4 space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Pending Orders</h4>
              <p className="text-muted-foreground">New orders will appear here</p>
            </div>
          ) : (
            pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="processing" className="flex-1 overflow-y-auto px-4 space-y-4">
          {processingOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Orders in Processing</h4>
              <p className="text-muted-foreground">Accepted orders will appear here</p>
            </div>
          ) : (
            processingOrders.map((order) => <OrderCard key={order.id} order={order} showActions={false} />)
          )}
        </TabsContent>

        <TabsContent value="ready" className="flex-1 overflow-y-auto px-4 space-y-4">
          {readyOrders.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Orders Ready</h4>
              <p className="text-muted-foreground">Ready orders will appear here</p>
            </div>
          ) : (
            readyOrders.map((order) => <OrderCard key={order.id} order={order} showActions={false} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="flex-1 overflow-y-auto px-4 space-y-4">
          {completedOrders.map((order) => <OrderCard key={order.id} order={order} showActions={false} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}