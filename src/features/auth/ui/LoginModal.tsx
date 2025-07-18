'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/shared/lib/auth';
import { X } from 'lucide-react';
import { NaverLoginButton } from './NaverLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithKakao, signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTestLoginLoading, setIsTestLoginLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
      onClose();
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleTossTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsTestLoginLoading(true);
      const { error } = await signInWithPassword(email, password);
      if (error) {
        console.error('토스 테스트 로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다: ' + error.message);
        return;
      }
      onClose();
    } catch (error) {
      console.error('토스 테스트 로그인 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsTestLoginLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">로그인</h2>
              <p className="text-gray-600">
                흐름(Flow) 멤버십을 구독하려면 로그인이 필요합니다.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleKakaoLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.329C443.871 364.676 414.415 387.883 377.156 404.95C339.897 422.016 299.345 430.549 255.5 430.549C241.607 430.549 227.262 429.681 212.467 427.944C184.118 477.775 124.135 512 124.135 512C124.135 512 130.668 471.776 128.199 433.024C97.531 407.075 77.5 379.456 77.5 349.252V239.252C77.5 204.577 88.326 172.566 109.978 143.22C131.629 113.873 161.085 90.666 198.344 73.5996C235.603 56.5332 276.155 48 255.5 48Z"/>
                </svg>
                카카오로 로그인
              </button>

              <NaverLoginButton onLogin={onClose} />

              {/* 토스 테스트 로그인 */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 text-center mb-3">토스 테스트용</p>
                <form onSubmit={handleTossTestLogin} className="space-y-3">
                  <input
                    type="email"
                    placeholder="테스트 계정 이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isTestLoginLoading}
                    className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors ${
                      isTestLoginLoading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {isTestLoginLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        로그인 중...
                      </>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        토스 테스트 로그인
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              로그인 시 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 