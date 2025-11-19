# ☀️ SkySift - Smart Weather Application

![SkySift Banner](https://img.shields.io/badge/Weather-App-blue?style=for-the-badge&logo=weatherapi)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase)
![Webpack](https://img.shields.io/badge/Webpack-Bundled-8DD6F9?style=for-the-badge&logo=webpack)

**SkySift** is a modern, responsive weather application that provides real-time weather data with user authentication, personalized settings, and push notifications for weather alerts.

🌐 **Live Demo:** [https://skysift.netlify.app](https://skysift.netlify.app)

---

## ✨ Features

### 🌤️ Weather Features
- **Real-time Weather Data** - Current conditions from OpenWeather API
- **7-Day Forecast** - Extended weather predictions with detailed metrics
- **Hourly Forecast** - Hour-by-hour weather breakdown
- **Multiple Cities** - Search and switch between any city worldwide
- **Weather Icons** - Beautiful emoji-based weather visualization
- **Detailed Metrics** - Wind speed, humidity, visibility, feels-like temperature

### 👤 User Features
- **User Authentication** - Secure Firebase authentication (Sign up / Sign in)
- **User Profiles** - Personalized profiles with avatar upload
- **Persistent Settings** - Save preferences across sessions
- **Guest Mode** - Browse weather without signing in

### ⚙️ Customization
- **Temperature Units** - Celsius / Fahrenheit
- **Wind Speed Units** - km/h / mph
- **Precipitation Units** - mm / inches
- **Last Location Memory** - Remembers your last searched city

### 🔔 Notifications
- **Weather Alerts** - Get notified of severe weather conditions
- **Daily Forecasts** - Optional daily weather summaries
- **Push Notifications** - Browser push notifications via Firebase Cloud Messaging (FCM)

### 📱 Responsive Design
- Mobile-first design
- Touch-friendly interface
- Sidebar navigation
- Modal dialogs for enhanced UX

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Modern styling with animations |
| **Vanilla JavaScript (ES6+)** | Core functionality |
| **Webpack 5** | Module bundling |
| **Firebase Authentication** | User management |
| **Firebase Firestore** | Database for user data |
| **Firebase Cloud Messaging** | Push notifications |
| **OpenWeather API** | Weather data |
| **Netlify** | Hosting and CI/CD |

---

## 📂 Project Structure
- skysift/
- ├── src/
- │   ├── image/                 # Images and icons
- │   ├── index.html            # Main HTML file
- │   ├── index.js              # Main JavaScript file
- │   ├── style.css             # Stylesheet
- │   └── firebase-messaging-sw.js  # Service worker for FCM
- ├── dist/                      # Build output (auto-generated)
- ├── node_modules/             # Dependencies (auto-generated)
- ├── .env                      # Environment variables (create this)
- ├── .gitignore               # Git ignore file
- ├── package.json             # Project config
- ├── webpack.config.js        # Webpack configuration
- └── README.md               # This file

## 🎮 Usage
- For Guests
- Visit the website
- View weather for default city (Lagos)
- Search for any city worldwide
- View 7-day and hourly forecasts
- Change temperature and wind speed units
- For Registered Users
- Click Sign Up to create an account
- Log in with your credentials
- Upload a profile avatar
- Customize notification preferences
- Save favorite cities (automatically remembers last search)
- Receive weather alerts via push notifications
