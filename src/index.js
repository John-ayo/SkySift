import './style.css';

(() => {
        const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
        const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
        
        let auth = null;
        let db = null;
        let messaging = null;
        
        let currentCity = 'Lagos'; // sensible default for NG users
        let currentWeatherData = null;
        let currentForecastData = null;
        
        const userPreferences = {
            temperature: 'celsius',
            windspeed: 'kmh',
            precipitation: 'mm',
            theme: 'auto',
            weatherAlerts: true,
            severeWeather: true,
            dailyForecast: false,
        };
const authOverlay = document.getElementById('authOverlay');
const signupCard = document.getElementById('signupCard');
const loginCard = document.getElementById('loginCard');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');
const forgotPassword = document.getElementById('forgotPassword');
const profileIcon = document.getElementById('profileIcon');
const notificationBanner = document.getElementById('notificationBanner');
const closeNotification = document.getElementById('closeNotification');
const loadingSpinner = document.getElementById('loadingSpinner');
const userNameDisplay = document.getElementById('userName');

// Auth close buttons
const closeSignup = document.getElementById('closeSignup');
const closeLogin = document.getElementById('closeLogin');

const menuBtn = document.getElementById('menuBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebar = document.getElementById('closeSidebar');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsSubmenu = document.getElementById('settingsSubmenu');
  const notificationsToggle = document.getElementById('notificationsToggle');
  const notificationsSubmenu = document.getElementById('notificationsSubmenu');
  const appearanceToggle = document.getElementById('appearanceToggle');
  const appearanceSubmenu = document.getElementById('appearanceSubmenu');
  const locationItem = document.getElementById('locationItem');
  const userNameSidebar = document.getElementById('userNameSidebar');
  const userEmailSidebar = document.getElementById('userEmailSidebar');
  const userAvatar = document.getElementById('userAvatar');
  const sidebarLogout = document.getElementById('sidebarLogout');
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarUploadBtn = document.getElementById('avatarUploadBtn');

  // Guest / Auth UI
  const sidebarUserProfile = document.getElementById('sidebarUserProfile');
  const sidebarGuestProfile = document.getElementById('sidebarGuestProfile');
  const sidebarSigninBtn = document.getElementById('sidebarSigninBtn');
  const sidebarSignupBtn = document.getElementById('sidebarSignupBtn');
  const guestSignupLink = document.getElementById('guestSignupLink');
  const loggedInMenu = document.getElementById('loggedInMenu');
  const sidebarGuestFooter = document.getElementById('sidebarGuestFooter');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogout = document.getElementById('confirmLogout');
  const cancelLogout = document.getElementById('cancelLogout');
  const logoutUserName = document.getElementById('logoutUserName');
  const logoutUserEmail = document.getElementById('logoutUserEmail');
  
  const locationModal = document.getElementById('locationModal');
  const closeLocationModal = document.getElementById('closeLocationModal');
  const citySearch = document.getElementById('citySearch');
  const searchCityBtn = document.getElementById('searchCityBtn');
  const citySuggestions = document.getElementById('citySuggestions');
  
  const hourlyModal = document.getElementById('hourlyModal');
  const closeHourlyModal = document.getElementById('closeHourlyModal');
  const viewHourly = document.getElementById('viewHourly');
  const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
  
  // Weather UI
  const cityNameEl = document.getElementById('cityName');
  const currentDateEl = document.getElementById('currentDate');
  const weatherConditionEl = document.getElementById('weatherCondition');
  const temperatureEl = document.getElementById('temperature');
  const dailySummaryEl = document.getElementById('dailySummary');
  const windSpeedEl = document.getElementById('windSpeed');
  const humidityEl = document.getElementById('humidity');
  const visibilityEl = document.getElementById('visibility');
  const forecastGridEl = document.getElementById('forecastGrid');
  
// Register Service Worker for Push Notifications
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration);
                
                // Tell messaging to use this service worker
                if (messaging) {
                    messaging.useServiceWorker(registration);
                }
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
                console.error('Error details:', error.message);
                
                // Check if file exists
                fetch('/firebase-messaging-sw.js')
                    .then(response => {
                        if (!response.ok) {
                            console.error('Service worker file not found! Make sure firebase-messaging-sw.js is in root directory');
                        }
                    })
                    .catch(() => {
                        console.error('Cannot reach service worker file');
                    });
            });
    } else {
        console.warn('Service Workers not supported in this browser');
    }
}
  
