import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, SkipForward, ArrowLeft, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import Timer from './Timer';
import { NoraAvatar, ExerciseIllustration, WorkoutCompleteIllustration } from './AssetComponents';
import { getExerciseById } from '../data/exercises';

export default function WorkoutPlayer({ workoutPlan, onExit }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  // Initialize workout session in DB
  useEffect(() => {
    const startSession = async () => {
      try {
        const exercises = workoutPlan.exerciseDetails.map(ex => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: Array.from({ length: parseInt(ex.sets) || 3 }).map((_, i) => ({
            setNumber: i + 1,
            targetReps: ex.reps,
            actualReps: null,
            weight: ex.equipment.includes('kg') ? ex.equipment.replace(/[^0-9.]/g, '') : '',
            completed: false
          })),
          completed: false
        }));

        const res = await api.post('/api/workouts', {
          workoutType: workoutPlan.id,
          workoutName: workoutPlan.name,
          exercises
        });
        
        setSessionId(res._id);
        setSessionData(res);
      } catch (err) {
        console.error('Failed to start workout session:', err);
      }
    };
    startSession();
  }, [workoutPlan]);

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#6B6F76]">
        <div className="w-8 h-8 border-4 border-[#5B55E8] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium text-sm">Preparing workout session...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 max-w-md mx-auto bg-[#FFFFFF] rounded-3xl border border-[#E7E4DC] p-8 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto flex items-center justify-center">
          <WorkoutCompleteIllustration size={96} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#202124]">Workout Complete! 🎉</h2>
          <p className="text-[#6B6F76] text-sm mt-2 leading-relaxed">
            Awesome work, Vineet! Your sets and progress have been saved to your workout history.
          </p>
        </div>
        <button 
          onClick={onExit} 
          className="w-full bg-[#5B55E8] hover:bg-[#4B45D8] text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all"
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  const currentExercise = workoutPlan.exerciseDetails[currentExerciseIndex];
  const fullExerciseData = getExerciseById(currentExercise.id) || currentExercise;
  const totalExercises = workoutPlan.exerciseDetails.length;
  const totalSets = sessionData.exercises[currentExerciseIndex].sets.length;

  const handleCompleteSet = async () => {
    try {
      const newSessionData = { ...sessionData };
      newSessionData.exercises[currentExerciseIndex].sets[currentSetIndex].completed = true;
      newSessionData.exercises[currentExerciseIndex].sets[currentSetIndex].completedAt = new Date();
      newSessionData.completedSets = (newSessionData.completedSets || 0) + 1;
      setSessionData(newSessionData);

      api.patch('/api/workouts', {
        id: sessionId,
        updates: { exercises: newSessionData.exercises, completedSets: newSessionData.completedSets }
      });

      if (currentSetIndex < totalSets - 1) {
        setIsResting(true);
      } else {
        newSessionData.exercises[currentExerciseIndex].completed = true;
        if (currentExerciseIndex < totalExercises - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSetIndex(0);
          setIsResting(true);
        } else {
          setCompleted(true);
          api.patch('/api/workouts', { id: sessionId, updates: { status: 'completed', completedAt: new Date() }});
        }
      }
    } catch (err) {
      console.error('Failed to complete set', err);
    }
  };

  const handleSkipSet = () => {
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(prev => prev + 1);
    } else if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    } else {
      setCompleted(true);
      api.patch('/api/workouts', { id: sessionId, updates: { status: 'partial', completedAt: new Date() }});
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(prev => prev + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-lg mx-auto bg-[#FFFFFF] rounded-3xl border border-[#E7E4DC] p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DC]">
        <button 
          onClick={onExit} 
          className="p-2 text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] rounded-full transition-all"
          title="Exit Workout"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEECFF] text-[#5B55E8] border border-[#E7E4DC] mb-1">
            {workoutPlan.name}
          </span>
          <p className="text-xs font-medium text-[#6B6F76]">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </p>
        </div>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {isResting ? (
          <motion.div 
            key="rest"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <h2 className="text-xl font-bold text-[#202124] mb-6">Rest Period</h2>
            <Timer 
              defaultSeconds={parseInt(currentExercise.restSeconds) || 60} 
              autoStart={true} 
              onComplete={handleRestComplete} 
            />
            
            {/* Nora Motivation */}
            <div className="mt-8 bg-[#EEECFF]/50 border border-[#5B55E8]/20 rounded-2xl p-4 flex items-center gap-4 w-full">
              <NoraAvatar state="speaking" size={44} />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#5B55E8] uppercase tracking-wide">Nora Coach</span>
                <p className="text-xs text-[#202124] leading-relaxed italic">
                  "Take deep breaths and hydrate. Up next: <span className="font-semibold not-italic text-[#202124]">{
                    currentSetIndex === totalSets - 1 && currentExerciseIndex < totalExercises - 1
                      ? workoutPlan.exerciseDetails[currentExerciseIndex + 1].name
                      : currentExercise.name
                  }</span>."
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Exercise Info Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#202124]">{currentExercise.name}</h2>
              <div className="flex items-center justify-center gap-3 text-[#6B6F76] text-xs font-semibold">
                <span className="bg-[#F1F0EB] text-[#202124] px-3 py-1 rounded-full border border-[#E7E4DC]">
                  Set {currentSetIndex + 1} of {totalSets}
                </span>
                <span>•</span>
                <span className="bg-[#EEECFF] text-[#5B55E8] px-3 py-1 rounded-full border border-[#E7E4DC]">
                  {currentExercise.reps} Reps
                </span>
              </div>
            </div>

            {/* Exercise Illustration Box */}
            <div className="bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group min-h-[220px]">
               <ExerciseIllustration 
                 exerciseId={currentExercise.id} 
                 name={currentExercise.name}
                 className="w-full h-44 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
               />

               <div className="mt-3 text-center">
                 <p className="text-xs text-[#6B6F76] font-medium">Equipment: <strong className="text-[#202124]">{currentExercise.equipment}</strong></p>
               </div>
            </div>

            {/* Form Tip */}
            {fullExerciseData.commonMistakes?.[0] && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="font-semibold">Key Tip:</strong> {fullExerciseData.commonMistakes[0]}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={handleSkipSet}
                className="py-3.5 rounded-2xl bg-[#F1F0EB] text-[#202124] font-bold hover:bg-[#E7E4DC] transition-all flex items-center justify-center gap-2 border border-[#E7E4DC]"
              >
                <SkipForward size={18} />
                Skip Set
              </button>
              <button 
                onClick={handleCompleteSet}
                className="py-3.5 rounded-2xl bg-[#21A366] text-white font-bold hover:bg-[#1C8955] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} strokeWidth={3} />
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
