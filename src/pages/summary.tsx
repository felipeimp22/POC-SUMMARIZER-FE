import React, { useState, useEffect } from 'react'
import { Search, FileText, Clock, Calendar, Tag, AlertCircle, CheckCircle, Loader2, BarChart3, TrendingUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SummaryData {
  success: boolean
  identifier: string
  ticket?: {
    ticketID: number
    ticketNumber: string
  }
  summary: string
  conversationLength: number
  attachmentCount: number
  timestamp: string
  error?: string
  message?: string
}

const API_BASE_URL = 'http://localhost:3002'

export default function SummaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  const fetchSummary = async (identifier: string) => {
    if (!identifier.trim()) return

    setIsLoading(true)
    setSummaryData(null)

    try {
      const response = await fetch(`${API_BASE_URL}/summarize/${encodeURIComponent(identifier.trim())}`)
      const data = await response.json()
      
      setSummaryData(data)
      
      if (data.success) {
        saveRecentSearch(identifier.trim())
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
      setSummaryData({
        success: false,
        identifier: identifier.trim(),
        summary: '',
        conversationLength: 0,
        attachmentCount: 0,
        timestamp: new Date().toISOString(),
        error: 'Connection failed',
        message: 'Could not connect to the backend server. Make sure it\'s running on localhost:3002'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchSummary(searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const quickExamples = [
    { id: '13000020', type: 'Ticket ID' },
    { id: '2025090610000020', type: 'Ticket Number' },
    { id: '13000025', type: 'Ticket ID' },
  ]

  return (
    <div className="summary-container">
      {/* Header Section */}
      <div className="summary-header">
        <div className="summary-header-content">
          <div className="summary-title-section">
            <div className="summary-icon-container">
              <div className="summary-icon">
                <BarChart3 className="summary-icon-svg" />
              </div>
              <div className="summary-title-text">
                <h1 className="summary-title gradient-text">Quick Summary</h1>
                <p className="summary-subtitle">Get instant ticket insights</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-form">
                <div className="search-input-container">
                  {/* <Search className="search-input-icon" /> */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Ticket ID, Ticket Number, or Entity Key..."
                    className="search-input"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isLoading}
                  className={`search-button ${searchQuery.trim() && !isLoading ? 'search-button-active' : 'search-button-disabled'}`}
                >
                  {isLoading ? (
                    <Loader2 className="search-button-icon spinning" />
                  ) : (
                    <>
                      <Search className="search-button-icon" />
                      <span className="search-button-text">Summarize</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Examples */}
              <div className="examples-section">
                <p className="examples-label">Quick examples:</p>
                <div className="examples-buttons">
                  {quickExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => {
                        setSearchQuery(example.id)
                        fetchSummary(example.id)
                      }}
                      className="example-button"
                      disabled={isLoading}
                    >
                      <Tag className="example-icon" />
                      <span className="example-id">{example.id}</span>
                      <span className="example-type">({example.type})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="recent-section">
                  <p className="recent-label">Recent searches:</p>
                  <div className="recent-buttons">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search)
                          fetchSummary(search)
                        }}
                        className="recent-button"
                        disabled={isLoading}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-container">
        <div className="results-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-icon-container">
                <Loader2 className="loading-icon spinning" />
              </div>
              <h3 className="loading-title">Analyzing Ticket</h3>
              <p className="loading-subtitle">Creating intelligent summary...</p>
            </div>
          ) : summaryData ? (
            <div className="results-wrapper">
              {summaryData.success ? (
                <>
                  {/* Summary Header */}
                  <div className="result-header grok-surface">
                    <div className="result-header-content">
                      <div className="result-status">
                        <div className="success-icon-container">
                          <CheckCircle className="success-icon" />
                        </div>
                        <div className="result-status-text">
                          <h2 className="result-title">Summary Generated</h2>
                          <p className="result-subtitle">Ticket analysis complete</p>
                        </div>
                      </div>
                      <div className="result-timestamp">
                        <div className="timestamp-content">
                          <Clock className="timestamp-icon" />
                          <span className="timestamp-text">{new Date(summaryData.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Info */}
                    {summaryData.ticket && (
                      <div className="ticket-info-grid">
                        <div className="info-card">
                          <div className="info-card-header">
                            <FileText className="info-card-icon" />
                            <span className="info-card-label">Ticket ID</span>
                          </div>
                          <p className="info-card-value">{summaryData.ticket.ticketID}</p>
                        </div>
                        <div className="info-card">
                          <div className="info-card-header">
                            <Calendar className="info-card-icon" />
                            <span className="info-card-label">Ticket Number</span>
                          </div>
                          <p className="info-card-value info-card-mono">{summaryData.ticket.ticketNumber}</p>
                        </div>
                        <div className="info-card">
                          <div className="info-card-header">
                            <TrendingUp className="info-card-icon" />
                            <span className="info-card-label">Activity</span>
                          </div>
                          <p className="info-card-activity">
                            {summaryData.conversationLength} messages, {summaryData.attachmentCount} attachments
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Content */}
                  <div className="summary-content grok-surface">
                    <div className="summary-markdown">
                        <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                /* Error State */
                <div className="error-state grok-surface">
                  <div className="error-content">
                    <div className="error-icon-container">
                      <AlertCircle className="error-icon" />
                    </div>
                    <h3 className="error-title">Summary Not Found</h3>
                    <p className="error-message">
                      {summaryData.message || `No ticket found with identifier: ${summaryData.identifier}`}
                    </p>
                    <div className="error-help">
                      <p className="error-help-title">Try searching with:</p>
                      <ul className="error-help-list">
                        <li>• Ticket ID (e.g., 13000020)</li>
                        <li>• Ticket Number (e.g., 2025090610000020)</li>
                        <li>• Entity Key</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon-container">
                <Search className="empty-icon" />
              </div>
              <h3 className="empty-title">Ready to Summarize</h3>
              <p className="empty-subtitle">Enter a ticket identifier above to get started</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .summary-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .summary-header {
          border-bottom: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
          background: rgba(var(--color-background), 0.8);
          backdrop-filter: blur(12px);
        }

        .summary-header-content {
          max-width: 72rem;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .summary-title-section {
          text-align: center;
        }

        .summary-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .summary-icon {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-icon-svg {
          width: 1.75rem;
          height: 1.75rem;
          color: white;
        }

        .summary-title-text {
          display: flex;
          flex-direction: column;
        }

        .summary-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          margin: 0;
        }

        .summary-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .search-container {
          max-width: 32rem;
          margin: 2rem auto 0;
        }

        .search-form {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .search-input-container {
          flex: 1;
          position: relative;
        }

        .search-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: var(--color-text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-base);
          color: var(--color-text);
          font-size: var(--font-size-lg);
          font-family: var(--font-family-base);
          transition: all var(--duration-normal) var(--ease-standard);
        }

        .search-input::placeholder {
          color: var(--color-text-secondary);
        }

        .search-input:focus {
          outline: none;
          box-shadow: var(--focus-ring);
          border-color: var(--color-primary);
        }

        .search-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-button {
          padding: 1rem 1.5rem;
          border-radius: var(--radius-base);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: var(--font-weight-medium);
          transition: all var(--duration-normal) var(--ease-standard);
          white-space: nowrap;
        }

        .search-button-active {
          background: var(--color-primary);
          color: var(--color-btn-primary-text);
          transform: scale(1);
        }

        .search-button-active:hover {
          background: var(--color-primary-hover);
          transform: scale(1.05);
        }

        .search-button-active:active {
          transform: scale(0.95);
        }

        .search-button-disabled {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text-secondary);
          cursor: not-allowed;
        }

        .search-button-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .search-button-text {
          font-size: var(--font-size-base);
        }

        .examples-section {
          margin-top: 1rem;
        }

        .examples-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 0.75rem 0;
          text-align: center;
        }

        .examples-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        .example-button {
          padding: 0.5rem 1rem;
          background: rgba(var(--color-gray-400-rgb), 0.1);
          color: var(--color-gray-300);
          border: 1px solid rgba(var(--color-gray-400-rgb), 0.2);
          border-radius: var(--radius-base);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--font-size-sm);
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .example-button:hover {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text);
        }

        .example-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .example-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        .example-id {
          font-weight: var(--font-weight-medium);
        }

        .example-type {
          color: var(--color-text-secondary);
        }

        .recent-section {
          margin-top: 1rem;
        }

        .recent-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 0.5rem 0;
          text-align: center;
        }

        .recent-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        .recent-button {
          padding: 0.25rem 0.75rem;
          background: rgba(var(--color-gray-400-rgb), 0.05);
          color: var(--color-text-secondary);
          border: 1px solid rgba(var(--color-gray-400-rgb), 0.1);
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: var(--font-size-xs);
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .recent-button:hover {
          background: rgba(var(--color-gray-400-rgb), 0.1);
          color: var(--color-text);
        }

        .recent-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .results-container {
          flex: 1;
        }

        .results-content {
          max-width: 72rem;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .loading-state {
          text-align: center;
          padding: 3rem 0;
        }

        .loading-icon-container {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .loading-icon {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .loading-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0 0 0.5rem 0;
        }

        .loading-subtitle {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .results-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .result-header {
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .result-header-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .result-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .success-icon-container {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: var(--radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
        }

        .result-status-text {
          display: flex;
          flex-direction: column;
        }

        .result-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0;
        }

        .result-subtitle {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .result-timestamp {
          text-align: right;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .timestamp-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timestamp-icon {
          width: 1rem;
          height: 1rem;
        }

        .timestamp-text {
          white-space: nowrap;
        }

        .ticket-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-card {
          background: rgba(var(--color-gray-400-rgb), 0.05);
          border-radius: var(--radius-base);
          padding: 1rem;
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .info-card-icon {
          width: 1rem;
          height: 1rem;
          color: var(--color-teal-400);
        }

        .info-card-label {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-gray-300);
        }

        .info-card-value {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0;
        }

        .info-card-mono {
          font-family: var(--font-family-mono);
        }

        .info-card-activity {
          font-size: var(--font-size-sm);
          color: var(--color-text);
          margin: 0;
        }

        .summary-content {
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .summary-markdown {
          color: var(--color-text);
          line-height: var(--line-height-normal);
        }

        .error-state {
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .error-content {
          text-align: center;
        }

        .error-icon-container {
          width: 4rem;
          height: 4rem;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .error-icon {
          width: 2rem;
          height: 2rem;
          color: #ef4444;
        }

        .error-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0 0 0.5rem 0;
        }

        .error-message {
          color: var(--color-text-secondary);
          margin: 0 0 1rem 0;
        }

        .error-help {
          background: rgba(var(--color-gray-400-rgb), 0.05);
          border-radius: var(--radius-base);
          padding: 1rem;
          text-align: left;
          max-width: 24rem;
          margin: 0 auto;
        }

        .error-help-title {
          font-size: var(--font-size-sm);
          color: var(--color-gray-300);
          margin: 0 0 0.5rem 0;
        }

        .error-help-list {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 0;
        }

        .empty-icon-container {
          width: 4rem;
          height: 4rem;
          background: rgba(var(--color-gray-400-rgb), 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .empty-icon {
          width: 2rem;
          height: 2rem;
          color: var(--color-text-secondary);
        }

        .empty-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-gray-300);
          margin: 0 0 0.5rem 0;
        }

        .empty-subtitle {
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* Markdown Styles */
        .markdown-h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          margin: 0 0 1rem 0;
          border-bottom: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
          padding-bottom: 0.5rem;
        }

        .markdown-h2 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 1.5rem 0 0.75rem 0;
        }

        .markdown-h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
          margin: 1rem 0 0.5rem 0;
        }

        .markdown-p {
          color: var(--color-text);
          margin: 0 0 0.75rem 0;
          line-height: var(--line-height-normal);
        }

        .markdown-ul {
          list-style-type: disc;
          list-style-position: inside;
          color: var(--color-text);
          margin: 0 0 1rem 1rem;
          padding: 0;
        }

        .markdown-ol {
          list-style-type: decimal;
          list-style-position: inside;
          color: var(--color-text);
          margin: 0 0 1rem 1rem;
          padding: 0;
        }

        .markdown-li {
          color: var(--color-text);
          margin: 0 0 0.5rem 0;
        }

        .markdown-strong {
          font-weight: var(--font-weight-semibold);
          color: var(--color-teal-300);
        }

        .markdown-em {
          font-style: italic;
          color: var(--color-gray-300);
        }

        .markdown-code {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-teal-300);
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          font-family: var(--font-family-mono);
        }

        .markdown-pre {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text);
          padding: 1rem;
          border-radius: var(--radius-base);
          overflow-x: auto;
          margin: 0 0 1rem 0;
        }

        .markdown-blockquote {
          border-left: 4px solid var(--color-teal-500);
          padding-left: 1rem;
          font-style: italic;
          color: var(--color-gray-300);
          margin: 0 0 1rem 0;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .summary-header-content {
            padding: 1.5rem 1rem;
          }
          
          .results-content {
            padding: 1.5rem 1rem;
          }
          
          .search-form {
            flex-direction: column;
            gap: 1rem;
          }
          
          .search-button {
            padding: 0.75rem 1rem;
            justify-content: center;
          }
          
          .result-header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .ticket-info-grid {
            grid-template-columns: 1fr;
          }
          
          .timestamp-content {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}