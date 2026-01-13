
import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameSession, DomainOption, MissionData, NeuralModule, ModuleStep } from './types';
import { FAMILIAR_CATEGORIES, COMPLEX_CATEGORIES } from './constants';
import { generateMission } from './services/geminiService';
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

const LaserPanda: React.FC<{ status: 'idle' | 'scanning' | 'correct' | 'incorrect' }> = ({ status }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (status !== 'idle') {
      setVisible(true);
      const timer = setTimeout(() => { if(status === 'correct' || status === 'incorrect') setVisible(false); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  if (!visible) return null;
  return (
    <div className="fixed bottom-12 right-12 z-[100] section-enter">
      <div className="relative">
        <div className={`text-8xl filter drop-shadow-2xl ${status === 'scanning' ? 'animate-bounce' : 'float'}`}>🦊</div>
        <div className="absolute -top-20 -left-40 bg-white p-5 rounded-3xl shadow-2xl border-4 border-indigo-50 font-black text-sm w-56 text-center -rotate-2">
          {status === 'scanning' && "🧬 ANALYZING SYNAPSES..."}
          {status === 'correct' && "🌿 NEURAL PATH STABLE!"}
          {status === 'incorrect' && "⚠️ SIGNAL COLLISION..."}
        </div>
      </div>
    </div>
  );
};

const MissionMap: React.FC<{ session: GameSession; onProceed: () => void }> = ({ session, onProceed }) => {
  const modules = session.mission?.modules || [];
  return (
    <div className="py-16 max-w-4xl mx-auto text-center section-enter">
      <div className="inline-block px-8 py-3 bg-white/80 backdrop-blur rounded-full shadow-xl border border-indigo-100 mb-16">
        <h2 className="text-2xl font-black tracking-tight text-slate-700">Exploration Trail: <span className="text-indigo-600">{session.complexDomain?.label}</span></h2>
      </div>
      <div className="relative neural-path p-10 rounded-[4rem] border border-slate-200 bg-white/30">
        <div className="flex flex-col items-center gap-24 relative">
          <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-[0_12px_0_#e2e8f0] border-4 border-indigo-600 text-indigo-600">📡</div>
          {modules.map((m, i) => {
            const isCompleted = i < session.currentIndex;
            const isActive = i === session.currentIndex;
            return (
              <div key={m.id} className={`flex items-center gap-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="relative isometric-node">
                  {isActive && <div className="pulse-ring w-36 h-36 -top-2 -left-2"></div>}
                  <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl border-4 ${isCompleted ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_10px_0_#4338ca]' : isActive ? 'bg-white border-indigo-600 text-indigo-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                    {isCompleted ? '✅' : isActive ? '🌱' : '🔒'}
                  </div>
                </div>
                <div className="text-left w-48">
                  <h4 className={`font-black text-[10px] uppercase tracking-[0.2em] mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>Set {i+1}</h4>
                  <p className={`font-bold leading-tight ${isActive ? 'text-slate-800 text-xl' : 'text-slate-300'}`}>{m.conceptName}</p>
                </div>
              </div>
            );
          })}
          <div className={`w-40 h-40 rounded-full flex items-center justify-center text-7xl shadow-2xl ${session.currentIndex >= modules.length ? 'bg-amber-400 shadow-[0_15px_0_#d97706] scale-110' : 'bg-slate-100 text-slate-200 border-4 border-slate-200'}`}>🏆</div>
        </div>
      </div>
      <Button onClick={onProceed} size="lg" className="mt-20 w-full max-w-sm h-24 text-2xl rounded-full">
        {session.currentIndex === 0 ? "Initialize Scout" : "Synchronize Next Set"}
      </Button>
    </div>
  );
};

const WordSync: React.FC<{ familiar: string[]; complex: string[]; onComplete: () => void }> = ({ familiar, complex, onComplete }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + (100 / 50), 100)), 100);
    const timer = setTimeout(onComplete, 5000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[300] flex flex-col items-center justify-center p-12">
      <div className="grid grid-cols-2 gap-40 w-full max-w-6xl">
        <div className="flex flex-wrap gap-5 justify-center">
          {familiar.map((w, i) => <span key={i} className={`px-8 py-4 rounded-3xl font-black text-2xl transition-all duration-1000 ${progress > 30 ? 'opacity-20 blur-sm' : 'bg-white text-indigo-600 shadow-2xl'}`}>{w}</span>)}
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
          {complex.map((w, i) => <span key={i} className={`px-8 py-4 rounded-3xl font-black text-2xl transition-all duration-1000 ${progress > 30 ? 'bg-white text-emerald-600 scale-110 shadow-2xl' : 'opacity-0'}`}>{w}</span>)}
        </div>
      </div>
      <div className="w-[500px] mt-20 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500" style={{width: `${progress}%`}}></div>
      </div>
      <div className="mt-8 text-white font-black text-sm uppercase tracking-[0.5em] animate-pulse">Mapping Cognitive Overlap...</div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>(GameState.HOME);
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [mascotStatus, setMascotStatus] = useState<'idle' | 'scanning' | 'correct' | 'incorrect'>('idle');
  const [floatingXp, setFloatingXp] = useState<{x:number, y:number}[]>([]);
  const [session, setSession] = useState<GameSession>({
    familiarDomain: null, complexDomain: null, goal: "", mission: null, currentIndex: 0, score: 0
  });

  useSmoothScrollTop(state + (session.currentIndex * 10));

  const setupGame = async (f: DomainOption, c: DomainOption, g: string) => {
    setLoading(true);
    try {
      const mission = await generateMission(f.label, c.label, g);
      setSession({ familiarDomain: f, complexDomain: c, goal: g, mission, currentIndex: 0, score: 0 });
      setState(GameState.MAP);
    } catch (err) { alert("Neural sync failed."); } finally { setLoading(false); }
  };

  const handleAnswer = (correct: boolean, e: any) => {
    if (correct) {
      setSession(p => ({ ...p, score: p.score + 1 }));
      setXp(p => p + 150);
      setFloatingXp(prev => [...prev, { x: e.clientX, y: e.clientY }]);
      setTimeout(() => setFloatingXp(p => p.slice(1)), 1000);
    }
    
    // 5-Step Logic
    if (state === GameState.STEP_PRIME) setState(GameState.WORD_SYNC);
    else if (state === GameState.STEP_BRIDGE) setState(GameState.STEP_INFER);
    else if (state === GameState.STEP_INFER) setState(GameState.STEP_REINFORCE);
    else if (state === GameState.STEP_REINFORCE) setState(GameState.STEP_CAPSTONE);
    else if (state === GameState.STEP_CAPSTONE) setState(GameState.SYNTHESIS);
    else if (state === GameState.FINAL_CHALLENGE) setState(GameState.SUMMARY);
  };

  const handleDownloadMission = () => {
    if (!session.mission) return;
    const missionDataStr = JSON.stringify(session.mission, null, 2);
    const blob = new Blob([missionDataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Playner-Mission-${session.complexDomain?.label || 'Untitled'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentModule = session.mission?.modules[session.currentIndex];

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-40">
      <LaserPanda status={mascotStatus} />
      {floatingXp.map((f, i) => <FloatingXP key={i} x={f.x} y={f.y} />)}
      
      <nav className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-[150] border-b-2 border-slate-100">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setState(GameState.HOME)}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">🧠</div>
          <span className="brand-font text-3xl font-black">Playner</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-amber-50 px-5 py-2 rounded-2xl border border-amber-100 font-black text-amber-700">✨ {xp}</div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center section-enter">
            <div className="text-9xl mb-12 animate-bounce">🧬</div>
            <h2 className="text-5xl font-black text-center">Architecting Neural Frontier...</h2>
          </div>
        ) : (
          <>
            {state === GameState.HOME && (
              <div className="py-24 text-center section-enter">
                <h1 className="text-7xl font-black mb-10 leading-[0.9]">Learn by <span className="text-indigo-600 underline">Analogy.</span></h1>
                <p className="text-2xl text-slate-500 mb-20 max-w-2xl mx-auto">Map your existing expertise to high-frontier concepts through guided neural syncs.</p>
                <Button onClick={() => setState(GameState.SETUP)} size="lg" className="h-28 px-24 text-3xl rounded-full">Enter Frontier</Button>
              </div>
            )}

            {state === GameState.SETUP && (
              <div className="py-16 max-w-4xl mx-auto section-enter">
                <h2 className="text-5xl font-black mb-20 text-center">Expedition Config</h2>
                <div className="space-y-16">
                  <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                    <h3 className="text-xs font-black uppercase text-indigo-400 mb-8 tracking-[0.4em]">1 ANCHOR (YOUR STRENGTH)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {FAMILIAR_CATEGORIES.flatMap(c => c.items).map(d => (
                        <button key={d.id} onClick={() => setSession(p => ({ ...p, familiarDomain: d }))} className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-4 ${session.familiarDomain?.id === d.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50'}`}>
                          <span className="text-5xl">{d.icon}</span>
                          <span className="font-black text-sm">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                  <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
                    <h3 className="text-xs font-black uppercase text-emerald-400 mb-8 tracking-[0.4em]">2 FRONTIER (THE UNKNOWN)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {COMPLEX_CATEGORIES.flatMap(c => c.items).map(d => (
                        <button key={d.id} onClick={() => setSession(p => ({ ...p, complexDomain: d, goal: "" }))} className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-4 ${session.complexDomain?.id === d.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}>
                          <span className="text-5xl">{d.icon}</span>
                          <span className="font-black text-sm">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                  {session.complexDomain && (
                    <div className="bg-slate-900 p-12 rounded-[4rem] section-enter">
                      <h3 className="text-white text-xs font-black mb-8 text-center uppercase tracking-[0.5em]">OBJECTIVE</h3>
                      <div className="grid gap-4">
                        {session.complexDomain.suggestedGoals?.map(g => (
                          <button key={g} onClick={() => setSession(p => ({ ...p, goal: g }))} className={`p-6 text-left rounded-[2rem] font-black transition-all ${session.goal === g ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button disabled={!session.goal} onClick={() => setupGame(session.familiarDomain!, session.complexDomain!, session.goal)} className="w-full h-24 text-2xl rounded-full">Initialize Sync</Button>
                </div>
              </div>
            )}

            {state === GameState.MAP && <MissionMap session={session} onProceed={() => setState(session.currentIndex === 0 ? GameState.BRIEFING : GameState.STEP_PRIME)} />}

            {state === GameState.BRIEFING && session.mission && (
               <div className="py-24 max-w-4xl mx-auto section-enter text-center">
                  <div className="bg-white p-24 rounded-[5rem] shadow-2xl border-b-[20px] border-slate-100">
                     <h2 className="text-6xl font-black mb-10">{session.mission.briefing.title}</h2>
                     <p className="text-3xl text-slate-400 mb-16 font-bold italic">"{session.mission.briefing.scenario}"</p>
                     <Button onClick={() => setState(GameState.STEP_PRIME)} size="lg" className="w-full h-24 text-3xl rounded-full">Begin Set 1</Button>
                  </div>
               </div>
            )}

            {state === GameState.WORD_SYNC && currentModule && (
              <WordSync familiar={currentModule.bridgeKeywords.familiar} complex={currentModule.bridgeKeywords.complex} onComplete={() => setState(GameState.STEP_BRIDGE)} />
            )}

            {(state === GameState.STEP_PRIME || state === GameState.STEP_BRIDGE || state === GameState.STEP_INFER || state === GameState.STEP_REINFORCE || state === GameState.STEP_CAPSTONE) && currentModule && (
              <QuestionCard 
                title={currentModule.conceptName} 
                badge={state.replace('STEP_', '')}
                icon={state === GameState.STEP_PRIME ? '🧠' : '🔍'}
                data={
                  state === GameState.STEP_PRIME ? currentModule.prime : 
                  state === GameState.STEP_BRIDGE ? currentModule.bridge : 
                  state === GameState.STEP_INFER ? currentModule.infer : 
                  state === GameState.STEP_REINFORCE ? currentModule.reinforce : currentModule.capstone
                } 
                onAnswer={handleAnswer}
                setMascot={setMascotStatus}
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
              <QuestionCard title="Expedition Mastery" badge="Final Protocol" icon="🔭" data={session.mission.finalChallenge} onAnswer={handleAnswer} setMascot={setMascotStatus} />
            )}

            {state === GameState.SUMMARY && (
              <div className="py-24 text-center max-w-5xl mx-auto section-enter">
                <h1 className="text-8xl font-black mb-8 tracking-tighter">Frontier Stabilized!</h1>
                <div className="grid md:grid-cols-3 gap-10 mb-24">
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl"><div className="text-8xl font-black text-indigo-600">{xp}</div><div className="text-xs uppercase font-black opacity-30 mt-4">Total XP</div></div>
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl"><div className="text-8xl font-black text-emerald-500">{session.mission?.modules.length}</div><div className="text-xs uppercase font-black opacity-30 mt-4">Sets Mastered</div></div>
                  <div className="bg-white p-12 rounded-[4rem] shadow-2xl"><div className="text-8xl font-black text-amber-500">{level}</div><div className="text-xs uppercase font-black opacity-30 mt-4">Current Rank</div></div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button onClick={() => setState(GameState.HOME)} size="lg" className="h-28 px-20 text-3xl rounded-full">New Expedition</Button>
                  <Button onClick={handleDownloadMission} variant="outline" size="lg" className="h-28 px-12 text-xl rounded-full border-indigo-200 text-indigo-600">Download Mission Archive</Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const QuestionCard: React.FC<{ title: string; badge: string; icon: string; data: ModuleStep; onAnswer: (correct: boolean, e: any) => void; setMascot: (s: any) => void; }> = ({ title, badge, icon, data, onAnswer, setMascot }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
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
      <div className="bg-white p-16 rounded-[4rem] shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-[15rem] opacity-5">{icon}</div>
        <h2 className="text-4xl md:text-5xl font-black leading-tight relative z-10">{data.question}</h2>
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
