import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';
const HAS_API_KEY = API_KEY && API_KEY.length > 10;
const ai = HAS_API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const MODEL_NAME = 'gemini-2.5-flash';

// Mock responses for demo mode
const MOCK_RESPONSES: Record<string, string> = {
  'default': 'Привет! Я AI-ассистент Kolesa Group. Сейчас я работаю в демо-режиме. Для полноценной работы добавьте API_KEY в файл .env.local',
  'привет': 'Привет! 👋 Я ваш AI-ассистент Kolesa Group. Чем могу помочь?',
  'сводка': '📋 Сводка по задачам:\n\n1. Редизайн карточки Kolesa.kz - IN_PROGRESS (50%)\n2. Push уведомления - REVIEW\n3. Интеграция Kaspi Pay - TODO\n\nРекомендация: Сфокусируйтесь на URGENT задачах.',
  'отчёт': '📊 Еженедельный отчёт\n\n✅ Завершено: 3 задачи\n🔄 В работе: 4 задачи\n📈 Эффективность: 92%',
  'выгорание': '⚠️ Риск выгорания:\n\n🔴 Высокий: Марат Алиев (95%)\n🟡 Средний: Тимур Сериков (90%)\n🟢 Норма: остальные',
  'эффективность': '📈 Эффективность команды:\n\nTask Completion: 92%\nOn-Time Delivery: 88%\nСредняя загрузка: 78%'
};

const findMockResponse = (message: string): string => {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return MOCK_RESPONSES['default'];
};

class MockChat {
  async sendMessageStream({ message }: { message: string }) {
    const response = findMockResponse(message);
    const words = response.split(' ');
    // Return an async iterable
    return {
      [Symbol.asyncIterator]: async function* () {
        for (const word of words) {
          await new Promise(r => setTimeout(r, 50));
          yield { text: word + ' ' };
        }
      }
    };
  }
}

export const createChatSession = (systemInstruction?: string): Chat | MockChat => {
  if (!HAS_API_KEY || !ai) {
    console.log('Demo mode - no API key');
    return new MockChat() as unknown as Chat;
  }
  
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction || "Ты профессиональный бизнес-ассистент для платформы NEXUS компании Kolesa Group. \n\nТвои задачи:\n1. Помогать с аналитикой, статусами задач и информацией о сотрудниках.\n2. Отвечать грамотно, четко и структурировано на русском языке.\n\nВАЖНОЕ ПРАВИЛО ФОРМАТИРОВАНИЯ:\n- НЕ используй Markdown (звездочки **, решетки #, курсив _).\n- Весь текст должен быть чистым и читабельным.\n- Используй эмодзи для акцентов и списков.\n- Используй отступы и пустые строки для разделения мыслей.",
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
      const resp = chunk as GenerateContentResponse;
      if (resp.text) onChunk(resp.text);
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    onChunk("\n\n[System Error: Failed to connect to Gemini API. Please check your network or API Key.]");
    throw error;
  }
};