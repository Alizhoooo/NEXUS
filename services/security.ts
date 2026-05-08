export const redactSensitiveText = (text: string): string => text
  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
  .replace(/\b\d{12}\b/g, '[redacted-id]')
  .replace(/\+?\d[\d\s().-]{8,}\d/g, '[redacted-phone]')
  .replace(/₸\s?\d[\d\s,]*/g, '[redacted-amount]');

export const containsPromptInjection = (text: string): boolean => (
  /ignore previous|developer message|system prompt|reveal.*secret|api[_ -]?key|token|credentials/i.test(text)
);
