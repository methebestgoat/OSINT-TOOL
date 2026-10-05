const countryPrefixes = [
  ['+1', 'North America', 'NANP'], ['+44', 'United Kingdom', 'UK carriers'], ['+61', 'Australia', 'Australian carriers'],
  ['+81', 'Japan', 'Japanese carriers'], ['+91', 'India', 'Indian carriers'], ['+49', 'Germany', 'German carriers'],
  ['+33', 'France', 'French carriers'], ['+55', 'Brazil', 'Brazilian carriers']
];

export async function phoneProvider(query) {
  const prefix = countryPrefixes.find(([code]) => query.startsWith(code));
  const [code, region, carrierContext] = prefix || ['Unknown', 'Unknown region', 'No carrier context'];
  return [
    {
      id: 'phone-region',
      title: `Likely region: ${region}`,
      summary: prefix ? `The country calling code ${code} maps to ${region}. Calling codes do not prove current location or subscriber identity.` : 'No supported calling code was recognized. Use E.164 format, for example +14155552671.',
      sourceUrl: 'https://www.itu.int/en/ITU-T/inr/Pages/default.aspx',
      sourceLabel: 'ITU-T international numbering resources',
      provider: 'Demo / public numbering reference',
      confidence: prefix ? 'Medium' : 'Low',
      confidenceReason: 'Calling-code inference only; no subscriber data was accessed.',
      status: prefix ? 'Reference match' : 'Needs review',
      kind: 'numbering'
    },
    {
      id: 'phone-carrier-placeholder',
      title: process.env.NUMVERIFY_API_KEY ? 'Carrier lookup provider ready' : 'Carrier lookup provider not configured',
      summary: process.env.NUMVERIFY_API_KEY ? `A server-side lookup can be enabled for ${carrierContext}; validate provider terms before production use.` : 'Set NUMVERIFY_API_KEY on the server to connect a lawful phone-metadata provider. Demo mode does not guess carrier or subscriber identity.',
      sourceUrl: 'https://numverify.com/documentation',
      sourceLabel: 'Numverify API documentation',
      provider: 'Optional / credential-gated placeholder',
      confidence: 'Informational',
      confidenceReason: 'No live carrier lookup was executed in demo mode.',
      status: 'Not queried',
      kind: 'provider'
    }
  ];
}
