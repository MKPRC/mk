'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const scrollToMembership = () => {
    const element = document.getElementById('membership-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero bg-white py-24 px-6 text-center">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900">
            흐름(Flow), 지금 시작합니다.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            금의 가치, 사람의 가치, 기술의 가치를 연결하는 조율형 브랜드 – 흐름(Flow)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button 
              className="btn btn-primary px-8 py-3"
              onClick={scrollToMembership}
            >
              흐름 멤버십 알아보기
            </button>
            <button 
              className="btn btn-outline px-8 py-3"
              onClick={scrollToMembership}
            >
              나에게 맞는 흐름 시작하기
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="text-primary-500 font-semibold">2.1배 빠른 연결</span> – Flow 구독자 후기
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-primary-500 font-semibold">차량 구매 + Gold 혜택</span> – Flow+ 이용자 체감
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-primary-500 font-semibold">가치의 전환점 경험</span> – Flow Gold 실사용 리뷰
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 