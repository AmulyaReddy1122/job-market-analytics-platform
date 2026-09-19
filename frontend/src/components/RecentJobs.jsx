import Icon from "./Icon";

function formatSalary(value) {
  if (value == null || Number.isNaN(Number(value))) return "Not listed";
  const n = Number(value);
  const abs = Math.round(n);
  if (abs >= 100000) {
    const l = (abs / 100000).toFixed(abs % 100000 === 0 ? 0 : 1);
    return `₹ ${l} LPA`;
  }
  return `₹ ${abs.toLocaleString("en-IN")}`;
}

function TableSkeleton({ rows = 6 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td className="jm-job">
            <div className="jm-job__avatar jm-skeleton jm-skeleton--circle" />
            <div style={{ width: "100%" }}>
              <div className="jm-skeleton jm-skeleton--label" />
              <div className="jm-skeleton jm-skeleton--xsm" />
            </div>
          </td>
          <td>
            <div className="jm-skeleton jm-skeleton--label-s" />
          </td>
          <td>
            <div className="jm-skeleton jm-skeleton--label-s" />
          </td>
          <td>
            <div className="jm-skeleton jm-skeleton--label" />
            <div className="jm-skeleton jm-skeleton--xsm" />
          </td>
          <td>
            <ul className="jm-skills">
              <li className="jm-skill-chip jm-skill-chip--skeleton" />
              <li className="jm-skill-chip jm-skill-chip--skeleton" />
              <li className="jm-skill-chip jm-skill-chip--skeleton" />
            </ul>
          </td>
          <td className="jm-td-right">
            <span className="jm-btn jm-btn--primary jm-btn--skeleton" aria-hidden="true">
              <span>View Job</span>
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default function RecentJobs({ jobs, loading, error, onRetry }) {
  const rows = Array.isArray(jobs) ? jobs : [];

  return (
    <section className="jm-card jm-recent">
      <header className="jm-card__header">
        <div>
          <h3 className="jm-card__title">Recent Jobs</h3>
          <p className="jm-card__subtitle">
            {loading
              ? "Loading latest postings from the backend..."
              : error
                ? "Could not load latest postings."
                : `Showing ${rows.length} most recent postings from the analytics dataset`}
          </p>
        </div>
        <div className="jm-card__actions">
          {error && (
            <button className="jm-btn jm-btn--ghost" type="button" onClick={onRetry}>
              Retry
            </button>
          )}
          <button className="jm-btn jm-btn--ghost" type="button">
            <Icon name="briefcase" size={14} />
            View all jobs
          </button>
        </div>
      </header>

      <div className="jm-recent__table-wrap" role="region" aria-label="Recent jobs table">
        <table className="jm-recent__table">
          <thead>
            <tr>
              <th className="jm-th-left">Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Skills</th>
              <th className="jm-th-right"></th>
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="6">
                  <div className="jm-error jm-error--inline jm-error--block">
                    <Icon name="chat" size={22} />
                    <div>
                      <strong>Could not load jobs.</strong>
                      <div>{error}</div>
                      {typeof onRetry === "function" && (
                        <button className="jm-btn jm-btn--primary" type="button" onClick={onRetry} style={{ marginTop: 10 }}>
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="6">
                  <div className="jm-empty jm-empty--table">
                    <Icon name="briefcase" size={26} />
                    <p>No jobs found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {rows.map((job) => (
                <tr key={job.id}>
                  <td className="jm-job">
                    <div className="jm-job__avatar">
                      {(job.title || "?").charAt(0)}
                    </div>
                    <div>
                      <div className="jm-job__title">{job.title}</div>
                      <div className="jm-job__meta">
                        #{job.id ?? "—"} · IT Jobs
                      </div>
                    </div>
                  </td>
                  <td className="jm-td-muted">{job.company}</td>
                  <td>
                    <div className="jm-loc">
                      <Icon name="location" size={14} />
                      <span>{job.location || "—"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="jm-sal">
                      <div className="jm-sal__avg">{formatSalary(job.average_salary)}</div>
                      {job.salary_min != null && job.salary_max != null && (
                        <div className="jm-sal__range">
                          {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <ul className="jm-skills">
                      {job.skills?.slice(0, 4).map((s) => (
                        <li key={s} className="jm-skill-chip">
                          {s}
                        </li>
                      ))}
                      {!job.skills?.length && (
                        <li className="jm-skill-chip jm-skill-chip--muted">
                          No listed skills
                        </li>
                      )}
                      {job.skills?.length > 4 && (
                        <li className="jm-skill-chip jm-skill-chip--muted">
                          +{job.skills.length - 4}
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="jm-td-right">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="jm-btn jm-btn--primary"
                    >
                      <span>View Job</span>
                      <Icon name="external" size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}
