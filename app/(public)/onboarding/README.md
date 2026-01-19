# SYNEA – Onboarding

Ce dossier contient l’implementation du **parcours d’onboarding utilisateur** de SYNEA, conçu pour présenté la philosophie du projet et guider l’utilisateur vers le choix de son rôle.

--- 

SYNEA Projet conçu et développé par Abdel Berkat 

---

## 🎯 Objectif produit

- Introduire la plateforme de manière progressive, humaine et rassurante
- Expliquer le concept de soutien entre pairs/heros 
- Orienter l’utilisateur vers un rôle :
  - **Héros** (je traverse l’épreuve)
  - **Pair-héros** (je suis en rémission / j’accompagne/dispo pour échanger etc)

---

## 🧭 Parcours utilisateur

1. Arrivée sur l’onboarding
2. Navigation par **swipe horizontal** (mobile) et **scroll + dots** (desktop)
3. Présentation du concept et des valeurs de SYNEA
4. Bouton **Passer** accessible à tout moment (mobile & desktop)
5. Dernière slide :
   - choix du rôle (radio)
   - CTA **Suivant** → redirection vers l’inscription avec rôle pré-sélectionné
6. Redirection vers `/auth/sign-up?role=hero` ou `/auth/sign-up?role=peer_hero`

---

## 🖥️ Responsive & UX

### Mobile
- Header léger avec logo + bouton **Passer**
- Carousel en haut (image), contenu textuel en dessous
- Swipe horizontal fluide + snapping
- Dots de navigation synchronisés

### Desktop
- Layout en **2 colonnes** :
  - images à gauche (carousel)
  - contenu à droite (panel)
- Dots de navigation centrés en bas
- Dernière slide : choix du rôle directement dans le panel
- Expérience volontairement simple et “clean” (type Revolut/Netflix), sans surcharge

---

## 🧩 Architecture des composants

- `Onboarding.tsx`
  - définit les `slides`
  - maintient `activeIndex` + système de “requestedIndex” pour piloter le scroll depuis le parent
  - gère les redirections (skip / sign-up / sign-up avec rôle)

- `OnboardingCarousel.tsx`
  - composant responsable du **scroll horizontal**
  - synchronise le slide visible → `activeIndex`
  - gère `goToSlide(index)` pour les dots / next (scrollTo smooth)
  - utilise `snap-x snap-mandatory` + `no-scrollbar`

- `OnboardingPanel.tsx`
  - affiche le contenu texte du slide actif
  - gère :
    - bouton **Continuer** (slides 1 & 2)
    - formulaire radio de rôle + submit (slide 3)
    - bouton **Passer** (desktop)
  - déclenche `onChooseRole(role)` sur validation

---

## 🧠 Choix techniques

- **Next.js 16 – App Router**
- Composants client pour l’interactivité (scroll, navigation, choix du rôle)
- Scroll horizontal piloté via `useRef` + `scrollLeft`
- Synchronisation scroll → index via `requestAnimationFrame`
- Navigation par dots (mobile & desktop)
- Images optimisées via `next/image`

---

## ⚠️ État actuel

- Onboarding **fonctionnel**
- Navigation par swipe / dots opérationnelle
- Redirection vers l’inscription avec rôle via query params (`/auth/sign-up?role=...`) opérationnelle

Améliorations prévues (UI/UX) :
- Micro-transitions entre onboarding et auth
- Éventuel “progress indicator” plus immersif
- Renforcement accessibilité (focus states, aria, touches)
- Changement d'image des slides/description
- Changement de couleurs en général/palette de couleur

Ces améliorations sont volontairement différées pour prioriser la structure fonctionnelle et l’architecture globale.

