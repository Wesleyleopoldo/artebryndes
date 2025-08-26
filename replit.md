# Overview

This is a full-stack web application built with React, TypeScript, and Express.js. The project appears to be an e-commerce platform for handmade crafts and bags ("Artes Bryndes"), featuring a modern UI built with shadcn/ui components and Tailwind CSS. The application uses a PostgreSQL database with Drizzle ORM for data management and includes user authentication capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Comprehensive set of Radix UI primitives wrapped in shadcn/ui components

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Development**: Hot module replacement via Vite integration in development mode
- **Build Process**: esbuild for server-side bundling

## Data Storage
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`

## Authentication and Authorization
- **User Model**: Basic user schema with username/password authentication
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Session Management**: Express sessions with PostgreSQL backing store

## External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Library**: Radix UI primitives for accessible component foundations
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date manipulation
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build Tools**: Vite for frontend bundling, esbuild for backend compilation