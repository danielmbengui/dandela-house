# App Dandela House — authentification

Base URL API : variable d’environnement côté app (ex. `https://api.house.dandela.com`).  
Préfixe : **`/api/auth/app`**.  
Inscription / connexion par **SMS** (Firebase Auth). Profil **MariaDB** : `users.uid` = **`firebase_uid`**.

Headers :

```http
x-api-key: <API_KEY_APP>
Authorization: Bearer <id_token>   # après signInWithCustomToken — pas la clé API
```

Firebase : **Authentication → Téléphone** activé. SMS / clés REST : **`BDD-APP.md`** du dépôt **dandela-house-api**.

---

## Table `users` (côté client)

Utiliser les **noms SQL** dans les JSON ; l’API accepte encore les alias legacy.

| Envoi JSON (recommandé) | Alias legacy (toujours acceptés) |
|-------------------------|----------------------------------|
| `is_accepted_terms` | `accepted_legal_notice` |
| `is_accepted_privacy` | `accepted_privacy_policy` |

Champs utiles à l’inscription / `PATCH /me` :

`first_name`, `last_name`, `birth` (`yyyy-MM-dd`), `gender` (`male` \| `female` \| `other`), `code_country`, `lang`, `display_name`, `email`, `photo_url`, `back_color_widget`, `font_color_widget`, `is_accepted_terms`, `is_accepted_privacy`, `storage_url`, …

**Lecture `GET /me`** : `user.status`, `user.is_phone_number_verified`, `user.is_accepted_terms`, `user.is_accepted_privacy`, plus alias `accepted_*` dans la réponse.

**Session** : `connected` / `is_connected` dans la réponse `/me` = jeton valide, **pas** une colonne SQL (`is_online` est distinct, optionnel).

Après `register/verify`, statut courant : **`must-accept-terms`** → enchaîner les écrans CGU puis `PATCH /me` avec `is_accepted_terms: true`, puis confidentialité avec `is_accepted_privacy: true`.

---

## Créer un compte

| # | Méthode | URL | Rôle |
|---|---------|-----|------|
| 1 | `POST` | `/api/auth/app/register` | Profil optionnel + SMS → `session_info` |
| 2 | `POST` | `/api/auth/app/register/verify` | Code → Firebase + MariaDB (`is_phone_number_verified`) |

### 1. SMS — `POST /api/auth/app/register`

```json
{
  "phone_number": "+2449xxxxxxx",
  "locale": "fr",
  "first_name": "Daniel",
  "last_name": "Mbengui",
  "birth": "1990-05-12",
  "gender": "male",
  "lang": "fr"
}
```

+ preuve d’app : `recaptcha_token` (web), `play_integrity_token` (Android), `ios_receipt` + `ios_secret` (iOS).

**Réponse** : `phone_number`, `session_info`, `user_uid`.

### 2. Verify — `POST /api/auth/app/register/verify`

```json
{ "session_info": "…", "code": "123456" }
```

**Réponse** : `firebase_uid`, jetons Firebase, `user` (profil MariaDB).

App : **`signInWithCustomToken(custom_token)`** → stocker `id_token`.

---

## Connexion

| `POST` | `/api/auth/app/login` | SMS si numéro déjà dans Firebase |
| `POST` | `/api/auth/app/login/verify` | Jetons (`is_new_user: false`) |

---

## Profil connecté

| Méthode | URL |
|---------|-----|
| `GET` | `/api/auth/app/me` |
| `PATCH` | `/api/auth/app/me` |
| `GET` | `/api/auth/app/users/:uid` | (`:uid` = `firebase_uid` du jeton) |

Exemple **`GET /me`** :

```json
{
  "authenticated": true,
  "firebase_uid": "…",
  "phone_number": "+2449…",
  "connected": true,
  "is_connected": true,
  "user": {
    "uid": "…",
    "first_name": null,
    "display_name": null,
    "display_name_normalized": null,
    "phone_number": "+2449…",
    "pseudo": "+2449…",
    "gender": "male",
    "status": "must-accept-terms",
    "is_phone_number_verified": true,
    "is_accepted_terms": false,
    "is_accepted_privacy": false
  }
}
```

`pseudo` est **calculé** à la volée (non stocké) : `display_name` → `phone_number` (jeton ou colonne) → `email` → prénom+nom → `uid`.

