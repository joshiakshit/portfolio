import type { ReactNode } from 'react';

export type SketchAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function SketchFrame({
  title,
  badge = 'interactive',
  ariaLabel,
  readout,
  actions,
  children,
}: {
  title: string;
  badge?: string;
  ariaLabel: string;
  readout: string;
  actions: SketchAction[];
  children: ReactNode;
}) {
  return (
    <div className="project-sketch">
      <div className="sketch-topline">
        <span>{title}</span>
        <span className="sketch-demo">{badge}</span>
      </div>
      <svg className="sketch-svg" viewBox="0 0 380 210" aria-label={ariaLabel}>
        {children}
      </svg>
      <p className="sketch-readout" aria-live="polite">
        {readout}
      </p>
      <div className="sketch-controls">
        {actions.map((act, idx) => (
          <button
            key={idx}
            type="button"
            className="sketch-btn"
            onClick={act.onClick}
            disabled={act.disabled}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProgressRing({
  cx,
  cy,
  r,
  pct,
}: {
  cx: number;
  cy: number;
  r: number;
  pct: number;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className="doodle-orbit" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="attendance-ring"
        pathLength={100}
        strokeDasharray={`${pct} 100`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </>
  );
}
