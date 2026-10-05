const disposableDomains = new Set(['mailinator.com', '10minutemail.com', 'guerrillamail.com']);

export async function emailProvider(query) {
  const [, domain = ''] = query.split('@');
  const results = [{
    id: 'email-domain',
    title: `Domain association: ${domain || 'unknown'}`,
    summary: domain ? `The address uses the public domain ${domain}. Review the domain's published ownership, security, and abuse contacts.` : 'No domain was available for analysis.',
    sourceUrl: domain ? `https://${domain}` : 'https://www.icann.org/resources/pages/whois-lookup/en',
    sourceLabel: 'Public domain homepage',
    provider: 'Demo / domain context',
    confidence: domain ? 'Medium' : 'Low',
    confidenceReason: 'Derived from the user-supplied address; not an identity assertion.',
    status: 'Context signal',
    kind: 'domain'
  }];

  if (domain && disposableDomains.has(domain.toLowerCase())) {
    results.push({
      id: 'email-disposable',
      title: 'Disposable-mail domain indicator',
      summary: 'This domain appears in a local demo list of disposable-mail services. Treat as a routing characteristic, not proof of misuse.',
      sourceUrl: 'https://github.com/disposable-email-domains/disposable-email-domains',
      sourceLabel: 'Open-source disposable domain list',
      provider: 'Demo / local reference list',
      confidence: 'Medium',
      confidenceReason: 'List membership can change and does not identify a person.',
      status: 'Reference match',
      kind: 'risk'
    });
  }

  results.push({
    id: 'email-breach-placeholder',
    title: process.env.HIBP_API_KEY ? 'Breach-reference provider ready' : 'Breach-reference provider not configured',
    summary: process.env.HIBP_API_KEY ? 'A server-side Have I Been Pwned integration can be enabled here after reviewing terms, rate limits, and user authorization.' : 'Set HIBP_API_KEY on the server to connect a legitimate breach-notification API. Demo mode never claims a breach match.',
    sourceUrl: 'https://haveibeenpwned.com/API/v3',
    sourceLabel: 'Have I Been Pwned API documentation',
    provider: 'Optional / credential-gated placeholder',
    confidence: 'Informational',
    confidenceReason: 'No live breach lookup was executed in demo mode.',
    status: 'Not queried',
    kind: 'provider'
  });

  return results;
}
