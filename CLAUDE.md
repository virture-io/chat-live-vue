# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js 3 chat widget library built with Vite, designed to be distributed as both a standalone widget and npm package. The widget provides real-time chat functionality with Socket.IO connectivity, customizable styling, and Google Analytics integration.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production library
- `npm run preview` - Preview production build

## Architecture

### Build Configuration

The project has dual build configurations in `vite.config.js`:
- **Production build**: Creates a web component library (`chat-widget.es.js` and `chat-widget.umd.js`) from `src/widget-entry.js`
- **Development build**: Currently configured for development with `src/App.vue` as entry point

### Core Components

- **App.vue**: Main chat widget component with extensive props for customization
- **FormComponent.vue**: Chat interface form handling
- **ChatWidget.js**: Web component wrapper that defines the custom element `<vue-chat-widget>`
- **Socket connection**: Managed through `src/composable/socket-connection.js` using Socket.IO

### Key Features

- Real-time messaging with Socket.IO
- Customizable UI colors and styling
- Google Analytics integration
- Sound notifications
- Session metrics tracking
- UTM parameter handling
- Mobile-responsive design with full-screen mobile chat
- Typing indicators and greeting modals

### Styling

- Uses Tailwind CSS for styling
- Scoped styles in Vue components
- CSS custom properties for theme customization
- Responsive design with mobile-first approach

### Dependencies

- Vue 3 with Composition API
- Socket.IO client for real-time communication
- UUID for unique user identification
- DOMPurify for content sanitization
- bad-words for content filtering
- Tailwind CSS for styling

## File Structure

- `src/App.vue` - Main widget component
- `src/components/` - Vue components
- `src/composable/` - Vue composables for shared logic
- `src/utils/` - Utility functions
- `src/assets/` - Static assets including sounds
- `src/widget-entry.js` - Web component entry point
- `dist/` - Built library files