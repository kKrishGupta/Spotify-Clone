const Loader = ({ variant = "page", count = 5 }) => {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="glass-soft animate-pulse rounded-3xl p-3">
            <div className="aspect-square rounded-2xl bg-white/10" />
            <div className="mt-4 h-4 w-3/4 rounded-full bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 rounded-[2rem] bg-white/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="h-56 rounded-3xl bg-white/10" />
        ))}
      </div>
    </div>
  );
};

export default Loader;
