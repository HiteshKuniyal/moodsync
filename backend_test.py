import requests
import sys
import json
from datetime import datetime

class MoodSyncAPITester:
    def __init__(self, base_url="https://emotracker-145.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_mood_submit(self):
        """Test mood submission endpoint"""
        test_mood_data = {
            "emotion": "Anxious",
            "emotion_level": 7,
            "energy_level": 4,
            "focus_level": 3,
            "overthinking": "A lot",
            "additional_notes": "Test mood entry for API testing"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/mood/submit", 
                json=test_mood_data,
                headers={'Content-Type': 'application/json'},
                timeout=30  # Longer timeout for AI processing
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                # Check if response has required fields
                required_fields = ['id', 'emotion', 'ai_guidance', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
                else:
                    details += f", AI Guidance Length: {len(data.get('ai_guidance', ''))}"
                    # Store the mood entry ID for later tests
                    self.test_mood_id = data.get('id')
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test("Mood Submit with AI Guidance", success, details)
            return success
        except Exception as e:
            self.log_test("Mood Submit with AI Guidance", False, str(e))
            return False

    def test_mood_history(self):
        """Test mood history endpoint"""
        try:
            response = requests.get(f"{self.api_url}/mood/history?limit=10", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Entries count: {len(data)}"
                if len(data) > 0:
                    # Check structure of first entry
                    first_entry = data[0]
                    required_fields = ['id', 'emotion', 'emotion_level', 'energy_level', 'focus_level', 'ai_guidance']
                    missing_fields = [field for field in required_fields if field not in first_entry]
                    if missing_fields:
                        success = False
                        details += f", Missing fields in entry: {missing_fields}"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test("Mood History Retrieval", success, details)
            return success
        except Exception as e:
            self.log_test("Mood History Retrieval", False, str(e))
            return False

    def test_mood_trends(self):
        """Test mood trends endpoint"""
        try:
            response = requests.get(f"{self.api_url}/mood/trends?days=14", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Trend entries count: {len(data)}"
                if len(data) > 0:
                    # Check structure of first trend entry
                    first_trend = data[0]
                    required_fields = ['date', 'emotion', 'emotion_level', 'energy_level', 'focus_level']
                    missing_fields = [field for field in required_fields if field not in first_trend]
                    if missing_fields:
                        success = False
                        details += f", Missing fields in trend: {missing_fields}"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test("Mood Trends Analysis", success, details)
            return success
        except Exception as e:
            self.log_test("Mood Trends Analysis", False, str(e))
            return False

    def test_ai_integration(self):
        """Test AI integration specifically"""
        test_mood_data = {
            "emotion": "Stressed",
            "emotion_level": 8,
            "energy_level": 2,
            "focus_level": 1,
            "overthinking": "Constantly",
            "additional_notes": "Having a really tough day with work deadlines"
        }
        
        try:
            print("🤖 Testing AI Integration (Claude Sonnet 4)...")
            response = requests.post(
                f"{self.api_url}/mood/submit", 
                json=test_mood_data,
                headers={'Content-Type': 'application/json'},
                timeout=45  # Extended timeout for AI processing
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                ai_guidance = data.get('ai_guidance', '')
                
                # Check AI guidance quality
                if len(ai_guidance) < 50:
                    success = False
                    details += f", AI guidance too short: {len(ai_guidance)} chars"
                elif "Unable to generate guidance" in ai_guidance:
                    success = False
                    details += ", AI guidance fallback message detected"
                else:
                    details += f", AI guidance generated: {len(ai_guidance)} chars"
                    # Check for personalized content
                    if any(word in ai_guidance.lower() for word in ['stressed', 'energy', 'focus', 'overwhelm']):
                        details += ", Personalized content detected"
                    else:
                        details += ", Warning: May not be personalized"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test("AI Integration (Claude Sonnet 4)", success, details)
            return success
        except Exception as e:
            self.log_test("AI Integration (Claude Sonnet 4)", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Mood Sync Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_api_root():
            print("❌ API root test failed - stopping further tests")
            return False
        
        # Test core functionality
        self.test_mood_submit()
        self.test_mood_history()
        self.test_mood_trends()
        self.test_ai_integration()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed - check details above")
            return False

def main():
    tester = MoodSyncAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())