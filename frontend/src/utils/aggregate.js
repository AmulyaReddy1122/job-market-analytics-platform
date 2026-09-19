const INDIAN_FORMATTER = new Intl.NumberFormat("en-IN");

function formatINR(value) {
  if (value == null || Number.isNaN(value)) return "—";
  const v = Number(value);
  if (v >= 100000) {
    const l = v / 100000;
    return `₹ ${Number.isInteger(l) ? l : l.toFixed(1)} LPA`;
  }
  return `₹ ${INDIAN_FORMATTER.format(Math.round(v))}`;
}

function formatCount(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return INDIAN_FORMATTER.format(Number(value));
}

function safeLower(value) {
  return value == null ? "" : String(value).trim().toLowerCase();
}

function countBy(items, keyFn, topN = null, sortByValueDesc = true) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (key == null || key === "") continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  let list = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  if (sortByValueDesc) {
    list.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  } else {
    list.sort((a, b) => a.label.localeCompare(b.label));
  }
  if (topN != null) list = list.slice(0, topN);
  return list;
}

export function computeKPIs(jobs) {
  const list = Array.isArray(jobs) ? jobs : [];

  const totalJobs = list.length;

  let companies = new Set();
  let salarySum = 0;
  let salaryCount = 0;
  let withSkills = 0;

  for (const job of list) {
    const company = safeLower(job?.company);
    if (company && company !== "unknown") companies.add(job.company);

    const sal = Number(job?.average_salary);
    if (Number.isFinite(sal) && sal > 0) {
      salarySum += sal;
      salaryCount += 1;
    }

    const skills = safeLower(job?.skills);
    if (skills && skills !== "not specified") withSkills += 1;
  }

  const avgSalary = salaryCount > 0 ? Math.round(salarySum / salaryCount) : null;

  return {
    totalJobs: {
      label: "Total Jobs",
      value: formatCount(totalJobs),
      raw: totalJobs,
    },
    avgSalary: {
      label: "Average Salary",
      value: formatINR(avgSalary),
      raw: avgSalary,
    },
    companies: {
      label: "Companies",
      value: formatCount(companies.size),
      raw: companies.size,
    },
    withSkills: {
      label: "Jobs With Skills",
      value: formatCount(withSkills),
      raw: withSkills,
    },
  };
}

export function jobsByRole(jobs, topN = 6) {
  return countBy(
    jobs,
    (job) => (job?.title != null && String(job.title).trim() !== "" ? String(job.title).trim() : null),
    topN
  );
}

export function topSkills(jobs, topN = 10) {
  const counts = new Map();
  for (const job of jobs) {
    const skillsRaw = job?.skills;
    if (skillsRaw == null) continue;
    const skillsStr = String(skillsRaw).trim();
    if (!skillsStr || skillsStr.toLowerCase() === "not specified") continue;
    const parts = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      counts.set(part, (counts.get(part) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, topN);
}

export function jobsByCity(jobs, topN = 10) {
  return countBy(
    jobs,
    (job) => {
      const city = job?.city;
      if (city == null) return null;
      const c = String(city).trim();
      if (!c || c.toLowerCase() === "unknown") return null;
      return c;
    },
    topN
  );
}

export function jobsByYear(jobs) {
  const list = countBy(
    jobs,
    (job) => {
      const year = job?.posting_year;
      if (year == null || Number.isNaN(Number(year))) return null;
      const y = Number(year);
      if (!Number.isFinite(y) || y < 1990 || y > 2100) return null;
      return String(Math.round(y));
    },
    null,
    false
  );
  list.sort((a, b) => a.label.localeCompare(b.label));
  return list;
}

export function normalizeRecentJobs(jobs, limit = 6) {
  const list = Array.isArray(jobs) ? jobs : [];
  return list.slice(0, limit).map((job) => ({
    id: job?.id,
    title: job?.title || "Untitled role",
    company: job?.company || "Unknown",
    location: job?.location || job?.city || "—",
    salary_min: job?.salary_min,
    salary_max: job?.salary_max,
    average_salary: job?.average_salary,
    skills: parseSkills(job?.skills),
    url: job?.redirect_url || "#",
  }));
}

function parseSkills(skillsRaw) {
  if (skillsRaw == null) return [];
  const s = String(skillsRaw).trim();
  if (!s || s.toLowerCase() === "not specified") return [];
  return s.split(",").map((p) => p.trim()).filter(Boolean);
}

export const formatHelpers = { formatINR, formatCount };
