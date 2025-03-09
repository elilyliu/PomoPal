import React, { useState, useEffect, useRef, useCallback } from 'react';
import { workAffirmations, breakAffirmations } from './palMessages';
import bunnySleep from './images/bunnySleep.gif';
import bunnyWork from './images/bunnyWork.gif';
import alarmSound from './audio/A alarm clock.mp3';
import logo from './icons/logo.png';



function App() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [message, setMessage] = useState('');
    const [workmode, setWorkmode] = useState(true);
    const [workInterval, setWorkInterval] = useState(25);
    const [breakInterval, setBreakInterval] = useState(5);
    const [isFlashing, setIsFlashing] = useState(false); 
    const affirmationIntervalRef = useRef(null);
    const modeMessage = workmode ? 'Work mode' : 'Break mode';
    const alarmRef = useRef(null);


    const handleTimerEnd = useCallback(() => {
        setIsFlashing(true); // Start flashing effect
        playAlarm(); // Play the alarm sound for 2 seconds
        setTimeout(() => {
            setIsFlashing(false); // Stop flashing effect after 2 seconds
                
            // Clear the affirmation interval
            if (affirmationIntervalRef.current) {
                clearInterval(affirmationIntervalRef.current);
                affirmationIntervalRef.current = null;
            }

            if (workmode) {
                setWorkmode(false);
                setTimeLeft(breakInterval * 60);
                setMessage(''); // Clear any existing message
                showBreakAffirmation();
            } else {
                setWorkmode(true);
                setTimeLeft(workInterval * 60);
                setMessage(''); // Clear any existing message
                showWorkAffirmation();
            }
        }, 2000);
    }, [workmode, breakInterval, workInterval]);

    useEffect(() => {
        let timer;
        if (isRunning && !isPaused) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        handleTimerEnd();
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, isPaused, handleTimerEnd]);

    useEffect(() => {
        if (isStarted) {
            // Clear the existing interval
            if (affirmationIntervalRef.current) {
                clearInterval(affirmationIntervalRef.current);
            }
    
            // Set up a new interval
            affirmationIntervalRef.current = setInterval(() => {
                if (workmode) {
                    showWorkAffirmation();
                } else {
                    showBreakAffirmation();
                }
            }, 600000); // 10 minutes
        }
    
        // Cleanup function to clear the interval
        return () => {
            if (affirmationIntervalRef.current) {
                clearInterval(affirmationIntervalRef.current);
            }
        };
    }, [isStarted, workmode]);
   
    const handleStartPause = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsStarted(true);
            setIsPaused(false);
            if (workmode) {
                showWorkAffirmation();
            } else {
                showBreakAffirmation();
            }
        } else if (isPaused) {
            setIsPaused(false);
        } else {
            setIsPaused(true);
        }
    };


    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(workInterval * 60);
        setIsStarted(false);
        setIsPaused(false);
        setMessage('');
        setWorkmode(true);

        
        // Clear the affirmation interval
        if (affirmationIntervalRef.current) {
            clearInterval(affirmationIntervalRef.current);
            affirmationIntervalRef.current = null;
    }
    };

    const startTimer = (workMinutes, breakMinutes) => {
        setWorkInterval(workMinutes);
        setBreakInterval(breakMinutes);
        setTimeLeft(workMinutes * 60);
        handleStartPause();
    };

    const showWorkAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * workAffirmations.length);
        const affirmation = workAffirmations[randomIndex];
        setMessage(affirmation);
        setTimeout(() => {
            setMessage('');
        }, 60000); 
    };

    const showBreakAffirmation = () => {
        const randomIndex = Math.floor(Math.random() * breakAffirmations.length);
        const affirmation = breakAffirmations[randomIndex];
        setMessage(affirmation);
        setTimeout(() => {
            setMessage('');
        }, 60000); 
    };

    const playAlarm = () => {
        const alarm = alarmRef.current;
        alarm.currentTime = 0; // Start from the beginning
        alarm.play().then(() => {
            setTimeout(() => {
                alarm.pause();
            }, 2000); // Stop after 2 seconds
        }).catch(error => {
            console.error('Error playing alarm:', error);
        });
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
                        <div id="timerCommands" className="timer-commands">
                            <div className="timer-container">
                                <div id="workModeMessage">{modeMessage}</div>
                                <div id="timer" className={isFlashing ? 'flashing' : ''}>
                                    {isFlashing ? '00:00' : formatTime(timeLeft)}
                                </div>
                                <button id="startPause" onClick={handleStartPause}>{isPaused ? 'Resume' : 'Pause'}</button>
                                <button id="reset" onClick={handleReset}>Reset</button>
                            </div>
                        </div>
                        <div className="bunny-container">
                            <img id="bunnyImage" src={workmode ? bunnyWork : bunnySleep} alt="bunny" />
                        </div>
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
            <audio ref={alarmRef} src={alarmSound} />
        </div>
    );
}

const StartPage = ({ startTimer }) => {
    return (
        <div>
            <h1 id="logoContainer">
                <img id="logo" src={logo} alt="PomoPal Title" />
            </h1>
            <p>Select your work interval:</p>
            <button onClick={() => startTimer(25,5)}>25 min work, 5 min break</button>
            <button onClick={() => startTimer(50,10)}>50 min work, 10 min break</button>
        </div>
    );
};

export default App;