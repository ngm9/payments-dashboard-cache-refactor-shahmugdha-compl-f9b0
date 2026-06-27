import { createElement, formatDateInput } from '../utils.js';

export class PaymentsDashboard {
  constructor({ root, api, cache, events }) {
    this.root = root;
    this.api = api;
    this.cache = cache;
    this.events = events;
    this.state = {
      startDate: '',
      endDate: '',
      loading: false,
      error: null,
      bundle: null
    };
  }

  init() {
    this.renderShell();
    this.attachEventHandlers();
  }

  renderShell() {
    this.root.innerHTML = '';

    const controls = createElement('div', { className: 'controls' });

    const startLabel = createElement('label');
    startLabel.textContent = 'Start date:';
    const startInput = createElement('input', { attrs: { type: 'date', 'data-role': 'start-date' } });

    const endLabel = createElement('label');
    endLabel.textContent = 'End date:';
    const endInput = createElement('input', { attrs: { type: 'date', 'data-role': 'end-date' } });

    const submitButton = createElement('button', { text: 'Load payments', attrs: { 'data-role': 'submit' } });

    controls.appendChild(startLabel);
    controls.appendChild(startInput);
    controls.appendChild(endLabel);
    controls.appendChild(endInput);
    controls.appendChild(submitButton);

    const bannerRegion = createElement('div', { attrs: { 'data-region': 'banner' } });
    const contentRegion = createElement('div', { attrs: { 'data-region': 'content' } });

    this.root.appendChild(controls);
    this.root.appendChild(bannerRegion);
    this.root.appendChild(contentRegion);

    this.syncInputs();
    this.renderContent();
  }

  getElements() {
    const startInput = this.root.querySelector('[data-role="start-date"]');
    const endInput = this.root.querySelector('[data-role="end-date"]');
    const submitButton = this.root.querySelector('[data-role="submit"]');
    const bannerRegion = this.root.querySelector('[data-region="banner"]');
    const contentRegion = this.root.querySelector('[data-region="content"]');
    return { startInput, endInput, submitButton, bannerRegion, contentRegion };
  }

  attachEventHandlers() {
    const { startInput, endInput, submitButton } = this.getElements();

    startInput.addEventListener('change', (e) => {
      this.state.startDate = e.target.value;
    });

    endInput.addEventListener('change', (e) => {
      this.state.endDate = e.target.value;
    });

    submitButton.addEventListener('click', () => {
      this.loadCurrentRange();
    });
  }

  syncInputs() {
    const { startInput, endInput } = this.getElements();
    startInput.value = formatDateInput(this.state.startDate);
    endInput.value = formatDateInput(this.state.endDate);
  }

  async loadCurrentRange() {
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) {
      this.state.error = 'Please choose both start and end dates.';
      this.renderBanner();
      return;
    }

    this.state.loading = true;
    this.state.error = null;
    this.renderBanner();
    this.renderContent();

    const key = `${startDate}:${endDate}`;
    const cached = this.cache.get(key);
    if (cached && cached.value) {
      this.state.bundle = cached.value;
      this.state.loading = false;
      this.renderContent();
      return;
    }

    try {
      const bundle = await this.api.getPaymentBundle(startDate, endDate);
      this.cache.set(key, bundle);
      this.state.bundle = bundle;
      this.state.loading = false;
      this.renderContent();
    } catch (e) {
      this.state.loading = false;
      this.state.error = 'Failed to load payments. Please try again later.';
      this.renderBanner();
      this.renderContent();
    }
  }

  renderBanner() {
    const { bannerRegion } = this.getElements();
    bannerRegion.innerHTML = '';

    if (this.state.loading) {
      const banner = createElement('div', { className: 'banner info', text: 'Loading payments…' });
      bannerRegion.appendChild(banner);
      return;
    }

    if (this.state.error) {
      const banner = createElement('div', { className: 'banner error', text: this.state.error });
      bannerRegion.appendChild(banner);
      return;
    }
  }

  renderContent() {
    const { contentRegion } = this.getElements();

    if (this.state.loading) {
      contentRegion.innerHTML = '<div class="loading">Loading data…</div>';
      return;
    }

    if (!this.state.bundle) {
      contentRegion.innerHTML = '<div class="loading">No data loaded yet.</div>';
      return;
    }

    const { daily, monthly } = this.state.bundle || {};

    contentRegion.innerHTML = '';

    const grid = createElement('div', { className: 'summary-grid' });

    const dailyCard = createElement('div', { className: 'summary-card' });
    const dailyTitle = createElement('h2', { text: 'Daily summary' });
    const dailyBody = createElement('p', { text: JSON.stringify(daily || {}) });
    dailyCard.appendChild(dailyTitle);
    dailyCard.appendChild(dailyBody);

    const monthlyCard = createElement('div', { className: 'summary-card' });
    const monthlyTitle = createElement('h2', { text: 'Monthly summary' });
    const monthlyBody = createElement('p', { text: JSON.stringify(monthly || {}) });
    monthlyCard.appendChild(monthlyTitle);
    monthlyCard.appendChild(monthlyBody);

    grid.appendChild(dailyCard);
    grid.appendChild(monthlyCard);

    contentRegion.appendChild(grid);
  }
}
