import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  invoiceYears: computed('invoices.@each.{createdAt}', function () {
    const invoiceYears = this.invoices.map(invoice => invoice.createdAt.getFullYear());
    const distinctInvoiceYears = new Set(invoiceYears);
    const sortedDistinctInvoiceYears = [...distinctInvoiceYears].sort((a, b) => b - a);
    return sortedDistinctInvoiceYears;
  }),

  price: computed('subscription.plan.price', function () {
    const price = this.get('subscription.plan.price');
    return `$${price / 100}`;
  }),

  year: computed('invoiceYears.[]', {
    get() {
      return this.invoiceYears.get('firstObject');
    },
    set(key, value) {
      return value;
    }
  }),

  selectedInvoices: computed('invoices.@each.{createdAt}', 'year', function () {
    return this.invoices.filter(invoice => invoice.createdAt.getFullYear() === this.year);
  }),
});
