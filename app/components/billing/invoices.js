import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads }  from '@ember/object/computed';
import { A } from '@ember/array'

export default Component.extend({

  invoices: A([]),

  invoiceYears: computed('invoices.@each.createdAt', function () {
    return A(A(this.invoices.mapBy('year')).uniq()).sort((a, b) => b - a);
  }),

  year: reads('invoiceYears.firstObject'),

  selectedInvoices: computed('invoices.@each.createdAt', 'year', function () {
    return this.invoices.filterBy('year', this.year);
  }),
});
