export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-secondary)" }}>
      <div className="flex flex-col items-center gap-3">
        <span className="spinner"
          style={{ width: 32, height: 32, borderWidth: 3 }} />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
