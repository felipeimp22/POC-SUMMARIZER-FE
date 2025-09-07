import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-color-scheme="dark">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Super Intelligent RAG System - AI-Powered Ticket Management" />
        <meta name="theme-color" content="#1f2121" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <body style={{ backgroundColor: 'var(--color-charcoal-700, #1f2121)', color: 'var(--color-gray-200, #f5f5f5)' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}