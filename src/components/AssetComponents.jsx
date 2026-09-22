import React from 'react';
import { EXERCISE_ASSETS, NORA_ASSETS, ILLUSTRATION_ASSETS } from '../assets';
import { Dumbbell } from 'lucide-react';

export function ExerciseIllustration({ exerciseId, name = '', category = '', className = 'w-full h-40 object-contain' }) {
  const svgSrc = EXERCISE_ASSETS[exerciseId];

  if (svgSrc) {
    return (
      <img
        src={svgSrc}
        alt={`${name || exerciseId} illustration`}
        className={`${className} transition-transform duration-200 hover:scale-105`}
      />
    );
  }

  // Category visual themes
  const catKey = (category || '').toLowerCase();
  let bgClass = 'bg-[#EEECFF] text-[#5B55E8] border-[#D8D4FF]';
  let badgeLabel = category || 'Exercise';

  if (catKey.includes('back') || catKey.includes('full body')) {
    bgClass = 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]';
  } else if (catKey.includes('leg') || catKey.includes('glute') || catKey.includes('hamstring') || catKey.includes('calf')) {
    bgClass = 'bg-[#FEF7E0] text-[#B06000] border-[#FDE293]';
  } else if (catKey.includes('bicep') || catKey.includes('tricep') || catKey.includes('arm')) {
    bgClass = 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]';
  } else if (catKey.includes('core') || catKey.includes('mobility') || catKey.includes('abs')) {
    bgClass = 'bg-[#E8F0FE] text-[#1A73E8] border-[#AECBFA]';
  }

  return (
    <div className={`rounded-2xl border flex flex-col items-center justify-center p-3 text-center transition-transform duration-200 hover:scale-[1.02] ${bgClass} ${className}`}>
      <Dumbbell size={28} className="mb-1.5 opacity-90 stroke-[2.2]" />
      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-white/70 rounded-full backdrop-blur-xs">
        {badgeLabel}
      </span>
    </div>
  );
}

export function NoraAvatar({ state = 'idle', size = 40, className = '' }) {
  const svgSrc = NORA_ASSETS[state] || NORA_ASSETS.idle;
  return (
    <img
      src={svgSrc}
      alt={`Nora ${state}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-full shrink-0 transition-all ${className}`}
    />
  );
}

export function WorkoutCompleteIllustration({ className = 'w-48 h-40 mx-auto' }) {
  return (
    <img
      src={ILLUSTRATION_ASSETS.workoutComplete}
      alt="Workout Complete"
      className={className}
    />
  );
}
