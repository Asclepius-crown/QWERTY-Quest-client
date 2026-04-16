import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, TrendingUp, BookOpen, Zap, AlertTriangle, Award, Activity, ChevronRight, Play, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import NeuralHeatmap from '../components/NeuralHeatmap';

const Coaching = () => {
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [practiceText, setPracticeText] = useState('');
  const [generating, setGenerating] = useState(false);

  const loadCoachingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, insightsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/coaching/profile`, {
          credentials: 'include'
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/coaching/insights?period=${selectedPeriod}`, {
          credentials: 'include'
        })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
    } catch (err) {
      console.error('Failed to load coaching data:', err);
      setError('Failed to load coaching data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadCoachingData();
  }, [loadCoachingData]);

  const generatePracticeText = async (weaknesses) => {
    setGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/coaching/generate-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          weaknesses: weaknesses?.slice(0, 3), // Top 3 weaknesses
          length: 250
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPracticeText(data.practiceText);
      } else {
        setError('Failed to generate practice text.');
      }
    } catch (err) {
      console.error('Failed to generate practice text:', err);
      setError('Failed to generate practice text. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'expert': return 'text-purple-400 bg-purple-500/10';
      case 'advanced': return 'text-blue-400 bg-blue-500/10';
      case 'intermediate': return 'text-green-400 bg-green-500/10';
      case 'beginner': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/5';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/5';
      case 'low': return 'border-green-500/50 bg-green-500/5';
      default: return 'border-gray-500/50 bg-gray-500/5';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-dark text-base-content">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-dark text-base-content">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-base-muted mb-6">{error}</p>
            <button
              onClick={loadCoachingData}
              className="bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-lg font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-dark text-base-content">
      <Navbar />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="w-10 h-10 text-primary" />
              AI <span className="text-primary-glow">Typing Coach</span>
            </h1>
            <p className="text-base-muted text-lg max-w-2xl mx-auto">
              Personalized analysis of your typing patterns to help you improve faster
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-base-content/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Profile
                </h3>

                {profile?.profile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base-muted">Skill Level</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSkillLevelColor(profile.profile.skillLevel)}`}>
                        {(profile.profile.skillLevel || 'novice').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profile.profile.avgWpm}</div>
                        <div className="text-xs text-base-muted uppercase">Avg WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{profile.profile.avgAccuracy}%</div>
                        <div className="text-xs text-base-muted uppercase">Accuracy</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-base-content/10">
                      <div className="text-sm text-base-muted mb-2">Recent Activity</div>
                      <div className="text-2xl font-bold text-blue-400">{profile.recentRaces}</div>
                      <div className="text-xs text-base-muted">Races analyzed</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Neural Heatmap */}
              <div className="glass-card p-6 rounded-2xl border border-base-content/5">
                <NeuralHeatmap insights={insights} />
              </div>
            </div>

            {/* Main Analysis Area */}
            <div className="lg:col-span-2 space-y-6">

              {/* Period Selector */}
              <div className="flex items-center gap-4">
                <span className="text-base-muted">Analysis Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-base-content/5 border border-base-content/10 rounded-lg px-3 py-2 text-base-content"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button
                  onClick={loadCoachingData}
                  className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Common Weaknesses */}
              {insights?.commonWeaknesses && Array.isArray(insights.commonWeaknesses) && insights.commonWeaknesses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-2xl border border-base-content/5"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Your Weaknesses
                  </h3>

                  <div className="space-y-3">
                    {insights.commonWeaknesses.map((weakness, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-base-content/5 rounded-lg">
                        <div>
                          <div className="font-medium text-base-content">{weakness.description}</div>
                          <div className="text-sm text-base-muted">
                            Occurred {weakness.occurrences} times
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          weakness.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                          weakness.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {weakness.severity?.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => generatePracticeText(insights.commonWeaknesses)}
                    disabled={generating}
                    className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {generating ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                    Generate Practice Session
                  </button>
                </motion.div>
              )}

              {/* Recommendations */}
              {insights?.recommendations && insights.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-2xl border border-base-content/5"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    AI Recommendations
                  </h3>

                  <div className="space-y-4">
                    {insights.recommendations.map((rec, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-base-content">{rec.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {rec.priority?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-base-muted text-sm mb-3">{rec.description}</p>
                         <div className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded inline-block">
                           {rec.practiceType ? rec.practiceType.replace(/_/g, ' ').toUpperCase() : 'GENERAL'}
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Practice Text */}
              {practiceText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-2xl border border-base-content/5"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Personalized Practice
                  </h3>

                  <div className="bg-base-content/5 p-4 rounded-lg mb-4">
                    <p className="text-base-content leading-relaxed font-mono text-sm">
                      {practiceText}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(practiceText)}
                      className="flex-1 bg-base-content/10 hover:bg-base-content/20 text-base-content py-2 rounded-lg font-medium transition-colors"
                    >
                      Copy Text
                    </button>
                    <button
                      onClick={() => setPracticeText('')}
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Stats Overview */}
              {insights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-2xl border border-base-content/5"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Performance Overview
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{insights.totalRaces}</div>
                      <div className="text-xs text-base-muted uppercase">Total Races</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{insights.avgAccuracy}%</div>
                      <div className="text-xs text-base-muted uppercase">Avg Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{insights.avgWpm}</div>
                      <div className="text-xs text-base-muted uppercase">Avg WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{insights.commonWeaknesses?.length || 0}</div>
                      <div className="text-xs text-base-muted uppercase">Weaknesses</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coaching;