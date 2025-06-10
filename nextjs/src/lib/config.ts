function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}


export const config = {
  mongodb: {
    uri: getEnvVar('MONGODB_URI'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: '100m',
    /** in secondds */
    extendLimit: 60 * 60,  //60m
  },
  app: {
    url: getEnvVar('NEXTAUTH_URL', 'http://127.0.0.1:3005'),
    environment: getEnvVar('NODE_ENV', 'development'),
  },
} as const; // 'as const' makes it readonly


// Optional: Validate on startup
export function validateConfig() {
  try {
    // This will throw if any required env vars are missing
    config.mongodb.uri;
    config.jwt.secret;

    console.log('✅ Configuration validated successfully');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
}