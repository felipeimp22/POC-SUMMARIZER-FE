import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MessageSquare, BarChart3, Brain, Sparkles } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  
  const navigation = [
    { 
      name: 'Conversation', 
      href: '/', 
      icon: MessageSquare,
      description: 'Chat with AI'
    },
    { 
      name: 'Summary', 
      href: '/summary', 
      icon: BarChart3,
      description: 'Quick ticket summaries'
    },
  ]

  return (
    <div className="layout-container">
      {/* Animated background particles */}
      <div className="bg-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Main layout */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              {/* Logo */}
              <Link href="/" className="logo-link">
                <div className="logo-container">
                  {/* <div className="logo-icon">
                    <Brain className="brain-icon" />
                  </div> */}
                  {/* <Sparkles className="sparkles-icon" /> */}
                </div>
                <div className="logo-text">
                  <h1 className="logo-title gradient-text">Ticket AI</h1>
                  <p className="logo-subtitle">Intelligent RAG System</p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="navigation">
                {navigation.map((item) => {
                  const isActive = router.pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link key={item.name} href={item.href} className="nav-link">
                      <div className={`nav-item ${isActive ? 'nav-item-active' : ''}`}>
                        <Icon className="nav-icon" />
                        <span className="nav-text">{item.name}</span>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="page-content">
          {children}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <p className="footer-text">Super Intelligent RAG System</p>
              <div className="footer-status">
                <div className="status-dot"></div>
                <span className="status-text">System Online</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .layout-container {
          min-height: 100vh;
          background-color: var(--color-background);
          position: relative;
          overflow: hidden;
        }

        .bg-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(48px);
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .particle-1 {
          top: -1rem;
          left: -1rem;
          width: 18rem;
          height: 18rem;
          background: rgba(var(--color-teal-500-rgb), 0.1);
        }

        .particle-2 {
          top: 33%;
          right: 0;
          width: 24rem;
          height: 24rem;
          background: rgba(var(--color-teal-600-rgb), 0.05);
          animation-delay: 1s;
        }

        .particle-3 {
          bottom: 0;
          left: 33%;
          width: 20rem;
          height: 20rem;
          background: rgba(var(--color-teal-400-rgb), 0.08);
          animation-delay: 2s;
        }

        .main-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .header {
          border-bottom: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
          background: rgba(var(--color-background), 0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }

        .logo-container {
          position: relative;
        }

        .logo-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%);
          border-radius: var(--radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--duration-normal) var(--ease-standard);
        }

        .brain-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: white;
        }

        .sparkles-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: var(--color-teal-400);
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0;
        }

        .logo-subtitle {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          margin: 0;
          margin-top: -0.125rem;
        }

        .navigation {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          position: relative;
          text-decoration: none;
          color: inherit;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-base);
          transition: all var(--duration-normal) var(--ease-standard);
          color: var(--color-gray-300);
        }

        .nav-item-active {
          background: rgba(var(--color-teal-600-rgb), 0.2);
          color: var(--color-teal-300);
          border: 1px solid rgba(var(--color-teal-600-rgb), 0.3);
        }

        .nav-item:hover {
          background: rgba(var(--color-gray-400-rgb), 0.1);
          color: var(--color-teal-300);
        }

        .nav-icon {
          width: 1rem;
          height: 1rem;
        }

        .nav-text {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }

        .page-content {
          flex: 1;
          position: relative;
        }

        .footer {
          border-top: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
          margin-top: auto;
        }

        .footer-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 1rem;
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .footer-text {
          margin: 0;
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #10b981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-text {
          font-size: var(--font-size-sm);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 0.5rem;
          }
          
          .logo-text {
            display: none;
          }
          
          .nav-text {
            display: none;
          }
          
          .nav-item {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}