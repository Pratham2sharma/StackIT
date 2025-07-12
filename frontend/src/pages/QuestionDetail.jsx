import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronUp, ChevronDown, Eye, MessageSquare, Check, Calendar, Clock } from 'lucide-react'
import { Editor } from '@tinymce/tinymce-react'
import useQuestionStore from '../store/questionStore'
import useAuthStore from '../store/authStore'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'

const QuestionDetail = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { getQuestionById, upvoteQuestion, downvoteQuestion, addAnswer } = useQuestionStore()
  const { user } = useAuthStore()

  // Mock question data
  const mockQuestion = {
    id: 1,
    title: "How to implement authentication in React?",
    description: `I'm building a React application and need to implement user authentication. I want to handle login, logout, and protect certain routes from unauthorized access.

What are the best practices for implementing authentication in React? Should I use Context API, Redux, or some other state management solution?

Here's what I've tried so far:

\`\`\`javascript
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  
  const login = async (email, password) => {
    // Login logic here
  }
  
  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  )
}
\`\`\`

But I'm not sure if this is the right approach. Any suggestions?`,
    author: "john_dev",
    authorAvatar: "JD",
    votes: 15,
    answers: 3,
    views: 234,
    tags: ["react", "authentication", "javascript"],
    askedDate: "today",
    modifiedDate: "today",
    hasAcceptedAnswer: true
  }

  const mockAnswers = [
    {
      id: 1,
      content: `<p>For React authentication, I recommend using a combination of Context API and JWT tokens. Here's a robust approach:</p>

<h2>1. Create an Auth Context</h2>

<pre><code class="language-javascript">import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and set user
      verifyToken(token)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
</code></pre>

<p><strong>This approach gives you a clean, scalable authentication system.</strong></p>`,
      author: "react_expert",
      authorAvatar: "RE",
      votes: 12,
      createdAt: "2024-01-15T10:30:00Z",
      isAccepted: true
    }
  ]

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const fetchedQuestion = await getQuestionById(id)
        if (fetchedQuestion) {
          setQuestion(fetchedQuestion)
          setAnswers(fetchedQuestion.answers || [])
        } else {
          // Fallback to mock data if question not found
          setQuestion(mockQuestion)
          setAnswers(mockAnswers)
        }
      } catch (error) {
        console.error('Error fetching question:', error)
        // Fallback to mock data on error
        setQuestion(mockQuestion)
        setAnswers(mockAnswers)
      }
      setIsLoaded(true)
    }
    
    fetchQuestion()
  }, [id, getQuestionById])

  useEffect(() => {
    // Highlight code blocks after content loads
    Prism.highlightAll()
  }, [question, answers])

  const formatContent = (content) => {
    // Convert markdown-style code blocks to HTML with Prism classes
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript'
        return `<pre class="language-${language}"><code class="language-${language}">${code.trim()}</code></pre>`
      })
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\n/g, '<br>')
  }

  const handleVote = async (type, targetType, targetId) => {
    if (!user) {
      alert('Please login to vote')
      return
    }
    
    try {
      if (targetType === 'question') {
        if (type === 'up') {
          await upvoteQuestion(targetId)
        } else {
          await downvoteQuestion(targetId)
        }
        // Refresh question data
        const updatedQuestion = await getQuestionById(id)
        if (updatedQuestion) setQuestion(updatedQuestion)
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return
    if (!user) {
      alert('Please login to answer')
      return
    }
    
    try {
      await addAnswer(id, newAnswer)
      setNewAnswer('')
      // Refresh question data to get updated answers
      const updatedQuestion = await getQuestionById(id)
      if (updatedQuestion) {
        setQuestion(updatedQuestion)
        setAnswers(updatedQuestion.answers || [])
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    }
  }

  if (!question) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-4 md:pt-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link to="/questions" className="text-[#007AFF] hover:underline">
              ← Back to Questions
            </Link>
          </div>

          {/* Question Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {question.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8E8E93] mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Asked {question.askedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Modified {question.modifiedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Viewed {question.views} times</span>
              </div>
            </div>
            
            <hr className="border-[#2C2C2E]" />
          </div>

          {/* Question Content */}
          <div className="flex gap-6 mb-8">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <button 
                onClick={() => handleVote('up', 'question', question.id)}
                className="p-3 rounded-full hover:bg-[#2C2C2E] transition-colors group"
              >
                <ChevronUp className="w-10 h-10 text-[#8E8E93] group-hover:text-[#34C759]" />
              </button>
              
              <span className="text-3xl font-bold text-white">
                {(question.votes?.upvotes?.length || 0) - (question.votes?.downvotes?.length || 0)}
              </span>
              
              <button 
                onClick={() => handleVote('down', 'question', question.id)}
                className="p-3 rounded-full hover:bg-[#2C2C2E] transition-colors group"
              >
                <ChevronDown className="w-10 h-10 text-[#8E8E93] group-hover:text-[#FF3B30]" />
              </button>
            </div>

            {/* Question Description */}
            <div className="flex-1">
              <div className="bg-[#1C1C1E] rounded-lg p-6 mb-4">
                <div 
                  className="text-white leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(question.description) }}
                />
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-[#2C2C2E] text-[#8E8E93] px-3 py-1 rounded text-sm hover:bg-[#3C3C3E] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Author Info */}
              <div className="flex justify-end">
                <div className="bg-[#1C1C1E] rounded-lg p-3 text-sm">
                  <div className="text-[#8E8E93] mb-1">
                asked {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : question.askedDate}
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {question.authorAvatar}
                    </div>
                    <span className="text-[#007AFF] hover:underline cursor-pointer">
                  {question.author?.name || question.author}
                </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-[#007AFF] w-5 h-5" />
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>

            {answers.map((answer, index) => (
              <div key={answer.id} className={`flex gap-6 mb-6 ${index !== answers.length - 1 ? 'border-b border-[#2C2C2E] pb-6' : ''}`}>
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <button 
                    onClick={() => handleVote('up', 'answer', answer.id)}
                    className="p-2 rounded-full hover:bg-[#2C2C2E] transition-colors group"
                  >
                    <ChevronUp className="w-8 h-8 text-[#8E8E93] group-hover:text-[#34C759]" />
                  </button>
                  
                  <span className="text-2xl font-bold text-white">{answer.votes}</span>
                  
                  <button 
                    onClick={() => handleVote('down', 'answer', answer.id)}
                    className="p-2 rounded-full hover:bg-[#2C2C2E] transition-colors group"
                  >
                    <ChevronDown className="w-8 h-8 text-[#8E8E93] group-hover:text-[#FF3B30]" />
                  </button>
                  
                  {answer.isAccepted && (
                    <Check className="w-8 h-8 text-[#34C759] mt-2" />
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="bg-[#1C1C1E] rounded-lg p-6 mb-4">
                    <div 
                      className="text-white leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                  </div>
                  
                  {/* Answer Author Info */}
                  <div className="flex justify-end">
                    <div className="bg-[#1C1C1E] rounded-lg p-3 text-sm">
                      <div className="text-[#8E8E93] mb-1">answered {new Date(answer.createdAt).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {answer.authorAvatar}
                        </div>
                        <span className="text-[#007AFF] hover:underline cursor-pointer">{answer.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Answer Form */}
          <div className="bg-[#1C1C1E] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Answer</h3>
            
            {user ? (
              <>
                <div className="mb-4">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={newAnswer}
                    onEditorChange={(content) => setNewAnswer(content)}
                    init={{
                      height: 300,
                      menubar: false,
                      skin: 'oxide-dark',
                      content_css: 'dark',
                      plugins: ['link', 'lists', 'emoticons', 'charmap', 'codesample'],
                      toolbar: 'blocks | bold italic strikethrough | link | numlist bullist | emoticons charmap | codesample',
                      block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
                      content_style: `
                        body { 
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif; 
                          font-size: 14px; 
                          background-color: #1C1C1E; 
                          color: #ffffff; 
                          line-height: 1.6;
                        }
                        h1, h2, h3 { 
                          color: #ffffff; 
                          margin-top: 1.5em; 
                          margin-bottom: 0.5em; 
                        }
                        h1 { font-size: 1.8em; }
                        h2 { font-size: 1.5em; }
                        h3 { font-size: 1.2em; }
                        pre { 
                          background-color: #2C2C2E; 
                          padding: 12px; 
                          border-radius: 6px; 
                          border: 1px solid #3A3A3C;
                          overflow-x: auto;
                        }
                        code {
                          background-color: #2C2C2E;
                          padding: 2px 4px;
                          border-radius: 3px;
                          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        }
                        ul, ol { 
                          padding-left: 1.5em; 
                        }
                        a { 
                          color: #007AFF; 
                        }
                      `
                    }}
                  />
                </div>
                
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim()}
                  className="bg-[#007AFF] hover:bg-[#0056CC] disabled:bg-[#2C2C2E] disabled:text-[#8E8E93] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Post Your Answer
                </button>
              </>
            ) : (
              <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg p-6 text-center">
                <div className="mb-4">
                  <MessageSquare className="w-12 h-12 text-[#8E8E93] mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Want to answer this question?</h4>
                  <p className="text-[#8E8E93] text-sm mb-4">
                    Sign in to share your knowledge and help the community by providing a detailed answer.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link 
                    to="/login" 
                    className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-lg font-medium transition-colors no-underline"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-transparent border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors no-underline"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionDetail