document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Smooth Scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 1. DATA CONFIG
    const membersConfig = [
        { name: "Rishi", roles: "Cast • Writer • Actor • Camera Man • Director" },
        { name: "Binam", roles: "Cast • Writer • Editor • Actor • Camera Man • Director" },
        { name: "Harman", roles: "Cast • Writer • Actor" },
        { name: "Deepak", roles: "Cast • Actor" },
        { name: "Amrik", roles: "Cast • Actor" },
        { name: "Jashan", roles: "Cast • Camera Man" },
        { name: "Dhruv", roles: "Cast • Actor" },
        { name: "Gurtej", roles: "Post Credit" },
        { name: "Jaskaran", roles: "Executive Producer" },
        { name: "Team", roles: "Production Crew" }
    ];

    // Populate Content
    const memberElements = document.querySelectorAll('.team-member');
    memberElements.forEach((member, index) => {
        if (membersConfig[index]) {
            const data = membersConfig[index];
            member.querySelector('.name-text').innerText = data.name;
            member.querySelector('.role-text').innerText = `( ${data.roles} )`;
            member.querySelector('.team-member-name-initial h1').innerText = data.name.charAt(0);
        }
    });

    const teamSection = document.querySelector(".team");
    const teamMembers = gsap.utils.toArray(".team-member");
    const teamMemberCards = gsap.utils.toArray(".team-member-card");

    function initAnimations() {
        if (window.innerWidth < 1000) return;

        // PHASE 1: Dashed Boxes rising from bottom
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                teamMembers.forEach((member, index) => {
                    const delay = index * 0.1;
                    const duration = 0.6;
                    const start = delay;
                    const end = start + duration;

                    if (progress >= start && progress <= end) {
                        const localProgress = (progress - start) / duration;
                        const yVal = 125 - (localProgress * 125);
                        gsap.set(member, { y: `${yVal}%` });
                        
                        const initial = member.querySelector(".team-member-name-initial h1");
                        const scaleVal = Math.max(0, (localProgress - 0.4) / 0.6);
                        gsap.set(initial, { scale: scaleVal });
                    } else if (progress > end) {
                        gsap.set(member, { y: "0%" });
                        gsap.set(member.querySelector(".team-member-name-initial h1"), { scale: 1 });
                    }
                });
            }
        });

        // PHASE 2: Cards Sliding In One by One
        ScrollTrigger.create({
            trigger: teamSection,
            start: "top top",
            end: `+=${window.innerHeight * 4}`, // Lengthened for 10 members
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                teamMemberCards.forEach((card, index) => {
                    const slideStagger = 0.07; // Speed between each card
                    const slideDuration = 0.3;
                    const start = index * slideStagger;
                    const end = start + slideDuration;

                    if (progress >= start && progress <= end) {
                        const cardProgress = (progress - start) / slideDuration;
                        
                        // Start from right (300%) to center (-50%)
                        const startX = 300 - (index * 40); 
                        const currentX = startX + cardProgress * (-50 - startX);
                        const currentRot = 20 - (cardProgress * 20);
                        const currentScale = 0.75 + (cardProgress * 0.25);

                        gsap.set(card, {
                            xPercent: currentX,
                            rotation: currentRot,
                            scale: currentScale,
                            opacity: 1
                        });
                    } else if (progress > end) {
                        gsap.set(card, { xPercent: -50, rotation: 0, scale: 1, opacity: 1 });
                    } else {
                        gsap.set(card, { opacity: 0 }); // Hide if not yet reached
                    }
                });
            }
        });
    }

    initAnimations();

    // Refresh on resize
    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
