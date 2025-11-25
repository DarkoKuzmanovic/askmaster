# AskMaster Technical Documentation

## Project Overview

AskMaster is a full-stack SvelteKit application that leverages Google Gemini AI to generate multiple-choice questions on any topic. The application features an interactive quiz interface with JSON export capabilities and follows a NeoBrutalist design aesthetic.

### Key Features

- **AI-Powered Question Generation**: Uses Google Gemini 2.5-pro model
- **Dual Provider Support**: Google Gemini SDK and OpenAI-compatible endpoints
- **Interactive Quiz Interface**: Navigate through questions with immediate feedback
- **Customizable Parameters**: Control question count (1-20) and creativity level (0.0-1.0)
- **JSON Export**: Download generated questions as structured JSON files
- **NeoBrutalism Design**: Bold, high-contrast UI with geometric styling
- **Responsive Design**: Optimized for desktop and mobile devices

## Architecture

### Technology Stack

- **Frontend**: SvelteKit 5.0.0 with TypeScript
- **Styling**: Custom CSS with NeoBrutalism design system
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **Build Tool**: Vite 5.0.3
- **Package Manager**: npm

### Project Structure

```
askmaster/
├── src/
│   ├── app.d.ts                 # TypeScript type definitions
│   ├── app.html                 # Main HTML template
│   ├── lib/
│   │   ├── index.ts            # Barrel exports
│   │   ├── assets/             # Static assets (SVG icons)
│   │   └── styles/
│   │       └── askmaster.css   # Main stylesheet
│   └── routes/
│       ├── +layout.server.ts   # Server-side layout data
│       ├── +layout.svelte      # Root layout component
│       ├── +page.svelte        # Main application page
│       └── api/
│           └── generate-questions/
│               └── +server.ts  # Question generation API endpoint
├── static/                     # Static files
├── package.json               # Dependencies and scripts
├── svelte.config.js          # SvelteKit configuration
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

## Core Components

### Main Application ([`src/routes/+page.svelte`](src/routes/+page.svelte:1))

The main Svelte component that handles the entire user interface and application state.

#### State Management

```typescript
interface Question {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

let topic = "";
let questionCount = 5;
let temperature = 0.7;
let questions: Question[] = [];
let isLoading = false;
let error = "";
let currentQuestionIndex = 0;
let selectedAnswers: (number | null)[] = [];
let showResults = false;
let score = 0;
let quizStarted = false;
```

#### Key Functions

- [`generateQuestions()`](src/routes/+page.svelte:53) - Handles question generation from API
- [`startQuiz()`](src/routes/+page.svelte:80) - Starts the quiz with generated questions
- [`downloadCurrentQuestions()`](src/routes/+page.svelte:90) - Exports questions as JSON
- [`calculateResults()`](src/routes/+page.svelte:147) - Calculates quiz score
- [`resetToGenerator()`](src/routes/+page.svelte:117) - Resets application state

### API Endpoint ([`src/routes/api/generate-questions/+server.ts`](src/routes/api/generate-questions/+server.ts:1))

Server-side endpoint for generating questions using AI providers.

#### Request Processing

```typescript
export const POST: RequestHandler = async ({ request }) => {
  // Parse request body
  const body = await request.json();
  topic = body.topic;
  questionCount = Number(body.questionCount) || questionCount;
  temperature = typeof body.temperature === 'number' ? body.temperature : temperature;
  provider = body.provider === 'custom' ? 'custom' : 'google';

  // Generate questions based on provider
  const prompt = buildPrompt(topic, questionCount, temperature);
  const rawText = provider === 'custom"
    ? await generateWithCustom(prompt, temperature)
    : await generateWithGoogle(prompt);

  return json(questions);
};
```

#### AI Provider Integration

- **Google Gemini**: Uses [`@google/generative-ai`](src/routes/api/generate-questions/+server.ts:68) with `gemini-2.5-pro` model
- **Custom OpenAI**: Compatible with any OpenAI-compatible API endpoint

#### Environment Configuration

- `GEMINI_API_KEY` - Required for Google Gemini provider
- `CUSTOM_API_KEY`, `CUSTOM_MODEL`, `CUSTOM_BASE_URL` - Optional for custom provider

### Styling System ([`src/lib/styles/askmaster.css`](src/lib/styles/askmaster.css:1))

Custom CSS implementation following NeoBrutalism design principles.

#### Design Tokens

```css
:root {
  --color-dark-purple: #210124;
  --color-claret: #750d37;
  --color-celadon: #b3dec1;
  --color-mint-green: #dbf9f0;
  --color-baby-powder: #f7f9f7;
  --color-border: #000000;

  --shadow-hard-sm: 3px 3px 0 var(--color-border);
  --shadow-hard-md: 6px 6px 0 var(--color-border);
  --shadow-hard-lg: 10px 10px 0 var(--color-border);
}
```

#### Key Features

- **Typography**: Custom font stack with Funnel Sans and Inter
- **Layout**: Asymmetric design with hard shadows and borders
- **Responsive**: Mobile-first approach with media queries
- **Animations**: Subtle hover effects and transitions

## API Documentation

### POST /api/generate-questions

Generates multiple-choice questions based on the provided topic and parameters.

#### Request Body

```json
{
  "topic": "string (required)",
  "questionCount": "number (1-20, required)",
  "temperature": "number (0.0-1.0, optional, defaults to 0.7)",
  "provider": "string ('google' or 'custom', optional, defaults to 'google')"
}
```

#### Response Format

**Success (200 OK)**

```json
[
  {
    "question": "What is the capital of France?",
    "answers": ["Paris", "London", "Berlin", "Madrid"],
    "correctAnswerIndex": 0
  }
]
```

#### Error Responses

- **400**: Bad request (missing required fields)
- **429**: Rate limit exceeded
- **503**: Service temporarily unavailable
- **500**: Internal server error

## Configuration

### Environment Variables

Create a `.env` file based on [`.env.example`](.env.example:1):

```env
# Required for Gemini provider
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - for custom OpenAI-compatible endpoint
CUSTOM_API_KEY=your_custom_api_key
CUSTOM_MODEL=your_custom_model
CUSTOM_BASE_URL=https://your-custom-api-endpoint.com
```

### Build Configuration

- **SvelteKit**: Configured with [`adapter-auto`](svelte.config.js:1) for multi-platform deployment
- **Vite**: Development server on port 5174 ([`vite.config.ts`](vite.config.ts:6))
- **TypeScript**: Strict mode enabled with bundled module resolution

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking and Svelte diagnostics
npm run check

# Code formatting and linting
npm run format
npm run lint
```

### Code Quality

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code quality and style enforcement
- **Prettier**: Automated code formatting

## Deployment

### Supported Platforms

- **Vercel**: Zero-config deployment with adapter-auto
- **Netlify**: Supports SvelteKit with adapter-auto
- **Node.js Hosting**: Any platform supporting Node.js 18+

### Production Build

```bash
npm run build
```

### Environment Configuration

Set the following environment variables in your hosting platform:

```
GEMINI_API_KEY=your_production_api_key
```

## Error Handling

### Client-Side Errors

- Input validation for required fields
- User-friendly error messages
- Loading states for async operations

### Server-Side Errors

- Comprehensive error handling for API calls
- Graceful fallback for malformed AI responses
- HTTP status codes for different error scenarios

## Security Considerations

- API keys stored in environment variables
- Input validation on both client and server
- No sensitive data exposed in error messages
- CORS protection through SvelteKit

## Performance Optimizations

- **Code Splitting**: Automatic with SvelteKit
- **Server-Side Rendering**: Improved initial load times
- **Static Assets**: Optimized delivery through Vite
- **CSS Optimization**: Minimal, focused stylesheet

## Browser Support

- Modern browsers with ES2020+ support
- Progressive enhancement for JavaScript features
- Responsive design for all screen sizes

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Configure API keys in `.env`
5. Start development server: `npm run dev`

### Code Standards

- Follow existing TypeScript and Svelte patterns
- Use Prettier for code formatting
- Run `npm run check` before committing
- Update documentation for new features

## Known Limitations

- **AI Response Consistency**: Gemini's output format may vary
- **Rate Limiting**: Subject to Google Gemini API quotas
- **Error Handling**: Falls back to user-friendly messages rather than mock data
- **Question Quality**: AI-generated questions may vary in quality

## Future Enhancements

See [`MVP.md`](MVP.md:1) for potential improvements including:

- Multiple correct answers support
- Additional question types
- Quiz history and user accounts
- Import/export functionality
- Accessibility improvements
