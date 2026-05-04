import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.lexguard_ai

# Collection references
user_collection = database.get_collection("users")
analysis_collection = database.get_collection("analyses")

# Helper to format MongoDB documents
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "is_active": user["is_active"],
        "created_at": user["created_at"],
    }

def analysis_helper(analysis) -> dict:
    return {
        "id": str(analysis["_id"]),
        "filename": analysis["filename"],
        "file_type": analysis["file_type"],
        "risk_score": analysis["risk_score"],
        "summary": analysis["summary"],
        "full_analysis": analysis["full_analysis"],
        "user_id": str(analysis["user_id"]),
        "created_at": analysis["created_at"],
    }
