import React from 'react';

const Logo = ({ size = 28, className = "", style = {} }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ ...style }}>
            <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2))' }}
                >
                    <path
                        d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z"
                        stroke="url(#paint0_linear_logo)"
                        strokeWidth="4"
                    />
                    <path
                        d="M4 20H14M26 20H36"
                        stroke="url(#paint1_linear_logo)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="paint0_linear_logo" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366F1" />
                            <stop offset="1" stopColor="#A855F7" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_logo" x1="4" y1="20" x2="36" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366F1" />
                            <stop offset="1" stopColor="#A855F7" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <span style={{
                fontWeight: 900,
                fontSize: size * 0.7,
                letterSpacing: '-1px',
                background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
            }}>
                NexLink
            </span>
        </div>
    );
};

export default Logo;
