from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

from .database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(BigInteger, primary_key=True, index=True)

    title = Column(String(255), index=True)
    company = Column(String(255), index=True)
    location = Column(String(255), index=True)

    salary_min = Column(Float)
    salary_max = Column(Float)
    average_salary = Column(Float)

    contract_type = Column(String(100))
    category = Column(String(255))

    created = Column(DateTime, default=datetime.utcnow)
    description = Column(Text)
    redirect_url = Column(String(512))

    posting_year = Column(Integer)
    posting_month = Column(String(20))
    posting_day = Column(Integer)
    posting_weekday = Column(String(20))

    city = Column(String(255), index=True)
    state = Column(String(255), index=True)

    skills = Column(Text)
