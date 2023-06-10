import React from 'react';
import './style.css';
import { OneWayAnovaData, clamp } from '../../../Helpers/helper';

interface OneWayProps {
    data: OneWayAnovaData;
    update;
}

function OneWayAnovaTable(props: {oneWay: OneWayProps}) {

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
                    <tr>
                        <td><input type="text" className='table-input' placeholder='Input level'/></td>
                        <td><input type="number" className='table-input' placeholder='Input # of observations'/></td>
                        <td className='delete-row-td'><button className='delete-row'>X</button></td>
                    </tr>
                    <tr>
                        <td><input type="text" className='table-input' placeholder='Input level'/></td>
                        <td><input type="number" className='table-input' placeholder='Input # of observations'/></td>
                        <td className='delete-row-td'><button className='delete-row'>X</button></td>
                    </tr>
                </table>
                <button className='anova-btn'>Add Level</button>
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
                    <tr>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 1</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td><input type="number" className='table-input' placeholder='Input response value'/></td>
                    </tr>
                    <tr>
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
            </div>
        </>
    );   
}

export default OneWayAnovaTable;