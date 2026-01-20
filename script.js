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

    function initTeamAnimations() {
        if (window.innerWidth < 1000) return;

        // PHASE 1: Vertical Entrance of Boxes
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                teamMembers.forEach((member, index) => {
                    const entranceDelay = 0.1;
                    const entranceDuration = 0.7;
                    const entranceStart = index * entranceDelay;
                    const entranceEnd = entranceStart + entranceDuration;

                    if (progress >= entranceStart && progress <= entranceEnd) {
                        const mProgress = (progress - entranceStart) / entranceDuration;
                        gsap.set(member, { y: `${125 - mProgress * 125}%` });
                        
                        const initial = member.querySelector(".team-member-name-initial h1");
                        const scaleProgress = Math.max(0, (mProgress - 0.4) / 0.6);
                        gsap.set(initial, { scale: scaleProgress });
                    } else if (progress > entranceEnd) {
                        gsap.set(member, { y: "0%" });
                        gsap.set(member.querySelector(".team-member-name-initial h1"), { scale: 1 });
                    }
                });
            },
        });

        // PHASE 2: Horizontal Slide In of Cards
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top top",
            end: `+=${window.innerHeight * 3.5}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                teamMemberCards.forEach((card, index) => {
                    const slideInStagger = 0.08;
                    const duration = 0.4;
                    const start = index * slideInStagger;
                    const end = start + duration;

                    if (progress >= start && progress <= end) {
                        const cardProgress = (progress - start) / duration;
                        const initialX = 300 - (index * 40); // Creates slightly different start positions
                        const slideX = initialX + cardProgress * (-50 - initialX);
                        const rotation = 20 - (cardProgress * 20);

                        gsap.set(card, {
                            xPercent: slideX,
                            x: 0,
                            rotation: rotation,
                        });
                    } else if (progress > end) {
                        gsap.set(card, { xPercent: -50, rotation: 0 });
                    }
                    
                    // Separate Scaling Logic
                    const scaleStart = 0.3;
                    if (progress >= scaleStart) {
                        const sProgress = Math.min(1, (progress - scaleStart) / 0.7);
                        gsap.set(card, { scale: 0.75 + (sProgress * 0.25) });
                    }
                });
            },
        });
    }

    initTeamAnimations();

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
