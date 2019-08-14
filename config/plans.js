const description = {
  bootstrap: 'Ideal for hobby projects',
  startup: 'Best for small teams',
  smallBusiness: 'Great for growing teams',
  premium: 'Perfect for larger teams',
};

const period = {
  monthly: 'monthly',
  annual: 'annual'
};

const currency = 'USD';

const plans = [
  {
    builds: 1,
    price: 6900,
    name: 'Bootstrap',
    period: period.monthly,
    currency,
    description: description.bootstrap,
    isEnabled: true,
    isDefault: false,
  },
  {
    builds: 2,
    price: 12900,
    name: 'Startup',
    period: period.monthly,
    currency,
    description: description.startup,
    isEnabled: true,
    isDefault: true,
  },
  {
    builds: 5,
    price: 24900,
    name: 'Small Business',
    period: period.monthly,
    currency,
    description: description.smallBusiness,
    isEnabled: true,
    isDefault: false,
  },
  {
    builds: 10,
    price: 48900,
    name: 'Premium',
    period: period.monthly,
    currency,
    description: description.premium,
    isEnabled: true,
    isDefault: false,
  },
  {
    builds: 1,
    price: 75900,
    name: 'Bootstrap',
    period: period.annual,
    currency,
    description: description.bootstrap,
    isEnabled: true,
    isDefault: false,
  },
  {
    builds: 2,
    price: 141900,
    name: 'Startup',
    period: period.annual,
    currency,
    description: description.startup,
    isEnabled: true,
    isDefault: true,
  },
  {
    builds: 5,
    price: 273900,
    name: 'Small Business',
    period: period.annual,
    currency,
    description: description.smallBusiness,
    isEnabled: true,
    isDefault: false,
  },
  {
    builds: 10,
    price: 537900,
    name: 'Premium',
    period: period.annual,
    currency,
    description: description.premium,
    isEnabled: true,
    isDefault: false,
  },
];

plans.forEach(plan => {
  const { monthly, annual } = period;
  if (plan.period === monthly) {
    plan.monthlyPrice = plan.price;
    plan.monthlyPriceRounded = Math.round(plan.monthlyPrice / 100);
  } else if (plan.period === annual) {
    plan.monthlyPrice = plan.price / 12;
    plan.monthlyPriceRounded = Math.round(plan.monthlyPrice / 100);
  }
});

module.exports = { plans };
