# Askmaster MVP Proposal

## 🎯 Project Overview

**Askmaster** is an AI-powered quiz question generation and testing application built with SvelteKit. The app leverages Google Gemini API to create customizable multiple-choice questions on any topic, providing an interactive learning and assessment tool.

### Core Value Proposition

- **Instant Question Generation**: Create high-quality multiple-choice questions on any topic in seconds
- **Customizable Parameters**: Control question quantity and AI creativity level
- **Interactive Quiz Experience**: Take generated quizzes with immediate feedback
- **JSON Export Capability**: Questions are generated in structured JSON format for easy integration

## ✅ MVP Features (Current Implementation)

### 1. Question Generation

- **Topic Input**: Free-form text field for any subject (History, Geography, Literature, Movies, Music, etc.)
- **Quantity Control**: Adjustable question count (1-20 questions)
- **Temperature Setting**: Creativity level slider (0.0 - 1.0) for AI response variation
- **Google Gemini Integration**: Uses `gemini-2.5-pro` model via API
- **4-Answer Format**: Each question includes exactly 4 multiple-choice options
- **Correct Answer Identification**: One correct answer per question with index reference

### 2. Quiz Interface

- **Progress Tracking**: Visual progress bar showing completion status
- **Question Navigation**: Previous/Next buttons with state management
- **Answer Selection**: Click-to-select answer interface with visual feedback
- **Answer Validation**: Real-time indication of answered/unanswered status
- **Results Display**: Immediate scoring with percentage and performance messages

### 3. Results & Review

- **Score Calculation**: Automatic scoring with visual score circle
- **Performance Feedback**: Contextual messages based on score ranges
- **Answer Review**: Detailed breakdown showing correct vs. incorrect responses
- **Retry Options**: Ability to retake quiz or generate new questions

### 4. Technical Implementation

- **Frontend**: SvelteKit with TypeScript
- **Backend**: SvelteKit API endpoint (`/api/generate-questions`)
- **AI Integration**: `@google/generative-ai` package
- **Environment Configuration**: `.env` file for API key management
- **Error Handling**: Graceful fallbacks with mock data
- **Responsive Design**: Mobile-first CSS approach

## 🔧 Technical Requirements

### Dependencies

```json
{
  "@google/generative-ai": "^0.24.1",
  "@sveltejs/kit": "^2.0.0",
  "svelte": "^5.0.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.3"
}
```

### Environment Variables

```
GEMINI_API_KEY=your_google_gemini_api_key
```

### API Integration

- **Endpoint**: `POST /api/generate-questions`
- **Request Body**:

```json
{
  "topic": "string",
  "questionCount": "number (1-20)",
  "temperature": "number (0.0-1.0)"
}
```

- **Response Format**:

```json
[
  {
    "question": "string",
    "answers": ["string", "string", "string", "string"],
    "correctAnswerIndex": "number (0-3)"
  }
]
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (obtain from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation Steps

1. **Clone Repository**:

   ```bash
   git clone <repository-url>
   cd askmaster
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Run Development Server**:

   ```bash
   npm run dev
   ```

   Access at `http://localhost:5173`

5. **Build for Production**:

   ```bash
   npm run build
   npm run preview
   ```

## 📊 Current Limitations & Known Issues

### 1. Temperature Parameter

- **Issue**: Temperature slider exists in UI but is not passed to the API endpoint
- **Impact**: AI creativity level cannot be adjusted
- **Priority**: High - Easy fix, high user value

### 2. UI Styling

