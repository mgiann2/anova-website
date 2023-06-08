import React, { useState, createContext } from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';

const OneWayAnovaContext = createContext({});
const TwoWayAnovaContext = createContext({});

enum TableState {
    OneWayAnova, 
    TwoWayAnova
}

function AnovaTableSelector() {
    let [currTable, updateCurrTable] = useState(TableState.OneWayAnova);

    function renderTable() {
        switch(currTable) {
            case TableState.OneWayAnova:
                return (
                    <OneWayAnovaContext.Provider value={{}}>
                        <OneWayAnovaTable />
                    </OneWayAnovaContext.Provider>
                );
            case TableState.TwoWayAnova:
                return (
                    <TwoWayAnovaContext.Provider value={{}}>
                        <TwoWayAnovaTable />
                    </TwoWayAnovaContext.Provider>
                );
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