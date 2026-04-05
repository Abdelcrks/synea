# Synea — Plateforme de soutien entre pairs pour les personnes touchées par le cancer

> "Parfois, le chemin est difficile. Mais personne ne devrait avancer seul."

Synea est une plateforme web full-stack qui met en relation des personnes en traitement contre le cancer (**Héros**) avec des personnes en rémission (**Pair-Héros**), dans un espace sécurisé, bienveillant et conforme au RGPD.

**Démo production :** [synea.vercel.app](https://synea.vercel.app)  
**Dépôt :** [github.com/Abdelcrks/synea](https://github.com/Abdelcrks/synea)

---

## Table des matières

- [Contexte](#contexte)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Base de données](#base-de-données)
- [Authentification](#authentification)
- [RGPD](#rgpd)
- [Tests](#tests)
- [CI/CD & Déploiement](#cicd--déploiement)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)

---

## Contexte

433 000 nouveaux cas de cancer sont diagnostiqués chaque année en France. 3,8 millions de personnes vivent avec ou après un cancer. Pourtant, aucune plateforme numérique francophone ne propose de mise en relation structurée entre pairs pour ce public.

Synea comble ce vide : une plateforme 100% web, sans installation, gratuite, spécifique au cancer, avec messagerie intégrée et conformité RGPD dès la conception.

---

## Fonctionnalités

### MVP livré

| Fonctionnalité | Statut |
|---|---|
| Inscription email + mot de passe | ✅ |
| Vérification d'email obligatoire | ✅ |
| Onboarding & choix du rôle (Héros / Pair-Héros) | ✅ |
| Profil public (nom, bio, type de cancer facultatif) | ✅ |
| Upload avatar via Cloudinary | ✅ |
| Consultation des profils Pair-Héros | ✅ |
| Envoi / réception de demandes de contact | ✅ |
| Accepter / refuser une demande | ✅ |
| Messagerie privée 1-to-1 | ✅ |
| Modification du rôle à tout moment | ✅ |
| Désactivation de compte | ✅ |
| Suppression de compte + anonymisation (RGPD) | ✅ |
| Affichage région (opt-in) | ✅ |

### V1.1 — Prochaines évolutions

- Toggle visibilité profil (champ `isVisible` en base, UI non exposée)
- Reset mot de passe par email
- Notifications in-app (WebSocket / SSE)
- Filtres de recherche Pair-Héros
- Pagination messagerie

---

## Stack technique

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 16.1.1 | Framework — App Router, Server Components, Turbopack |
| React | 19 | UI |
| TypeScript | strict | Typage sur tout le projet |
| Tailwind CSS | v4 | Design system utilitaire, mobile-first |
| Lucide React | — | Bibliothèque d'icônes |

### Backend & BDD

| Technologie | Version | Usage |
|---|---|---|
| Better Auth | 1.4.10 | Authentification email/password, sessions opaques |
| Drizzle ORM | — | ORM type-safe, migrations versionnées |
| PostgreSQL (Neon) | — | BDD serverless, hébergée EU |

### Services & Infra

| Service | Usage |
|---|---|
| Vercel | Déploiement Edge, preview par PR |
| Cloudinary | Upload & transformation avatars |
| Resend | Emails transactionnels (vérification) |
| GitHub Actions | CI/CD — lint, typecheck, tests |

---

## Architecture

```
CLIENT (Browser)
  React 19 · Tailwind CSS · Lucide
        ↓
NEXT.JS 16 — App Router
  Server Components (rendu serveur)
  Server Actions (mutations)
  requireActiveSession() (protection routes)
  API Routes (Cloudinary signature)
        ↓
SERVICES
  Better Auth → sessions opaques en base
  Drizzle ORM → requêtes type-safe
  Cloudinary → avatars CDN
        ↓
INFRA
  Neon PostgreSQL (EU)
  Vercel Edge Network
  GitHub Actions
```

### Flux de données

| Flux | Chemin |
|---|---|
| Auth | Browser → `requireActiveSession()` → Server Component → Better Auth → Neon |
| Data | Server Action → Validation manuelle → Drizzle ORM → Neon → Response typée |
| Media | Client → API Route (signature Cloudinary) → Cloudinary CDN → URL stockée Neon |
| CI/CD | GitHub push → Actions (lint + typecheck + Vitest) → Vercel build → Deploy Edge |

---

## Base de données

### Schéma principal

```
user
  id, name, email, emailVerified
  disabledAt, deletedAt

profiles
  id, userId (FK→user)
  role (hero | peer_hero)
  namePublic, bio, avatarUrl
  cancerType (nullable — facultatif)
  locationRegion (nullable — opt-in)
  isVisible, disabledAt

contact_requests
  id, fromUserId (FK→user), toUserId (FK→user)
  status (pending | accepted | rejected | canceled)
  createdAt, respondedAt

conversations
  id, participantDuoId (UNIQUE)
  createdByUserId (FK SET NULL)

conversation_participants
  id, conversationId (FK→conversations)
  userId (FK SET NULL — anonymisation RGPD)
  userNameSnapshot (snapshot RGPD)

messages
  id, conversationId (FK→conversations)
  senderId (FK SET NULL — anonymisation RGPD)
  senderNameSnapshot, senderAvatarSnapshot
  content, createdAt
```

### Migrations

```bash
# Générer une migration depuis le schéma TypeScript
npx drizzle-kit generate

# Appliquer les migrations
npx drizzle-kit migrate
```

---

## Authentification

Synea utilise **Better Auth 1.4.10** avec le provider email/password.

- Mots de passe hashés avec **bcrypt**
- Sessions opaques stockées en base (table `session`) — pas de JWT
- Vérification d'email obligatoire avant accès
- Expiration automatique des sessions
- Protection des routes via `requireActiveSession()` dans chaque Server Component protégé

```ts
// src/lib/require-active-session.ts
// Appelé dans chaque Server Component protégé
// Redirige vers /login si session invalide ou expirée
```

---

## RGPD

Synea est conforme au RGPD dès la conception (privacy by design).

### Minimisation des données

| Champ | Statut |
|---|---|
| Email | Requis (auth) |
| Nom public | Requis (pseudonyme autorisé) |
| Rôle | Requis (modifiable à tout moment) |
| Type de cancer | **Facultatif** — nullable en base |
| Région | **Facultatif** — opt-in explicite |
| Bio | **Facultatif** |
| Avatar | **Facultatif** |

### Droit à l'effacement — 2 étapes

**Étape 1 — Désactivation** (`disabledAt`)
- Profil immédiatement invisible
- Connexion impossible
- Données conservées

**Étape 2 — Suppression effective** (`deletedAt`)
- Données personnelles anonymisées immédiatement
- `senderId` → NULL dans messages
- `createdByUserId` → NULL dans conversations
- Historique des échanges conservé via snapshots nom/avatar

### Snapshots RGPD

Deux niveaux de snapshots garantissent la lisibilité de l'historique après suppression d'un compte :
- `conversation_participants.userNameSnapshot` — nom à la création de la conversation
- `messages.senderNameSnapshot` + `messages.senderAvatarSnapshot` — nom/avatar à l'envoi

### Article 9 — Données de santé

Le champ `cancerType` est une donnée potentiellement sensible (Art. 9 RGPD). Mesures appliquées :
- Champ facultatif, jamais obligatoire
- Auto-déclaré, non vérifié cliniquement
- Consentement explicite à l'onboarding
- Supprimé/anonymisé à la suppression du compte

### HDS (Hébergement de Données de Santé)

Synea n'est **pas soumis à l'obligation HDS** (L.1111-8 CSP) car :
- Aucun acte médical, diagnostic ou suivi clinique via la plateforme
- Données auto-déclarées et non vérifiées
- Plateforme sociale thématique, non application médicale

### Hébergement

Neon (PostgreSQL) et Vercel sont déployés en **Europe** — aucun transfert de données personnelles hors UE.

---

## Tests

### Tests unitaires — Vitest

```bash
npx vitest run
```

| Fichier | Couverture |
|---|---|
| `avatar.test.ts` | Rendu initiales, rendu image |
| `sendContactRequest.test.ts` | Validations, rôles, doublons, statuts |
| `acceptContactRequest.test.ts` | Acceptation, création conversation |
| `cancelContactRequest.test.ts` | Annulation selon sens de la demande |
| `rejectContactRequest.test.ts` | Rejet et blocage futur |

**22 tests — 5 fichiers — 100% passing — ~95% coverage sur les Server Actions**

### Tests E2E — Playwright

```bash
npx playwright test
```

> ⚠️ Les tests Playwright s'exécutent **en local uniquement** — non inclus dans le pipeline CI.

| Scénario | Description |
|---|---|
| E2E-01 | Happy path demande de contact — envoi → acceptation → messagerie |
| E2E-02 | Prévention des doublons — impossible d'envoyer 2 demandes au même pair-héros |

**Bonnes pratiques appliquées :**
- Reset BDD avant chaque test (`beforeEach`)
- GlobalSetup — auth des users avant exécution
- Trace Playwright on first retry

---

## CI/CD & Déploiement

### Pipeline GitHub Actions

```yaml
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - Lint (next lint)
      - TypeCheck (tsc --noEmit)
      - Tests unitaires (Vitest)
      - Deploy Vercel
```

### Vercel

- Branch `main` → Production
- Chaque PR → Preview URL unique
- Variables d'environnement chiffrées
- Edge Network mondial

---

## Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/Abdelcrks/synea.git
cd synea

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les variables (voir section suivante)

# Appliquer les migrations
npx drizzle-kit migrate

# Lancer en développement (Turbopack activé par défaut)
npm run dev
```

---

## Variables d'environnement

```env
# Base de données
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Email (Resend)
RESEND_API_KEY=

# Cloudinary (cloud name public uniquement côté client)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

> ⚠️ Ne jamais exposer les clés secrètes côté client (`NEXT_PUBLIC_` = visible navigateur).  
> Stocker les secrets dans Vercel Environment Variables en production.

---

## Accessibilité

- Lighthouse Accessibility : **91/100**
- Contrastes vérifiés WebAIM : texte principal / fond lavande **13.37:1 (AAA)**
- Touch targets > 44px (WCAG 2.1)
- Focus-visible sur tous les éléments interactifs
- Navigation clavier complète
- HTML sémantique (`nav`, `main`, `section`)

---

## Auteur

**Abdel Berkat**  
Titre RNCP 37873 — Concepteur Développeur d'Applications  
Ada Tech School — Promotion Frida Kahlo 2025/2026