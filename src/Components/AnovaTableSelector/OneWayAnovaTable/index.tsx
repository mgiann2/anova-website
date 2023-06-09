import React, { useState } from 'react';
import './style.css';
import { OneWayAnova, OneWayObservation, OneWayTreatment, StateProps, clamp, pf } from '../../../Helpers/helper';

function OneWayAnovaTable(props: {factorLevels: StateProps, responseData: StateProps, anovaData: StateProps}) {
    let [signifLevel, updateSignifLevel] = useState(0.05);

    function setSignifLevel(value: string) {
        updateSignifLevel(clamp(Number(value), 0.0001, 0.9999));
    }

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
        props.factorLevels.update(newFactorLevels);
    }

    function updateAmount(newAmount: number, index: number) {
        let newFactorLevels: OneWayTreatment[] = [...props.factorLevels.data];
        newFactorLevels[index].amount = Math.trunc(clamp(newAmount, 1, Number.MAX_SAFE_INTEGER));
        props.factorLevels.update(newFactorLevels);
    }

    function updateResponse(newValue: number, index: number) {
        let newObservations: OneWayObservation[] = [...props.responseData.data];
        newObservations[index].value = newValue;
        props.responseData.update(newObservations);
    }

    function updateResponseTable() {
        // validate factor levels
        let levels = [];
        let N = 0;
        for(let i = 0; i < props.factorLevels.data.length; i++) {
            let treatment: OneWayTreatment = props.factorLevels.data[i];
            N += treatment.amount;
            if (treatment.level === "") {
                alert("Please ensure that each level is not blank");
                return;
            }
            if (levels.includes(treatment.level)) {
                alert("Please ensure that each level is unique");
                return;
            }
            levels.push(treatment.level);
        }
        if (levels.length < 2) {
            alert("There must be at least two levels to perform an anova test");
            return;
        }
        if (N - levels.length <= 0) {
            alert("There must be more observations than levels to perform an anova test");
            return;
        }

        let newResponseData: OneWayObservation[] = [];
        props.factorLevels.data.forEach(treatment => {
            for(let i = 0; i < treatment.amount; i++) {
                newResponseData.push({level: treatment.level, value: null})
            }
        })
        props.responseData.update(newResponseData);
        props.anovaData.update({dfA: null, dfE: null, SSA: null, SSE: null} as OneWayAnova)
    }

    function performAnovaTest() {
        let responseData: OneWayObservation[] = props.responseData.data;
        // validate responseData
        for(let i = 0; i < responseData.length; i++) {
            if(responseData[i].value === null) {
                alert("Please ensure that each observation has a response value");
                return;
            }
        }

        // compute anova table values
        // initialize all anova calculation variables
        let grandMean = 0;
        let a = 0;
        let N = responseData.length;
        let dfA;
        let dfE;
        let SSA = 0;
        let SSE = 0;
        
        // setup data for computing SSA and SSE
        let dataMap = new Map<string, number[]>();
        responseData.forEach(obs => {
            grandMean += obs.value;

            if(dataMap.has(obs.level)) {
                dataMap.get(obs.level).push(obs.value);
            } else {
                a++;
                dataMap.set(obs.level, [obs.value]);
            }
        });
        dfA = a - 1;
        dfE = N - a;
        console.log(dfA);
        console.log(dfE)
        grandMean /= N;

        let sumSquareGroups = 0;
        for(let level of dataMap.keys()) {
            let groupMean = dataMap.get(level).reduce((acc, val) => acc + val, 0) / dataMap.get(level).length;
            sumSquareGroups += dataMap.get(level).length * (groupMean ** 2);
        }
        let sumSquareAll = responseData.reduce((acc, obs) => acc + (obs.value ** 2), 0);
        
        // compute SSA and SSE
        SSA = sumSquareGroups - N * (grandMean ** 2);
        SSE = sumSquareAll - sumSquareGroups;

        let newAnovaData = {dfA: dfA, dfE: dfE, SSA: SSA, SSE: SSE} as OneWayAnova;
        props.anovaData.update(newAnovaData);
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
                {props.responseData.data.map((obs, index) => (
                    <tr>
                        <td>{obs.level}</td>
                        <td><input type="number" className='table-input' placeholder='Input response value' value={obs.value} onChange={(e) => updateResponse(Number(e.target.value), index)}/></td>
                    </tr>
                ))}
            </>
        )
    }

    function renderAnovaTable() {
        if (props.anovaData.data.dfA === null) {
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

        let data: OneWayAnova = props.anovaData.data;
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
                    <td>{data.dfA}</td>
                    <td>{(data.SSA).toFixed(2)}</td>
                    <td>{(data.SSA / data.dfA).toFixed(2)}</td>
                    <td style={{borderBottom: "0"}}>{((data.SSA / data.dfA) / (data.SSE / data.dfE)).toFixed(2)}</td>
                </tr>
                <tr style={{height: "3em"}}>
                    <th>Error/Within</th>
                    <td>{data.dfE}</td>
                    <td>{(data.SSE).toFixed(2)}</td>
                    <td>{(data.SSE / data.dfE).toFixed(2)}</td>
                    <td style={{borderTop: "0"}}></td>
                </tr>
                <tr style={{height: "2em"}}>
                    <th>Total</th>
                    <td>{data.dfA + data.dfE}</td>
                    <td>{(data.SSA + data.SSE).toFixed(2)}</td>
                </tr>
            </table>
        )
    }

    function getConclusion() {
        if (props.anovaData.data.dfA === null) {
            return "";
        }
        let data: OneWayAnova = props.anovaData.data;
        let F = (data.SSA / data.dfA) / (data.SSE / data.dfE);
        let pValue = pf(F, data.dfA, data.dfE);

        if (pValue > signifLevel){
            return `Since the p-value (${pValue.toFixed(6)}) is greater than the significance level (${signifLevel}), we fail to reject the null hypotheis that the means of each treatment are equal.`
        }
        return `Since the p-value (${pValue.toFixed(6)}) is less than the significance level (${signifLevel}), we reject the null hypotheis and conclude that the means of each treatment are not equal.`;
    }

    function importFile(e: React.ChangeEvent<HTMLInputElement>) {
        let updateData = props.responseData.update;
        if (e.target.files.length === 0) {return}

        try {
            let file = e.target.files[0];
            let reader = new FileReader();
    
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    const contents = e.target?.result as string;
    
                let lines = contents.split("\n");
                lines = lines.filter(line => line !== "");
                let data = lines.map(x => x.split(","));
                let newObservations = data.map(obs => {
                    if (isNaN(Number(obs[1]))) { throw new Error("Not a number") }
                    if (obs[0] === "") { throw new Error("Level cannot be blank")}

                    return {level: obs[0], value: Number(obs[1])} as OneWayObservation
                });
                let N = newObservations.length;
                let levels = [...new Set(newObservations.map(x => x.level))];

                if (levels.length < 2) {
                    alert("There must be at least two levels to perform an anova test");
                    return;
                }
                if (N - levels.length <= 0) {
                    alert("There must be more observations than levels to perform an anova test");
                    return;
                }

                updateData(newObservations);
                } catch (error) {
                    alert("There was an error reading the file. Please ensure the file follows the correct format.");
                }
            }
    
            reader.readAsText(file);  
        } catch (error) {
            alert("There was an error reading the file. Please ensure the file follows the correct format.")
        }

        e.target.value = null;
    }

    return (
        <>
            <h2>Data</h2>
            <label htmlFor="signifLevel">Significance Level</label>
            <input type="number" step={0.001} min={0.001} max={0.999} name="Significance Level" id="signifLevel" value={signifLevel} onChange={(e) => setSignifLevel(e.target.value)}/>
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
                <button className='anova-btn' onClick={updateResponseTable}>Update Table</button>
            </div>
            <h3>Response Data</h3>
            <label htmlFor="dataFile">Import csv file</label>
            <input type="file" accept=".csv" name="Data File" id="dataFile" onChange={e => importFile(e)}/>
            <p style={{margin: "0.5em 0 1em 0", fontSize:"small", color:"rgb(var(--main-color-dark))"}}>* The uploaded csv file will only be accepted if it follows the same format as the table below. Do not include any header rows in the csv file.</p>
            <div style={{overflowY: "scroll", maxHeight: "300px"}}>
                <table>
                    <tr>
                        <th style={{width: "50%"}}>Factor Level</th>
                        <th style={{width: "50%"}}>Response</th>
                    </tr>
                    { renderResponseData() }
                </table>
            </div>
            <button className='anova-btn' onClick={performAnovaTest}>Perform Anova Test</button>
            <h2>Anova Table</h2>
            <div style={{overflowX: "scroll"}}>
                { renderAnovaTable() }
            </div>
            <h3>Conclusion</h3>
            <p>{ getConclusion() }</p>
        </>
    );   
}

export default OneWayAnovaTable;