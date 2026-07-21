import os
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")

BASE_URL = "https://api.adzuna.com/v1/api/jobs"

COUNTRY = "in"

RESULTS_PER_PAGE = 50

MAX_PAGES = 5

JOB_ROLES = [
    "Data Analyst",
    "Data Scientist",
    "Business Analyst",
    "Data Engineer",
    "Machine Learning Engineer",
    "AI Engineer"
]