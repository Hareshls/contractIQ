import os
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from parsers import parse_pdf, parse_docx, parse_txt
from analyzer import analyze_contract
import uvicorn
import database, schemas, auth
from database import user_collection, analysis_collection, user_helper, analysis_helper

app = FastAPI(title="Smart Contract Risk Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    try:
        await database.client.admin.command('ping')
        print("MongoDB Connection: SUCCESSFUL")
    except Exception as e:
        print(f"MongoDB Connection: FAILED | Error: {e}")

@app.get("/")
async def root():
    return {"status": "online", "message": "LexGuard AI Backend Ready"}

# --- AUTH ENDPOINTS ---

@app.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user_data = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    result = await user_collection.insert_one(new_user_data)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    return user_helper(created_user)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: dict = Depends(auth.get_current_user)):
    return user_helper(current_user)

# --- ANALYSIS ENDPOINTS ---

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...), 
    current_user: dict = Depends(auth.get_current_user)
):
    content = await file.read()
    filename = file.filename.lower()
    
    try:
        if filename.endswith(".pdf"):
            text = parse_pdf(content)
        elif filename.endswith(".docx"):
            text = parse_docx(content)
        elif filename.endswith(".txt"):
            text = parse_txt(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")
            
        analysis = analyze_contract(text)
        
        # Save to history in MongoDB
        new_history = {
            "filename": file.filename,
            "file_type": filename.split('.')[-1],
            "risk_score": analysis.get("risk_score", 0),
            "summary": analysis.get("summary", ""),
            "full_analysis": json.dumps(analysis),
            "user_id": str(current_user["_id"]),
            "created_at": datetime.utcnow()
        }
        await analysis_collection.insert_one(new_history)
        
        # Return full analysis enriched with metadata
        return {
            **analysis,
            "filename": file.filename,
            "id": str(new_history["_id"]),
            "created_at": new_history["created_at"].isoformat()
        }
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/history", response_model=list[schemas.AnalysisHistory])
async def get_history(
    current_user: dict = Depends(auth.get_current_user)
):
    cursor = analysis_collection.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    analyses = await cursor.to_list(length=100)
    return [analysis_helper(a) for a in analyses]

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
