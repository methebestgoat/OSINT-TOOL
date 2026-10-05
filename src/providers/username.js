const platforms = [
  { name: 'GitHub', base: 'https://github.com/' },
  { name: 'GitLab', base: 'https://gitlab.com/' },
  { name: 'Reddit', base: 'https://www.reddit.com/user/' },
  { name: 'X', base: 'https://x.com/' },
  { name: 'Keybase', base: 'https://keybase.io/' }
];

export async function usernameProvider(query) {
  return platforms.map((platform, index) => ({
    id: `username-${platform.name.toLowerCase()}`,
    title: `${platform.name} public profile check`,
    summary: `A public URL pattern is available for this identifier. Verify manually before attributing ownership.`,
    sourceUrl: `${platform.base}${encodeURIComponent(query)}`,
    sourceLabel: `${platform.name} public profile URL`,
    provider: 'Demo / public URL resolver',
    confidence: index === 0 ? 'Medium' : 'Low',
    confidenceReason: 'URL pattern only; no private or authenticated content was accessed.',
    status: 'Unverified lead',
    kind: 'profile'
  }));
}