Exemple **`PATCH /me`** (acceptation CGU) :

```json
{ "is_accepted_terms": true }
```

Mise à jour profil (aligné store app `phone_number` / `display_name`) :

```json
{
  "first_name": "Daniel",
  "last_name": "Mbengui",
  "display_name": "Daniel M.",
  "phone_number": "+41791234567"
}
```

Fin du carrousel **première connexion** (`status` = `first-connection`) :

```json
{ "completed_onboarding": true }
```

→ passe le statut à **`active`** (côté API).

---

## Déconnexion

`POST /api/auth/app/disconnect` + `signOut()` Firebase.

---

## Paiements AppyPay (via API)

L’app **ne stocke pas** les secrets AppyPay. Tout passe par l’API : préfixe **`/api/payments/app`**.

Headers (comme `/me`) :

```http
x-api-key: <API_KEY_APP>
Authorization: Bearer <id_token>
```

| Action | Méthode | URL |
|--------|---------|-----|
| Lancer Multicaixa Express (GPO) | `POST` | `/api/payments/app/charges` |
| Suivre une transaction | `GET` | `/api/payments/app/charges/:chargeId` |
| Simuler référence (sandbox) | `POST` | `/api/payments/app/reference-mock` |

### GPO — corps minimal

```json
{
  "method": "gpo",
  "amount": 1000,
  "currency": "AOA",
  "description": "Reservation"
}
```

`phone_number` optionnel si déjà sur le profil utilisateur.  
En **tests sandbox**, utiliser `900000000` (succès), `900000001` (solde insuffisant), etc.

**Persistance réservation** — table `bookings_transactions` (API) :

| Colonne | Valeur |
|---------|--------|
| `merchant_transaction_id` | Transaction ID AppyPay = `charge.id` (UUID) |
| `reference_number` | Provider Transaction ID (ex. GPO Multicaixa) |
| `merchant_reference` | ID marchand 15 car. (`appypay_merchant_reference` dans la réponse charge) |

Créer la ligne en passant `uid_booking` dans `POST /api/payments/app/charges`, ou `POST /api/bookings-transactions` avec `sync_from_charge_id`.  
Poller `GET …/charges/:id` ou webhook (`/api/payments/appypay/webhook`) pour mettre à jour `reference_number` et le statut.

### Référence bancaire

```json
{
  "method": "ref",
  "amount": 5000,
  "reference_number": "123456789",
  "due_date": "2026-12-31T23:59:59"
}
```

Afficher à l’utilisateur `entity` + référence renvoyés dans `charge.responseStatus.reference`.  
En sandbox, appeler ensuite `POST /api/payments/app/reference-mock` avec `entity` et `reference_number`.

Détail serveur, variables d’env et curl : **dandela-house-api** → `BDD-APP.md` (section Paiements).

### Page de test rapide

En dev : **Profil** → lien « Test paiement AppyPay », ou aller sur **`/test`**.

1. Choisir montant (AOA) et scénario GPO (`900000000` = succès).
2. **Lancer le paiement test** → JSON charge affiché.
3. **Rafraîchir statut** avec l’`id` AppyPay.
4. Mode **ref** : puis **Simuler paiement REF** (sandbox).

Session Firebase requise (`ensureValidStoredAuth` → Bearer sur l’API).

---

## Catalogue & réservation (données API)

Schéma MariaDB et routes serveur : **dandela-house-api** → `BDD-TABLES.md` + section *Données catalogue* dans `BDD-APP.md`.

Headers pour ces appels :

```http
x-api-key: <API_KEY_APP>
```

(Pas de `id_token` Firebase requis, sauf profil `/me` et paiements.)

### Enchaînement typique côté app

1. **Géo** (filtres locaux, carte) : `GET /api/cities?code_country=…` → `GET /api/provinces?uid_city=…` → éventuellement `districts`, `addresses`.
2. **Maison** : `GET /api/houses` puis `GET /api/houses/:uid` (`rooms`, `children_count`).
3. **Chambre** : `GET /api/rooms/:uid` (tarif, étage, settings, photos).
4. **Infos lieu** : `GET /api/entities/:uid/addresses`, `…/contacts`, `…/seasons`, `…/pricings`, `…/currencies`, `…/equipments` (même `:uid` que l’entité maison / chambre).
5. **Paiement** : section AppyPay ci-dessus.

