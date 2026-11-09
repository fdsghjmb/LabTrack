# LabTrack

Веб-трекер лабораторних робіт: предмет, номер, дедлайн і статус (не розпочато, в роботі, здано, захищено).

## Запуск

```bash
npm install
npm run dev:all   # API на :3001 і фронтенд на :5173 (Vite проксує /api)
```

Окремо: `npm run server` (лише API) та `npm run dev` (лише фронтенд). Секрет JWT задається змінною `JWT_SECRET`, порт API змінною `PORT`.

## API

| Метод         | Шлях                                | Доступ    |
| ------------- | ----------------------------------- | --------- |
| POST          | /api/auth/register, /api/auth/login | відкритий |
| GET           | /api/auth/me                        | токен     |
| GET, POST     | /api/labs                           | токен     |
| PATCH, DELETE | /api/labs/:id                       | токен     |

Токен передається в заголовку `Authorization: Bearer <token>`. Помилки повертаються як `{ "error": "..." }`.

## Перевірки

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run test:api        # інтеграційні тести API (node:test)
npm run test:component  # компонентні й unit-тести (Cypress)
npm run test:e2e        # наскрізні тести (Cypress)
```

Git hooks (Husky): `pre-commit` запускає lint-staged, `pre-push` запускає ESLint, Prettier і компонентні тести.

## Структура

- `src/app` – кореневий компонент і маршрути
- `src/pages` – сторінки
- `src/features` – доменна логіка (`auth`, `labs`)
- `src/shared` – повторно використовувані компоненти та утиліти
- `server` – Express API (маршрути, авторизація, валідація, JSON-сховище, тести)
- `cypress` – e2e-тести й налаштування
