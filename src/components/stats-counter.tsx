type Props = { count: number; demo: boolean };

export function StatsCounter({ count, demo }: Props) {
  return (
    <div className="stats-counter" aria-label={`${count} lights on Earth`}>
      <span className="live-dot" aria-hidden="true" />
      <span>{count.toLocaleString("en-US")} {count === 1 ? "light" : "lights"}</span>
      {demo && <span className="demo-pill">Demo</span>}
    </div>
  );
}
