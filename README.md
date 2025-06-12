# 📘 "РЕКОМЕНДАЦІЙНА ПЛАТФОРМА ДЛЯ ДІАГНОСТУВАННЯ ЗАХВОРЮВАНЬ"

---

## 👤 Автор

* **ПІБ**: Хаврона Віталій Романович
* **Група**: ФеП-42
* **Керівник**: доц. Сінькевич Олег Олександрович
* **Дата виконання**: 11.06.2025

---

## 📌 Загальна інформація

* **Тип проєкту:** Backend API / NestJS сервіс
* **Мова програмування:** TypeScript
* **Фреймворки та бібліотеки:**

  * NestJS
  * Fastify (за необхідності) або Express (за замовчуванням)
  * Class-Validator & Class-Transform (валідація DTO)
  * Jest (тестування)

---

## 🧠 Функціонал

1. **POST** `/predict` — прийом симптомів у форматі JSON: `{ "symptoms": string }`.
2. Клієнт взаємодіє з Python-сервісом для класифікації та генерації рекомендацій.
3. Повернення результату у вигляді JSON з полями:

   * `diagnosis`
   * `confidence`
   * `drugs`
   * `recommendations`
   * `self_care`
   * `reason_for_doctor_visit`
4. **GET** `/health` — перевірка статусу сервісу.
5. Глобальна валідація вхідних даних через ValidationPipe.
6. Модульна архітектура: контролери, сервіси, модулі.

---

## 🧱 Структура проєкту

```
.
├── src/
│   ├── app.module.ts        # Кореневий модуль NestJS
│   ├── main.ts              # Точка входу, налаштування ValidationPipe
│   ├── predict/             # Модуль для прогнозування
│   │   ├── predict.controller.ts
│   │   ├── predict.service.ts
│   │   ├── dto/
│   │   │   └── predict.dto.ts
│   │   └── interfaces/
│   │       └── predict.interface.ts
│   └── health/
│       └── health.controller.ts   # Health-check контролер
├── test/                     # Unit та e2e тести
├── .gitignore
├── eslint.config.mjs         # ESLint конфігурація
├── nest-cli.json             # Налаштування Nest CLI
├── package.json              # Залежності та скрипти
├── tsconfig.json             # TypeScript конфігурація
├── tsconfig.build.json       # Конфігурація збірки
└── yarn.lock / package-lock.json
```

---

## ▶️ Інструкція зі встановлення та запуску

1. **Клонувати репозиторій**

   ```bash
   git clone https://github.com/Xavtso/med-brat.git
   cd med-brat
   ```

2. **Встановити залежності**

   ```bash
   yarn install   # або npm install
   ```

3. **Налаштувати змінні оточення**
   Створіть файл `.env` у корені проекту та вкажіть:

   ```env
   PYTHON_SERVICE_URL=http://localhost:8001
   PORT=8000
   ```

4. **Запуск у режимі розробки**

   ```bash
   npm run start:dev   # або yarn start:dev
   ```

5. **Збірка для продакшн**

   ```bash
   npm run build
   npm run start:prod  # або yarn build && yarn start:prod
   ```

---

## 🧪 Тестування

* **Unit тести**

  ```bash
  npm run test   # або yarn test
  ```

* **E2E тести**

  ```bash
  npm run test:e2e  # або yarn test:e2e
  ```