function initFirebase() {
  if (typeof firebase === 'undefined' || !firebase.apps) {
    console.error('Firebase SDK not loaded!');
    alert('Firebase failed to load. Check your connection and refresh.');
    return false;
   }
      
     const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
   };
      
      try {
          if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
          else firebase.app();
          
          auth = firebase.auth();
          db = firebase.firestore();
          
        // === FCM: Only if supported ===
        if (firebase.messaging?.isSupported()) {
            try {
                messaging = firebase.messaging();
                console.log('FCM ready');
                
                // Listen for foreground messages
                messaging.onMessage((payload) => {
                    console.log('FCM Message:', payload);
                    const title = payload.notification?.title || 'Weather Alert';
                    const body = payload.notification?.body || '';
                    showInAppNotification(title, body);
                });
            } catch (e) {
                console.warn('FCM not available:', e);
            }
        } else {
            console.log('FCM not supported in this browser');
        }          
          
          if (firebase.messaging.isSupported()) {
              try {
                  messaging = firebase.messaging();
                  console.log('FCM initialised');
              } catch (e) {
                  console.warn('FCM init error:', e);
              }
          }
          
          console.log('Firebase ready');
          return true;
      } catch (e) {
          console.error('Firebase init error:', e);
          alert('Failed to initialise Firebase.');
          return false;
      }
  }
  
