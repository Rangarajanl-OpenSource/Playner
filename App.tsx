
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameSession, DomainOption, AnalogyQuestion } from './types';
import { FAMILIAR_DOMAINS, COMPLEX_DOMAINS, ENABLE_CLOUD_STORAGE } from './constants';
import { generateAnalogyQuestions, editMascotImage, generateInitialMascot, generateConceptImage, getKoalaGuide } from './services/geminiService';
import Button from './components/Button';

// Screens
const HomeScreen: React.FC<{ onStart: () => void; onCustomize: () => void }> = ({ onStart, onCustomize }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
    <div className="relative mb-8">
      <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl float">
        🧠
      </div>
      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-xl shadow-lg">
        ✨
      </div>
    </div>
    <h1 className="text-5xl font-bold mb-4 text-slate-900 tracking-tight text-shadow">Playner</h1>
    <p className="text-xl text-slate-600 mb-10 max-w-md font-medium">
      Learn new ideas by playing what you already know. 
      Master complex concepts through playful analogies.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
      <Button onClick={onStart} size="lg" className="w-full">Start a Mission</Button>
      <Button onClick={onCustomize} size="lg" variant="outline" className="w-full">Create Mascot</Button>
    </div>
    <p className="mt-8 text-sm text-slate-400 font-medium tracking-wide uppercase">Trusted by curious minds & teachers</p>
  </div>
);

