# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js application that integrates NASA's API for fetching astronomical images and uses GPT for generating explanations of these images.

## Key Technologies
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- NASA APOD (Astronomy Picture of the Day) API
- Google Gemini AI for image explanations

## Code Style Guidelines
- Use TypeScript strict mode
- Follow Next.js 15 App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling for API calls
- Use async/await for asynchronous operations
- Create reusable components in the components directory
- Use environment variables for API keys
- Implement proper loading states and error boundaries

## API Integration Notes
- NASA APOD API endpoint: https://api.nasa.gov/planetary/apod
- Use environment variables for NASA_API_KEY and GEMINI_API_KEY
- Implement rate limiting considerations
- Cache API responses when appropriate
- Handle API errors gracefully

## Component Structure
- Create modular, reusable components
- Use proper TypeScript interfaces for props
- Implement proper accessibility features
- Use semantic HTML elements
- Follow responsive design principles
