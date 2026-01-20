document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth Scroll Setup
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 1. DATA CONFIGURATION ---
    // Configure your list here. The script will inject these names/roles into the HTML order.
    const membersConfig = [
        { name: "Rishi", roles: "Cast • Writer • Actor • Camera Man • Director" },
        { name: "Binam", roles: "Cast • Writer • Editor • Actor • Camera Man • Director" },
        { name: "Harman", roles: "Cast • Writer • Actor" },
        { name: "Deepak", roles: "Cast • Actor" },
        { name: "Amrik", roles: "Cast • Actor" },
        { name: "Jashan", roles: "Cast • Camera Man" },
        { name: "Dhruv", roles: "Cast • Actor" },
        { name: "Gurtej", roles: "Post Credit" },
        { name: "Jaskaran", roles: "Cast" }, // Added filler based on original HTML
        { name: "Unknown", roles: "Special Thanks" } // Filler for 10th card
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
    const teamInitials = gsap.utils.toArray(".team-member-name-initial h1");

    let animationContext;

    function initTeamAnimations() {
        if (animationContext) animationContext.revert(); // Cleanup old animation on resize

        animationContext = gsap.context(() => {
            
            // MOBILE ANIMATION (Simple Fade Up)
            if (window.innerWidth < 1000) {
                teamMembers.forEach((member) => {
                    gsap.from(member, {
                        y: 100,
                        opacity: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: member,
                            start: "top 85%",
                            end: "top 60%",
                            scrub: 1
                        }
                    });
                    
                    // Initial pops in
                    const initial = member.querySelector(".team-member-name-initial h1");
                    gsap.to(initial, {
                        scale: 1,
                        scrollTrigger: {
                            trigger: member,
                            start: "top 70%",
                            end: "top 50%",
                            scrub: 1
                        }
                    });
                });
                return; 
            }

            // DESKTOP ANIMATION (The "Files Leaked" Pin & Fly-in)
            
            // 1. Initial State: Hide cards and scale down initials
            gsap.set(teamMemberCards, { 
                x: "200%", // Push off screen to right
                rotation: 15,
                opacity: 0
            });
            gsap.set(teamInitials, { scale: 0 });

            // 2. Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: teamSection,
                    start: "top top", // Start when section hits top
                    end: "+=3000", // Length of scroll duration
                    pin: true,     // Hold the section in place
                    scrub: 1,      // Smooth scrubbing
                }
            });

            // Sequence:
            // A. Initials pop up slightly staggered
            tl.to(teamInitials, {
                scale: 1,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });

            // B. Cards fly in from right to cover initials
            tl.to(teamMemberCards, {
                x: "0%",       // Move to grid position
                rotation: 0,   // Straighten up
                opacity: 1,
                duration: 5,   // Duration relative to scroll length
                stagger: 0.2,  // One after another
                ease: "power3.out"
            }, "<0.5"); // Start slightly after initials start

            // C. Subtle hover effect scaling as you scroll past
            tl.to(teamMemberCards, {
                scale: 1.05,
                stagger: {
                    each: 0.2,
                    yoyo: true,
                    repeat: 1
                },
                duration: 1
            }, "<2");

        });
    }

    // Initialize
    initTeamAnimations();

    // Handle Resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initTeamAnimations();
            ScrollTrigger.refresh();
        }, 250);
    });
});
