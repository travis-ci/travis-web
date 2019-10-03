import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads }  from '@ember/object/computed';

export default Component.extend({

  invoices: null,

  invoiceYears: computed('invoices.@each.createdAt', function () {
    return this.invoices.mapBy('year').uniq().sort((a, b) => b - a);
  }),

  year: reads('invoiceYears.firstObject'),

  selectedInvoices: computed('invoices.@each.createdAt', 'year', function () {
    return this.invoices.filterBy('year', this.year);
  }),
});
