'use client';

import { useState } from 'react';
import { PaymentButton } from '@/features/payment';

export default function ServicePage() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'plus' | 'premium'>('basic');

  const plans = [
    {
      id: 'basic',
      name: 'Basic 흐름',
      price: '9,900원',
      description: '가치 있는 하루를 위한 기본 콘텐츠',
      features: [
        '매달 실천 콘텐츠 제공',
        'PDF 콘텐츠 접근권',
        '철학 기반 실천 카드뉴스',
        '기본 성장 도구 제공'
      ],
      highlight: false
    },
    {
      id: 'plus',
      name: 'Plus 흐름',
      price: '29,000원',
      description: '개인 맞춤형 성장 솔루션',
      features: [
        'Basic 플랜의 모든 기능',
        '월간 행동루틴 리포트',
        '추천 콘텐츠 + 이달의 메시지',
        '개인 맞춤 콘텐츠 제공',
        '정서적 응원 도구'
      ],
      highlight: false
    },
    {
      id: 'premium',
      name: 'Premium 흐름',
      price: '79,000원',
      description: 'AI 기반 프리미엄 큐레이션',
      features: [
        'Plus 플랜의 모든 기능',
        '조율자 AI 1:1 콘텐츠 큐레이션',
        '구독자 전용 커뮤니티 초대',
        '기부 참여 타임라인 등록',
        'GPT 기반 개인 상담'
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <div className="bg-primary-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The;흐름
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            가치 있는 하루를 위한 실천 도구
          </p>
          <p className="text-lg opacity-75 max-w-3xl mx-auto">
            MK Protocol 구독 서비스는 성장형 AI 기반 콘텐츠 구독 시스템으로,<br />
            실천 도구와 정보를 정기적으로 제공합니다.
          </p>
        </div>
      </div>

      {/* 서비스 소개 */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            구독 서비스 소개
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-primary-500 mb-4">브랜드명</h3>
                <p className="text-gray-700 mb-6">The;흐름</p>
                
                <h3 className="text-xl font-semibold text-primary-500 mb-4">형태</h3>
                <p className="text-gray-700">자동결제 기반의 월간 정기구독</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary-500 mb-4">제공 내용</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 실천형 카드뉴스(철학/사회/기부/정보 융합)</li>
                  <li>• 개인 맞춤 콘텐츠</li>
                  <li>• 정서적 응원 + 생산성 향상 도구</li>
                  <li>• 창업가·기획자 대상 성장형 AI 보조 콘텐츠</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 구독 혜택 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            구독 시 제공되는 장점
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-primary-500 mb-3">콘텐츠 제공</h3>
              <p className="text-gray-700">매달 새로운 실천 카드북 / 미션 / 브리핑 제공</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">자기 성장</h3>
              <p className="text-gray-700">철학 기반 루틴 설계, 감정·행동 리마인더</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-primary-500 mb-3">AI 소통</h3>
              <p className="text-gray-700">GPT 기반 조율자 시스템을 통한 1:1 응답</p>
            </div>
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-primary-500 mb-3">사회적 환원</h3>
              <p className="text-gray-700">수익 일부 기부, 투명 보고서 발행</p>
            </div>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-primary-500 mb-3">실행 지원</h3>
              <p className="text-gray-700">전자책/워크북/계획표 등 실행용 도구 제공</p>
            </div>
          </div>
        </div>
      </section>

      {/* 구독 플랜 */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            구독 플랜
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full flex flex-col"
              >
                <div className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-primary-500 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-6">
                    {plan.price}
                    <span className="text-sm text-gray-500 font-normal">/월 (VAT포함)</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div 
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedPlan === plan.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedPlan(plan.id as any)}
                  >
                    <button className="w-full">
                      {selectedPlan === plan.id ? '선택됨' : '선택하기'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 구독하기 버튼 */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                선택한 플랜: {plans.find(p => p.id === selectedPlan)?.name}
              </h3>
                             <p className="text-2xl font-bold text-primary-500 mb-6">
                 {plans.find(p => p.id === selectedPlan)?.price}/월
               </p>
               <PaymentButton plan={{
                 id: selectedPlan,
                 name: plans.find(p => p.id === selectedPlan)?.name || '',
                 description: plans.find(p => p.id === selectedPlan)?.description || '',
                 price: selectedPlan === 'basic' ? 9900 : selectedPlan === 'plus' ? 29000 : 79000,
                 features: plans.find(p => p.id === selectedPlan)?.features || []
               }} />
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-primary-50 rounded-xl p-6 mt-12 text-center">
            <p className="text-gray-700">
              <strong>간편 결제 & 알림</strong><br />
              모든 플랜은 토스 결제 + 카카오 알림톡 연동으로 간편하게 진행되며,<br />
              언제든 해지 가능합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 