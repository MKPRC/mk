'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth';
import { fetchUserProfile, updateUserPhone, UserProfileResponse } from '@/shared/api/user/profile';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, isLoading, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      setProfileData(data);
      setPhone(data.user.phone || '');
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      setError('프로필을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handlePhoneUpdate = async () => {
    if (!phone.match(/^010-\d{4}-\d{4}$/)) {
      setError('올바른 전화번호 형식이 아닙니다. (010-1234-5678)');
      return;
    }

    try {
      setUpdateLoading(true);
      setError('');
      await updateUserPhone(phone);
      await loadProfile(); // 프로필 새로고침
      setIsEditing(false);
    } catch (error) {
      console.error('전화번호 업데이트 오류:', error);
      setError('전화번호 업데이트에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'pending_payment':
        return '결제 대기';
      case 'payment_failed':
        return '결제 실패';
      case 'completed':
        return '결제 완료';
      case 'failed':
        return '결제 실패';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_failed':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user || !profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 내 정보 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-6">내 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <div className="text-gray-900">{profileData.user.display_name || '이름 없음'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <div className="text-gray-900">{profileData.user.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    로그인 방식
                  </label>
                  <div className="text-gray-900">
                    {profileData.user.provider === 'kakao' ? '카카오' : 
                     profileData.user.provider === 'naver' ? '네이버' : '기타'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="010-1234-5678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={13}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handlePhoneUpdate}
                          disabled={updateLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updateLoading ? '저장 중...' : '저장'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setPhone(profileData.user.phone || '');
                            setError('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{profileData.user.phone || '등록되지 않음'}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        수정
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 구독 정보 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-6">내 구독</h2>
              
              {profileData.subscription ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {profileData.subscription.membership_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(profileData.subscription.status)}`}>
                        {getStatusText(profileData.subscription.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">월 요금</p>
                    <p className="text-lg font-medium">₩{profileData.subscription.amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">다음 결제일</p>
                    <p className="text-sm">
                      {new Date(profileData.subscription.next_billing_date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">구독 시작일</p>
                    <p className="text-sm">
                      {new Date(profileData.subscription.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">활성 구독이 없습니다.</p>
                  <button
                    onClick={() => router.push('/#membership-section')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    구독하기
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* 결제 내역 */}
        {profileData.payment_history && profileData.payment_history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-6">결제 내역</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profileData.payment_history.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.paid_at || payment.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 