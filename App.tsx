
import React, { useState, useEffect } from 'react';
import { GameState, GameSession, DomainOption, MissionData, NeuralModule, ModuleStep } from './types';
import { FAMILIAR_CATEGORIES, COMPLEX_CATEGORIES, TRENDING_MISSIONS, PRECOMPUTED_STORE } from './constants';
import { generateMission, normalizeKey } from './services/geminiService';
import { CacheService } from './services/cacheService';
import Button from './components/Button';

const useSmoothScrollTop = (trigger: any) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [trigger]);
};

const FloatingXP: React.FC<{ x: number, y: number }> = ({ x, y }) => (
  <div className="fixed pointer-events-none z-[250] font-black text-indigo-500 text-3xl animate-bounce" style={{ left: x, top: y }}>
    +150 XP 🧬
  </div>
);

const WordSync: React.FC<{ familiar: string[]; complex: string[]; onComplete: () => void }> = ({ familiar, complex, onComplete }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + (100 / 40), 100)), 50);
    const timer = setTimeout(onComplete, 3000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[300] flex flex-col items-center justify-center p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40 w-full max-w-6xl">
        <div className="flex flex-wrap gap-5 justify-center">
          {familiar.map((w, i) => <span key={i} className={`px-8 py-4 rounded-3xl font-black text-2xl transition-all duration-1000 ${progress > 40 ? 'opacity-20 blur-sm' : 'bg-white text-indigo-600 shadow-2xl'}`}>{w}</span>)}
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
          {complex.map((w, i) => <span key={i} className={`px-8 py-4 rounded-3xl font-black text-2xl transition-all duration-1000 ${progress > 40 ? 'bg-white text-emerald-600 scale-110 shadow-2xl' : 'opacity-0'}`}>{w}</span>)}
        </div>
      </div>
      <div className="w-full max-w-md mt-20 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-75" style={{width: `${progress}%`}}></div>
      </div>
      <div className="mt-8 text-white font-black text-sm uppercase tracking-[0.5em] animate-pulse text-center">Mapping Cognitive Overlap...</div>
    </div>
  );
};

