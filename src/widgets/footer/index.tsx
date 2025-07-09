'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <div>
            <h4 className="font-bold text-white mb-4">조율 서비스</h4>
            <ul className="space-y-2">
              <li>AI 개발 지원</li>
              <li>자동차 연계</li>
              <li>금 라인 컨시어지</li>
              <li>철학/조율 상담</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">고객센터</h4>
            <ul className="space-y-2">
              <li>자주 묻는 질문</li>
              <li>문의하기</li>
              <li>이벤트 및 공지</li>
              <li>이용가이드</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">마이 페이지</h4>
            <ul className="space-y-2">
              <li>구독 상태 확인</li>
              <li>상담 기록 보기</li>
              <li>결제 내역</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8"
        >
          <div className="text-center space-y-2">
            <p className="text-sm">
              사이트맵 | <Link href="/terms" className="hover:text-blue-400 transition-colors">이용약관</Link> | <Link href="/privacy" className="hover:text-blue-400 transition-colors">개인정보처리방침</Link> | 저작권안내
            </p>
            
            <p className="text-sm">
              상호명: 주식회사 엠케이아엔시(MKINC)
            </p>
            <p className="text-sm">
              대표자: 김무경 | 사업자등록번호: 829-87-03239
            </p>
            <p className="text-sm">
              대구광역시 북구 침산로 229-1 1층
            </p>
            <p className="text-sm font-bold">
              전화번호: 053-710-5737
            </p>
            <p className="text-sm font-bold">
              이메일: support@mkprotocol.com
            </p>
            <p className="text-sm">
              통신판매업신고번호: 제2025-대구북구-0560호
            </p>
            <p className="text-sm">
              ⓒ 2025 흐름(Flow) | 조율된 흐름은 가치를 만듭니다.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}; 