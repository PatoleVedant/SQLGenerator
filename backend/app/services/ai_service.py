from google import genai
from core.config import GEMINI_API_KEY
import json
from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    role: str
    content: str

client = genai.Client(api_key=GEMINI_API_KEY)

async def generate_sql(
    database: str,
    table_schema: str,
    message: str,
    conversation_history: List[ChatMessage]
):

    history_text = ""

    for msg in conversation_history:
        history_text += f"{msg.role}: {msg.content}\n"

    full_prompt = f"""
You are an expert SQL query generator.

Database Name:
{database}

Available Tables and Columns:
{table_schema}

Conversation History:
{history_text}

Latest User Message:
{message}

Rules:
- Use ONLY the provided schema
- Never hallucinate tables or columns
- If the user request is ambiguous, ask a clarification question
- Use the conversation history to understand context
- Return ONLY valid JSON
- Do NOT wrap JSON in markdown

Response Format:
{{
    "sql": "SQL_QUERY_HERE",
    "needs_clarification": false,
    "clarification_question": null
}}

If clarification is needed:
{{
    "sql": null,
    "needs_clarification": true,
    "clarification_question": "YOUR_QUESTION"
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt
    )

    cleaned_response = response.text.strip()

    cleaned_response = cleaned_response.replace("```json", "")
    cleaned_response = cleaned_response.replace("```", "")
    cleaned_response = cleaned_response.strip()

    parsed_response = json.loads(cleaned_response)

    return parsed_response