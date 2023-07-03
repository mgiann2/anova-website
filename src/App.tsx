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
            <div className='main-content'>
                <h1>What is ANOVA?</h1>
                <p>ANOVA (short for Analysis of Variance) is a statistical test used to determine if there is a difference between the means of two or more groups. An example of a question an ANOVA test can answer is "Is there a difference in the price of apples between different grocery store brands?".</p>
                <h1>What are Factors, Levels, and Responses?</h1>
                <p>A factor is a categorical variable (a variable whose value is from a limited set) which is used to try to explain changes in the response. The response is a quantitative variable (a variable whose value is an amount). The different values a factor can be are called levels. From the example above, the factor is the grocery store brand, the levels are the specific grocery store brands used in the experiment (i.e.  Brand A, Brand B, Brand C, ...), and the response is the price of apples at a grocery store.</p>
                <h1>What is the difference between One-Way and Two-Way ANOVA?</h1>
                <p>One-Way ANOVA has only one factor while Two-Way ANOVA has two factors. Two-Way ANOVA is more complicated than One-Way ANOVA as not only are you testing if each factor has an effect on the response, you are also testing whether there is an interaction effect between the factors. The existence of an interaction effect means that the response depends on the first factor differently for different levels of the second factor, and vice versa.</p>
                <h1>What does df, SS and MS mean?</h1>
                <p>df is short for degrees of freedom, SS is short for sum of squares, and MS is short for mean squares.</p>
                <h1>What do a, b and N represent?</h1>
                <p>The variables a and b represent the number of levels for factors A and B respectively. The variable N represents the total sample size (number of observations).</p>
            </div>
        </div>
    );
}

export default App;
