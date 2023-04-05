const dotenv = require('dotenv')

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/woofwatch-store";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Airwallex keys
const AIRWALLEX_CLIENT_ID = process.env.AIRWALLEX_CLIENT_ID;
const AIRWALLEX_API_KEY = process.env.AIRWALLEX_API_KEY;
const AIRWALLEX_API_ENDPOINT = "https://pci-api.airwallex.com";
// const AIRWALLEX_WEBHOOK_SECRET = "https://pci-api.airwallex.com";

// MXC ERC20 payment gateway keys
const MXC_CLIENT_ID = process.env.MXC_CLIENT_ID;
const MXC_SECRET_KEY = process.env.MXC_SECRET_KEY;
const MXC_API_ENDPOINT = process.env.MXC_API_ENDPOINT || "http://localhost:3000";
// const AIRWALLEX_WEBHOOK_SECRET = "https://pci-api.airwallex.com";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  // Uncomment to add Stripe support.
  // You can create a Stripe account via: https://stripe.com
  // {
  //   resolve: `medusa-payment-stripe`,
  //   options: {
  //     api_key: STRIPE_API_KEY,
  //     webhook_secret: STRIPE_WEBHOOK_SECRET,
  //   },
  // },
  // Uncomment to add airwallex support.
  // You can create a airwallex account via: https://airwallex.com
  // {
  //   resolve: `medusa-payment-airwallex`,
  //   options: {
  //     apiKey: AIRWALLEX_API_KEY,
  //     clientId: AIRWALLEX_CLIENT_ID,
  //     capture: false,
  //     apiEndpoint: AIRWALLEX_API_ENDPOINT,
  //     // webhookSecret: AIRWALLEX_WEBHOOK_SECRET
  //   },
  // },
  {
    resolve: `medusa-payment-mxc`,
    options: {
      clientId: MXC_CLIENT_ID,
      secretKey: MXC_SECRET_KEY,
      capture: true,
      apiEndpoint: MXC_API_ENDPOINT,
      // webhookSecret: AIRWALLEX_WEBHOOK_SECRET
    },
  },
];
/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    // database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
