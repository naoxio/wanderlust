# Wanderlust
Mark your adventure where you have been on a 3d or 2d World Map.

## Run locally

Get the repo
```git clone https://github.com/naoxio/wanderlust.git```
```cd wanderlust```

### Setup frontend
```
npm install
npm run dev
```

### Setup backend
```
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

