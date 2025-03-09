import React, { useState, useEffect, useRef } from 'react';
import '../index.css'; // Ensure this import is correct

function App() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
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
        setTimeLeft(0);
        setIsStarted(false);
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

    useEffect(() => {
        const appElement = appRef.current;
        let isDragging = false;
        let offsetX, offsetY;

        const onMouseDown = (e) => {
            isDragging = true;
            offsetX = e.clientX - appElement.getBoundingClientRect().left;
            offsetY = e.clientY - appElement.getBoundingClientRect().top;
        };

        const onMouseMove = (e) => {
            if (isDragging) {
                appElement.style.left = `${e.clientX - offsetX}px`;
                appElement.style.top = `${e.clientY - offsetY}px`;
            }
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        appElement.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            appElement.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <div className="App" ref={appRef}> {/* Ensure the CSS class is applied here */}
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