const state = { type: 'username' };
const config = {
  username: { label: 'Public username', prefix: '@', placeholder: 'e.g. analyst_handle', hint: 'Letters, numbers, periods, underscores, and hyphens.' },
  email: { label: 'Email address', prefix: '✉', placeholder: 'e.g. researcher@example.org', hint: 'Use an address you are authorized to investigate.' },
  phone: { label: 'Phone number', prefix: '+', placeholder: 'e.g. 14155552671', hint: 'Prefer international E.164 format, such as +14155552671.' }
};
const $ = (selector) => document.querySelector(selector);
const input = $('#queryInput');

function setMode(type) {
  state.type = type;
  const item = config[type];
  document.querySelectorAll('.mode-tab').forEach((button) => {
    const active = button.dataset.type === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active);
  });
  $('#queryLabel').textContent = item.label;
  $('#inputPrefix').textContent = item.prefix;
  input.placeholder = item.placeholder;
  $('#queryHint').textContent = item.hint;
  input.value = '';
  input.focus();
}

document.querySelectorAll('.mode-tab').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.type)));

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
}

function renderResults(payload) {
  $('#resultsTitle').textContent = `${payload.type[0].toUpperCase()}${payload.type.slice(1)} signals`;
  $('#resultCount').textContent = `${payload.results.length} SIGNAL${payload.results.length === 1 ? '' : 'S'}`;
  $('#caseId').textContent = `OS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  $('#results').innerHTML = payload.results.map((result, index) => `<article class="result-card" style="animation-delay:${index * 55}ms"><div class="result-top"><span class="result-kind">${escapeHtml(result.kind || 'signal').toUpperCase()} / ${escapeHtml(result.status)}</span><span class="confidence">${escapeHtml(result.confidence)}</span></div><h4>${escapeHtml(result.title)}</h4><p class="result-summary">${escapeHtml(result.summary)}</p><div class="result-meta"><span><strong>Provider</strong> · ${escapeHtml(result.provider)}</span><span><strong>Confidence basis</strong> · ${escapeHtml(result.confidenceReason)}</span><a class="source-link" href="${escapeHtml(result.sourceUrl)}" target="_blank" rel="noopener noreferrer">↗ ${escapeHtml(result.sourceLabel)} · ${escapeHtml(result.sourceUrl)}</a></div></article>`).join('');
}

$('#searchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  $('#errorBox').hidden = true;
  $('#results').innerHTML = '<div class="loading">SCANNING DOCUMENTED PUBLIC SOURCES<span class="loading-dots"> ...</span></div>';
  $('#resultsTitle').textContent = 'Running query';
  $('#resultCount').textContent = '—';
  try {
    const response = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: state.type, query }) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'The search could not be completed.');
    renderResults(payload);
  } catch (error) {
    $('#results').innerHTML = '<div class="empty-state"><div class="empty-reticle">!</div><h3>No results loaded</h3><p>Review the message below and try again.</p></div>';
    $('#errorBox').textContent = `ERROR / ${error.message}`;
    $('#errorBox').hidden = false;
  }
});

function updateClock() { $('#clock').textContent = new Date().toISOString().slice(11, 19) + ' UTC'; }
updateClock();
setInterval(updateClock, 1000);
