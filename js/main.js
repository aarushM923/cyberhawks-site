// Tabs + tiny UX niceties
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

window.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  $('#year').textContent = new Date().getFullYear();

  // Tabs
  const tabs = $$('.tab');
  const panels = $$('.panel');

  function activateTab(tab){
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panelId = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    panel.hidden = false;
    panel.classList.add('active');
    panel.focus?.();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      // Arrow key navigation
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') tabs[(idx+1) % tabs.length].focus();
      if (e.key === 'ArrowLeft') tabs[(idx-1+tabs.length) % tabs.length].focus();
      if (e.key === 'Enter' || e.key === ' ') activateTab(tab);
    });
  });

  // Optional: deep-link to a tab via hash (#ml, #cyber, etc.)
  const mapping = {
    '#competitive': 'tab-competitive',
    '#webgame': 'tab-webgame',
    '#ml': 'tab-ml',
    '#cyber': 'tab-cyber'
  };
  if (mapping[location.hash]) {
    activateTab(document.getElementById(mapping[location.hash]));
  }
});
