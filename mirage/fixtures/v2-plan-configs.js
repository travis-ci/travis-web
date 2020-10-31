export default [
  {
    id: 'free_tier_plan',
    name: 'Free Tier Plan',
    starting_price: 0,
    starting_users: 999999,
    private_credits: 10000,
    public_credits: 40000,
    addon_configs: [
      {
        id: 'oss_tier_credits',
        name: 'Free 40 000 credits (renewed monthly)',
        price: 0,
        quantity: 40000,
        type: 'credit_public'
      },
      {
        id: 'free_tier_credits',
        name: 'Free 10 000 credits (renewed monthly)',
        price: 0,
        quantity: 10000,
        type: 'credit_private'
      },
      {
        id: 'users_free',
        name: 'Unlimited users',
        price: 0,
        quantity: 999999,
        type: 'user_license'
      }
    ]
  },
  {
    id: 'standard_tier_plan',
    name: 'Standard Tier Plan',
    starting_price: 3000,
    starting_users: 100,
    private_credits: 25000,
    public_credits: 40000,
    addon_configs: [
      {
        id: 'oss_tier_credits',
        name: 'Free 40 000 credits (renewed monthly)',
        price: 0,
        quantity: 40000,
        type: 'credit_public'
      },
      {
        id: 'free_tier_credits',
        name: 'Free 10 000 credits (renewed monthly)',
        price: 0,
        quantity: 10000,
        type: 'credit_private'
      },
      {
        id: 'users_free',
        name: 'Unlimited users',
        price: 0,
        quantity: 999999,
        type: 'user_license'
      }
    ]
  },
  {
    id: 'pro_tier_plan',
    name: 'Pro Tier Plan',
    starting_price: 30000,
    starting_users: 10000,
    private_credits: 500000,
    public_credits: 40000,
    addon_configs: [
      {
        id: 'oss_tier_credits',
        name: 'Free 40 000 credits (renewed monthly)',
        price: 0,
        quantity: 40000,
        type: 'credit_public'
      },
      {
        id: 'free_tier_credits',
        name: 'Free 10 000 credits (renewed monthly)',
        price: 0,
        quantity: 10000,
        type: 'credit_private'
      },
      {
        id: 'users_free',
        name: 'Unlimited users',
        price: 0,
        quantity: 999999,
        type: 'user_license'
      }
    ]
  }
];
