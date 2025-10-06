import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Target, TrendingUp, Clock, Award, Zap, PlusCircle, Calendar, BarChart3, Users, Play, Pause, RotateCcw, Sun, Moon, Timer, Flame } from 'lucide-react';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(60);

  useEffect(() => {
    const savedTopics = localStorage.getItem('studyTopics');
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    } else {
      const defaultTopics = [
        { id: 1, name: 'Machine Learning', difficulty: 'Hard', progress: 0, sessions: 0, totalTime: 0, category: 'AI/ML' },
        { id: 2, name: 'Data Structures', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Computer Science' },
        { id: 3, name: 'Python Programming', difficulty: 'Easy', progress: 0, sessions: 0, totalTime: 0, category: 'Programming' },
        { id: 4, name: 'Statistics', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Mathematics' },
        { id: 5, name: 'React Development', difficulty: 'Medium', progress: 0, sessions: 0, totalTime: 0, category: 'Web Development' },
        { id: 6, name: 'SQL & Databases', difficulty: 'Easy', progress: 0, sessions: 0, totalTime: 0, category: 'Data' }
      ];
      setTopics(defaultTopics);
      localStorage.setItem('studyTopics', JSON.stringify(defaultTopics));
    }

    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions));
    }

    const allQuizzes = [
      {
        id: 1,
        topic: 'Machine Learning',
        difficulty: 'Intermediate',
        estimatedTime: '8 minutes',
        questions: [
          { q: 'What is overfitting in machine learning?', a: 'When model performs well on training data but poorly on test data', options: ['Too many features', 'When model performs well on training data but poorly on test data', 'Not enough training data', 'Wrong algorithm choice'] },
          { q: 'What does SGD stand for?', a: 'Stochastic Gradient Descent', options: ['Standard Gradient Descent', 'Stochastic Gradient Descent', 'Simple Gradient Descent', 'Smooth Gradient Descent'] },
          { q: 'Which metric is best for imbalanced datasets?', a: 'F1-Score', options: ['Accuracy', 'F1-Score', 'Mean Squared Error', 'R-squared'] },
          { q: 'What is the purpose of cross-validation?', a: 'To assess model performance and prevent overfitting', options: ['To increase training data', 'To assess model performance and prevent overfitting', 'To reduce computation time', 'To visualize data'] }
        ]
      },
      {
        id: 2,
        topic: 'Data Structures',
        difficulty: 'Intermediate',
        estimatedTime: '6 minutes',
        questions: [
          { q: 'What is the time complexity of binary search?', a: 'O(log n)', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'] },
          { q: 'Which data structure uses LIFO?', a: 'Stack', options: ['Queue', 'Stack', 'Array', 'Linked List'] },
          { q: 'What is the worst case time complexity of quicksort?', a: 'O(n²)', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'] },
          { q: 'Which data structure is best for implementing BFS?', a: 'Queue', options: ['Stack', 'Queue', 'Heap', 'Tree'] }
        ]
      },
      {
        id: 3,
        topic: 'Python Programming',
        difficulty: 'Beginner',
        estimatedTime: '5 minutes',
        questions: [
          { q: 'Which Python function creates a list of numbers?', a: 'range()', options: ['list()', 'range()', 'sequence()', 'numbers()'] },
          { q: 'What does "self" represent in Python classes?', a: 'Current instance of the class', options: ['Global variable', 'Current instance of the class', 'Parent class', 'Module reference'] },
          { q: 'Which method adds an element to the end of a list?', a: 'append()', options: ['add()', 'append()', 'insert()', 'push()'] },
          { q: 'Which keyword is used to create a function in Python?', a: 'def', options: ['function', 'def', 'func', 'define'] }
        ]
      }
    ];
    setQuizzes(allQuizzes);
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
        setLastActiveTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleActivity = () => {
      setLastActiveTime(Date.now());
    };

    if (isRunning) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateFocusScore = (sessionDuration, pauses) => {
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

    const pauseScore = Math.max(0, 30 - (pauses * 8));
    const consistencyScore = Math.min(30, getStudyStreak() * 3);
    
    return Math.min(100, durationScore + pauseScore + consistencyScore);
  };

  const startSession = (topicName) => {
    setCurrentSession({ 
      topic: topicName, 
      startTime: Date.now()
    });
    setTimer(0);
    setPauseCount(0);
    setIsRunning(true);
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
      const focusScore = calculateFocusScore(timer, pauseCount);
      
      const newSession = {
        id: Date.now(),
        topic: currentSession.topic,
        duration: timer,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        focusScore: focusScore,
        pauses: pauseCount
      };
      
      const updatedSessions = [...studySessions, newSession];
      setStudySessions(updatedSessions);
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      
      const updatedTopics = topics.map(topic => {
        if (topic.name === currentSession.topic) {
          const progressIncrease = Math.max(1, Math.floor((timer / 60) * (focusScore / 100)));
          return { 
            ...topic, 
            sessions: topic.sessions + 1, 
            totalTime: topic.totalTime + timer,
            progress: Math.min(100, topic.progress + progressIncrease)
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
    setPauseCount(0);
    setActiveTab('dashboard');
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
        category: 'Custom'
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

  const getCurrentFocusScore = () => {
    if (!isRunning) return 0;
    const timeSinceActivity = (Date.now() - lastActiveTime) / 1000;
    const activityScore = timeSinceActivity < 30 ? 100 : Math.max(50, 100 - timeSinceActivity);
    const durationBonus = Math.min(20, timer / 60);
    return Math.min(100, Math.round(activityScore + durationBonus));
  };

  const getTodayStudyTime = () => {
    const today = new Date().toLocaleDateString();
    return studySessions
      .filter(session => session.date === today)
      .reduce((total, session) => total + session.duration, 0);
  };

  if (activeTab === 'session' && currentSession) {
    const currentFocus = getCurrentFocusScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Study Session</h1>
              <p className="text-xl opacity-90">{currentSession.topic}</p>
              <p className="text-sm opacity-75 mt-2">Pauses: {pauseCount}</p>
            </div>
            
            <div className="mb-12">
              <div className="text-8xl font-mono font-bold mb-4">{formatTime(timer)}</div>
              <div className="flex justify-center space-x-4 mb-6">
                {isRunning ? (
                  <button 
                    onClick={pauseSession}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </button>
                ) : (
                  <button 
                    onClick={resumeSession}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </button>
                )}
                <button 
                  onClick={endSession}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Finish
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <Timer className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Session Time</p>
                  <p className="text-xl font-bold">{Math.floor(timer / 60)}m</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Focus Score</p>
                  <p className="text-xl font-bold">{currentFocus}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-75">Quality</p>
                  <p className="text-xl font-bold">{currentFocus > 80 ? 'High' : currentFocus > 60 ? 'Good' : 'Fair'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'quiz' && currentQuiz) {
    if (currentQuiz.currentQuestion >= currentQuiz.questions.length) {
      const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
      const timeSpent = Math.floor((Date.now() - currentQuiz.startTime) / 1000 / 60);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
              <Award className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
              <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-6xl font-bold mb-2">{currentQuiz.score}/{currentQuiz.questions.length}</p>
                  <p className="text-gray-300">Correct</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-6xl font-bold mb-2">{percentage}%</p>
                  <p className="text-gray-300">Score</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-6xl font-bold mb-2">{timeSpent}m</p>
                  <p className="text-gray-300">Time</p>
                </div>
              </div>

              <p className="text-2xl mb-8">
                {percentage === 100 ? '🏆 Perfect Score!' : 
                 percentage >= 80 ? '🌟 Excellent work!' :
                 percentage >= 70 ? '👍 Good job!' :
                 percentage >= 60 ? '📚 Keep studying!' : 
                 '💪 More practice needed!'}
              </p>
              
              <div className="mb-8 text-left bg-white/5 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-6 text-center">Review</h3>
                {currentQuiz.answers.map((answer, index) => {
                  const question = currentQuiz.questions[index];
                  return (
                    <div key={index} className={`p-4 rounded-lg mb-4 border-l-4 ${answer.correct ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                      <p className="font-medium text-lg mb-2">Q{index + 1}: {question.q}</p>
                      <p className={`mb-2 ${answer.correct ? 'text-green-300' : 'text-red-300'}`}>
                        Your answer: {answer.answer} {answer.correct ? '✓' : '✗'}
                      </p>
                      {!answer.correct && (
                        <p className="text-green-300">Correct answer: {question.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => { setCurrentQuiz(null); setActiveTab('dashboard'); }}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                >
                  Back to Dashboard
                </button>
                <button 
                  onClick={() => takeQuiz(currentQuiz)}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-colors"
                >
                  Try Again
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{currentQuiz.topic} Quiz</h1>
                <div className="text-right">
                  <span className="text-lg">{currentQuiz.currentQuestion + 1} / {currentQuiz.questions.length}</span>
                  <p className="text-sm opacity-75">{currentQuiz.difficulty} • {currentQuiz.estimatedTime}</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-8">{question.q}</h2>
              <div className="grid grid-cols-1 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => answerQuestion(option)}
                    className="p-6 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all duration-200 border border-white/20 hover:border-white/40 hover:scale-105"
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
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Brain className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-4`} />
            <h1 className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Study Buddy</h1>
          </div>
          <p className={`text-xl ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>Track your learning progress and stay focused</p>
          
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <nav className="flex justify-center mb-8">
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-full p-2 flex space-x-2`}>
            {['dashboard', 'topics', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full capitalize font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : `${isDarkMode ? 'text-purple-200 hover:bg-white/10' : 'text-purple-700 hover:bg-white/40'}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                  <BookOpen className="w-6 h-6 mr-2" />
                  Study Topics ({topics.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topics.slice(0, 6).map((topic) => (
                    <div key={topic.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-transform`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.name}</h3>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`text-sm ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(topic.category)} text-white`}>
                            {topic.category}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          <span>Progress</span>
                          <span>{topic.progress}%</span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
                          <div 
                            className={`h-2 rounded-full transition-all ${getProgressColor(topic.progress)}`}
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                        <span>{topic.sessions} sessions</span>
                        <span>{Math.floor(topic.totalTime / 60)}m total</span>
                      </div>
                      <button 
                        onClick={() => startSession(topic.name)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                  <Zap className="w-6 h-6 mr-2" />
                  Knowledge Tests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-transform`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{quiz.topic}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm px-2 py-1 rounded ${quiz.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>⏱️ {quiz.estimatedTime}</span>
                      </div>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>{quiz.questions.length} questions</p>
                      <button 
                        onClick={() => takeQuiz(quiz)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all flex items-center justify-center"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Take Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Today's Progress
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study Time</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>
                      {Math.floor(getTodayStudyTime() / 60)}m / {dailyGoal}m
                    </span>
                  </div>
                  <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-3`}>
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (getTodayStudyTime() / 60 / dailyGoal) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Focus Score</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{getAverageFocusScore()}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Study Streak</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold flex items-center`}>
                      {getStudyStreak()} days <Flame className="w-4 h-4 ml-1 text-orange-500" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Sessions</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{studySessions.length}</span>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Recent Activity</h2>
                <div className="space-y-3">
                  {studySessions.slice(-4).reverse().map((session) => (
                    <div key={session.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-3 border-l-4 border-purple-500`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{session.topic}</p>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            {session.date} at {session.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{Math.floor(session.duration / 60)}m</p>
                          <p className="text-green-400 text-sm">{session.focusScore}% focus</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {studySessions.length === 0 && (
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No sessions yet</p>
                      <p className="text-sm">Start studying to track your progress!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Manage Topics</h2>
              <div className="flex space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Add new topic..."
                  className={`flex-1 sm:w-64 px-4 py-2 ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} border rounded-lg`}
                />
                <button
                  onClick={addTopic}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <div key={topic.id} className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-6 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:scale-105 transition-transform`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{topic.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(topic.category)} text-white`}>
                      {topic.category}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Difficulty</span>
                      <span className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Progress</span>
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
                        className={`h-3 rounded-full transition-all ${getProgressColor(topic.progress)}`}
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startSession(topic.name)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Progress Overview</h2>
              <div className="space-y-4">
                {topics.filter(topic => topic.sessions > 0).map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-4">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} w-32 truncate`}>{topic.name}</span>
                    <div className={`flex-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-3`}>
                      <div 
                        className={`h-3 rounded-full transition-all ${getProgressColor(topic.progress)}`}
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} w-12`}>{topic.progress}%</span>
                  </div>
                ))}
                {topics.filter(topic => topic.sessions > 0).length === 0 && (
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start studying to see your progress</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-lg rounded-2xl p-6`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Study Statistics</h2>
              <div className="space-y-6">
                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <Clock className="w-5 h-5 mr-2" />
                    Time Breakdown
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

                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <Target className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Best Focus Score</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.length > 0 ? Math.max(...studySessions.map(s => s.focusScore || 75)) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Session</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.length > 0 ? 
                          Math.floor(getTotalStudyTime() / studySessions.length / 60) + 'm' :
                          '0m'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Breaks</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {studySessions.reduce((sum, session) => sum + (session.pauses || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white/40'} rounded-lg p-4`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                    <Award className="w-5 h-5 mr-2" />
                    Achievements
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center ${getStudyStreak() >= 7 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <span className="mr-2">🏆</span>
                      <span>Week Streak {getStudyStreak() >= 7 ? '✓' : `(${getStudyStreak()}/7)`}</span>
                    </div>
                    <div className={`flex items-center ${getTotalStudyTime() >= 3600 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <span className="mr-2">⏰</span>
                      <span>Hour Master {getTotalStudyTime() >= 3600 ? '✓' : `(${Math.floor(getTotalStudyTime()/60)}/60m)`}</span>
                    </div>
                    <div className={`flex items-center ${topics.filter(t => t.progress >= 50).length >= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <span className="mr-2">🎯</span>
                      <span>Topic Expert {topics.filter(t => t.progress >= 50).length >= 3 ? '✓' : `(${topics.filter(t => t.progress >= 50).length}/3)`}</span>
                    </div>
                    <div className={`flex items-center ${getAverageFocusScore() >= 85 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <span className="mr-2">🧠</span>
                      <span>Focus Master {getAverageFocusScore() >= 85 ? '✓' : `(${getAverageFocusScore()}/85%)`}</span>
                    </div>
                  </div>
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