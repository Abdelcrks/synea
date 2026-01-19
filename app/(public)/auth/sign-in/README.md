# SYNEA – Connexion (Sign-In)

Ce dossierr contient l’implémentation de la **page de connexion utilisateur** de SYNEA, permettant aux utilisateurs existants d’accéder à leur espace personnel en toute sécurité.

---

## 🎯 Objectif produit

- Permettre à un utilisateur existant de se connecter simplement
- Fournir des retours clairs en cas d’erreur (email / mot de passe)
- Garantir une authentification sécurisée côté serveur
- Rediriger l’utilisateur vers son profil après connexion

---

## 🧭 Parcours utilisateur

1. L’utilisateur arrive sur la page **Connexion**
2. Il renseigne :
   - son **adresse email**
   - son **mot de passe**
3. Validation immédiate côté client (format email, longueur du mot de passe)
4. Soumission du formulaire
5. Authentification côté serveur
6. En cas de succès :
   - redirection vers `/profile`
7. En cas d’erreur :
   - message global (email ou mot de passe incorrect)
   - ou message ciblé sur le champ concerné

---

## 🧠 Choix UX

- Formulaire simple, centré, sans surcharge visuelle
- Messages d’erreur clairs et non culpabilisants
- Bouton de soumission désactivé tant que le formulaire est invalide
- Indicateur de chargement pendant la tentative de connexion
- Support de l’autocomplétion navigateur (`email`, `current-password`)

---

## 🛠️ Choix techniques

- **Next.js 16 – App Router**
- Formulaire client avec `useActionState`
- Validation double :
  - côté client (UX)
  - côté serveur (sécurité)
- Authentification via **BetterAuth**
- Gestion explicite des erreurs d’authentification
- Redirection serveur avec `redirect()`

---

## 🧩 Structure des fichiers

- `SignInPage`
  - structure de la page
  - titre et texte explicatif

- `SignInForm`
  - champs email / mot de passe
  - gestion de l’état local pour l’UX
  - affichage des erreurs par champ ou globales
  - bouton de soumission réutilisable

- `actions.ts`
  - validation serveur
  - appel à l’API d’authentification
  - gestion des erreurs
  - redirection après succès

---

## 🔐 Sécurité

- Les identifiants sont validés **exclusivement côté serveur**
- Aucun message ne permet de deviner si l’email ou le mot de passe est incorrect
- Les mots de passe ne sont jamais exposés ou stockés côté client
- Protection contre les soumissions invalides

---

## ⚠️ État actuel

- Connexion fonctionnelle
- Gestion des erreurs opérationnelle
- Redirection après succès opérationnelle

Améliorations possibles :
- Lien “Mot de passe oublié”
- Authentification via providers sociaux (Google / GitHub etc)
- Harmonisation complète du design avec le reste de SYNEA

---

© 2026 Abdel Berkat — SYNEA  
Plateforme d’entraide entre pairs
