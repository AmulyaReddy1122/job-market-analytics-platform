import Icon from "./Icon";

const accents = {
  purple: { ring: "var(--kpi-purple)", soft: "var(--kpi-purple-soft)" },
  blue: { ring: "var(--kpi-blue)", soft: "var(--kpi-blue-soft)" },
  teal: { ring: "var(--kpi-teal)", soft: "var(--kpi-teal-soft)" },
  pink: { ring: "var(--kpi-pink)", soft: "var(--kpi-pink-soft)" },
};

export default function KPICard({ kpi, loading }) {
  const theme = accents[kpi?.accent] || accents.purple;

  if (loading) {
    return (
      <article className="jm-kpi jm-kpi--skeleton" aria-busy="true">
        <div className="jm-kpi__icon jm-skeleton jm-skeleton--circle" />
        <div className="jm-kpi__body">
          <div className="jm-skeleton jm-skeleton--label" />
          <div className="jm-skeleton jm-skeleton--value" />
        </div>
        <div className="jm-kpi__side">
          <div className="jm-skeleton jm-skeleton--delta" />
          <div className="jm-kpi__spark jm-skeleton jm-skeleton--spark" />
        </div>
      </article>
    );
  }

  const hasData =
    kpi?.raw != null &&
    !(typeof kpi.raw === "number" && Number.isNaN(kpi.raw));

  return (
    <article className="jm-kpi">
      <div
        className="jm-kpi__icon"
        style={{ background: theme.soft, color: theme.ring }}
      >
        <Icon name={kpi.icon} size={20} />
      </div>
      <div className="jm-kpi__body">
        <div className="jm-kpi__label">{kpi.label}</div>
        <div className="jm-kpi__value">{hasData ? kpi.value : "—"}</div>
      </div>
      <div className="jm-kpi__side">
        {hasData && kpi.delta ? (
          <span
            className={`jm-delta ${kpi.deltaType === "down" ? "is-down" : "is-up"}`}
          >
            <span className="jm-delta__arrow">
              {kpi.deltaType === "down" ? "▼" : "▲"}
            </span>
            {kpi.delta}
          </span>
        ) : (
          <span className="jm-delta jm-delta--muted">Live</span>
        )}
        <div className="jm-kpi__spark" aria-hidden="true">
          <svg width="86" height="28" viewBox="0 0 86 28" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`spark-${kpi.accent}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={theme.ring} stopOpacity="0.45" />
                <stop offset="100%" stopColor={theme.ring} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 22 L12 18 L24 20 L36 14 L48 16 L60 9 L72 11 L86 5 L86 28 L0 28 Z"
              fill={`url(#spark-${kpi.accent})`}
            />
            <path
              d="M0 22 L12 18 L24 20 L36 14 L48 16 L60 9 L72 11 L86 5"
              fill="none"
              stroke={theme.ring}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}
