# 🥗 Calorie Tracker

Mobilna aplikacija za praćenje dnevnog unosa kalorija, razvijena kao projekat iz predmeta **Mobilno računarstvo**.

## 📱 O projektu

Calorie Tracker je cross-platform mobilna aplikacija izrađena u **React Native (Expo)** koja korisnicima omogućava jednostavno evidentiranje obroka i praćenje kalorijskog unosa. Aplikacija posjeduje vlastiti REST API backend i koristi Firebase Realtime Database za pohranu podataka.

## ✨ Funkcionalnosti

- 🔐 **Autentifikacija** – registracija i prijava korisnika (JWT)
- 📋 **Dashboard** – pregled dnevnog unosa kalorija i unesenih obroka
- ➕ **Logovanje hrane** – dodavanje, uređivanje i brisanje unosa obroka
- 📊 **Sedmični izvještaj** – grafički prikaz kalorijskog unosa po danima
- 🎯 **Kalorijki cilj** – postavljanje i praćenje dnevnog kalorijskog cilja
- 💾 **Lokalno pohranjivanje** – AsyncStorage za offline funkcionisanje

## 🏗️ Arhitektura

```
Calorie_Tracker/
├── src/
│   ├── screens/        # Ekrani aplikacije (Dashboard, LogFood, WeeklyReport, AuthScreen)
│   ├── components/     # Reusable UI komponente
│   ├── contexts/       # React Context (AuthContext)
│   ├── hooks/          # Custom hookovi (useStorage)
│   ├── services/       # API servisni sloj
│   └── utils/          # Tipovi i pomoćne funkcije
├── server/             # Node.js/Express backend
│   ├── routes/         # API rute (auth, logs)
│   ├── middleware/     # JWT middleware
│   └── config/         # Firebase Admin SDK konfiguracija
└── App.tsx             # Root komponenta
```

## 🛠️ Tehnički stack

### Frontend (Mobilna aplikacija)
| Tehnologija | Verzija |
|---|---|
| Expo | ~56.0.12 |
| React Native | 0.85.3 |
| TypeScript | ~6.0.3 |
| NativeWind (Tailwind CSS) | ^4.2.5 |
| React Native Reanimated | 4.3.1 |
| AsyncStorage | 2.2.0 |
| Axios | ^1.18.0 |
| Firebase SDK | ^12.15.0 |

### Backend (REST API)
| Tehnologija | Opis |
|---|---|
| Node.js + Express | Server framework |
| Firebase Admin SDK | Baza podataka (Realtime DB) |
| JWT | Autentifikacija |
| dotenv | Konfiguracija okruženja |

## 🚀 Pokretanje projekta

### Preduslovi
- Node.js >= 18
- Expo CLI
- Firebase projekat (Realtime Database)

### 1. Kloniranje repozitorijuma
```bash
git clone <repo-url>
cd Calorie_Tracker_mobilno_racunarstvo
```

### 2. Instalacija zavisnosti

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 3. Konfiguracija backenda

```bash
cp server/.env.example server/.env
```

Popuni `server/.env` sa Firebase kredencijalima:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
JWT_SECRET=your-jwt-secret
PORT=3001
```

### 4. Pokretanje

```bash
# Pokretanje backenda (u server/ direktorijumu)
cd server && node index.js

# Pokretanje Expo aplikacije (u root direktorijumu)
npm start
```

## 🌐 API Endpointi

| Metoda | Ruta | Opis | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registracija novog korisnika | ❌ |
| `POST` | `/auth/login` | Prijava korisnika | ❌ |
| `GET` | `/logs` | Dohvatanje svih unosa | ✅ JWT |
| `POST` | `/logs` | Dodavanje novog unosa | ✅ JWT |
| `PUT` | `/logs/:id` | Ažuriranje unosa | ✅ JWT |
| `DELETE` | `/logs/:id` | Brisanje unosa | ✅ JWT |
| `GET` | `/logs/goal` | Dohvatanje kalorijskog cilja | ✅ JWT |
| `PUT` | `/logs/goal` | Postavljanje kalorijskog cilja | ✅ JWT |
| `GET` | `/health` | Health check servera | ❌ |

## 📄 Licenca

MIT © 2025
