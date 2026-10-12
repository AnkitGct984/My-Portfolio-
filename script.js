// Portfolio interactions: reveal animations, active navigation, contact email and back-to-top.
document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(".animate");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    entry.target.style.animationPlayState = "running";
                    entry.target.style.opacity = "1";
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: "0px 0px -40px 0px", threshold: 0.12 });

        animatedElements.forEach((element) => {
            element.style.animationPlayState = "paused";
            element.style.opacity = "0";
            revealObserver.observe(element);
        });
    } else {
        animatedElements.forEach((element) => {
            element.style.opacity = "1";
            element.style.animationPlayState = "running";
        });
    }

    // Highlight the section currently being viewed.
    const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
    const sections = [...document.querySelectorAll("section[id]")];

    const setActiveLink = () => {
        const marker = window.scrollY + 150;
        let currentId = sections[0]?.id || "";

        sections.forEach((section) => {
            if (marker >= section.offsetTop) currentId = section.id;
        });

        navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    };

    // Show the floating up-arrow after the visitor scrolls down.
    const backToTop = document.getElementById("back-to-top");
    const updateBackToTop = () => {
        if (!backToTop) return;
        backToTop.classList.toggle("visible", window.scrollY > 380);
    };

    backToTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        setActiveLink();
        updateBackToTop();
    }, { passive: true });

    setActiveLink();
    updateBackToTop();

    // Subtle 3D portrait movement on larger screens only.
    const imageWrapper = document.querySelector(".image-wrapper");
    if (imageWrapper && window.matchMedia("(min-width: 993px)").matches) {
        imageWrapper.addEventListener("mousemove", (event) => {
            const rect = imageWrapper.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            imageWrapper.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
        });

        imageWrapper.addEventListener("mouseleave", () => {
            imageWrapper.style.transform = "";
        });
    }

    // Mailto form: works without a backend, by opening the visitor's email app.
    const contactForm = document.getElementById("contact-form");
    contactForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "Portfolio enquiry").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !subject || !message) {
            contactForm.reportValidity();
            return;
        }

        const body = `Hi Ankit,\n\n${message}\n\nRegards,\n${name}\nReply to: ${email}`;
        const mailto = `mailto:ankit43751@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    });

    // Keep the copyright year current.
    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();
});
