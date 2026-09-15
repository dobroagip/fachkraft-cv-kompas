export default function ProgressBar({ step, total }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={[
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              n <= step ? 'bg-amber-600' : 'bg-navy-100'
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
