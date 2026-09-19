import { useEffect, useMemo, useState } from "react";

const JOBS_PER_PAGE = 10;

export default function Jobs({ jobs = [], initialSearch = "" }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [city, setCity] = useState("All");
  const [skill, setSkill] = useState("All");
  const [salary, setSalary] = useState("All");
  const [page, setPage] = useState(1);
  useEffect(() => {
  setSearch(initialSearch);
  setPage(1);
}, [initialSearch]);

  const roles = useMemo(
    () => [
      "All",
      ...new Set(jobs.map((job) => job.title).filter(Boolean)),
    ],
    [jobs]
  );

  const cities = useMemo(
    () => [
      "All",
      ...new Set(jobs.map((job) => job.city).filter(Boolean)),
    ],
    [jobs]
  );

  const skills = useMemo(() => {
    const skillSet = new Set();

    jobs.forEach((job) => {
      if (job.skills && job.skills !== "Not Specified") {
        job.skills.split(",").forEach((item) => {
          const value = item.trim();
          if (value) skillSet.add(value);
        });
      }
    });


    return ["All", ...Array.from(skillSet).sort()];
  }, [jobs]);
  const exportCSV = () => {
  if (!jobs.length) return;

  const headers = Object.keys(jobs[0]);

  const csvRows = [
    headers.join(","),
    ...jobs.map((job) =>
      headers
        .map((header) => {
          const value = job[header] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "job_market_data.csv";
  link.click();

  URL.revokeObjectURL(url);
};

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.skills?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query);

      const matchesRole =
        role === "All" || job.title === role;

      const matchesCity =
        city === "All" || job.city === city;

      const matchesSkill =
        skill === "All" ||
        job.skills
          ?.split(",")
          .map((s) => s.trim())
          .includes(skill);

      let matchesSalary = true;

      if (salary !== "All") {
        const jobSalary = Number(job.average_salary);

        if (!jobSalary) {
          matchesSalary = false;
        } else if (salary === "Below 5 LPA") {
          matchesSalary = jobSalary < 500000;
        } else if (salary === "5 - 10 LPA") {
          matchesSalary = jobSalary >= 500000 && jobSalary < 1000000;
        } else if (salary === "10 - 20 LPA") {
          matchesSalary = jobSalary >= 1000000 && jobSalary < 2000000;
        } else if (salary === "20+ LPA") {
          matchesSalary = jobSalary >= 2000000;
        }
      }

      return (
        matchesSearch &&
        matchesRole &&
        matchesCity &&
        matchesSkill &&
        matchesSalary
      );
    });
  }, [jobs, search, role, city, skill, salary]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="jm-jobs-page">
      <div className="jm-jobs-header">
        <div>
          <p className="jm-eyebrow">JOB EXPLORER</p>

          <div className="jm-jobs-title-row">
  <h1>Find Your Next Opportunity</h1>

  <button
    type="button"
    className="jm-export-btn"
    onClick={exportCSV}
  >
    ↓ Export CSV
  </button>
</div>

          <p>
            Search and filter through{" "}
            {jobs.length.toLocaleString("en-IN")} job postings.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="jm-job-filters">

        <input
          type="text"
          placeholder="Search jobs, companies, skills..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={role}
          onChange={(e) =>
            changeFilter(setRole, e.target.value)
          }
        >
          {roles.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Roles" : item}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) =>
            changeFilter(setCity, e.target.value)
          }
        >
          {cities.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Cities" : item}
            </option>
          ))}
        </select>

        <select
          value={skill}
          onChange={(e) =>
            changeFilter(setSkill, e.target.value)
          }
        >
          {skills.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Skills" : item}
            </option>
          ))}
        </select>

        <select
          value={salary}
          onChange={(e) =>
            changeFilter(setSalary, e.target.value)
          }
        >
          <option value="All">All Salaries</option>
          <option value="Below 5 LPA">Below 5 LPA</option>
          <option value="5 - 10 LPA">5 - 10 LPA</option>
          <option value="10 - 20 LPA">10 - 20 LPA</option>
          <option value="20+ LPA">20+ LPA</option>
        </select>

      </div>

      {/* RESULT COUNT */}
      <div className="jm-job-count">
        {filteredJobs.length.toLocaleString("en-IN")} jobs found
      </div>

      {/* JOB LIST */}
      <div className="jm-jobs-list">

        {paginatedJobs.map((job) => (
          <article
            className="jm-job-card"
            key={job.id}
          >
            <div className="jm-job-card__main">

              <h3>
                {job.title || "Untitled Position"}
              </h3>

              <p className="jm-job-company">
                {job.company || "Unknown Company"}
              </p>

              <p className="jm-job-location">
                📍{" "}
                {job.location ||
                  "Location not specified"}
              </p>

              <div className="jm-job-meta">

                {job.average_salary ? (
                  <span>
                    ₹
                    {(
                      job.average_salary / 100000
                    ).toFixed(1)}{" "}
                    LPA
                  </span>
                ) : (
                  <span>
                    Salary not specified
                  </span>
                )}

                <span>
                  {job.contract_type ||
                    "Not Specified"}
                </span>

              </div>

              {job.skills &&
                job.skills !== "Not Specified" && (
                  <div className="jm-job-skills">
                    {job.skills
                      .split(",")
                      .map((skillName) => (
                        <span key={skillName}>
                          {skillName.trim()}
                        </span>
                      ))}
                  </div>
                )}

            </div>

            {job.redirect_url && (
              <a
                className="jm-btn jm-btn--primary"
                href={job.redirect_url}
                target="_blank"
                rel="noreferrer"
              >
                View Job →
              </a>
            )}

          </article>
        ))}

        {filteredJobs.length === 0 && (
          <div className="jm-error">
            No jobs match your current search or filters.
          </div>
        )}

      </div>

      {/* PAGINATION */}
      {filteredJobs.length > 0 && (
        <div className="jm-pagination">

          <button
            className="jm-pagination__button"
            disabled={currentPage === 1}
            onClick={() =>
              setPage((value) => value - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="jm-pagination__button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((value) => value + 1)
            }
          >
            Next →
          </button>

        </div>
      )}
    </section>
  );
}