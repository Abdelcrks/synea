# SYNEA

Plateforme de mise en relation et de soutien entre patients ("Héros") et pairs-aidants ("Pair-héros").

## 🚧 Work in progress

### Inscription (Signup)

**Statut :** terminé (hors Better Auth)

#### Flux
- Sélection du rôle (hero / peer_hero)
- Formulaire d’inscription
- Validation côté client (UX)
- Server Action pour validation serveur
- Gestion des erreurs par champ
- État de chargement lors de la soumission

#### Choix techniques
- Next.js 16 (App Router)
- Server Actions pour le traitement du formulaire
- `useActionState` pour récupérer l’état serveur
- Validation centralisée côté serveur
- Séparation Auth (à venir) / Profil applicatif

#### À venir
- Intégration Better Auth (email + password)
- Création du profil utilisateur en base de données
- Redirection post-inscription

---

## 🔧 Dossier clé
- `app/auth/sign-up/[role]/`
  - `page.tsx`
  - `SignUpForm.tsx`
  - `actions.ts`
