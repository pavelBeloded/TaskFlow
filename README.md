# TaskFlow

Веб-приложение для управления задачами на канбан-досках с realtime-обновлениями. Аналог Trello/Jira с поддержкой совместной работы.

## 🚀 Demo

**[taskflow-demo.vercel.app](https://task-flow-kappa-black.vercel.app/)**

Тестовый аккаунт 1:
- Email: `demo@taskflow.app`
- Password: `demo123456`

Тестовый аккаунт 2:
- Email: `demo2@taskflow.app`
- Password: `demo123456`

---

## Стек технологий

| Категория | Технология |
|---|---|
| Фреймворк | React 19 + Vite |
| Язык | TypeScript |
| Backend / БД | Supabase (Postgres, Auth, Realtime, Storage) |
| Стилизация | Tailwind CSS v4 |
| Drag & Drop | `@dnd-kit/react` |
| Роутинг | React Router v7 |
| Server state | TanStack Query |
| Формы | React Hook Form + Zod |
| UI примитивы | Radix UI, Vaul, lucide |

---

## Запуск локально

```bash
git clone https://github.com/pavelBeloded/TaskFlow.git
cd taskflow
npm install
cp .env.example .env   # заполнить ключи Supabase
npm run dev
```

Переменные окружения (`.env`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

---

## Реализованные уровни

### ✅ Уровень 1 — MVP

- Регистрация / вход / выход через Supabase Auth
- Защита роутов — неавторизованный пользователь перенаправляется на `/login`
- Список досок пользователя с участниками
- Создание / удаление досок
- Колонки: создание, удаление, переименование; 3 колонки по умолчанию
- Задачи: создание, удаление
- Drag & Drop между колонками и внутри колонки с сохранением порядка
- Адаптивная вёрстка (desktop + mobile)
- Toast-уведомления об ошибках и успешных действиях
- Спиннеры загрузки

### ✅ Уровень 2 — Полный функционал

- **Детали задачи** — адаптивный drawer (снизу на мобиле, справа на десктопе) с редактированием названия, описания, приоритета, дедлайна и исполнителя
- **Комментарии** — список с автором и датой, добавление и удаление своих комментариев
- **Realtime** — автоматическое обновление доски при изменениях других пользователей через Supabase Realtime
- **Совместный доступ** — приглашение пользователей по email, роли owner / member, управление участниками
- **Профиль** — страница профиля с именем и загрузкой аватара через Supabase Storage

### ✅ Уровень 3 — Бонус

- Тёмная тема (dark mode) с поддержкой системных настроек и ручным переключением

---

## Архитектура

```
src/
├── components/
│   ├── auth/          # AuthLayout
│   ├── board/         # Column, BoardCard, CreateTaskModal
│   ├── task/          # TaskCard, TaskDrawer и субкомпоненты
│   └── shared/        # Button, Input, Modal, Avatar, Members...
├── pages/             # BoardsPage, BoardPage, ProfilePage, LoginPage, RegisterPage
├── hooks/             # useBoards, useTasks, useColumns, useMembers, useRealtimeBoard...
├── services/          # Supabase API (boards, tasks, columns, members, profiles)
├── providers/         # AuthProvider, ThemeProvider
├── types/             # TypeScript типы и алиасы
└── utils/             # priority, date, avatar helpers
```

**Ключевые архитектурные решения:**
- Слоистая архитектура: services → hooks → components
- React Query для серверного стейта, Context API для глобального UI-стейта (auth, theme)
- Открытие деталей задачи через URL search params (`?task=id`) — shareable ссылки, работает с кнопкой назад
- Оптимистичные обновления drag & drop через `queryClient.setQueryData`
- Автогенерация TypeScript типов из схемы Supabase через `supabase gen types`

---

## Что улучшил бы при наличии времени

- **Подтверждение инвайта** — сейчас пользователь добавляется на доску мгновенно без уведомления. В идеале — статус `pending` и email-уведомление с принятием приглашения
- **Autocomplete при инвайте** — поиск пользователей по имени с выпадающим списком вместо точного ввода email
- **Очистка assignee при удалении участника** — сейчас задачи остаются назначенными на удалённого участника
- **Фильтрация задач** — по приоритету, исполнителю, дедлайну
- **Поиск по задачам** — поиск по названию внутри доски
- **Горячие клавиши** — `N` для новой задачи
- **Скелетоны** — заменить спиннеры на skeleton placeholders для лучшего UX
- **Тесты** — покрыть хуки `useBoards`, `useTasks` и логику drag & drop
