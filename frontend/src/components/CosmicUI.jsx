import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export const CosmicSeparator = ({ width = '100%', color = 'var(--color-primary)' }) => {
    const lineRef = useRef(null);
    const starRef = useRef(null);

    useEffect(() => {
        anime({
            targets: lineRef.current,
            width: [0, width],
            opacity: [0, 0.5],
            easing: 'easeInOutQuad',
            duration: 1500
        });

        anime({
            targets: starRef.current,
            scale: [0, 1],
            opacity: [0, 1],
            rotate: '1turn',
            easing: 'easeOutElastic(1, .8)',
            duration: 2000,
            delay: 500
        });
    }, [width]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem 0', position: 'relative', height: '2px' }}>
            <div ref={lineRef} style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
            <div ref={starRef} style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: color,
                borderRadius: '50%',
                boxShadow: `0 0 10px 2px ${color}`,
                transform: 'rotate(45deg)'
            }} />
        </div>
    );
};

export const CornerBracket = ({ position = 'top-left', size = '20px', color = 'var(--color-primary)' }) => {
    const style = {
        position: 'absolute',
        width: size,
        height: size,
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: '0',
        transition: 'all 0.3s ease',
        pointerEvents: 'none'
    };

    if (position === 'top-left') {
        style.top = 0;
        style.left = 0;
        style.borderTopWidth = '2px';
        style.borderLeftWidth = '2px';
    } else if (position === 'top-right') {
        style.top = 0;
        style.right = 0;
        style.borderTopWidth = '2px';
        style.borderRightWidth = '2px';
    } else if (position === 'bottom-left') {
        style.bottom = 0;
        style.left = 0;
        style.borderBottomWidth = '2px';
        style.borderLeftWidth = '2px';
    } else if (position === 'bottom-right') {
        style.bottom = 0;
        style.right = 0;
        style.borderBottomWidth = '2px';
        style.borderRightWidth = '2px';
    }

    return <div className="cosmic-bracket" style={style} />;
};
