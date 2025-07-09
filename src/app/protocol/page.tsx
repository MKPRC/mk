import React from 'react';
import Link from 'next/link';

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">MK Protocol</h1>
          
          <p className="text-xl font-semibold mb-6">
            <strong>Gold · Auto · Trade · Insurance · Value Networking</strong>
          </p>
          
          <p className="text-lg mb-6 text-left">
            MK Protocol은 사람과 사람, 가치와 가치를 연결하는 흐름의 플랫폼입니다.
          </p>
          
          <div className="text-left space-y-3 mb-8">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🚗</span>
              <div>
                <strong>Auto</strong> : 차량 리스, 렌트, 매입 네트워크
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🪙</span>
              <div>
                <strong>Gold</strong> : 실물 금 거래, 자산 네트워크
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📜</span>
              <div>
                <strong>Trade</strong> : 사람 중심 신뢰 기반 거래
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🩺</span>
              <div>
                <strong>Insurance</strong> : 건강/생명 보험 서비스
              </div>
            </div>
          </div>
          
          <p className="text-lg mb-8 italic">
            우리는 "크게 도움이 되진 못하지만, 언제든 작은 연결이 되고 싶습니다."
          </p>
          
          <Link 
            href="/"
            className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-colors duration-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 