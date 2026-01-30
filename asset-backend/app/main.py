from fastapi import FastAPI
from app.routes import auth

app = FastAPI(title="Asset Management System")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"status": "API running"}
