import dotenv from 'dotenv';
dotenv.config();

type Environment = 'development' | 'production' | 'test';

// strict Environment checking
const allowedEnvironments = new Set<string>(['development', 'production', 'test']);
let currentEnv = process.env.NODE_ENV;

//when NODE_ENV is not defined then it will default to development
if (!currentEnv) {
    currentEnv = 'development';
    console.warn(' NODE_ENV is not defined. Defaulting to development');
}

//when NODE_ENV is not in allowed environments then it will default to development
if (!allowedEnvironments.has(currentEnv)) {
    console.warn(`Invalid environment: ${currentEnv}. Defaulting to development`);
    currentEnv = 'development';
}

//finally overwrite process.env.NODE_ENV
process.env.NODE_ENV = currentEnv;

// ==========================================
// 2. HELPER FUNCTION (For other variables)
// ==========================================
function requireEnvVar(envName: string): string {
    const val = process.env[envName];
    if (!val) {
        console.error(`💥 FATAL ERROR: ${envName} is missing in .env file!`);
        process.exit(1);
    }
    return val;
}

//checking all reuired variables
const DB_URI = requireEnvVar('DB_URI');
const JWT_SECRET = requireEnvVar('JWT_SECRET');
const JWT_REFRESH_SECRET = requireEnvVar('JWT_REFRESH_SECRET')

const ENV = Object.freeze({
    NODE_ENV: currentEnv as Environment,
    IS_DEVELOPMENT: currentEnv === 'development',
    IS_PRODUCTION: currentEnv === 'production',
    IS_TEST: currentEnv === 'test',
    PORT: process.env.PORT || 3000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DB_URI,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN : process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    CORS_ORIGIN: currentEnv === 'development' ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : [process.env.CORS_ORIGIN as string],
    //mail
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
} as const)

export default ENV;