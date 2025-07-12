import React, { useState, useEffect } from 'react'
import { Search, Filter, ArrowUpDown, ChevronUp, ChevronDown, Eye, MessageSquare, Check, Tags } from 'lucide-react'

const Questions = () => {
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleQuestions, setVisibleQuestions] = useState(3)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const mockQuestions = [
    {
      id: 1,
      title: "How to implement authentication in React?",
      author: "john_dev",
      votes: 15,
      answers: 3,
      views: 234,
      tags: ["react", "authentication", "javascript"],
      timeAgo: "2 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 2,
      title: "Best practices for database optimization?",
      author: "db_expert",
      votes: 8,
      answers: 1,
      views: 156,
      tags: ["database", "optimization", "sql"],
      timeAgo: "4 hours ago",
      hasAcceptedAnswer: false
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox - When to use which?",
      author: "css_ninja",
      votes: 23,
      answers: 5,
      views: 445,
      tags: ["css", "grid", "flexbox"],
      timeAgo: "1 day ago",
      hasAcceptedAnswer: true
    },
    {
      id: 4,
      title: "Node.js performance optimization tips?",
      author: "backend_pro",
      votes: 12,
      answers: 2,
      views: 189,
      tags: ["nodejs", "performance", "optimization"],
      timeAgo: "2 days ago",
      hasAcceptedAnswer: false
    },
    {
      id: 5,
      title: "Understanding async/await in JavaScript",
      author: "js_master",
      votes: 31,
      answers: 7,
      views: 567,
      tags: ["javascript", "async", "promises"],
      timeAgo: "3 days ago",
      hasAcceptedAnswer: true
    },
    {
      id: 6,
      title: "Docker containerization best practices",
      author: "devops_guru",
      votes: 19,
      answers: 4,
      views: 298,
      tags: ["docker", "containerization", "devops"],
      timeAgo: "4 days ago",
      hasAcceptedAnswer: true
    }
  ]

  const allTags = ["react", "javascript", "css", "database", "sql", "authentication", "optimization", "grid", "flexbox", "nodejs", "performance", "async", "promises", "docker", "containerization", "devops"]

  useEffect(() => {
    setIsLoaded(true)
    
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        setVisibleQuestions(prev => Math.min(prev + 3, mockQuestions.length))
      }
    }

    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showFilterDropdown])

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredQuestions = mockQuestions.filter(q => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => q.tags.includes(tag))
    let matchesFilter = true
    
    switch(filterBy) {
      case 'today':
        matchesFilter = q.timeAgo.includes('hours ago')
        break
      case 'week':
        matchesFilter = q.timeAgo.includes('hours ago') || q.timeAgo.includes('1 day ago')
        break
      case 'month':
        matchesFilter = !q.timeAgo.includes('days ago') || parseInt(q.timeAgo) <= 30
        break
      case 'answered-recently':
        matchesFilter = q.answers > 0 && (q.timeAgo.includes('hours ago') || q.timeAgo.includes('1 day ago'))
        break
      case 'has-accepted':
        matchesFilter = q.hasAcceptedAnswer
        break
      default:
        matchesFilter = true
    }
    
    return matchesTags && matchesFilter
  })

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch(sortBy) {
      case 'votes':
        return b.votes - a.votes
      case 'answers':
        return b.answers - a.answers
      case 'views':
        return b.views - a.views
      case 'newest':
        return new Date(b.timeAgo) - new Date(a.timeAgo)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-4 md:pt-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Sidebar Tags */}
          <div className={`w-full lg:w-64 lg:flex-shrink-0 transform transition-all duration-1000 ${
            isLoaded ? 'translate-x-0 opacity-100' : 'lg:-translate-x-full opacity-0'
          }`}>
            <div className="bg-[#1C1C1E] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Tags className="text-[#007AFF] w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 transform hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? 'bg-[#007AFF] text-white shadow-lg'
                        : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#3C3C3E]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 transform transition-all duration-1000 lg:delay-300 ${
            isLoaded ? 'translate-x-0 opacity-100' : 'lg:translate-x-full opacity-0'
          }`}>
            {/* Filter and Sort Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="text-[#007AFF] w-4 h-4 md:w-5 md:h-5" />
                {sortedQuestions.length} Questions
              </h2>
              <div className="relative filter-dropdown">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-white focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all duration-200 cursor-pointer w-full sm:min-w-[140px] shadow-lg hover:shadow-xl hover:border-[#007AFF]/50 flex items-center justify-between text-sm md:text-base"
                >
                  <span>Filter & Sort</span>
                  <Filter className="w-4 h-4 ml-2" />
                </button>
                
                {showFilterDropdown && (
                  <>
                    {/* Mobile Overlay */}
                    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowFilterDropdown(false)}></div>
                    
                    {/* Filter Dropdown */}
                    <div className="fixed inset-x-4 top-20 bottom-4 md:absolute md:right-0 md:top-full md:mt-2 md:inset-auto md:w-[500px] lg:w-[600px] bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl shadow-2xl z-50 p-4 md:p-6 overflow-y-auto">
                      {/* Mobile Header */}
                      <div className="flex items-center justify-between mb-4 md:hidden">
                        <h2 className="text-white font-semibold text-lg">Filter & Sort</h2>
                        <button 
                          onClick={() => setShowFilterDropdown(false)}
                          className="text-[#8E8E93] hover:text-white p-1"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Filter and Sort Sections Side by Side */}
                      <div className="flex gap-8 mb-6">
                        {/* Filter by Section */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-[#007AFF]" />
                            Filter by
                          </h3>
                          <div className="space-y-2">
                            {[
                              { value: 'all', label: 'All questions' },
                              { value: 'today', label: 'Asked Today' },
                              { value: 'week', label: 'Asked This Week' },
                              { value: 'month', label: 'Asked This Month' },
                              { value: 'answered-recently', label: 'Answered Recently' },
                              { value: 'has-accepted', label: 'Has accepted answer' }
                            ].map(filter => (
                              <label key={filter.value} className="flex items-center cursor-pointer hover:bg-[#2C2C2E] p-2 rounded transition-colors">
                                <div className="relative mr-3">
                                  <input
                                    type="radio"
                                    name="filter"
                                    value={filter.value}
                                    checked={filterBy === filter.value}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                    filterBy === filter.value
                                      ? 'border-[#007AFF] bg-[#007AFF]'
                                      : 'border-[#8E8E93] bg-transparent'
                                  }`}>
                                    {filterBy === filter.value && (
                                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[#8E8E93] text-sm">{filter.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      
                        {/* Sorted by Section */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-[#007AFF]" />
                            Sorted by
                          </h3>
                          <div className="space-y-2">
                            {[
                              { value: 'votes', label: 'Votes' },
                              { value: 'answers', label: 'Answers' },
                              { value: 'views', label: 'Views' },
                              { value: 'newest', label: 'Newest' }
                            ].map(sort => (
                              <label key={sort.value} className="flex items-center cursor-pointer hover:bg-[#2C2C2E] p-2 rounded transition-colors">
                                <div className="relative mr-3">
                                  <input
                                    type="radio"
                                    name="sort"
                                    value={sort.value}
                                    checked={sortBy === sort.value}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                    sortBy === sort.value
                                      ? 'border-[#007AFF] bg-[#007AFF]'
                                      : 'border-[#8E8E93] bg-transparent'
                                  }`}>
                                    {sortBy === sort.value && (
                                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[#8E8E93] text-sm">{sort.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2C2C2E]">
                        <button
                          onClick={() => setShowFilterDropdown(false)}
                          className="text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowFilterDropdown(false)}
                          className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 md:space-y-4">
              {sortedQuestions.slice(0, visibleQuestions).map((question, index) => (
                <div 
                  key={question.id}
                  className="bg-[#1C1C1E] rounded-lg p-4 md:p-5 hover:bg-[#1A1A1C] transition-all duration-500 cursor-pointer transform hover:scale-[1.01] hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    {/* Question Title */}
                    <h3 className="text-[#007AFF] font-semibold text-base md:text-lg hover:underline transition-all leading-tight">
                      {question.title}
                    </h3>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm text-[#8E8E93] flex-wrap">
                      <div className="flex items-center gap-1 group">
                        <ChevronUp className="w-3 h-3 group-hover:text-[#34C759] transition-colors" />
                        <span className="font-medium text-white">{question.votes}</span>
                        <ChevronDown className="w-3 h-3 group-hover:text-[#FF3B30] transition-colors" />
                        <span className="ml-1 hidden sm:inline">votes</span>
                      </div>
                      
                      <div className={`flex items-center gap-1 ${
                        question.hasAcceptedAnswer ? 'text-[#34C759]' : ''
                      }`}>
                        {question.hasAcceptedAnswer && <Check className="w-3 h-3" />}
                        <span className="font-medium">{question.answers}</span>
                        <span className="hidden sm:inline">answers</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">{question.views}</span>
                        <span className="hidden sm:inline">views</span>
                      </div>
                    </div>
                    
                    {/* Tags and Author */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {question.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-[#2C2C2E] text-[#8E8E93] px-2 py-1 rounded text-xs hover:bg-[#3C3C3E] transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-[#8E8E93] text-xs md:text-sm whitespace-nowrap">
                        asked {question.timeAgo} by{' '}
                        <span className="text-[#007AFF] hover:underline cursor-pointer">{question.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleQuestions < sortedQuestions.length && (
              <div className="text-center py-8">
                <div className="animate-pulse text-[#8E8E93]">Loading more questions...</div>
              </div>
            )}

            {sortedQuestions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-[#8E8E93] mb-4 mx-auto" />
                <p className="text-[#8E8E93] text-lg">No questions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Questions