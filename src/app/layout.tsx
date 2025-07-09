import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/widgets'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '흐름(Flow) - 조율된 흐름은 가치를 만듭니다',
  description: '금의 가치, 사람의 가치, 기술의 가치를 연결하는 조율형 브랜드 – 흐름(Flow)',
  keywords: ['흐름', 'Flow', '구독', '멤버십', '조율', '컨시어지'],
  authors: [{ name: '흐름(Flow) 팀' }],
  openGraph: {
    title: '흐름(Flow) - 조율된 흐름은 가치를 만듭니다',
    description: '금의 가치, 사람의 가치, 기술의 가치를 연결하는 조율형 브랜드',
    url: 'https://mkprotocol.com',
    siteName: '흐름(Flow)',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Script
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
          strategy="beforeInteractive"
        />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
} 