import { motion } from 'framer-motion';

const STATES = {
  idle: { color1: '#818cf8', color2: '#6366f1', animation: 'pulse-soft' },
  speaking: { color1: '#34d399', color2: '#10b981', animation: 'pulse-soft' },
  thinking: { color1: '#fbbf24', color2: '#f59e0b', animation: 'pulse-soft' },
  workout: { color1: '#f472b6', color2: '#ec4899', animation: 'pulse-soft' },
  success: { color1: '#34d399', color2: '#10b981', animation: 'pulse-soft' },
};

export default function NoraAvatar({ state = 'idle', size = 48 }) {
  const s = STATES[state] || STATES.idle;
  const r = size / 2;
  const innerR = r * 0.65;
  const eyeR = r * 0.08;
  const eyeOffsetX = r * 0.2;
  const eyeOffsetY = -r * 0.05;

  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Nora avatar - ${state}`}
      >
        {/* Outer glow ring */}
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke={s.color1} strokeWidth="2" opacity="0.3" />
        
        {/* Main circle */}
        <defs>
          <radialGradient id={`nora-grad-${state}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor={s.color1} />
            <stop offset="100%" stopColor={s.color2} />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={innerR} fill={`url(#nora-grad-${state})`} />

        {/* Eyes */}
        <circle cx={r - eyeOffsetX} cy={r + eyeOffsetY} r={eyeR} fill="white" />
        <circle cx={r + eyeOffsetX} cy={r + eyeOffsetY} r={eyeR} fill="white" />

        {/* Smile */}
        <path
          d={`M ${r - eyeOffsetX} ${r + r * 0.15} Q ${r} ${r + r * 0.35} ${r + eyeOffsetX} ${r + r * 0.15}`}
          stroke="white"
          strokeWidth={Math.max(1.5, size * 0.03)}
          fill="none"
          strokeLinecap="round"
        />

        {/* Speaking indicator */}
        {state === 'speaking' && (
          <>
            <circle cx={r} cy={r} r={innerR + 6} fill="none" stroke={s.color1} strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values={`${innerR + 4};${innerR + 10};${innerR + 4}`} dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Thinking indicator */}
        {state === 'thinking' && (
          <>
            <circle cx={r + r * 0.55} cy={r - r * 0.4} r={3} fill={s.color1} opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx={r + r * 0.7} cy={r - r * 0.6} r={2} fill={s.color1} opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
            </circle>
          </>
        )}
      </svg>
    </motion.div>
  );
}
