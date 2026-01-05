
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { GameState, GameSession, DomainOption, AnalogyQuestion } from './types';
import { FAMILIAR_DOMAINS, COMPLEX_DOMAINS, ENABLE_CLOUD_STORAGE, ENABLE_ANALYTICS } from './constants';
import { generateAnalogyQuestions, editMascotImage, generateInitialMascot, generateConceptImage, getKoalaGuide } from './services/geminiService';
import { analytics, AnalyticsEvent } from './services/analyticsService';
import Button from './components/Button';

// --- Audio Decoding Helpers ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Analytics Dashboard Component
const AnalyticsDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const update = () => setEvents(analytics.getEvents());
    update();
    window.addEventListener('playner_analytics_updated', update);
    return () => window.removeEventListener('playner_analytics_updated', update);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 text-slate-300 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Metadata Stream
            </h2>
            <p className="text-xs text-slate-500 font-mono">Capture Node: Playner-v1.0</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-3">
          {events.length === 0 && <div className="text-slate-600 italic">No events recorded yet. Start a mission!</div>}
          {events.map(event => (
            <div key={event.id} className="bg-slate-800/50 p-3 rounded border border-slate-700/50 hover:border-indigo-500/50 transition-colors group">
              <div className="flex justify-between mb-1">
                <span className="text-indigo-400 font-bold">[{event.name}]</span>
                <span className="text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-slate-400 break-all bg-black/20 p-2 rounded mt-1">
                {JSON.stringify(event.properties, null, 2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Bridge Map Component
const BridgeMap: React.FC<{ current: number; total: number; familiar: string; complex: string }> = ({ current, total, familiar, complex }) => {
  return (
    <div className="w-full bg-indigo-50/50 p-4 rounded-3xl mb-8 border border-indigo-100/50 shadow-inner">
      <div className="flex justify-between items-center px-2 mb-2">
        <div className="flex flex-col items-center">
          <span className="text-2xl">🏡</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-indigo-400">{familiar}</span>
        </div>
        <div className="flex-1 flex justify-center gap-2 px-6">
          {Array.from({ length: total }).map((_, i) => (
            <div 
              key={i} 
              className={`h-4 flex-1 rounded-full transition-all duration-500 ${
                i < current ? 'bg-indigo-500 shadow-md translate-y-[-2px]' : 
                i === current ? 'bg-indigo-200 animate-pulse border-2 border-indigo-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">🚀</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{complex}</span>
        </div>
      </div>
    </div>
  );
};

// Screens
const HomeScreen: React.FC<{ onStart: () => void; onCustomize: () => void }> = ({ onStart, onCustomize }) => {
  useEffect(() => {
    analytics.track("page_view", { screen: "home" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl float">🧠</div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-xl shadow-lg">✨</div>
      </div>
      <h1 className="text-5xl font-bold mb-4 text-slate-900 tracking-tight">Playner</h1>
      <p className="text-xl text-slate-600 mb-10 max-w-md font-medium">Learn new ideas by playing what you already know. Master complex concepts through playful analogies.</p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button onClick={onStart} size="lg" className="w-full">Start a Mission</Button>
        <Button onClick={onCustomize} size="lg" variant="outline" className="w-full">Create Mascot</Button>
      </div>
    </div>
  );
};

const SetupScreen: React.FC<{ onConfirm: (f: DomainOption, c: DomainOption, g: string) => void; onBack: () => void; }> = ({ onConfirm, onBack }) => {
  const [familiar, setFamiliar] = useState<DomainOption | null>(null);
  const [complex, setComplex] = useState<DomainOption | null>(null);
  const [goal, setGoal] = useState<string>("");
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    if (familiar && complex && goal) {
      analytics.track("mission_config_confirmed", { familiar: familiar.label, complex: complex.label, goal });
      onConfirm(familiar, complex, goal);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Build Your Analogy</h2>
        <div className="flex justify-center gap-2 mt-4">
           {[1, 2, 3].map(s => (
             <div key={s} className={`h-2 w-12 rounded-full transition-all duration-300 ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />
           ))}
        </div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Step 1: Choose what you already know</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAMILIAR_DOMAINS.map(d => (
              <div key={d.id} onClick={() => { setFamiliar(d); setStep(2); }} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${familiar?.id === d.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                <span className="text-4xl mb-2">{d.icon}</span>
                <div className="font-bold text-slate-800 text-lg">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button onClick={() => setStep(1)} className="text-indigo-600 font-bold text-sm mb-4 hover:underline">← Change Starting Point</button>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Step 2: Choose what you want to learn</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLEX_DOMAINS.map(d => (
              <div key={d.id} onClick={() => { setComplex(d); setStep(3); }} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${complex?.id === d.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                <span className="text-4xl mb-2">{d.icon}</span>
                <div className="font-bold text-slate-800 text-lg">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-500">
          <button onClick={() => setStep(2)} className="text-indigo-600 font-bold text-sm mb-4 hover:underline">← Change Subject</button>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Step 3: Define your Mission Goal</h3>
          <div className="space-y-3 mb-8">
            {complex?.suggestedGoals?.map((suggested, idx) => (
              <button key={idx} onClick={() => setGoal(suggested)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${goal === suggested ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>{suggested}</button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky bottom-4">
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
        <Button variant="primary" disabled={!familiar || !complex || !goal} onClick={handleFinish}>Start Quiz</Button>
      </div>
    </div>
  );
};

const QuizScreen: React.FC<{ 
  question: AnalogyQuestion;
  index: number;
  total: number;
  goal: string;
  familiarIcon: string;
  onAnswer: (answer: string) => void;
  onImageGenerated: (url: string) => void;
}> = ({ question, index, total, goal, familiarIcon, onAnswer, onImageGenerated }) => {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [koalaUrl, setKoalaUrl] = useState<string | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    getKoalaGuide().then(setKoalaUrl);
    setSelectedOpt(null);
    setIsSubmitted(false);
  }, [index]);

  useEffect(() => {
    if (question.imagePrompt && !question.imageUrl) {
      setIsImageLoading(true);
      generateConceptImage(question.imagePrompt).then(url => {
        if (url) onImageGenerated(url);
        setIsImageLoading(false);
      });
    }
  }, [question.id]);

  const handleConfirmSubmit = () => {
    if (!selectedOpt || isSubmitted) return;
    setIsSubmitted(true);
    setTimeout(() => onAnswer(selectedOpt), 1800);
  };

  const correctIdx = question.options.indexOf(question.correctAnswer);
  const correctBtn = optionRefs.current[correctIdx];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 relative pb-32">
      <BridgeMap 
        current={index} 
        total={total} 
        familiar={familiarIcon} 
        complex="🏆" 
      />

      <div className="mb-6 relative aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
        {isImageLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
        {question.imageUrl && <img src={question.imageUrl} className="w-full h-full object-cover animate-in fade-in" />}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 mb-8 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed relative z-10">{question.question}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 relative mb-12">
        {question.options.map((opt, i) => (
          <button
            key={i}
            // Fix: Wrapping the ref callback in braces ensures it returns void, fixing the TS error.
            ref={el => { optionRefs.current[i] = el; }}
            disabled={isSubmitted}
            onClick={() => setSelectedOpt(opt)}
            className={`p-6 text-left rounded-2xl border-2 transition-all font-semibold text-slate-700 shadow-sm flex items-center gap-4 ${
              selectedOpt === opt ? 'border-indigo-600 bg-indigo-50 scale-[1.02]' : 'border-slate-100 bg-white hover:border-indigo-400'
            }`}
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOpt === opt ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        ))}

        {isSubmitted && koalaUrl && correctBtn && (
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-48 h-48 animate-in slide-in-from-left-20 fade-in duration-500 z-50 pointer-events-none">
            <img src={koalaUrl} className="w-full h-full object-contain" />
            <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
              <line x1="80%" y1="50%" x2="150%" y2={`${(correctIdx - (question.options.length/2)) * 80 + 100}%`} stroke="rgba(99, 102, 241, 0.8)" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
            </svg>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t z-[40] flex justify-center">
        <Button onClick={handleConfirmSubmit} disabled={!selectedOpt || isSubmitted} isLoading={isSubmitted} size="lg" className="w-full max-w-sm">
          {isSubmitted ? "Analyzing Bridge..." : "Confirm Choice"}
        </Button>
      </div>
    </div>
  );
};

const RevealScreen: React.FC<{
  question: AnalogyQuestion;
  selectedAnswer: string;
  onNext: () => void;
}> = ({ question, selectedAnswer, onNext }) => {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Speak the explanation using Gemini TTS
    const speakExplanation = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        setIsSpeaking(true);
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Say encouragingly: ${isCorrect ? "Spot on!" : "Not quite, but here is the bridge."} ${question.explanation}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContextRef.current, 24000, 1);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.onended = () => setIsSpeaking(false);
          source.start();
        } else {
          setIsSpeaking(false);
        }
      } catch (e) {
        console.error("TTS failed", e);
        setIsSpeaking(false);
      }
    };
    speakExplanation();
  }, [isCorrect, question.explanation]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in zoom-in">
      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg ${isCorrect ? 'bg-green-100' : 'bg-rose-100'}`}>{isCorrect ? '✅' : '❌'}</div>
      <h2 className="text-4xl font-bold mb-2">{isCorrect ? 'Correct!' : 'Almost There!'}</h2>
      <p className="text-slate-500 mb-8">The correct answer was: <span className="text-indigo-600 font-bold">{question.correctAnswer}</span></p>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border text-left mb-8 relative">
        <div className="flex items-center gap-2 mb-4">
           <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-indigo-500 animate-ping' : 'bg-slate-300'}`}></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mentor Insight</span>
        </div>
        <p className="text-lg text-slate-700 leading-relaxed italic mb-6">"{question.explanation}"</p>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100"><p className="text-amber-800 text-sm font-medium"><span className="font-bold mr-2 uppercase">Pro Tip:</span> {question.fact}</p></div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">Continue Mission</Button>
    </div>
  );
};

const SummaryScreen: React.FC<{ session: GameSession; onReset: () => void }> = ({ session, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="text-9xl mb-4">🏆</div>
      <h1 className="text-4xl font-bold mb-2">Mission Accomplished!</h1>
      <p className="text-slate-500 font-medium px-4 mb-10 italic">"I now understand how to {session.goal.toLowerCase()}!"</p>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><div className="text-sm font-bold text-slate-400">Score</div><div className="text-4xl font-bold text-indigo-600">{session.score}/{session.questions.length}</div></div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><div className="text-sm font-bold text-slate-400">Yield</div><div className="text-4xl font-bold text-amber-500">{Math.round((session.score/session.questions.length)*100)}%</div></div>
      </div>
      <Button onClick={onReset} size="lg" className="w-full">New Mission</Button>
    </div>
  );
};

const MascotScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mascotUrl, setMascotUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const url = await generateInitialMascot(prompt);
    setMascotUrl(url);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="flex items-center gap-4 mb-8"><Button variant="ghost" onClick={onBack}>← Back</Button><h2 className="text-3xl font-bold">Design Your Mascot</h2></div>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border mb-8">
        {!mascotUrl ? <div className="aspect-square bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed mb-6 text-slate-400">Your creation will appear here</div> : <img src={mascotUrl} className="w-full aspect-square object-cover rounded-[2.5rem] mb-6 shadow-xl" />}
        {!mascotUrl ? (
          <div className="space-y-4">
            <input type="text" placeholder="e.g. A robotic brain wearing sunglasses..." className="w-full p-4 rounded-2xl bg-slate-50 border-2 outline-none" value={prompt} onChange={e => setPrompt(e.target.value)} />
            <Button onClick={handleCreate} isLoading={isLoading} className="w-full">Generate Mascot</Button>
          </div>
        ) : <Button onClick={() => setMascotUrl(null)} variant="outline">New Mascot</Button>}
      </div>
      <Button onClick={onBack} variant="primary" className="w-full">Finish Designing</Button>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>(GameState.HOME);
  const [loading, setLoading] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [session, setSession] = useState<GameSession>({
    familiarDomain: null,
    complexDomain: null,
    goal: "",
    questions: [],
    currentIndex: 0,
    score: 0,
    history: []
  });
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<string>('');

  const setupGame = async (f: DomainOption, c: DomainOption, g: string) => {
    setLoading(true);
    const questions = await generateAnalogyQuestions(f.label, c.label, g);
    if (questions.length > 0) {
      setSession({ familiarDomain: f, complexDomain: c, goal: g, questions, currentIndex: 0, score: 0, history: [] });
      setState(GameState.QUIZ);
    }
    setLoading(false);
  };

  const submitAnswer = (answer: string) => {
    setLastSelectedAnswer(answer);
    const isCorrect = answer === session.questions[session.currentIndex].correctAnswer;
    setSession(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      history: [...prev.history, { questionId: session.questions[session.currentIndex].id, answer, isCorrect }]
    }));
    setState(GameState.REVEAL);
  };

  const nextQuestion = () => {
    if (session.currentIndex + 1 < session.questions.length) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
      setState(GameState.QUIZ);
    } else {
      setState(GameState.SUMMARY);
    }
  };

  const resetGame = () => {
    setState(GameState.HOME);
    setSession({ familiarDomain: null, complexDomain: null, goal: "", questions: [], currentIndex: 0, score: 0, history: [] });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 flex flex-col">
      <AnalyticsDashboard isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
      <nav className="p-4 md:px-8 flex items-center justify-between border-b bg-white/80 backdrop-blur sticky top-0 z-[60]">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetGame}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md border-b-4 border-indigo-800">🧠</div>
          <span className="brand-font text-2xl font-bold text-slate-800">Playner</span>
        </div>
        <div className="flex items-center gap-2">
          {ENABLE_ANALYTICS && <button onClick={() => setIsAnalyticsOpen(true)} className="p-2 text-slate-400 hover:text-indigo-600">📊</button>}
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden"><img src="https://picsum.photos/seed/user/100/100" /></div>
        </div>
      </nav>

      <main className="container mx-auto flex-1">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in">
             <div className="w-20 h-20 bg-indigo-100 rounded-3xl mb-6 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
             <h2 className="text-2xl font-bold mb-2">Building Your Analogy Bridge...</h2>
          </div>
        ) : (
          <>
            {state === GameState.HOME && <HomeScreen onStart={() => setState(GameState.SETUP)} onCustomize={() => setState(GameState.MASCOT_EDIT)} />}
            {state === GameState.SETUP && <SetupScreen onConfirm={setupGame} onBack={() => setState(GameState.HOME)} />}
            {state === GameState.QUIZ && session.questions.length > 0 && <QuizScreen question={session.questions[session.currentIndex]} index={session.currentIndex} total={session.questions.length} goal={session.goal} familiarIcon={session.familiarDomain?.icon || '💡'} onAnswer={submitAnswer} onImageGenerated={(url) => setSession(prev => { const n = [...prev.questions]; n[prev.currentIndex].imageUrl = url; return {...prev, questions: n}; })} />}
            {state === GameState.REVEAL && <RevealScreen question={session.questions[session.currentIndex]} selectedAnswer={lastSelectedAnswer} onNext={nextQuestion} />}
            {state === GameState.SUMMARY && <SummaryScreen session={session} onReset={resetGame} />}
            {state === GameState.MASCOT_EDIT && <MascotScreen onBack={() => setState(GameState.HOME)} />}
          </>
        )}
      </main>
      <footer className="text-center text-slate-300 text-xs py-8 mt-auto font-medium tracking-widest uppercase">&copy; 2024 Playner Analogical Engine.</footer>
    </div>
  );
}
