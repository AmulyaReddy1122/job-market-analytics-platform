import sys
import traceback

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
import os


CSV_PATH = "data/processed/jobs_final.csv"

DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = int(os.getenv("MYSQL_PORT", "3306"))
DB_NAME = "job_market_db"
DB_USER = os.getenv("MYSQL_USERNAME")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")

TABLE_NAME = "jobs"

COLUMN_MAP = {
    "Title": "title",
    "Company": "company",
    "Location": "location",
    "Salary Min": "salary_min",
    "Salary Max": "salary_max",
    "Contract Type": "contract_type",
    "Category": "category",
    "Created": "created",
    "Description": "description",
    "Redirect URL": "redirect_url",
    "Average Salary": "average_salary",
    "Posting Year": "posting_year",
    "Posting Month": "posting_month",
    "Posting Day": "posting_day",
    "Posting Weekday": "posting_weekday",
    "City": "city",
    "State": "state",
    "Skills": "skills",
}


def build_engine():
    if not DB_USER or not DB_PASSWORD:
        raise RuntimeError(
            "Missing MySQL credentials in .env file. "
            "Please set MYSQL_USERNAME and MYSQL_PASSWORD."
        )
    url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(url)
    return engine


def load_csv():
    print(f"Reading {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH)
    print(f"Loaded {len(df)} rows from CSV.")
    return df


def map_columns(df):
    print(f"Mapping {len(COLUMN_MAP)} columns to MySQL schema ...")
    missing = [c for c in COLUMN_MAP.keys() if c not in df.columns]
    if missing:
        raise RuntimeError(
            f"CSV is missing required source columns: {missing}"
        )
    df = df.rename(columns=COLUMN_MAP)
    df = df[list(COLUMN_MAP.values())]
    return df


def load_to_db(df, engine):
    print(
        f"Loading {len(df)} rows into table '{TABLE_NAME}' (mode: append) ..."
    )
    rows_written = df.to_sql(
        name=TABLE_NAME,
        con=engine,
        if_exists="append",
        index=False,
        method="multi",
    )
    return rows_written


def main():
    engine = None
    try:
        print(
            f"Connecting to MySQL database '{DB_NAME}' "
            f"as user '{DB_USER or '(unset)'}' on {DB_HOST}:{DB_PORT} ..."
        )
        engine = build_engine()
        with engine.connect() as conn:
            pass
        print("Connection successful.")

        df = load_csv()
        df = map_columns(df)

        rows_written = load_to_db(df, engine)

        inserted = rows_written if rows_written is not None else len(df)
        print(
            f"\nSuccessfully loaded {inserted} rows into "
            f"{DB_NAME}.{TABLE_NAME}."
        )

    except Exception as exc:
        print("\nERROR: Failed to load data to MySQL.")
        print(f"Reason: {exc}")
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)
    finally:
        if engine is not None:
            engine.dispose()


if __name__ == "__main__":
    main()
