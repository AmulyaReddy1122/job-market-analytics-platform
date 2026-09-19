import { useMemo } from "react";

export default function Skills({ jobs = [] }) {
  const skillData = useMemo(() => {
    const counts = {};

    jobs.forEach((job) => {
      if (!job.skills || job.skills === "Not Specified") return;

      job.skills.split(",").forEach((skill) => {
        const name = skill.trim();
        if (!name) return;

        counts[name] = (counts[name] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / jobs.length) * 100).toFixed(1),
      }));
  }, [jobs]);

  const totalSkills = skillData.length;

  const jobsWithSkills = useMemo(
    () =>
      jobs.filter(
        (job) => job.skills && job.skills !== "Not Specified"
      ).length,
    [jobs]
  );

  const topSkill = skillData[0];

  return (
    <section className="jm-skills-page">
      <div className="jm-skills-header">
        <p className="jm-eyebrow">SKILL INTELLIGENCE</p>

        <h1>Skills Analytics</h1>

        <p>
          Discover the most in-demand technical skills across{" "}
          {jobs.length.toLocaleString("en-IN")} job postings.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="jm-skills-kpis">
        <div className="jm-skills-kpi">
          <span className="jm-skills-kpi__icon">✦</span>

          <div>
            <p>Skills Detected</p>
            <strong>{totalSkills}</strong>
          </div>
        </div>

        <div className="jm-skills-kpi">
          <span className="jm-skills-kpi__icon">💼</span>

          <div>
            <p>Jobs With Skills</p>
            <strong>{jobsWithSkills.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="jm-skills-kpi">
          <span className="jm-skills-kpi__icon">🔥</span>

          <div>
            <p>Top Skill</p>
            <strong>{topSkill?.name || "N/A"}</strong>
          </div>
        </div>
      </div>

      {/* TOP SKILLS */}
      <div className="jm-skills-panel">
        <div className="jm-skills-panel__header">
          <div>
            <h2>Top In-Demand Skills</h2>
            <p>
              Skills appearing most frequently in job descriptions
            </p>
          </div>
        </div>

        <div className="jm-skills-list">
          {skillData.map((skill, index) => (
            <div className="jm-skill-row" key={skill.name}>
              <div className="jm-skill-rank">
                #{index + 1}
              </div>

              <div className="jm-skill-name">
                <strong>{skill.name}</strong>

                <span>
                  {skill.count.toLocaleString("en-IN")} jobs
                </span>
              </div>

              <div className="jm-skill-bar">
                <div
                  className="jm-skill-bar__fill"
                  style={{
                    width: `${Math.max(
                      4,
                      (skill.count / skillData[0].count) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="jm-skill-percentage">
                {skill.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {skillData.length === 0 && (
        <div className="jm-error">
          No skill data is available.
        </div>
      )}
    </section>
  );
}