import React, { useState, createContext } from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';
import { OneWayAnovaData, TwoWayAnovaData } from '../../Helpers/helper';

enum TableState {
    OneWayAnova, 
    TwoWayAnova
}

function AnovaTableSelector() {
    let [currTable, updateCurrTable] = useState(TableState.OneWayAnova);
    let [oneWayData, updateOneWayData] = useState(new OneWayAnovaData());
    let [twoWayData, updateTwoWayData] = useState(new TwoWayAnovaData());

    function renderTable() {
        switch(currTable) {
            case TableState.OneWayAnova:
                return (
                    <OneWayAnovaTable oneWay={{data: oneWayData, update: updateOneWayData}}/>
                );
            case TableState.TwoWayAnova:
                return (
                    <TwoWayAnovaTable twoWay={{data: twoWayData, update: updateTwoWayData}}/>
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