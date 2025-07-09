export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMembershipBadgeColor = (type: string): string => {
  switch (type) {
    case 'basic': return 'bg-blue-100 text-blue-800';
    case 'plus': return 'bg-green-100 text-green-800';
    case 'gold': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBadgeColor = (status: string): string => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    payment_failed: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
  const statusLabels = {
    active: '활성',
    pending: '대기',
    cancelled: '취소',
    payment_failed: '결제실패',
    completed: '완료',
    failed: '실패'
  };

  return statusLabels[status as keyof typeof statusLabels] || status;
};

export const calculateNextBillingDate = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const nextBillingDate = new Date(createdDate);
  
  // 다음 달 같은 일자로 설정
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  
  return nextBillingDate.toISOString();
}; 