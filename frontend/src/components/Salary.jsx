import { useMemo } from "react";

const formatLPA = (value) => {
  if (!value) return "₹0";
  return `₹${(value / 100000).toFixed(1)} LPA`;
};

export default function Salary({ jobs = [] }) {
  const salaryData = useMemo(() => {
    const jobsWithSalary = jobs.filter(
      (job) =>
        job.average_salary !== null &&
        job.average_salary !== undefined &&
        Number(job.average_salary) > 0
    );

    if (jobsWithSalary.length === 0) {
      return {
        count: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        byRole: [],
        distribution: [],
      };
    }

    const salaries = jobsWithSalary.map((job) =>
      Number(job.average_salary)
    );

    const average =
      salaries.reduce((sum, value) => sum + value, 0) /
      salaries.length;

    const highest = Math.max(...salaries);
    const lowest = Math.min(...salaries);

    const roleMap = {};

    jobsWithSalary.forEach((job) => {
      const role = job.title || "Unknown";

      if (!roleMap[role]) {
        roleMap[role] = {
          total: 0,
          count: 0,
        };
      }

      roleMap[role].total += Number(job.average_salary);
      roleMap[role].count += 1;
    });

    const byRole = Object.entries(roleMap)
      .map(([role, data]) => ({
        role,
        average: data.total / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 10);

    const ranges = [
      { label: "Below 5 LPA", min: 0, max: 500000 },
      { label: "5 - 10 LPA", min: 500000, max: 1000000 },
      { label: "10 - 20 LPA", min: 1000000, max: 2000000 },
      { label: "20+ LPA", min: 2000000, max: Infinity },
    ];

    const distribution = ranges.map((range) => {
      const count = salaries.filter(
        (salary) =>
          salary >= range.min && salary < range.max
      ).length;

      return {
        ...range,
        count,
        percentage: (
          (count / salaries.length) *
          100
        ).toFixed(1),
      };
    });

    return {
      count: jobsWithSalary.length,
      average,
      highest,
      lowest,
      byRole,
      distribution,
    };
  }, [jobs]);

  return (
    <section className="jm-salary-page">
      <div className="jm-salary-header">
        <p className="jm-eyebrow">COMPENSATION INTELLIGENCE</p>

        <h1>Salary Insights</h1>

        <p>
          Explore salary trends across{" "}
          {jobs.length.toLocaleString("en-IN")} job postings.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="jm-salary-kpis">
        <div className="jm-salary-kpi">
          <div className="jm-salary-kpi__icon">₹</div>
          <div>
            <p>Average Salary</p>
            <strong>
              {formatLPA(salaryData.average)}
            </strong>
          </div>
        </div>

        <div className="jm-salary-kpi">
          <div className="jm-salary-kpi__icon">↑</div>
          <div>
            <p>Highest Salary</p>
            <strong>
              {formatLPA(salaryData.highest)}
            </strong>
          </div>
        </div>

        <div className="jm-salary-kpi">
          <div className="jm-salary-kpi__icon">💼</div>
          <div>
            <p>Jobs With Salary</p>
            <strong>
              {salaryData.count.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>

      {/* SALARY BY ROLE */}

      <div className="jm-salary-panel">
        <div className="jm-salary-panel__header">
          <div>
            <h2>Average Salary by Role</h2>
            <p>
              Highest-paying roles based on available salary data
            </p>
          </div>
        </div>

        <div className="jm-salary-role-list">
          {salaryData.byRole.map((item, index) => {
            const maxSalary =
              salaryData.byRole[0]?.average || 1;

            return (
              <div
                className="jm-salary-role"
                key={item.role}
              >
                <div className="jm-salary-role__rank">
                  #{index + 1}
                </div>

                <div className="jm-salary-role__name">
                  <strong>{item.role}</strong>
                  <span>
                    {item.count.toLocaleString("en-IN")} jobs
                  </span>
                </div>

                <div className="jm-salary-role__bar">
                  <div
                    className="jm-salary-role__fill"
                    style={{
                      width: `${Math.max(
                        5,
                        (item.average / maxSalary) * 100
                      )}%`,
                    }}
                  />
                </div>

                <div className="jm-salary-role__value">
                  {formatLPA(item.average)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SALARY DISTRIBUTION */}

      <div className="jm-salary-panel">
        <div className="jm-salary-panel__header">
          <div>
            <h2>Salary Distribution</h2>
            <p>
              Distribution of jobs across salary ranges
            </p>
          </div>
        </div>

        <div className="jm-salary-distribution">
          {salaryData.distribution.map((item) => (
            <div
              className="jm-salary-distribution__item"
              key={item.label}
            >
              <div className="jm-salary-distribution__top">
                <strong>{item.label}</strong>
                <span>{item.count} jobs</span>
              </div>

              <div className="jm-salary-distribution__bar">
                <div
                  className="jm-salary-distribution__fill"
                  style={{
                    width: `${Math.max(
                      item.count > 0 ? 4 : 0,
                      Number(item.percentage)
                    )}%`,
                  }}
                />
              </div>

              <span className="jm-salary-distribution__percentage">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {salaryData.count === 0 && (
        <div className="jm-error">
          No salary data is available.
        </div>
      )}
    </section>
  );
}