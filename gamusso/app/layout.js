import './globals.css'

export const metadata = {
  title: '가무소 팬페이지',
  description: '가습기 사무소 아프리카TV 크루 팬페이지',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
