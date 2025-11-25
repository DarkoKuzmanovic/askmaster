# AskMaster API Documentation

## Overview

AskMaster provides a REST API endpoint for generating multiple-choice questions using AI. The API supports both Google Gemini and OpenAI-compatible AI providers.

## Base URL

The API is available at the following endpoint:

```
POST /api/generate-questions
```

## Authentication

No authentication is required for the public API endpoint. However, the server requires valid API keys for the AI providers, which are configured server-side.

## Request

### Headers

| Header         | Value              | Required |
| -------------- | ------------------ | -------- |
| `Content-Type` | `application/json` | Yes      |

### Request Body

```json
{
  "topic": "string (required)",
  "questionCount": "number (1-20, required)",
  "temperature": "number (0.0-1.0, optional, defaults to 0.7)",
  "provider": "string ('google' or 'custom', optional, defaults to 'google')"
}
```

### Parameters

#### `topic` (required)

- **Type**: String
- **Description**: The subject or topic for which to generate questions
- **Examples**:
  - `"JavaScript"`
  - `"World History"`
  - `"Computer Science"`

#### `questionCount` (required)

- **Type**: Number
- **Range**: 1-20
- **Description**: Number of questions to generate
- **Default**: 5

#### `temperature` (optional)

- **Type**: Number
- **Range**: 0.0-1.0
- **Description**: Controls creativity/randomness of AI responses
  - `0.0`: More deterministic, focused responses
  - `1.0`: More creative, varied responses
- **Default**: 0.7

#### `provider` (optional)

- **Type**: String
- **Values**: `"google"` or `"custom"`
- **Description**: AI provider to use for question generation
  - `"google"`: Uses Google Gemini SDK (default)
  - `"custom"`: Uses configured OpenAI-compatible endpoint
- **Default**: `"google"`

## Response

### Success Response

**Status Code**: `200 OK`

**Content-Type**: `application/json`

**Body**:

```json
[
  {
    "question": "What is the capital of France?",
    "answers": ["Paris", "London", "Berlin", "Madrid"],
    "correctAnswerIndex": 0
  },
  {
    "question": "Which programming language is known for web development?",
    "answers": ["Python", "JavaScript", "C++", "Java"],
    "correctAnswerIndex": 1
  }
]
```

#### Response Schema

Each question object contains:

- `question` (string): The question text
- `answers` (string[]): Array of 4 possible answers
- `correctAnswerIndex` (number): Index (0-3) of the correct answer in the answers array

### Error Responses

#### 400 Bad Request

```json
{
  "error": "Topic and question count are required.",
  "details": "Missing required fields"
}
```

**Causes**:

- Missing `topic` field
- Missing `questionCount` field
- Invalid `questionCount` (outside 1-20 range)

#### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded. Please try again in a moment.",
  "details": "Too many requests to the AI service"
}
```

**Causes**:

- AI provider rate limit exceeded
- API quota exceeded

#### 503 Service Unavailable

```json
{
  "error": "The AI provider is currently overloaded. Please try again in a moment.",
  "details": "Service temporarily unavailable"
}
```

**Causes**:

- AI provider service overloaded
- Network connectivity issues
- Provider maintenance

#### 500 Internal Server Error

```json
{
  "error": "An unexpected error occurred while generating questions.",
  "details": "Error message description"
}
```

**Causes**:

- Invalid API key configuration
- AI provider authentication failure
- JSON parsing errors in AI response
- Server configuration issues

## AI Provider Configuration

### Google Gemini Provider

The default provider uses Google's Generative AI SDK with the `gemini-2.5-pro` model.

**Required Environment Variables**:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Custom OpenAI-Compatible Provider

Supports any OpenAI-compatible API endpoint.

**Required Environment Variables**:

```env
CUSTOM_API_KEY=your_custom_api_key
CUSTOM_MODEL=your_custom_model
CUSTOM_BASE_URL=https://your-custom-api-endpoint.com
```

## Usage Examples

### cURL Example

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "JavaScript",
    "questionCount": 5,
    "temperature": 0.7,
    "provider": "google"
  }' \
  http://localhost:5174/api/generate-questions
```

### JavaScript Fetch Example

```javascript
async function generateQuestions(topic, count = 5) {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        questionCount: count,
        temperature: 0.7,
        provider: "google",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate questions");
    }

    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

// Usage
generateQuestions("Computer Science", 10)
  .then((questions) => console.log(questions))
  .catch((error) => console.error(error));
```

### Python Requests Example

```python
import requests
import json

def generate_questions(topic, question_count=5, temperature=0.7, provider="google"):
    url = "http://localhost:5174/api/generate-questions"

    payload = {
        "topic": topic,
        "questionCount": question_count,
        "temperature": temperature,
        "provider": provider
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Usage
questions = generate_questions("Python Programming", 8)
if questions:
    for i, q in enumerate(questions, 1):
        print(f"Q{i}: {q['question']}")
        print(f"Correct: {q['answers'][q['correctAnswerIndex']]}")
        print()
```

## Error Handling Best Practices

### Client-Side Error Handling

```javascript
async function generateQuestionsWithRetry(topic, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, questionCount: 5 }),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get("Retry-After") || 1000;
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        continue;
      }

      if (response.status === 503) {
        // Service unavailable - wait and retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
    }
  }
}
```

### Rate Limiting

- Implement exponential backoff for rate limit errors (429)
- Consider implementing client-side request throttling
- Monitor API usage to stay within provider limits

## Response Validation

### Question Validation

When processing API responses, ensure:

1. **Array Structure**: Response is an array of objects
2. **Required Fields**: Each object has `question`, `answers`, `correctAnswerIndex`
3. **Answer Count**: Each `answers` array contains exactly 4 strings
4. **Correct Index**: `correctAnswerIndex` is between 0-3

```javascript
function validateQuestions(questions) {
  if (!Array.isArray(questions)) {
    throw new Error("Invalid response format: expected array");
  }

  for (const q of questions) {
    if (!q.question || !Array.isArray(q.answers) || typeof q.correctAnswerIndex !== "number") {
      throw new Error("Invalid question format");
    }

    if (q.answers.length !== 4) {
      throw new Error("Question must have exactly 4 answers");
    }

    if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
      throw new Error("Invalid correctAnswerIndex");
    }
  }

  return questions;
}
```

## Testing the API

### Local Development Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Test the API endpoint:
   ```bash
   curl -X POST http://localhost:5174/api/generate-questions \
     -H "Content-Type: application/json" \
     -d '{"topic":"Test Topic","questionCount":2}'
   ```

### Production Testing

Use the same endpoint with your production URL:

```bash
curl -X POST https://your-domain.com/api/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test Topic","questionCount":2}'
```

## Troubleshooting

### Common Issues

1. **Missing API Key**
   - Ensure `GEMINI_API_KEY` is set in environment variables
   - Verify the key has proper permissions

2. **Rate Limiting**
   - Check provider-specific rate limits
   - Implement client-side retry logic

3. **Invalid Response Format**
   - AI provider may return unexpected JSON format
   - The API includes parsing logic to handle variations

4. **Network Issues**
   - Verify network connectivity to AI provider
   - Check firewall and proxy settings

### Debug Mode

For debugging purposes, check the server logs for detailed error information when issues occur.

## Support

For API-related issues:

1. Check the error response for details
2. Verify environment variable configuration
3. Ensure the AI provider service is operational
4. Review server logs for detailed error information
