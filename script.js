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

    document.querySelectorAll('.f-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
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

    /* ── PROJECT MODAL ─────────────────────────── */
    const modal      = document.getElementById('projModal');
    const modalBack  = modal.querySelector('.proj-modal-backdrop');
    const modalClose = modal.querySelector('.proj-modal-close');
    const galleryImg = document.getElementById('projGalleryImg');
    const thumbsWrap = document.getElementById('projGalleryThumbs');
    const prevBtn    = modal.querySelector('.proj-gallery-prev');
    const nextBtn    = modal.querySelector('.proj-gallery-next');
    const counter    = modal.querySelector('.proj-gallery-counter');
    const curEl      = document.getElementById('projImgCur');
    const totalEl    = document.getElementById('projImgTotal');
    const noteEl     = document.getElementById('projPlaceholderNote');

    let images = [], imgIndex = 0;

    function openModal(card) {
        const name  = card.dataset.name || card.querySelector('.card-name').textContent;
        const cat   = card.dataset.cat  || '';
        const desc  = card.dataset.desc || '';
        const year  = card.dataset.year || '';
        const imgs  = card.dataset.images ? card.dataset.images.split('|') : [];

        document.getElementById('projModalTitle').textContent = name;
        document.getElementById('projModalCat').textContent   = cat.replace('3d','Motion & 3D').replace('brand','Brand Design').replace('social','Social Media').replace('video','Video').replace('photo','Photography').replace('web','Web Design');
        document.getElementById('projModalDesc').textContent  = desc;
        document.getElementById('projModalYear').textContent  = year;

        images = imgs;
        imgIndex = 0;
        renderGallery(card);

        document.body.style.overflow = 'hidden';
        modal.classList.add('open');
    }

    function renderGallery(card) {
        thumbsWrap.innerHTML = '';

        if (images.length === 0) {
            /* Placeholder: use card gradient as background */
            const gradient = getComputedStyle(card.querySelector('.card-thumb')).backgroundImage;
            galleryImg.style.backgroundImage = gradient;
            galleryImg.style.backgroundSize  = 'cover';
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
            counter.classList.add('hidden');
            thumbsWrap.classList.add('hidden');
            noteEl.classList.add('visible');
        } else {
            noteEl.classList.remove('visible');
            setImage(0);
            images.forEach((src, i) => {
                const t = document.createElement('div');
                t.className = 'proj-thumb-item' + (i === 0 ? ' active' : '');
                t.style.backgroundImage = `url('${src}')`;
                t.addEventListener('click', () => setImage(i));
                thumbsWrap.appendChild(t);
            });
            thumbsWrap.classList.toggle('hidden', images.length < 2);
            counter.classList.toggle('hidden', images.length < 2);
            updateArrows();
        }
        totalEl.textContent = images.length || 1;
    }

    function setImage(i) {
        imgIndex = i;
        galleryImg.style.opacity = 0;
        setTimeout(() => {
            galleryImg.style.backgroundImage = `url('${images[i]}')`;
            galleryImg.style.opacity = 1;
        }, 150);
        curEl.textContent = i + 1;
        thumbsWrap.querySelectorAll('.proj-thumb-item').forEach((t, ti) =>
            t.classList.toggle('active', ti === i)
        );
        updateArrows();
    }

    function updateArrows() {
        prevBtn.classList.toggle('hidden', images.length < 2 || imgIndex === 0);
        nextBtn.classList.toggle('hidden', images.length < 2 || imgIndex === images.length - 1);
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        noteEl.classList.remove('visible');
    }

    prevBtn.addEventListener('click', () => imgIndex > 0 && setImage(imgIndex - 1));
    nextBtn.addEventListener('click', () => imgIndex < images.length - 1 && setImage(imgIndex + 1));
    modalClose.addEventListener('click', closeModal);
    modalBack.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* Wire up cards */
    document.querySelectorAll('.card').forEach(card => {
        if (card.dataset.cat === 'web') return; /* web opens external link */
        card.addEventListener('click', () => openModal(card));
    });
