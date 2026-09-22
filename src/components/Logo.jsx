export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Rounded Container */}
      <rect width="40" height="40" rx="12" fill="#EEECFF" />
      
      {/* V + H Heartbeat Pulse Path */}
      <path
        d="M9 13L14 26L18 16L22 24L26 14L31 27"
        stroke="#5B55E8"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Accent Heartbeat Dot */}
      <circle cx="31" cy="14" r="2" fill="#5B55E8" />
    </svg>
  );
}
