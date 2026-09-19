import os
import pandas as pd


def load_data():

    df = pd.read_csv("data/raw/jobs_raw.csv")

    print(f"Loaded {len(df)} records")

    return df
def clean_titles(df):
    df["Title"] = df["Title"].str.strip().str.title()
    return df


def clean_company(df):
    df["Company"] = df["Company"].fillna("Unknown")
    return df


def clean_contract_type(df):
    df["Contract Type"] = df["Contract Type"].fillna("Not Specified")
    return df

def clean_salary(df):

    # Fill one salary with the other if available
    df["Salary Min"] = df["Salary Min"].fillna(df["Salary Max"])
    df["Salary Max"] = df["Salary Max"].fillna(df["Salary Min"])

    # Create a new feature
    df["Average Salary"] = (
        df["Salary Min"] + df["Salary Max"]
    ) / 2

    return df

def clean_dates(df):

    # Convert Created column to datetime
    df["Created"] = pd.to_datetime(df["Created"])

    # Create new columns
    df["Posting Year"] = df["Created"].dt.year
    df["Posting Month"] = df["Created"].dt.month_name()
    df["Posting Day"] = df["Created"].dt.day
    df["Posting Weekday"] = df["Created"].dt.day_name()

    return df


def clean_location(df):

    # Split Location into City and State
    location_split = df["Location"].str.split(",", n=1, expand=True)

    df["City"] = location_split[0].str.strip()

    if location_split.shape[1] > 1:
        df["State"] = location_split[1].str.strip()
    else:
        df["State"] = "Unknown"

    df["State"] = df["State"].fillna("Unknown")

    return df



def main():

    df = load_data()

    df = clean_titles(df)
    df = clean_company(df)
    df = clean_contract_type(df)
    df = clean_salary(df)
    df = clean_dates(df)
    df = clean_location(df)

    # Create processed data folder
    os.makedirs("data/processed", exist_ok=True)

    # Save cleaned dataset
    df.to_csv(
        "data/processed/jobs_clean.csv",
        index=False
    )

    print("\nClean dataset saved successfully!")
    print(f"Total records: {len(df)}")
    print(f"Total columns: {len(df.columns)}")

if __name__ == "__main__":
    main()