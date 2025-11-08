import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './GooeyNav.css';

const navItems = [
  { to: '/', label: 'Chat' },
  { to: '/dictionary', label: 'Dictionary' },
  { to: '/translate', label: 'Translate' },
  { to: '/history', label: 'History' },
];

const GooeyNav = () => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);
  const navItemsRef = useRef([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = navItems.findIndex(item => item.to === currentPath);

    if (activeIndex !== -1 && navItemsRef.current[activeIndex]) {
      const activeItem = navItemsRef.current[activeIndex];
      const navBoundingRect = navRef.current.getBoundingClientRect();
      const itemBoundingRect = activeItem.getBoundingClientRect();

      setIndicatorStyle({
        left: itemBoundingRect.left - navBoundingRect.left,
        width: itemBoundingRect.width,
      });
    }
  }, [location.pathname]);

  return (
    <>
      <nav className="gooey-nav" ref={navRef}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`gooey-nav-item ${location.pathname === item.to ? 'active' : ''}`}
            ref={el => navItemsRef.current[index] = el}
          >
            {item.label}
          </Link>
        ))}
        <div className="gooey-nav-indicator" style={indicatorStyle}></div>
      </nav>
      <svg className="gooey-svg" width="0" height="0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default GooeyNav;