import React, { useState, useEffect, useRef } from 'react';
import '../index.css'; // Ensure this import is correct
import workBunny from '../frontend/work-bunny.gif';
import breakBunny from '../frontend/break-bunny.GIF';

function App() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const appRef = useRef(null);

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
                        setIsBreak(!isBreak);
                        return isBreak ? 25 * 60 : 5 * 60; // Toggle between work and break times
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, isBreak]);

    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setIsStarted(false);
        setIsBreak(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = (minutes) => {
        setTimeLeft(minutes * 60);
        setIsStarted(true);
    };

    return (
        <div className="App" ref={appRef}> {/* Ensure the CSS class is applied here */}
            <div className="PomoPal-box">
                <header className="App-header">
                    <h1>PomoPal</h1>
                    {isStarted ? (
                        <>
                            <div id="timer">{formatTime(timeLeft)}</div>
                            <button id="start" onClick={handleStart}>Start</button>
                            <button id="reset" onClick={handleReset}>Reset</button>
                        </>
                    ) : (
                        <StartPage startTimer={startTimer} />
                    )}
                </header>
                {isStarted && (
                    <div className="bunny-container">
                        <img
                            src={isBreak ? breakBunny : workBunny}
                            alt="Bunny"
                            className="bunny-gif"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const StartPage = ({ startTimer }) => {
    return (
        <div>
            <h1>Welcome to PomoPal!</h1>
            <p>Select your work interval:</p>
            <button onClick={() => startTimer(25)}>25 min work, 5 min break</button>
            <button onClick={() => startTimer(50)}>50 min work, 10 min break</button>
        </div>
    );
};

export default App;