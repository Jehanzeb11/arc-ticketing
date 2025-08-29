# Ticketing System Dashboard

A modern, responsive ticketing system dashboard built with Next.js 15, TypeScript, and Material-UI. This application provides comprehensive ticket management capabilities with real-time updates and advanced filtering options.

## 🚀 Features

### 🎯 Core Features

- **Ticket Management**: Create, view, edit, and archive support tickets
- **User Authentication**: Secure login/signup with JWT authentication
- **Role-Based Access**: Different permission levels for users and departments
- **Real-time Updates**: Live ticket status updates using React Query
- **Advanced Filtering**: Filter tickets by status, priority, department, type, and assignee
- **Date Range Filtering**: Filter tickets by creation date
- **Search Functionality**: Global search across all ticket fields
- **Responsive Design**: Mobile-first responsive interface

### 📊 Dashboard Features

- **Analytics Dashboard**: View ticket statistics and KPIs
- **Department Management**: Organize tickets by departments
- **User Management**: Manage system users and their roles
- **Archive System**: Archive and restore tickets
- **Ticket Assignment**: Assign tickets to specific users
- **Priority Management**: Set and manage ticket priorities

### 🎨 UI/UX Features

- **Material-UI Components**: Modern, accessible UI components
- **Dark/Light Theme**: Theme switching capability
- **Internationalization**: Multi-language support (English/Urdu)
- **Custom Styling**: Tailored CSS for enhanced user experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Styling**: CSS Modules + Global CSS
- **Icons**: Material-UI Icons + Custom SVGs

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Mock API**: JSON Server
- **Date Handling**: Day.js
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forget-password/
│   │   └── reset-password/
│   ├── tickets/                  # Ticket management pages
│   │   ├── [id]/                 # Individual ticket view
│   │   └── archive/              # Archived tickets
│   ├── all-users/                # User management
│   ├── department/               # Department management
│   ├── roles-permission/         # Role & permission management
│   ├── analytics/                # Analytics dashboard
│   └── admin-profile/            # Admin profile settings
├── components/                   # Reusable components
│   ├── common/                   # Shared components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Select/
│   │   └── Form/
│   ├── layout/                   # Layout components
│   │   └── Sidebar/
│   ├── pages/                    # Page-specific components
│   └── theme/                    # Theme configuration
├── assets/                       # Static assets
│   ├── icons/                    # SVG icons
│   └── images/                   # Images
├── lib/                          # Utility libraries
│   ├── api/                      # API configuration
│   └── constants/                # App constants
├── hooks/                        # Custom React hooks
├── store/                        # Zustand stores
├── utils/                        # Utility functions
├── locales/                      # Internationalization files
└── providers/                    # React providers
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ticketing-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   LIVE_BASE_URL=your_live_api_url
   LOCAL_BASE_URL=your_local_api_url
   ```

4. **Start the development server**

   ```bash
   # Start Next.js development server
   npm run dev

   # Start JSON server (in another terminal)
   npm run json-server
   ```

5. **Open your browser**
   Navigate to `http://localhost:3004`

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3004
npm run json-server  # Start mock API server on port 3002

# Production
npm run build        # Build for production
npm start           # Start production server on port 4001

# Code Quality
npm run lint        # Run ESLint
```

## 🔧 Configuration

### API Configuration

The application uses a flexible API configuration system:

- **Development**: Uses JSON Server for mock data
- **Production**: Configurable API endpoints via environment variables
- **Proxy Setup**: Next.js rewrites for API routing

### Theme Configuration

Customize the application theme in `src/components/theme/`:

- Material-UI theme customization
- CSS custom properties
- Font configurations (Poppins, DM Sans)

### Internationalization

Add new languages in `src/locales/`:

- English (`en/translation.json`)
- Urdu (`ur/translation.json`)

## 📊 Key Components

### Ticket Management

- **Ticket List**: Paginated table with sorting and filtering
- **Ticket Creation**: Modal-based ticket creation form
- **Ticket View**: Detailed ticket view with conversation history
- **Archive System**: Archive/unarchive functionality

### User Management

- **User List**: Manage system users
- **Role Assignment**: Assign roles and permissions
- **Department Assignment**: Organize users by departments

### Analytics

- **KPI Cards**: Key performance indicators
- **Charts**: Visual representation of ticket data
- **Filters**: Date range and category filters

## 🔐 Authentication

The application includes a complete authentication system:

- JWT-based authentication
- Protected routes
- Role-based access control
- Password reset functionality
- Social login integration ready

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based responsive grid
- Touch-friendly interface
- Optimized for tablets and mobile devices

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Set the following environment variables for production:

- `LIVE_BASE_URL`: Production API URL
- `LOCAL_BASE_URL`: Development API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Component-based architecture
- Custom hooks for reusable logic

## 🐛 Known Issues

- Build warnings disabled for faster development
- Some TypeScript strict checks bypassed
- MUI compatibility configurations applied

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Frontend Development**: React/Next.js Team
- **UI/UX Design**: Design Team
- **Backend Integration**: API Team

---

**Built with ❤️ using Next.js, TypeScript, and Material-UI**
