import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const ScrollReveal = ({ children, direction = 'up', delay = 0, duration = 800 }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        let translateY = 0;
                        let translateX = 0;

                        if (direction === 'up') translateY = [50, 0];
                        if (direction === 'down') translateY = [-50, 0];
                        if (direction === 'left') translateX = [50, 0];
                        if (direction === 'right') translateX = [-50, 0];

                        anime({
                            targets: el,
                            opacity: [0, 1],
                            translateY: translateY,
                            translateX: translateX,
                            easing: 'easeOutCubic',
                            duration: duration,
                            delay: delay
                        });

                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            // Set initial state
            sectionRef.current.style.opacity = 0;
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [direction, delay, duration]);

    return <div ref={sectionRef}>{children}</div>;
};

export default ScrollReveal;
