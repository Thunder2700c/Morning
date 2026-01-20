document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const teamSection = document.querySelector(".team");
    const teamMembers = gsap.utils.toArray(".team-member");
    const teamMemberCards = gsap.utils.toArray(".team-member-card");

    function initAnimations() {
        if (window.innerWidth < 1000) return;

        // Phase 1: Dashed Boxes rise from floor
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                teamMembers.forEach((member, i) => {
                    const start = i * 0.08;
                    const end = start + 0.5;
                    if (p >= start && p <= end) {
                        const lp = (p - start) / 0.5;
                        gsap.set(member, { y: `${125 - lp * 125}%` });
                        gsap.set(member.querySelector("h1"), { scale: Math.max(0, (lp - 0.4) / 0.6) });
                    } else if (p > end) {
                        gsap.set(member, { y: "0%" });
                        gsap.set(member.querySelector("h1"), { scale: 1 });
                    }
                });
            }
        });

        // Phase 2: One-by-one Card Fly-in
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top top",
            end: `+=${window.innerHeight * 7}`, // Long scroll for 10 cards
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                teamMemberCards.forEach((card, i) => {
                    const stagger = 0.07;
                    const duration = 0.25;
                    const start = i * stagger;
                    const end = start + duration;

                    if (p >= start && p <= end) {
                        const lp = (p - start) / duration;
                        const startX = 400 - (i * 30);
                        gsap.set(card, {
                            xPercent: startX + lp * (-50 - startX),
                            rotation: 20 - (lp * 20),
                            scale: 0.7 + (lp * 0.3)
                        });
                    } else if (p > end) {
                        gsap.set(card, { xPercent: -50, rotation: 0, scale: 1 });
                    }
                });
            }
        });
    }

    initAnimations();
    window.addEventListener("resize", () => ScrollTrigger.refresh());
});
