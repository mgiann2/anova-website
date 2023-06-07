import React from 'react';
import './style.css';
import { table } from 'console';

function OneWayAnovaTable() {
    return (
        <table>
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
    );   
}

export default OneWayAnovaTable;