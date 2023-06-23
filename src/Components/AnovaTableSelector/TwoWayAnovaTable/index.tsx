import React, { useState, useEffect } from 'react';
import './style.css';
import { StateProps, TwoWayAnova, TwoWayObservation, TwoWayTreatment, clamp, pf } from '../../../Helpers/helper';

function TwoWayAnovaTable(props: {factorALevels: StateProps, factorBLevels: StateProps, treatments: StateProps, responseData: StateProps, anovaData: StateProps}) {
    let [signifLevel, updateSignifLevel] = useState(0.05);

    useEffect(() => {
        let newTreatments: TwoWayTreatment[] = [];
        let aLevels: string[] = [...new Set<string>(props.factorALevels.data)];
        let bLevels: string[] = [...new Set<string>(props.factorBLevels.data)];
        if (aLevels.includes("")) {aLevels.splice(aLevels.indexOf(""))}
        if (bLevels.includes("")) {bLevels.splice(bLevels.indexOf(""))}

        aLevels.forEach(aLvl => bLevels.forEach(bLvl => newTreatments.push({levelA: aLvl, levelB: bLvl, amount: 1})))

        props.treatments.update(newTreatments)
    }, [props.factorALevels.data, props.factorBLevels.data])

    function setSignifLevel(value: string) {
        updateSignifLevel(clamp(Number(value), 0.0001, 0.9999));
    }

    function addLevel(data: string[], update) {
        let newLevels = [...data];
        newLevels.push("");
        update(newLevels);
    }

    function updateResponse(newValue: number, index: number) {
        let newObservations: TwoWayObservation[] = [...props.responseData.data];
        newObservations[index].value = newValue;
        props.responseData.update(newObservations);
    }

    function updateResponseTable() {
        let aLevels: string[] = [...new Set<string>(props.factorALevels.data)];
        let bLevels: string[] = [...new Set<string>(props.factorBLevels.data)];
        if (aLevels.includes("")) {aLevels.splice(aLevels.indexOf(""))}
        if (bLevels.includes("")) {bLevels.splice(bLevels.indexOf(""))}

        if (aLevels.length < 2 || bLevels.length < 2) {
            alert("There must be at least two levels per factor to perform an anova test");
            return;
        }

        let newResponseData: TwoWayObservation[] = [];
        props.treatments.data.forEach(treatment => {
            for(let i = 0; i < treatment.amount; i++) {
                newResponseData.push({levelA: treatment.levelA, levelB: treatment.levelB, value: null})
            }
        })

        if (newResponseData.length - aLevels.length * bLevels.length <= 0) {
            alert("There must be more observations than treatments to perform an anova test");
            return;
        }

        props.responseData.update(newResponseData);
        props.anovaData.update({dfA: null, dfB: null, dfAB: null, dfE: null, SSA: null, SSB: null, SSAB: null, SSE: null} as TwoWayAnova)
    }

    function renderFactorLevels(data: string[], update) {
        function removeLevel(index: number) {
            let newLevels = [...data];
            newLevels.splice(index, 1);
            update(newLevels);
        }

        function updateLevel(value: string, index: number) {
            let newLevels = [...data];
            newLevels[index] = value;
            update(newLevels);
        }

        return (
            <>
                {data.map((level, index) => (
                    <tr>
                        <td><input type="text" className='table-input' placeholder='Input level' onChange={e => updateLevel(e.target.value, index)} value={level}/></td>
                        <td className='delete-row-td'><button className='delete-row' onClick={() => removeLevel(index)}>X</button></td>
                    </tr>
                ))}
            </>
        )
    }

    function renderTreatments() {
        function updateAmount(amount: number, index: number) {
            let newTreatments: TwoWayTreatment[] = [...props.treatments.data];
            newTreatments[index].amount = Math.trunc(clamp(amount, 1, Number.MAX_SAFE_INTEGER));
            props.treatments.update(newTreatments);
        }

        let treatments: TwoWayTreatment[] = props.treatments.data;
        return (
            <>
                {treatments.map((treatment, index) => (
                    <tr>
                        <td>{treatment.levelA}</td>
                        <td>{treatment.levelB}</td>
                        <td><input type="number" className='table-input' placeholder='Input # of observations' onChange={e => updateAmount(Number(e.target.value), index)} value={treatment.amount}/></td>
                    </tr>
                ))}
            </>
        )
    }

    function renderResponseData() {
        return (
            <>
                {props.responseData.data.map((obs: TwoWayObservation, index) => (
                    <tr>
                        <td>{obs.levelA}</td>
                        <td>{obs.levelB}</td>
                        <td><input type="number" className='table-input' placeholder='Input response value' value={obs.value} onChange={(e) => updateResponse(Number(e.target.value), index)}/></td>
                    </tr>
                ))}
            </>
        )
    }

    function performAnovaTest() {
        let responseData: TwoWayObservation[] = props.responseData.data;
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
        let factorAMeans = new Map<string, number>();
        let factorBMeans = new Map<string, number>();
        let treatmentMeans = new Map<string, number>();
        let a = 0;
        let b = 0;
        let N = responseData.length;
        let dfA;
        let dfB;
        let dfAB;
        let dfE;
        let SSA = 0;
        let SSB = 0;
        let SSAB = 0;
        let SSE = 0;

        // organize data
        let factorAData = new Map<string, number[]>();
        let factorBData = new Map<string, number[]>();
        let treatmentData = new Map<string, number[]>();

        responseData.forEach(obs => {
            grandMean += obs.value;

            // factor A
            if (factorAData.has(obs.levelA)) {
                factorAData.get(obs.levelA).push(obs.value);
            } else {
                a++;
                factorAData.set(obs.levelA, [obs.value]);
            }

            // factor B
            if (factorBData.has(obs.levelB)) {
                factorBData.get(obs.levelB).push(obs.value);
            } else {
                b++;
                factorBData.set(obs.levelB, [obs.value]);
            }

            // treatment
            let treatment = [obs.levelA, obs.levelB];
            if (treatmentData.has(String(treatment))) {
                treatmentData.get(String(treatment)).push(obs.value);
            } else {
                treatmentData.set(String(treatment), [obs.value]);
            }
        }) 
        dfA = a - 1;
        dfB = b - 1;
        dfAB = (a - 1) * (b - 1);
        dfE = N - (a * b);
        grandMean /= N;

        // compute factor A means
        for(let level of factorAData.keys()) {
            let mean = factorAData.get(level).reduce((acc, val) => acc + val);
            mean /= factorAData.get(level).length;
            factorAMeans.set(level, mean);
        }

        // compute factor B means
        for(let level of factorBData.keys()) {
            let mean = factorBData.get(level).reduce((acc, val) => acc + val);
            mean /= factorBData.get(level).length;
            factorBMeans.set(level, mean);
        }

        // compute treatment means
        for(let treatment of treatmentData.keys()) {
            let mean = treatmentData.get(treatment).reduce((acc, val) => acc + val);
            mean /= treatmentData.get(treatment).length;
            treatmentMeans.set(treatment, mean);
        }

        // compute SSA
        for(let level of factorAData.keys()) {
            SSA += factorAData.get(level).length * (factorAMeans.get(level) - grandMean)**2 ;
        }

        // compute SSB
        for(let level of factorBData.keys()) {
            SSB += factorBData.get(level).length * (factorBMeans.get(level) - grandMean)**2 ;
        }

        // compute SSAB
        for(let treatment of treatmentData.keys()) {
            SSAB += treatmentData.get(treatment).length * (treatmentMeans.get(treatment) - factorAMeans.get(treatment.split(',')[0]) - factorBMeans.get(treatment.split(',')[1]) + grandMean)**2;
        }

        // commpute SSE
        let SST = 0;
        responseData.forEach(obs => SST += (obs.value - grandMean)**2);
        SSE = SST - SSA - SSB - SSAB;

        let newAnovaData = {dfA: dfA, dfB: dfB, dfAB: dfAB, dfE: dfE, SSA: SSA, SSB: SSB, SSAB: SSAB, SSE: SSE} as TwoWayAnova;
        props.anovaData.update(newAnovaData);
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
                    <tr style={{height: "2em"}}>
                        <th>Factor A</th>
                        <td>a-1</td>
                        <td>SSA</td>
                        <td>MSA</td>
                        <td style={{borderBottom: "0"}}>MSA/MSE</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Factor B</th>
                        <td>b-1</td>
                        <td>SSB</td>
                        <td>MSB</td>
                        <td style={{borderBottom: "0"}}>MSB/MSE</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Interaction</th>
                        <td>(a-1)(b-1)</td>
                        <td>SSAB</td>
                        <td>MSAB</td>
                        <td>MSAB/MSE</td>
                    </tr>
                    <tr style={{height: "3em"}}>
                        <th>Error</th>
                        <td>N-ab</td>
                        <td>SSE</td>
                        <td>MSE</td>
                        <td style={{border: "0"}}></td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Total</th>
                        <td>N-1</td>
                        <td>SST</td>
                    </tr>
                </table>
            )
        }

        let data = props.anovaData.data as TwoWayAnova;
        return (
            <table style={{minWidth: "700px"}}>
                    <tr style={{height: "2em"}}>
                        <th style={{width: "25%"}}>Source of Variation</th>
                        <th style={{width: "15%"}}>df</th>
                        <th style={{width: "20%"}}>SS</th>
                        <th style={{width: "20%"}}>MS</th>
                        <th style={{width: "20%"}}>F</th>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Factor A</th>
                        <td>{data.dfA}</td>
                        <td>{(data.SSA).toFixed(2)}</td>
                        <td>{(data.SSA / data.dfA).toFixed(2)}</td>
                        <td style={{borderBottom: "0"}}>{((data.SSA / data.dfA) / (data.SSE / data.dfE)).toFixed(2)}</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Factor B</th>
                        <td>{data.dfB}</td>
                        <td>{(data.SSB).toFixed(2)}</td>
                        <td>{(data.SSB / data.dfB).toFixed(2)}</td>
                        <td style={{borderBottom: "0"}}>{((data.SSB / data.dfB) / (data.SSE / data.dfE)).toFixed(2)}</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Interaction</th>
                        <td>{data.dfA * data.dfB}</td>
                        <td>{(data.SSAB).toFixed(2)}</td>
                        <td>{(data.SSAB / (data.dfA * data.dfB)).toFixed(2)}</td>
                        <td>{((data.SSAB / (data.dfA * data.dfB)) / (data.SSE / data.dfE)).toFixed(2)}</td>
                    </tr>
                    <tr style={{height: "3em"}}>
                        <th>Error</th>
                        <td>{data.dfE}</td>
                        <td>{(data.SSE).toFixed(2)}</td>
                        <td>{(data.SSE / data.dfE).toFixed(2)}</td>
                        <td style={{border: "0"}}></td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Total</th>
                        <td>{data.dfE + data.dfA + data.dfB + data.dfAB}</td>
                        <td>{(data.SSA + data.SSB + data.SSAB + data.SSE).toFixed(2)}</td>
                    </tr>
                </table>
        )
    }

    function getConclusions(): string[] {
        if (props.anovaData.data.dfA === null) {
            return [];
        }
        let conclusions = [];
        let data: TwoWayAnova = props.anovaData.data;

        // make conclusion about Factor A
        let F = (data.SSA / data.dfA) / (data.SSE / data.dfE);
        let pValue = pf(F, data.dfA, data.dfE);

        if (pValue > signifLevel){
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is greater than the significance level (${signifLevel}), we fail to reject the null hypotheis that the main effects of each level of factor A are equal. Hence, factor A does not have an effect on the response variable.`);
        } else {
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is less than the significance level (${signifLevel}), we reject the null hypotheis and conclude that the main effects of each level of factor A are not equal. Hence, factor A has an effect on the response variable.`);
        }

        // make conclusion about Factor B
        F = (data.SSB / data.dfB) / (data.SSE / data.dfE);
        pValue = pf(F, data.dfB, data.dfE);

        if (pValue > signifLevel){
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is greater than the significance level (${signifLevel}), we fail to reject the null hypotheis that the main effects of each level of factor B are equal. Hence, factor B does not have an effect on the response variable.`);
        } else{
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is less than the significance level (${signifLevel}), we reject the null hypotheis and conclude that the main effects of each level of factor B are not equal. Hence, factor B has an effect on the response variable.`);
        }

        // make conclusion about treatment
        F = (data.SSAB / data.dfAB) / (data.SSE / data.dfE);
        pValue = pf(F, data.dfAB, data.dfE);

        if (pValue > signifLevel){
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is greater than the significance level (${signifLevel}), we fail to reject the null hypotheis that all the interaction effects are equal to 0. Hence, there is no interaction effect.`);
        } else {
            conclusions.push(`Since the p-value (${pValue.toFixed(6)}) is less than the significance level (${signifLevel}), we reject the null hypotheis and conclude that at least one interaction effect is not equal to 0. Hence, there is an interaction effect.`);
        }

        return conclusions;
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
                    if (isNaN(Number(obs[2]))) { throw new Error("Not a number") }
                    if (obs[0] === "") { throw new Error("Level cannot be blank")}
                    if (obs[1] === "") { throw new Error("Level cannot be blank")}

                    return {levelA: obs[0], levelB: obs[1], value: Number(obs[2])} as TwoWayObservation
                });

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
            <label htmlFor="">Significance Level</label>
            <input type="number" step={0.001} min={0.001} max={0.999} name="Significance Level" id="signifLevel" value={signifLevel} onChange={(e) => setSignifLevel(e.target.value)}/>
            <div className='factor-tables'>
                <div>
                    <h3>Factor A Levels</h3>
                    <table>
                        <tr>
                            <th style={{width: "90%"}}>Level</th>
                            <th style={{width: "10%"}}>Delete</th>
                        </tr>
                        { renderFactorLevels(props.factorALevels.data, props.factorALevels.update) }
                    </table>
                    <button className='anova-btn' onClick={() => addLevel(props.factorALevels.data, props.factorALevels.update)}>Add Level</button>
                </div>
                <div>
                    <h3>Factor B Levels</h3>
                    <table>
                        <tr>
                            <th style={{width: "90%"}}>Level</th>
                            <th style={{width: "10%"}}>Delete</th>
                        </tr>
                        { renderFactorLevels(props.factorBLevels.data, props.factorBLevels.update) }
                    </table>
                    <button className='anova-btn' onClick={() => addLevel(props.factorBLevels.data, props.factorBLevels.update)}>Add Level</button>
                </div>
            </div>
            <div>
                <h3>Treatments</h3>
                <table>
                    <tr>
                        <th style={{width: "30%"}}>Factor A Level</th>
                        <th style={{width: "30%"}}>Factor B Level</th>
                        <th style={{width: "40%"}}>Number of Observations</th>
                    </tr>
                    { renderTreatments() }
                </table>
                <button className='anova-btn' onClick={updateResponseTable}>Update Table</button>
            </div>
            <h3>Response Data</h3>
            <label htmlFor="dataFile">Import csv file</label>
            <input type="file" accept=".csv" name="Data File" id="dataFile" onChange={e => importFile(e)}/>
            <p style={{margin: "0.5em 0 1em 0", fontSize:"small", color:"orange"}}>* The uploaded csv file will only be accepted if it follows the same format as the table below. Do not include any header rows in the csv file.</p>
            <div style={{overflowY: "scroll", maxHeight: "300px"}}>
                <table>
                    <tr>
                        <th style={{width: "30%"}}>Factor A Level</th>
                        <th style={{width: "30%"}}>Factor B Level</th>
                        <th style={{width: "40%"}}>Response</th>
                    </tr>
                    { renderResponseData() }
                </table>
            </div>
            <button className='anova-btn' onClick={performAnovaTest}>Perform Anova Test</button>
            <h2>Anova Table</h2>
            <div style={{overflowX: "scroll"}}>
                { renderAnovaTable() }
            </div>
            <h3>Conclusions</h3>
            { getConclusions().map(conclusion => (
                <p>{conclusion}</p>
            ))}
        </>
    );   
}

export default TwoWayAnovaTable;