import Component from '@ember/component';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({

  invoiceYears: computed('invoices.@each.{createdAt}', function () {
    const invoiceYears = this.invoices.map(invoice => invoice.createdAt.getFullYear());
    const distinctInvoiceYears = new Set(invoiceYears);
    const sortedDistinctInvoiceYears = [...distinctInvoiceYears].sort((a, b) => b - a);
    return A(sortedDistinctInvoiceYears);
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
  })
});
