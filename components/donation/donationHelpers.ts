// Helper functions for donation functionality

export const getDemandColor = (demandLevel: string) => {
  switch (demandLevel) {
    case 'عالي جداً':
    case 'Very High':
      return 'bg-red-100 text-red-700';
    case 'عالي':
    case 'High':
      return 'bg-orange-100 text-orange-700';
    case 'متوسط':
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'عالي':
    case 'High':
      return 'bg-red-100 text-red-700';
    case 'متوسط':
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'preparing':
      return 'bg-blue-100 text-blue-700';
    case 'ready':
      return 'bg-green-100 text-green-700';
    case 'assigned':
      return 'bg-green-100 text-green-700';
    case 'pending_assignment':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const calculateDonationTotal = (items: any[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const formatDonationDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const getUrgencyText = (urgency: string, language: string) => {
  if (urgency === 'high') return language === 'ar' ? 'عاجل' : 'Urgent';
  if (urgency === 'medium') return language === 'ar' ? 'متوسط' : 'Medium';
  return language === 'ar' ? 'عادي' : 'Normal';
};

export const getStatusText = (status: string, language: string) => {
  switch (status) {
    case 'pending_assignment':
      return language === 'ar' ? 'في انتظار التوزيع' : 'Pending Assignment';
    case 'assigned':
      return language === 'ar' ? 'تم التوزيع' : 'Assigned';
    default:
      return status;
  }
};