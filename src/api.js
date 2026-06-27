import { safeJsonParse } from './utils.js';

class PaymentsApi {
  constructor({ baseUrl } = {}) {
    this.baseUrl = baseUrl || '';
  }

  getAuthToken() {
    const fromSession = window.sessionStorage.getItem('jwt');
    const fromLocal = window.localStorage.getItem('jwt');
    return fromSession || fromLocal || '';
  }

  buildHeaders() {
    const token = this.getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getDailySummary(startDate, endDate) {
    const query = new URLSearchParams({ startDate, endDate });
    const response = await fetch(`${this.baseUrl}/api/payments/daily?${query.toString()}`, {
      headers: this.buildHeaders()
    });
    const text = await response.text();
    return safeJsonParse(text);
  }

  async getMonthlySummary(startDate, endDate) {
    const query = new URLSearchParams({ startDate, endDate });
    const response = await fetch(`${this.baseUrl}/api/payments/monthly?${query.toString()}`, {
      headers: this.buildHeaders()
    });
    const text = await response.text();
    return safeJsonParse(text);
  }

  async getPaymentBundle(startDate, endDate) {
    const daily = await this.getDailySummary(startDate, endDate);
    const monthly = await this.getMonthlySummary(startDate, endDate);
    return { daily, monthly };
  }
}

export const paymentsApi = new PaymentsApi({ baseUrl: '' });
