# 🤝 Matching & Demandes de mise en relation – SYNEA

## 🎯 Objectif

La fonctionnalité **Matching** permet aux utilisateurs de SYNEA de découvrir des profils compatibles et d’initier une **demande de mise en relation** de manière encadrée, respectueuse et sécurisée.

L’objectif est de faciliter des échanges humains de qualité entre :
- **Héros** : personnes actuellement touchées par la maladie
- **Pair-héros** : personnes en rémission ou ayant traversé l’épreuve

---

## 🧠 Principes clés

- Le matching repose sur les **rôles utilisateurs**
- Les utilisateurs gardent le **contrôle total** sur leur visibilité
- Aucune discussion n’est possible **sans acceptation mutuelle**
- La fonctionnalité est pensée pour être **évolutive** (filtres, chat, notifications)

---

## 👥 Règles de matching (V1)

Un utilisateur peut :
- ✅ Voir uniquement les profils du **rôle opposé**
- ✅ Voir uniquement les profils **visibles**
- ❌ Ne jamais se voir lui-même
- ❌ Ne jamais contacter un administrateur

---

## 🔄 Cycle de vie d’une demande de contact

Les demandes de mise en relation suivent un cycle précis via la table `contact_requests`.

### 📌 Statuts possibles

| Statut | Description |
|------|-------------|
| `pending` | Demande envoyée, en attente de réponse |
| `accepted` | Demande acceptée, relation établie |
| `rejected` | Demande refusée par le destinataire |
| `canceled` | Demande annulée par l’expéditeur |

---

## ✉️ Logique métier

### Envoi d’une demande
Une demande peut être envoyée si :
- l’utilisateur est connecté
- le profil ciblé existe et est visible
- les rôles sont compatibles (Héros ↔ Pair-héros)
- aucune demande active n’existe déjà entre les deux utilisateurs

### Annulation
- Seul l’expéditeur peut annuler une demande
- Le statut passe à `canceled`
- Une nouvelle demande peut ensuite être envoyée

### Refus
- Seul le destinataire peut refuser une demande
- Le statut passe à `rejected`
- Le refus bloque toute nouvelle tentative ultérieure (V1)

### Acceptation
- Le statut passe à `accepted`
- Les deux utilisateurs sont considérés comme connectés
- Cette étape ouvrira plus tard l’accès au **chat**

---

## 🖥️ Pages concernées

### 🔍 `/matching`
- Liste des profils compatibles
- Affichage de l’état de la relation :
  - *Envoyer une demande*
  - *Demande en attente*
  - *Demande reçue*
  - *Déjà connectés*
- Boutons automatiquement désactivés selon le statut

### 📬 `/requests`
- Séparation claire :
  - **Demandes reçues**
  - **Demandes envoyées**
- Actions possibles :
  - Annuler (demandes envoyées)
  - Accepter / Refuser (demandes reçues)
- Mise à jour en temps réel via `revalidatePath`

---

## 🗄️ Modélisation BDD (simplifiée)

### `contact_requests`

- `fromUserId`
- `toUserId`
- `status`
- `createdAt`
- `respondedAt`

Contrainte :
- une seule relation possible entre deux utilisateurs à un instant donné

---

## 🧩 Architecture technique

- **Server Components** pour les pages (`matching`, `requests`)
- **Client Components** pour les cartes interactives
- **Server Actions** pour toutes les mutations :
  - `sendContactRequest`
  - `cancelContactRequest`
  - `rejectContactRequest`
  - `acceptContactRequest`
- Synchronisation UI ↔ base de données avec `revalidatePath`

---

## 🚀 Évolutions prévues

- 💬 Chat accessible uniquement après acceptation
- 🔔 Notifications (badge, compteur)
- 🔍 Filtres avancés (région, type de cancer, centres d’intérêt)
- ⏱️ Cooldown entre demandes
- 👁️ Paramètres de confidentialité plus fins

---

## 🧪 État actuel

- ✅ Fonctionnel
- ✅ Testé manuellement
- ✅ Prêt pour extension (chat)

---

## 🧠 Note

Cette fonctionnalité est au cœur de SYNEA et a été conçue avec une attention particulière portée à l’éthique, au consentement et à la sécurité émotionnelle des utilisateurs.
