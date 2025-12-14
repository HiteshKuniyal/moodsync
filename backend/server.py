from fastapi import FastAPI, APIRouter, HTTPException, Request
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

# MongoDB connection with error handling
try:
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    if not mongo_url:
        logger.error("MONGO_URL environment variable not set!")
        raise ValueError("MONGO_URL is required")
    
    if not db_name:
        logger.warning("DB_NAME not set, using default: test_database")
        db_name = 'test_database'
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info(f"MongoDB client initialized for database: {db_name}")
except Exception as e:
    logger.error(f"Failed to initialize MongoDB: {str(e)}")
    raise

# Create the main app without a prefix
app = FastAPI(title="Mood Sync API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to get user_id from headers
def get_user_id_from_header(request) -> Optional[str]:
    """Extract user_id from X-User-Id header"""
    return request.headers.get('X-User-Id')

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
    user_id: Optional[str] = None
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
    user_id: Optional[str] = None
    sleep_quality: int
    nutrition: int
    social_connection: int
    purpose_growth: int
    stress_management: int
    notes: Optional[str] = None
    date: str
    average_score: float

# Helper function to generate AI guidance
async def generate_mood_guidance(mood_data: MoodEntryCreate, user_name: Optional[str] = None) -> str:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return "Unable to generate guidance at this time. Please try again later."
        
        # Create a unique session ID for each request
        session_id = f"mood-guidance-{uuid.uuid4()}"
        
        # System message for the AI
        greeting_name = user_name if user_name else "friend"
        system_message = f"""You are a compassionate mental wellness assistant. Your role is to:
1. Address the user personally by their name ({greeting_name})
2. Acknowledge the user's emotional state with empathy
3. Validate their feelings
4. Provide 3-5 practical, actionable coping strategies
5. Suggest wellness activities appropriate to their energy and focus levels
6. Offer encouragement and remind them this feeling is temporary

Keep responses warm, supportive, and under 200 words. Focus on immediate, practical help. Always start by addressing them personally."""
        
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

# Health check endpoints for Kubernetes
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        # Test MongoDB connection
        await db.command('ping')
        return {"status": "healthy", "service": "mood-sync-backend", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@app.get("/healthz")
async def healthz():
    """Alternative health check endpoint (basic liveness check)"""
    return {"status": "ok"}

# Startup event to verify connections
@app.on_event("startup")
async def startup_event():
    """Verify all connections on startup"""
    try:
        # Test MongoDB connection
        await db.command('ping')
        logger.info("✅ MongoDB connection successful")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {str(e)}")
        logger.error(f"MONGO_URL: {os.environ.get('MONGO_URL', 'NOT SET')}")
        logger.error(f"DB_NAME: {os.environ.get('DB_NAME', 'NOT SET')}")
        raise

@api_router.post("/mood/submit", response_model=MoodEntry)
async def submit_mood(mood_input: MoodEntryCreate, request: Request):
    try:
        user_id = get_user_id_from_header(request)
        
        # Get user name for personalization
        user_name = None
        if user_id:
            user = await db.users.find_one({"id": user_id}, {"_id": 0, "name": 1})
            if user:
                user_name = user.get("name")
                logger.info(f"Generating guidance for user: {user_name} (id: {user_id})")
            else:
                logger.warning(f"User not found for id: {user_id}")
        else:
            logger.info("Generating guidance for guest user")
        
        # Generate AI guidance with user name
        ai_guidance = await generate_mood_guidance(mood_input, user_name)
        
        # Create mood entry with AI guidance
        mood_dict = mood_input.model_dump()
        mood_dict['ai_guidance'] = ai_guidance
        mood_dict['user_id'] = user_id
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
async def get_mood_history(request: Request, limit: int = 30):
    try:
        user_id = get_user_id_from_header(request)
        query = {"user_id": user_id} if user_id else {}
        
        # Get recent mood entries
        mood_entries = await db.mood_entries.find(
            query, 
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
async def get_mood_trends(request: Request, days: int = 14):
    try:
        user_id = get_user_id_from_header(request)
        query = {"user_id": user_id} if user_id else {}
        
        # Calculate date range
        end_date = datetime.now(timezone.utc)
        start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Get mood entries for trend analysis
        mood_entries = await db.mood_entries.find(
            query,
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
async def submit_lifestyle_assessment(assessment: LifestyleAssessmentCreate, request: Request):
    try:
        user_id = get_user_id_from_header(request)
        
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
        assessment_dict['user_id'] = user_id
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
async def get_weekly_wellness_report(request: Request):
    try:
        from collections import defaultdict
        
        user_id = get_user_id_from_header(request)
        query = {"user_id": user_id} if user_id else {}
        
        # Get all lifestyle assessments (limited to last 1000 for performance)
        all_assessments = await db.lifestyle_assessments.find(query, {"_id": 0}).sort("date", -1).limit(1000).to_list(1000)
        
        if not all_assessments:
            return {"message": "No data available for report"}
        
        # Group assessments by week
        weekly_data = defaultdict(list)
        for assessment in all_assessments:
            date_str = assessment.get('date', '')
            if date_str:
                # Parse date and get week number
                try:
                    date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    week_key = date_obj.strftime("%Y-W%U")  # Year-Week format
                    weekly_data[week_key].append(assessment)
                except Exception:
                    continue
        
        # Calculate averages per week
        weekly_trends = []
        for week, assessments in sorted(weekly_data.items(), reverse=True)[:8]:  # Last 8 weeks
            total = len(assessments)
            avg_sleep = sum(a['sleep_quality'] for a in assessments) / total
            avg_nutrition = sum(a['nutrition'] for a in assessments) / total
            avg_social = sum(a['social_connection'] for a in assessments) / total
            avg_purpose = sum(a['purpose_growth'] for a in assessments) / total
            avg_stress = sum(a['stress_management'] for a in assessments) / total
            overall_avg = (avg_sleep + avg_nutrition + avg_social + avg_purpose + avg_stress) / 5
            
            weekly_trends.append({
                "week": week,
                "overall_average": round(overall_avg, 1),
                "entries_count": total,
                "pillars": {
                    "sleep_quality": round(avg_sleep, 1),
                    "nutrition": round(avg_nutrition, 1),
                    "social_connection": round(avg_social, 1),
                    "purpose_growth": round(avg_purpose, 1),
                    "stress_management": round(avg_stress, 1)
                }
            })
        
        # Calculate current week (most recent)
        current_week_data = weekly_trends[0] if weekly_trends else None
        
        # Determine overall trend (compare last 2 weeks if available)
        trend = "stable"
        if len(weekly_trends) >= 2:
            current_avg = weekly_trends[0]['overall_average']
            previous_avg = weekly_trends[1]['overall_average']
            if current_avg > previous_avg + 0.5:
                trend = "improving"
            elif current_avg < previous_avg - 0.5:
                trend = "declining"
        
        # Build report
        report = {
            "period": f"Last {len(weekly_trends)} weeks",
            "total_entries": len(all_assessments),
            "overall_average": current_week_data['overall_average'] if current_week_data else 0,
            "trend": trend,
            "pillars": current_week_data['pillars'] if current_week_data else {},
            "weekly_trends": weekly_trends,
            "strengths": [],
            "areas_for_improvement": []
        }
        
        # Identify strengths and areas for improvement (from current week)
        if current_week_data:
            for key, value in current_week_data["pillars"].items():
                if value >= 8:
                    report["strengths"].append(key.replace("_", " ").title())
                elif value <= 5:
                    report["areas_for_improvement"].append(key.replace("_", " ").title())
        
        return report
    except Exception as e:
        logger.error(f"Error generating weekly report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Gratitude Journal Endpoints
class GratitudeEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    content: str
    date: str

@api_router.post("/gratitude/add", response_model=GratitudeEntry)
async def add_gratitude_entry(entry: GratitudeEntry, request: Request):
    try:
        user_id = get_user_id_from_header(request)
        entry.user_id = user_id
        doc = entry.model_dump()
        await db.gratitude_entries.insert_one(doc)
        return entry
    except Exception as e:
        logger.error(f"Error adding gratitude entry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/gratitude/entries", response_model=List[GratitudeEntry])
async def get_gratitude_entries(request: Request, limit: int = 30):
    try:
        user_id = get_user_id_from_header(request)
        query = {"user_id": user_id} if user_id else {}
        
        entries = await db.gratitude_entries.find(query, {"_id": 0}).sort("date", -1).limit(limit).to_list(limit)
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
async def get_trigger_insights(request: Request):
    try:
        user_id = get_user_id_from_header(request)
        query = {"trigger": {"$exists": True, "$ne": ""}}
        if user_id:
            query["user_id"] = user_id
        
        # Get all mood entries with triggers (limited to last 500)
        entries = await db.mood_entries.find(
            query,
            {"_id": 0, "trigger": 1, "emotion": 1}
        ).limit(500).to_list(500)
        
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
async def get_trigger_heatmap(request: Request):
    try:
        user_id = get_user_id_from_header(request)
        query = {"trigger": {"$exists": True, "$ne": ""}}
        if user_id:
            query["user_id"] = user_id
        
        # Get mood entries from last 90 days (limited to 500 entries)
        from datetime import timedelta
        ninety_days_ago = datetime.now(timezone.utc) - timedelta(days=90)
        query["timestamp"] = {"$gte": ninety_days_ago.isoformat()}
        
        entries = await db.mood_entries.find(
            query,
            {"_id": 0, "trigger": 1, "emotion": 1, "timestamp": 1, "emotion_level": 1}
        ).limit(500).to_list(500)
        
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
import bcrypt

# User Models
class UserSignup(BaseModel):
    username: str
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    name: Optional[str] = None
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

@api_router.post("/auth/signup")
async def signup(user: UserSignup):
    try:
        # Check if username already exists
        existing_user = await db.users.find_one({"username": user.username}, {"_id": 0})
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Hash the password
        password_hash = hash_password(user.password)
        
        # Create user document
        user_doc = {
            "id": str(uuid.uuid4()),
            "username": user.username,
            "name": user.name if user.name else user.username,
            "password_hash": password_hash,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Insert into database
        await db.users.insert_one(user_doc)
        
        # Return user data (without password hash)
        return {
            "message": "Account created successfully",
            "user": {
                "id": user_doc["id"],
                "username": user.username,
                "name": user_doc["name"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    try:
        # Find user by username
        user = await db.users.find_one({"username": credentials.username}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Return user data (without password hash)
        return {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "name": user["name"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/user/data")
async def delete_user_data(request: Request):
    try:
        user_id = get_user_id_from_header(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        # Delete all user data from collections
        await db.mood_entries.delete_many({"user_id": user_id})
        await db.gratitude_entries.delete_many({"user_id": user_id})
        await db.lifestyle_assessments.delete_many({"user_id": user_id})
        
        logger.info(f"Deleted all data for user: {user_id}")
        
        return {
            "message": "All user data deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user data: {str(e)}")
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
