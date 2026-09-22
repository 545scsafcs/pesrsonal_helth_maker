import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EXERCISES, CATEGORIES, EQUIPMENTS, DIFFICULTIES, searchExercises } from '../data/exercises';
import { Search, ChevronRight, Dumbbell, Filter, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { ExerciseIllustration } from '../components/AssetComponents';

export default function Exercises() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [equipment, setEquipment] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [addedIds, setAddedIds] = useState([]);

  const filtered = searchExercises(search, category, equipment, difficulty);

  const handleQuickAdd = (e, exerciseId) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedIds(prev => [...prev, exerciseId]);
    setTimeout(() => {
      navigate(`/workout?add=${exerciseId}`);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 page-enter"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EEECFF] text-[#5B55E8] border border-[#E7E4DC]">
              {EXERCISES.length} Exercises
            </span>
            <span className="text-xs text-[#6B6F76] font-medium">12 Target Categories</span>
          </div>
          <h1 className="text-2xl font-black text-[#202124] tracking-tight">Exercise Library</h1>
          <p className="text-[#6B6F76] text-xs font-medium mt-0.5">
            Complete database of home dumbbell & bodyweight movements with step-by-step form tips.
          </p>
        </div>

        {/* Multi-Faceted Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA3]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercise or muscle..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8] transition-all font-medium"
            />
          </div>

          {/* Equipment Dropdown */}
          <div className="relative">
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs text-[#202124] focus:outline-none focus:border-[#5B55E8] font-bold cursor-pointer appearance-none"
            >
              <option value="All">Equipment: All</option>
              {EQUIPMENTS.filter(eq => eq !== 'All').map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs text-[#202124] focus:outline-none focus:border-[#5B55E8] font-bold cursor-pointer appearance-none"
            >
              <option value="All">Level: All</option>
              {DIFFICULTIES.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-[#5B55E8] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E7E4DC] text-[#6B6F76] hover:bg-[#F1F0EB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Stats */}
      <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#6B6F76]">
        <span>Showing {filtered.length} of {EXERCISES.length} exercises</span>
        {(search || category !== 'All' || equipment !== 'All' || difficulty !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setEquipment('All');
              setDifficulty('All');
            }}
            className="text-[#5B55E8] hover:underline font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex, i) => {
          const isAdded = addedIds.includes(ex.id);
          return (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
            >
              <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 hover:border-[#5B55E8] transition-all group relative overflow-hidden shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex flex-col justify-between h-full min-h-[170px]">
                <div className="flex items-start gap-4 mb-3">
                  {/* SVG Illustration Container */}
                  <div className="w-20 h-20 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl p-1.5 shrink-0 flex items-center justify-center group-hover:bg-[#EEECFF]/40 transition-colors">
                    <ExerciseIllustration 
                      exerciseId={ex.id} 
                      name={ex.name} 
                      category={ex.category}
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="font-bold text-[#202124] group-hover:text-[#5B55E8] transition-colors text-sm truncate">
                        {ex.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        ex.difficulty === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ex.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6F76] font-medium truncate">
                      {ex.category} · {ex.target?.join(', ')}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5 text-[11px] font-semibold text-[#6B6F76]">
                      <span className="bg-[#EEECFF] text-[#5B55E8] px-2 py-0.5 rounded-lg border border-[#E7E4DC] shrink-0 font-bold">
                        {ex.defaultSets || ex.sets} × {ex.defaultReps || ex.reps}
                      </span>
                      <span className="text-[#9A9DA3]">•</span>
                      <span className="truncate">{ex.equipment}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F1F0EB]">
                  <button
                    onClick={e => handleQuickAdd(e, ex.id)}
                    disabled={isAdded}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#F7F6F2] hover:bg-[#EEECFF] text-[#202124] hover:text-[#5B55E8] border border-[#E7E4DC]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus size={14} className="text-[#5B55E8]" />
                        + Workout
                      </>
                    )}
                  </button>

                  <Link
                    to={`/exercises/${ex.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6B6F76] hover:text-[#5B55E8] transition-colors"
                  >
                    Guide <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl">
          <Dumbbell size={36} className="mx-auto text-[#9A9DA3] mb-3" />
          <p className="text-[#202124] font-bold text-sm">No matching exercises found</p>
          <p className="text-[#6B6F76] text-xs mt-1">Try clearing your search terms or adjusting filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setEquipment('All');
              setDifficulty('All');
            }}
            className="mt-4 px-4 py-2 bg-[#5B55E8] text-white rounded-xl text-xs font-bold hover:bg-[#4B45D8] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </motion.div>
  );
}
