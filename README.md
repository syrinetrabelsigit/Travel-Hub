# 🌍 TravelHub - Plateforme de Réservation de Voyages

Plateforme tout-en-un pour réserver vols, hôtels et activités.

## 📁 Structure du Projet
```
Travel-Hub/
├── frontend/          # React Application
├── backend/           # Spring Boot API
├── README.md          # Ce fichier
└── SETUP.md           # Guide d'installation
```

## 🚀 Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```
API: `http://localhost:8085`
Swagger: `http://localhost:8085/swagger-ui/index.html`

### Frontend
```bash
cd frontend
npm install
npm start
```
App: `http://localhost:3000`

## 📚 Documentation Complète

Voir [SETUP.md](./SETUP.md) pour l'installation détaillée.

## 🔗 APIs Intégrées

- ✅ Amadeus (Vols réels)
- ✅ Stripe (Paiements)
- ✅ ExchangeRate (Devises)
- ✅ MongoDB Atlas (Database)