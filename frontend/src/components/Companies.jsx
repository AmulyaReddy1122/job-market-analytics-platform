import { useMemo } from "react";

export default function Companies({ jobs = [] }) {
  const companies = useMemo(() => {
    const counts = {};

    jobs.forEach((job) => {
      const company = job.company?.trim();

      if (!company || company === "Unknown") return;

      counts[company] = (counts[company] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [jobs]);

  const uniqueCompanies = useMemo(
    () =>
      new Set(
        jobs
          .map((job) => job.company?.trim())
          .filter(Boolean)
          .filter((company) => company !== "Unknown")
      ).size,
    [jobs]
  );

  const topCompany = companies[0];

  return (
    <section className="jm-companies-page">
      <div className="jm-companies-header">
        <p className="jm-eyebrow">COMPANY INTELLIGENCE</p>

        <h1>Companies</h1>

        <p>
          Explore companies hiring across{" "}
          {jobs.length.toLocaleString("en-IN")} job postings.
        </p>
      </div>

      <div className="jm-companies-kpis">
        <div className="jm-companies-kpi">
          <p>Companies</p>
          <strong>
            {uniqueCompanies.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="jm-companies-kpi">
          <p>Top Hiring Company</p>
          <strong>
            {topCompany?.[0] || "N/A"}
          </strong>
        </div>

        <div className="jm-companies-kpi">
          <p>Top Company Postings</p>
          <strong>
            {topCompany?.[1]?.toLocaleString("en-IN") || 0}
          </strong>
        </div>
      </div>

      <div className="jm-companies-panel">
        <div className="jm-companies-panel__header">
          <h2>Top Hiring Companies</h2>
          <p>
            Companies with the highest number of job postings
          </p>
        </div>

        <div className="jm-companies-list">
          {companies.map(([company, count], index) => (
            <div
              className="jm-company-row"
              key={company}
            >
              <span className="jm-company-rank">
                #{index + 1}
              </span>

              <div className="jm-company-info">
                <strong>{company}</strong>
                <span>
                  {count.toLocaleString("en-IN")} postings
                </span>
              </div>

              <div className="jm-company-bar">
                <div
                  className="jm-company-bar__fill"
                  style={{
                    width: `${
                      (count / companies[0][1]) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {companies.length === 0 && (
        <div className="jm-error">
          No company data is available.
        </div>
      )}
    </section>
  );
}