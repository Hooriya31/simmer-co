# Simmer & Co.

Recipe discovery app. Search recipes, filter by category or cuisine, save favorites to your account.

**Live:** https://simmer-co-omega.vercel.app

![Simmer & Co. home screen](./docs/screenshot.png)

## Why it exists

Built for FlyRank's Frontend AI Engineering internship. The brief was a React app with auth and saved favorites, time-boxed to 6 hours. I picked recipes over movies because I cook, and I think people would open a recipe app daily. Simmer & Co. is here to show, I can ship a complete, working interface.

## What works

- Search plus category and cuisine filtering (TheMealDB)
- Recipe detail with ingredient icons and YouTube links
- Email/password auth with verification banner, password reset, account deletion
- Favorites stored in Firestore with real-time sync
- Clicking favorite while logged out redirects to login, then returns you to where you were
- Bottom nav on mobile, pill nav on desktop, custom SVG hero banner

## Decisions

- **Firebase over Supabase.** Supabase's free tier pauses after 7 days of inactivity. A public portfolio app that looks broken is worse than no app.
- **TheMealDB over Spoonacular.** No API key, so anyone can run this in a minute.
- **Stale-while-revalidate for the cuisine list.** TheMealDB rate-limits. Cached data renders immediately and refreshes in the background, so the UI never blocks.

## Limits

- Recipe content comes from TheMealDB. I don't control its data, coverage, or uptime.
- Built on free tiers only (Firebase, Vercel). No paid infrastructure, so no guarantees at scale.
- Search and filtering depend on what TheMealDB exposes. I can't add recipes or fields it doesn't have.

## Stack

React, TypeScript, Vite, React Router, Firebase Auth + Firestore, Vercel.

## Run locally

```bash
git clone https://github.com/Hooriya31/simmer-co
cd simmer-co
npm install
[add your Firebase config, then name the env file and variables you actually use]
npm run dev
```

## Contact

Hooriya Ahmad. Message me on [LinkedIn](https://linkedin.com/in/hooriya-ahmad-ha31) or at hooriyaahmad31@gmail.com.
