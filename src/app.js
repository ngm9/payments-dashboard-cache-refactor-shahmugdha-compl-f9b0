import { PaymentsDashboard } from './components/paymentsDashboard.js';
import { paymentsApi } from './api.js';
import { createCache } from './cache.js';
import { eventBus } from './events.js';

const rootElement = document.getElementById('app');

const cache = createCache({ namespace: 'utkrusht_payments' });

const dashboard = new PaymentsDashboard({
  root: rootElement,
  api: paymentsApi,
  cache,
  events: eventBus
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dashboard.init();
  });
} else {
  dashboard.init();
}
