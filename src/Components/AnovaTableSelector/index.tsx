import React from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';

function AnovaTableSelector() {
    return (
        <div className='grid-container'>
            <button className='selector-btn-selected'>One-Way Anova</button>
            <button className='selector-btn'>Two-Way Anova</button>
            <div className='anova-content'>
                <OneWayAnovaTable />
            </div>
        </div>
    );
}

export default AnovaTableSelector;