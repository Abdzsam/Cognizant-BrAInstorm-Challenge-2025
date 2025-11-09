import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StyleVibe, BudgetRange, QuizAnswers } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Sparkles } from 'lucide-react';

const styleVibes: StyleVibe[] = ['Cottage Core', 'Vintage', 'Grunge', 'Old Money', 'Academia', 'Goth','Streetwear', 'Performative'];
const colorOptions = ['Black', 'White', 'Earth Tones', 'Pastels', 'Bold Colors', 'Neutrals', 'Warm Colours', 'Neon', 'Cooler Tones'];
const budgetRanges: BudgetRange[] = ['<$30', '<$60', '<$100'];

const Quiz = () => {
  const navigate = useNavigate();
  const { setAnswers } = useQuiz();
  const [currentStep, setCurrentStep] = useState(1);
  const [localAnswers, setLocalAnswers] = useState<QuizAnswers>({
    vibe: null,
    colors: [],
    budget: null,
  });

  const handleVibeSelect = (vibe: StyleVibe) => {
    setLocalAnswers({ ...localAnswers, vibe });
  };

  const handleColorToggle = (color: string) => {
    const newColors = localAnswers.colors.includes(color)
      ? localAnswers.colors.filter(c => c !== color)
      : [...localAnswers.colors, color];
    setLocalAnswers({ ...localAnswers, colors: newColors });
  };

  const handleBudgetSelect = (budget: BudgetRange) => {
    setLocalAnswers({ ...localAnswers, budget });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setAnswers(localAnswers);
      navigate('/feed');
    }
  };

  const handleSkip = () => {
    setAnswers({
      vibe: 'Streetwear',
      colors: ['Black', 'White'],
      budget: '<$60',
    });
    navigate('/feed');
  };

  const canProceed = () => {
    if (currentStep === 1) return localAnswers.vibe !== null;
    if (currentStep === 2) return localAnswers.colors.length > 0;
    if (currentStep === 3) return localAnswers.budget !== null;
    return false;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8" role="banner">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-foreground">Style Quiz</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Let's discover your unique thrift style
          </p>
          <div className="mt-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-16 rounded-full transition-all ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={`Step ${step} of 3${step === currentStep ? ' (current)' : step < currentStep ? ' (completed)' : ''}`}
                />
              ))}
            </div>
          </div>
        </header>

        <Card className="p-8 shadow-elevated">
          {currentStep === 1 && (
            <div role="group" aria-labelledby="vibe-heading">
              <h2 id="vibe-heading" className="text-2xl font-semibold mb-6 text-foreground">
                What's your vibe?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styleVibes.map((vibe) => (
                  <Button
                    key={vibe}
                    onClick={() => handleVibeSelect(vibe)}
                    variant={localAnswers.vibe === vibe ? 'default' : 'outline'}
                    size="lg"
                    className="h-auto py-6 text-lg"
                    aria-pressed={localAnswers.vibe === vibe}
                  >
                    {vibe}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div role="group" aria-labelledby="colors-heading">
              <h2 id="colors-heading" className="text-2xl font-semibold mb-6 text-foreground">
                What are your favorite colors?
              </h2>
              <p className="text-muted-foreground mb-4">Select all that apply</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    variant={localAnswers.colors.includes(color) ? 'default' : 'outline'}
                    size="lg"
                    className="h-auto py-4"
                    aria-pressed={localAnswers.colors.includes(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div role="group" aria-labelledby="budget-heading">
              <h2 id="budget-heading" className="text-2xl font-semibold mb-6 text-foreground">
                What's your typical budget per item?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {budgetRanges.map((budget) => (
                  <Button
                    key={budget}
                    onClick={() => handleBudgetSelect(budget)}
                    variant={localAnswers.budget === budget ? 'default' : 'outline'}
                    size="lg"
                    className="h-auto py-6 text-xl"
                    aria-pressed={localAnswers.budget === budget}
                  >
                    {budget}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="lg"
              aria-label="Skip quiz and browse all items"
            >
              Skip Quiz
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              aria-label={currentStep === 3 ? 'Complete quiz and view recommendations' : 'Continue to next question'}
            >
              {currentStep === 3 ? 'See My Recommendations' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
