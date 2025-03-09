export const workAffirmations = [
    "You're doing great!",
    "Keep up the good work!",
    "I believe in you!",
    "You're making great progress!",
    "Keep pushing forward!",
    "You're a champ!",
    "You can achieve anything!",
    "Believe in yourself!",
    "You're making great progress!",
    "Remember to stay hydrated!",
    "You are unstoppable!",
    "You're acing it!",
    "You're doing great! Keep going!"
]

export const breakAffirmations = [
    "Let's go for a walk!",
    "Remember to drink water!",
    "Time for a sweet treat!",
    "Maybe a breath of fresh air?",
    "Stretchhhh!",
    "Enjoy your break! You deserve it",
    "Take a deep breath. Inhale... Exhale... Relax.",
    "You've worked so hard! I'm proud of you",
    "Grab a healthy snack!"

]

// Displays a random affirmation from the list of workAffirmations
export function displayWorkAffirmation() {
    const randomIndex = Math.floor(Math.random()* workAffirmations.length);
    const affirmation = workAffirmations[randomIndex];
    console.log(affirmation);
}

// Displays a random affirmation from the list of breakAffirmations
export function displayBreakAffirmation() {
    const randomIndex = Math.floor(Math.random()* breakAffirmations.length);
    const affirmation = breakAffirmations[randomIndex];
    console.log(affirmation);
}


