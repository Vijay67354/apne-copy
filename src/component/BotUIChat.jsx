import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to NextHire! 👋 I'm here to help you with your job search and career questions.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');

  const quickActions = [
    { id: 'apply', text: 'How to apply for jobs?', icon: Send },
    { id: 'register', text: 'How to create account?', icon: Phone },
    { id: 'search', text: 'How to search jobs?', icon: Clock },
    { id: 'contact', text: 'Contact support', icon: Mail }
  ];

  const responses = {
    apply: "To apply for jobs: 1) Browse jobs on our platform 2) Click on job title 3) Click 'Apply Now' button 4) Fill application form 5) Upload your resume. Make sure your profile is complete!",
    register: "Creating account is easy! 1) Click 'Sign Up' button 2) Enter your email & password 3) Fill basic details 4) Upload your resume 5) Complete your profile. Registration is 100% free!",
    search: "To find perfect jobs: 1) Use search bar with keywords 2) Apply location filters 3) Select job type (full-time, part-time, remote) 4) Filter by salary range 5) Save jobs you like for later!",
    contact: "Need help? Contact our support team: 📧 Email: support@nexthire.com 📞 Phone: +91-9876543210 💬 Live chat available 24/7",
    resume: "Resume tips: Keep it 1-2 pages, use professional format, highlight relevant skills, include quantifiable achievements, proofread carefully. Our resume builder can help!",
    interview: "Interview prep tips: Research the company, practice common questions, prepare your own questions, dress professionally, arrive early, be confident and genuine!",
    salary: "Salary negotiation: Research market rates, know your worth, be prepared to justify your ask, consider total compensation package, be professional in discussions.",
    jobs: "We have 10,000+ active job listings across various industries including IT, Finance, Healthcare, Marketing, Sales, and more. New jobs added daily!",
    profile: "Complete profile tips: Add professional photo, write compelling summary, list all skills, add work experience with achievements, get recommendations from colleagues.",
    default: "Thanks for your question! I'm here to help with job search, applications, career advice, and platform guidance. Feel free to ask anything about NextHire!"
  };

  const handleSendMessage = (text = inputMessage, isQuickAction = false) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response with intelligent keyword matching
    setTimeout(() => {
      let botResponse;
      
      if (isQuickAction) {
        const actionId = quickActions.find(action => action.text === text)?.id;
        botResponse = responses[actionId] || responses.default;
      } else {
        // Smart keyword matching for user queries
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('apply') || lowerText.includes('application')) {
          botResponse = responses.apply;
        } else if (lowerText.includes('register') || lowerText.includes('signup') || lowerText.includes('account')) {
          botResponse = responses.register;
        } else if (lowerText.includes('search') || lowerText.includes('find job')) {
          botResponse = responses.search;
        } else if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('help')) {
          botResponse = responses.contact;
        } else if (lowerText.includes('resume') || lowerText.includes('cv')) {
          botResponse = responses.resume;
        } else if (lowerText.includes('interview')) {
          botResponse = responses.interview;
        } else if (lowerText.includes('salary') || lowerText.includes('negotiate')) {
          botResponse = responses.salary;
        } else if (lowerText.includes('job') || lowerText.includes('vacancy')) {
          botResponse = responses.jobs;
        } else if (lowerText.includes('profile') || lowerText.includes('complete')) {
          botResponse = responses.profile;
        } else {
          botResponse = responses.default;
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action.text, true);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold">NextHire Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Icon */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
};

export default FloatingChatbot;