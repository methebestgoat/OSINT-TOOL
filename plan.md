# OSINT Scope — Implementation Plan

## Product direction
OSINT Scope is an analyst-style workspace for authorized security research, journalism, and legitimate investigations. It surfaces only provider responses that are public, lawful, and clearly labeled as demo or live integrations.

## Architecture
- `server.js`: Express entry point, security headers, CORS, rate limiting, validation, request logging, static serving, and `/api/search`.
- `src/search.js`: Normalizes queries and orchestrates provider modules.
- `src/providers/`: Modular provider contract. Demo providers return clearly marked public-source examples; optional API providers are stubs with server-side environment variable checks.
- `public/`: Static responsive UI with search mode selector, consent gate, result cards, source links, confidence badges, provider labels, and error states.

## Design system
- **Design movement:** terminal-inspired editorial dashboard; precise and calm rather than theatrical.
- **Core principles:** evidence before inference, high signal density, transparent provenance, and safe defaults.
- **Color philosophy:** ink/navy surfaces create focus, electric cyan marks active intelligence, and amber is reserved for caveats and confidence context.
- **Layout paradigm:** asymmetric two-column investigation desk with a slim operational rail and a flexible evidence canvas.
- **Signature elements:** scanline texture, bracketed section labels, and source provenance strips.
- **Interaction:** every action explains scope; results arrive with a deliberate “signal” reveal; empty states teach rather than decorate.
- **Typography:** system sans for legibility, monospace for identifiers, metadata, and operational copy.
- **Brand essence:** public-source intelligence without the black box. Personality: exacting, candid, restrained.
- **Voice:** “Trace what’s public. Verify what matters.” / “No private access. No shadow sources.”
- **Wordmark:** `OSINT` in a squared mono treatment with a cyan scope reticle.
- **Signature color:** electric cyan `#4DE6D1`.

## Safety boundaries
No authentication bypass, private-account access, credential collection, scraping of private information, illegal data sources, or claims that demo data is real. Provider output must include a source URL and confidence level. API keys are read only on the server.
