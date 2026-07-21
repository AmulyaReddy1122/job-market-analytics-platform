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


def clean_dates(df):
    return df


def clean_location(df):
    return df

def main():

    df = load_data()
    
    df = clean_titles(df)
    df = clean_company(df)
    df = clean_contract_type(df)
    df = clean_dates(df)
    df = clean_location(df)

    print("\nMissing Values:\n")
    print(df.isnull().sum())

    print("\nColumns:\n")
    print(df.columns)
    print("\nData Types:\n")
    print(df.dtypes)

    print("\nFirst Five Rows:\n")
    print(df.head())

    


if __name__ == "__main__":
    main()