const nav = document.getElementById('nav');
    addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

    const toggle = document.getElementById('toggle');
    const links  = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.classList.toggle('open', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
    }));

    document.querySelectorAll('.f-btn[data-f]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.f-btn[data-f]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.f;
            document.querySelectorAll('.card').forEach(c =>
                c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f)
            );
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            setTimeout(() => e.target.classList.add('vis'), i * 65);
            observer.unobserve(e.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* Animate skill bars when tools section enters view */
    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.tool-bar-fill').forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.w + '%';
                }, i * 80);
            });
            barObserver.unobserve(e.target);
        });
    }, { threshold: 0.15 });
    const toolsGrid = document.getElementById('toolsGrid');
    if (toolsGrid) barObserver.observe(toolsGrid);

    const phrases = ['Graphic Designer', 'reader of pretty covers', 'Social Media Creator', 'pixel perfectionist', 'Video Editor', 'dark chocolate lover', 'Photographer', 'Motion Designer'];
    let pi = 0, ci = 0, del = false;
    const twEl = document.getElementById('tw');
    function type() {
        const p = phrases[pi];
        if (!del) {
            twEl.textContent = p.slice(0, ci + 1); ci++;
            if (ci === p.length) { del = true; setTimeout(type, 1800); return; }
        } else {
            twEl.textContent = p.slice(0, ci - 1); ci--;
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(type, del ? 52 : 82);
    }
    type();

    /* Contact form — Formspree AJAX submit */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = contactForm.querySelector('.form-submit');
            const success = document.getElementById('formSuccess');
            btn.classList.add('sending');
            btn.querySelector('span').textContent = 'Sending...';
            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    contactForm.reset();
                    success.style.display = 'block';
                    btn.querySelector('span').textContent = 'Sent ✓';
                } else {
                    btn.querySelector('span').textContent = 'Error — try again';
                }
            } catch {
                btn.querySelector('span').textContent = 'Error — try again';
            }
            btn.classList.remove('sending');
        });
    }

// CV Popup
function openCV(file) {
    const overlay = document.getElementById('cv-overlay');
    const frame   = document.getElementById('cv-frame');
    const mobile  = document.getElementById('cv-mobile');
    const dl      = document.getElementById('cv-dl');

    document.getElementById('cv-title').textContent = file.includes('_EN') ? 'CV · English' : 'CV · Deutsch';
    dl.href = file;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 600;
    if (isMobile) {
        frame.style.display  = 'none';
        mobile.style.display = 'flex';
        document.getElementById('cv-mobile-open').href = file;
        document.getElementById('cv-mobile-dl').href  = file;
    } else {
        frame.style.display  = 'block';
        mobile.style.display = 'none';
        frame.src = file + '#view=FitH&toolbar=1';
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeCV() {
    document.getElementById('cv-overlay').style.display = 'none';
    document.getElementById('cv-frame').src = '';
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCV(); });
document.getElementById('cv-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeCV();
});
