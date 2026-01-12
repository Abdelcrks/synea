# SYNEA – Profil utilisateur

Ce dossier regroupe l’implémentation de la **page Profil** de SYNEA ainsi que l’édition des informations de profil.  
Le profil centralise les informations utiles au matching V1 (rôle, localisation, etc.) tout en respectant une approche **RGPD-friendly** (données santé optionnelles).

---

## 🎯 Objectif produit

- Afficher un profil clair et rassurant (identité, rôle, informations utiles)
- Permettre à l’utilisateur de compléter / modifier ses informations
- Exposer les informations “Compte” (email / mot de passe) sans les rendre publiques
- Préparer l’intégration de fonctionnalités futures :
  - préférences (toggles)
  - page sécurité (email / mot de passe) qui permettront de changer mot de passe /email 
  - suppression de compte

---

## 🧭 Parcours utilisateur

1. L’utilisateur accède à `/profile`
2. Une session est requise :
   - si non connecté → redirection `/auth/sign-in`
3. Le profil est chargé depuis la base (`getMyProfile(userId)`)
4. La page affiche les informations via `ProfileView`
5. CTA **Modifier mon profil** → redirection `/profile/edit`
6. L’utilisateur modifie ses informations et valide
7. Server Action :
   - valide les champs
   - met à jour la table `profiles`
   - `revalidatePath("/profile")`
   - redirige vers `/profile`

---

## 🖥️ UX & contenu affiché (ProfileView)

La page `/profile` affiche :

- Avatar (ou initiales si non renseigné)
- Nom public (`namePublic`)
- Badge du rôle (labels `ROLE_LABELS`)
- Région (ou fallback si vide)
- Cards :
  - **À propos** (bio + fallback)
  - **Informations (optionnel)** (type de cancer + microcopy rassurante)
  - **Compte**
    - email (read-only) + bouton “Gérer”
    - mot de passe masqué (`••••••••`) + bouton “Gérer”
    - date d’inscription
  - **Préférences** (placeholder V1)
  - **Zone sensible** (placeholder suppression compte)

⚠️ Le mot de passe n’est jamais affiché : on montre uniquement un masque “fictif” pour l’UX.

---

## ✏️ Édition du profil (ProfileEditForm)

Le formulaire `/profile/edit` permet d’éditer :

- `namePublic` (obligatoire, min 2 caractères)
- `bio` (optionnel)
- `locationRegion` (optionnel)
- `role` (hero / peer_hero) → utilisé pour le matching V1
- `cancerType` (optionnel, enum DB)

Le rôle `admin` n’est jamais proposé côté UI (filtré via `ROLES.filter(r !== "admin")`).

Le formulaire utilise `useActionState` pour :
- afficher les erreurs par champ (`field`)
- afficher une erreur globale si nécessaire

Les inputs utilisent `defaultValue` (form non contrôlé) pour limiter le state et rester proche des Server Actons Next.js.

---

## 🧠 Choix techniques

- **Next.js 16 – App Router**
- Page `/profile` en composant serveur :
  - récupération session via `auth.api.getSession({ headers: await headers() })`
  - redirection si non authentifié
- `ProfileView` en composant client (UI)
- Page `/profile/edit` :
  - composant serveur (fetch session + profil)
  - composant client (`ProfileEditForm`) pour le formulaire
- Mise à jour DB via Drizzle ORM
- **Validation serveur obligatoire** des enums :
  - rôle via `ROLES` (refus `admin`)
  - cancer type via `CANCER_TYPES`

---

## 🧩 Structure des fichiers

- `app/profile/page.tsx`
  - protège la route (session obligatoire)
  - charge le profil
  - rend `ProfileView`

- `components/profile/ProfileView.tsx`
  - UI “Mon profil” (cards, avatar, informations compte)

- `app/profile/edit/page.tsx`
  - protège la route (session obligatoire)
  - charge le profil utilisateur
  - rend `ProfileEditForm`
  - propose un bouton “Retour”

- `components/profile/ProfileEditForm.tsx`
  - formulaire d’édition
  - `useActionState` + affichage erreurs

- `app/profile/edit/updateProfileAction.ts`
  - Server Action de mise à jour :
    - validation des champs
    - update `profiles`
    - revalidation + redirection

- `lib/constants/roles.ts`
  - mapping `ROLE_LABELS` (labels FR)
- `lib/constants/cancer.ts`
  - mapping `CANCER_LABELS` (labels FR)

---

## 🔐 Sécurité & conformité

- Validation serveur systématique (FormData non fiable)
- Les champs santé sont optionnels (`cancerType` nullable)
- Aucune donnée de compte n’est exposée publiquement (email / mot de passe)
- Le mot de passe n’est jamais affiché et n’est pas accessible côté client

---

## ⚠️ État actuel

✅ Profil affiché et éditable (namePublic, bio, region, role, cancerType)  
✅ Validation serveur + erreurs par champ via `useActionState`  
✅ Revalidation + redirection après update  

À venir :
- `/settings/security` pour modifier email / mot de passe (page dédiée)
- préférences réelles (toggles persistés en DB)
- suppression de compte avec confirmation

---

© 2026 Abdel Berkat — SYNEA  
Plateforme d’entraide entre pairs
