document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const teamSection = document.querySelector(".team");
    const teamMembers = gsap.utils.toArray(".team-member");
    const teamMemberCards = gsap.utils.toArray(".team-member-card");

    function initAnimations() {
        if (window.innerWidth < 1000) return;

        // PHASE 1: Entrance of dashed boxes
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                teamMembers.forEach((member, index) => {
                    const delay = index * 0.08;
                    const duration = 0.5;
                    const start = delay;
                    const end = start + duration;

                    if (progress >= start && progress <= end) {
                        const localProgress = (progress - start) / duration;
                        gsap.set(member, { y: `${125 - localProgress * 125}%` });
                        
                        const initial = member.querySelector(".team-member-name-initial h1");
                        const scaleVal = Math.max(0, (localProgress - 0.3) / 0.7);
                        gsap.set(initial, { scale: scaleVal });
                    } else if (progress > end) {
                        gsap.set(member, { y: "0%" });
                        gsap.set(member.querySelector(".team-member-name-initial h1"), { scale: 1 });
                    }
                });
            }
        });

        // PHASE 2: Horizontal Fly-in Cards
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top top",
            end: `+=${window.innerHeight * 6}`, // Extra long for 10 people
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                
                teamMemberCards.forEach((card, index) => {
                    // Adjust timing so 10 cards spread across the scroll
                    const stagger = 0.07; 
                    const duration = 0.25;
                    const start = index * stagger;
                    const end = start + duration;

                    if (progress >= start && progress <= end) {
                        const localProgress = (progress - start) / duration;
                        
                        // Move from 400% (right) to -50% (center)
                        const startX = 400 - (index * 30); 
                        const currentX = startX + localProgress * (-50 - startX);
                        const currentRot = 25 - (localProgress * 25);
                        const currentScale = 0.7 + (localProgress * 0.3);

                        gsap.set(card, {
                            xPercent: currentX,
                            rotation: currentRot,
                            scale: currentScale
                        });
                    } else if (progress > end) {
                        gsap.set(card, { xPercent: -50, rotation: 0, scale: 1 });
                    }
                });
            }
        });
    }

    initAnimations();

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
