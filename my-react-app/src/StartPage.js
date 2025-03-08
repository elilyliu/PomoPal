import React from 'react';
import { displayWorkAffirmation, displayBreakAffirmation } from './affirmations/palMessages';

const StartPage = () => {
    const startTimer25 = (25*60*1000) => {
        displayWorkAffirmation();
        setInterval(displayBreakAffirmation, 600000);
    };
    return (
        <div> 
            <h1>Welcome to PomoPal!</h1>
            <p>Select your work interval:</p>
            <button onClick={() => startTimer25}>25 min work, 5 min break</button>
            <button onClick={() => startTimer50}>50 min work, 10 min break</button>
        </div>
    );
};

export default StartPage;
