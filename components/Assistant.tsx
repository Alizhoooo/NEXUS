import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, StopCircle } from 'lucide-react';
import { createChatSession, streamChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { CURRENT_USER } from '../constants';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: `Привет, ${CURRENT_USER.name}! Я NEXUS AI. Я могу помочь с аналитикой по задачам, сотрудникам или HR вопросам Kolesa Group.`, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep chat session in ref to maintain context
  const chatSessionRef = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botMsgId,
      role: 'model',
      text: '',
      timestamp: new Date()
    }]);

    try {
      let fullText = '';
      await streamChatMessage(chatSessionRef.current, text, (chunk) => {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, text: "Извините, произошла ошибка при обработке запроса.", isError: true } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900">NEXUS AI Assistant</h3>
                <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-primary-100 text-primary-600'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    } ${msg.isError ? 'border border-red-200 bg-red-50 text-red-600' : ''}`}>
                        {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        ))}
        {isLoading && messages[messages.length - 1].text === '' && (
           <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {messages.length < 3 && !isLoading && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => handleQuickPrompt("Сводка по задачам")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 border border-slate-200 rounded-full text-xs font-medium transition-colors">
                    📊 Сводка по задачам
                </button>
                <button onClick={() => handleQuickPrompt("Риск выгорания")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 border border-slate-200 rounded-full text-xs font-medium transition-colors">
                    ⚠️ Риск выгорания
                </button>
                <button onClick={() => handleQuickPrompt("Отчёт эффективности")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 border border-slate-200 rounded-full text-xs font-medium transition-colors">
                    📈 Отчёт эффективности
                </button>
            </div>
        )}
        <div className="relative">
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Спросите что-нибудь о проектах или сотрудниках..." 
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                disabled={isLoading}
            />
            <button 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg disabled:opacity-50 hover:bg-primary-700 transition-colors"
            >
                {isLoading ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;