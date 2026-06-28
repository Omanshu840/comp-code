export const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <img
        src="/comp-code/compcode-mark.png"
        alt="CompCode Logo"
        className="h-20 w-20 animate-pulse rounded-2xl border border-primary"
      />
    </div>
  );
};