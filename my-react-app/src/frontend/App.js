import React, { useState, useEffect } from 'react';
import { workAffirmations, breakAffirmations } from '../affirmations/palMessages';


function App() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [message, setMessage] = useState('');
    const [workmode, setWorkmode] = useState(true);
    const [workInterval, setWorkInterval] = useState(25);
    const [breakInterval, setBreakInterval] = useState(5);
    const modeMessage = workmode ? 'Work mode' : 'Break mode';

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timer);
                        setIsRunning(false);
                        if (workmode) {
                            showBreakAffirmation();
                            setWorkmode(false);
                            setTimeLeft(breakInterval * 60); 
                        } else {
                            showWorkAffirmation();
                            setWorkmode(true);
                            setTimeLeft(workInterval * 60); 
                        }
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, workmode, workInterval, breakInterval]);

    useEffect(() => {
        if (isStarted) {
            const affirmationInterval = setInterval(() => {
                if (workmode) {
                    showWorkAffirmation();
                } else {
                    showBreakAffirmation();
                }
                
            }, 600000); // 10 minutes

            return () => clearInterval(affirmationInterval);
        }
    }, [isStarted, workmode]);

    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsStarted(true);
            if (workmode) {
                showWorkAffirmation();
            } else { 
                showBreakAffirmation();
            }  
        } 
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setIsStarted(false);
        setMessage('');
        setWorkmode(true);
    };

    const startTimer = (workMinutes, breakMinutes) => {
        setWorkInterval(workMinutes);
        setBreakInterval(breakMinutes);
        setTimeLeft(workMinutes * 60);
        handleStart();
    };

    const showWorkAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * workAffirmations.length);
        const affirmation = workAffirmations[randomIndex];
        setMessage(affirmation);
        setTimeout(() => {
            setMessage('');
        }, 10000); // Hide message after 10 seconds
    };

    const showBreakAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * breakAffirmations.length);
        const affirmation = breakAffirmations[randomIndex];
        setMessage(affirmation);
        setTimeout(() => {
            setMessage('');
        }, 60000); // Hide message after 10 seconds
    };


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>PomoPal</h1>
                {isStarted ? (
                    <>
                        <div id="workmode">{modeMessage}</div>
                        <div id="timer">{formatTime(timeLeft)}</div>
                        <button id="start" onClick={handleStart}>Start</button>
                        <button id="reset" onClick={handleReset}>Reset</button>
                    </>
                ) : (
                    <StartPage startTimer={startTimer} />
                )}
            </header>
            {message && (
                <div className="message-container">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

const StartPage = ({ startTimer }) => {
    return (
        <div>
            <h1>Welcome to PomoPal!</h1>
            <p>Select your work interval:</p>
            <button onClick={() => startTimer(0.2,0.1)}>25 min work, 5 min break</button>
            <button onClick={() => startTimer(50,10)}>50 min work, 10 min break</button>
        </div>
    );
};

export default App;