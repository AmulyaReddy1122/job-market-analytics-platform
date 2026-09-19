import os
import re
from collections import Counter

import pandas as pd


SKILLS = [
    "Python",
    "SQL",
    "Excel",
    "Microsoft Excel",
    "Power BI",
    "Tableau",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "AWS",
    "Azure",
    "GCP",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Git",
    "Linux",
    "Java",
    "C++",
    "Spark",
    "PySpark",
    "Hadoop",
    "Snowflake",
    "Airflow",
    "ETL",
    "Data Visualization",
    "Google Sheets",
    "Neo4j",
    "Graph RAG",
    "Data Governance",
    "Web Scraping",
]


INPUT_PATH = "data/processed/jobs_clean.csv"
OUTPUT_PATH = "data/processed/jobs_final.csv"


def load_data():
    df = pd.read_csv(INPUT_PATH)
    print(f"Loaded {len(df)} records from {INPUT_PATH}")
    return df


def build_skill_patterns(skills):
    sorted_skills = sorted(skills, key=lambda s: len(s), reverse=True)
    patterns = []
    for skill in sorted_skills:
        escaped = re.escape(skill)
        pattern = re.compile(rf"\b{escaped}\b", re.IGNORECASE)
        patterns.append((skill, pattern))
    return patterns


def extract_skills(df, skills=SKILLS):
    patterns = build_skill_patterns(skills)
    descriptions = df["Description"].fillna("").astype(str)

    detected_list = []
    skill_counter = Counter()
    records_with_skills = 0

    for desc in descriptions:
        found = []
        seen = set()
        for skill, pattern in patterns:
            normalized_skill = skill.lower()
            if pattern.search(desc) and normalized_skill not in seen:
                found.append(skill)
                seen.add(normalized_skill)

        pruned = []
        found_lower = [s.lower() for s in found]
        for i, skill in enumerate(found):
            skill_lower = found_lower[i]
            is_subsumed = False
            for j, other_lower in enumerate(found_lower):
                if i != j and len(other_lower) > len(skill_lower):
                    if re.search(rf"\b{re.escape(skill_lower)}\b", other_lower):
                        is_subsumed = True
                        break
            if not is_subsumed:
                pruned.append(skill)
                skill_counter[skill] += 1

        if pruned:
            records_with_skills += 1
            detected_list.append(", ".join(pruned))
        else:
            detected_list.append("Not Specified")

    df = df.copy()
    df["Skills"] = detected_list

    print(f"\nNumber of records processed: {len(df)}")
    print(f"Number of records containing at least one detected skill: {records_with_skills}")
    print(f"Number of records with no detected skills: {len(df) - records_with_skills}")

    print("\nTop 20 detected skills with their counts:")
    for rank, (skill, count) in enumerate(skill_counter.most_common(20), start=1):
        print(f"  {rank:>2}. {skill:<20} {count}")

    return df, skill_counter


def save_data(df):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"\nEnriched dataset saved to {OUTPUT_PATH}")


def main():
    df = load_data()
    df, _ = extract_skills(df)
    save_data(df)


if __name__ == "__main__":
    main()
