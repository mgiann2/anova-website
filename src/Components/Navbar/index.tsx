import React from 'react';
import './style.css';

function Navbar() {
    return (
        <div className='navbar'>
            <div className='nav-left'>
                <h1 className='nav-title'> <span style={{color: "rgb(var(--main-color-dark))"}}>an</span>ova</h1>
            </div>
            <div className='nav-center'>
            </div>
            <div className='nav-right'>
                <a href="https://github.com/mgiann2/anova-website" className='github-link'>
                    <p>GITHUB</p>
                </a>
            </div>
        </div>
    );
}

export default Navbar;