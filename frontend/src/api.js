const API_BASE_URL = "http://127.0.0.1:8000";
const JOBS_PAGE_SIZE = 500;

export async function fetchAllJobs({ signal } = {}) {
  const allJobs = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${API_BASE_URL}/jobs?skip=${skip}&limit=${JOBS_PAGE_SIZE}`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(
        `API request failed with status ${res.status} ${res.statusText}`
      );
    }
    const json = await res.json();
    const page = Array.isArray(json) ? json : json.data || [];
    allJobs.push(...page);

    if (page.length < JOBS_PAGE_SIZE) {
      hasMore = false;
    } else {
      skip += JOBS_PAGE_SIZE;
      if (skip >= 10000) hasMore = false;
    }
  }

  return allJobs;
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  PAGE_SIZE: JOBS_PAGE_SIZE,
};
