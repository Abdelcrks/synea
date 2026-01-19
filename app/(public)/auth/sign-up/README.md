# SYNEA – Inscription (Sign-Up)

Ce dossier contient l’implémentation du **parcours d’inscription** de SYNEA, avec sélection de rôle (**Héros / Pair-héros**), création de compte via authentification email/mot de passe, puis création automatique d’un profil associé en base.

---

## 🎯 Objectif produit

- Permettre à un nouvel utilisateur de créer un compte rapidement
- Associer dès l’inscription un **rôle** (Héros / Pair-héros) utilisé pour le matching V1
- Collecter quelques informations de profil **optionnelles** (RGPD-friendly)
- Garantir une validation robuste côté serveur (source de vérité)

---

## 🧭 Parcours utilisateur

1. L’utilisateur arrive sur `/auth/sign-up`
2. Le rôle peut être pré-sélectionné via query param :
   - `/auth/sign-up?role=hero`
   - `/auth/sign-up?role=peer_hero`
3. L’utilisateur complète le formulaire :
   - rôle (obligatoire)
   - pseudo (obligatoire)
   - email (obligatoire)
   - mot de passe (obligatoire)
   - type de cancer (optionnel)
   - acceptation des CGU (obligatoire)
4. Soumission du formulaire
5. Création du compte via BetterAuth
6. Création d’un enregistrement `profiles` en base (Drizzle)
7. Redirection vers `/auth/sign-in`

---

## 🖥️ UX & comportements

- Le bouton de soumission est désactivé tant que le formulaire est invalide (`canSubmit`)
- Affichage d’erreurs :
  - **erreur globale** (ex: serveur / credentials)
  - **erreur ciblée par champ** (field + message)
- État de chargement pendant la soumission via `useFormStatus` (composant `SubmitButton`)

---

## 🧠 Choix techniques

- **Next.js 16 – App Router**
- Formulaire client avec `useActionState` et Server Action
- Validation double :
  - côté client (UX : `canSubmit`)
  - côté serveur (sécurité : `createAccountAction`)
- Authentification via **BetterAuth**
- Persistance du profil via **Drizzle ORM** + Postgres
- Enums DB comme source de vérité :
  - `roleEnum` (`hero`, `peer_hero`, `admin`)
  - `cancerTypeEnum` (liste des cancers)
- Le champ `cancerType` est optionnel (null si non renseigné)

---

## 🧩 Structure des fichiers

- `page.tsx`
  - lit `searchParams.role`
  - calcule `defaultRole` (valeurs acceptées : `hero` / `peer_hero`)
  - passe `defaultRole` + `cancerTypes` au composant formulaire

- `SignUpForm.tsx`
  - formulaire contrôlé avec `useState`
  - `useActionState` pour gérer les retours serveur (state ok/erreur)
  - champ `role` + réhydratation via `useEffect(defaultRole)`
  - champ `cancerType` optionnel avec labels UI (`CANCER_LABELS`)

- `actions.ts`
  - `createAccountAction` (Server Action) :
    - validation serveur de tous les champs
    - appel BetterAuth `signUpEmail`
    - insertion du profil dans `profiles`
    - redirection vers `/auth/sign-in`

---

## ✅ Validation serveur (source de vérité)

La Server Action valide :

- **role** : doit être `hero` ou `peer_hero` (admin refusé côté UI et non proposé)
- **namePublic** : min 2 caractères
- **email** : format minimal (contient `@` et `.`)
- **password** : min 8 caractères
- **acceptedTerms** : obligatoire
- **cancerType** :
  - optionnel
  - si fourni : doit appartenir à `CANCER_TYPES` (enum DB)

---

## 🔐 Sécurité

- Les contrôles côté client ne servent qu’à l’UX : la validation serveur reste obligatoire
- Les valeurs issues de `FormData` sont considérées **non fiables** → validation avant insert DB
- Les messages d’erreur évitent de trop exposer les détails internes
- Création du profil uniquement après création effective de l’utilisateur BetterAuth

---

## ⚠️ État actuel

- Inscription fonctionnelle
- Pré-sélection du rôle via query param fonctionnelle
- Création du profil en base fonctionnelle
- Redirection vers `/auth/sign-in` après succès

Améliorations possibles :
- Renforcer la validation email (regex)
- Ajouter une jauge de robustesse mot de passe
- Harmoniser le style UI avec le design SYNEA (palette lavande)
- Ajouter “Connexion” / “Mot de passe oublié” pour le parcours complet

---

© 2026 Abdel Berkat — SYNEA  
Plateforme d'entraide entre pairs
