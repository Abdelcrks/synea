# Contacts

Feature **Contacts** : gestion des relations entre utilisateurs (demande, acceptation, annulation, suppression).

Elle permet à un utilisateur :
- d’envoyer une demande de contact
- d’accepter / refuser une demande
- de consulter ses contacts acceptés
- de supprimer un contact existant

---

## Page principale

### `(app)/contacts/page.tsx`

Rôle : afficher la liste des **contacts acceptés** de l’utilisateur connecté.

Fonctionnement :
1. Récupère la session utilisateur
2. Si non connecté → redirection vers `/auth/sign-in`
3. Sélectionne les `contactRequests` :
   - `status = "accepted"`
   - où l’utilisateur est `fromUserId` ou `toUserId`
4. Transforme chaque relation en `{ requestId, otherUserId }`
5. Charge les profils associés via `profiles.userId IN (...)`
6. Construit `contacts: { requestId, profile }[]`
7. Rend `<ContactsContent />`

---

## Composants UI

### `components/contacts/ContactsContent.tsx`

Affichage de la liste des contacts.

Cas gérés :
- Aucun contact → message + CTA `/matching`
- Contacts présents → liste de cartes

Pour chaque contact :
- Accès au profil : `/profiles/{profile.id}`
- Bouton “Message” (redirection vers la feature Messages)
- Menu d’actions (`⋮`) :
  - suppression du contact via server action

---

## Actions serveur – Contacts

### `lib/actions/contacts/`

#### `removeContact(formData)`
- Auth requise
- Vérifie :
  - `requestId` valide
  - relation `accepted`
  - utilisateur impliqué dans la relation
- Met à jour :
  - `status = "canceled"`
  - `respondedAt = new Date()`
- Revalidation :
  - `/contacts`
  - `/matching`
  - `/requests`

#### `removeContactFormAction(formData)`
- Appelle `removeContact`
- Log en cas d’échec
- Revalide `/profiles/{profileId}` si fourni

---

## Contact Requests (workflow)

### `lib/actions/contact-requests/`

Gère le cycle de vie des demandes de contact.

Actions :
- `sendContactRequest`
- `acceptContactRequest`
- `rejectContactRequest`
- `cancelContactRequest`

Règles clés :
- utilisateur authentifié obligatoire
- impossible de se contacter soi-même
- profils visibles uniquement
- interdiction admin
- rôles opposés uniquement (hero ↔ peer_hero)
- prévention des doublons (direct / reverse)
- possibilité de relancer une demande annulée

Revalidations :
- `/requests`
- `/matching`
- `/profiles/{id}` selon le contexte

---

## Structure

```txt
(app)/contacts/
  page.tsx
  README.md

components/contacts/
  ContactsContent.tsx

lib/actions/contacts/
  removeContact.ts
  removeContactFormAction.ts

lib/actions/contact-requests/
  acceptContactRequest.ts
  cancelContactRequest.ts
  rejectContactRequest.ts
  sendContactRequest.ts
  forms/
    acceptContactRequestForm.ts
    cancelContactRequestForm.ts
    rejectContactRequestForm.ts
    sendContactRequestForm.ts

