import React from 'react';
import './style.css';
import { OneWayTreatment, StateProps, clamp } from '../../../Helpers/helper';

function OneWayAnovaTable(props: {factorLevels: StateProps, responseData: StateProps, anovaData: StateProps}) {
    function addLevel() {
        let newFactorLevels: OneWayTreatment[] = [...props.factorLevels.data];
        newFactorLevels.push({level: "", amount: 1});
        props.factorLevels.update(newFactorLevels);
    }

    function removeLevel(index: number) {
        let newFactorLevels: OneWayTreatment[] = [...props.factorLevels.data];
        newFactorLevels.splice(index, 1);
        props.factorLevels.update(newFactorLevels);
    }

    function updateLevel(newLevel: string, index: number) {
        let newFactorLevels: OneWayTreatment[] = [...props.factorLevels.data];
        newFactorLevels[index].level = newLevel;
        console.log(newFactorLevels);
        props.factorLevels.update(newFactorLevels);
    }

    function updateAmount(newAmount: number, index: number) {
        let newFactorLevels: OneWayTreatment[] = [...props.factorLevels.data];
        newFactorLevels[index].amount = Math.trunc(clamp(newAmount, 1, Number.MAX_SAFE_INTEGER));
        console.log(newFactorLevels);
        props.factorLevels.update(newFactorLevels);
    }

    function renderFactorLevels() {
        return (
            <>
                {props.factorLevels.data.map((treatment, index) => (
                    <tr>
                        <td><input type="text" className='table-input' placeholder='Input level' onChange={(e) => {updateLevel(e.target.value, index)}} value={treatment.level}/></td>
                        <td><input type="number" className='table-input' placeholder='Input # of observations' onChange={(e) => {updateAmount(Number(e.target.value) , index)}} value={treatment.amount}/></td>
                        <td className='delete-row-td' onClick={() => removeLevel(index)}><button className='delete-row'>X</button></td>
                    </tr>
                ))}
            </>
        )
    }

    function renderResponseData() {
        return (
            <>
                {props.responseData.data.map(obs => (
                    <tr>
                        <td>{obs.level}</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/>{obs.value}</td>
                    </tr>
                ))}
            </>
        )
    }

    function renderAnovaTable() {
        return (
            <table style={{minWidth: "700px"}}>
                <tr style={{height: "2em"}}>
                    <th style={{width: "25%"}}>Source of Variation</th>
                    <th style={{width: "15%"}}>df</th>
                    <th style={{width: "20%"}}>SS</th>
                    <th style={{width: "20%"}}>MS</th>
                    <th style={{width: "20%"}}>F</th>
                </tr>
                <tr style={{height: "3em"}}>
                    <th>Treatment/Between</th>
                    <td>a-1</td>
                    <td>SSA</td>
                    <td>MSA</td>
                    <td style={{borderBottom: "0"}}>MSA/MSE</td>
                </tr>
                <tr style={{height: "3em"}}>
                    <th>Error/Within</th>
                    <td>N-a</td>
                    <td>SSE</td>
                    <td>MSE</td>
                    <td style={{borderTop: "0"}}></td>
                </tr>
                <tr style={{height: "2em"}}>
                    <th>Total</th>
                    <td>N-1</td>
                    <td>SST</td>
                </tr>
            </table>
        )
    }

    return (
        <>
            <h2>Data</h2>
            <h3>Factor Levels</h3>
            <div>
                <table>
                    <tr>
                        <th style={{width: "35%"}}>Level</th>
                        <th style={{width: "55%"}}>Number of Observations</th>
                        <th style={{width: "10%"}}>Delete</th>
                    </tr>
                    { renderFactorLevels() }
                </table>
                <button className='anova-btn' onClick={addLevel}>Add Level</button>
                <button className='anova-btn'>Update Table</button>
                <p style={{color: "red"}}></p>
            </div>
            <h3>Response Data</h3>
            <div style={{overflowY: "scroll"}}>
                <table>
                    <tr>
                        <th style={{width: "50%"}}>Factor Level</th>
                        <th style={{width: "50%"}}>Response</th>
                    </tr>
                    { renderResponseData() }
                </table>
            </div>
            <h2>Anova Table</h2>
            <div style={{overflowX: "scroll"}}>
                { renderAnovaTable() }
            </div>
        </>
    );   
}

export default OneWayAnovaTable;