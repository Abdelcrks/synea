# Requests (Demandes de contact)

Feature **Requests** : gestion des **demandes de contact** entre utilisateurs.

Cette feature permet :
- d’afficher les demandes reçues et envoyées
- d’accepter, refuser ou annuler une demande
- de contrôler le cycle de vie d’une relation avant qu’elle devienne un contact

---

## Responsabilité de la feature

La feature Requests est responsable :
- du workflow de demande de contact
- de la validation des règles métier
- des transitions d’état (`pending`, `accepted`, `rejected`, `canceled`)
- de la mise à jour de l’UI via `revalidatePath`

Elle **n’est pas responsable** :
- de l’affichage des contacts acceptés
- de la messagerie
- du matching

---

## Page principale

### `(app)/requests/page.tsx`

Rôle :
- afficher toutes les demandes de contact liées à l’utilisateur connecté

Types de demandes :
- **reçues** : `toUserId = session.user.id`
- **envoyées** : `fromUserId = session.user.id`

États affichés :
- `pending`
- `accepted` (historique)
- `rejected`
- `canceled`

---

## Actions serveur – Contact Requests

### `lib/actions/contact-requests/`

---

### `sendContactRequest(toUserId: string)`

Crée une demande de contact.

Règles métier :
- utilisateur authentifié obligatoire
- impossible de s’envoyer une demande à soi-même
- l’utilisateur cible doit exister (`users`)
- les deux profils doivent exister (`profiles`)
- le profil cible doit être visible (`isVisible = true`)
- interdiction si un des profils est `admin`
- autorise uniquement les rôles opposés (hero ↔ peer_hero)

Gestion des doublons :
- si une demande **directe** existe :
  - `canceled` → relancée (`pending`)
  - autre statut → bloqué
- si une demande **inverse** existe :
  - `pending`, `accepted`, `rejected` → bloqué

Revalidation :
- `/matching`
- `/requests`

---

### `acceptContactRequest(requestId: number)`

Accepte une demande reçue.

Conditions :
- utilisateur authentifié
- la demande doit :
  - exister
  - être `pending`
  - avoir `toUserId = session.user.id`

Effet :
- `status = "accepted"`
- `respondedAt = new Date()`

Revalidation :
- `/requests`

---

### `rejectContactRequest(requestId: number)`

Refuse une demande reçue.

Conditions :
- utilisateur authentifié
- demande `pending`
- `toUserId = session.user.id`

Effet :
- `status = "rejected"`

Revalidation :
- `/requests`

---

### `cancelContactRequest(requestId: number)`

Annule une demande envoyée.

Conditions :
- utilisateur authentifié
- demande `pending`
- `fromUserId = session.user.id`

Effet :
- `status = "canceled"`

Revalidation :
- `/requests`

---

## Server Actions Form

### `lib/actions/contact-requests/forms/`

Ces actions sont appelées depuis les formulaires UI.

Fonctionnement :
1. Lecture du `FormData`
2. Validation de `requestId` et `profileId`
3. Appel de l’action métier
4. Revalidation des pages concernées

Actions disponibles :
- `acceptContactRequestForm`
- `rejectContactRequestForm`
- `cancelContactRequestForm`
- `sendContactRequestForm`

Revalidations courantes :
- `/requests`
- `/matching`
- `/profiles/{profileId}`

---

## États d’une demande

```txt
pending   → accepted  → devient un contact
pending   → rejected  → demande refusée
pending   → canceled  → demande annulée
canceled  → pending   → relance possible
