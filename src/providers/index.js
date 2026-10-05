import { usernameProvider } from './username.js';
import { emailProvider } from './email.js';
import { phoneProvider } from './phone.js';

export const providers = {
  username: [usernameProvider],
  email: [emailProvider],
  phone: [phoneProvider]
};

export function isProviderConfigured(name) {
  return Boolean({
    hibp: process.env.HIBP_API_KEY,
    numverify: process.env.NUMVERIFY_API_KEY
  }[name]);
}
