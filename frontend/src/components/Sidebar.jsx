import Icon from "./Icon";

const sections = [
  {
    title: "Analytics",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "dashboard" },
      { key: "jobs", label: "Jobs", icon: "briefcase", badge: "1.5k" },
      { key: "skills", label: "Skills", icon: "sparkles", badge: "35" },
      { key: "salary", label: "Salary Insights", icon: "calculator" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { key: "ai", label: "AI Assistant", icon: "chat", badge: "Beta" },
      { key: "companies", label: "Companies", icon: "users" },
      { key: "locations", label: "Locations", icon: "location" },
    ],
  },
];

export default function Sidebar({ open, active, onNavigate }) {
  return (
    <aside className={`jm-sidebar ${open ? "is-open" : ""}`} aria-label="Sidebar">
      <div className="jm-sidebar__inner">
        <div className="jm-sidebar__summary-card">
          <div className="jm-sidebar__summary-title">Dataset Snapshot</div>
          <div className="jm-sidebar__summary-sub">Adzuna · India · Updated today</div>
          <ul className="jm-summary-list">
            <li>
              <span>Job records</span>
              <strong>1,500</strong>
            </li>
            <li>
              <span>Date range</span>
              <strong>2020 → 2026</strong>
            </li>
            <li>
              <span>Skill coverage</span>
              <strong>41.2%</strong>
            </li>
          </ul>
        </div>

        {sections.map((group) => (
          <div className="jm-sidebar__group" key={group.title}>
            <div className="jm-sidebar__group-title">{group.title}</div>
            <ul className="jm-sidebar__links">
              {group.items.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={`jm-sidebar__link ${
                      active === item.key ? "is-active" : ""
                    }`}
                    onClick={() => onNavigate(item.key)}
                  >
                    <span className="jm-sidebar__link-icon">
                      <Icon name={item.icon} size={18} />
                    </span>
                    <span className="jm-sidebar__link-label">{item.label}</span>
                    {item.badge && (
                      <span className="jm-pill">{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="jm-sidebar__foot">
          <div className="jm-sidebar__foot-icon">
            <Icon name="sparkles" size={18} />
          </div>
          <div>
            <div className="jm-sidebar__foot-title">Tip</div>
            <div className="jm-sidebar__foot-sub">
              Use the AI Assistant to ask free-form questions about the dataset.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
