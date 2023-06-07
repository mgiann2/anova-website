import React from 'react';
import './style.css';

function TwoWayAnovaTable() {
    return (
        <table>
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
    );   
}

export default TwoWayAnovaTable;