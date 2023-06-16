import React, { useState, createContext } from 'react';
import './style.css';
import OneWayAnovaTable from './OneWayAnovaTable';
import TwoWayAnovaTable from './TwoWayAnovaTable';
import { StateProps, OneWayTreatment, OneWayObservation, TwoWayTreatment, TwoWayObservation, OneWayAnova } from '../../Helpers/helper';

enum TableState {
    OneWayAnova, 
    TwoWayAnova
}

function AnovaTableSelector() {
    let [currTable, updateCurrTable] = useState(TableState.OneWayAnova);
    // One Way Anova State
    let [factorLevelsOW, updateFactorLevelsOW] = useState([] as OneWayTreatment[]);
    let [responseDataOW, updateResponseDataOW] = useState([] as OneWayObservation[]);
    let [anovaDataOW, updateAnovaDataOW] = useState({dfA: null, dfE: null, SSA: null, SSE: null} as OneWayAnova);
    // Two Way Anova State
    let [factorALevelsTW, updateFactorALevelsTW] = useState([]);
    let [factorBLevelsTW, updateFactorBLevelsTW] = useState([]);
    let [treatmentsTW, updateTreatmentsTW] = useState([] as TwoWayTreatment[]);
    let [responseDataTW, updateResponseDataTW] = useState([] as TwoWayObservation[]);
    let [anovaDataTW, updateAnovaDataTW] = useState();
    

    function renderTable() {
        switch(currTable) {
            case TableState.OneWayAnova:
                return (
                    <OneWayAnovaTable factorLevels={{data: factorLevelsOW, update: updateFactorLevelsOW}} responseData={{data: responseDataOW, update: updateResponseDataOW}} anovaData={{data: anovaDataOW, update: updateAnovaDataOW}}/>
                );
            case TableState.TwoWayAnova:
                return (
                    <TwoWayAnovaTable factorALevels={{data: factorALevelsTW, update: updateFactorALevelsTW}} factorBLevels={{data: factorBLevelsTW, update: updateFactorBLevelsTW}} treatments={{data: treatmentsTW, update: updateTreatmentsTW}} responseData={{data: responseDataTW, update: updateResponseDataTW}} anovaData={{data: anovaDataTW, update: updateAnovaDataTW}}/>
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