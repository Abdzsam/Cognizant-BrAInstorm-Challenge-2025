import { useState, useEffect } from 'react';
import { QuizAnswers } from '@/types/quiz';

const STORAGE_KEY = 'thriftai_quiz_answers';

export const useQuiz = () => {
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { vibe: null, colors: [], budget: null };
      }
    }
    return { vibe: null, colors: [], budget: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const hasCompletedQuiz = answers.vibe !== null && answers.colors.length > 0 && answers.budget !== null;

  return { answers, setAnswers, hasCompletedQuiz };
};
