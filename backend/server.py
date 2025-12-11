from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class MoodEntryCreate(BaseModel):
    emotion: str
    emotion_level: int
    energy_level: int
    focus_level: int
    overthinking: str
    additional_notes: Optional[str] = None

class MoodEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    emotion: str
    emotion_level: int
    energy_level: int
    focus_level: int
    overthinking: str
    additional_notes: Optional[str] = None
    ai_guidance: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MoodTrend(BaseModel):
    date: str
    emotion: str
    emotion_level: int
    energy_level: int
    focus_level: int

class LifestyleAssessmentCreate(BaseModel):
    sleep_quality: int
    nutrition: int
    social_connection: int
    purpose_growth: int
    stress_management: int
    notes: Optional[str] = None
    date: str

class LifestyleAssessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sleep_quality: int
    nutrition: int
    social_connection: int
    purpose_growth: int
    stress_management: int
    notes: Optional[str] = None
    date: str
    average_score: float

# Helper function to generate AI guidance
async def generate_mood_guidance(mood_data: MoodEntryCreate) -> str:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return "Unable to generate guidance at this time. Please try again later."
        
        # Create a unique session ID for each request
        session_id = f"mood-guidance-{uuid.uuid4()}"
        
        # System message for the AI
        system_message = """You are a compassionate mental wellness assistant. Your role is to:
1. Acknowledge the user's emotional state with empathy
2. Validate their feelings
3. Provide 3-5 practical, actionable coping strategies
4. Suggest wellness activities appropriate to their energy and focus levels
5. Offer encouragement and remind them this feeling is temporary

Keep responses warm, supportive, and under 200 words. Focus on immediate, practical help."""
        
        # Initialize the chat
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system_message
        )
        
        # Use Claude Sonnet 4
        chat.with_model("anthropic", "claude-4-sonnet-20250514")
        
        # Create the user message
        user_prompt = f"""Current emotional state:
- Dominant emotion: {mood_data.emotion}
- Emotion intensity: {mood_data.emotion_level}/10
- Energy level: {mood_data.energy_level}/10
- Focus level: {mood_data.focus_level}/10
- Overthinking: {mood_data.overthinking}
{f'- Additional notes: {mood_data.additional_notes}' if mood_data.additional_notes else ''}

Please provide personalized wellness guidance and coping strategies."""
        
        user_message = UserMessage(text=user_prompt)
        
        # Send the message and get the response
        response = await chat.send_message(user_message)
        
        return response
    except Exception as e:
        logger.error(f"Error generating AI guidance: {str(e)}")
        return f"I hear you're feeling {mood_data.emotion.lower()}. Remember to take deep breaths, reach out to someone you trust, and be gentle with yourself. This feeling will pass."

# Routes
@api_router.get("/")
async def root():
    return {"message": "Mood Sync API"}

@api_router.post("/mood/submit", response_model=MoodEntry)
async def submit_mood(mood_input: MoodEntryCreate):
    try:
        # Generate AI guidance
        ai_guidance = await generate_mood_guidance(mood_input)
        
        # Create mood entry with AI guidance
        mood_dict = mood_input.model_dump()
        mood_dict['ai_guidance'] = ai_guidance
        mood_obj = MoodEntry(**mood_dict)
        
        # Store in MongoDB
        doc = mood_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.mood_entries.insert_one(doc)
        
        return mood_obj
    except Exception as e:
        logger.error(f"Error submitting mood: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/mood/history", response_model=List[MoodEntry])
async def get_mood_history(limit: int = 30):
    try:
        # Get recent mood entries
        mood_entries = await db.mood_entries.find(
            {}, 
            {"_id": 0}
        ).sort("timestamp", -1).limit(limit).to_list(limit)
        
        # Convert ISO string timestamps back to datetime objects
        for entry in mood_entries:
            if isinstance(entry['timestamp'], str):
                entry['timestamp'] = datetime.fromisoformat(entry['timestamp'])
        
        return mood_entries
    except Exception as e:
        logger.error(f"Error fetching mood history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/mood/trends", response_model=List[MoodTrend])
async def get_mood_trends(days: int = 14):
    try:
        # Calculate date range
        end_date = datetime.now(timezone.utc)
        start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Get mood entries for trend analysis
        mood_entries = await db.mood_entries.find(
            {},
            {"_id": 0, "timestamp": 1, "emotion": 1, "emotion_level": 1, "energy_level": 1, "focus_level": 1}
        ).sort("timestamp", -1).limit(days * 5).to_list(days * 5)
        
        # Convert to trend format
        trends = []
        for entry in mood_entries:
            timestamp = entry['timestamp']
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp)
            
            trends.append(MoodTrend(
                date=timestamp.strftime("%Y-%m-%d %H:%M"),
                emotion=entry['emotion'],
                emotion_level=entry['emotion_level'],
                energy_level=entry['energy_level'],
                focus_level=entry['focus_level']
            ))
        
        return trends
    except Exception as e:
        logger.error(f"Error fetching mood trends: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
