
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameSession, DomainOption, AnalogyQuestion } from './types';
import { FAMILIAR_DOMAINS, COMPLEX_DOMAINS } from './constants';
import { generateAnalogyQuestions, editMascotImage, generateInitialMascot } from './services/geminiService';
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
    <h1 className="text-5xl font-bold mb-4 text-slate-900 tracking-tight">Playner</h1>
    <p className="text-xl text-slate-600 mb-10 max-w-md">
      Learn new ideas by playing what you already know. 
      Master complex concepts through playful analogies.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
      <Button onClick={onStart} size="lg" className="w-full">Start a Game</Button>
      <Button onClick={onCustomize} size="lg" variant="outline" className="w-full">Create Mascot</Button>
    </div>
    <p className="mt-8 text-sm text-slate-400 font-medium">Trusted by curious minds & teachers</p>
  </div>
);

const SetupScreen: React.FC<{ 
  onConfirm: (familiar: DomainOption, complex: DomainOption) => void;
  onBack: () => void;
}> = ({ onConfirm, onBack }) => {
  const [familiar, setFamiliar] = useState<DomainOption | null>(null);
  const [complex, setComplex] = useState<DomainOption | null>(null);

  const handleFinish = () => {
    if (familiar && complex) onConfirm(familiar, complex);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-2">Build Your Analogy</h2>
        <p className="text-slate-600">Pick a starting point and a challenge</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">1. What you already know</h3>
          <div className="space-y-3">
            {FAMILIAR_DOMAINS.map(d => (
              <div 
                key={d.id}
                onClick={() => setFamiliar(d)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  familiar?.id === d.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="font-bold text-slate-800">{d.label}</div>
                  <div className="text-xs text-slate-500">{d.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">2. What you want to learn</h3>
          <div className="space-y-3">
            {COMPLEX_DOMAINS.map(d => (
              <div 
                key={d.id}
                onClick={() => setComplex(d)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  complex?.id === d.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="font-bold text-slate-800">{d.label}</div>
                  <div className="text-xs text-slate-500">{d.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky bottom-4">
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
        <div className="hidden md:flex items-center gap-4 text-slate-400 font-medium italic">
          {familiar?.label || '...'} <span className="text-indigo-300 text-xl">→</span> {complex?.label || '...'}
        </div>
        <Button 
          variant="primary" 
          disabled={!familiar || !complex}
          onClick={handleFinish}
        >
          Generate Quiz
        </Button>
      </div>
    </div>
  );
};

const QuizScreen: React.FC<{ 
  question: AnalogyQuestion;
  index: number;
  total: number;
  onAnswer: (answer: string) => void;
}> = ({ question, index, total, onAnswer }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            Question {index + 1} of {total}
          </div>
          <div className="text-sm font-bold text-slate-400">Analogy Bridge</div>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-500" 
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="text-9xl">💡</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed relative z-10">
          {question.question}
        </h2>
        <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm mb-4">
          <span>{question.familiarConcept}</span>
          <span className="opacity-30">is like</span>
          <span>{question.complexConcept}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt)}
            className="p-6 text-left rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all font-semibold text-slate-700 shadow-sm flex items-center gap-4"
          >
            <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-200">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
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

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg ${isCorrect ? 'bg-green-100' : 'bg-rose-100'}`}>
        {isCorrect ? '✅' : '❌'}
      </div>
      <h2 className="text-4xl font-bold mb-2">
        {isCorrect ? 'Brilliant!' : 'Not Quite!'}
      </h2>
      <p className="text-slate-500 mb-8 font-medium">The correct answer was: <span className="text-indigo-600 font-bold">{question.correctAnswer}</span></p>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-left mb-8">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
          <span className="text-xl">✨</span> The "Aha!" Moment
        </h3>
        <p className="text-lg text-slate-700 leading-relaxed italic mb-6">
          "{question.explanation}"
        </p>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <p className="text-amber-800 text-sm font-medium">
            <span className="font-bold mr-2">Fun Fact:</span> {question.fact}
          </p>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">Next Question</Button>
    </div>
  );
};

const SummaryScreen: React.FC<{ session: GameSession; onReset: () => void }> = ({ session, onReset }) => {
  const percentage = Math.round((session.score / session.questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="mb-10">
        <div className="text-9xl mb-4">🏆</div>
        <h1 className="text-4xl font-bold mb-2">Game Complete!</h1>
        <p className="text-slate-500">You've successfully mapped {session.familiarDomain?.label} to {session.complexDomain?.label}!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase">Score</div>
          <div className="text-4xl font-bold text-indigo-600">{session.score}/{session.questions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase">Intuition Level</div>
          <div className="text-4xl font-bold text-amber-500">{percentage}%</div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h3 className="text-lg font-bold text-left px-2">Key Mappings Learned</h3>
        {session.questions.map((q, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${session.history[idx]?.isCorrect ? 'bg-green-100' : 'bg-slate-100 opacity-50'}`}>
              {session.history[idx]?.isCorrect ? '✓' : '•'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{q.familiarConcept} <span className="mx-2 text-indigo-300">→</span> {q.complexConcept}</div>
              <div className="text-xs text-slate-400 line-clamp-1">{q.question}</div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onReset} size="lg" className="w-full">Try Another Analogy</Button>
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
              <p>Your creation will appear here</p>
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
    questions: [],
    currentIndex: 0,
    score: 0,
    history: []
  });
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<string>('');

  const handleStartGame = () => setState(GameState.SETUP);
  const handleCustomize = () => setState(GameState.MASCOT_EDIT);

  const setupGame = async (familiar: DomainOption, complex: DomainOption) => {
    setLoading(true);
    const questions = await generateAnalogyQuestions(familiar.label, complex.label);
    if (questions.length > 0) {
      setSession({
        familiarDomain: familiar,
        complexDomain: complex,
        questions,
        currentIndex: 0,
        score: 0,
        history: []
      });
      setState(GameState.QUIZ);
    }
    setLoading(false);
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
      questions: [],
      currentIndex: 0,
      score: 0,
      history: []
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <nav className="p-4 md:px-8 flex items-center justify-between border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetGame}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md">🧠</div>
          <span className="brand-font text-2xl font-bold tracking-tight text-slate-800">Playner</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200">
             <span>✨</span>
             <span>124 Learning Points</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
             <div className="w-20 h-20 bg-indigo-100 rounded-3xl mb-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <h2 className="text-2xl font-bold mb-2">Connecting Neurons...</h2>
             <p className="text-slate-500 max-w-xs mx-auto italic">Building clever bridges between your ideas. One moment!</p>
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
                onAnswer={submitAnswer}
              />
            )}
            {state === GameState.REVEAL && (
              <RevealScreen 
                question={session.questions[session.currentIndex]}
                selectedAnswer={lastSelectedAnswer}
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
      <footer className="text-center text-slate-300 text-xs py-8 mt-auto">
        &copy; 2024 Playner Analogical Engine. All brains reserved.
      </footer>
    </div>
  );
}
