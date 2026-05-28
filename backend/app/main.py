from fastapi import FastAPI
from pydantic import BaseModel, Field
from services.ai_service import generate_sql
from fastapi.middleware.cors import CORSMiddleware
import dotenv
dotenv.dotenv_values
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sql-generator-kohl.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserMessage(BaseModel):
    database : str = Field(description="Give the database context"
                           ,examples=["mydb","user_db"])
    table_schema : str = Field(description="Give the database context"
                               ,examples=["user (id, name, email country), orders(id, user_id, total_price, created_at)"])
    message : str = Field(description="Give the database context",
                          examples=["Give me the 5 best students from the students table"])

@app.post("/")
async def home(message : UserMessage):
    
    response = await generate_sql(database=message.database,
        table_schema=message.table_schema,
        message=message.message)
    
    return {"response" : response}