import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { NoraAvatar } from '../components/AssetComponents';
import { Send, Sparkles, Mic, MicOff, Paperclip, X, Volume2, VolumeX, FileText, Image as ImageIcon } from 'lucide-react';

export default function NoraChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'nora',
      content: "Hey Vineet! 👋 Main Nora hoon, aapki AI fitness & nutrition coach. Ask me anything in English, Hindi, or Hinglish — like \"Nora aaj maine kya kiya?\" or \"Nora 90 second ka timer lagao\"!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [noraState, setNoraState] = useState('idle');
  
  // Voice & Speech State
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const recognitionRef = useRef(null);

  // File Upload Attachment State
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-Speech synthesis output
  const speakText = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanMsg = text.replace(/\[TOOL_CALL:.*?\]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanMsg);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Voice Speech Recognition setup
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Supports Hindi & Hinglish

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          sendMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // File Selector Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB maximum limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      setAttachedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        base64Data,
        isImage: file.type.startsWith('image/'),
      });
    };
    reader.readAsDataURL(file);
  };

  // Execute Controlled Tools
  const executeToolCall = (tc) => {
    if (!tc || !tc.action) return;
    const action = tc.action;
    const path = tc.params?.path;

    if (action === 'navigate' && path) {
      setTimeout(() => navigate(path), 1200);
    } else if (action === 'startWorkout' || action === 'getCurrentWorkout' || action === 'getTodayPlan') {
      setTimeout(() => navigate('/workout'), 1200);
    } else if (action === 'startRestTimer' || action === 'stopTimer') {
      setTimeout(() => navigate('/time'), 1200);
    } else if (action === 'getProgress') {
      setTimeout(() => navigate('/progress'), 1200);
    } else if (action === 'getAttendance') {
      setTimeout(() => navigate('/attendance'), 1200);
    } else if (action === 'logWeight') {
      setTimeout(() => navigate('/weight'), 1200);
    } else if (action === 'logWater' || action === 'logMilk' || action === 'getNutrition') {
      setTimeout(() => navigate('/nutrition'), 1200);
    } else if (action === 'getMessMenu') {
      setTimeout(() => navigate('/mess-menu'), 1200);
    }
  };

  const sendMessage = async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !attachedFile) return;

    const userMsg = {
      role: 'user',
      content: textToSend.trim(),
      attachment: attachedFile ? attachedFile.name : null,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentFile = attachedFile;
    setAttachedFile(null);
    setLoading(true);
    setNoraState('thinking');

    try {
      const payload = {
        message: textToSend.trim(),
      };
      if (currentFile) {
        payload.file = {
          name: currentFile.name,
          type: currentFile.type,
          base64Data: currentFile.base64Data,
        };
      }

      const res = await api.post('/api/ai', payload);
      setNoraState('speaking');

      const noraResponseText = res.response || "I'm having trouble processing right now. Please try again in a moment!";
      setMessages(prev => [...prev, {
        role: 'nora',
        content: noraResponseText,
        toolCalls: res.toolCalls || [],
      }]);

      speakText(noraResponseText);

      if (res.toolCalls && Array.isArray(res.toolCalls)) {
        for (const tc of res.toolCalls) {
          executeToolCall(tc);
        }
      }
    } catch (err) {
      const errorMsg = err?.message || "Nora could not process that request right now.";
      setMessages(prev => [...prev, {
        role: 'nora',
        content: `⚠️ ${errorMsg}`,
      }]);
    }
    setLoading(false);
    setTimeout(() => setNoraState('idle'), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const QUICK_PROMPTS = [
    'Nora aaj maine kya kiya?',
    'Nora workout page kholo',
    'Nora 90 second ka timer lagao',
    'Nora mera weight 56.5 kg log karo',
    'What should I eat in mess today?',
    'Nora Hindi mein baat karo',
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-9rem)] max-w-4xl mx-auto bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] page-enter">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DC] shrink-0">
        <div className="flex items-center gap-3.5">
          <NoraAvatar state={noraState} size={44} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#202124]">Nora Coach</h1>
              <span className="bg-[#EEECFF] text-[#5B55E8] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#E7E4DC] uppercase tracking-wide">Multilingual AI</span>
            </div>
            <p className="text-xs text-[#6B6F76] font-medium">
              {noraState === 'thinking' ? 'Analyzing query...' : noraState === 'speaking' ? 'Formulating response...' : 'Online (EN / HI / Hinglish)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSpeechEnabled(!speechEnabled)}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            speechEnabled ? 'bg-[#EEECFF] text-[#5B55E8] border-[#5B55E8]/30' : 'bg-[#F7F6F2] text-[#6B6F76] border-[#E7E4DC]'
          }`}
          title={speechEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
        >
          {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden sm:inline">{speechEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 shadow-xs text-xs leading-relaxed font-medium ${
              msg.role === 'user'
                ? 'bg-[#5B55E8] text-white rounded-br-sm font-semibold'
                : 'bg-[#F7F6F2] border border-[#E7E4DC] text-[#202124] rounded-bl-sm'
            }`}>
              {msg.role === 'nora' && (
                <div className="flex items-center gap-1.5 text-[#5B55E8] font-bold mb-1.5 text-[11px]">
                  <Sparkles size={13} /> Nora
                </div>
              )}

              {msg.attachment && (
                <div className="mb-2 p-2 rounded-xl bg-white/20 border border-white/30 text-[11px] flex items-center gap-2">
                  <FileText size={14} />
                  <span className="truncate max-w-[200px]">Attached: {msg.attachment}</span>
                </div>
              )}

              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#E7E4DC] flex flex-wrap gap-1">
                  {msg.toolCalls.map((tc, j) => (
                    <span key={j} className="text-[10px] font-bold bg-[#EEECFF] text-[#5B55E8] px-2 py-0.5 rounded-md border border-[#E7E4DC]">
                      ⚡ {tc.action} {tc.params?.path ? `(${tc.params.path})` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F7F6F2] border border-[#E7E4DC] rounded-3xl rounded-bl-sm px-5 py-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#5B55E8] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#5B55E8] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#5B55E8] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Badge */}
      {attachedFile && (
        <div className="mb-2 p-2 bg-[#EEECFF] border border-[#5B55E8]/30 rounded-2xl flex items-center justify-between text-xs text-[#5B55E8] font-bold shrink-0">
          <div className="flex items-center gap-2 truncate">
            {attachedFile.isImage ? <ImageIcon size={16} /> : <FileText size={16} />}
            <span className="truncate">{attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-[#5B55E8]/10 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Quick Prompt Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-3 pt-2 scrollbar-none border-t border-[#E7E4DC] shrink-0">
        {QUICK_PROMPTS.map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F1F0EB] text-[#202124] hover:bg-[#EEECFF] hover:text-[#5B55E8] border border-[#E7E4DC] whitespace-nowrap transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0 pt-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf,.docx,.txt"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-2xl bg-[#F7F6F2] hover:bg-[#F1F0EB] border border-[#E7E4DC] text-[#6B6F76] hover:text-[#202124] transition-all"
          title="Attach image or document (PDF, TXT, DOCX)"
        >
          <Paperclip size={18} />
        </button>

        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-2xl border transition-all ${
            isListening ? 'bg-rose-500 text-white animate-pulse border-rose-600' : 'bg-[#F7F6F2] hover:bg-[#F1F0EB] border-[#E7E4DC] text-[#6B6F76]'
          }`}
          title={isListening ? 'Listening... Click to stop' : 'Speak via Microphone (Hindi/English)'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Nora in English, Hindi, or Hinglish..."
          className="flex-1 px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-semibold text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || (!input.trim() && !attachedFile)}
          className="bg-[#5B55E8] hover:bg-[#4B45D8] text-white font-bold p-3 rounded-2xl shadow-xs disabled:opacity-40 transition-all"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}
