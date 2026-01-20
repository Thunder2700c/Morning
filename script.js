document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth Scroll Setup
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 1. DATA CONFIGURATION (Updated Roles) ---
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

    // Inject Data into HTML
    const memberElements = document.querySelectorAll('.team-member');
    memberElements.forEach((member, index) => {
        if (membersConfig[index]) {
            const data = membersConfig[index];
            const nameEl = member.querySelector('.name-text');
            const roleEl = member.querySelector('.role-text');
            const initialEl = member.querySelector('.team-member-name-initial h1');

            if (nameEl) nameEl.innerHTML = `${data.name}`;
            if (roleEl) roleEl.innerText = `( ${data.roles} )`;
            if (initialEl) initialEl.innerText = data.name.charAt(0);
        }
    });

    // --- 2. ANIMATION LOGIC ---
    const teamSection = document.querySelector(".team");
    const teamMembers = gsap.utils.toArray(".team-member");
    const teamMemberCards = gsap.utils.toArray(".team-member-card");

    let animationContext;

    function initTeamAnimations() {
        if (animationContext) animationContext.revert();

        animationContext = gsap.context(() => {
            
            // --- MOBILE ANIMATION ---
            if (window.innerWidth < 1000) {
                teamMembers.forEach((member) => {
                    gsap.set(member, { clearProps: "all" });
                    gsap.set(member.querySelector(".team-member-card"), { opacity: 1 });
                    gsap.set(member.querySelector(".team-member-name-initial h1"), { scale: 1 });
                    
                    gsap.from(member, {
                        y: 100,
                        opacity: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: member,
                            start: "top 85%"
                        }
                    });
                });
                return; 
            }

            // --- DESKTOP ANIMATION (The "Original" Style) ---

            // PHASE 1: Vertical Entrance (Initials rise up before section pins)
            ScrollTrigger.create({
                trigger: teamSection,
                start: "top bottom", 
                end: "top top",      
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    teamMembers.forEach((member, index) => {
                        const stagger = 0.05; 
                        const duration = 1 - (teamMembers.length * stagger); 
                        const start = index * stagger;
                        
                        let localProgress = (progress - start) / duration;
                        localProgress = Math.min(Math.max(localProgress, 0), 1);

                        // Move from 125% down to 0%
                        const entranceY = 125 - (localProgress * 125);
                        gsap.set(member, { y: `${entranceY}%` });

                        // Scale the Letter from 0 to 1
                        const initial = member.querySelector(".team-member-name-initial h1");
                        gsap.set(initial, { scale: localProgress });
                    });
                }
            });

            // PHASE 2: Horizontal Fly-In (Section pins and cards fly from right)
            ScrollTrigger.create({
                trigger: teamSection,
                start: "top top",
                end: "+=4000", 
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    teamMemberCards.forEach((card, index) => {
                        const slideInStagger = 0.08;
                        const duration = 0.3;
                        const start = index * slideInStagger;
                        const end = start + duration;

                        if (progress < start) {
                            gsap.set(card, { 
                                xPercent: 300, 
                                yPercent: -50, 
                                rotation: 20, 
                                scale: 0.75,
                                opacity: 0 
                            });
                        } else if (progress >= start && progress <= end) {
                            const localProgress = (progress - start) / duration;
                            
                            const currentX = 300 + localProgress * (-50 - 300);
                            const currentRot = 20 - (localProgress * 20);
                            const currentScale = 0.75 + (localProgress * 0.25);

                            gsap.set(card, {
                                xPercent: currentX,
                                yPercent: -50,
                                rotation: currentRot,
                                scale: currentScale,
                                opacity: 1
                            });
                        } else {
                            gsap.set(card, {
                                xPercent: -50,
                                yPercent: -50,
                                rotation: 0,
                                scale: 1,
                                opacity: 1
                            });
                        }
                    });
                }
            });
        });
    }

    // Handle Window Resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initTeamAnimations();
            ScrollTrigger.refresh();
        }, 250);
    });

    initTeamAnimations();
});
