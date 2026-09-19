-- =====================================================================
-- Job Market Analytics Platform - Standard Analytics Queries
-- Database : job_market_db
-- Table    : jobs
-- =====================================================================

USE job_market_db;


-- ---------------------------------------------------------------------
-- 1. Total number of jobs loaded in the dataset.
-- ---------------------------------------------------------------------
SELECT
    COUNT(*) AS total_jobs
FROM jobs;


-- ---------------------------------------------------------------------
-- 2. Number of jobs grouped by job title (top 20 most frequent).
-- ---------------------------------------------------------------------
SELECT
    title,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
GROUP BY title
ORDER BY job_count DESC
LIMIT 20;


-- ---------------------------------------------------------------------
-- 3. Number of jobs grouped by city (top 20 cities).
-- ---------------------------------------------------------------------
SELECT
    city,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE city IS NOT NULL AND city <> ''
GROUP BY city
ORDER BY job_count DESC
LIMIT 20;


-- ---------------------------------------------------------------------
-- 4. Top demanded technical skills across all jobs.
--    Splits the comma-separated "skills" column and counts each skill.
--    Excludes the "Not Specified" marker.
-- ---------------------------------------------------------------------
WITH RECURSIVE
  digits AS (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
    UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  ),
  numbers AS (
    SELECT 0 AS n UNION ALL
    SELECT d1.n + d2.n * 10 + d3.n * 100
      FROM digits d1 CROSS JOIN digits d2 CROSS JOIN digits d3
  ),
  split_skills AS (
    SELECT
      TRIM(
        SUBSTRING_INDEX(
          SUBSTRING_INDEX(j.skills, ',', numbers.n + 1),
          ',',
          -1
        )
      ) AS skill
    FROM jobs j
    JOIN numbers
      ON CHAR_LENGTH(j.skills) - CHAR_LENGTH(REPLACE(j.skills, ',', '')) >= numbers.n
    WHERE j.skills IS NOT NULL
      AND j.skills <> ''
      AND j.skills <> 'Not Specified'
  )
SELECT
    skill,
    COUNT(*) AS skill_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs WHERE skills <> 'Not Specified' AND skills IS NOT NULL), 2) AS pct_of_skillable_jobs
FROM split_skills
WHERE skill IS NOT NULL AND skill <> ''
GROUP BY skill
ORDER BY skill_count DESC
LIMIT 30;


-- ---------------------------------------------------------------------
-- 5. Average salary by job title.
--    Only considers jobs that have a valid average_salary.
-- ---------------------------------------------------------------------
SELECT
    title,
    COUNT(*) AS job_count,
    ROUND(AVG(average_salary), 0) AS avg_salary,
    ROUND(MIN(average_salary), 0) AS min_salary,
    ROUND(MAX(average_salary), 0) AS max_salary,
    ROUND(STDDEV(average_salary), 0) AS salary_stddev
FROM jobs
WHERE average_salary IS NOT NULL AND average_salary > 0
GROUP BY title
HAVING COUNT(*) >= 5
ORDER BY avg_salary DESC
LIMIT 20;


-- ---------------------------------------------------------------------
-- 6. Top hiring companies by number of job postings.
-- ---------------------------------------------------------------------
SELECT
    company,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE company IS NOT NULL AND company <> '' AND company <> 'Unknown'
GROUP BY company
ORDER BY job_count DESC
LIMIT 20;


-- ---------------------------------------------------------------------
-- 7. Number of jobs grouped by posting year, chronological order.
-- ---------------------------------------------------------------------
SELECT
    posting_year,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE posting_year IS NOT NULL
GROUP BY posting_year
ORDER BY posting_year ASC;


-- ---------------------------------------------------------------------
-- 8. Number of jobs grouped by posting month (Jan .. Dec).
-- ---------------------------------------------------------------------
SELECT
    posting_month,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE posting_month IS NOT NULL
GROUP BY posting_month, MONTH(STR_TO_DATE(CONCAT('01 ', posting_month, ' 2000'), '%d %M %Y'))
ORDER BY MONTH(STR_TO_DATE(CONCAT('01 ', posting_month, ' 2000'), '%d %M %Y')) ASC;


