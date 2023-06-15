import React from 'react';
import './style.css';
import { StateProps } from '../../../Helpers/helper';

function TwoWayAnovaTable(props: {factorALevels: StateProps, factorBLevels: StateProps, treatments: StateProps, responseData: StateProps, anovaData: StateProps}) {
    
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

    function addLevel(data: string[], update) {
        let newLevels = [...data];
        newLevels.push("");
        update(newLevels);
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
                    <tr>
                        <td>Level 1</td>
                        <td>Level 1</td>
                        <td><input type="text" className='table-input' placeholder='Input # of observations'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td>Level 2</td>
                        <td><input type="text" className='table-input' placeholder='Input # of observations'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 1</td>
                        <td><input type="text" className='table-input' placeholder='Input # of observations'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 2</td>
                        <td><input type="text" className='table-input' placeholder='Input # of observations'/></td>
                    </tr>
                </table>
                <button className='anova-btn'>Update Table</button>
            </div>
            <h3>Response Data</h3>
            <div style={{overflowY: "scroll"}}>
                <table>
                    <tr>
                        <th style={{width: "30%"}}>Factor A Level</th>
                        <th style={{width: "30%"}}>Factor B Level</th>
                        <th style={{width: "40%"}}>Response</th>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                </table>
            </div>
            <h2>Anova Table</h2>
            <div style={{overflowX: "scroll"}}>
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
                        <td>N-a</td>
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
            </div>
            
        </>
    );   
}

export default TwoWayAnovaTable;