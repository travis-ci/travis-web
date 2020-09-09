const currency = '$';

const plans = [
  {
    id: 'free_plan',
    private_credits: 10000,
    public_credits: 40000,
    users: 0,
    price: 0,
    name: 'Free',
    currency,
    is_enabled: true,
    is_default: false,
  },
  {
    id: 'standard_plan',
    private_credits: 25000,
    public_credits: 40000,
    users: 100,
    price: 3000,
    name: 'Standard',
    currency,
    is_enabled: true,
    is_default: true,
  },
  {
    id: 'pro_plan',
    private_credits: 500000,
    public_credits: 40000,
    users: 10000,
    price: 300000,
    name: 'Pro',
    currency,
    is_enabled: true,
    is_default: false,
  },
];

module.exports = { plans };