- **Issue**: Current design uses modern gradients, not neobrutalism
- **Impact**: Doesn't match specified design requirements
- **Priority**: Medium - Visual enhancement needed
- **Solution**: Implement NeoBrutalismCSS library (<https://matifandy8.github.io/NeoBrutalismCSS/>)
- **Benefits**: Bold, high-contrast design with authentic neobrutalism aesthetics

### 3. API Error Handling

- **Issue**: Falls back to mock data instead of showing user-friendly errors
- **Impact**: Users may not realize when API calls fail
- **Priority**: Medium - Should show clear error messages

### 4. Question Quality

- **Issue**: AI-generated questions may vary in quality/consistency
- **Impact**: User experience depends heavily on prompt engineering
- **Priority**: Low - Can be improved with better prompts over time

## 🎯 MVP Success Criteria

### Functional Requirements

- [x] User can input any topic and generate questions
- [x] System creates exactly 4 answers per question
- [x] One correct answer is clearly identified
- [x] Questions are output in valid JSON format
- [x] Quiz interface allows answering and navigation
- [x] Results show score and answer review
- [x] Environment configuration works with .env file

### Technical Requirements

- [x] Google Gemini API integration functional
- [x] SvelteKit framework properly configured
- [x] TypeScript implementation throughout
- [x] Responsive design works on mobile/desktop
- [x] Error handling prevents app crashes

### User Experience Requirements

- [x] Intuitive interface for non-technical users
- [x] Clear feedback during question generation
- [x] Visual progress indicators
- [x] Immediate results display
- [x] Ability to retry or create new quizzes

## 🔮 Future Enhancements (Post-MVP)

### Short-term (High Priority)

1. **Neobrutalism UI Implementation**
   - Implement NeoBrutalismCSS library (<https://matifandy8.github.io/NeoBrutalismCSS/>)
   - Bold, high-contrast design with authentic neobrutalism aesthetics
   - Sharp edges, geometric shapes, and intentional limitations
   - Minimal color palette with strategic accent colors
   - Replace current gradient-based styling

2. **Temperature Parameter Fix**
   - Pass temperature value to API endpoint
   - Test different temperature ranges for optimal results

3. **Question Categories**
   - Predefined topic categories with icons
   - Difficulty levels (Easy, Medium, Hard)
   - Subject-specific prompt templates

### Medium-term (Medium Priority)

4. **User Accounts & Persistence**
   - Save generated quizzes
   - Track user progress over time
   - Quiz history and statistics

5. **Export Functionality**
   - Download quizzes as PDF
   - Export JSON for external use
   - Share quiz links

6. **Enhanced Question Types**
   - True/False questions
   - Fill-in-the-blank
   - Image-based questions

### Long-term (Lower Priority)

7. **Multiplayer/Competitive Features**
   - Real-time quiz competitions
   - Leaderboards
   - Team challenges

8. **Advanced AI Features**
   - Question difficulty adaptation
   - Personalized learning paths
   - Spaced repetition integration

9. **Content Management**
   - Curated question libraries
   - User-generated content
   - Rating system for question quality

## 📈 Metrics & Analytics

### Usage Metrics to Track

- Questions generated per session
- Most popular topics
- Average quiz completion rate
- User engagement time
- API error rates

### Success Indicators

- Successful question generation rate > 90%
- Average quiz completion rate > 70%
- User return rate > 40%
- API response time < 5 seconds

## 🛡️ Technical Debt & Maintenance

### Immediate Fixes Needed

1. **Temperature Parameter**: Update API endpoint to accept and use temperature value
2. **Error Messaging**: Replace mock data fallback with user-friendly error messages
3. **Input Validation**: Add client-side validation for topic and question count

### Code Quality Improvements

- Extract API logic into separate service module
- Create reusable Svelte components (QuestionCard, ResultsDisplay, etc.)
- Add unit tests for core functionality
- Implement proper error boundaries

### Security Considerations

- API key protection (currently uses server-side env vars - good)
- Input sanitization for topic field
- Rate limiting for API endpoints
- CORS configuration for production

## 🎉 Conclusion

The Askmaster MVP successfully delivers core functionality for AI-powered question generation and quiz taking. The application is functional, user-friendly, and provides immediate value. With the identified improvements and future enhancements, Askmaster can evolve into a comprehensive learning and assessment platform.

**Current Status**: ✅ MVP Functional - Ready for user testing and feedback
**Next Steps**: Implement temperature parameter fix and NeoBrutalismCSS UI redesign
