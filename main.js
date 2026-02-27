import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const skipBtn = document.getElementById('skip-animation');
const navbar = document.getElementById('navbar');

const frameCount = 192;
const currentFrame = index => (
    `./frame_shots_png/frame_${(index + 1).toString().padStart(4, '0')}.png`
);

const images = [];
const airbnb = {
    frame: 0
};

const preloadImages = () => {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
};

preloadImages();

function render() {
    const img = images[airbnb.frame];
    if (!img || !img.complete) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
    }

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const ratio = Math.max(cw / imgWidth, ch / imgHeight);

    // Zoom 1.35x for watermark removal and scale
    const zoom = 1.35;
    const newWidth = imgWidth * ratio * zoom;
    const newHeight = imgHeight * ratio * zoom;

    const x = (cw - newWidth) / 2;
    const y = (ch - newHeight) / 2;

    // 1. Initial Pure Black foundation
    context.fillStyle = "#000000";
    context.fillRect(0, 0, cw, ch);

    // 2. Offscreen Rendering for Isolation
    // We create a temporary buffer for the glass isolate
    const buffer = document.createElement('canvas');
    buffer.width = cw;
    buffer.height = ch;
    const bctx = buffer.getContext('2d');

    // DRAW the frame with slightly crushed blacks for seamless matching
    bctx.filter = "brightness(0.9) contrast(1.1)";
    bctx.drawImage(img, x, y, newWidth, newHeight);

    // MASK extraction (Soft Feathering)
    // We use a destination-in gradient to erase the noisy background of the frame
    bctx.globalCompositeOperation = "destination-in";
    const mask = bctx.createRadialGradient(
        cw / 2, ch / 2, cw * 0.1,
        cw / 2, ch / 2, cw * 0.6
    );
    mask.addColorStop(0, "rgba(255, 255, 255, 1)");   // Opaque center
    mask.addColorStop(0.7, "rgba(255, 255, 255, 0.8)"); // Soft transition
    mask.addColorStop(1, "rgba(255, 255, 255, 0)");   // Transparent edge

    bctx.fillStyle = mask;
    bctx.fillRect(0, 0, cw, ch);

    // 3. Final Composite
    context.drawImage(buffer, 0, 0);

    // Add a dark vignette OVER the whole thing to multiply the black zones
    const vignette = context.createRadialGradient(
        cw / 2, ch / 2, cw * 0.2,
        cw / 2, ch / 2, cw * 0.8
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.4)");

    context.fillStyle = vignette;
    context.globalCompositeOperation = "multiply";
    context.fillRect(0, 0, cw, ch);
    context.globalCompositeOperation = "source-over";
}

const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=6000",
        scrub: 1.5,
        pin: true,
        onUpdate: render,
        onLeave: () => {
            gsap.to([canvas, ".hero-text-container"], { opacity: 0, duration: 1 });
        },
        onEnterBack: () => {
            gsap.to([canvas, ".hero-text-container"], { opacity: 1, duration: 1 });
        }
    }
});

mainTl.to(airbnb, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    duration: 10
}, 0);

mainTl.to(".hero-text-part.top", {
    opacity: 0.6,
    filter: "blur(0px)",
    duration: 4,
    ease: "power2.out"
}, 1.5);

mainTl.to(".hero-text-part.bottom", {
    opacity: 1,
    filter: "blur(0px)",
    duration: 4,
    ease: "power2.out"
}, 1.8);

images[0].onload = render;
window.addEventListener('resize', render);

skipBtn.addEventListener('click', () => {
    const scrollTrigger = ScrollTrigger.getAll().find(st => st.vars.trigger === "#hero");
    if (scrollTrigger) {
        window.scrollTo({
            top: scrollTrigger.end,
            behavior: 'smooth'
        });
    }
});

// Navbar scrolled state removed as it is now absolute

document.querySelectorAll('.reveal-text').forEach((text) => {
    gsap.to(text, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: text,
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });
});

// Parallax for Mastery Section
gsap.to(".parallax-img", {
    y: "20%",
    ease: "none",
    scrollTrigger: {
        trigger: ".mastery-parallax",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Navbar link smooth scroll
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        gsap.to(window, {
            duration: 1.5,
            scrollTo: targetId,
            ease: "power4.inOut"
        });
    });
});

// Mobile Menu Logic
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Floating animation for product cards
gsap.utils.toArray('.product-card').forEach((card, i) => {
    gsap.to(card, {
        y: 10,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
});

// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.3
        });
    }
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            gsap.to(follower, {
                scale: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                duration: 0.3
            });
        }
    });
    el.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
        }
    });
});
