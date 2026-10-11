# MyAI

MyAI lets users create chat sessions with custom context prompts for an OpenAI LLM.

## Architecture

```text
React.js with Mantine
   ↓
JavaScript Fetch API
   ↓
controller.ts
   ↓
service.ts (for chat, calls OpenAI API)
   ↓
repository.ts
   ↓
PostgreSQL Database
```
