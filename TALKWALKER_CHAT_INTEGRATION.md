# Talkwalker Chat API Integration

This document describes the implementation of the Talkwalker Chat API integration for creating signals with AI insights.

## Overview

When creating a new signal, the application now:
1. Takes the selected copilot ID and brand details
2. Sends them to the Talkwalker Chat API to get AI insights
3. Displays a progress indicator while waiting for the response
4. Persists the signal with the AI-generated insights

## Implementation Details

### 1. Talkwalker Chat API Service (`src/services/talkwalker.ts`)

Added new function `chatWithCopilot` that:
- Takes copilot ID, message, and brand details
- Creates a contextual message including brand information
- Sends request to Talkwalker Chat API
- Returns structured response with AI insights

**API Endpoint**: `https://api.talkwalker.com/api/v3/yeti/chat?access_token={{access_token}}`

**Request Format**:
```json
{
  "origin": "slack",
  "context": ["T0737UR09H8"],
  "account_id": "3e961f15-a7f4-408c-bd4b-8e33b990cfff",
  "yeti_id": "4ee0b0c7-eb6e-4c4c-bc2d-b003546e538e",
  "email": "j.ribeiro@hootsuite.com",
  "message": {
    "user_id": "U074V17S75L",
    "username": "Joao Ribeiro",
    "timestamp": 1746714069,
    "text": "Hello",
    "role": "USER"
  }
}
```

**Response Format**:
```json
{
  "status_code": "0",
  "status_message": "OK",
  "request": "POST /api/v3/yeti/chat?access_token=...",
  "request_id": "#t29yo12lg849#",
  "yeti_answer": {
    "reply": {
      "avatar_url": "https://app.talkwalker.com/app/image/71a8a551-15b1-4790-af48-b3422db7938b",
      "username": "USBank Marketing",
      "content": "Hello! How can I assist you today with your marketing needs at U.S. Bank?"
    }
  }
}
```

### 2. Database Service Updates (`src/services/database.ts`)

Added new function `createSignalWithAI` that:
- Calls the Talkwalker Chat API
- Parses the AI response into structured insights
- Creates the signal with real AI insights instead of placeholders
- Falls back to regular signal creation if AI fails

**AI Response Display**:
The AI response is now displayed as raw markdown content with:
- Full markdown formatting support (headers, lists, bold, italic, code, etc.)
- Custom styled components for consistent UI
- No hardcoded section titles - the AI response determines the structure
- Recommendations are still extracted for the separate recommendations component

### 3. Progress Tracking

The implementation includes real-time progress updates:
- "Initializing signal creation..."
- "Getting AI insights from Talkwalker..."
- "Processing AI response..."
- "Saving signal with AI insights..."
- "Signal created successfully!"

### 4. UI Updates

**Signal Creation Modal (`src/components/AddSignalModal.tsx`)**:
- Progress indicator with loading spinner
- Real-time progress messages
- Updated button text during AI processing
- Error handling with fallback to placeholder insights

**AI Insights Display (`src/components/AIInsights.tsx`)**:
- Removed hardcoded "Social Listening" and "Consumer Insights" titles
- Added ReactMarkdown for full markdown rendering
- Custom styled components for consistent UI
- Displays raw AI response with proper formatting

### 5. Hook Updates (`src/hooks/useSignals.ts`)

Added `createSignalWithAI` function that:
- Accepts brand details and progress callback
- Handles the AI-powered signal creation
- Updates the signals list optimistically

## API Proxy

Created a new Vercel serverless function (`api/talkwalker-chat-proxy.js`) to:
- Avoid CORS issues in production
- Proxy chat API requests server-side
- Handle authentication and error responses

## Error Handling

The implementation includes comprehensive error handling:
- Network failures fall back to placeholder insights
- Invalid responses are handled gracefully
- User-friendly error messages are displayed
- Progress tracking continues even during errors

## Configuration

Required environment variables:
- `VITE_TALKWALKER_BASE_URL`
- `VITE_TALKWALKER_ACCESS_TOKEN`
- `VITE_TALKWALKER_ORIGIN`
- `VITE_TALKWALKER_WORKSPACE_ID`
- `VITE_TALKWALKER_ACCOUNT_ID`
- `VITE_TALKWALKER_USER_EMAIL`

## Usage

1. Open the "Create New Signal" modal
2. Select a brand and copilot
3. Enter signal details and prompt
4. Click "Create Signal"
5. Watch the progress indicator as AI insights are generated
6. Signal is created with real AI insights

## Fallback Behavior

If the Talkwalker Chat API is unavailable or fails:
- The system automatically falls back to creating a signal with placeholder insights
- Users are notified of the fallback via progress messages
- The signal creation process continues normally
- No data is lost due to API failures

## Future Enhancements

Potential improvements:
- Caching of AI responses for similar prompts
- Retry logic with exponential backoff
- More sophisticated AI response parsing
- Integration with other AI services as fallbacks
- Analytics on AI response quality and usage
