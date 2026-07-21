// site.js: navigation animations, theme toggle, homepage variant toggle
(function(){
  // Theme toggle
  const themeToggle = () => {
    const current = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', current);
    const icon = document.getElementById('theme-icon');
    if(icon){
      icon.querySelector('use').setAttribute('xlink:href', current === 'dark' ? '/assets/icons/icons.svg#sun' : '/assets/icons/icons.svg#moon');
    }
  };
  // initialize
  if(!localStorage.getItem('site-theme')){
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('site-theme', prefersDark ? 'dark' : 'light');
  }
  themeToggle();
  document.getElementById('theme-toggle')?.addEventListener('click', function(){
    const next = (localStorage.getItem('site-theme') === 'dark') ? 'light' : 'dark';
    localStorage.setItem('site-theme', next);
    themeToggle();
  });

  // Homepage variant toggle (only affects index page)
  const homepageToggle = document.getElementById('homepage-toggle');
  const variantKey = 'home-variant';
  function applyHomeVariant(){
    const v = localStorage.getItem(variantKey) || 'default';
    document.querySelectorAll('.home-variant').forEach(el=>{
      if(el.dataset.variant === v){ el.classList.remove('hidden'); } else { el.classList.add('hidden'); }
    });
  }
  applyHomeVariant();
  homepageToggle?.addEventListener('click', function(){
    const cur = localStorage.getItem(variantKey) || 'default';
    const next = cur === 'default' ? 'alt' : 'default';
    localStorage.setItem(variantKey, next);
    // small animation
    document.querySelectorAll('.home-variant').forEach(el=>el.classList.add('fade-out'));
    setTimeout(()=>{ applyHomeVariant(); document.querySelectorAll('.home-variant').forEach(el=>el.classList.remove('fade-out')); }, 250);
  });

  // Simple PJAX: intercept internal links and animate main content
  const main = document.getElementById('main-content');
  const isSameOrigin = (url)=>{ try{ const u=new URL(url, location.href); return u.origin === location.origin; }catch(e){return false} }

  async function loadUrl(url, push=true){
    if(!isSameOrigin(url)) return location.href = url;
    try{
      main.classList.add('fade-out');
      const res = await fetch(url, {headers:{'X-Requested-With':'XMLHttpRequest'}});
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text,'text/html');
      const newMain = doc.getElementById('main-content');
      const newTitle = doc.querySelector('title')?.innerText || document.title;
      setTimeout(()=>{
        if(newMain){ main.innerHTML = newMain.innerHTML; }
        document.title = newTitle;
        window.scrollTo(0,0);
        main.classList.remove('fade-out');
        main.classList.add('fade-in');
        setTimeout(()=>main.classList.remove('fade-in'),300);
      },220);
      if(push) history.pushState({url}, '', url);
    }catch(err){ console.error('PJAX load failed', err); location.href = url; }
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    // ignore external links and anchors
    if(href.startsWith('#') || a.target === '_blank' || href.startsWith('mailto:')) return;
    const url = new URL(href, location.href);
    if(url.origin !== location.origin) return;
    // intercept only same-site pages
    e.preventDefault();
    loadUrl(url.href);
  });

  window.addEventListener('popstate', function(e){
    const url = document.location.href;
    loadUrl(url, false);
  });
})();
