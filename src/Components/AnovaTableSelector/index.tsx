import React, { useState, createContext } from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';
import { StateProps, OneWayTreatment, OneWayObservation } from '../../Helpers/helper';

enum TableState {
    OneWayAnova, 
    TwoWayAnova
}

function AnovaTableSelector() {
    let [currTable, updateCurrTable] = useState(TableState.OneWayAnova);
    // One Way Anova State
    let [factorLevelsOW, updateFactorLevelsOW] = useState([] as OneWayTreatment[]);
    let [responseDataOW, updateResponseDataOW] = useState([] as OneWayObservation[]);
    let [anovaDataOW, updateAnovaDataOW] = useState();
    // Two Way Anova State
    

    function renderTable() {
        switch(currTable) {
            case TableState.OneWayAnova:
                return (
                    <OneWayAnovaTable factorLevels={{data: factorLevelsOW, update: updateFactorLevelsOW}} responseData={{data: responseDataOW, update: updateResponseDataOW}} anovaData={{data: anovaDataOW, update: updateAnovaDataOW}}/>
                );
            case TableState.TwoWayAnova:
                return (
                    <TwoWayAnovaTable />
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