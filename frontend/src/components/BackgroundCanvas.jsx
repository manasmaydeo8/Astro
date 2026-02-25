import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const zodiacIcons = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const BackgroundCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let icons = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createStars(); // Recreate on resize to fill screen
            createIcons();
            createIcons();
        };

        const createStars = () => {
            stars = [];
            const starCount = Math.floor(window.innerWidth / 15); // Dynamic star count based on width
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.2 + 0.05
                });
            }
        };

        const createIcons = () => {
            icons = [];
            for (let i = 0; i < 6; i++) { // Few floating icons
                icons.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    text: zodiacIcons[Math.floor(Math.random() * zodiacIcons.length)],
                    size: Math.random() * 20 + 20, // 20px to 40px
                    alpha: 0, // Start invisible, fade in
                    dx: (Math.random() - 0.5) * 0.5,
                    dy: (Math.random() - 0.5) * 0.5,
                    rotation: Math.random() * 360
                });
            }
        };



        const draw = () => {
            ctx.clearRect(0, 0, width, height);



            // Draw Stars and Constellation Lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                // Draw Star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < stars.length; j++) {
                    const otherStar = stars[j];
                    const dist = Math.hypot(star.x - otherStar.x, star.y - otherStar.y);
                    if (dist < 100) { // Connect if close
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(otherStar.x, otherStar.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                }
            }

            // Draw Floating Icons
            icons.forEach(icon => {
                ctx.save();
                ctx.translate(icon.x, icon.y);
                ctx.rotate(icon.rotation * Math.PI / 180);
                ctx.fillStyle = `rgba(167, 139, 250, ${icon.alpha * 0.15})`; // Low opacity, purple tint
                ctx.font = `${icon.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(icon.text, 0, 0);
                ctx.restore();
            });
        };

        const animate = () => {
            // Update Stars
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < -10) {
                    star.y = height + 10;
                    star.x = Math.random() * width;
                }
            });

            // Update Icons
            icons.forEach(icon => {
                icon.x += icon.dx;
                icon.y += icon.dy;
                icon.rotation += 0.1;

                // Bounce off edges (wrap around is better for this calmness)
                if (icon.x < -50) icon.x = width + 50;
                if (icon.x > width + 50) icon.x = -50;
                if (icon.y < -50) icon.y = height + 50;
                if (icon.y > height + 50) icon.y = -50;
            });



            draw();
            requestAnimationFrame(animate);
        };

        const initAnimation = () => {
            // Animate Icons fading in
            anime({
                targets: icons,
                alpha: [0, 1],
                duration: 3000,
                easing: 'linear',
                delay: anime.stagger(200)
            });
        }

        resize();
        // createStars and createIcons called in resize
        requestAnimationFrame(animate);
        initAnimation();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)' }} />;
};

export default BackgroundCanvas;
