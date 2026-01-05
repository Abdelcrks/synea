# SYNEA – Onboarding

Ce dossier contient l’implémentation du **parcours d’onboarding utilisateur**, destiné à présenter la philosophie de SYNEA et à orienter l’utilisateur vers le choix de son rôle.

---

## 🎯 Objectif produit

- Introduire la plateforme de manière progressive et humaine
- Créer une expérience immersive et rassurante
- Orienter l’utilisateur vers son rôle :
  - **Héros**
  - **Pair-héros**

---

## 🧭 Parcours utilisateur

1. Arrivée sur l’onboarding
2. Navigation par swipe horizontal (mobile & desktop)
3. Présentation du concept et des valeurs de SYNEA
4. Bouton *Passer* accessible à tout moment
5. Dernière slide :
   - CTA **Choisir mon rôle**
6. Redirection vers la page de sélection du rôle

---

## 🖥️ Responsive & UX

### Mobile
- Slides plein écran
- Texte en overlay sur l’image
- Navigation tactile
- Dots indicateurs synchronisés

### Desktop
- Layout splité :
  - Image à gauche
  - Contenu à droite
- Fond animé discret (particles (librairie)) pour renforcer l’immersion
- CTA mis en avant sur la dernière slide

---

## 🧠 Choix techniques

- **Next.js 16 – App Router**
- Composant client avec gestion du scroll horizontal
- `useRef` + `useEffect` pour la synchronisation scroll / index
- Dots interactifs (navigation + feedback visuel)
- Fond animé via **tsParticles** (desktop uniquement)
- Séparation claire entre :
  - Onboarding (présentation)
  - Choix du rôle (étape dédiée)

---

## ⚠️ État actuel

- Onboarding **fonctionnel**
- Redirection vers le choix du rôle opérationnelle
- Améliorations UI prévues :
  - Transition esthétique entre onboarding et page de rôle
  - Continuité visuelle entre les deux écrans

Ces améliorations sont volontairement différées pour prioriser la structure fonctionnelle & l'architeture globale
