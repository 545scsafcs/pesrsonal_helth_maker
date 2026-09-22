import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WORKOUT_OPTIONS, getWorkoutPlan } from '../data/workoutPlans';
import { EXERCISES } from '../data/exercises';
import { Dumbbell, Plus, Trash2, Play, Sparkles, Search, CheckCircle, Clock, Activity, FileText } from 'lucide-react';
import { NoraAvatar, ExerciseIllustration } from '../components/AssetComponents';
import WorkoutPlayer from '../components/WorkoutPlayer';
import { api } from '../services/api';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Workout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState('full-body');
  const [customExercises, setCustomExercises] = useState([]);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [todaySession, setTodaySession] = useState(null);

  const activeWorkoutId = searchParams.get('active');
  const activePlan = activeWorkoutId ? getWorkoutPlan(activeWorkoutId) : null;

  useEffect(() => {
    fetchTodaySession();
  }, []);

  const fetchTodaySession = async () => {
    try {
      const session = await api.get('/api/workouts?today=true');
      if (session) setTodaySession(session);
    } catch {}
  };

  // Initialize with selected template or url param exercise
  useEffect(() => {
    const addId = searchParams.get('add');
    if (addId) {
      const addedExercise = EXERCISES.find(e => e.id === addId);
      if (addedExercise) {
        setCustomExercises(prev => {
          if (prev.some(e => e.id === addId)) return prev;
          return [
            ...prev,
            {
              ...addedExercise,
              sets: 3,
              reps: '10–12',
              weight: addedExercise.equipment?.includes('12') ? '12 kg' : addedExercise.equipment?.includes('5') ? '5 kg' : 'Bodyweight',
              restSeconds: 60,
              notes: '',
            }
          ];
        });
      }
      return;
    }

    const template = getWorkoutPlan(selectedTemplate);
    if (template && template.exerciseDetails) {
      setCustomExercises(template.exerciseDetails.map(ex => ({
        ...ex,
        sets: ex.sets || 3,
        reps: ex.reps || '10–12',
        weight: ex.equipment?.includes('12') ? '12 kg' : ex.equipment?.includes('5') ? '5 kg' : 'Bodyweight',
        restSeconds: ex.restSeconds || 60,
        notes: '',
      })));
    }
  }, [selectedTemplate, searchParams]);

  if (activePlan) {
    return (
      <WorkoutPlayer
        workoutPlan={{
          ...activePlan,
          exerciseDetails: customExercises.length > 0 ? customExercises : activePlan.exerciseDetails
        }}
        onExit={() => {
          sessionStorage.removeItem('vh-active-workout');
          setSearchParams({});
          fetchTodaySession();
        }}
      />
    );
  }

  const handleAddExerciseFromPicker = (exercise) => {
    setCustomExercises(prev => [
      ...prev,
      {
        ...exercise,
        sets: 3,
        reps: '10–12',
        weight: exercise.equipment?.includes('12') ? '12 kg' : exercise.equipment?.includes('5') ? '5 kg' : 'Bodyweight',
        restSeconds: 60,
        notes: '',
      }
    ]);
    setShowPickerModal(false);
  };

  const handleRemoveExercise = (index) => {
    setCustomExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExerciseParam = (index, field, value) => {
    setCustomExercises(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleStartWorkout = () => {
    sessionStorage.setItem('vh-active-workout', selectedTemplate);
    setSearchParams({ active: selectedTemplate });
  };

  const totalSets = customExercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 3), 0);
  const estMinutes = Math.round(totalSets * 2.5);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.target?.some(t => t.toLowerCase().includes(selectedMuscle.toLowerCase()));
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E7E4DC] shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Build Today's Workout</h1>
          <p className="text-[#6B6F76] text-sm mt-1 font-medium">
            {DAY_NAMES[new Date().getDay()]} • You choose your exercises, sets, weight, and rest intervals.
          </p>
        </div>

        <button
          onClick={handleStartWorkout}
          disabled={customExercises.length === 0}
          className="px-6 py-3 rounded-xl bg-[#21A366] text-white font-semibold text-sm hover:bg-[#1C8955] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Play size={18} fill="currentColor" />
          <span>Start Workout ({customExercises.length} Exercises)</span>
        </button>
      </div>

      {/* Today's Activity / Session Summary Section (Feature 8) */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-[#5B55E8]" />
            <h2 className="text-base font-bold text-[#202124]">Today's Activity / Session Summary</h2>
          </div>
          <span className="text-[10px] font-bold text-[#5B55E8] bg-[#EEECFF] px-2 py-0.5 rounded-md border border-[#E7E4DC]">
            Database Persisted Log
          </span>
        </div>

        {todaySession ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6F76]">Status</p>
              <p className="text-sm font-bold text-[#202124] capitalize mt-1 flex items-center gap-1.5">
                <CheckCircle size={16} className={todaySession.status === 'completed' ? 'text-[#21A366]' : 'text-[#D89B25]'} />
                {todaySession.status}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6F76]">Workout Plan</p>
              <p className="text-sm font-bold text-[#202124] truncate mt-1">{todaySession.workoutName || todaySession.workoutType}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6F76]">Sets Completed</p>
              <p className="text-sm font-bold text-[#202124] mt-1">{todaySession.completedSets || 0} / {todaySession.totalSets || 0} Sets</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6F76]">Duration</p>
              <p className="text-sm font-bold text-[#202124] mt-1 flex items-center gap-1">
                <Clock size={15} className="text-[#5B55E8]" />
                {todaySession.durationMinutes || 0} mins
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC] text-center">
            <p className="text-xs text-[#9A9DA3] font-medium italic">No workout session recorded for today yet. Use the builder below to start!</p>
          </div>
        )}
      </div>

      {/* Nora Suggestion Card */}
      <div className="bg-[#EEECFF]/60 p-4 rounded-2xl border border-[#5B55E8]/20 flex items-start gap-3.5">
        <NoraAvatar state="speaking" size={36} />
        <div className="flex-1">
          <p className="text-xs font-bold text-[#5B55E8] uppercase tracking-wider">Nora's Advice</p>
          <p className="text-sm text-[#202124] mt-0.5 font-medium">
            Pick a quick template or add your favorite dumbbell moves below. Take 60-90s rest between heavy sets for best results!
          </p>
        </div>
      </div>

      {/* Quick Template Picker Suggestions */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B6F76] flex items-center gap-2">
          <Sparkles size={16} className="text-[#5B55E8]" />
          <span>Quick Template Suggestions (Optional Starting Point)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WORKOUT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedTemplate(opt.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedTemplate === opt.id
                  ? 'bg-[#EEECFF] border-[#5B55E8] text-[#5B55E8] font-bold shadow-xs'
                  : 'bg-[#FFFFFF] border-[#E7E4DC] text-[#202124] hover:border-[#5B55E8]/50'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <p className="text-xs font-bold mt-2">{opt.label}</p>
              <p className="text-[10px] text-[#6B6F76] mt-0.5 line-clamp-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Exercise Builder Section */}
      <div className="app-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#202124]">Workout Plan Details</h3>
            <p className="text-xs text-[#6B6F76] mt-0.5">{customExercises.length} exercises selected • ~{estMinutes} mins total duration</p>
          </div>

          <button
            onClick={() => setShowPickerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#5B55E8] text-white text-xs font-semibold hover:bg-[#4B45D8] transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <Plus size={16} />
            <span>Add Exercise</span>
          </button>
        </div>

        {/* Selected Exercises List */}
        {customExercises.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#E7E4DC] rounded-2xl">
            <Dumbbell size={40} className="mx-auto text-[#9A9DA3] mb-3" />
            <h4 className="text-base font-semibold text-[#202124]">No Exercises Selected</h4>
            <p className="text-xs text-[#6B6F76] mt-1 max-w-sm mx-auto">
              Click "+ Add Exercise" above to select dumbbell or bodyweight moves for today.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customExercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#E7E4DC] bg-[#F1F0EB]/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E7E4DC] p-1 flex items-center justify-center">
                      <ExerciseIllustration exerciseId={ex.id} name={ex.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202124]">{ex.name}</h4>
                      <p className="text-xs text-[#6B6F76]">{ex.equipment} • Target: {ex.target?.join(', ')}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(idx)}
                    className="p-2 rounded-xl text-[#9A9DA3] hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Remove exercise"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Parameter Editor Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E7E4DC]">
                  <div>
                    <label className="text-[10px] font-bold text-[#6B6F76] uppercase">Sets</label>
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={e => handleUpdateExerciseParam(idx, 'sets', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-[#FFFFFF] text-xs font-semibold text-[#202124] mt-1 focus:outline-none focus:border-[#5B55E8]"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6B6F76] uppercase">Reps</label>
                    <input
                      type="text"
                      value={ex.reps}
                      onChange={e => handleUpdateExerciseParam(idx, 'reps', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-[#FFFFFF] text-xs font-semibold text-[#202124] mt-1 focus:outline-none focus:border-[#5B55E8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6B6F76] uppercase">Weight</label>
                    <input
                      type="text"
                      value={ex.weight}
                      onChange={e => handleUpdateExerciseParam(idx, 'weight', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-[#FFFFFF] text-xs font-semibold text-[#202124] mt-1 focus:outline-none focus:border-[#5B55E8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6B6F76] uppercase">Rest (sec)</label>
                    <input
                      type="number"
                      value={ex.restSeconds}
                      onChange={e => handleUpdateExerciseParam(idx, 'restSeconds', parseInt(e.target.value) || 30)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-[#FFFFFF] text-xs font-semibold text-[#202124] mt-1 focus:outline-none focus:border-[#5B55E8]"
                      step="15"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Exercise Picker */}
      {showPickerModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 max-w-lg w-full border border-[#E7E4DC] shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#202124]">Select Exercise to Add</h3>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-2.5 text-[#9A9DA3]" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E7E4DC] bg-[#F7F6F2] text-xs text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                />
              </div>
              <select
                value={selectedMuscle}
                onChange={e => setSelectedMuscle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E7E4DC] bg-[#F7F6F2] text-xs text-[#202124] focus:outline-none focus:border-[#5B55E8]"
              >
                <option value="all">All Muscles</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="legs">Legs</option>
                <option value="shoulders">Shoulders</option>
                <option value="arms">Arms / Biceps / Triceps</option>
                <option value="core">Core / Abs</option>
              </select>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseFromPicker(ex)}
                  className="p-3 rounded-xl border border-[#E7E4DC] bg-[#F7F6F2]/60 hover:border-[#5B55E8] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] border border-[#E7E4DC] p-1 flex items-center justify-center shrink-0">
                      <ExerciseIllustration exerciseId={ex.id} name={ex.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#202124]">{ex.name}</p>
                      <p className="text-[10px] text-[#6B6F76]">{ex.equipment} • {ex.target.join(', ')}</p>
                    </div>
                  </div>
                  <Plus size={16} className="text-[#5B55E8]" />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPickerModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6F76] hover:bg-[#F1F0EB]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
