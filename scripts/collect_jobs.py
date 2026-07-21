import os
import requests
import pandas as pd

from config import (
    APP_ID,
    APP_KEY,
    BASE_URL,
    COUNTRY,
    RESULTS_PER_PAGE,
    MAX_PAGES,
    JOB_ROLES,
)


def fetch_jobs(role, page):

    url = (
        f"{BASE_URL}/{COUNTRY}/search/{page}"
        f"?app_id={APP_ID}"
        f"&app_key={APP_KEY}"
        f"&results_per_page={RESULTS_PER_PAGE}"
        f"&what={role}"
        f"&content-type=application/json"
    )

    response = requests.get(url)

    if response.status_code == 200:
        return response.json()["results"]

    print(f"Failed: {role} Page {page}")
    return []


def main():

    all_jobs = []

    for role in JOB_ROLES:

        print(f"\nCollecting jobs for: {role}")

        for page in range(1, MAX_PAGES + 1):

            print(f"  Fetching page {page}...")

            jobs = fetch_jobs(role, page)

            all_jobs.extend(jobs)

    print(f"\nTotal jobs collected: {len(all_jobs)}")

    jobs_list = []

    for job in all_jobs:
        jobs_list.append({
            "Title": job.get("title"),
            "Company": job.get("company", {}).get("display_name"),
            "Location": job.get("location", {}).get("display_name"),
            "Salary Min": job.get("salary_min"),
            "Salary Max": job.get("salary_max"),
            "Contract Type": job.get("contract_type"),
            "Category": job.get("category", {}).get("label"),
            "Created": job.get("created"),
            "Description": job.get("description"),
            "Redirect URL": job.get("redirect_url"),
        })

    df = pd.DataFrame(jobs_list)

    print(f"\nBefore removing duplicates: {len(df)}")

    df.drop_duplicates(inplace=True)

    print(f"After removing duplicates: {len(df)}")

    os.makedirs("data/raw", exist_ok=True)

    df.to_csv("data/raw/jobs_raw.csv", index=False)

    print("\nCSV saved successfully!")


if __name__ == "__main__":
    main()