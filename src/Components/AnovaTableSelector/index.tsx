import React, { useState } from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';

enum TableState {
    OneWayAnova, 
    TwoWayAnova
}

function AnovaTableSelector() {
    let [currTable, updateCurrTable] = useState(TableState.OneWayAnova);

    function renderTable() {
        switch(currTable) {
            case TableState.OneWayAnova:
                return (<OneWayAnovaTable />);
            case TableState.TwoWayAnova:
                return (<TwoWayAnovaTable />);
        }
    }

    return (
        <div className='grid-container'>
            <button className={currTable === TableState.OneWayAnova ? 'selector-btn-selected' : 'selector-btn'} onClick={() => updateCurrTable(TableState.OneWayAnova)}>One-Way Anova</button>
            <button className={currTable === TableState.TwoWayAnova ? 'selector-btn-selected' : 'selector-btn'} onClick={() => updateCurrTable(TableState.TwoWayAnova)}>Two-Way Anova</button>
            <div className='anova-content'>
                { renderTable() }
            </div>
        </div>
    );
}

export default AnovaTableSelector;