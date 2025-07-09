'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MembershipCard } from '@/entities/membership';

const membershipPlans = [
  {
    id: 'basic',
    name: 'Flow Basic',
    description: '뉴스레터, 도구 추천, 흐름 인사이트 제공',
    price: 9900,
    features: ['뉴스레터', '도구 추천', '흐름 인사이트']
  },
  {
    id: 'plus',
    name: 'Flow+',
    description: '1:1 조율 세션 월 1회 + 콘텐츠 우선 제공',
    price: 29000,
    features: ['뉴스레터', '도구 추천', '흐름 인사이트', '1:1 조율 세션', '콘텐츠 우선 제공']
  },
  {
    id: 'gold',
    name: 'Flow Gold',
    description: '웹제작, 금·차 컨시어지, 기술 파트너링 지원',
    price: 79000,
    features: ['모든 Flow+ 혜택', '웹제작 지원', '금·차 컨시어지', '기술 파트너링']
  }
];

export const MembershipSection: React.FC = () => {
  return (
    <section id="membership-section" className="membership bg-white py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            흐름 멤버십 가입
          </h2>
          <p className="text-gray-600 text-lg">
            당신의 흐름에 맞는 가치를 전달하는 구독형 조율 플랫폼 – 흐름(Flow)
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {membershipPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MembershipCard plan={plan} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-blue-600 font-bold text-lg">
            흐름은 단순한 서비스가 아니라, 함께 흐르는 변화를 만드는 공간입니다. 
            모든 수익의 30%는 도움이 필요한 이웃과 유기견 보호, 그리고 어린이들에게 전달됩니다. 
            함께 만드는 미래, 함께 흐르는 가치.
          </p>
        </motion.div>
      </div>
    </section>
  );
}; 