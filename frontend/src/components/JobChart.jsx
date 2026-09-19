import { useMemo, useState } from "react";
import Icon from "./Icon";

const CHART_TYPES = {
  "Jobs by Role": "bar",
  "Top Skills": "hbar",
  "Jobs by City": "bar",
  "Jobs by Year": "line",
};

const PALETTE = [
  "var(--accent)",
  "var(--kpi-blue)",
  "var(--kpi-teal)",
  "var(--kpi-pink)",
];

function formatNumber(v) {
  if (!Number.isFinite(Number(v))) return "0";
  const n = Number(v);
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="jm-chart__bars">
      {data.length === 0 ? (
        <div className="jm-empty jm-empty--chart">
          <Icon name="chart" size={26} />
          <p>No data to display yet.</p>
        </div>
      ) : (
        data.map((d, i) => {
          const h = Math.max(4, Math.round((d.value / max) * 160));
          return (
            <div className="jm-chart__bar-col" key={d.label}>
              <div className="jm-chart__bar-value">{formatNumber(d.value)}</div>
              <div className="jm-chart__bar-track">
                <div
                  className="jm-chart__bar-fill"
                  style={{
                    height: `${h}px`,
                    background: color || PALETTE[i % PALETTE.length],
                  }}
                  title={`${d.label}: ${d.value}`}
                />
              </div>
              <div className="jm-chart__bar-label">{d.label}</div>
            </div>
          );
        })
      )}
    </div>
  );
}

function HorizontalBarChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="jm-empty jm-empty--chart">
        <Icon name="sparkles" size={26} />
        <p>No skills found in the current dataset.</p>
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="jm-chart__hbars">
      {data.map((d, i) => {
        const w = Math.max(3, Math.round((d.value / max) * 100));
        return (
          <div className="jm-chart__hbar-row" key={d.label}>
            <div className="jm-chart__hbar-label">{d.label}</div>
            <div className="jm-chart__hbar-track">
              <div
                className="jm-chart__hbar-fill"
                style={{ width: `${w}%`, background: PALETTE[i % PALETTE.length] }}
              />
            </div>
            <div className="jm-chart__hbar-value">{d.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, color }) {
  if (data.length === 0) {
    return (
      <div className="jm-empty jm-empty--chart">
        <Icon name="chart" size={26} />
        <p>No yearly data to display yet.</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const w = 520;
  const h = 200;
  const padL = 36;
  const padR = 16;
  const padT = 20;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const points = data.map((d, i) => {
    const x =
      data.length === 1 ? padL + innerW / 2 : padL + (i * innerW) / (data.length - 1);
    const y = padT + innerH - ((d.value - min) / range) * innerH;
    return { x, y, d };
  });
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L${points[points.length - 1].x.toFixed(1)},${(padT + innerH).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(min + range * t));

  return (
    <div className="jm-chart__line-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="jm-chart__line"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Jobs by year trend"
      >
        <defs>
          <linearGradient id="line-area" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor={color || "var(--accent)"}
              stopOpacity="0.35"
            />
            <stop
              offset="100%"
              stopColor={color || "var(--accent)"}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => {
          const y = padT + innerH - (i * innerH) / (ticks.length - 1);
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={w - padR}
                y1={y}
                y2={y}
                stroke="var(--chart-grid)"
                strokeDasharray="3 4"
              />
              <text x={8} y={y + 4} fontSize="10" fill="var(--jm-text-muted)">
                {formatNumber(t)}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#line-area)" />
        <path
          d={linePath}
          fill="none"
          stroke={color || "var(--accent)"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="var(--jm-surface)"
              stroke={color || "var(--accent)"}
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={h - 10}
              fontSize="10"
              fill="var(--jm-text-muted)"
              textAnchor="middle"
            >
              {p.d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarSkeleton() {
  return (
    <div className="jm-chart__bars">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="jm-chart__bar-col" key={i}>
          <div className="jm-skeleton jm-skeleton--sm" />
          <div className="jm-chart__bar-track">
            <div
              className="jm-chart__bar-fill jm-skeleton"
              style={{ height: `${50 + ((i * 13) % 100)}px` }}
            />
          </div>
          <div className="jm-skeleton jm-skeleton--xsm" />
        </div>
      ))}
    </div>
  );
}

function HBarSkeleton() {
  return (
    <div className="jm-chart__hbars">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="jm-chart__hbar-row" key={i}>
          <div className="jm-skeleton jm-skeleton--label-s" />
          <div className="jm-chart__hbar-track">
            <div
              className="jm-chart__hbar-fill jm-skeleton"
              style={{ width: `${30 + ((i * 7) % 60)}%` }}
            />
          </div>
          <div className="jm-skeleton jm-skeleton--xsm" />
        </div>
      ))}
    </div>
  );
}

function LineSkeleton() {
  return (
    <div className="jm-chart__line-wrap jm-skeleton--line-wrap">
      <svg
        viewBox="0 0 520 200"
        className="jm-chart__line"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <rect x="36" y="20" width="468" height="152" fill="var(--jm-bg-2)" opacity="0.5" rx="4" />
        <line x1="36" y1="172" x2="504" y2="172" stroke="var(--jm-border)" strokeDasharray="3 4" />
        <line x1="36" y1="134" x2="504" y2="134" stroke="var(--jm-border)" strokeDasharray="3 4" />
        <line x1="36" y1="96" x2="504" y2="96" stroke="var(--jm-border)" strokeDasharray="3 4" />
        <line x1="36" y1="58" x2="504" y2="58" stroke="var(--jm-border)" strokeDasharray="3 4" />
        <line x1="36" y1="20" x2="504" y2="20" stroke="var(--jm-border)" strokeDasharray="3 4" />
      </svg>
    </div>
  );
}

export default function JobChart({ title, subtitle, data, variantHint, loading, error }) {
  const variant = variantHint || CHART_TYPES[title] || "bar";
  const [range, setRange] = useState("12m");

  const color = useMemo(() => {
    if (title === "Jobs by Role") return PALETTE[0];
    if (title === "Top Skills") return PALETTE[3];
    if (title === "Jobs by City") return PALETTE[1];
    if (title === "Jobs by Year") return PALETTE[0];
    return PALETTE[0];
  }, [title]);

  return (
    <section className="jm-card jm-chart">
      <header className="jm-card__header">
        <div>
          <h3 className="jm-card__title">{title}</h3>
          {subtitle && <p className="jm-card__subtitle">{subtitle}</p>}
        </div>
        <div className="jm-card__actions">
          <div className="jm-segmented" role="tablist" aria-label="Range">
            {["6m", "12m", "All"].map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={loading}
                className={`jm-segmented__btn ${range === opt ? "is-active" : ""}`}
                onClick={() => setRange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="jm-icon-btn"
            type="button"
            aria-label="More options"
            disabled={loading}
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </header>
      <div className="jm-card__body">
        {loading ? (
          <>
            {variant === "bar" && <BarSkeleton />}
            {variant === "hbar" && <HBarSkeleton />}
            {variant === "line" && <LineSkeleton />}
          </>
        ) : error ? (
          <div className="jm-error jm-error--inline">
            <Icon name="chart" size={22} />
            <div>
              <strong>Unable to load chart data.</strong>
              <div>{error}</div>
            </div>
          </div>
        ) : (
          <>
            {variant === "bar" && <BarChart data={data || []} color={color} />}
            {variant === "hbar" && <HorizontalBarChart data={data || []} />}
            {variant === "line" && <LineChart data={data || []} color={color} />}
          </>
        )}
      </div>
    </section>
  );
}
