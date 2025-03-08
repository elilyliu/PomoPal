import React, { useState, useEffect } from 'react';
// import './App.css'; // Assuming you have some basic styles

function App() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

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
                        return 5 * 60; // 5-minute break
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src="./icons/icons:icon128.jpg" className="App-logo" alt="logo" />
                <h1>PomoPal</h1>
                <div id="timer">{formatTime(timeLeft)}</div>
                <button id="start" onClick={handleStart}>Start</button>
                <button id="reset" onClick={handleReset}>Reset</button>
            </header>
        </div>
    );
}

export default App;