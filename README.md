# Guardian Guide

**Your Rights, Your Voice, Instantly Accessible.**

Guardian Guide is a mobile-first web application that provides instant access to rights information and actionable guidance during police interactions, with multi-lingual support and rapid incident documentation.

## 🚀 Features

### Core Features
- **State-Specific Rights Guides**: Mobile-optimized summaries of individual rights tailored to your location
- **Multi-lingual Scripts & Phrases**: Pre-written, effective phrases in English and Spanish for de-escalation
- **One-Tap Incident Recording**: Instantly start audio/video recording with location and timestamp
- **Emergency Contact Alerts**: Immediately notify pre-selected contacts with location and incident details
- **Auto-Generated Shareable Cards**: Quick summary cards with key rights and actions

### Premium Features
- Advanced state-specific guides
- Unlimited recording storage
- Offline access
- Multi-language support
- Priority support

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **AI**: OpenAI GPT-3.5 Turbo
- **Icons**: Lucide React
- **Deployment**: Docker ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account (for payments)
- OpenAI API key (for content generation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-9054.git
cd this-is-a-9054
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys and configuration:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
3. Create a storage bucket named "recordings" for file uploads
4. Configure Row Level Security policies as defined in the schema

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CallToActionButton.jsx
│   ├── InfoCard.jsx
│   └── NavigationHeader.jsx
├── views/              # Main application views
│   ├── HomeView.jsx
│   ├── RightsGuideView.jsx
│   ├── RecordingView.jsx
│   ├── EmergencyView.jsx
│   └── ProfileView.jsx
├── utils/              # Utility functions
│   ├── supabase.js     # Database operations
│   ├── stripe.js       # Payment processing
│   ├── emergency.js    # Emergency notifications
│   ├── contentGeneration.js  # AI content generation
│   └── location.js     # Location services
├── App.jsx             # Main app component
└── main.jsx           # App entry point
```

## 🔧 Configuration

### Supabase Setup

1. **Database Schema**: Import `database-schema.sql` into your Supabase project
2. **Storage**: Create a "recordings" bucket for video/audio files
3. **Authentication**: Enable email/password authentication
4. **Row Level Security**: Policies are included in the schema

### Stripe Setup

1. Create products and prices in your Stripe dashboard
2. Update the price IDs in `src/utils/stripe.js`
3. Set up webhooks for subscription events (if using backend)

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your `.env` file
3. Monitor usage to manage costs

## 🚀 Deployment

### Docker Deployment

Build and run with Docker:

```bash
docker build -t guardian-guide .
docker run -p 3000:3000 guardian-guide
```

### Manual Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider.

## 📱 Usage

### For Users

1. **Location Detection**: App automatically detects your state for relevant legal guides
2. **Know Your Rights**: Access state-specific rights information instantly
3. **Record Incidents**: One-tap recording with automatic location tagging
4. **Emergency Alerts**: Notify trusted contacts immediately
5. **Share Information**: Generate and share incident summary cards

### For Developers

#### Adding New States

1. Add legal guide content to the database:
```sql
INSERT INTO legal_guides (state, content, language) VALUES 
('TX', '{"coreRights": [...], "scenarios": [...]}', 'en');
```

2. Update location detection in `src/utils/location.js`

#### Adding New Languages

1. Update language options in components
2. Add translations to legal guides
3. Update content generation prompts

## 🔒 Security & Privacy

- **Data Encryption**: Sensitive data encrypted at rest
- **Row Level Security**: Database access restricted by user
- **HTTPS Only**: All communications encrypted in transit
- **Privacy First**: Minimal data collection, user controls data

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📄 API Documentation

### Supabase Tables

- **users**: User profiles and preferences
- **incidents**: Recorded incidents and metadata
- **legal_guides**: State-specific legal information
- **emergency_alerts**: Emergency notification logs

### Key Functions

- `createIncident()`: Save new incident with recording
- `sendEmergencyAlert()`: Notify emergency contacts
- `generateStateSpecificGuide()`: AI-generated legal content
- `upgradeToPremium()`: Handle subscription upgrades

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

- [ ] iOS/Android mobile apps
- [ ] Additional languages (French, Chinese)
- [ ] Integration with legal aid organizations
- [ ] Advanced analytics dashboard
- [ ] Offline mode for premium users
- [ ] Voice-activated recording
- [ ] Integration with body cameras

## ⚖️ Legal Disclaimer

Guardian Guide provides general information about legal rights and is not a substitute for professional legal advice. Users should consult with qualified attorneys for specific legal situations. The app developers are not responsible for the accuracy of legal information or outcomes of police interactions.

## 🙏 Acknowledgments

- Legal rights information sourced from ACLU and civil rights organizations
- UI/UX inspired by emergency response applications
- Community feedback from civil rights advocates

---

**Guardian Guide** - Empowering citizens with knowledge and tools to protect their rights during police interactions.
