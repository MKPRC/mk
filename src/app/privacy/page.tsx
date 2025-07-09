import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보 처리방침</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 총칙</h2>
              <p className="text-gray-700 leading-relaxed">
                흐름(Flow) 플랫폼은 ｢개인정보보호법｣ 제30조에 따라 고객님의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 홈페이지 회원가입 및 관리</h3>
                <p className="text-gray-700 leading-relaxed">
                  회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고객 의견 청취의 목적으로 개인정보를 처리합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 문의하기 사무 처리</h3>
                <p className="text-gray-700 leading-relaxed">
                  홈페이지 이용, 구독 서비스 관련 문의, 조율 서비스 안내 등의 문의 처리 결과 답변 목적으로 개인정보를 처리합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">3) 서비스 제공</h3>
                <p className="text-gray-700 leading-relaxed">
                  구독 서비스 제공, 조율 서비스 제공, 컨시어지 서비스 제공, 부가 서비스 등록·제공 목적으로 개인정보를 처리합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">4) 결제 및 정산</h3>
                <p className="text-gray-700 leading-relaxed">
                  구독료 결제, 정기 결제 처리, 환불 처리, 세금계산서 발급 등의 목적으로 개인정보를 처리합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 처리 항목 및 보유기간</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 개인정보 처리 항목</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  법령에 따른 개인정보 보유 및 이용기간 또는 고객님으로부터 개인정보를 수집 시에 동의 받은 개인정보 보유, 이용기간 내에서 개인정보를 처리, 보유합니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>필수 항목:</strong> 휴대폰 번호, 이메일 주소, 카카오 계정, 네이버 계정, 닉네임 (2년, 탈퇴 시 삭제)</li>
                    <li><strong>선택 항목:</strong> 사업자 명, 사업자 번호 (2년, 탈퇴 시 삭제)</li>
                    <li><strong>결제 정보:</strong> 신용카드 정보, 계좌 정보, 빌링키 (5년, 관련 법령에 따라)</li>
                    <li><strong>자동 생성 정보:</strong> 접속 ip, 접속 로그, 쿠키 정보 (수집 후 3개월)</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 법령에 따른 보존</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  관련 법령의 규정에 의하여 보존할 의무가 있는 경우 회사는 고객의 개인정보를 보관합니다.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>계약 또는 청약철회 등에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  <li>신용정보의 수집/처리 및 이용 등에 관한 기록: 3년</li>
                  <li>통신비밀보호법에 따른 서비스이용기록, 접속로그, 접속IP정보: 3개월</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보의 파기 절차 및 파기방법</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 파기 절차</h3>
                <p className="text-gray-700 leading-relaxed">
                  흐름(Flow) 플랫폼은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 파기 방법</h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>전자적 파일 형태: 기록을 재생할 수 없도록 안전하게 파기</li>
                  <li>종이문서: 분쇄기로 분쇄하거나 소각하여 파기</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보의 안전성 확보 조치</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 기술적 조치</h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li><strong>개인정보 암호화:</strong> 중요한 개인정보는 암호화하여 저장 및 전송</li>
                  <li><strong>통신 구간 암호화:</strong> SSL/TLS를 통한 안전한 데이터 전송</li>
                  <li><strong>보안솔루션 설치:</strong> 해킹 등 외부침입에 대비한 보안시스템 구축</li>
                  <li><strong>접근 제한:</strong> 개인정보처리시스템에 대한 접근 권한 제한</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 관리적 조치</h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li><strong>개인정보 관리체계:</strong> 내부적으로 개인정보 관리체계 수립 및 운영</li>
                  <li><strong>개인정보 취급자 관리:</strong> 정기적인 개인정보보호 교육 및 서약서 제출</li>
                  <li><strong>권한 관리:</strong> 개인정보처리자의 권한 관리 및 최소한의 접근 허용</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 쿠키의 사용 목적</h3>
                <p className="text-gray-700 leading-relaxed">
                  흐름(Flow) 플랫폼은 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 mt-2">
                  <li>홈페이지 접속 빈도 및 방문시간 분석</li>
                  <li>고객의 관심분야 파악 및 분석</li>
                  <li>각종 이벤트 참여 및 방문횟수 파악</li>
                  <li>타겟 마케팅 및 개인 맞춤 서비스 제공</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 쿠키 설정 거부 방법</h3>
                <p className="text-gray-700 leading-relaxed">
                  고객은 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수 있습니다.
                </p>
                <p className="text-gray-700 leading-relaxed mt-2 text-sm">
                  <strong>설정방법 예시:</strong> 웹 브라우저 상단의 도구 → 인터넷 옵션 → 개인정보 → 고급 → 설정방법 선택
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 개인정보 제3자 제공</h2>
              <p className="text-gray-700 leading-relaxed">
                흐름(Flow) 플랫폼은 고객의 개인정보를 제2조(개인정보의 수집 및 이용 목적)에서 고지한 범위 내에서만 사용하며, 고객의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 타인 또는 타기업·기관에 제공하지 않습니다.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-gray-700 mt-2">
                <li>고객이 사전에 공개 또는 제3자 제공에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>결제 처리를 위해 필요한 최소한의 정보를 결제 대행업체에 제공하는 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 고객, 법정대리인의 권리와 의무 및 그 행사방법</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">1) 고객의 권리</h3>
                <p className="text-gray-700 leading-relaxed">
                  고객 또는 법정대리인은 회사에 대하여 언제든지 개인정보 수집·이용·제공 등의 동의를 철회할 수 있으며 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">2) 권리 행사 방법</h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>온라인: 회사 홈페이지에서 본인 확인 절차 후 개인정보관리 메뉴에서 처리</li>
                  <li>서면, 전화, 이메일: 고객센터 또는 개인정보보호 담당자에게 연락</li>
                  <li>이메일: support@mkprotocol.com</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 고객의 권익 침해에 대한 구제방법</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                고객께서는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">개인정보 침해신고센터</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>홈페이지: privacy.kisa.or.kr</li>
                    <li>전화: (국번없이) 118</li>
                    <li>주소: (58324) 전남 나주시 진흥길 9 3층</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">개인정보 분쟁조정위원회</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>홈페이지: www.kopico.go.kr</li>
                    <li>전화: (국번없이) 1833-6972</li>
                    <li>주소: (03171) 서울특별시 종로구 세종대로 209 정부서울청사 12층</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">기타 기관</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>대검찰청 사이버범죄수사단: 02-3480-3573</li>
                    <li>경찰청 사이버안전국: 182</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 개인정보 보호책임자 및 담당자</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                흐름(Flow) 플랫폼은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보처리와 관련한 고객의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">개인정보 보호책임자</h4>
                    <p className="text-gray-700">김무경 (흐름(Flow) 플랫폼)</p>
                    <p className="text-gray-700">이메일: support@mkprotocol.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">개인정보 보호담당자</h4>
                    <p className="text-gray-700">김무경 (흐름(Flow) 플랫폼)</p>
                    <p className="text-gray-700">이메일: support@mkprotocol.com</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mt-4">
                고객께서는 흐름(Flow) 플랫폼 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 개인정보 처리 방침의 변경에 관한 사항</h2>
              <p className="text-gray-700 leading-relaxed">
                흐름(Flow) 플랫폼은 본 개인정보처리방침을 변경하는 경우 그 이유 및 변경내용을 홈페이지 첫 화면의 공지사항란 또는 별도의 창을 통하는 등의 방법으로 사전에 공지한 후 변경 및 적용하고 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">부칙</h2>
              <p className="text-gray-700 leading-relaxed">
                본 방침은 2025년 7월 8일부터 시행됩니다.
              </p>
            </section>

            <section className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">문의처</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>대표자:</strong> 김무경</p>
                <p><strong>사업자등록번호:</strong> 829-87-03239</p>
                <p><strong>주소:</strong> 대구광역시 북구 침산로 229-1 1층</p>
                <p><strong>전화번호:</strong> 053-710-5737</p>
                <p><strong>이메일:</strong> support@mkprotocol.com</p>
                <p><strong>통신판매업신고번호:</strong> 제2025-대구북구-0560호</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 