export default function LoadingWidget() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <span key={i} className="block w-1 h-4 bg-[#555] rounded-full animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  );
}