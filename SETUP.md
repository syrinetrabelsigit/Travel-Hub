# 🚀 Guide d'Installation - TravelHub

Guide complet pour installer et configurer le projet TravelHub (Frontend + Backend).

---

## 📋 Prérequis

### Backend
- ✅ Java 17 ou supérieur
- ✅ Maven 3.8+
- ✅ IntelliJ IDEA (recommandé) ou Eclipse

### Frontend
- ✅ Node.js 16+ et npm
- ✅ VS Code (recommandé)

### Comptes Nécessaires
- ✅ MongoDB Atlas (gratuit)
- ✅ Stripe (test mode gratuit)
- ✅ Amadeus for Developers (gratuit)

---

## 🔧 Installation Backend

### 1. Cloner le projet
```bash
git clone https://github.com/syrinetrabelsigit/Travel-Hub.git
cd Travel-Hub/backend
```

### 2. Configurer application.properties
```bash
# Copier le template
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

**Puis éditer `application.properties` avec vos clés :**

#### **MongoDB Atlas**
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Remplacer dans `application.properties` :
```properties
spring.data.mongodb.uri=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/travelhub
```

#### **JWT Secret**
Générer un secret de 64+ caractères :
```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

#### **Stripe**
1. Créer un compte sur https://stripe.com
2. Aller dans **Developers → API Keys**
3. Copier :
   - Publishable key → pour le frontend
   - Secret key → pour `stripe.api.key`

#### **Amadeus**
1. Créer un compte sur https://developers.amadeus.com
2. Créer une application
3. Copier API Key et API Secret

### 3. Installer les dépendances
```bash
mvn clean install
```

### 4. Lancer le backend
```bash
mvn spring-boot:run
```

**✅ Backend disponible sur :** `http://localhost:8085`

**📚 Swagger UI :** `http://localhost:8085/swagger-ui/index.html`

---

## 💻 Installation Frontend

### 1. Aller dans le dossier frontend
```bash
cd ../frontend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'API URL

**Ouvrir `src/services/api.js` et vérifier :**
```javascript
const API_URL = 'http://localhost:8085/api';
```

### 4. Lancer le frontend
```bash
npm start
```

**✅ Frontend disponible sur :** `http://localhost:3000`

---

## 🔐 Configuration de l'Authentification

### 1. Créer un compte
**POST** `http://localhost:8085/api/auth/register`
```json
{
  "email": "test@example.com",
  "password": "Test123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Se connecter
**POST** `http://localhost:8085/api/auth/login`
```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Utiliser le token dans les requêtes
**Header à ajouter :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 🌐 Intégration Frontend ↔ Backend

### Configuration Axios (React)

**Créer un fichier `src/services/api.js` :**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8085/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Exemples d'utilisation

**Register :**
```javascript
import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
```

**Login :**
```javascript
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};
```

**Recherche de vols :**
```javascript
const searchFlights = async (searchData) => {
  const response = await api.post('/search/flights', searchData);
  return response.data;
};
```

---

## 📚 Endpoints API Principaux

### 🔓 Publics (sans token)
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/search/flights` - Rechercher des vols
- `POST /api/search/hotels` - Rechercher des hôtels
- `POST /api/search/activities` - Rechercher des activités
- `GET /api/currency/supported` - Devises supportées
- `GET /api/currency/convert` - Convertir une devise

### 🔐 Protégés (avec token)
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier le profil
- `POST /api/cart/add` - Ajouter au panier
- `GET /api/cart` - Voir le panier
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings` - Liste des réservations
- `GET /api/bookings/{id}/invoice` - Télécharger facture PDF
- `POST /api/reviews` - Créer un avis
- `POST /api/payments/create-intent` - Créer paiement Stripe

---

## 🧪 Tests

### Tester avec Swagger
1. Ouvrir `http://localhost:8085/swagger-ui/index.html`
2. Cliquer sur **Authorize** 🔒
3. Entrer : `Bearer YOUR_TOKEN_HERE`
4. Tester les endpoints

### Tester avec Postman
1. Importer la collection Postman (si disponible)
2. Configurer l'environnement :
   - `base_url` : `http://localhost:8085/api`
   - `token` : votre JWT token

---

## 🐛 Dépannage

### Backend ne démarre pas
- ✅ Vérifier Java 17 : `java -version`
- ✅ Vérifier MongoDB URI dans `application.properties`
- ✅ Port 8085 déjà utilisé ? Changer dans `application.properties`

### Frontend ne se connecte pas au backend
- ✅ Backend lancé sur `http://localhost:8085` ?
- ✅ CORS configuré dans `application.properties` :
```properties
  cors.allowed-origins=http://localhost:3000
```
- ✅ Vérifier l'URL API dans `src/services/api.js`

### Erreur 401 Unauthorized
- ✅ Token JWT expiré ? Se reconnecter
- ✅ Token présent dans le header Authorization ?
- ✅ Format : `Bearer TOKEN` (avec espace)

### Erreur MongoDB
- ✅ URI correcte dans `application.properties` ?
- ✅ Whitelist votre IP sur MongoDB Atlas
- ✅ User/Password corrects ?

