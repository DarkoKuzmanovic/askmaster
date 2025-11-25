# AskMaster User Guide

## Introduction

AskMaster is an AI-powered application that generates multiple-choice questions on any topic you choose. Whether you're studying for exams, creating quizzes, or just want to test your knowledge, AskMaster makes it easy to create custom question sets.

## Getting Started

### Prerequisites

Before using AskMaster, ensure you have:

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An internet connection
- (Optional) A Google Gemini API key for question generation

### Quick Setup

1. **Clone or Download** the AskMaster application
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Start the Application**:
   ```bash
   npm run dev
   ```
5. **Open Your Browser** to `http://localhost:5174`

## Using AskMaster

### Step 1: Generate Questions

#### Enter Your Topic

- Type any subject in the **Topic** field
- Examples: "JavaScript", "World History", "Biology", "Computer Science"
- The topic should be specific enough for meaningful questions

#### Configure Settings

- **Number of Questions**: Choose between 1-20 questions
- **Creativity Level**: Adjust the slider (0.0-1.0)
  - Lower values (0.0-0.4): More factual, predictable questions
  - Medium values (0.5-0.7): Balanced creativity (recommended)
  - Higher values (0.8-1.0): More creative, varied questions

#### Choose AI Provider

- **Gemini (Google SDK)**: Default provider using Google's AI
- **Custom OpenAI-compatible**: Use your own AI endpoint (requires additional configuration)

#### Generate

- Click the **"Generate Questions"** button
- Wait for the AI to create your question set
- A loading indicator shows progress

### Step 2: Choose Your Next Action

After questions are generated, you have three options:

#### Option A: Play Quiz

- Click **"Play Quiz"** to start interactive testing
- Navigate through questions one by one
- Select answers and track your progress
- Receive immediate feedback on your performance

#### Option B: Download JSON

- Click **"Download JSON"** to save questions
- Questions are downloaded as a structured JSON file
- File naming format: `askmaster-{topic}-{count}q-{timestamp}.json`
- Use for offline storage or integration with other tools

#### Option C: Generate New Questions

- Click **"Back to generator"** to start over
- Generate a new set of questions on a different topic

### Step 3: Taking the Quiz

#### Navigation

- Use **"Previous"** and **"Next"** buttons to move between questions
- Progress bar shows your current position
- Question indicator shows if current question is answered

#### Answering Questions

- Click any answer option to select it
- Selected answers are highlighted
- You can change your selection before moving to the next question
- You must answer the current question before proceeding

#### Finishing the Quiz

- Click **"Finish"** on the last question to see results
- Your score is calculated automatically
- Review all questions with correct/incorrect indicators

### Step 4: Reviewing Results

#### Score Display

- Your score is shown as a fraction (e.g., 3/5)
- Performance message based on your score:
  - Perfect score: "🎉 Perfect! You got all questions right!"
  - 80%+: "👏 Great job! You did really well!"
  - 60%+: "👍 Good effort! Keep practicing!"
  - Below 60%: "💪 Keep learning! You'll do better next time!"

#### Answer Review

- Each question shows your selected answer
- Correct answers are marked with a checkmark (✓)
- Incorrect selections are highlighted
- Perfect for learning from mistakes

#### Post-Quiz Actions

- **Retry Quiz**: Take the same quiz again
- **Download JSON**: Save the question set
- **Generate New Questions**: Start over with a new topic

## Advanced Features

### Custom AI Provider Setup

If you want to use a different AI provider:

1. **Configure Environment Variables**:

   ```env
   CUSTOM_API_KEY=your_custom_api_key
   CUSTOM_MODEL=your_custom_model
   CUSTOM_BASE_URL=https://your-custom-api-endpoint.com
   ```

2. **Select Provider**:
   - Choose "Custom OpenAI-compatible" from the dropdown
   - Ensure all three environment variables are configured

### Question Export Format

Downloaded JSON files follow this structure:

```json
[
  {
    "question": "What is the capital of France?",
    "answers": ["Paris", "London", "Berlin", "Madrid"],
    "correctAnswerIndex": 0
  }
]
```

**Fields Explained**:

- `question`: The question text
- `answers`: Array of 4 possible answers
- `correctAnswerIndex`: Position (0-3) of the correct answer

## Tips for Best Results

### Choosing Topics

- **Be Specific**: "JavaScript Array Methods" vs "Programming"
- **Use Keywords**: Include relevant terminology
- **Avoid Ambiguity**: Clear, well-defined topics work best

### Creativity Settings

- **Factual Topics**: Use lower creativity (0.0-0.4)
- **Creative Subjects**: Use higher creativity (0.7-1.0)
- **General Knowledge**: Medium creativity (0.5-0.7)

### Question Count

- **Quick Tests**: 3-5 questions
- **Comprehensive Review**: 10-15 questions
- **Maximum**: Up to 20 questions per set

## Troubleshooting

### Common Issues

#### "Failed to generate questions"

- **Cause**: API key not configured or invalid
- **Solution**: Check your `.env` file and verify API key

#### "Please enter a topic"

- **Cause**: Empty topic field
- **Solution**: Enter a topic before generating

#### "Generate questions first"

- **Cause**: Trying to start quiz without questions
- **Solution**: Generate questions before starting quiz

#### Slow Response Times

- **Cause**: AI provider processing time
- **Solution**: Wait a moment and try again

#### Download Not Working

- **Cause**: Browser download restrictions
- **Solution**: Check browser download settings

### Error Messages

- **"API key is missing"**: Configure your API key in `.env`
- **"Rate limit exceeded"**: Wait before making more requests
- **"Service temporarily unavailable"**: AI provider is busy, try again later
- **"Failed to process AI response"**: Retry with different topic or settings

## Keyboard Shortcuts

- **Enter**: Submit form (when generating questions)
- **Space/Enter**: Select answer in quiz mode
- **Arrow Keys**: Navigate between quiz questions
- **Escape**: Return to generator

## Mobile Usage

AskMaster is fully responsive and works on:

- Smartphones
- Tablets
- Desktop computers

### Mobile Features

- Touch-friendly interface
- Optimized layout for small screens
- Gesture support for navigation

## Data Privacy

- Questions are generated in real-time
- No personal data is stored
- API calls are made directly to AI providers
- No question history is saved on the server

## Performance Tips

- Use specific topics for faster generation
- Lower question count for quicker results
- Stable internet connection required
- Close other browser tabs if experiencing slowdowns

## Support

For additional help:

1. Check the browser console for error details
2. Verify your API key configuration
3. Ensure all dependencies are installed
4. Check the application logs for server errors

## Frequently Asked Questions

### Can I use AskMaster without an API key?

No, a valid Google Gemini API key is required for question generation.

### How many questions can I generate per request?

Between 1 and 20 questions per request.

### Are the generated questions always accurate?

AI-generated content may contain inaccuracies. Always verify important information.

### Can I customize the number of answer choices?

Currently, all questions have exactly 4 answer choices.

### Is there a limit to how many quizzes I can create?

No, you can generate unlimited quizzes, subject to API rate limits.

### Can I save my quiz progress?

Quiz progress is not automatically saved. Use the JSON export to save question sets.

## Feedback and Support

If you encounter issues or have suggestions:

1. Check the troubleshooting section above
2. Review the application logs
3. Verify your environment configuration
4. Contact support with specific error details
