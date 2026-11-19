import React from 'react';
import { Challenge } from '../types/game';
import '../styles/ChallengeLevelSelector.css';

interface ChallengeLevelSelectorProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

export const ChallengeLevelSelector: React.FC<ChallengeLevelSelectorProps> = ({
  challenges,
  onSelectChallenge,
}) => {
  const groupedByDifficulty = challenges.reduce(
    (acc, challenge) => {
      if (!acc[challenge.difficulty]) {
        acc[challenge.difficulty] = [];
      }
      acc[challenge.difficulty].push(challenge);
      return acc;
    },
    {} as Record<string, Challenge[]>
  );

  const difficultyOrder: Array<'beginner' | 'intermediate' | 'advanced'> = [
    'beginner',
    'intermediate',
    'advanced',
  ];

  return (
    <div className="challenge-selector">
      <h2>Select a Challenge</h2>
      {difficultyOrder.map((difficulty) => {
        const levelChallenges = groupedByDifficulty[difficulty] || [];
        if (levelChallenges.length === 0) return null;

        return (
          <div key={difficulty} className="difficulty-section">
            <h3 className={`difficulty-title difficulty-${difficulty}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h3>
            <div className="challenges-grid">
              {levelChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="challenge-card"
                  onClick={() => onSelectChallenge(challenge)}
                >
                  <h4>{challenge.title}</h4>
                  <p>{challenge.description}</p>
                  <div className="challenge-meta">
                    <span className="difficulty-badge">
                      {difficulty}
                    </span>
                    <span className="test-count">
                      {challenge.testCases?.length || 0} tests
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
