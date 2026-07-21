import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")

url = (
    f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    f"?app_id={APP_ID}"
    f"&app_key={APP_KEY}"
    f"&results_per_page=20"
    f"&what=Data Analyst"
    f"&content-type=application/json"
)

response = requests.get(url)

if response.status_code != 200:
    print("Error:", response.status_code)
    print(response.text)
    exit()

data = response.json()

jobs = []

for job in data["results"]:
    jobs.append({
        "Title": job.get("title"),
        "Company": job.get("company", {}).get("display_name"),
        "Location": job.get("location", {}).get("display_name"),
        "Salary Min": job.get("salary_min"),
        "Salary Max": job.get("salary_max"),
        "Contract Type": job.get("contract_type"),
        "Category": job.get("category", {}).get("label"),
        "Created": job.get("created"),
        "Description": job.get("description"),
        "Redirect URL": job.get("redirect_url")
    })

df = pd.DataFrame(jobs)

os.makedirs("data/raw", exist_ok=True)

df.to_csv("data/raw/jobs_raw.csv", index=False)

print(df.head())
print(f"\nSaved {len(df)} jobs to data/raw/jobs_raw.csv")