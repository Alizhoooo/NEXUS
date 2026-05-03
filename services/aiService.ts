import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const HAS_API_KEY = API_KEY && API_KEY.length > 10;

// System instructions for different contexts
export const SYSTEM_INSTRUCTIONS = {
  default: `Ты профессиональный бизнес-ассистент для платформы NEXUS компании Kolesa Group. 

Твои задачи:
1. Помогать с аналитикой, статусами задач и информацией о сотрудниках.
2. Отвечать грамотно, четко и структурировано на русском языке.
3. Предлагать конкретные действия, а не просто информацию.

ВАЖНОЕ ПРАВИЛО ФОРМАТИРОВАНИЯ:
- НЕ используй Markdown (звездочки **, решетки #, курсив _).
- Весь текст должен быть чистым и читабельным.
- Используй эмодзи для акцентов и списков.
- Используй отступы и пустые строки для разделения мыслей.`,

  tasks: `Ты AI-ассистент по управлению задачами в NEXUS. Твоя специализация:
- Анализировать статусы задач и выявлять проблемы
- Предлагать приоритизацию и распределение ресурсов
- Генерировать отчёты по прогрессу
- Рекомендовать действия для ускорения выполнения

Форматируй ответы с эмодзи и чёткими рекомендациями к действию.`,

  employees: `Ты HR AI-ассистент NEXUS. Твоя специализация:
- Анализировать загрузку сотрудников и выявлять риск выгорания
- Предлагать оптимизацию распределения задач
- Генерировать отчёты по эффективности команды
- Рекомендовать мероприятия для улучшения климата

Будь тактичным и предлагай конкретные шаги для улучшения ситуации.`,

  workflow: `Ты AI-ассистент по автоматизации бизнес-процессов. Твоя задача:
- Анализировать текущие процессы и предлагать автоматизацию
- Генерировать правила для workflow-движка
- Предлагать триггеры и действия для автоматизации

Отвечай структурно: Проблема → Решение → Конкретные шаги.`
};

// Mock responses for demo mode with contextual intelligence
const MOCK_RESPONSES: Record<string, string> = {
  'default': 'Привет! Я NEXUS AI. Задайте вопрос о задачах, сотрудниках или процессах компании.',
  
  // Task-related
  'задач': '📊 Сводка по задачам:\n\n✅ Завершено: 3 задачи (38%)\n🔄 В работе: 2 задачи (25%)\n⏳ Ожидают: 3 задачи (37%)\n\n🔴 Критично: 2 задачи с дедлайном на этой неделе!\n\n💡 Рекомендую:\n1. Проверить задачу "Интеграция с Kaspi Pay" - срок 20 декабря\n2. Назначить встречу по Security Audit\n\nХотите, чтобы я создал напоминание для ответственных?',
  
  'выгорани': '⚠️ Анализ риска выгорания:\n\n🔴 Высокий риск:\n• Марат Алиев - загрузка 95%\n• Динара Куанышева - 92%\n\n🟡 Средний риск:\n• Тимур Сериков - 90%\n• Асет Нурмагамбетов - 88%\n\n💡 Рекомендации:\n1. Перераспределить задачи от Марата на других менеджеров\n2. Запланировать 1:1 встречи с сотрудниками из зоны риска\n3. Рассмотреть возможность делегирования\n\nСоздать встречу с HR для обсуждения?',
  
  'отчёт': '📈 Еженедельный отчёт эффективности:\n\n📋 Метрики:\n• Task Completion Rate: 92% (+5%)\n• On-Time Delivery: 88% (-2%)\n• Средняя загрузка: 78%\n\n🏆 Лучшие сотрудники:\n1. Алия Исмаилова - 100% задач вовремя\n2. Нурлан Джексенов - 95%\n\n📉 Требуют внимания:\n• Задачи с дедлайном на 20-25 декабря\n\nСформировать детальный PDF-отчёт?',
  
  'эффективност': '📊 Эффективность команды:\n\nПо отделам:\n• Engineering: 88% ⬆️\n• Product: 92% ⬆️\n• Design: 75% ⬇️ (Айгерим в отпуске)\n• QA: 85% ➡️\n\nРекомендация: Провести ретроспективу по Design отделу после возвращения Айгерим.',
  
  'встреч': '📅 Готов предложить встречу:\n\nТема: Обсуждение просроченных задач\nУчастники: Марат Алиев, Асет Нурмагамбетов\nВремя: Завтра, 15:00\nПовестка:\n1. Интеграция Kaspi Pay\n2. Security Audit\n\nСоздать событие в календаре?',
  
  'напомин': '🔔 Напоминания:\n\nСегодня:\n• 14:00 - Standup meeting\n• 18:00 - Дедлайн по Kaspi Pay\n\nЗавтра:\n• 10:00 - Planning session\n\nНастроить push-уведомления?'
};

const findMockResponse = (message: string): string => {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return MOCK_RESPONSES['default'];
};

class MockChat {
  private systemInstruction: string;
  
  constructor(systemInstruction?: string) {
    this.systemInstruction = systemInstruction || SYSTEM_INSTRUCTIONS.default;
  }
  
  async sendMessageStream({ message }: { message: string }) {
    const response = findMockResponse(message);
    const words = response.split(' ');
    
    return {
      [Symbol.asyncIterator]: async function* () {
        for (const word of words) {
          await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
          yield { text: word + ' ' };
        }
      }
    };
  }
}

let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI | null => {
  if (!HAS_API_KEY) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
};

export const createChatSession = (context: keyof typeof SYSTEM_INSTRUCTIONS = 'default'): Chat | MockChat => {
  const systemInstruction = SYSTEM_INSTRUCTIONS[context];
  
  if (!HAS_API_KEY) {
    console.log('Demo mode - no API key');
    return new MockChat();
  }
  
  const ai = getAIInstance();
  if (!ai) {
    return new MockChat();
  }
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};

export const streamChatMessage = async (
  chat: Chat | MockChat,
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      if ('text' in chunk && chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n\n[Ошибка подключения к AI. Пожалуйста, проверьте соединение или попробуйте позже.]");
    throw error;
  }
};

// AI Action suggestions - intelligent interface
export interface AISuggestion {
  type: 'action' | 'insight' | 'warning';
  title: string;
  description: string;
  action?: () => void;
  icon: string;
}

export const generateAISuggestions = (context: string, data?: any): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  
  // Task context suggestions
  if (context === 'tasks' && data) {
    const overdueTasks = data.filter((t: any) => t.status !== 'DONE');
    if (overdueTasks.length > 0) {
      suggestions.push({
        type: 'warning',
        title: 'Просроченные задачи',
        description: `${overdueTasks.length} задач требуют внимания`,
        icon: '⚠️'
      });
    }
    
    suggestions.push({
      type: 'action',
      title: 'Сгенерировать отчёт',
      description: 'AI создаст сводку по всем задачам',
      icon: '📊'
    });
  }
  
  // Employee context suggestions
  if (context === 'employees' && data) {
    const overloaded = data.filter((e: any) => e.workload > 90);
    if (overloaded.length > 0) {
      suggestions.push({
        type: 'warning',
        title: 'Риск выгорания',
        description: `${overloaded.length} сотрудников с перегрузкой`,
        icon: '🔴'
      });
    }
    
    suggestions.push({
      type: 'action',
      title: 'Оптимизировать загрузку',
      description: 'AI предложит перераспределение',
      icon: '⚖️'
    });
  }
  
  return suggestions;
};
