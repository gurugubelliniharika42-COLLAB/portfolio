const root = document.documentElement;
root.classList.add('js');

const themeBtn = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  themeMeta.setAttribute('content', theme === 'dark' ? '#0a0d1a' : '#f6f7fc');
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('theme');
} catch (e) {}

setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

const header = document.getElementById('header');
const progress = document.getElementById('progress');
const backToTop = document.getElementById('toTop');

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  header.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('show', y > 600);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const typedEl = document.getElementById('typed');
const roles = ['Full-Stack Developer', 'Web Developer', 'Team Leader', 'Quick Learner'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = roles[roleIndex];
  typedEl.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(typeLoop, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1500);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 45);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeLoop, 300);
  }
}

if (reduceMotion) {
  typedEl.textContent = roles[0];
} else {
  typeLoop();
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const step = Math.max(1, Math.ceil(target / 30));
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(target, value + step);
      el.textContent = value;
      if (value === target) clearInterval(timer);
    }, 40);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

const navLinks = document.querySelectorAll('.nav a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

document.querySelectorAll('.glow').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - rect.left + 'px');
    card.style.setProperty('--my', e.clientY - rect.top + 'px');
  });
});

const tabButtons = document.querySelectorAll('.tabs button');
const panels = document.querySelectorAll('.panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.toggle('on', b === btn));
    panels.forEach(p => p.classList.toggle('on', p.id === btn.dataset.tab));
  });
});

document.getElementById('loadPreview').addEventListener('click', () => {
  document.getElementById('frame').innerHTML = '<iframe src="https://vetnet-gamma.vercel.app/" title="VetNet live preview" loading="lazy"></iframe>';
});

const form = document.getElementById('contactForm');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent('Portfolio enquiry from ' + data.get('name'));
  const body = encodeURIComponent(data.get('message') + '\n\n' + data.get('name') + '\n' + data.get('email'));
  window.location.href = 'mailto:niharikagurugubelli86@gmail.com?subject=' + subject + '&body=' + body;
});

document.getElementById('year').textContent = new Date().getFullYear();