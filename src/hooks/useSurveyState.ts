import { useState, useCallback, useMemo } from 'react';
import type { SurveyState } from '../types/survey';
import config from '../config/survey.config';
import benefits from '../config/benefits';
import ratingThemes from '../config/rating-themes';

const STORAGE_TUTORIAL_KEY = 'venturo_benefit_survey_seen_tutorial';

export const useSurveyState = () => {
  // 1. Shuffled benefits list calculation (shuffled completely randomly across the entire pool)
  const preparedBenefits = useMemo(() => {
    const activeBenefits = benefits.filter(b => b.active);
    if (!config.randomizeBenefits) {
      return activeBenefits;
    }

    const result = [...activeBenefits];
    // Fisher-Yates Shuffle on the entire pool
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }, []);

  const [state, setState] = useState<SurveyState>({
    step: 'splash',
    name: '',
    currentBenefitIndex: 0,
    shuffledBenefits: preparedBenefits,
    ratings: {},
    priorities: Array(config.prioritySlotsCount || 5).fill(null),
    stayReason: '',
    leaveReason: '',
  });

  const activeTheme = useMemo(() => {
    return ratingThemes[config.ratingTheme] || ratingThemes.casual;
  }, []);

  // Actions
  const startSurvey = useCallback(() => {
    setState(prev => ({ ...prev, step: 'name' }));
  }, []);

  const submitName = useCallback((name: string) => {
    const hasSeenTutorial = localStorage.getItem(STORAGE_TUTORIAL_KEY) === 'true';
    const nextStep = hasSeenTutorial ? 'gameplay' : 'tutorial';

    setState(prev => ({
      ...prev,
      name,
      step: nextStep,
      currentBenefitIndex: 0
    }));
  }, []);

  const completeTutorial = useCallback(() => {
    localStorage.setItem(STORAGE_TUTORIAL_KEY, 'true');
    setState(prev => ({ ...prev, step: 'gameplay' }));
  }, []);

  const selectRating = useCallback((benefitId: string, score: number) => {
    setState(prev => {
      const newRatings = { ...prev.ratings, [benefitId]: score };
      const nextIndex = prev.currentBenefitIndex + 1;
      
      // Check if finished all benefits
      if (nextIndex >= prev.shuffledBenefits.length) {
        return {
          ...prev,
          ratings: newRatings,
          step: 'final_questions'
        };
      }

      // Just advance to the next benefit (completely flat and randomized)
      return {
        ...prev,
        ratings: newRatings,
        currentBenefitIndex: nextIndex
      };
    });
  }, []);

  const selectPriority = useCallback((benefitId: string, slotIndex: number) => {
    setState(prev => {
      const newRatings = { ...prev.ratings, [benefitId]: 5 };
      const newPriorities = [...prev.priorities];
      newPriorities[slotIndex] = benefitId;
      const nextIndex = prev.currentBenefitIndex + 1;

      // Check if finished all benefits
      if (nextIndex >= prev.shuffledBenefits.length) {
        return {
          ...prev,
          ratings: newRatings,
          priorities: newPriorities,
          step: 'final_questions'
        };
      }

      return {
        ...prev,
        ratings: newRatings,
        priorities: newPriorities,
        currentBenefitIndex: nextIndex
      };
    });
  }, []);

  const submitSurvey = useCallback(async (stayReason: string, leaveReason: string) => {
    setState(prev => ({ ...prev, step: 'submitting', stayReason, leaveReason }));

    // Convert priorities array to a key-value map with 1-based index keys (e.g. "1", "2", "3")
    const priorityMap: Record<string, string> = {};
    state.priorities.forEach((benefitId, index) => {
      if (benefitId) {
        priorityMap[String(index + 1)] = benefitId;
      }
    });

    const payload = {
      name: state.name,
      answers: {
        ...state.ratings,
        _priorities: priorityMap
      },
      stayReason: stayReason.trim(),
      leaveReason: leaveReason.trim()
    };

    try {
      // Use no-cors mode to bypass Google Apps Script redirect CORS issues.
      // With no-cors, the server will receive and save the data, and the promise
      // will resolve successfully (the response will be opaque).
      await fetch(config.submitEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      // Show success screen on clean resolution
      setState(prev => ({ ...prev, step: 'completed' }));
    } catch (error) {
      console.error('Submit error:', error);
      setState(prev => ({ 
        ...prev, 
        step: 'error', 
        errorMsg: 'Koneksi terputus atau server tidak merespons. Silakan coba kembali.' 
      }));
    }
  }, [state.name, state.ratings, state.priorities]);

  const retrySubmit = useCallback(() => {
    submitSurvey(state.stayReason, state.leaveReason);
  }, [submitSurvey, state.stayReason, state.leaveReason]);

  return {
    state,
    activeTheme,
    startSurvey,
    submitName,
    completeTutorial,
    selectRating,
    selectPriority,
    submitSurvey,
    retrySubmit
  };
};
