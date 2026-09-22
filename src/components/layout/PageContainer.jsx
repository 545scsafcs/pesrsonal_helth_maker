export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 box-border font-sans ${className}`}>
      {children}
    </div>
  );
}