const LaserPanda: React.FC<{ 
  status: 'idle' | 'scanning' | 'correct' | 'incorrect' | 'tip';
  message?: string;
  className?: string;
}> = ({ status, message, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState("");

  useEffect(() => {
    if (status !== 'idle') {
      setVisible(true);
      if (status === 'scanning') setActiveMessage("🧬 ANALYZING...");
      else if (status === 'correct') setActiveMessage("🌿 STABLE!");
      else if (status === 'incorrect') setActiveMessage("⚠️ COLLISION!");
      else if (status === 'tip') setActiveMessage(message || "💡 Tip!");
      if (status === 'correct' || status === 'incorrect') {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
      }
    } else setVisible(false);
  }, [status, message]);

  if (!visible) return null;

  return (
    <div className={`z-[100] section-enter ${className}`}>
      <div className="relative">
        <div className={`text-7xl filter drop-shadow-xl ${status === 'scanning' ? 'animate-bounce' : 'float'}`}>🦊</div>
        <div className={`absolute top-4 right-20 p-4 rounded-2xl shadow-xl border-2 font-black text-xs w-48 text-center ${
          status === 'tip' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white text-slate-900 border-indigo-50'
        }`}>
          {activeMessage}
          <div className={`absolute top-4 -right-2 w-3 h-3 rotate-45 border-r-2 border-t-2 ${
            status === 'tip' ? 'bg-indigo-600 border-indigo-400' : 'bg-white border-indigo-50'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

const DomainCard: React.FC<{ 
  option: DomainOption; 
  isSelected: boolean; 
  onClick: () => void;
  accentColor: 'indigo' | 'emerald';
}> = ({ option, isSelected, onClick, accentColor }) => {
  const borderStyles = isSelected 
    ? accentColor === 'indigo' ? 'border-indigo-600 ring-4 ring-indigo-100 bg-indigo-50/50' : 'border-emerald-500 ring-4 ring-emerald-100 bg-emerald-50/50'
    : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-lg';

  return (
    <button 
      onClick={onClick}
      className={`relative group p-6 rounded-[2.5rem] border-2 transition-all duration-300 text-left flex flex-col items-center text-center ${borderStyles}`}
    >
      <div className={`text-7xl mb-4 transform transition-transform group-hover:scale-110 duration-300 ${isSelected ? 'scale-110' : ''}`}>
        {option.icon}
      </div>
      <h4 className="font-black text-xl mb-2 text-slate-800">{option.label}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{option.description}</p>
    </button>
  );
};

const TrendingCard: React.FC<{ 
  mission: any, 
  onSelect: (f: string, c: string, g: string) => void 
}> = ({ mission, onSelect }) => (
  <button 
    onClick={() => onSelect(mission.familiar, mission.complex, mission.goal)}
    className={`p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-${mission.color}-500 transition-all text-left shadow-sm hover:shadow-xl group relative overflow-hidden`}
  >
    <div className={`absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity`}>🚀</div>
    <div className={`text-xs font-black uppercase tracking-widest text-${mission.color}-600 mb-2`}>Trending Sync</div>
    <h4 className="text-xl font-black text-slate-800 mb-1">{mission.label}</h4>
    <p className="text-sm text-slate-400 font-bold">{mission.goal}</p>
  </button>
);

const QuestionCard: React.FC<{ 
  title: string; badge: string; icon: string; data: ModuleStep; onAnswer: (correct: boolean, e: any) => void; mascotStatus: any; mascotMessage: string; setMascot: any; 
}> = ({ title, badge, icon, data, onAnswer, mascotStatus, mascotMessage, setMascot }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (data.tip) setMascot('tip', data.tip);
    return () => setMascot('idle');
  }, [data, setMascot]);

  const handleVerify = (e: React.MouseEvent) => {
    if (!selected || isRevealing) return;
    setIsRevealing(true);
    setMascot('scanning');
    const correct = selected === data.correctAnswer;
    setTimeout(() => {
      setMascot(correct ? 'correct' : 'incorrect');
      setTimeout(() => {
        onAnswer(correct, e);
        setSelected(null);
        setIsRevealing(false);
        setMascot('idle');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 section-enter">
      <div className="mb-12 flex items-center justify-between">
        <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-[0.3em]">{badge}</div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{title}</div>
      </div>
      <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl mb-12 relative">
        <LaserPanda status={mascotStatus} message={mascotMessage} className="absolute -top-12 -right-8" />
        <div className="absolute -top-10 -right-10 text-[15rem] opacity-5 pointer-events-none">{icon}</div>
        <h2 className="text-3xl md:text-5xl font-black leading-tight relative z-10 pr-12">{data.question}</h2>
        {data.known_concept && <div className="mt-8 text-xs font-black text-slate-300 uppercase tracking-widest">Targeting: {data.known_concept}</div>}
      </div>
      <div className="grid gap-6 mb-40">
        {data.options.map((opt, i) => (
          <button key={i} disabled={isRevealing} onClick={() => setSelected(opt)} className={`w-full p-8 text-left rounded-[2.5rem] border-4 transition-all font-black text-2xl ${selected === opt ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-white bg-white hover:border-indigo-100'}`}>
            <span className="mr-6 opacity-30">{String.fromCharCode(65+i)}.</span> {opt}
          </button>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-12 bg-white/80 backdrop-blur border-t-2 z-[120] flex justify-center">
        <Button onClick={handleVerify} disabled={!selected || isRevealing} isLoading={isRevealing} className="w-full max-w-xl h-24 text-3xl rounded-full">Commit Synapse</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>(GameState.HOME);
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [mascotStatus, setMascotStatus] = useState<any>('idle');
  const [mascotMessage, setMascotMessage] = useState("");
  const [floatingXp, setFloatingXp] = useState<{x:number, y:number}[]>([]);
  const [session, setSession] = useState<GameSession>({
    familiarDomain: null, complexDomain: null, goal: "", mission: null, currentIndex: 0, score: 0
  });

  useSmoothScrollTop(state);

  const updateMascot = (status: any, message?: string) => {
    setMascotStatus(status);
    if (message) setMascotMessage(message);
  };

  const setupGame = async (f: DomainOption, c: DomainOption, g: string) => {
    const key = normalizeKey(f.label, c.label, g);
    const cachedMission = PRECOMPUTED_STORE[key] || CacheService.get(f.label, c.label, g);
    
    if (cachedMission) {
      setSession({ familiarDomain: f, complexDomain: c, goal: g, mission: cachedMission, currentIndex: 0, score: 0 });
      setState(GameState.MAP);
      return;
    }

    setLoading(true);
    try {
      const mission = await generateMission(f.label, c.label, g);
      setSession({ familiarDomain: f, complexDomain: c, goal: g, mission, currentIndex: 0, score: 0 });
      setState(GameState.MAP);
    } catch (err) { alert("Sync failed. Check API key."); } finally { setLoading(false); }
  };

  const handleTrending = (fId: string, cId: string, goal: string) => {
    const f = FAMILIAR_CATEGORIES.flatMap(cat => cat.items).find(i => i.id === fId);
    const c = COMPLEX_CATEGORIES.flatMap(cat => cat.items).find(i => i.id === cId);
    if (f && c) setupGame(f, c, goal);
  };

  const handleAnswer = (correct: boolean, e: any) => {
    if (correct) {
      setSession(p => ({ ...p, score: p.score + 1 }));
      setXp(p => p + 150);
      setFloatingXp(prev => [...prev, { x: e.clientX, y: e.clientY }]);
      setTimeout(() => setFloatingXp(p => p.slice(1)), 1000);
    }
    const flow = [GameState.STEP_PRIME, GameState.WORD_SYNC, GameState.STEP_BRIDGE, GameState.STEP_INFER, GameState.STEP_REINFORCE, GameState.STEP_CAPSTONE, GameState.SYNTHESIS];
    const currIdx = flow.indexOf(state);
    if (currIdx !== -1 && currIdx < flow.length - 1) {
      setState(flow[currIdx + 1]);
    } else if (state === GameState.FINAL_CHALLENGE) {
      setState(GameState.SUMMARY);
    }
  };

  const currentModule = session.mission?.modules[session.currentIndex];

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-40">
      {floatingXp.map((f, i) => <FloatingXP key={i} x={f.x} y={f.y} />)}
      
      <nav className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-[150] border-b-2 border-slate-100">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setState(GameState.HOME)}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">🧠</div>
          <span className="brand-font text-3xl font-black">Playner</span>
        </div>
        <div className="bg-amber-50 px-5 py-2 rounded-2xl border border-amber-100 font-black text-amber-700">✨ {xp} XP</div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center section-enter">
            <div className="text-9xl mb-12 animate-bounce">🧬</div>
            <h2 className="text-5xl font-black text-center mb-4">Architecting Neural Path...</h2>
            <p className="text-slate-400 font-bold">Bridging your expertise in real-time</p>
          </div>
        ) : (
          <>
            {state === GameState.HOME && (
              <div className="py-20 section-enter">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                  <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-8xl font-black mb-8 leading-[0.85] tracking-tighter">Instant <br/><span className="text-indigo-600 underline decoration-8">Analogies.</span></h1>
                    <p className="text-2xl text-slate-500 mb-12 max-w-xl font-medium leading-relaxed">Map patterns from games like Tic-Tac-Toe to the world of Finance and Tech.</p>
                    <div className="flex gap-4 justify-center lg:justify-start">
                      <Button onClick={() => setState(GameState.SETUP)} size="lg" className="h-24 px-16 text-2xl rounded-full">New Expedition</Button>
                    </div>
                  </div>
                  <div className="w-96 h-96 bg-white rounded-[5rem] shadow-2xl relative flex items-center justify-center text-9xl group cursor-pointer hover:rotate-2 transition-transform">
                    🦊
                    <div className="absolute -top-12 -right-12 p-6 bg-indigo-600 text-white rounded-3xl font-black text-sm w-48 shadow-xl">
                      "I've pre-scanned some missions for 0ms load!"
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {TRENDING_MISSIONS.map((m, i) => <TrendingCard key={i} mission={m} onSelect={handleTrending} />)}
                </div>
              </div>
            )}

            {state === GameState.SETUP && (
              <div className="py-16 section-enter">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-black mb-4">Neural Config</h2>
                  <p className="text-slate-400 font-bold">Choose a familiar anchor and a target frontier</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-xl">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span> Your Anchor (Known)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {FAMILIAR_CATEGORIES.flatMap(c => c.items).map(d => (
                        <DomainCard key={d.id} option={d} isSelected={session.familiarDomain?.id === d.id} onClick={() => setSession(p => ({ ...p, familiarDomain: d }))} accentColor="indigo" />
                      ))}
                    </div>
                  </div>
                  <div className={`bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-xl transition-opacity ${!session.familiarDomain ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">2</span> Your Frontier (Unknown)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {COMPLEX_CATEGORIES.flatMap(c => c.items).map(d => (
                        <DomainCard key={d.id} option={d} isSelected={session.complexDomain?.id === d.id} onClick={() => setSession(p => ({ ...p, complexDomain: d }))} accentColor="emerald" />
                      ))}
                    </div>
                  </div>
                </div>
                {session.complexDomain && (
                  <div className="mt-12 bg-slate-900 p-16 rounded-[4rem] text-center section-enter">
                    <h3 className="text-3xl font-black text-white mb-8">Select Learning Goal</h3>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                      {session.complexDomain.suggestedGoals?.map(g => (
                        <button key={g} onClick={() => setSession(p => ({ ...p, goal: g }))} className={`px-8 py-4 rounded-full font-black text-xl transition-all ${session.goal === g ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>{g}</button>
                      ))}
                    </div>
                    <Button disabled={!session.goal} onClick={() => setupGame(session.familiarDomain!, session.complexDomain!, session.goal)} className="w-full max-w-md h-24 text-3xl rounded-full">Launch Expedition</Button>
                  </div>
                )}
              </div>
            )}

            {state === GameState.WORD_SYNC && currentModule && (
              <WordSync 
                familiar={currentModule.bridgeKeywords.familiar} 
                complex={currentModule.bridgeKeywords.complex} 
                onComplete={() => setState(GameState.STEP_BRIDGE)} 
              />
            )}

            {(state === GameState.STEP_PRIME || state === GameState.STEP_BRIDGE || state === GameState.STEP_INFER || state === GameState.STEP_REINFORCE || state === GameState.STEP_CAPSTONE) && currentModule && (
              <QuestionCard 
                title={currentModule.conceptName} badge={state.replace('STEP_', '')} icon="🧠"
                data={state === GameState.STEP_PRIME ? currentModule.prime : state === GameState.STEP_BRIDGE ? currentModule.bridge : state === GameState.STEP_INFER ? currentModule.infer : state === GameState.STEP_REINFORCE ? currentModule.reinforce : currentModule.capstone} 
                onAnswer={handleAnswer} mascotStatus={mascotStatus} mascotMessage={mascotMessage} setMascot={updateMascot}
              />
            )}

            {state === GameState.SYNTHESIS && currentModule && (
              <div className="max-w-4xl mx-auto py-24 text-center section-enter">
                <div className="bg-white p-24 rounded-[5rem] shadow-2xl border-b-[24px] border-emerald-50 mb-16">
                  <h4 className="text-emerald-500 font-black uppercase tracking-[0.5em] mb-8">SET STABILIZED</h4>
                  <h3 className="text-5xl font-black italic mb-16">"{currentModule.synthesis}"</h3>
                  <Button onClick={() => {
                    const nextIdx = session.currentIndex + 1;
                    if (nextIdx < (session.mission?.modules.length || 0)) {
                      setSession(p => ({ ...p, currentIndex: nextIdx }));
                      setState(GameState.MAP);
                    } else { setState(GameState.FINAL_CHALLENGE); }
                  }} className="w-full h-24 text-3xl rounded-full bg-emerald-500">Secure Node</Button>
                </div>
              </div>
            )}
            
            {state === GameState.FINAL_CHALLENGE && session.mission && (
              <QuestionCard 
                title="Final Expedition challenge" 
                badge="FINAL" 
                icon="🔭" 
                data={session.mission.finalChallenge} 
                onAnswer={handleAnswer} 
                mascotStatus={mascotStatus} 
                mascotMessage={mascotMessage} 
                setMascot={updateMascot} 
              />
            )}
            
            {state === GameState.MAP && <div className="py-20 text-center"><h2 className="text-6xl font-black mb-8">Mission Trail</h2><Button onClick={() => setState(GameState.BRIEFING)} size="lg" className="rounded-full h-24 px-12">Enter Briefing</Button></div>}
            {state === GameState.BRIEFING && <div className="py-20 text-center max-w-4xl mx-auto glass-card p-20 rounded-[4rem]"><h2 className="text-5xl font-black mb-8">{session.mission?.briefing.title}</h2><p className="text-2xl text-slate-500 mb-12 italic">"{session.mission?.briefing.scenario}"</p><Button onClick={() => setState(GameState.STEP_PRIME)} size="lg" className="w-full rounded-full h-24 text-2xl">Start Synchronization</Button></div>}
            {state === GameState.SUMMARY && <div className="py-20 text-center"><h2 className="text-7xl font-black">Frontier Stabilized!</h2><Button onClick={() => setState(GameState.HOME)} className="mt-12 h-24 text-3xl px-12 rounded-full">Return Home</Button></div>}
          </>
        )}
      </main>
    </div>
  );
}
