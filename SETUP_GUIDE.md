# Vocelio Flow Builder Setup Guide

## Overview
A production-ready React Flow Builder with Supabase integration and Twilio calling capabilities. This application allows you to create sophisticated conversation flows with objection handling, test them with real phone calls, and manage them with team collaboration features.

## Features
- ✅ **React Flow Canvas** - Drag & drop node-based flow builder
- ✅ **Sidebar Node Editor** - Comprehensive editing with objection handling
- ✅ **Supabase Integration** - Full database persistence
- ✅ **Twilio Test Calls** - Real phone call testing
- ✅ **OpenAI Enhancement** - AI-powered script improvement
- ✅ **Dark/Light Mode** - Professional SaaS interface
- ✅ **Responsive Design** - Mobile-friendly layout
- 🚧 **Team Collaboration** - Multi-user editing (coming soon)
- 🚧 **Advanced Analytics** - Performance tracking (coming soon)

## Quick Start

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd vocelio-dashboard
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

### Backend Setup

1. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_service_role_key
   ```

3. **Start FastAPI Server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your Project URL and API keys

2. **Run Database Schema**
   - Go to your Supabase dashboard → SQL Editor
   - Copy and paste the contents of `backend/database_schema.sql`
   - Run the script to create all tables and functions

3. **Enable Row Level Security**
   - The schema automatically enables RLS for data protection
   - Users can only access their own flows

## API Endpoints

### Flow Management
- `POST /api/save-flow` - Save flow with nodes and edges
- `GET /api/load-flow` - Load the most recent flow
- `GET /api/flows` - Get all flows for user
- `POST /api/promote-flow/{flow_id}` - Promote flow to production

### Test Calling
- `POST /api/test-call` - Initiate test call with Twilio
  ```json
  {
    "phone_number": "+1234567890",
    "flow_nodes": [...]
  }
  ```

### Health Check
- `GET /api/health` - API health status

## Project Structure

```
vocelio-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── FlowBuilder.jsx # Main React Flow component
│   ├── lib/
│   │   └── supabase.js     # Supabase client and helpers
│   ├── pages/
│   │   └── FlowBuilder.js  # Page wrapper with tabs
│   └── ...
├── backend/
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── database_schema.sql # Supabase database schema
│   └── .env.example        # Environment template
└── README.md
```

## Core Components

### Node Types
- **Start Node** - Call entry point
- **Message Node** - AI speech with objection handling
- **Condition Node** - Decision branching
- **Action Node** - System actions
- **End Node** - Call termination

### Node Editor Features
- **Basic Settings**: Label, main script
- **Objection Handling**: 3 predefined objection types
- **Advanced Settings**: Temperature, interruption threshold, skip responses

### Database Schema
- `flows` - Flow metadata
- `flow_nodes` - Node data and positions
- `flow_edges` - Connection data
- `test_calls` - Call logging
- `flow_templates` - Predefined templates

## Usage Guide

### Creating a Flow
1. Click "Flow Builder" tab
2. Drag nodes from the toolbar or use + buttons
3. Connect nodes by dragging from connection points
4. Click any node to edit in the sidebar
5. Save your flow with the Save button

### Testing a Flow
1. Complete your flow design
2. Click "Test Call" button
3. Enter a phone number
4. The system will:
   - Combine node scripts
   - Enhance with OpenAI
   - Place test call via Twilio

### Managing Flows
- **Save Flow**: Persists to Supabase with versioning
- **Load Flow**: Retrieves most recent flow
- **Promote**: Marks flow as production-ready

## Customization

### Adding New Node Types
1. Create node component in `FlowBuilder.jsx`
2. Add to `nodeTypes` object
3. Update `NodeEditor` with settings UI
4. Add database fields if needed

### Extending Objection Handling
1. Modify `NodeEditor` objection sections
2. Update database schema if needed
3. Enhance backend script processing

### Adding Templates
1. Insert into `flow_templates` table
2. Create template selector UI
3. Implement template loading logic

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy with build command: `npm run build`

### Backend (Railway/Heroku/AWS)
1. Deploy FastAPI application
2. Set environment variables
3. Ensure CORS origins include your frontend domain

### Database (Supabase)
1. Production project automatically scales
2. Configure backup policies
3. Monitor usage and performance

## Security Considerations

- ✅ Row Level Security enabled on all tables
- ✅ API key validation for external services
- ✅ CORS properly configured
- ✅ User authentication via Supabase Auth
- ⚠️ Phone number validation in place
- ⚠️ Rate limiting recommended for production

## Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
npm install reactflow @supabase/supabase-js
```

**Supabase connection errors**
- Verify URL and API key in `.env.local`
- Check database schema is applied
- Ensure RLS policies allow access

**Twilio call failures**
- Verify account SID and auth token
- Check phone number format (+1234567890)
- Ensure Twilio account has calling credits

**CORS errors**
- Add your frontend domain to backend CORS_ORIGINS
- Check API_URL in React environment variables

### Debug Mode
Enable debug logging:
```env
# Backend
LOG_LEVEL=DEBUG

# Frontend
REACT_APP_ENVIRONMENT=development
```

## Support & Contributing

For issues or feature requests, please create an issue in the repository.

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- ESLint for JavaScript/React
- Black for Python formatting
- TypeScript support ready
- Component documentation required

## License

This project is licensed under the MIT License.