function attachAuthListener() {
  if (!auth) return;
  
  auth.onAuthStateChanged(async (user) => {
    try {
      if (user) {
        console.log('Logged in:', user.email);
        hideAuthOverlay();
        hideNotificationBanner();
        await loadUserProfile(user);
      } else {
        console.log('Logged out');
        showGuestUI();
        await fetchWeatherData(currentCity);
        showAuthOverlayAfterDelay();
        
        setTimeout(() => {
          showAuthOverlay();
          showNotificationBanner();
        }, 500); // Small delay to prevent flash
      }
    } catch (err) {
      console.error('Auth state error:', err);
    } finally {
      hideLoading();
    }
  });
}

  async function loadUserProfile(user) {
      try {
          const doc = await db.collection('users').doc(user.uid).get();
          if (!doc.exists) return;
          
          const data = doc.data();
          const name = data.name || user.email.split('@')[0];
          const email = data.email || user.email;
          
          if (userNameDisplay) {
              userNameDisplay.textContent = name;
              userNameDisplay.classList.remove('hidden');
          }
          if (userNameSidebar) userNameSidebar.textContent = name;
          if (userEmailSidebar) userEmailSidebar.textContent = email;
          
          if (data.profilePicture && userAvatar) {
              const img = document.createElement('img');
              img.src = data.profilePicture;
              img.alt = 'Avatar';
              userAvatar.innerHTML = '';
              userAvatar.appendChild(img);
              if (avatarUploadBtn) userAvatar.appendChild(avatarUploadBtn);
          }
          
          if (data.settings) {
              Object.assign(userPreferences, data.settings);
              applyUserPreferences();
              if (data.settings.lastCity) currentCity = data.settings.lastCity;
          }
          
          sidebarUserProfile?.classList.remove('hidden');
          sidebarGuestProfile?.classList.add('hidden');
          loggedInMenu?.classList.remove('hidden');
          sidebarLogout?.parentElement?.classList.remove('hidden');
          sidebarGuestFooter?.classList.add('hidden');
          
                  // Request notification permission and FCM token
        if (messaging) {
          try {
            let permission = Notification.permission;
            
            if (permission === 'default') {
              permission = await Notification.requestPermission();
            }
            
            if (permission === 'granted') {
              console.log('Notification permission granted');
              
              const token = await messaging.getToken({
                vapidKey: process.env.FIREBASE_VAPID_KEY
              });
              
              if (token) {
                console.log('FCM Token obtained:', token);
                
                await db.collection('users').doc(user.uid).update({
                  fcmToken: token,
                  notificationPermission: true,
                  tokenUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                console.log('FCM token saved to database');
              }
            } else {
              console.log('Notification permission denied');
              await db.collection('users').doc(user.uid).update({
                notificationPermission: false
              });
            }
          } catch (e) {
            console.error('FCM token error:', e);
          }
        }
          
          await fetchWeatherData(currentCity);
      } catch (e) {
          console.error('loadUserProfile error:', e);
      }
  }
  
  function showGuestUI() {
      sidebarUserProfile?.classList.add('hidden');
      sidebarGuestProfile?.classList.remove('hidden');
      loggedInMenu?.classList.add('hidden');
      sidebarLogout?.parentElement?.classList.add('hidden');
      sidebarGuestFooter?.classList.remove('hidden');
      if (userNameDisplay) userNameDisplay.classList.add('hidden');
  }
  
  async function fetchWeatherData(city = currentCity) {
      showLoading();
      try {
          currentCity = city;
          
          const [curRes, foreRes] = await Promise.all([
              fetch(`${WEATHER_API_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`),
              fetch(`${WEATHER_API_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
          ]);
          
          if (!curRes.ok) throw new Error('City not found');
          
          const current = await curRes.json();
          const forecast = await foreRes.json();
          
          currentWeatherData = current;
          currentForecastData = forecast;
          
          updateWeatherUI(current, forecast);
          if (auth?.currentUser) await saveUserPreference('lastCity', city);
      } catch (err) {
          //console.error('Weather fetch error:', err);
          showWeatherError(`Weather unavailable for "${city}".`);
      } finally {
          hideLoading();
      }
  }
  
  function showInAppNotification(title, message) {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #1a73e8; color: white;
      padding: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000; max-width: 350px; font-family: system-ui; animation: slideIn 0.3s;
    `;
    banner.innerHTML = `
      <div style="font-weight:600; margin-bottom:4px;">${title}</div>
      <div style="font-size:0.9rem;">${message}</div>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background:none; border:none; color:white; font-weight:bold; float:right; cursor:pointer;">
        ×
      </button>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 8000);
}

// Add animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
document.head.appendChild(style);
  
  function updateWeatherUI(current, forecast) {
    if (!current || !forecast) return;

    // City & Date
    cityNameEl && (cityNameEl.textContent = current.name);
    currentDateEl && (currentDateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    }));

    // CURRENT CONDITION + EMOJI
    if (weatherConditionEl) {
      const main = current.weather[0].main;
      const desc = current.weather[0].description;
      const emoji = getWeatherIconEmoji(main, desc);
      const text = desc.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      weatherConditionEl.innerHTML = `
        <div style="font-size:1.8rem;margin-bottom:8px;">${emoji}</div>
        <div style="font-weight:500;font-size:1.1rem;">${text}</div>
      `;
    }

    // Temperature
    const tempC = Math.round(current.main.temp);
    const displayTemp = convertTemperature(tempC, userPreferences.temperature);
    temperatureEl && (temperatureEl.textContent = `${displayTemp}°`);

    // Wind, Humidity, Visibility
    const windKmh = Math.round(current.wind.speed * 3.6);
    const displayWind = convertWindSpeed(windKmh, userPreferences.windspeed);
    const windUnit = userPreferences.windspeed === 'kmh' ? 'km/h' : 'mph';
    windSpeedEl && (windSpeedEl.textContent = `${displayWind} ${windUnit}`);
    humidityEl && (humidityEl.textContent = `${current.main.humidity}%`);
    visibilityEl && (visibilityEl.textContent = `${(current.visibility / 1000).toFixed(1)} km`);

    // Daily Summary
    const feels = Math.round(current.main.feels_like);
    const min = Math.round(current.main.temp_min);
    const max = Math.round(current.main.temp_max);
    const desc = current.weather[0].description;
    dailySummaryEl && (dailySummaryEl.textContent = `Feels like ${feels}°C. ${desc[0].toUpperCase() + desc.slice(1)}. Temperature range: ${min}°C to ${max}°C today.`);

    updateForecastUI(forecast);
  }
  
  function updateForecastUI(forecast) {
      if (!forecastGridEl) return;
      forecastGridEl.innerHTML = '';
      
      const daily = forecast.list.filter(i => i.dt_txt.includes('12:00:00')).slice(0, 4);
      daily.forEach(d => {
          const date = new Date(d.dt * 1000);
          const dayStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          const temp = Math.round(d.main.temp);
          const icon = getWeatherIconEmoji(d.weather[0].main, d.weather[0].description);
          
          const card = document.createElement('div');
          card.className = 'forecast-card';
          card.innerHTML = `
        <div class="forecast-temp">${temp}°</div>
        <div class="forecast-icon" style="font-size:1.8rem;">${icon}</div>
        <div class="forecast-date">${dayStr}</div>
      `;
          forecastGridEl.appendChild(card);
      });
  }
    
  function showHourlyForecast() {
    if (!currentForecastData || !hourlyForecastContainer) return;
    hourlyForecastContainer.innerHTML = '';
    
    const hours = currentForecastData.list.slice(0, 8);
    hours.forEach(h => {
        const date = new Date(h.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temp = Math.round(h.main.temp);
        const icon = getWeatherIconEmoji(h.weather[0].main, h.weather[0].description);
        const wind = Math.round(h.wind.speed * 3.6);
        
        const el = document.createElement('div');
        el.className = 'hourly-item';
        el.innerHTML = `
      <div class="hourly-time">${time}</div>
      <div class="hourly-condition" style="font-size: 1.6rem;">${icon}</div>
      <div class="hourly-temp">${temp}°</div>
      <div class="hourly-wind">Wind ${wind} km/h</div>
    `;
        hourlyForecastContainer.appendChild(el);
    });
    
    hourlyModal?.classList.remove('hidden');
}
  
  function showWeatherError(msg) {
      document.querySelectorAll('.weather-error').forEach(el => el.remove());
      const err = document.createElement('div');
      err.className = 'weather-error';
      err.style.cssText = 'background:#d32f2f;color:#fff;padding:12px;border-radius:8px;margin:10px 0;text-align:center;';
      err.textContent = msg;
      document.querySelector('main')?.prepend(err);
      setTimeout(() => err.remove(), 6000);
  }
  
  async function saveUserPreference(key, value) {
    if (!auth?.currentUser) return;
    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        [`settings.${key}`]: value
      });
    } catch (e) {
      console.error('save pref error:', e);
    }
  }

  function applyUserPreferences() {
    document.querySelectorAll('input[type="radio"]').forEach(r => {
      if (r.name in userPreferences) r.checked = r.value === userPreferences[r.name];
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
      const name = c.id.replace('Toggle', '');
      if (name in userPreferences) c.checked = userPreferences[name];
    });
  }

  function convertTemperature(c, unit) {
    return unit === 'fahrenheit' ? Math.round(c * 9/5 + 32) : c;
  }
  function convertWindSpeed(kmh, unit) {
    return unit === 'mph' ? Math.round(kmh * 0.621371) : kmh;
  }

  function getWeatherIconEmoji(main, description = '') {
    const desc = description.toLowerCase();
    
    // Thunderstorm
    if (main === 'Thunderstorm') {
      if (desc.includes('light')) return '🌩️';
      return '⛈️';
    }
    // Drizzle
    if (main === 'Drizzle') return '🌦️';
    
    // Rain
    if (main === 'Rain') {
        if (desc.includes('light')) return '🌧️';
        if (desc.includes('heavy') || desc.includes('extreme'))
        return '🌧️';
    }
    
    // Snow
    if (main === 'Snow') {
        if (desc.includes('light')) return '🌨️';
        if (desc.includes('heavy')) return '❄️';
        return '🌨️';
    }
    
    // Atmosphere (mist, fog, haze, etc.)
    if (main === 'Mist' || main === 'Fog' || main === 'Haze') return '🌫️';
    if (main === 'Smoke' || main === 'Dust' || main === 'Sand') return '💨';
    if (main === 'Ash') return '🌋';
    if (main === 'Squall' || main === 'Tornado') return '🌪️';
    
    // Clear
    if (main === 'Clear') {
      const hour = new Date().getHours();
      // Night time (7 PM - 6 AM)
      if (hour >= 19 || hour < 6) return '🌙';
      // Day time
      return '☀️';
    }
    
    // Clouds
    if (main === 'Clouds') {
      if (desc.includes('few')) return '🌤️';
      if (desc.includes('scattered')) return '⛅';
      if (desc.includes('broken')) return '☁️';
      if (desc.includes('overcast')) return '☁️';
      return '☁️';
    }
    
    return '🌤️'; // fallback
}
  
  function showLoading() { loadingSpinner?.classList.remove('hidden'); }
  function hideLoading() { loadingSpinner?.classList.add('hidden'); }

  function hideAuthOverlay() { authOverlay?.classList.add('hidden'); }
  function showAuthOverlay() { authOverlay && (authOverlay.classList.remove('hidden')); }
  function showAuthOverlayAfterDelay() { setTimeout(showAuthOverlay, 600); }

  function hideNotificationBanner() { notificationBanner?.classList.add('hidden'); }
  function showNotificationBanner() { setTimeout(() => notificationBanner?.classList.remove('hidden'), 2000); }

  function openSidebarMenu() {
    sidebarMenu?.classList.add('active');
    sidebarOverlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebarMenu() {
    sidebarMenu?.classList.remove('active');
    sidebarOverlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function bindEvents() {
    // Signup
    signupForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const btn = signupForm.querySelector('button[type="submit"]');
      btn.disabled = true; showLoading();

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(cred.user.uid).set({
          name, email,
          notificationsEnabled: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          weatherAlerts: true
        });
        alert(`Welcome ${name}! Your account is ready.`);
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false; hideLoading();
      }
    });
    
// Login
    loginForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true; showLoading();

      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false; hideLoading();
      }
    });

    showLogin?.addEventListener('click', e => { e.preventDefault(); signupCard?.classList.add('hidden'); loginCard?.classList.remove('hidden'); });
    showSignup?.addEventListener('click', e => { e.preventDefault(); loginCard?.classList.add('hidden'); signupCard?.classList.remove('hidden'); });

    forgotPassword?.addEventListener('click', async e => {
      e.preventDefault();
      const email = prompt('Enter your email:');
      if (email) {
        showLoading();
        try { await auth.sendPasswordResetEmail(email); alert('Reset email sent!'); }
        catch (err) { alert(err.message); }
        finally { hideLoading(); }
      }
    });

    closeSignup?.addEventListener('click', hideAuthOverlay);
    closeLogin?.addEventListener('click', hideAuthOverlay);
    closeNotification?.addEventListener('click', hideNotificationBanner);

    profileIcon?.addEventListener('click', () => {
      if (auth?.currentUser) openLogoutModal();
      else showAuthOverlay();
    });

    confirmLogout?.addEventListener('click', async () => {
      showLoading();
      try { await auth.signOut(); logoutModal?.classList.add('hidden'); }
      catch (e) { console.error(e); }
      finally { hideLoading(); }
    });
    cancelLogout?.addEventListener('click', () => logoutModal?.classList.add('hidden'));

    menuBtn?.addEventListener('click', openSidebarMenu);
    closeSidebar?.addEventListener('click', closeSidebarMenu);
    sidebarOverlay?.addEventListener('click', closeSidebarMenu);

    settingsToggle?.addEventListener('click', () => toggleSubmenu(settingsToggle, settingsSubmenu));
    notificationsToggle?.addEventListener('click', () => toggleSubmenu(notificationsToggle, notificationsSubmenu));
    appearanceToggle?.addEventListener('click', () => toggleSubmenu(appearanceToggle, appearanceSubmenu));

    locationItem?.addEventListener('click', () => { closeSidebarMenu(); locationModal?.classList.remove('hidden'); });
    closeLocationModal?.addEventListener('click', () => locationModal?.classList.add('hidden'));

    citySearch?.addEventListener('input', e => {
      const q = e.target.value.trim();
      if (q.length >= 2) searchCity(q);
      else citySuggestions?.classList.add('hidden');
    });
    searchCityBtn?.addEventListener('click', () => {
      const q = citySearch?.value.trim();
      if (q) selectCity(q);
    });

    document.querySelectorAll('.city-tag').forEach(t => t.addEventListener('click', () => selectCity(t.dataset.city)));

    viewHourly?.addEventListener('click', showHourlyForecast);
    closeHourlyModal?.addEventListener('click', () => hourlyModal?.classList.add('hidden'));

    sidebarSigninBtn?.addEventListener('click', () => { closeSidebarMenu(); showAuthOverlay(); loginCard?.classList.remove('hidden'); signupCard?.classList.add('hidden'); });
    sidebarSignupBtn?.addEventListener('click', () => { closeSidebarMenu(); showAuthOverlay(); signupCard?.classList.remove('hidden'); loginCard?.classList.add('hidden'); });
    guestSignupLink?.addEventListener('click', e => { e.preventDefault(); closeSidebarMenu(); showAuthOverlay(); signupCard?.classList.remove('hidden'); loginCard?.classList.add('hidden'); });

    document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', async e => {
      const { name, value } = e.target;
      userPreferences[name] = value;
      await saveUserPreference(name, value);
      if (currentWeatherData && currentForecastData) updateWeatherUI(currentWeatherData, currentForecastData);
    }));
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.addEventListener('change', async e => {
      const key = e.target.id.replace('Toggle', '');
      userPreferences[key] = e.target.checked;
      await saveUserPreference(key, e.target.checked);
    }));

    avatarUploadBtn?.addEventListener('click', () => avatarUpload?.click());
    avatarUpload?.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) return alert('Image too large (max 2 MB).');
      if (!file.type.startsWith('image/')) return alert('Please select an image.');

      showLoading();
      const reader = new FileReader();
      reader.onload = async ev => {
        const base64 = ev.target.result;
        try {
          await db.collection('users').doc(auth.currentUser.uid).update({ profilePicture: base64 });
          const img = document.createElement('img');
          img.src = base64; img.alt = 'Avatar';
          userAvatar.innerHTML = ''; userAvatar.appendChild(img);
          if (avatarUploadBtn) userAvatar.appendChild(avatarUploadBtn);
          alert('Avatar updated!');
        } catch (err) { alert('Upload failed.'); }
        finally { hideLoading(); }
      };
      reader.readAsDataURL(file);
    });
  }

  function toggleSubmenu(btn, menu) {
    btn.classList.toggle('expanded');
    menu?.classList.toggle('hidden');
    menu?.classList.toggle('active');
  }

  async function searchCity(q) {
    try {
      const res = await fetch(`${WEATHER_API_URL}/find?q=${q}&appid=${WEATHER_API_KEY}&cnt=5`);
      const data = await res.json();
      if (data.list?.length) displayCitySuggestions(data.list);
    } catch (e) { console.error(e); }
  }

  function displayCitySuggestions(cities) {
    if (!citySuggestions) return;
    citySuggestions.innerHTML = '';
    citySuggestions.classList.remove('hidden');
    cities.forEach(c => {
      const item = document.createElement('div');
      item.className = 'city-suggestion-item';
      item.textContent = `${c.name}, ${c.sys.country}`;
      item.onclick = () => selectCity(c.name);
      citySuggestions.appendChild(item);
    });
  }

  function selectCity(name) {
    fetchWeatherData(name);
    locationModal?.classList.add('hidden');
    citySuggestions?.classList.add('hidden');
    if (citySearch) citySearch.value = '';
  }

  
  function openLogoutModal() {
    const user = auth.currentUser;
    if (!user) return;
    db.collection('users').doc(user.uid).get().then(doc => {
      const name = doc.exists ? doc.data().name : 'User';
      if (logoutUserName) logoutUserName.textContent = name;
      if (logoutUserEmail) logoutUserEmail.textContent = user.email;
      logoutModal?.classList.remove('hidden');
    });
  }

  window.addEventListener('load', () => {
    showLoading();
    
    if (authOverlay) {
      authOverlay.style.visibility = 'hidden';
    }
    
    const firebaseOk = initFirebase();
    if (firebaseOk) {
      registerServiceWorker();
      attachAuthListener();
    }
    bindEvents();
    if (!firebaseOk) {
      fetchWeatherData(currentCity).finally(hideLoading);
    }
  });
})()