const SetupScreen: React.FC<{ 
  onConfirm: (familiar: DomainOption, complex: DomainOption, goal: string) => void;
  onBack: () => void;
}> = ({ onConfirm, onBack }) => {
  const [familiar, setFamiliar] = useState<DomainOption | null>(null);
  const [complex, setComplex] = useState<DomainOption | null>(null);
  const [goal, setGoal] = useState<string>("");
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    if (familiar && complex && goal) onConfirm(familiar, complex, goal);
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
        {ENABLE_CLOUD_STORAGE && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Cloud Optimization Active
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Step 1: Choose what you already know</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAMILIAR_DOMAINS.map(d => (
              <div 
                key={d.id}
                onClick={() => { setFamiliar(d); setStep(2); }}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                  familiar?.id === d.id ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-4xl mb-2">{d.icon}</span>
                <div className="font-bold text-slate-800 text-lg">{d.label}</div>
                <div className="text-xs text-slate-500">{d.description}</div>
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
              <div 
                key={d.id}
                onClick={() => { setComplex(d); setStep(3); }}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                  complex?.id === d.id ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-4xl mb-2">{d.icon}</span>
                <div className="font-bold text-slate-800 text-lg">{d.label}</div>
                <div className="text-xs text-slate-500">{d.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-500">
          <button onClick={() => setStep(2)} className="text-indigo-600 font-bold text-sm mb-4 hover:underline">← Change Subject</button>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Step 3: Define your Mission Goal</h3>
          <p className="text-slate-600 mb-6">What specific task do you want to be able to do?</p>
          
          <div className="space-y-3 mb-8">
            {complex?.suggestedGoals?.map((suggested, idx) => (
              <button 
                key={idx}
                onClick={() => setGoal(suggested)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  goal === suggested ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                {suggested}
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Or write your own goal..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-4 pr-12 rounded-xl bg-white border-2 border-slate-200 focus:border-indigo-600 outline-none"
            />
            {goal && <div className="absolute right-4 top-4 text-indigo-600">🎯</div>}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky bottom-4">
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
        <div className="hidden md:flex items-center gap-4 text-slate-400 font-medium italic">
          {familiar?.label || '?'} <span className="text-indigo-300 text-xl mx-2">→</span> {complex?.label || '?'}
          {goal && <span className="ml-4 text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs not-italic border border-slate-200">Mission: {goal}</span>}
        </div>
        <Button 
          variant="primary" 
          disabled={!familiar || !complex || !goal}
          onClick={handleFinish}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

const QuizScreen: React.FC<{ 
  question: AnalogyQuestion;
  index: number;
  total: number;
  goal: string;
  onAnswer: (answer: string) => void;
  onImageGenerated: (url: string) => void;
}> = ({ question, index, total, goal, onAnswer, onImageGenerated }) => {
  const isFinalChallenge = index === total - 1;
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [koalaUrl, setKoalaUrl] = useState<string | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    getKoalaGuide().then(setKoalaUrl);
  }, []);

  useEffect(() => {
    if (question.imagePrompt && !question.imageUrl) {
      const fetchImage = async () => {
        setIsImageLoading(true);
        const url = await generateConceptImage(question.imagePrompt);
        if (url) {
          onImageGenerated(url);
        }
        setIsImageLoading(false);
      };
      fetchImage();
    }
  }, [question.id, question.imagePrompt, question.imageUrl]);

  const handleSelect = (opt: string) => {
    setSelectedOpt(opt);
    // Add a small delay for the koala "pointing" effect
    setTimeout(() => {
      onAnswer(opt);
    }, 1200);
  };

  const correctIdx = question.options.indexOf(question.correctAnswer);
  const correctBtn = optionRefs.current[correctIdx];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 relative">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block mb-1 ${isFinalChallenge ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-bounce' : 'bg-indigo-100 text-indigo-700'}`}>
              {isFinalChallenge ? '🔥 FINAL CHALLENGE' : `Bridge Question ${index + 1} of ${total - 1}`}
            </div>
            <div className="text-xs text-slate-400 font-bold block uppercase tracking-tighter">Mission: {goal}</div>
          </div>
          <div className="text-sm font-bold text-indigo-500">
             {isFinalChallenge ? 'Direct Application!' : 'Building the bridge...'}
          </div>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isFinalChallenge ? 'bg-amber-500' : 'bg-indigo-500'}`} 
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6 relative aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generating Visual...</div>
            </div>
          </div>
        )}
        {question.imageUrl ? (
          <img 
            src={question.imageUrl} 
            alt="Visual aid" 
            className="w-full h-full object-cover animate-in fade-in duration-700"
          />
        ) : !isImageLoading && (
          <div className="flex items-center justify-center h-full text-slate-300">
             <div className="text-4xl">📸</div>
          </div>
        )}
      </div>

      <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border-2 mb-8 relative overflow-hidden transition-all ${isFinalChallenge ? 'border-amber-300' : 'border-slate-100'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="text-9xl">{isFinalChallenge ? '🎯' : '💡'}</div>
        </div>
        
        {isFinalChallenge && (
            <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-4 inline-block border border-amber-100">Direct Application</div>
        )}

        <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed relative z-10">
          {question.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 relative">
        {question.options.map((opt, i) => (
          <button
            key={i}
            ref={el => optionRefs.current[i] = el}
            disabled={!!selectedOpt}
            onClick={() => handleSelect(opt)}
            className={`p-6 text-left rounded-2xl border-2 transition-all font-semibold text-slate-700 shadow-sm flex items-center gap-4 group relative overflow-hidden ${
                selectedOpt === opt
                ? 'border-indigo-600 bg-indigo-50 scale-[1.02] ring-4 ring-indigo-100'
                : 'border-slate-100 bg-white hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                selectedOpt === opt 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-200 group-hover:text-indigo-600'
            }`}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}

        {/* Koala Mascot & Laser Effect */}
        {selectedOpt && koalaUrl && correctBtn && (
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-48 h-48 animate-in slide-in-from-left-20 fade-in duration-500 pointer-events-none z-50">
            <img src={koalaUrl} className="w-full h-full object-contain" alt="Koala Guide" />
            <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
              <line 
                x1="80%" y1="50%" 
                x2="150%" y2={`${(correctIdx - (question.options.length/2)) * 80 + 100}%`}
                stroke="rgba(99, 102, 241, 0.8)" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="animate-pulse"
                style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))' }}
              />
            </svg>
            <div className="absolute top-[-10px] left-[-20px] bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-xl text-xs font-bold text-indigo-600 whitespace-nowrap animate-bounce">
              Laser Tag Target! 🎯
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RevealScreen: React.FC<{
  question: AnalogyQuestion;
  selectedAnswer: string;
  index: number;
  total: number;
  onNext: () => void;
}> = ({ question, selectedAnswer, index, total, onNext }) => {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isFinalChallenge = index === total - 1;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in zoom-in duration-300">
      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg ${isCorrect ? 'bg-green-100' : 'bg-rose-100'}`}>
        {isCorrect ? '✅' : '❌'}
      </div>
      <h2 className="text-4xl font-bold mb-2">
        {isCorrect ? 'Correct!' : 'Almost There!'}
      </h2>
      <p className="text-slate-500 mb-8 font-medium">The correct answer was: <span className="text-indigo-600 font-bold">{question.correctAnswer}</span></p>

      {question.imageUrl && (
        <div className="mb-8 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl max-w-sm mx-auto transform hover:rotate-1 transition-transform">
          <img src={question.imageUrl} alt="Review visual" className="w-full aspect-video object-cover" />
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-left mb-8 relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
          <div className="text-9xl">📖</div>
        </div>
        {!isFinalChallenge && (
            <div className="mb-6 flex items-center gap-2 text-indigo-500 font-bold text-sm bg-indigo-50 self-start px-3 py-1 rounded-full border border-indigo-100 w-fit">
              <span className="text-slate-500 font-normal">{question.familiarConcept}</span>
              <span className="opacity-30">is like</span>
              <span>{question.complexConcept}</span>
            </div>
        )}
        
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-widest">
          <span className="text-xl">✨</span> {isFinalChallenge ? 'Mastery Insight' : 'Mapping the Insight'}
        </h3>
        <p className="text-lg text-slate-700 leading-relaxed italic mb-6">
          "{question.explanation}"
        </p>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <p className="text-amber-800 text-sm font-medium">
            <span className="font-bold mr-2 uppercase tracking-tighter">Pro Tip:</span> {question.fact}
          </p>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        {isFinalChallenge ? 'Finish Mission' : 'Next Question'}
      </Button>
    </div>
  );
};

const SummaryScreen: React.FC<{ session: GameSession; onReset: () => void }> = ({ session, onReset }) => {
  const percentage = Math.round((session.score / session.questions.length) * 100);
  const finalCorrect = session.history[session.history.length - 1]?.isCorrect;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="mb-10">
        <div className="text-9xl mb-4">{finalCorrect ? '🥇' : '🏁'}</div>
        <h1 className="text-4xl font-bold mb-2">
          {finalCorrect ? 'Mission Accomplished!' : 'Mission Completed'}
        </h1>
        <p className="text-slate-500 font-medium px-4 italic">
            "I now understand how to {session.goal.toLowerCase()}!"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">Mission Score</div>
          <div className="text-4xl font-bold text-indigo-600">{session.score}/{session.questions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">Knowledge Yield</div>
          <div className="text-4xl font-bold text-amber-500">{percentage}%</div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h3 className="text-lg font-bold text-left px-2">Knowledge Mapping Summary</h3>
        {session.questions.map((q, idx) => (
          <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all hover:translate-x-1 ${idx === session.questions.length - 1 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${session.history[idx]?.isCorrect ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
              {session.history[idx]?.isCorrect ? '✓' : '•'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-800">
                {idx === session.questions.length - 1 ? (
                    <span className="flex items-center gap-1"><span className="text-amber-600">🎯 Final:</span> {session.goal}</span>
                ) : (
                    <>{q.familiarConcept} <span className="mx-2 text-indigo-300">→</span> {q.complexConcept}</>
                )}
              </div>
              <div className="text-xs text-slate-400 line-clamp-1">{q.explanation}</div>
            </div>
            {q.imageUrl && <img src={q.imageUrl} className="w-12 h-8 rounded object-cover border border-slate-200 shrink-0" alt="thumb" />}
          </div>
        ))}
      </div>

      <Button onClick={onReset} size="lg" className="w-full">Start New Mission</Button>
    </div>
  );
};

const MascotScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mascotUrl, setMascotUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const handleCreate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const url = await generateInitialMascot(prompt);
    setMascotUrl(url);
    setIsLoading(false);
  };

  const handleEdit = async () => {
    if (!mascotUrl || !editPrompt) return;
    setIsLoading(true);
    const url = await editMascotImage(mascotUrl.split(',')[1], editPrompt);
    if (url) setMascotUrl(url);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h2 className="text-3xl font-bold">Design Your Mascot</h2>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 mb-8">
        {!mascotUrl ? (
          <div className="aspect-square bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-slate-200 mb-6">
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-2">🎨</div>
              <p className="font-medium">Your creation will appear here</p>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <img src={mascotUrl} alt="Mascot" className="w-full aspect-square object-cover rounded-[2.5rem] shadow-xl mb-6" />
            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-full">Ready to play?</span>
            </div>
          </div>
        )}

        {!mascotUrl ? (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g. A robotic brain wearing sunglasses..." 
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 outline-none font-medium"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <Button onClick={handleCreate} isLoading={isLoading} className="w-full">Generate Mascot</Button>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="text-sm font-bold text-slate-400 uppercase text-left ml-2 mb-2">Refine with text:</div>
            <input 
              type="text" 
              placeholder="e.g. Add a red bowtie, Change to space theme..." 
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 outline-none font-medium"
              value={editPrompt}
              onChange={e => setEditPrompt(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleEdit} isLoading={isLoading} variant="secondary" className="flex-1">Apply Edits</Button>
              <Button onClick={() => setMascotUrl(null)} variant="outline">New Mascot</Button>
            </div>
          </div>
        )}
      </div>

      {mascotUrl && (
        <div className="bg-indigo-600 text-white p-6 rounded-3xl flex items-center justify-between shadow-lg">
          <div className="text-left">
            <div className="font-bold text-lg">Looking good!</div>
            <div className="text-indigo-200 text-sm">Save this as your profile mascot?</div>
          </div>
          <Button onClick={onBack} variant="secondary" size="sm">Looks Great</Button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>(GameState.HOME);
  const [loading, setLoading] = useState(false);
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

  const handleStartGame = () => setState(GameState.SETUP);
  const handleCustomize = () => setState(GameState.MASCOT_EDIT);

  const setupGame = async (familiar: DomainOption, complex: DomainOption, goal: string) => {
    setLoading(true);
    const questions = await generateAnalogyQuestions(familiar.label, complex.label, goal);
    if (questions.length > 0) {
      setSession({
        familiarDomain: familiar,
        complexDomain: complex,
        goal,
        questions,
        currentIndex: 0,
        score: 0,
        history: []
      });
      setState(GameState.QUIZ);
    }
    setLoading(false);
  };

  const handleUpdateQuestionImage = (url: string) => {
    setSession(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[prev.currentIndex] = { ...newQuestions[prev.currentIndex], imageUrl: url };
      return { ...prev, questions: newQuestions };
    });
  };

  const submitAnswer = (answer: string) => {
    setLastSelectedAnswer(answer);
    const currentQ = session.questions[session.currentIndex];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setSession(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      history: [...prev.history, { questionId: currentQ.id, answer, isCorrect }]
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
    setSession({
      familiarDomain: null,
      complexDomain: null,
      goal: "",
      questions: [],
      currentIndex: 0,
      score: 0,
      history: []
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="p-4 md:px-8 flex items-center justify-between border-b bg-white/80 backdrop-blur sticky top-0 z-[60]">
        <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95" onClick={resetGame}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md border-b-4 border-indigo-800">🧠</div>
          <span className="brand-font text-2xl font-bold tracking-tight text-slate-800">Playner</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 shadow-sm">
             <span>✨</span>
             <span>124 Learning Points</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all">
             <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto flex-1">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
             <div className="w-20 h-20 bg-indigo-100 rounded-3xl mb-6 flex items-center justify-center relative">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute -top-2 -right-2 text-2xl">📡</div>
             </div>
             <h2 className="text-2xl font-bold mb-2">Syncing Data...</h2>
             <p className="text-slate-500 max-w-xs mx-auto italic font-medium">Checking the Cloud Bank for precomputed mission paths...</p>
             <div className="mt-8 flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce delay-75"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce delay-150"></div>
             </div>
          </div>
        ) : (
          <>
            {state === GameState.HOME && <HomeScreen onStart={handleStartGame} onCustomize={handleCustomize} />}
            {state === GameState.SETUP && <SetupScreen onConfirm={setupGame} onBack={() => setState(GameState.HOME)} />}
            {state === GameState.QUIZ && session.questions.length > 0 && (
              <QuizScreen 
                question={session.questions[session.currentIndex]}
                index={session.currentIndex}
                total={session.questions.length}
                goal={session.goal}
                onAnswer={submitAnswer}
                onImageGenerated={handleUpdateQuestionImage}
              />
            )}
            {state === GameState.REVEAL && (
              <RevealScreen 
                question={session.questions[session.currentIndex]}
                selectedAnswer={lastSelectedAnswer}
                index={session.currentIndex}
                total={session.questions.length}
                onNext={nextQuestion}
              />
            )}
            {state === GameState.SUMMARY && (
              <SummaryScreen session={session} onReset={resetGame} />
            )}
            {state === GameState.MASCOT_EDIT && (
              <MascotScreen onBack={() => setState(GameState.HOME)} />
            )}
          </>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="text-center text-slate-300 text-xs py-8 mt-auto font-medium uppercase tracking-widest">
        &copy; 2024 Playner Analogical Engine. High-fidelity learning via Gemini 3.
      </footer>
    </div>
  );
}
