import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getExerciseById } from '../data/exercises';
import { ArrowLeft, Target, Dumbbell, Clock, AlertTriangle, TrendingUp, Shield, Wind, Sparkles } from 'lucide-react';
import { ExerciseIllustration } from '../components/AssetComponents';

export default function ExerciseDetails() {
  const { id } = useParams();
  const exercise = getExerciseById(id);

  if (!exercise) {
    return (
      <div className="text-center py-20 bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-8">
        <p className="text-[#202124] font-bold mb-2">Exercise not found</p>
        <Link to="/exercises" className="text-[#5B55E8] font-semibold text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Library
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto page-enter"
    >
      {/* Back button */}
      <Link to="/exercises" className="inline-flex items-center gap-2 text-[#6B6F76] hover:text-[#202124] text-xs font-bold uppercase tracking-wider transition-colors">
        <ArrowLeft size={16} />
        Exercise Library
      </Link>

      {/* Main Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                exercise.difficulty === 'Beginner'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {exercise.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#202124]">{exercise.name}</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {exercise.target?.map(t => (
                <span key={t} className="text-xs bg-[#EEECFF] text-[#5B55E8] font-bold px-3 py-1 rounded-full border border-[#E7E4DC]">
                  {t}
                </span>
              ))}
            </div>
            <Link
              to={`/workout?add=${exercise.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B55E8] hover:bg-[#4B45D8] text-white rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              + Add to Today's Workout
            </Link>
          </div>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-center">
          <div>
            <Dumbbell size={20} className="text-[#5B55E8] mx-auto mb-1" />
            <p className="text-xs md:text-sm font-bold text-[#202124]">{exercise.equipment}</p>
            <p className="text-[11px] text-[#6B6F76] font-medium">Equipment</p>
          </div>
          <div className="border-x border-[#E7E4DC]">
            <Target size={20} className="text-[#5B55E8] mx-auto mb-1" />
            <p className="text-xs md:text-sm font-bold text-[#202124]">{exercise.sets} × {exercise.reps}</p>
            <p className="text-[11px] text-[#6B6F76] font-medium">Sets × Reps</p>
          </div>
          <div>
            <Clock size={20} className="text-[#5B55E8] mx-auto mb-1" />
            <p className="text-xs md:text-sm font-bold text-[#202124]">{exercise.restSeconds}s</p>
            <p className="text-[11px] text-[#6B6F76] font-medium">Rest Time</p>
          </div>
        </div>
      </div>

      {/* SVG Illustration Banner */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[260px] shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <ExerciseIllustration 
          exerciseId={exercise.id} 
          name={exercise.name}
          className="h-56 w-auto object-contain rounded-xl drop-shadow-sm"
        />
      </div>

      {/* Instructions */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-lg font-bold text-[#202124] mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-[#5B55E8]" /> Step-by-Step Instructions
        </h2>
        <ol className="space-y-4">
          {exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#EEECFF] text-[#5B55E8] border border-[#E7E4DC] text-xs font-extrabold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#202124] leading-relaxed font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Breathing Guide */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-2 flex items-center gap-2">
          <Wind size={18} className="text-sky-500" />
          Breathing Technique
        </h2>
        <p className="text-xs text-[#202124] font-medium leading-relaxed bg-sky-50 border border-sky-100 rounded-2xl p-4">
          {exercise.breathing}
        </p>
      </div>

      {/* Common Mistakes */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" />
          Form Check — Common Mistakes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exercise.commonMistakes.map((m, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium">
              <span className="text-amber-600 font-black">✕</span>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Beginner & Progression */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <h2 className="text-sm font-bold text-[#202124] mb-2 flex items-center gap-2">
            <Shield size={18} className="text-emerald-500" />
            Beginner Option
          </h2>
          <p className="text-xs text-[#202124] font-medium leading-relaxed bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            {exercise.beginnerVariation}
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <h2 className="text-sm font-bold text-[#202124] mb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#5B55E8]" />
            Progression Challenge
          </h2>
          <p className="text-xs text-[#202124] font-medium leading-relaxed bg-[#EEECFF]/60 border border-[#E7E4DC] rounded-2xl p-4">
            {exercise.progression}
          </p>
        </div>
      </div>

      {/* Safety Note */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1 flex items-center gap-2">
          <Shield size={16} className="text-rose-600" />
          Safety Guidance
        </h2>
        <p className="text-xs text-rose-700 font-medium leading-relaxed">{exercise.safety}</p>
      </div>
    </motion.div>
  );
}
