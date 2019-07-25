/* eslint-env node */
'use strict';

const monthly = [
  {builds: 1, price: 6900, currency: 'USD', name: 'Bootstrap', description: 'Ideal for hobby projects'},
  {builds: 2, price: 12900, currency: 'USD', name: 'Startup', description: 'Best for small teams'},
  {builds: 5, price: 24900, currency: 'USD', name: 'Small_Business', description: 'Great for growing teams'},
  {builds: 10, price: 48900, currency: 'USD', name: 'Premium', description: 'Perfect for larger teams'}
];

const annual = [
  {builds: 1, price: 75900, currency: 'USD', name: 'Bootstrap', description: 'Ideal for hobby projects'},
  {builds: 2, price: 141900, currency: 'USD', name: 'Startup', description: 'Best for small teams'},
  {builds: 5, price: 273900, currency: 'USD', name: 'Small_Business', description: 'Great for growing teams'},
  {builds: 10, price: 537900, currency: 'USD', name: 'Premium', description: 'Perfect for larger teams'}
];

monthly.forEach(plan => {
  plan.monthlyPrice = plan.price;
  plan.monthlyPriceRounded = Math.round(plan.monthlyPrice / 100);
});

annual.forEach(plan => {
  plan.monthlyPrice = plan.price / 12;
  plan.monthlyPriceRounded = Math.round(plan.monthlyPrice / 100);
});

module.exports = { annual, monthly };
