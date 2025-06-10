# Dev TODO

## T0. Setup & Configuration
- [x] Initialize Next.js 15 project with TypeScript
- [x] Install required packages (Chakra UI, Mongoose, auth libraries)
- [x] Setup MongoDB connection
- [x] Configure environment variables (JWT_SECRET, MONGODB_URI, GIPHY_API_KEY)
- [x] Setup Chakra UI provider and theme

## T1. Authentication System
- [x] Create User model (email, password, createdAt)
- [x] Implement bcrypt password hashing
- [x] Build JWT token generation/verification
- [x] Create auth middleware for protected routes

## T2. Landing/Login Page (`/`)
- [x] Design login/register form UI
- [x] Implement login API endpoint
- [x] Implement register API endpoint
- [x] Add form validation and error handling
- [x] Redirect authenticated users to dashboard

## T3. Dashboard Page (`/dashboard`)
- [ ] Create protected route wrapper
- [ ] Display user's created messages list
- [ ] Show message status (viewed/unviewed)
- [ ] Display response emojis from viewers
- [ ] Add "Create New Message" button
- [ ] Implement message deletion for creators

## T4. Message Compose Page (`/dashboard/create`)
- [ ] Create Message model (content, creator, viewToken, isViewed, expiresAt, response)
- [ ] Build emoji picker integration
- [ ] Implement Giphy search and selection
- [ ] Add content type toggle (emoji/gif)
- [ ] Create message API endpoint
- [ ] Generate unique viewing tokens (UUID)
- [ ] Show shareable link after creation
- [ ] Add QR code generation for links

## T5. Message View Page (`/message/[token]`)
- [ ] Create public message viewing route
- [ ] Implement one-time viewing logic
- [ ] Display emoji or GIF content
- [ ] Add emoji response selector for viewer
- [ ] Send response emoji to message creator
- [ ] Mark message as viewed and burn token
- [ ] Handle expired/invalid tokens
- [ ] Add "Message has been destroyed" confirmation

## T6. API Routes
- [ ] `/api/auth/login` - User authentication
- [ ] `/api/auth/register` - User registration
- [ ] `/api/messages` - Create message, list user messages
- [ ] `/api/messages/[id]` - Get specific message details
- [ ] `/api/messages/view/[token]` - View and burn message, save response

## T7. Components
- [ ] `MessageComposer` - Emoji/GIF selection interface
- [ ] `MessageList` - Display user's messages with status
- [ ] `MessageViewer` - Render emoji/GIF content
- [ ] `ShareModal` - Show link/QR code for sharing
- [ ] `ProtectedRoute` - Auth wrapper component

## T19. Security & Polish
- [ ] Add message expiration cleanup job
- [ ] Implement rate limiting for message creation
- [ ] Add loading states and error boundaries
- [ ] Responsive design for mobile devices
- [ ] Add confirmation dialogs for destructive actions
- [ ] Test cross-browser compatibility

## T99. Testing & Deployment
- [ ] Test message creation and viewing flow
- [ ] Verify token burning mechanism
- [ ] Test authentication edge cases
- [ ] Deploy to production environment
