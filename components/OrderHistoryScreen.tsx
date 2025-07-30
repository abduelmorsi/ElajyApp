import React, { useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 45.97,
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 12.99 },
      { name: "Vitamin D3 1000IU", quantity: 1, price: 24.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 67.50,
    items: [
      { name: "Omega-3 Fish Oil", quantity: 1, price: 29.99 },
      { name: "Ibuprofen 400mg", quantity: 2, price: 18.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-17"
  },
  {
    id: "ORD-003",
    date: "2024-01-05", 
    status: "processing",
    total: 25.99,
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 25.99 }
    ],
    deliveryAddress: "123 Main St, New York, NY 10001"
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return <CheckCircle size={16} className="text-green-600" />;
    case 'shipped': return <Truck size={16} className="text-blue-600" />;
    case 'processing': return <Clock size={16} className="text-yellow-600" />;
    default: return <Package size={16} className="text-gray-600" />;
  }
};

export default function OrderHistoryScreen({ navigateTo }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const activeOrders = orders.filter(order => ['processing', 'shipped'].includes(order.status));
  const pastOrders = orders.filter(order => ['delivered', 'cancelled'].includes(order.status));

  const OrderCard = ({ order, onClick }) => (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon(order.status)}
            <h4 className="text-sm">Order #{order.id}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(order.date).toLocaleDateString()}
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
            <p className="text-sm text-muted-foreground">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Total: ${order.total.toFixed(2)}</span>
          {order.status === 'shipped' && order.estimatedDelivery && (
            <span className="text-xs text-muted-foreground">
              Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
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
          {/* Order Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4>Order #{selectedOrder.id}</h4>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status}
              </Badge>
            </div>

            {selectedOrder.trackingNumber && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">Tracking Number</p>
                <p className="font-mono text-sm">{selectedOrder.trackingNumber}</p>
              </div>
            )}
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
          </Card>

          {/* Delivery Address */}
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-muted-foreground mt-0.5" />
              <div>
                <h4 className="mb-1">Delivery Address</h4>
                <p className="text-sm text-muted-foreground">{selectedOrder.deliveryAddress}</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {selectedOrder.status === 'delivered' && (
              <Button className="w-full" onClick={() => navigateTo('search')}>
                Reorder Items
              </Button>
            )}
            {selectedOrder.trackingNumber && (
              <Button variant="outline" className="w-full">
                Track Package
              </Button>
            )}
            <Button variant="outline" className="w-full">
              <Phone size={16} className="mr-2" />
              Contact Support
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
        <Button variant="ghost" size="sm" onClick={() => navigateTo('profile')}>
          <ArrowLeft size={16} />
        </Button>
        <h3>Order History</h3>
        <div></div>
      </div>

      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="flex-1 overflow-y-auto px-4 space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Active Orders</h4>
              <p className="text-muted-foreground mb-6">You don't have any active orders at the moment</p>
              <Button onClick={() => navigateTo('search')}>
                Browse Medicines
              </Button>
            </div>
          ) : (
            activeOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onClick={() => setSelectedOrder(order)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="flex-1 overflow-y-auto px-4 space-y-4">
          {pastOrders.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="mb-2">No Past Orders</h4>
              <p className="text-muted-foreground">Your completed orders will appear here</p>
            </div>
          ) : (
            pastOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onClick={() => setSelectedOrder(order)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}