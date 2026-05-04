from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class User(UserBase):
    id: str = Field(..., alias="_id")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Analysis History Schemas
class AnalysisHistoryBase(BaseModel):
    filename: str
    file_type: str
    risk_score: float
    summary: str
    full_analysis: str

class AnalysisHistoryCreate(AnalysisHistoryBase):
    pass

class AnalysisHistory(AnalysisHistoryBase):
    id: str = Field(..., alias="_id")
    created_at: datetime
    user_id: str

    class Config:
        populate_by_name = True
        from_attributes = True
