import dotenv from 'dotenv';
dotenv.config();

class EnvConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getValue(key: string, throwMissing = true): string {
    const value = this.env[key];

    if (!value && throwMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value as string;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort(): string {
    return this.getValue('PORT', true);
  }

  public isProduction(): boolean {
    const mode = this.getValue('MODE', false);

    return mode !== 'DEV';
  }

  public getFrontendUrl(): string {
    return this.getValue('FRONTEND_URL', false);
  }

  public getOrigins(): string[] {
    try {
      return this.getValue('ALLOW_ORIGINS')
        .split(',')
        .map((origin) => origin.trim());
    } catch {
      return [];
    }
  }

  public getDBConfig() {
    return {
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
    };
  }

  public getJWTConfig() {
    return {
      AUTH_JWT_SECRET: this.getValue('AUTH_JWT_SECRET'),
      AUTH_TOKEN_COOKIE_NAME: this.getValue('AUTH_TOKEN_COOKIE_NAME'),
      AUTH_TOKEN_EXPIRED_TIME: this.getValue('AUTH_TOKEN_EXPIRED_TIME'),
      AUTH_TOKEN_EXPIRED_TIME_REMEMBER_ME: this.getValue(
        'AUTH_TOKEN_EXPIRED_TIME_REMEMBER_ME',
      ),
      AUTH_REFRESH_TOKEN_COOKIE_NAME: this.getValue(
        'AUTH_REFRESH_TOKEN_COOKIE_NAME',
      ),
      AUTH_REFRESH_TOKEN_EXPIRED_TIME: this.getValue(
        'AUTH_REFRESH_TOKEN_EXPIRED_TIME',
      ),
      AUTH_REFRESH_TOKEN_EXPIRED_TIME_REMEMBER_ME: this.getValue(
        'AUTH_REFRESH_TOKEN_EXPIRED_TIME_REMEMBER_ME',
      ),
    };
  }
}

const envConfigService = new EnvConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'ALLOW_ORIGINS',
  'MODE',
]);

export { envConfigService };
