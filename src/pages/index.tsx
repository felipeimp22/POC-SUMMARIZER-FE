import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  isLoading?: boolean
}

const SESSION_ID = 'super-ai-chat-session'
const API_BASE_URL = 'http://localhost:3002'

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: `🧠 **Welcome to Ticket AI!**

I'm your intelligent ticket database assistant. I can help you with:

🔍 **Smart Queries**
• "list all ticket IDs" - Get every ticket identifier
• "find tickets from john@email.com" - Search by customer
• "show open tickets" - Filter by status

📊 **Database Insights**
• "explain how my data structure works" - Complete overview
• "what is a ticketID" - Field explanations

🔄 **Conversation Memory**
• "see more" - Continue from previous results
• I remember our conversation context!

Just ask me anything naturally. What would you like to explore?`,
        sender: 'ai',
        timestamp: new Date(),
      }])
    }
  }, [])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: SESSION_ID,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: data.response || 'Sorry, I encountered an issue processing your request.',
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages(prev => prev.slice(0, -1).concat([aiMessage]))
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: '❌ **Connection Error**\n\nI couldn\'t connect to the Super AI backend. Please make sure:\n\n• The backend server is running on `localhost:3002`\n• Run `npm run dev` in your backend directory\n• Check the console for any errors\n\nTry your message again once the backend is ready!',
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages(prev => prev.slice(0, -1).concat([errorMessage]))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <Bot className="chat-avatar-icon" />
            </div>
            <div className="chat-header-text">
              <h1 className="chat-title">Ticket AI Chat</h1>
              <p className="chat-subtitle">Intelligent conversation with memory</p>
            </div>
            <div className="chat-status">
              <div className="status-indicator"></div>
              <span className="status-text">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="messages-container">
        <div className="messages-content">
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.sender === 'user' ? 'message-user' : 'message-ai'}`}>
              {/* Avatar */}
              <div className={`message-avatar ${message.sender === 'user' ? 'avatar-user' : 'avatar-ai'}`}>
                {message.sender === 'user' ? (
                  <User className="avatar-icon" />
                ) : (
                  <Bot className="avatar-icon" />
                )}
              </div>

              {/* Message content */}
              <div className="message-content">
                <div className={`message-bubble ${message.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  {message.isLoading ? (
                    <div className="typing-container">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <span className="typing-text">Ticket AI is thinking...</span>
                    </div>
                  ) : (
                    <div className="message-text">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                          h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                          p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                          ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                          ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                          li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                          strong: ({node, ...props}) => <strong className="markdown-strong" {...props} />,
                          em: ({node, ...props}) => <em className="markdown-em" {...props} />,
                          code: ({node, ...props}) => <code className="markdown-code" {...props} />,
                          pre: ({node, ...props}) => <pre className="markdown-pre" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`message-timestamp ${message.sender === 'user' ? 'timestamp-user' : 'timestamp-ai'}`}>
                  {message.timestamp.toLocaleTimeString(undefined, { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="input-container">
        <div className="input-content">
          <div className="input-form">
            <div className="textarea-container">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your tickets... (Enter to send, Shift+Enter for new line)"
                className="chat-textarea"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`send-button ${inputValue.trim() && !isLoading ? 'send-button-active' : 'send-button-disabled'}`}
            >
              {isLoading ? (
                <Loader2 className="send-icon spinning" />
              ) : (
                <Send className="send-icon" />
              )}
            </button>
          </div>
          
          {/* Quick suggestions */}
          <div className="suggestions-container">
            {[
              'list all tickets',
              'show open tickets',
              'explain ticketID',
              'how my data structure works'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion)
                  inputRef.current?.focus()
                }}
                className="suggestion-button"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .chat-header {
          flex-shrink: 0;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
        }

        .chat-header-content {
          max-width: 64rem;
          margin: 0 auto;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-avatar-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
        }

        .chat-header-text {
          flex: 1;
        }

        .chat-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0;
        }

        .chat-subtitle {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }

        .status-indicator {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #10b981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-text {
          font-size: var(--font-size-xs);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
        }

        .messages-content {
          max-width: 64rem;
          margin: 0 auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          animation: messageSlideUp 0.4s ease-out forwards;
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: var(--radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-user {
          background-color: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-gray-300);
        }

        .avatar-ai {
          background: linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-teal-600) 100%);
          color: white;
        }

        .avatar-icon {
          width: 1rem;
          height: 1rem;
        }

        .message-content {
          flex: 1;
          max-width: 48rem;
        }

        .message-user .message-content {
          text-align: right;
        }

        .message-bubble {
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .bubble-user {
          background: linear-gradient(135deg, rgba(var(--color-teal-600-rgb), 0.2) 0%, rgba(var(--color-teal-700-rgb), 0.2) 100%);
          border: 1px solid rgba(var(--color-teal-600-rgb), 0.3);
          margin-left: auto;
        }

        .bubble-ai {
          background: linear-gradient(135deg, rgba(var(--color-slate-500-rgb), 0.1) 0%, rgba(var(--color-charcoal-800), 0.8) 100%);
          border: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
        }

        .typing-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .typing-text {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        .message-text {
          color: var(--color-text);
          line-height: var(--line-height-normal);
        }

        .message-user .message-text {
          text-align: right;
        }

        .message-timestamp {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          margin-top: 0.5rem;
          padding: 0 0.5rem;
        }

        .timestamp-user {
          text-align: right;
        }

        .timestamp-ai {
          text-align: left;
        }

        .input-container {
          flex-shrink: 0;
          border-top: 1px solid rgba(var(--color-gray-400-rgb), 0.3);
          background: rgba(var(--color-background), 0.8);
          backdrop-filter: blur(12px);
        }

        .input-content {
          max-width: 64rem;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .input-form {
          display: flex;
          align-items: end;
          gap: 1rem;
        }

        .textarea-container {
          flex: 1;
        }

        .chat-textarea {
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-base);
          padding: 0.75rem 1rem;
          color: var(--color-text);
          font-size: var(--font-size-base);
          font-family: var(--font-family-base);
          line-height: var(--line-height-normal);
          resize: none;
          min-height: 3.25rem;
          max-height: 7.5rem;
          transition: all var(--duration-normal) var(--ease-standard);
        }

        .chat-textarea::placeholder {
          color: var(--color-text-secondary);
        }

        .chat-textarea:focus {
          outline: none;
          box-shadow: var(--focus-ring);
          border-color: var(--color-primary);
        }

        .chat-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-button {
          padding: 0.75rem;
          border-radius: var(--radius-base);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-normal) var(--ease-standard);
          min-height: 3.25rem;
          min-width: 3.25rem;
        }

        .send-button-active {
          background: var(--color-primary);
          color: var(--color-btn-primary-text);
          transform: scale(1);
        }

        .send-button-active:hover {
          background: var(--color-primary-hover);
          transform: scale(1.05);
        }

        .send-button-active:active {
          transform: scale(0.95);
        }

        .send-button-disabled {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text-secondary);
          cursor: not-allowed;
        }

        .send-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .suggestions-container {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .suggestion-button {
          padding: 0.25rem 0.75rem;
          font-size: var(--font-size-xs);
          background: rgba(var(--color-gray-400-rgb), 0.1);
          color: var(--color-gray-300);
          border: 1px solid rgba(var(--color-gray-400-rgb), 0.2);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .suggestion-button:hover {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text);
        }

        .suggestion-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Markdown styles */
        .markdown-h1 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          margin-bottom: 0.75rem;
        }

        .markdown-h2 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .markdown-h3 {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .markdown-p {
          color: var(--color-text);
          margin-bottom: 0.5rem;
          line-height: var(--line-height-normal);
        }

        .markdown-ul {
          list-style-type: disc;
          list-style-position: inside;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .markdown-ol {
          list-style-type: decimal;
          list-style-position: inside;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .markdown-li {
          color: var(--color-text);
          margin-bottom: 0.25rem;
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
          padding: 0.125rem 0.25rem;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          font-family: var(--font-family-mono);
        }

        .markdown-pre {
          background: rgba(var(--color-gray-400-rgb), 0.2);
          color: var(--color-text);
          padding: 0.75rem;
          border-radius: var(--radius-base);
          overflow-x: auto;
          margin-bottom: 0.5rem;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes messageSlideUp {
          0% {
            opacity: 0;
            transform: translateY(var(--space-20)) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 1rem;
          }
          
          .messages-content {
            padding: 1rem;
          }
          
          .input-content {
            padding: 1rem;
          }
          
          .message-bubble {
            padding: 0.75rem 1rem;
          }
          
          .suggestions-container {
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}