-- ---------------------------------------------------------------------
-- 9. Skills associated with average salary.
--    One row per skill, showing the mean salary of all jobs listing it.
-- ---------------------------------------------------------------------
WITH RECURSIVE
  digits AS (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
    UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  ),
  numbers AS (
    SELECT 0 AS n UNION ALL
    SELECT d1.n + d2.n * 10 + d3.n * 100
      FROM digits d1 CROSS JOIN digits d2 CROSS JOIN digits d3
  ),
  job_skill_pairs AS (
    SELECT
      j.id,
      j.average_salary,
      TRIM(
        SUBSTRING_INDEX(
          SUBSTRING_INDEX(j.skills, ',', numbers.n + 1),
          ',',
          -1
        )
      ) AS skill
    FROM jobs j
    JOIN numbers
      ON CHAR_LENGTH(j.skills) - CHAR_LENGTH(REPLACE(j.skills, ',', '')) >= numbers.n
    WHERE j.skills IS NOT NULL
      AND j.skills <> ''
      AND j.skills <> 'Not Specified'
      AND j.average_salary IS NOT NULL
      AND j.average_salary > 0
  )
SELECT
    skill,
    COUNT(*) AS job_count,
    ROUND(AVG(average_salary), 0) AS avg_salary,
    ROUND(MIN(average_salary), 0) AS min_salary,
    ROUND(MAX(average_salary), 0) AS max_salary
FROM job_skill_pairs
WHERE skill IS NOT NULL AND skill <> ''
GROUP BY skill
HAVING COUNT(*) >= 3
ORDER BY avg_salary DESC, job_count DESC;


-- ---------------------------------------------------------------------
-- 10. Number of jobs grouped by state (top 25 states).
-- ---------------------------------------------------------------------
SELECT
    state,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE state IS NOT NULL AND state <> '' AND state <> 'Unknown'
GROUP BY state
ORDER BY job_count DESC
LIMIT 25;


-- ---------------------------------------------------------------------
-- 11. Salary availability - how many jobs publish salary data.
-- ---------------------------------------------------------------------
SELECT
    CASE
        WHEN average_salary IS NOT NULL AND average_salary > 0 THEN 'Salary Provided'
        ELSE 'No Salary Listed'
    END AS salary_status,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
GROUP BY salary_status
ORDER BY job_count DESC;


-- ---------------------------------------------------------------------
-- 12. Number of jobs grouped by contract type.
-- ---------------------------------------------------------------------
SELECT
    COALESCE(NULLIF(contract_type, ''), 'Not Specified') AS contract_type,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
GROUP BY contract_type
ORDER BY job_count DESC;


-- ---------------------------------------------------------------------
-- 13. Number of jobs grouped by posting weekday (Mon .. Sun).
-- ---------------------------------------------------------------------
SELECT
    posting_weekday,
    COUNT(*) AS job_count,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM jobs), 2) AS pct_of_total
FROM jobs
WHERE posting_weekday IS NOT NULL
GROUP BY posting_weekday
ORDER BY FIELD(
    posting_weekday,
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);


-- ---------------------------------------------------------------------
-- 14. Skills by job role (title).
--     A cross-tab style count of the most frequent skills per top title.
-- ---------------------------------------------------------------------
WITH RECURSIVE
  digits AS (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
    UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  ),
  numbers AS (
    SELECT 0 AS n UNION ALL
    SELECT d1.n + d2.n * 10 + d3.n * 100
      FROM digits d1 CROSS JOIN digits d2 CROSS JOIN digits d3
  ),
  role_skills AS (
    SELECT
      j.title,
      TRIM(
        SUBSTRING_INDEX(
          SUBSTRING_INDEX(j.skills, ',', numbers.n + 1),
          ',',
          -1
        )
      ) AS skill,
      COUNT(*) OVER (PARTITION BY j.title) AS total_jobs_for_title
    FROM jobs j
    JOIN numbers
      ON CHAR_LENGTH(j.skills) - CHAR_LENGTH(REPLACE(j.skills, ',', '')) >= numbers.n
    WHERE j.skills IS NOT NULL
      AND j.skills <> ''
      AND j.skills <> 'Not Specified'
  ),
  ranked AS (
    SELECT
        title,
        skill,
        COUNT(*) AS skill_count,
        total_jobs_for_title,
        ROUND(100 * COUNT(*) / total_jobs_for_title, 2) AS pct_within_title,
        ROW_NUMBER() OVER (
            PARTITION BY title
            ORDER BY COUNT(*) DESC
        ) AS rn
    FROM role_skills
    WHERE skill IS NOT NULL AND skill <> ''
    GROUP BY title, skill, total_jobs_for_title
  )
SELECT
    title,
    skill,
    skill_count,
    pct_within_title,
    total_jobs_for_title
FROM ranked
WHERE rn <= 5
ORDER BY total_jobs_for_title DESC, title ASC, skill_count DESC
LIMIT 50;
