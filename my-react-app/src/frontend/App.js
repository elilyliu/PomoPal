import React, { useState, useEffect } from 'react';
import { workAffirmations, breakAffirmations } from '../affirmations/palMessages';
import workBunny from '../frontend/work-bunny.gif';
import breakBunny from '../frontend/break-bunny.GIF';
import '../index.css';

function App() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [message, setMessage] = useState('');
    const [workmode, setWorkmode] = useState(true);
    const [workInterval, setWorkInterval] = useState(25);
    const [breakInterval, setBreakInterval] = useState(5);
    const modeMessage = workmode ? 'Work mode' : 'Break mode';

    useEffect(() => {
        let timer;
        if (isRunning && !isPaused) {
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
    }, [isRunning, isPaused, workmode, workInterval, breakInterval]);

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
            setIsPaused(false);
            if (workmode) {
                showWorkAffirmation();
            } else {
                showBreakAffirmation();
            }
        }
            }
        } else if (isPaused) {
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setIsStarted(false);
        setIsPaused(false);
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
                {isStarted ? (
                    <>
                    <div className="timer-container">
                        <div id="workModeMessage">{modeMessage}</div>
                        <div id="timer">{formatTime(timeLeft)}</div>
                        <button id="startPause" onClick={isPaused ? handleStart : handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
                        <button id="reset" onClick={handleReset}>Reset</button>
                    </div>
                    </>
                ) : (
                    <StartPage startTimer={startTimer} />
                )}
            </header>
            {isStarted && (
                <div className="bunny-container">
                    <img
                        src={workmode ? workBunny : breakBunny}
                        alt="Bunny"
                        className="bunny-gif"
                    />
                </div>
            )}
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
            <h1 id="welcomeTitle">Welcome to PomoPal!</h1>
            <p>Select your work interval:</p>
            <button onClick={() => startTimer(25, 5)}>25 min work, 5 min break</button>
            <button onClick={() => startTimer(50, 10)}>50 min work, 10 min break</button>
        </div>
    );
};

export default App;