### Endpoints à prévoir dans `lib/` (suggestions)

| Besoin UI | Route |
|-----------|--------|
| Liste maisons | `GET /api/houses` |
| Détail + chambres | `GET /api/houses/:uid` |
| Chambre | `GET /api/rooms/:uid` (`price` depuis `entities_pricings` si présent, sinon `rooms`) |
| Offres réservables | `GET /api/rooms?bookable=1&available=1&adults=&children=` (+ `occupancy=1` pour les bornes) |
| Grille tarifs | `GET /api/entities/:uid/pricings`, catalogue `GET /api/entities-pricings` (`?uid_house=&min_room_price=1`) |
| Horaires réception | `GET /api/entities-opening-hours?uid_entity=&role=reception&lang=` (`primary.text`) |
| Devises catalogue | `GET /api/currencies` |
| Devises de l’entité | `GET /api/entities/:uid/currencies` |
| Saisons catalogue | `GET /api/seasons` |
| Contacts support | `GET /api/contacts?role=bookings` |
| Adresse d’une entité | `GET /api/entities/:uid/addresses` |

Réponses liste : `{ "<collection>": [ … ], "count": n }`.  
Liens entité-adresse / entité-contact : chaque élément inclut **`link_uid`** (PK de la table de liaison).

### Tarifs (`entities_pricings`)

- Liste : `GET /api/entities/:uid/pricings` (`price`, `uid_season`, `uid_currency`, `display_order`).
- Chambres (`GET /api/rooms`) : tarif principal + libellés devise via jointure **`currencies`** (`pricing_uid`, `uid_currency`).
- Pas de colonnes `currency_code` / `symbol` stockées sur la ligne tarif — tout passe par `uid_currency`.

### Distinction settings / equipments

- **`GET /api/rooms/:uid/settings`** — `entities_settings` : booléens **`has_*`** (+ four, plaques, micro-ondes) et capacité `count_adults` / `count_childrens`.
- **`GET /api/entities/:uid/equipments`** — `entities_equipments` : quantités **`count_*`** (ex. `count_tv`, `count_fridge`), pas des booléens.

### Contenus JSON utiles

- **`addresses`** : `latitude`, `longitude`, `public_transport_buses`, `neighborhoods` (objets JSON parsés par l’API).
- **`contacts`** : `type`, `role`, `label`, `value`, `display_order`.
- **Profil** : continuer à normaliser avec `lib/auth/me-profile.ts` (`is_accepted_terms`, `gender`, `other`, …).

Les opérations **POST / PATCH / DELETE** sur le catalogue sont réservées au back-office (`API_KEY_ADMIN`) ; l’app mobile ne les appelle pas.

---

## Erreurs fréquentes (app)

| HTTP | `code` | Action |
|------|--------|--------|
| 401 | `FIREBASE_TOKEN_*` | Rafraîchir / reconnecter |
| 404 | `USER_NOT_FOUND` | Refaire register/verify |
| 409 | `PHONE_ALREADY_REGISTERED` | Proposer login |
| 503 | `USER_PERSISTENCE_ERROR` | Réessayer ; voir logs API |
| 503 | `APPYPAY_NOT_CONFIGURED` | Config API / Vercel |
| 409 | `APPYPAY_DUPLICATE_TRANSACTION` | Nouveau `merchant_transaction_id` |
| 400 | `APPYPAY_VALIDATION_ERROR` | Vérifier `payment_method` portal (`GPO_{api_key}` complet) |

Détail complet : **dandela-house-api** → `BDD-APP.md`.

---

## Code app (références)

| Fichier | Rôle |
|---------|------|
| `lib/auth/api.ts` | `RegisterProfileFields`, appels HTTP |
| `lib/auth/me-profile.ts` | Types `ApiUserProfile`, `PatchMeBody`, mapping store |
| `lib/store.ts` | `acceptSignupConsent`, inscription SMS |
| `lib/payments/appypay.ts` | `POST /payments/app/charges`, polling statut |
| `app/(app)/test/page.tsx` | UI sandbox : montant + GPO `900000000` (lien profil en `dev`) |

Catalogue HTTP : à factoriser (ex. `lib/catalog/api.ts`) selon les écrans — routes listées dans la section *Catalogue & réservation*.
