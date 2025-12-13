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
    trigger: Optional[str] = None
    pattern: Optional[str] = None
    underlying_cause: Optional[str] = None
    additional_notes: Optional[str] = None

class MoodEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    emotion: str
    emotion_level: int
    energy_level: int
    focus_level: int
    overthinking: str
    trigger: Optional[str] = None
    pattern: Optional[str] = None
    underlying_cause: Optional[str] = None
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
{f'- Trigger: {mood_data.trigger}' if mood_data.trigger else ''}
{f'- Pattern noticed: {mood_data.pattern}' if mood_data.pattern else ''}
{f'- Underlying cause: {mood_data.underlying_cause}' if mood_data.underlying_cause else ''}
{f'- Additional notes: {mood_data.additional_notes}' if mood_data.additional_notes else ''}

Please provide personalized wellness guidance and coping strategies. Address the trigger, pattern, and underlying cause if provided. Do not use ** for bold formatting - use plain text only."""
        
        user_message = UserMessage(text=user_prompt)
        
        # Send the message and get the response
        response = await chat.send_message(user_message)
        
        # Remove ** markdown formatting
        response = response.replace('**', '')
        
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

@api_router.post("/lifestyle/assess", response_model=LifestyleAssessment)
async def submit_lifestyle_assessment(assessment: LifestyleAssessmentCreate):
    try:
        # Calculate average score
        scores = [
            assessment.sleep_quality,
            assessment.nutrition,
            assessment.social_connection,
            assessment.purpose_growth,
            assessment.stress_management
        ]
        average_score = sum(scores) / len(scores)
        
        # Create lifestyle assessment object
        assessment_dict = assessment.model_dump()
        assessment_dict['average_score'] = round(average_score, 1)
        assessment_obj = LifestyleAssessment(**assessment_dict)
        
        # Store in MongoDB
        doc = assessment_obj.model_dump()
        await db.lifestyle_assessments.insert_one(doc)
        
        return assessment_obj
    except Exception as e:
        logger.error(f"Error submitting lifestyle assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/lifestyle/history", response_model=List[LifestyleAssessment])
async def get_lifestyle_history(limit: int = 10):
    try:
        assessments = await db.lifestyle_assessments.find(
            {},
            {"_id": 0}
        ).sort("date", -1).limit(limit).to_list(limit)
        
        return assessments
    except Exception as e:
        logger.error(f"Error fetching lifestyle history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/lifestyle/weekly-report")
async def get_weekly_wellness_report():
    try:
        # Get lifestyle assessments from last 7 days
        assessments = await db.lifestyle_assessments.find({}, {"_id": 0}).sort("date", -1).limit(7).to_list(7)
        
        if not assessments:
            return {"message": "No data available for report"}
        
        # Calculate averages
        total = len(assessments)
        avg_sleep = sum(a['sleep_quality'] for a in assessments) / total
        avg_nutrition = sum(a['nutrition'] for a in assessments) / total
        avg_social = sum(a['social_connection'] for a in assessments) / total
        avg_purpose = sum(a['purpose_growth'] for a in assessments) / total
        avg_stress = sum(a['stress_management'] for a in assessments) / total
        overall_avg = sum(a['average_score'] for a in assessments) / total
        
        # Determine trends (compare first half vs second half)
        mid = total // 2
        if total >= 4:
            first_half_avg = sum(a['average_score'] for a in assessments[mid:]) / len(assessments[mid:])
            second_half_avg = sum(a['average_score'] for a in assessments[:mid]) / len(assessments[:mid])
            trend = "improving" if second_half_avg > first_half_avg else "declining" if second_half_avg < first_half_avg else "stable"
        else:
            trend = "stable"
        
        report = {
            "period": "Last 7 days",
            "total_entries": total,
            "overall_average": round(overall_avg, 1),
            "trend": trend,
            "pillars": {
                "sleep_quality": round(avg_sleep, 1),
                "nutrition": round(avg_nutrition, 1),
                "social_connection": round(avg_social, 1),
                "purpose_growth": round(avg_purpose, 1),
                "stress_management": round(avg_stress, 1)
            },
            "strengths": [],
            "areas_for_improvement": []
        }
        
        # Identify strengths (>= 8)
        for key, value in report["pillars"].items():
            if value >= 8:
                report["strengths"].append(key.replace("_", " ").title())
        
        # Identify areas for improvement (<= 5)
        for key, value in report["pillars"].items():
            if value <= 5:
                report["areas_for_improvement"].append(key.replace("_", " ").title())
        
        return report
    except Exception as e:
        logger.error(f"Error generating weekly report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Gratitude Journal Endpoints
class GratitudeEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    date: str

@api_router.post("/gratitude/add", response_model=GratitudeEntry)
async def add_gratitude_entry(entry: GratitudeEntry):
    try:
        doc = entry.model_dump()
        await db.gratitude_entries.insert_one(doc)
        return entry
    except Exception as e:
        logger.error(f"Error adding gratitude entry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/gratitude/entries", response_model=List[GratitudeEntry])
async def get_gratitude_entries(limit: int = 30):
    try:
        entries = await db.gratitude_entries.find({}, {"_id": 0}).sort("date", -1).limit(limit).to_list(limit)
        return entries
    except Exception as e:
        logger.error(f"Error fetching gratitude entries: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/gratitude/delete/{entry_id}")
async def delete_gratitude_entry(entry_id: str):
    try:
        result = await db.gratitude_entries.delete_one({"id": entry_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Entry not found")
        return {"message": "Entry deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting gratitude entry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Trigger Insights Endpoints
@api_router.get("/mood/trigger-insights")
async def get_trigger_insights():
    try:
        # Get all mood entries with triggers
        entries = await db.mood_entries.find(
            {"trigger": {"$exists": True, "$ne": ""}},
            {"_id": 0, "trigger": 1, "emotion": 1}
        ).to_list(None)
        
        # Aggregate common triggers
        trigger_counts = {}
        trigger_emotions = {}
        
        for entry in entries:
            trigger = entry.get('trigger', '').lower().strip()
            emotion = entry.get('emotion', '')
            
            if trigger:
                trigger_counts[trigger] = trigger_counts.get(trigger, 0) + 1
                if trigger not in trigger_emotions:
                    trigger_emotions[trigger] = {}
                trigger_emotions[trigger][emotion] = trigger_emotions[trigger].get(emotion, 0) + 1
        
        # Sort by frequency
        common_triggers = sorted(
            [{"trigger": k, "count": v, "emotions": trigger_emotions[k]} for k, v in trigger_counts.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:10]
        
        return {"common_triggers": common_triggers, "total_entries": len(entries)}
    except Exception as e:
        logger.error(f"Error fetching trigger insights: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/mood/trigger-heatmap")
async def get_trigger_heatmap():
    try:
        # Get mood entries from last 90 days
        entries = await db.mood_entries.find(
            {"trigger": {"$exists": True, "$ne": ""}},
            {"_id": 0, "trigger": 1, "emotion": 1, "timestamp": 1, "emotion_level": 1}
        ).to_list(None)
        
        # Create heatmap data
        heatmap_data = []
        for entry in entries:
            timestamp = entry.get('timestamp')
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp)
            
            heatmap_data.append({
                "date": timestamp.strftime("%Y-%m-%d"),
                "trigger": entry.get('trigger', '').lower()[:50],
                "emotion": entry.get('emotion', ''),
                "intensity": entry.get('emotion_level', 5)
            })
        
        return {"heatmap_data": heatmap_data}
    except Exception as e:
        logger.error(f"Error fetching trigger heatmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Authentication Endpoints
import random
import string

# In-memory OTP storage (in production, use Redis or database)
otp_storage = {}

class OTPRequest(BaseModel):
    identifier: str  # email or phone
    method: str  # 'email' or 'phone'

class OTPVerify(BaseModel):
    identifier: str
    otp: str
    name: str

@api_router.post("/auth/send-otp")
async def send_otp(request: OTPRequest):
    try:
        # Generate 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        # Store OTP (expires in 5 minutes)
        otp_storage[request.identifier] = {
            'otp': otp,
            'timestamp': datetime.now(timezone.utc),
            'method': request.method
        }
        
        # In production, send actual email/SMS here
        logger.info(f"OTP for {request.identifier}: {otp}")
        
        # For demo purposes, return OTP in response (remove in production)
        return {
            "message": f"OTP sent to {request.identifier}",
            "otp": otp,  # Remove this in production
            "demo_mode": True
        }
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/verify-otp")
async def verify_otp(request: OTPVerify):
    try:
        stored = otp_storage.get(request.identifier)
        
        if not stored:
            raise HTTPException(status_code=400, detail="OTP not found or expired")
        
        # Check if OTP is expired (5 minutes)
        time_diff = (datetime.now(timezone.utc) - stored['timestamp']).total_seconds()
        if time_diff > 300:  # 5 minutes
            del otp_storage[request.identifier]
            raise HTTPException(status_code=400, detail="OTP expired")
        
        # Verify OTP
        if stored['otp'] != request.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        # OTP verified, clean up
        del otp_storage[request.identifier]
        
        # Create user session
        user_data = {
            "name": request.name,
            "identifier": request.identifier,
            "method": stored['method'],
            "verified": True
        }
        
        return {
            "message": "Login successful",
            "user": user_data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying OTP: {str(e)}")
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
