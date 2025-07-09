'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PaymentButton } from '@/features/payment';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

interface MembershipCardProps {
  plan: MembershipPlan;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ plan }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 min-h-[434px]"
    >
      <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
      <p className="text-gray-600 mb-4">{plan.description}</p>
      
      <div className="mb-6">
        <span className="text-2xl font-bold text-gray-900">
          ₩{plan.price.toLocaleString()}
        </span>
        <span className="text-gray-500 ml-2">/ 월</span>
      </div>

      <ul className="space-y-2 mb-8 min-h-[152px]">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <PaymentButton plan={plan} />
    </motion.div>
  );
}; 