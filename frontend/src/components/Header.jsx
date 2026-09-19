import { useState } from "react";
import Icon from "./Icon";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "jobs", label: "Jobs", icon: "briefcase" },
  { key: "skills", label: "Skills", icon: "sparkles" },
  { key: "salary", label: "Salary Insights", icon: "calculator" },
  { key: "ai", label: "AI Assistant", icon: "chat" },
];

export default function Header({
  active,
  onNavigate,
  onToggleSidebar,
  onSearch,
}) {
  const [query, setQuery] = useState("");
  return (
    <header className="jm-header">
      <div className="jm-header__left">
        <button
          type="button"
          className="jm-icon-btn jm-header__menu"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="jm-logo">
          <div className="jm-logo__mark">
            <Icon name="bolt" size={18} stroke="#fff" />
          </div>
          <div className="jm-logo__text">
            <span className="jm-logo__name">Job Market Analytics</span>
            <span className="jm-logo__tag">India · Job Market Analytics</span>
          </div>
        </div>
      </div>

      <nav className="jm-header__nav" aria-label="Primary">
        <ul>
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`jm-nav-btn ${active === item.key ? "is-active" : ""}`}
                onClick={() => onNavigate(item.key)}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="jm-header__right">
        <div className="jm-search">
          <Icon name="search" size={16} />
          <input
  type="search"
  placeholder="Search jobs, skills, companies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
      onNavigate("jobs");
    }
  }}
/>
          <kbd className="jm-kbd">⌘K</kbd>
        </div>
        <div className="jm-avatar" aria-label="User profile">
          <span>AM</span>
        </div>
      </div>
    </header>
  );
}
