interface AlimtalkMessage {
  message_type: string;
  phn: string;
  profile: string;
  msg: string;
  tmplId: string;
  reserveDt?: string;
  smsKind?: string;
  msgSms?: string;
  smsSender?: string;
}

interface AlimtalkResponse {
  code: string;
  message: string;
  data?: any;
}

export class AlimtalkService {
  private readonly baseUrl: string;
  private readonly userId: string;
  private readonly profileKey: string;

  constructor() {
    this.baseUrl = process.env.BIZMSG_API_URL || 'https://alimtalk-api.bizmsg.kr';
    this.userId = process.env.BIZMSG_USERID || '';
    this.profileKey = process.env.BIZMSG_PROFILE_KEY || '';

    // 개발 환경에서는 환경 변수 체크 우회
    if (process.env.NODE_ENV === 'production' && (!this.userId || !this.profileKey)) {
      throw new Error('알림톡 API 환경 변수가 설정되지 않았습니다.');
    }
  }

  private formatPhoneNumber(phone: string): string {
    // 전화번호 포맷팅 (국가코드 추가)
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    
    if (formattedPhone.startsWith('010')) {
      formattedPhone = '82' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('82')) {
      formattedPhone = '82' + formattedPhone;
    }
    
    return formattedPhone;
  }

  private async sendMessage(message: AlimtalkMessage): Promise<AlimtalkResponse> {
    try {
      console.log('알림톡 발송 요청:', {
        url: `${this.baseUrl}/v2/sender/send`,
        headers: {
          'Content-Type': 'application/json',
          'userid': this.userId || 'test_user'
        },
        body: [message]
      });

      const response = await fetch(`${this.baseUrl}/v2/sender/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': this.userId || 'test_user'
        },
        body: JSON.stringify([message])
      });

      const result = await response.json();
      
      console.log('알림톡 발송 결과:', {
        phone: message.phn,
        template: message.tmplId,
        response: result
      });

      return result;
    } catch (error) {
      console.error('알림톡 발송 오류:', error);
      throw error;
    }
  }

  // 구독 완료 알림톡
  async sendSubscriptionSuccess(phone: string, data: {
    name: string;
    membershipType: string;
    amount: number;
    nextBillingDate: string;
  }): Promise<AlimtalkResponse> {
    const templateId = process.env.ALIMTALK_TEMPLATE_PAYMENT_SUCCESS || 'test_template';
    
    if (!process.env.ALIMTALK_TEMPLATE_PAYMENT_SUCCESS) {
      console.log('템플릿 ID가 설정되지 않았습니다. 테스트 모드로 실행합니다.');
    }

    const message: AlimtalkMessage = {
      message_type: 'AT',
      phn: this.formatPhoneNumber(phone),
      profile: this.profileKey || 'test_profile',
      tmplId: templateId,
      msg: `안녕하세요 ${data.name}님!
흐름(Flow) 구독이 정상적으로 완료되었습니다.

🧾 플랜: ${data.membershipType}
💳 결제일: ${data.nextBillingDate}

흐름은 단순한 서비스가 아닙니다.
함께 흐르는 변화를 만드는 공간입니다.
수익의 30%는 취약계층과 유기견, 어린이들에게 전달됩니다.

감사합니다 🙏`,
      smsKind: 'L',
      msgSms: `흐름(Flow) 구독이 완료되었습니다. 플랜: ${data.membershipType}, 결제일: ${data.nextBillingDate}`,
      smsSender: '15446644'
    };

    return this.sendMessage(message);
  }

  // 구독 갱신 알림톡
  async sendSubscriptionRenewal(phone: string, data: {
    name: string;
    membershipType: string;
    amount: number;
    nextBillingDate: string;
    billingDate: string;
  }): Promise<AlimtalkResponse> {
    const templateId = process.env.ALIMTALK_TEMPLATE_SUBSCRIPTION_RENEWAL;
    
    if (!templateId) {
      throw new Error('구독 갱신 템플릿 ID가 설정되지 않았습니다.');
    }

    const message: AlimtalkMessage = {
      message_type: 'AT',
      phn: this.formatPhoneNumber(phone),
      profile: this.profileKey,
      tmplId: templateId,
      msg: `안녕하세요 ${data.name}님!

흐름(Flow) ${data.membershipType} 멤버십이 갱신되었습니다.

• 결제일: ${data.billingDate}
• 결제금액: ${data.amount.toLocaleString()}원
• 다음 결제일: ${data.nextBillingDate}

계속해서 흐름의 서비스를 이용해주셔서 감사합니다.`,
      smsKind: 'L',
      msgSms: `흐름(Flow) ${data.membershipType} 멤버십이 갱신되었습니다. 결제금액: ${data.amount.toLocaleString()}원`,
      smsSender: '15446644'
    };

    return this.sendMessage(message);
  }
}

// 싱글톤 인스턴스
export const alimtalkService = new AlimtalkService(); 