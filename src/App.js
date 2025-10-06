import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Target, TrendingUp, Clock, Award, Zap, PlusCircle, Calendar, BarChart3, Lightbulb, Flame, Eye, Headphones, Moon, Sun, Gauge, Trophy, Star, Rocket, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const StudyBuddy = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studySessions, setStudySessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [pauseCount, setPauseCount] = useState(0);
  
  // Revolutionary features
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [focusBreaks, setFocusBreaks] = useState([]);
  const [motivationalQuotes, setMotivationalQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('');
  const [eyeStrainTimer, setEyeStrainTimer] = useState(0);
  const [biometricData, setBiometricData] = useState({ heartRate: 0, stress: 0 });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [burnoutRisk, setBurnoutRisk] = useState(0);
  const [flowState, setFlowState] = useState(0);
  const [brainwaveData, setBrainwaveData] = useState({ alpha: 0, beta: 0, theta: 0 });

  // Motivational quotes database
  const quotesDatabase = [
    "The expert in anything was once a beginner. - Helen Hayes",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "The future belongs to those who learn more skills and combine them in creative ways. - Robert Greene",
    "Learning never exhausts the mind. - Leonardo da Vinci",
    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. - Brian Herbert",
    "Intelligence is not a privilege, it's a gift. And you use it for the good of mankind. - Dr. Otto Octavius",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible. - Richard Feynman",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
    "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi"
  ];

  // AI recommendations engine
  const generateAIRecommendations = () => {
    const recommendations = [];
    const avgFocusScore = getAverageFocusScore();
    const totalTime = getTotalStudyTime();
    const streak = getStudyStreak();
    
    if (avgFocusScore < 70) {
      recommendations.push({
        type: 'focus',
        title: 'Boost Your Focus',
        message: 'Try the 25-5 Pomodoro technique for better concentration',
        action: 'Start Focused Session',
        icon: '🎯'
      });
    }
    
    if (totalTime < 1800) {
      recommendations.push({
        type: 'time',
        title: 'Increase Study Time',
        message: 'Aim for at least 30 minutes daily for optimal learning',
        action: 'Set Daily Goal',
        icon: '⏰'
      });
    }
    
    if (streak === 0) {
      recommendations.push({
        type: 'consistency',
        title: 'Build Consistency',
        message: 'Start a study streak today! Even 10 minutes counts.',
        action: 'Start Streak',
        icon: '🔥'
      });
    }

    const weakestTopic = getWeakestTopic();
    if (weakestTopic !== 'No data yet') {
      recommendations.push({
        type: 'improvement',
        title: 'Focus Area Identified',
        message: `Consider dedicating more time to ${weakestTopic}`,
        action: 'Study Now',
        icon: '📚'
      });
    }

    return recommendations.slice(0, 3);
  };

  // Flow state detection
  const calculateFlowState = () => {
    if (!isRunning) return 0;
    
    const sessionLength = timer / 60;
    const timeSinceActivity = (Date.now() - lastActiveTime) / 1000;
    
    let flowScore = 0;
    
    if (sessionLength >= 15 && sessionLength <= 90) {
      flowScore += 30;
    }
    
    if (pauseCount <= 1) {
      flowScore += 25;
    }
    
    if (timeSinceActivity < 10) {
      flowScore += 25;
    }
    
    if (sessionLength > 20) {
      flowScore += 20;
    }
    
    return Math.min(100, flowScore);
  };

  // Burnout risk assessment
  const calculateBurnoutRisk = () => {
    const recentSessions = studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      const daysDiff = (new Date() - sessionDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    const weeklyTime = recentSessions.reduce((sum, session) => sum + session.duration, 0);
    const hoursPerWeek = weeklyTime / 3600;
    
    if (hoursPerWeek > 40) return 80;
    if (hoursPerWeek > 30) return 60;
    if (hoursPerWeek > 20) return 40;
    return 20;
  };

  // Simulated biometric data
  const updateBiometricData = () => {
    if (isRunning) {
      const baseHeartRate = 70;
      const focusModifier = getCurrentFocusScore() / 100;
      const stressLevel = Math.max(0, 100 - getCurrentFocusScore());
      
      setBiometricData({
        heartRate: Math.round(baseHeartRate + (focusModifier * 10) + Math.random() * 5),
        stress: Math.round(stressLevel + Math.random() * 10)
      });
      
      setBrainwaveData({
        alpha: Math.round(40 + focusModifier * 30 + Math.random() * 10),
        beta: Math.round(30 + (1 - focusModifier) * 40 + Math.random() * 10),
        theta: Math.round(20 + Math.random() * 10)
      });
    }
  };

  // Weather impact on studying
  const getWeatherRecommendation = () => {
    const hour = new Date().getHours();
    const recommendations = [
      "☀️ Perfect sunny weather for focused studying!",
      "🌧️ Rainy day? Great for indoor deep work sessions.",
      "❄️ Cold weather enhances concentration - ideal study time!",
      "🌤️ Partly cloudy - optimal conditions for learning.",
      "🌙 Evening study session - time for reflection and review."
    ];
    
    return recommendations[hour % recommendations.length];
  };

  // Initialize enhanced data
  useEffect(() => {
    const savedTopics = localStorage.getItem('studyTopics');
    const savedSessions = localStorage.getItem('studySessions');
    const savedAchievements = localStorage.getItem('achievements');
    
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    } else {
      const defaultTopics = [
        { id: 1, name: 'Machine Learning', difficulty: 'Hard', progress: 0, sessions: 0, totalTime: 0, category: 'AI/ML', priority: 'high' },
        { id: 2, name: 'Data Structures', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Computer Science', priority: 'high' },
        { id: 3, name: 'Python Programming', difficulty: 'Easy', progress: 0, sessions: 0, totalTime: 0, category: 'Programming', priority: 'medium' },
        { id: 4, name: 'Statistics', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Mathematics', priority: 'high' },
        { id: 5, name: 'Deep Learning', difficulty: 'Hard', progress: 0, sessions: 0, totalTime: 0, category: 'AI/ML', priority: 'medium' },
        { id: 6, name: 'SQL & Databases', difficulty: 'Easy', progress: 0, sessions: 0, totalTime: 0, category: 'Data', priority: 'medium' },
        { id: 7, name: 'Linear Algebra', difficulty: 'Hard', progress: 0, sessions: 0, totalTime: 0, category: 'Mathematics', priority: 'low' },
        { id: 8, name: 'React Development', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Web Development', priority: 'medium' },
        { id: 9, name: 'Data Visualization', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Data', priority: 'low' },
        { id: 10, name: 'Algorithms', difficulty: 'Hard', progress: 0, sessions: 0, totalTime: 0, category: 'Computer Science', priority: 'high' }
      ];
      setTopics(defaultTopics);
      localStorage.setItem('studyTopics', JSON.stringify(defaultTopics));
    }

    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions));
    }

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    setCurrentQuote(quotesDatabase[Math.floor(Math.random() * quotesDatabase.length)]);
    setAiRecommendations(generateAIRecommendations());
    
    setStudyGroups([
      { id: 1, name: 'ML Enthusiasts', members: 47, topic: 'Machine Learning', active: true },
      { id: 2, name: 'Data Science Club', members: 93, topic: 'Statistics', active: true },
      { id: 3, name: 'Python Developers', members: 156, topic: 'Programming', active: false }
    ]);

    setLeaderboard([
      { rank: 1, name: 'Alex Chen', score: 2847, streak: 15, avatar: '👨‍💻' },
      { rank: 2, name: 'Sarah Kim', score: 2690, streak: 12, avatar: '👩‍🎓' },
      { rank: 3, name: 'You', score: getTotalStudyTime() / 60, streak: getStudyStreak(), avatar: '🚀' },
      { rank: 4, name: 'Mike Johnson', score: 2341, streak: 8, avatar: '🧠' },
      { rank: 5, name: 'Lisa Wang', score: 2198, streak: 11, avatar: '⭐' }
    ]);

    setMusicRecommendations([
      { genre: 'Lo-fi Hip Hop', description: 'Perfect for coding and data analysis', emoji: '🎵' },
      { genre: 'Classical', description: 'Enhances mathematical thinking', emoji: '🎼' },
      { genre: 'Ambient', description: 'Deep focus for complex problems', emoji: '🌊' },
      { genre: 'Nature Sounds', description: 'Reduces stress while learning', emoji: '🌿' }
    ]);

    // Comprehensive quiz data with difficulty levels
    const allQuizzes = [
      {
        id: 1,
        topic: 'Machine Learning',
        difficulty: 'Intermediate',
        estimatedTime: '8 minutes',
        questions: [
          { q: 'What is overfitting in machine learning?', a: 'When model performs well on training data but poorly on test data', options: ['Too many features', 'When model performs well on training data but poorly on test data', 'Not enough training data', 'Wrong algorithm choice'], difficulty: 'easy' },
          { q: 'What does SGD stand for?', a: 'Stochastic Gradient Descent', options: ['Standard Gradient Descent', 'Stochastic Gradient Descent', 'Simple Gradient Descent', 'Smooth Gradient Descent'], difficulty: 'medium' },
          { q: 'Which metric is best for imbalanced datasets?', a: 'F1-Score', options: ['Accuracy', 'F1-Score', 'Mean Squared Error', 'R-squared'], difficulty: 'medium' },
          { q: 'What is the purpose of cross-validation?', a: 'To assess model performance and prevent overfitting', options: ['To increase training data', 'To assess model performance and prevent overfitting', 'To reduce computation time', 'To visualize data'], difficulty: 'easy' },
          { q: 'In ensemble methods, what does bagging help reduce?', a: 'Variance', options: ['Bias', 'Variance', 'Underfitting', 'Feature correlation'], difficulty: 'hard' }
        ]
      },
      {
        id: 2,
        topic: 'Data Structures',
        difficulty: 'Advanced',
        estimatedTime: '10 minutes',
        questions: [
          { q: 'What is the time complexity of binary search?', a: 'O(log n)', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], difficulty: 'easy' },
          { q: 'Which data structure uses LIFO?', a: 'Stack', options: ['Queue', 'Stack', 'Array', 'Linked List'], difficulty: 'easy' },
          { q: 'What is the worst case time complexity of quicksort?', a: 'O(n²)', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], difficulty: 'medium' },
          { q: 'Which data structure is best for implementing BFS?', a: 'Queue', options: ['Stack', 'Queue', 'Heap', 'Tree'], difficulty: 'medium' },
          { q: 'What is the amortized time complexity of dynamic array insertion?', a: 'O(1)', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], difficulty: 'hard' }
        ]
      },
      {
        id: 3,
        topic: 'Deep Learning',
        difficulty: 'Expert',
        estimatedTime: '12 minutes',
        questions: [
          { q: 'What is a neural network activation function?', a: 'Function that determines neuron output', options: ['Data preprocessing step', 'Function that determines neuron output', 'Loss calculation method', 'Optimization algorithm'], difficulty: 'easy' },
          { q: 'What does CNN stand for?', a: 'Convolutional Neural Network', options: ['Complex Neural Network', 'Convolutional Neural Network', 'Cascading Neural Network', 'Computed Neural Network'], difficulty: 'easy' },
          { q: 'What is the vanishing gradient problem?', a: 'Gradients become too small in deep networks', options: ['Too much data', 'Gradients become too small in deep networks', 'Overfitting issue', 'Hardware limitation'], difficulty: 'medium' },
          { q: 'Which technique helps with vanishing gradients?', a: 'Residual connections', options: ['Dropout', 'Residual connections', 'Batch normalization', 'Data augmentation'], difficulty: 'hard' },
          { q: 'What is the purpose of attention mechanisms?', a: 'To focus on relevant parts of input', options: ['To reduce overfitting', 'To focus on relevant parts of input', 'To speed up training', 'To reduce model size'], difficulty: 'hard' }
        ]
      },
      {
        id: 4,
        topic: 'Python Programming',
        difficulty: 'Beginner',
        estimatedTime: '6 minutes',
        questions: [
          { q: 'Which Python function creates a list of numbers?', a: 'range()', options: ['list()', 'range()', 'sequence()', 'numbers()'], difficulty: 'easy' },
          { q: 'What does "self" represent in Python classes?', a: 'Current instance of the class', options: ['Global variable', 'Current instance of the class', 'Parent class', 'Module reference'], difficulty: 'medium' },
          { q: 'Which method adds an element to the end of a list?', a: 'append()', options: ['add()', 'append()', 'insert()', 'push()'], difficulty: 'easy' },
          { q: 'What is a Python decorator?', a: 'A function that modifies another function', options: ['A design pattern', 'A function that modifies another function', 'A type of loop', 'A data structure'], difficulty: 'hard' },
          { q: 'Which keyword is used to create a function in Python?', a: 'def', options: ['function', 'def', 'func', 'define'], difficulty: 'easy' }
        ]
      },
      {
        id: 5,
        topic: 'Statistics',
        difficulty: 'Intermediate',
        estimatedTime: '9 minutes',
        questions: [
          { q: 'What does a p-value less than 0.05 typically indicate?', a: 'Statistical significance', options: ['No correlation', 'Statistical significance', 'Data error', 'Normal distribution'], difficulty: 'medium' },
          { q: 'What is the difference between mean and median?', a: 'Mean is average, median is middle value', options: ['No difference', 'Mean is average, median is middle value', 'Mean is larger', 'Median is average'], difficulty: 'easy' },
          { q: 'What does correlation measure?', a: 'Linear relationship between variables', options: ['Causation', 'Linear relationship between variables', 'Data quality', 'Sample size'], difficulty: 'medium' },
          { q: 'What is a Type I error?', a: 'Rejecting a true null hypothesis', options: ['Accepting a false hypothesis', 'Rejecting a true null hypothesis', 'Data collection error', 'Calculation mistake'], difficulty: 'hard' },
          { q: 'What does standard deviation measure?', a: 'Spread of data around the mean', options: ['Central tendency', 'Spread of data around the mean', 'Maximum value', 'Data accuracy'], difficulty: 'medium' }
        ]
      },
      {
        id: 6,
        topic: 'SQL & Databases',
        difficulty: 'Beginner',
        estimatedTime: '7 minutes',
        questions: [
          { q: 'What does SQL stand for?', a: 'Structured Query Language', options: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Language', 'Standard Query Language'], difficulty: 'easy' },
          { q: 'Which SQL command is used to retrieve data?', a: 'SELECT', options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], difficulty: 'easy' },
          { q: 'What is a primary key?', a: 'Unique identifier for table rows', options: ['First column in table', 'Unique identifier for table rows', 'Most important data', 'Password protection'], difficulty: 'medium' },
          { q: 'What does JOIN do in SQL?', a: 'Combines data from multiple tables', options: ['Adds new rows', 'Combines data from multiple tables', 'Deletes duplicate data', 'Sorts table data'], difficulty: 'medium' },
          { q: 'What is database normalization?', a: 'Organizing data to reduce redundancy', options: ['Making data normal', 'Organizing data to reduce redundancy', 'Increasing database speed', 'Encrypting sensitive data'], difficulty: 'hard' }
        ]
      }
    ];
    setQuizzes(allQuizzes);

    setWeatherData({
      condition: 'sunny',
      temperature: 72,
      recommendation: getWeatherRecommendation()
    });
  }, []);

  // Enhanced timer with biometric updates
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
        setEyeStrainTimer(timer => timer + 1);
        setLastActiveTime(Date.now());
        
        if (timer % 10 === 0) {
          setFlowState(calculateFlowState());
          updateBiometricData();
        }
        
        if (timer > 0 && timer % 1200 === 0) {
          setFocusBreaks(prev => [...prev, {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            type: 'eye_rest',
            message: '👁️ Time for a 20-second eye break! Look at something 20 feet away.'
          }]);
        }
        
        if (timer > 0 && timer % 1800 === 0) {
          setCurrentQuote(quotesDatabase[Math.floor(Math.random() * quotesDatabase.length)]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Activity tracking for advanced focus
  useEffect(() => {
    const handleActivity = () => {
      setLastActiveTime(Date.now());
    };

    if (isRunning) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isRunning]);

  // Auto-generate AI recommendations
  useEffect(() => {
    const updateRecommendations = () => {
      setAiRecommendations(generateAIRecommendations());
      setBurnoutRisk(calculateBurnoutRisk());
    };
    
    if (studySessions.length > 0) {
      updateRecommendations();
    }
  }, [studySessions, topics]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced focus score with flow state integration
  const calculateFocusScore = (sessionDuration, pauses, timeOfDay) => {
    const duration = sessionDuration / 60;
    let durationScore = 0;
    
    if (duration >= 25 && duration <= 45) {
      durationScore = 40;
    } else if (duration >= 15 && duration <= 60) {
      durationScore = 30;
    } else if (duration >= 5) {
      durationScore = 20;
    } else {
      durationScore = 10;
    }

    const pauseScore = Math.max(0, 25 - (pauses * 5));
    const hour = new Date().getHours();
    const peakHours = [9, 10, 11, 14, 15, 16];
    const timeScore = peakHours.includes(hour) ? 20 : 15;
    const consistencyScore = Math.min(15, getStudyStreak() * 2);
    
    const flowBonus = flowState > 80 ? 10 : flowState > 60 ? 5 : 0;
    
    return Math.min(100, durationScore + pauseScore + timeScore + consistencyScore + flowBonus);
  };

  const startSession = (topicName) => {
    setCurrentSession({ 
      topic: topicName, 
      startTime: Date.now(),
      pauses: 0
    });
    setTimer(0);
    setEyeStrainTimer(0);
    setPauseCount(0);
    setIsRunning(true);
    setFlowState(0);
    setActiveTab('session');
  };

  const pauseSession = () => {
    setIsRunning(false);
    setPauseCount(prev => prev + 1);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const endSession = () => {
    if (currentSession) {
      const hour = new Date().getHours();
      const focusScore = calculateFocusScore(timer, pauseCount, hour);
      
      const newSession = {
        id: Date.now(),
        topic: currentSession.topic,
        duration: timer,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        focusScore: focusScore,
        pauses: pauseCount,
        timeOfDay: hour,
        flowState: flowState,
        weather: weatherData?.condition || 'unknown'
      };
      
      const updatedSessions = [...studySessions, newSession];
      setStudySessions(updatedSessions);
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      
      checkAchievements(updatedSessions, focusScore);
      
      const updatedTopics = topics.map(topic => {
        if (topic.name === currentSession.topic) {
          const progressIncrease = Math.max(1, Math.floor((timer / 60) * (focusScore / 100)));
          return { 
            ...topic, 
            sessions: topic.sessions + 1, 
            totalTime: topic.totalTime + timer,
            progress: Math.min(100, topic.progress + progressIncrease),
            lastStudied: new Date().toISOString()
          };
        }
        return topic;
      });
      setTopics(updatedTopics);
      localStorage.setItem('studyTopics', JSON.stringify(updatedTopics));
    }
    
    setCurrentSession(null);
    setIsRunning(false);
    setTimer(0);
    setEyeStrainTimer(0);
    setPauseCount(0);
    setFlowState(0);
    setActiveTab('dashboard');
  };

  // Achievement system
  const checkAchievements = (sessions, focusScore) => {
    const newAchievements = [];
    
    if (sessions.length === 1) {
      newAchievements.push({ id: 'first_session', name: 'Getting Started', description: 'Complete your first study session', icon: '🌟', earned: true });
    }
    
    if (focusScore === 100) {
      newAchievements.push({ id: 'perfect_focus', name: 'Perfect Focus', description: 'Achieve 100% focus score', icon: '🎯', earned: true });
    }
    
    if (timer >= 7200) {
      newAchievements.push({ id: 'marathon', name: 'Marathon Learner', description: 'Study for 2+ hours straight', icon: '🏃‍♂️', earned: true });
    }
    
    if (flowState >= 90) {
      newAchievements.push({ id: 'flow_master', name: 'Flow State Master', description: 'Achieve 90%+ flow state', icon: '🌊', earned: true });
    }
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    }
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      const topic = {
        id: Date.now(),
        name: newTopic,
        difficulty: 'Medium',
        progress: 0,
        sessions: 0,
        totalTime: 0,
        category: 'Custom',
        priority: 'medium'
      };
      const updatedTopics = [...topics, topic];
      setTopics(updatedTopics);
      localStorage.setItem('studyTopics', JSON.stringify(updatedTopics));
      setNewTopic('');
    }
  };

  const takeQuiz = (quiz) => {
    setCurrentQuiz({ ...quiz, currentQuestion: 0, score: 0, answers: [], startTime: Date.now() });
    setActiveTab('quiz');
  };

  const answerQuestion = (answer) => {
    const isCorrect = answer === currentQuiz.questions[currentQuiz.currentQuestion].a;
    const newAnswers = [...currentQuiz.answers, { answer, correct: isCorrect }];
    
    setCurrentQuiz({
      ...currentQuiz,
      answers: newAnswers,
      score: currentQuiz.score + (isCorrect ? 1 : 0),
      currentQuestion: currentQuiz.currentQuestion + 1
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AI/ML': 'bg-purple-500',
      'Computer Science': 'bg-blue-500',
      'Programming': 'bg-green-500',
      'Mathematics': 'bg-red-500',
      'Data': 'bg-yellow-500',
      'Web Development': 'bg-indigo-500',
      'Custom': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getTotalStudyTime = () => {
    return studySessions.reduce((total, session) => total + session.duration, 0);
  };

  const getAverageFocusScore = () => {
    if (studySessions.length === 0) return 0;
    return Math.round(studySessions.reduce((total, session) => total + (session.focusScore || 75), 0) / studySessions.length);
  };

  const getStudyStreak = () => {
    if (studySessions.length === 0) return 0;
    
    const today = new Date();
    const dates = [...new Set(studySessions.map(session => session.date))].sort();
    
    let streak = 0;
    let currentDate = today;
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const sessionDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getProductivityInsights = () => {
    if (studySessions.length < 3) return "Gathering intelligence from your study patterns...";
    
    const hourlyData = {};
    studySessions.forEach(session => {
      const hour = session.timeOfDay || new Date().getHours();
      if (!hourlyData[hour]) hourlyData[hour] = { count: 0, totalFocus: 0 };
      hourlyData[hour].count++;
      hourlyData[hour].totalFocus += session.focusScore || 75;
    });
    
    let bestHour = 0;
    let bestScore = 0;
    Object.keys(hourlyData).forEach(hour => {
      const avgScore = hourlyData[hour].totalFocus / hourlyData[hour].count;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestHour = hour;
      }
    });
    
    const timeString = bestHour == 0 ? '12 AM' : 
                     bestHour < 12 ? `${bestHour} AM` : 
                     bestHour == 12 ? '12 PM' : `${bestHour - 12} PM`;
    
    return `🚀 Peak performance detected around ${timeString} (${Math.round(bestScore)}% focus)`;
  };

  const getMostStudiedTopic = () => {
    if (topics.length === 0) return 'No data yet';
    return topics.reduce((prev, current) => 
      prev.totalTime > current.totalTime ? prev : current
    ).name;
  };

  const getWeakestTopic = () => {
    if (topics.length === 0) return 'No data yet';
    const studiedTopics = topics.filter(topic => topic.sessions > 0);
    if (studiedTopics.length === 0) return 'No data yet';
    
    return studiedTopics.reduce((prev, current) => 
      prev.progress < current.progress ? prev : current
    ).name;
  };

  const getCurrentFocusScore = () => {
    if (!isRunning) return 0;
    const timeSinceActivity = (Date.now() - lastActiveTime) / 1000;
    const activityScore = timeSinceActivity < 30 ? 100 : Math.max(50, 100 - timeSinceActivity);
    const durationBonus = Math.min(20, timer / 60);
    return Math.min(100, Math.round(activityScore + durationBonus));
  };

  const getFlowStateText = (score) => {
    if (score >= 90) return 'Deep Flow 🌊';
    if (score >= 70) return 'In the Zone ⚡';
    if (score >= 50) return 'Focused 🎯';
    if (score >= 30) return 'Getting There 📈';
    return 'Starting Up 🚀';
  };

  const getBurnoutRiskText = (risk) => {
    if (risk >= 80) return '🔴 High Risk';
    if (risk >= 60) return '🟡 Medium Risk';
    if (risk >= 40) return '🟢 Low Risk';
    return '✅ Very Low Risk';
  };

  // Revolutionary session view with biometric monitoring
  if (activeTab === 'session' && currentSession) {
    const currentFocus = getCurrentFocusScore();
    const productivity = currentFocus > 80 ? 'High' : currentFocus > 60 ? 'Medium' : 'Low';
    
    return (
      <div className="min-h-screen bg-gradient-neural p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center mb-6 neural-glow">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 gradient-text">🧠 Neural Learning Mode Active</h1>
              <p className="text-xl opacity-90">Subject: {currentSession.topic}</p>
              <p className="text-sm opacity-75 mt-2">Session ID: #{currentSession.startTime} • Pauses: {pauseCount}</p>
            </div>
            
            <div className="mb-12">
              <div className="text-8xl font-mono font-bold mb-4 neural-pulse">{formatTime(timer)}</div>
              <div className="flex justify-center space-x-4 mb-6">
                {isRunning ? (
                  <button 
                    onClick={pauseSession}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition-all flex items-center neural-glow"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause Neural Link
                  </button>
                ) : (
                  <button 
                    onClick={resumeSession}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all flex items-center neural-glow"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume Neural Link
                  </button>
                )}
                <button 
                  onClick={endSession}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all flex items-center neural-glow"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  End Session
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 neural-border">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Neural Time</p>
                  <p className="text-xl font-bold">{Math.floor(timer / 60)}m</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 neural-border">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Live Focus</p>
                  <p className="text-xl font-bold">{currentFocus}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 neural-border">
                  <Gauge className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Flow State</p>
                  <p className="text-xl font-bold">{flowState}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 neural-border">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Productivity</p>
                  <p className="text-xl font-bold">{productivity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                🩺 Biometric Monitor
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Heart Rate</span>
                  <span className="text-white font-bold">{biometricData.heartRate} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Stress Level</span>
                  <span className="text-white font-bold">{biometricData.stress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Eye Strain</span>
                  <span className="text-white font-bold">{Math.floor(eyeStrainTimer / 60)}m</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-300">Flow State: {getFlowStateText(flowState)}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${flowState}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                🧠 Neural Activity
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Alpha (Relaxed Focus)</span>
                    <span className="text-white">{brainwaveData.alpha}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${brainwaveData.alpha}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Beta (Active Thinking)</span>
                    <span className="text-white">{brainwaveData.beta}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${brainwaveData.beta}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Theta (Deep Focus)</span>
                    <span className="text-white">{brainwaveData.theta}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${brainwaveData.theta}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                🌍 Environment
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300">Weather Impact</p>
                  <p className="text-white">{weatherData?.recommendation}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300">Neural Motivation</p>
                  <p className="text-white italic text-sm">"{currentQuote}"</p>
                </div>
                {focusBreaks.length > 0 && (
                  <div className="bg-orange-500/20 rounded-lg p-3">
                    <p className="text-orange-300 text-sm font-semibold">Health Alert</p>
                    <p className="text-white text-sm">{focusBreaks[focusBreaks.length - 1].message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced quiz interface
  if (activeTab === 'quiz' && currentQuiz) {
    if (currentQuiz.currentQuestion >= currentQuiz.questions.length) {
      const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
      const timeSpent = Math.floor((Date.now() - currentQuiz.startTime) / 1000 / 60);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
              <Award className="w-20 h-20 mx-auto mb-6 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl font-bold mb-4 gradient-text">🎓 Knowledge Mastery Complete!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-6 neural-glow">
                  <p className="text-6xl font-bold mb-2">{currentQuiz.score}/{currentQuiz.questions.length}</p>
                  <p className="text-gray-300">Questions Mastered</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 neural-glow">
                  <p className="text-6xl font-bold mb-2">{percentage}%</p>
                  <p className="text-gray-300">Neural Accuracy</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 neural-glow">
                  <p className="text-6xl font-bold mb-2">{timeSpent}m</p>
                  <p className="text-gray-300">Processing Time</p>
                </div>
              </div>

              <p className="text-2xl mb-8">
                {percentage === 100 ? '🏆 Absolute Neural Perfection! You\'re a true master!' : 
                 percentage >= 90 ? '🌟 Outstanding! Neural pathways optimized!' :
                 percentage >= 80 ? '⭐ Excellent! Strong knowledge architecture!' : 
                 percentage >= 70 ? '👍 Solid! Neural connections established!' :
                 percentage >= 60 ? '📚 Good progress! Keep building those pathways!' : 
                 '💪 Neural training in progress! Persistence pays off!'}
              </p>
              
              <div className="mb-8 text-left bg-white/5 rounded-lg p-6 neural-border">
                <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">🧠 Neural Analysis Report</h3>
                {currentQuiz.answers.map((answer, index) => {
                  const question = currentQuiz.questions[index];
                  return (
                    <div key={index} className={`p-4 rounded-lg mb-4 border-l-4 transition-all ${answer.correct ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-lg">Q{index + 1}: {question.q}</p>
                        <span className={`px-3 py-1 rounded text-sm ${question.difficulty === 'easy' ? 'bg-green-500' : question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className={`mb-2 ${answer.correct ? 'text-green-300' : 'text-red-300'}`}>
                        Neural Response: {answer.answer} {answer.correct ? '✓' : '✗'}
                      </p>
                      {!answer.correct && (
                        <p className="text-green-300">Optimal Response: {question.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => { setCurrentQuiz(null); setActiveTab('dashboard'); }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all neural-glow"
                >
                  Return to Neural Hub
                </button>
                <button 
                  onClick={() => takeQuiz(currentQuiz)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all neural-glow"
                >
                  Neural Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white neural-glow">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold gradient-text">🧠 {currentQuiz.topic} Neural Test</h1>
                <div className="text-right">
                  <span className="text-lg">{currentQuiz.currentQuestion + 1} / {currentQuiz.questions.length}</span>
                  <p className="text-sm opacity-75">{currentQuiz.difficulty} Level • ⏱️ {currentQuiz.estimatedTime}</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 neural-glow"
                  style={{ width: `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded text-sm mr-4 ${question.difficulty === 'easy' ? 'bg-green-500' : question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {question.difficulty} difficulty
                </span>
                <span className="text-sm opacity-75">Neural complexity assessment</span>
              </div>
              <h2 className="text-3xl font-semibold mb-8 gradient-text">{question.q}</h2>
              <div className="grid grid-cols-1 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => answerQuestion(option)}
                    className="p-6 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all duration-200 border border-white/20 hover:border-white/40 hover:scale-105 neural-glow"
                  >
                    <span className="font-bold text-lg mr-4 text-blue-400">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-lg">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-neural' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-slideIn">
          <div className="flex justify-center items-center mb-4">
            <Brain className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-4 animate-pulse`} />
            <h1 className={`text-5xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'}`}>AI Study Buddy</h1>
            <Rocket className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} ml-4 animate-pulse`} />
          </div>
          <p className={`text-xl ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>Revolutionary learning powered by advanced neural algorithms</p>
          
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg transition-all ${isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'} neural-glow`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${aiMode ? 'bg-green-500 hover:bg-green-600 neural-glow' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Neural AI {aiMode ? 'ACTIVE' : 'STANDBY'}
            </button>
          </div>
        </header>

        <nav className="flex justify-center mb-8">
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-full p-2 flex space-x-2 neural-glow`}>
            {['dashboard', 'topics', 'analytics', 'social'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full capitalize font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg neural-glow' 
                    : `${isDarkMode ? 'text-purple-200 hover:bg-white/10' : 'text-purple-700 hover:bg-white/40'}`
                }`}
              >
                {tab === 'social' ? '🌐 Neural Network' : tab === 'dashboard' ? '🎛️ Command Center' : tab}
              </button>
            ))}
          </div>
        </nav>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {aiMode && aiRecommendations.length > 0 && (
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow animate-slideIn`}>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6 flex items-center`}>
                    <Lightbulb className="w-6 h-6 mr-2 text-yellow-500 animate-pulse" />
                    🤖 Neural AI Recommendations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiRecommendations.map((rec, index) => (
                      <div key={index} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-all neural-glow`}>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{rec.icon}</span>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{rec.title}</h3>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{rec.message}</p>
                        <button className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-1 rounded transition-all neural-glow">
                          {rec.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6 flex items-center`}>
                  <BookOpen className="w-6 h-6 mr-2" />
                  🎓 Neural Learning Modules ({topics.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topics.slice(0, 6).map((topic) => (
                    <div key={topic.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-all neural-glow`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.name}</h3>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`text-sm ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(topic.category)} text-white`}>
                            {topic.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(topic.priority)} text-white`}>
                            {topic.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          <span>Neural Mastery</span>
                          <span>{topic.progress}%</span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
                          <div 
                            className={`h-2 rounded-full transition-all ${getProgressColor(topic.progress)} neural-glow`}
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                        <span>{topic.sessions} sessions</span>
                        <span>{Math.floor(topic.totalTime / 3600)}h {Math.floor((topic.totalTime % 3600) / 60)}m</span>
                      </div>
                      <button 
                        onClick={() => startSession(topic.name)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center justify-center neural-glow"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Initialize Neural Link
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6 flex items-center`}>
                  <Zap className="w-6 h-6 mr-2 animate-pulse" />
                  🧠 Neural Knowledge Assessment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-all neural-glow`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{quiz.topic}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm px-2 py-1 rounded ${quiz.difficulty === 'Expert' ? 'bg-red-500' : quiz.difficulty === 'Advanced' ? 'bg-orange-500' : quiz.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>⏱️ {quiz.estimatedTime}</span>
                      </div>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>{quiz.questions.length} neural challenges</p>
                      <button 
                        onClick={() => takeQuiz(quiz)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all flex items-center justify-center neural-glow"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Neural Challenge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-4 flex items-center`}>
                  <BarChart3 className="w-5 h-5 mr-2" />
                  🚀 Neural Performance Matrix
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Learning Time</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>
                      {Math.floor(getTotalStudyTime() / 3600)}h {Math.floor((getTotalStudyTime() % 3600) / 60)}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural Focus Index</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{getAverageFocusScore()}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Domains</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{topics.filter(t => t.sessions > 0).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural Streak</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold flex items-center`}>
                      {getStudyStreak()} days <Flame className="w-4 h-4 ml-1 text-orange-500 animate-pulse" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Sessions</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{studySessions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Burnout Risk</span>
                    <span className={`font-semibold`}>{getBurnoutRiskText(burnoutRisk)}</span>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-4`}>🤖 Neural Intelligence Center</h2>
                <div className="space-y-4 text-sm">
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 neural-border`}>
                    <p className="text-green-400 font-medium mb-1">🎯 Performance Optimization</p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{getProductivityInsights()}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 neural-border`}>
                    <p className="text-blue-400 font-medium mb-1">📊 Neural Dominance</p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current mastery: {getMostStudiedTopic()}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 neural-border`}>
                    <p className="text-yellow-400 font-medium mb-1">🎯 Growth Vector</p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural expansion: {getWeakestTopic()}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 neural-border`}>
                    <p className="text-purple-400 font-medium mb-1">🌍 Environmental Sync</p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{weatherData?.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-4 flex items-center`}>
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500 animate-pulse" />
                  🏆 Neural Achievement Matrix
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${getStudyStreak() >= 7 ? 'bg-yellow-500/20 border-yellow-500 neural-glow' : 'bg-gray-500/20 border-gray-500'} border rounded-lg p-3 text-center transition-all`}>
                    <div className="text-2xl mb-1">🏆</div>
                    <div className={`text-xs ${getStudyStreak() >= 7 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      Neural Warrior {getStudyStreak() >= 7 ? '✓' : `${getStudyStreak()}/7`}
                    </div>
                  </div>
                  <div className={`${getTotalStudyTime() >= 3600 ? 'bg-yellow-500/20 border-yellow-500 neural-glow' : 'bg-gray-500/20 border-gray-500'} border rounded-lg p-3 text-center transition-all`}>
                    <div className="text-2xl mb-1">⏰</div>
                    <div className={`text-xs ${getTotalStudyTime() >= 3600 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      Time Master {getTotalStudyTime() >= 3600 ? '✓' : `${Math.floor(getTotalStudyTime()/60)}/60m`}
                    </div>
                  </div>
                  <div className={`${topics.filter(t => t.progress >= 50).length >= 3 ? 'bg-yellow-500/20 border-yellow-500 neural-glow' : 'bg-gray-500/20 border-gray-500'} border rounded-lg p-3 text-center transition-all`}>
                    <div className="text-2xl mb-1">🎯</div>
                    <div className={`text-xs ${topics.filter(t => t.progress >= 50).length >= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      Domain Expert {topics.filter(t => t.progress >= 50).length >= 3 ? '✓' : `${topics.filter(t => t.progress >= 50).length}/3`}
                    </div>
                  </div>
                  <div className={`${getAverageFocusScore() >= 85 ? 'bg-yellow-500/20 border-yellow-500 neural-glow' : 'bg-gray-500/20 border-gray-500'} border rounded-lg p-3 text-center transition-all`}>
                    <div className="text-2xl mb-1">🧠</div>
                    <div className={`text-xs ${getAverageFocusScore() >= 85 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      Focus Virtuoso {getAverageFocusScore() >= 85 ? '✓' : `${getAverageFocusScore()}/85%`}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-4`}>📈 Neural Activity Stream</h2>
                <div className="space-y-3">
                  {studySessions.slice(-4).reverse().map((session) => (
                    <div key={session.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 border-l-4 border-purple-500 neural-border transition-all hover:scale-105`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{session.topic}</p>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            {session.date} at {session.time}
                          </p>
                          {session.flowState && (
                            <p className={`text-xs text-blue-400`}>
                              Neural Flow: {getFlowStateText(session.flowState)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{Math.floor(session.duration / 60)}m</p>
                          <p className="text-green-400 text-sm">{session.focusScore || 75}% focus</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {studySessions.length === 0 && (
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
                      <Brain className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
                      <p>No neural sessions detected</p>
                      <p className="text-sm">Initialize your learning matrix!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-r from-purple-100 to-blue-100'} backdrop-blur-lg rounded-2xl p-6 border ${isDarkMode ? 'border-purple-500/30' : 'border-purple-300'} neural-glow`}>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-3 flex items-center`}>
                  <Star className="w-5 h-5 mr-2 text-yellow-500 animate-pulse" />
                  💫 Neural Inspiration Engine
                </h2>
                <p className={`${isDarkMode ? 'text-purple-200' : 'text-purple-700'} italic text-sm leading-relaxed`}>
                  "{currentQuote}"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'}`}>🎓 Neural Learning Module Manager</h2>
              <div className="flex space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Create new neural pathway..."
                  className={`flex-1 sm:w-64 px-4 py-2 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg neural-glow`}
                />
                <button
                  onClick={addTopic}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center neural-glow"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Initialize
                </button>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 text-center neural-glow`}>
                <div className="text-2xl font-bold text-purple-500">{topics.length}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural Modules</div>
              </div>
              <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 text-center neural-glow`}>
                <div className="text-2xl font-bold text-green-500">{topics.filter(t => t.progress >= 80).length}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mastered</div>
              </div>
              <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 text-center neural-glow`}>
                <div className="text-2xl font-bold text-yellow-500">{topics.filter(t => t.progress > 0 && t.progress < 80).length}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Processing</div>
              </div>
              <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 text-center neural-glow`}>
                <div className="text-2xl font-bold text-red-500">{topics.filter(t => t.progress === 0).length}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Uninitialized</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <div key={topic.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-6 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-all neural-glow`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.name}</h3>
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(topic.category)} text-white`}>
                        {topic.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(topic.priority)} text-white`}>
                        {topic.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Complexity</span>
                      <span className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural Mastery</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sessions</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.sessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Time</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Math.floor(topic.totalTime / 3600)}h {Math.floor((topic.totalTime % 3600) / 60)}m
                      </span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-3`}>
                      <div 
                        className={`h-3 rounded-full transition-all ${getProgressColor(topic.progress)} neural-glow`}
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                    {topic.lastStudied && (
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last neural sync: {new Date(topic.lastStudied).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => startSession(topic.name)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center justify-center neural-glow"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Activate Neural Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6`}>📊 Neural Learning Analytics Engine</h2>
              <div className="space-y-4">
                {topics.filter(topic => topic.sessions > 0).map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-4">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} w-32 truncate`}>{topic.name}</span>
                    <div className={`flex-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-3`}>
                      <div 
                        className={`h-3 rounded-full transition-all ${getProgressColor(topic.progress)} neural-glow`}
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} w-12`}>{topic.progress}%</span>
                  </div>
                ))}
                {topics.filter(topic => topic.sessions > 0).length === 0 && (
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p>Initializing neural analytics...</p>
                    <p className="text-sm">Start learning to unlock insights</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6`}>🚀 Advanced Neural Metrics</h2>
              <div className="space-y-6">
                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 neural-border`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <Clock className="w-5 h-5 mr-2" />
                    Neural Time Distribution Matrix
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(
                      topics.reduce((acc, topic) => {
                        if (topic.totalTime > 0) {
                          acc[topic.category] = (acc[topic.category] || 0) + topic.totalTime;
                        }
                        return acc;
                      }, {})
                    ).map(([category, time]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{category}</span>
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {Math.floor(time / 3600)}h {Math.floor((time % 3600) / 60)}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 neural-border`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <Target className="w-5 h-5 mr-2" />
                    Neural Performance Index
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Peak Focus Score</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.length > 0 ? Math.max(...studySessions.map(s => s.focusScore || 75)) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Session Length</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.length > 0 ? 
                          Math.floor(getTotalStudyTime() / studySessions.length / 60) + 'm' :
                          '0m'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Flow State Frequency</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.filter(s => s.flowState >= 80).length}/{studySessions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Neural Interruptions</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.reduce((sum, session) => sum + (session.pauses || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 neural-border`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Neural Mastery Milestones
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center ${getStudyStreak() >= 7 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>Neural Consistency Matrix: {getStudyStreak() >= 7 ? '✓ ACHIEVED' : `${getStudyStreak()}/7 days`}</span>
                    </div>
                    <div className={`flex items-center ${getTotalStudyTime() >= 3600 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Time Mastery Protocol: {getTotalStudyTime() >= 3600 ? '✓ ACHIEVED' : `${Math.floor(getTotalStudyTime()/60)}/60 minutes`}</span>
                    </div>
                    <div className={`flex items-center ${topics.filter(t => t.progress >= 50).length >= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <Target className="w-4 h-4 mr-2" />
                      <span>Domain Expert Status: {topics.filter(t => t.progress >= 50).length >= 3 ? '✓ ACHIEVED' : `${topics.filter(t => t.progress >= 50).length}/3 domains`}</span>
                    </div>
                    <div className={`flex items-center ${getAverageFocusScore() >= 85 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <Brain className="w-4 h-4 mr-2" />
                      <span>Neural Focus Virtuoso: {getAverageFocusScore() >= 85 ? '✓ ACHIEVED' : `${getAverageFocusScore()}/85% focus`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6 flex items-center`}>
                <Trophy className="w-6 h-6 mr-2 text-yellow-500 animate-pulse" />
                🌍 Global Neural Network
              </h2>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div key={user.rank} className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${user.name === 'You' ? 'bg-purple-500/20 border border-purple-500 neural-glow' : isDarkMode ? 'bg-white/5' : 'bg-white/40'} hover:scale-105`}>
                    <div className="text-2xl">{user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}</div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {user.score} neural points • {user.streak} day streak
                      </div>
                    </div>
                    <div className={`text-right ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6 neural-glow`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-6 flex items-center`}>
                <Rocket className="w-6 h-6 mr-2" />
                🚀 Neural Learning Communities
              </h2>
              <div className="space-y-4">
                {studyGroups.map((group) => (
                  <div key={group.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-all neural-glow`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{group.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${group.active ? 'bg-green-500 neural-glow' : 'bg-gray-500'} text-white`}>
                        {group.active ? 'Neural Link Active' : 'Dormant'}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                      Focus Domain: {group.topic} • {group.members} neural nodes
                    </p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all text-sm neural-glow">
                      Connect to Neural Cluster
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white gradient-text' : 'text-gray-800'} mb-4 flex items-center`}>
                  <Headphones className="w-5 h-5 mr-2" />
                  🎵 Neural Soundscape Library
                </h3>
                <div className="space-y-2">
                  {musicRecommendations.map((music, index) => (
                    <div key={index} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 flex items-center space-x-3 hover:scale-105 transition-all neural-glow`}>
                      <span className="text-xl">{music.emoji}</span>
                      <div className="flex-1">
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{music.genre}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{music.description}</div>
                      </div>
                      <button className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded text-sm transition-all neural-glow">
                        Neural Sync
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;