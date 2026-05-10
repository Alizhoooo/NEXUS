# 🚀 Деплой NEXUS на Render (БЕСПЛАТНО)

## Вариант 1: Автоматический деплой (рекомендуется)

### Шаг 1: Подготовка GitHub
```bash
cd NEXUS
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Шаг 2: Создание проекта на Render
1. Открой [render.com](https://render.com)
2. Войди через GitHub
3. Нажми **"New +"** → **"Web Service"**
4. Подключи GitHub репозиторий
5. Настрой:
   - **Name**: `nexus`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node server/index.js`
6. Нажми **"Create Web Service"**

### Шаг 3: Добавление PostgreSQL
1. В том же проекте нажми **"New +"** → **"PostgreSQL"**
2. **Name**: `nexus-db`
3. **Plan**: Free
4. Нажми **"Create Database"**

### Шаг 4: Подключение БД
1. После создания БД перейди в **"Connections"**
2. Скопируй **"Internal Connection String"**
3. Добавь переменную `DATABASE_URL` в web service

### Шаг 5: Настройка переменных
Добавь в web service:
- `NODE_ENV` = `production`
- `PORT` = `3001`

`DATABASE_URL` подключится автоматически из PostgreSQL.

### Шаг 6: Деплой
Нажми **"Deploy"** → жди 3-5 минут → получишь URL:
```
https://nexus-xxx.onrender.com
```

---

## Вариант 2: Через render.yaml (автоматически)

### Шаг 1: Загрузи render.yaml
1. Открой [render.com/dashboard](https://render.com/dashboard)
2. Нажми **"New +"** → **"Blueprint"**
3. Загрузи файл `render.yaml` из проекта
4. Нажми **"Apply"**

### Шаг 2: Готово!
Render автоматически создаст:
- ✅ Web Service (nexus)
- ✅ PostgreSQL (nexus-db)

---

## Инициализация БД

После деплоя нужно создать таблицы и seed данные:

### Способ 1: Через Render Shell
1. Откри web service на Render
2. Перейди в **"Shell"**
3. Выполни:
```bash
npx prisma db push
node prisma/seed.js
```

### Способ 2: Локально
```bash
# Скопируй DATABASE_URL из Render PostgreSQL
export DATABASE_URL="postgres://..."
npx prisma db push
node prisma/seed.js
```

---

## 🎉 Готово!

Твой NEXUS будет доступен по адресу:
```
https://nexus-xxx.onrender.com
```

---

## Бесплатные лимиты Render

| Лимит | Значение |
|-------|----------|
| **Compute** | 750 часов/месяц |
| **PostgreSQL** | Бесплатно (1 БД) |
| **Bandwidth** | 100 GB/месяц |
| **Idle** | Автоматически засыпает |

---

## Troubleshooting

### Ошибка 502
→ Проверь логи в Render Dashboard

### "Database connection refused"
→ Убедись что DATABASE_URL установлен

### "NEXUS_TOKEN_SECRET is required"
→ Добавь переменную в Render Dashboard