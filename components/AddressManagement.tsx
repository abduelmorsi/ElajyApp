import React, { useState } from 'react';
import { Plus, MapPin, Edit3, Trash2, Check, X, Home, Briefcase, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useDelivery, DeliveryAddress } from './services/DeliveryService';
import { useLocalization, useRTL } from './services/LocalizationService';

export default function AddressManagement({ navigateTo, onSelectAddress = null, selectionMode = false }) {
  const { t, language } = useLocalization();
  const { isRTL, getMargin } = useRTL();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, selectAddress } = useDelivery();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    street: '',
    streetEn: '',
    district: '',
    districtEn: '',
    city: '',
    cityEn: '',
    phone: '+249 ',
    isDefault: false,
    instructions: '',
    instructionsEn: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      setEditingAddress(null);
    } else {
      addAddress(formData);
    }
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      street: '',
      streetEn: '',
      district: '',
      districtEn: '',
      city: '',
      cityEn: '',
      phone: '+249 ',
      isDefault: false,
      instructions: '',
      instructionsEn: ''
    });
  };

  const handleEdit = (address: DeliveryAddress) => {
    setFormData({
      title: address.title,
      titleEn: address.titleEn,
      street: address.street,
      streetEn: address.streetEn,
      district: address.district,
      districtEn: address.districtEn,
      city: address.city,
      cityEn: address.cityEn,
      phone: address.phone,
      isDefault: address.isDefault,
      instructions: address.instructions || '',
      instructionsEn: address.instructionsEn || ''
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleAddressSelect = (address: DeliveryAddress) => {
    if (selectionMode && onSelectAddress) {
      selectAddress(address);
      onSelectAddress(address);
    }
  };

  const getAddressIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('منزل') || lowerTitle.includes('home')) return Home;
    if (lowerTitle.includes('مكتب') || lowerTitle.includes('office') || lowerTitle.includes('عمل')) return Briefcase;
    return MapPin;
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {selectionMode ? (language === 'ar' ? 'اختر عنوان التوصيل' : 'Select Delivery Address') : (language === 'ar' ? 'إدارة العناوين' : 'Manage Addresses')}
          </h1>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-white">
                <Plus size={16} className={getMargin('0', '2')} />
                {language === 'ar' ? 'إضافة عنوان' : 'Add Address'}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress 
                    ? (language === 'ar' ? 'تعديل العنوان' : 'Edit Address')
                    : (language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address')
                  }
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="title">{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={language === 'ar' ? 'مثل: المنزل، المكتب' : 'e.g: Home, Office'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g: Home, Office"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="street">{language === 'ar' ? 'الشارع والمنطقة' : 'Street & Area'}</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder={language === 'ar' ? 'شارع النيل، الخرطوم' : 'Nile Street, Khartoum'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="streetEn">{language === 'ar' ? 'الشارع والمنطقة (إنجليزي)' : 'Street & Area (English)'}</Label>
                  <Input
                    id="streetEn"
                    value={formData.streetEn}
                    onChange={(e) => setFormData({ ...formData, streetEn: e.target.value })}
                    placeholder="Nile Street, Khartoum"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="district">{language === 'ar' ? 'المحلية' : 'District'}</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder={language === 'ar' ? 'الخرطوم' : 'Khartoum'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{language === 'ar' ? 'المدينة' : 'City'}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={language === 'ar' ? 'الخرطوم' : 'Khartoum'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+249 123 456 789"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">{language === 'ar' ? 'تعليمات إضافية' : 'Additional Instructions'}</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder={language === 'ar' ? 'الشقة رقم 5، الطابق الثاني' : 'Apartment 5, Second Floor'}
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                  />
                  <Label htmlFor="isDefault">{language === 'ar' ? 'جعل هذا العنوان افتراضي' : 'Make this default address'}</Label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-primary text-white">
                    {editingAddress ? (language === 'ar' ? 'تحديث' : 'Update') : (language === 'ar' ? 'إضافة' : 'Add')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAddress(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Addresses List */}
      <div className="p-6 space-y-4">
        {addresses.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-gray-100">
            <div className="text-gray-400 mb-4">
              <MapPin size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No Saved Addresses'}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === 'ar' ? 'أضف عنوان توصيل لتسهيل عملية الطلب' : 'Add a delivery address to streamline your ordering'}
            </p>
            <Button onClick={() => setShowAddForm(true)} className="bg-primary text-white">
              <Plus size={16} className={getMargin('0', '2')} />
              {language === 'ar' ? 'إضافة عنوان' : 'Add Address'}
            </Button>
          </Card>
        ) : (
          addresses.map((address) => {
            const AddressIcon = getAddressIcon(address.title);
            return (
              <Card 
                key={address.id} 
                className={`border transition-all duration-200 ${
                  selectionMode 
                    ? 'cursor-pointer hover:border-primary hover:shadow-md' 
                    : 'border-gray-100'
                } ${address.isDefault ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => handleAddressSelect(address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <AddressIcon size={18} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {language === 'ar' ? address.title : address.titleEn}
                          </h3>
                          {address.isDefault && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                              <Star size={10} className="mr-1" />
                              {language === 'ar' ? 'افتراضي' : 'Default'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'ar' ? address.street : address.streetEn}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? `${address.district}, ${address.city}` : `${address.districtEn}, ${address.cityEn}`}
                        </p>
                        <p className="text-sm text-gray-500">{address.phone}</p>
                        {address.instructions && (
                          <p className="text-xs text-gray-400 mt-1">
                            {language === 'ar' ? address.instructions : address.instructionsEn}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {!selectionMode && (
                      <div className="flex items-center space-x-2">
                        {!address.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-gray-500 hover:text-primary"
                          >
                            <Star size={14} />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(address)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit3 size={14} />
                        </Button>
                        {addresses.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAddress(address.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}