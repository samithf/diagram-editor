# Visual Diagram Builder

A modern, collaborative visual diagram building application built with React, TypeScript, and Firebase. Create, edit, and share interactive flowcharts and diagrams with real-time collaboration features.

![Visual Diagram Builder](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange?style=for-the-badge&logo=firebase)

## 🌟 Features

### 📊 **Visual Diagram Editor**

- Interactive node-based diagram creation with ReactFlow
- Customizable nodes with editable labels
- Multiple edge types and connection styles
- Context menus for quick actions
- Background grid and zoom controls

### 🔐 **Authentication & Authorization**

- Firebase Authentication integration
- Secure user registration and login
- Role-based access control (Editor/Viewer roles)
- Protected routes and secure API endpoints

### 👥 **Collaboration & Sharing**

- Share diagrams with specific users
- Granular permissions (View/Edit access)
- User management for shared diagrams

### 💾 **Data Management**

- Cloud storage with Firebase Firestore
- Diagram versioning and updates
- Bulk operations (create, read, update, delete)

### 🎨 **Modern UI/UX**

- Dark/Light theme support
- Clean, intuitive interface with shadcn/ui components
- Toast notifications for user feedback
- Loading states and error handling

### 📱 **Dashboard Features**

- Personal diagram library
- Shared diagrams overview
- Quick access to recent work
- Comprehensive diagram management

## 🚀 Tech Stack

### **Frontend**

- **React 19.2.0** - Modern React with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript development
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **ReactFlow 12.9.3** - Interactive node-based diagrams
- **React Router Dom 7.9.6** - Client-side routing

### **UI/UX**

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful SVG icons

### **Backend Services**

- **Firebase 12.6.0**
  - Authentication (Email/Password)
  - Firestore Database (NoSQL)

### **Forms & Validation**

- **React Hook Form 7.67.0** - Performant forms
- **Zod 4.1.13** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration

### **Developer Experience**

- **ESLint 9.39.1** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - React support in Vite

## �️ Firestore Database Structure

The application uses Firebase Firestore with the following collections and document structure:

### **Collections Overview**

```
firestore/
├── diagrams/           # User-created diagrams
├── userAccess/         # Diagram sharing permissions
└── users/              # User profile data
```

### **Data Flow Examples**

**Creating a Diagram:**

1. User creates diagram in editor
2. Document added to `diagrams/` collection
3. `userId` field set to current user's UID

**Sharing a Diagram:**

1. Owner enters collaborator's email
2. System looks up user in `users/` collection
3. Document updated in `userAccess/{collaboratorId}`
4. Collaborator can now access diagram

**Loading Shared Diagrams:**

1. Query `userAccess/{currentUserId}`
2. Extract `diagramId`s from `accessibleDiagrams` array
3. Fetch diagram details from `diagrams/` collection
4. Display in "Shared with Me" section

## �📦 Installation

### Prerequisites

- **Node.js** (version 18+ recommended)
- **pnpm** (recommended) or npm
- **Firebase Account** for backend services

### 1. Clone the Repository

```bash
git clone https://github.com/samithf/diagram-editor.git
cd visual-diagram-builder
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

replace placeholders with correct env values shared

### 4. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Available Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |
| `pnpm lint`    | Run ESLint               |

## 🧪 Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Open interactive test UI
pnpm test:ui
```

**Current Coverage:** 100% ✅ (35 tests passing)

See [TEST_COVERAGE.md](./TEST_COVERAGE.md) for details.

## 🎯 Usage

### Creating Diagrams

1. **Sign up** for a new account or **log in**
2. Navigate to **Dashboard** to view your diagrams
3. Click **"Create New Diagram"** to start building
4. Use the toolbar to:
   - Add nodes to your diagram
   - Connect nodes with edges
   - Save your work with a custom name
   - Clear the canvas when needed

### Collaboration

1. **Share a diagram** by clicking the share button
2. **Enter user email** and select permission level:
   - **View**: Read-only access
   - **Edit**: Full editing permissions
3. **Manage shared users** in the sharing dialog
4. **Access shared diagrams** in the "Shared with Me" section

### Editing Features

- **Double-click nodes** to edit labels
- **Right-click** for context menus
- **Drag to connect** nodes with edges
- **Pan and zoom** to navigate large diagrams

## 🔐 Security

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Role-based access control
- **Data Privacy**: User-specific data isolation
- **Secure API**: Firebase Security Rules

Made with ❤️ by [Samith](https://github.com/samithf)
