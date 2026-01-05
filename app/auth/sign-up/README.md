# SYNEA – Signup

Plateforme de mise en relation et de soutien entre patients (**Héros**) et pairs-aidants (**Pair-héros**).

Ce dossier contient l’implémentation complète du **flux d’inscription utilisateur**, incluant l’authentification et la création du profil applicatif.

---

## ✅ Statut

**Fonctionnalité terminée et fonctionnelle**

- Authentification gérée via **Better Auth**
- Création du profil utilisateur en base de données
- Redirection post-inscription selon le rôle

---

## 🧭 Parcours utilisateur

1. Choix du rôle (`hero` / `peer_hero`)
2. Inscription (email + mot de passe)
3. Validation côté client (UX)
4. Validation côté serveur via Server Action
5. Création du compte (Better Auth)
6. Création du profil SYNEA associé
7. Redirection vers l’étape suivante du parcours

---

## 🧠 Choix d’architecture

- **Next.js 16 – App Router**
- **Better Auth** pour l’authentification
- **Server Actions** pour le traitement sécurisé
- **`useActionState`** pour la gestion de l’état serveur
- Séparation claire :
  - **Auth** : gestion des comptes et sessions
  - **Profil SYNEA** : rôle, données métier, évolution future

Cette approche permet une base d’authentification générique et un modèle métier évolutif.

---

## 🗂️ Structure du dossier

> ℹ️ Cette fonctionnalité a été développée de manière itérative :  
> formulaire → validation → authentification → création du profil.