import React, { useEffect } from 'react';
import './style.css';
import { StateProps, TwoWayAnova, TwoWayObservation, TwoWayTreatment, clamp } from '../../../Helpers/helper';

function TwoWayAnovaTable(props: {factorALevels: StateProps, factorBLevels: StateProps, treatments: StateProps, responseData: StateProps, anovaData: StateProps}) {
    
    useEffect(() => {
        let newTreatments: TwoWayTreatment[] = [];
        let aLevels: string[] = [...new Set<string>(props.factorALevels.data)];
        let bLevels: string[] = [...new Set<string>(props.factorBLevels.data)];
        if (aLevels.includes("")) {aLevels.splice(aLevels.indexOf(""))}
        if (bLevels.includes("")) {bLevels.splice(bLevels.indexOf(""))}

        aLevels.forEach(aLvl => bLevels.forEach(bLvl => newTreatments.push({levelA: aLvl, levelB: bLvl, amount: 1})))

        props.treatments.update(newTreatments)
    }, [props.factorALevels.data, props.factorBLevels.data])

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
        let newResponseData: TwoWayObservation[] = [];
        props.treatments.data.forEach(treatment => {
            for(let i = 0; i < treatment.amount; i++) {
                newResponseData.push({levelA: treatment.levelA, levelB: treatment.levelB, value: null})
            }
        })
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
                        <td>{data.SSA}</td>
                        <td>{data.SSA / data.dfA}</td>
                        <td style={{borderBottom: "0"}}>{(data.SSA / data.dfA) / (data.SSE / data.dfE)}</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Factor B</th>
                        <td>{data.dfB}</td>
                        <td>{data.SSB}</td>
                        <td>{data.SSB / data.dfB}</td>
                        <td style={{borderBottom: "0"}}>{(data.SSB / data.dfB) / (data.SSE / data.dfE)}</td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Interaction</th>
                        <td>{data.dfA * data.dfB}</td>
                        <td>{data.SSAB}</td>
                        <td>{data.SSAB / (data.dfA * data.dfB)}</td>
                        <td>{(data.SSAB / (data.dfA * data.dfB)) / (data.SSE / data.dfE)}</td>
                    </tr>
                    <tr style={{height: "3em"}}>
                        <th>Error</th>
                        <td>{data.dfE}</td>
                        <td>{data.SSE}</td>
                        <td>{data.SSE / data.dfE}</td>
                        <td style={{border: "0"}}></td>
                    </tr>
                    <tr style={{height: "2em"}}>
                        <th>Total</th>
                        <td>{data.dfE + data.dfA + data.dfB + data.dfAB}</td>
                        <td>{data.SSA + data.SSB + data.SSAB + data.SSE}</td>
                    </tr>
                </table>
        )
    }
    
    return (
        <>
            <h2>Data</h2>
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
            <div style={{overflowY: "scroll", maxHeight: "300px"}}>
                <table>
                    <tr>
                        <th style={{width: "30%"}}>Factor A Level</th>
                        <th style={{width: "30%"}}>Factor B Level</th>
                        <th style={{width: "40%"}}>Response</th>
                    </tr>
                    { renderResponseData() }
                </table>
                <button className='anova-btn' onClick={performAnovaTest}>Perform Anova Test</button>
            </div>
            <h2>Anova Table</h2>
            <div style={{overflowX: "scroll"}}>
                { renderAnovaTable() }
            </div>
            
        </>
    );   
}

export default TwoWayAnovaTable;