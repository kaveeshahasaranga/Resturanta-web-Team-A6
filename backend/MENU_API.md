# Menu backend setup and API

This project uses **MySQL**. The existing local `.env` has a SQLite `file:` URL; configure a MySQL connection before starting the backend. Existing data has not been reset or migrated.

## Setup

In `backend/`:

1. `npm install`
2. Configure `.env` using `.env.example`, with a MySQL `DATABASE_URL` and a long random `JWT_SECRET`.
3. Optional Docker: set `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD`, then `docker compose up -d --wait`. The connection is `mysql://fuchsius:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:3306/fuchsius_db`.
4. `npm run db:generate`
5. `npm run db:deploy`
6. `npm run db:seed`
7. `npm run dev` (port 5000)

In `frontend/`, run `npm install` and `npm run dev` (port 5173). Sign in at `/admin-login` using the existing development seed `admin@fuchsius.com` / `admin123`. Change this password before deployment. Manage dishes at `/admin/menu` and categories at `/admin/categories`.

For an **existing MySQL database created from the original schema**, back up and verify it matches the initial migration, then run `npx prisma migrate resolve --applied 202610230001_initial` before `npm run db:deploy`. Do not baseline a different schema. The category migration preserves existing codes and creates category rows. Empty databases deploy both migrations normally.

## Endpoints

Responses are `{success:true,data:...}` or `{success:false,message:...}` with appropriate HTTP error codes. Admin writes require `Authorization: Bearer <token>` from `POST /api/auth/login`.

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/api/categories` | List categories | Public |
| POST | `/api/categories` | Add `{code,name,description?}` | Admin |
| PUT | `/api/categories/:id` | Edit category; changed code cascades to dishes | Admin |
| DELETE | `/api/categories/:id` | Delete unused category | Admin |
| GET | `/api/menu?category=MAIN_COURSE&available=true&search=rice` | Menu/filter/search | Public |
| GET | `/api/menu/:id` | Food details, price, availability, category name | Public |
| POST | `/api/menu` | Add `{name,description,price,category,image?,isAvailable?}` | Admin |
| PUT | `/api/menu/:id` | Edit dish | Admin |
| DELETE | `/api/menu/:id` | Archive dish and preserve historical orders | Admin |
| PATCH | `/api/menu/:id/availability` | Set `{isAvailable:boolean}` | Admin |
| POST | `/api/menu/:id/image` | Multipart field `image` | Admin |
| DELETE | `/api/menu/:id/image` | Remove image and uploaded file | Admin |
| POST | `/api/cart/quote` | Quote `{items:[{menuItemId,quantity}]}` | Public |
| POST | `/api/orders` | Create order at current database prices | Public/optional login |
| GET | `/api/orders` | List orders | Admin |

### Chefs and restaurant information

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/api/chefs` | List chefs | Public |
| GET | `/api/chefs/:id` | Get chef details | Public |
| POST | `/api/chefs` | Add a chef | Admin |
| PUT | `/api/chefs/:id` | Update a chef | Admin |
| DELETE | `/api/chefs/:id` | Delete a chef | Admin |
| POST | `/api/contact` | Submit a contact message `{name,email,message}` | Public |
| GET | `/api/contact` | List contact messages | Admin |
| PATCH | `/api/contact/:id/read` | Mark a message as read | Admin |
| DELETE | `/api/contact/:id` | Delete a contact message | Admin |
| GET | `/api/contact/info` | Retrieve restaurant name, address, email, and phone | Public |
| GET | `/api/contact/location` | Retrieve restaurant address and Google Maps search URL | Public |

Category codes start with a letter and contain uppercase letters, numbers or underscores (max 64 characters). Categories referenced by dishes, including archived dishes, cannot be deleted; reassign those records first.

Image uploads accept PNG/JPEG/WebP with signature checks and a 5 MB limit. Files have generated names and live under `backend/uploads/menu/`, served at `/uploads/menu/`. Replaced/removed uploads are deleted. Retain this directory on persistent storage in deployment. Existing `/images/` paths and HTTP(S) image URLs are also supported. Base64 and SVG uploads are rejected.

Cart quotes return current item details, availability, unit and line prices, `subtotal`, `serviceCharge`, `total`, and `canCheckout`. Quantities are integers from 1–99 per dish; duplicate lines merge. Client prices, totals and user IDs are ignored when creating orders. Orders use a serializable transaction and retain purchased prices. Cart, checkout and orders now share **LKR, 10% service charge, and free delivery**, following the existing cart UI. The old simulated promo field was removed.

Cart contents persist across refreshes. Prices and availability refresh on cart changes/window focus and again before checkout. Menu errors and empty results no longer silently show purchasable demo dishes. Profile/security/content demo features outside this menu scope remain separate work.

## Verification

- Frontend: `npm run lint` and `npm run build`.
- Backend: `npm test` runs unit tests. Database integration is skipped unless `TEST_DATABASE_URL` is set.
- For the full suite, deploy migrations to an isolated MySQL database whose name ends `_test`, then run `TEST_DATABASE_URL="mysql://.../restaurant_test" npm test`. Tests clean up only their own records.

Production hosting must proxy `/api` and `/uploads/menu` to the backend, support frontend SPA routes, and serve frontend `/images` assets. The Vite proxy is only for development.
