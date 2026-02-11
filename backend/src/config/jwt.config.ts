import { envConfigService } from './env-config.service';

export default () => ({
  ...envConfigService.getJWTConfig(),
  isLive: false,
});
