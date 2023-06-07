import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import AnovaTableSelector from './Components/AnovaTableSelector';

function App() {
    return (
        <div>
            <Navbar />
            <div className='main-content'>
                <AnovaTableSelector />
            </div>
        </div>
    );
}

export default App;
