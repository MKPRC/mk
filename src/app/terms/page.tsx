import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1장 총칙</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제1조 (목적)</h3>
                <p className="text-gray-700 leading-relaxed">
                  본 약관은 흐름(Flow) 플랫폼(이하 '회사'라 함)이 운영하는 구독형 조율 플랫폼 흐름(Flow) (이하 '플랫폼'이라 함)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 함)를 이용함에 있어 인터넷 플랫폼과 이용자의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제2조 (용어의 정의)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 이 약관에서 사용하는 용어의 정의는 아래와 같습니다.</p>
                <ul className="list-decimal ml-6 space-y-1 text-gray-700">
                  <li>"플랫폼"이란 회사가 운영하는 구독형 조율 플랫폼 흐름(Flow) (https://mkprotocol.com)을 말합니다.</li>
                  <li>"서비스"란 본 플랫폼에서 이용자에게 제공하는 구독 서비스, 조율 서비스, 컨시어지 서비스 등 플랫폼을 통해 제공하는 일체의 서비스를 말합니다.</li>
                  <li>"이용자"란 플랫폼에 접속하여 이 약관에 따라 플랫폼이 제공하는 서비스를 이용하는 회원을 말합니다.</li>
                  <li>"회원"이란 플랫폼에 회원가입을 한 자로서, 이 약관에 따라 회사와 서비스 이용계약을 체결하고 플랫폼에서 제공하는 서비스를 이용하는 자를 말합니다.</li>
                  <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하여 회사에 등록된 영문, 숫자, 영문과 숫자의 조합, 또는 이메일을 말합니다.</li>
                  <li>"비밀번호(Password)"란 회원의 동일성 확인과 회원의 권익 및 비밀보호를 위하여 회원 스스로가 설정하여 회사에 등록한 문자 또는 문자와 숫자의 조합을 말합니다.</li>
                  <li>"게시물"이란 회원이 서비스를 이용함에 있어 플랫폼상에 게시한 부호∙문자∙음성∙음향∙화상∙동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 말합니다.</li>
                  <li>"콘텐츠"란 게시물을 포함하여, 플랫폼상에 게재된 각종 사진, 일러스트, 템플릿, 아이콘, 편집디자인 소스 등을 말합니다.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">② 제1항에서 정의되지 않은 용어의 의미는 관련법령 및 일반적인 거래관행을 따릅니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제3조 (약관 등의 명시와 설명 및 개정)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 플랫폼은 이 약관의 내용과 상호 및 대표자의 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 전자우편주소 등을 회원이 알 수 있도록 서비스 초기화면에 게시합니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">② 플랫폼은 이용자가 약관에 동의하기에 앞서 약관에 정해져 있는 내용 중 구독 취소, 환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">③ 플랫폼은 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 전자문서 및 전자거래기본법, 전자금융거래법, 전자서명법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 소비자기본법 등 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">④ 플랫폼이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 개정약관의 시행일자 7일 이전부터 적용일자 전일까지 공지합니다.</p>
                <p className="text-gray-700 leading-relaxed">⑤ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관련법령 또는 상관례에 따릅니다.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2장 서비스 이용계약 및 회원가입</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제4조 (이용계약의 성립)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 이용계약은 이용자가 이 약관에 동의하면서 제5조에 따른 이용신청을 하고, 회사가 이를 승낙함으로써 성립합니다.</p>
                <p className="text-gray-700 leading-relaxed">② 이용계약의 성립시기는 회사의 승낙이 이용자에게 도달한 시점으로 하며, 이는 특별한 사정이 없는 한 플랫폼상의 '신청절차'에 가입완료 문구가 표시된 시점을 의미합니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제5조 (이용신청)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기재하고 플랫폼상에서 아이디 및 비밀번호를 설정하여 회원가입을 신청함으로써, 이용신청을 합니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">② 이용자는 실명이 아닌 이름을 제공하거나 타인의 정보를 도용하는 경우 서비스 이용이 제한되며, 관련법령에 따라 처벌받을 수 있습니다.</p>
                <p className="text-gray-700 leading-relaxed">③ 만 14세 미만의 아동이 서비스를 이용하기 위해서는 회사가 요청하는 소정의 법정대리인(부모 등)의 동의 절차를 거쳐야 합니다.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3장 서비스 제공 및 이용</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제9조 (서비스의 내용)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">회사가 제공하는 서비스는 다음과 같습니다.</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Flow Basic: 뉴스레터, 도구 추천, 흐름 인사이트 제공</li>
                  <li>Flow+: 1:1 조율 세션 월 1회 + 콘텐츠 우선 제공</li>
                  <li>Flow Gold: 웹제작, 금·차 컨시어지, 기술 파트너링 지원</li>
                  <li>기타 부가서비스</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">회사가 제공하는 서비스의 구체적 내용은 별도로 인터넷 사이트에 게시하거나 개별 공지하는 등 적절한 방법으로 고지하며, 그 구체적 종류와 내용은 추가ㆍ감소ㆍ변경될 수 있습니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제10조 (유료 서비스의 제공 및 이용)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회사는 회원에게 구독형 조율 서비스를 제공합니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">② 유료 서비스의 상세 내역과 가격정책은 플랫폼에 게시된 정책에 따르며, 회원의 요청에 따라 제공됩니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">③ 유료 서비스 이용계약은 회원이 플랫폼상에서 유료 서비스를 신청하고, 회사가 이를 승낙함으로써 성립합니다.</p>
                <p className="text-gray-700 leading-relaxed">④ 유료 서비스 이용계약은 해당 서비스에 따른 이용요금의 지급이 확인된 시점에 이용계약이 성립합니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제11조 (유료 서비스 이용계약의 구독 취소 및 해지)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회원은 이용 승낙일로부터 7일 이내에 회사에 구독 취소를 요청할 수 있습니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">② 회원은 구독 취소 및 계약해지 요청을 플랫폼 내에서 직접 하거나, 이메일(support@mkprotocol.com)을 통해 요청할 수 있습니다.</p>
                <p className="text-gray-700 leading-relaxed">③ 회사는 회원으로부터 구독 취소 또는 계약해지 요청을 받은 날로부터 7일 이내에 환불 금액을 고지하고, 이용요금 결제와 동일한 방법으로 이를 환급합니다.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4장 계약당사자의 의무</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제19조 (회사의 의무)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회사는 이 약관 및 관련법령에서 금지하는 행위 및 미풍양속에 반하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위하여 노력할 의무가 있습니다.</p>
                <p className="text-gray-700 leading-relaxed mb-2">② 회사는 이용자의 개인 신상 정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다.</p>
                <p className="text-gray-700 leading-relaxed">③ 회사는 관련법령이 정하는 바에 따라서 회원 등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제20조 (회원의 의무)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회원은 회사에서 제공하는 서비스를 본래의 이용 목적 이외의 용도로 사용하거나 다음 각 호에 해당하는 행위를 해서는 안됩니다.</p>
                <ul className="list-decimal ml-6 space-y-1 text-gray-700">
                  <li>가입신청시 허위 사실을 기재하는 행위</li>
                  <li>타인의 정보를 도용하는 행위</li>
                  <li>회사 및 제3자의 명예를 훼손하거나 업무를 방해하는 행위</li>
                  <li>회사 또는 제3자의 지적재산권을 침해하는 행위</li>
                  <li>음란, 저속한 정보를 교류, 게재하는 행위</li>
                  <li>기타 공공질서 및 미풍양속을 위반하는 행위</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">② 회원은 회사 홈페이지 상의 공지사항 및 이용약관의 수정사항 등을 확인하고 이를 준수할 의무가 있습니다.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5장 손해배상 및 기타사항</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제23조 (손해배상)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회사는 유료 서비스 이용이 불가하거나 이용에 장애가 있는 경우, 회사는 유료 서비스를 이용중인 회원에게 그 손해를 배상합니다.</p>
                <p className="text-gray-700 leading-relaxed">② 회원이 이 약관의 의무를 위반함으로 인하여 회사에 손해를 입힌 경우 회원은 회사에 대하여 당해 손해를 배상하여야 합니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제24조 (책임의 한계)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 회사는 천재지변, 국가비상사태 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
                <p className="text-gray-700 leading-relaxed">② 회사는 회원의 귀책사유로 인한 이용 불가 또는 이용 장애에 대하여는 책임을 지지 아니합니다.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">제25조 (준거법 및 재판관할)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">① 이 약관의 해석 및 회원 간의 분쟁에 대하여는 대한민국의 법령을 준거법으로 합니다.</p>
                <p className="text-gray-700 leading-relaxed">② 회사와 회원 간 발생한 분쟁에 관한 소송은 서울중앙지방법원을 전속관할로 합니다.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">부칙</h2>
              <p className="text-gray-700 leading-relaxed">본 약관은 2025년 7월 8일부터 시행됩니다.</p>
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