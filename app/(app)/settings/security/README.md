# 🔐 Sécurité du compte – SYNEA

Cette section permet à un utilisateur authentifié de gérer la sécurité de son compte :
- changement d’adresse email
- changement de mot de passe

Les fonctionnalités sont implémentées avec **Next.js App Router**, **Server Actions** et **Better Auth**.

---

## ✨ Fonctionnalités

### 📧 Changement d’adresse email
- Validation du format de l’email
- Vérification (email déjà utilisé)
- Génération d’un lien de confirmation (token) (directement sur le terminal en console)
- Gestion des états :
  - succès
  - email invalide
  - email déjà existant

> En environnement de développement, le lien de confirmation est affiché dans la console.

---

### 🔑 Changement de mot de passe
- Vérification du mot de passe actuel
- Validation du nouveau mot de passe :
  - minimum 8 caractères
  - différent de l’ancien
- Changement sécurisé via `better-auth`
- Révocation des autres sessions actives 
- Messages d’erreur ciblés par champ input
- Message de succès + reset du form

---

## 🧠 Choix techniques

### Server Actions
- Toute la logique sensible est traitée côté serveur
- Aucune validation critique côté client
- Retour d’un état structuré `{ ok, field, message }`

### Gestion des erreurs
- Mapping explicite des erreurs Better Auth
- Affichage d’un message **par champ**
- Aucune information sensible exposée 

### UX
- Feedback immédiat après soumission (message via le field)
- Champs automatiquement vidés après succès
- Messages clairs et contextualisés

---

## 🧩 Stack technique

- **Next.js 16 (App Router)**
- **TypeScript**
- **Better Auth**
- **Drizzle ORM**
- **PostgreSQL (Neon)**
- **Tailwind CSS**

---

## 🚀 Améliorations possibles
- Ajout d’une confirmation du nouveau mot de passe
- Envoi réel de l’email de confirmation en production avec la librairi resend ? ou une autre
- Ajout d’un indicateur `loading` sur les boutons
- Journalisation des changements de sécurité
- design tailwind css 
- supprimer le compte depuis /settings ou le desactiver à reflechir sur cette feature

---

## 🛡️ Sécurité

- Actions accessibles uniquement aux utilisateurs authentifiés
- Validation stricte des entrées
- Tokens temporaires pour les changements sensibles
- Aucune logique critique côté client

---

## 👤 Auteur

Projet développé dans le cadre du projet **SYNEA**,  
par **Abdel Berkat**,  
en formation **Concepteur Développeur d’Applications – Ada Tech School**.
