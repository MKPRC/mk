import React from 'react';
import Link from 'next/link';

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">MK Philosophy</h1>
        
        <div className="mb-12">
          <div className="text-8xl mb-6">🚧</div>
          <h2 className="text-3xl font-semibold mb-4">준비 중입니다...</h2>
          <p className="text-xl text-gray-400">
            흐름(Flow)의 철학과 가치관을 담은 페이지를 준비하고 있습니다.
          </p>
        </div>
        
        <Link 
          href="/"
          className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-colors duration-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 