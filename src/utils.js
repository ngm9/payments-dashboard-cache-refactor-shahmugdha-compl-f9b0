export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function formatDateInput(value) {
  return value || '';
}

export function createElement(tagName, options = {}) {
  const el = document.createElement(tagName);
  const { className, text, attrs } = options;
  if (className) {
    el.className = className;
  }
  if (typeof text === 'string') {
    el.textContent = text;
  }
  if (attrs && typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, val]) => {
      el.setAttribute(key, String(val));
    });
  }
  return el;
}
