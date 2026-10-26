# LabTrack

Веб-трекер лабораторних робіт: предмет, номер, дедлайн і статус (не розпочато, в роботі, здано, захищено).

## Запуск

```bash
npm install
npm run dev
```

## Перевірки

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run test:component  # компонентні й unit-тести (Cypress)
npm run test:e2e        # наскрізні тести (Cypress)
```

Git hooks (Husky): `pre-commit` запускає lint-staged, `pre-push` запускає ESLint, Prettier і компонентні тести.

## Структура

- `src/app` – кореневий компонент і маршрути
- `src/pages` – сторінки
- `src/features` – доменна логіка (`auth`, `labs`)
- `src/shared` – повторно використовувані компоненти та утиліти
- `cypress` – e2e-тести й налаштування
