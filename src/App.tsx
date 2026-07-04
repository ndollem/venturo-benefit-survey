import { useSurveyState } from './hooks/useSurveyState';
import SplashScreen from './components/SplashScreen';
import NameInput from './components/NameInput';
import Tutorial from './components/Tutorial';
import Gameplay from './components/Gameplay';
import FinalQuestions from './components/FinalQuestions';
import { LoadingScreen, SuccessScreen, ErrorScreen } from './components/StatusScreens';
import config from './config/survey.config';

function App() {
  const {
    state,
    activeTheme,
    startSurvey,
    submitName,
    completeTutorial,
    selectRating,
    submitSurvey,
    retrySubmit
  } = useSurveyState();

  // Find info about the current active benefit
  const currentBenefit = state.shuffledBenefits[state.currentBenefitIndex];

  return (
    <div className="min-h-screen min-h-svh bg-slate-100 flex sm:items-center justify-center p-0 sm:p-4">
      {/* Dynamic CSS variable injection for configuration accent color */}
      <style>{`
        :root {
          --accent: ${config.accent};
          --accent-light: ${config.accent}15;
          --accent-dark: ${config.accent}cc;
        }
      `}</style>

      {/* Main viewport card frame */}
      <main className="app-container bg-white shadow-2xl relative flex flex-col overflow-hidden">
        {state.step === 'splash' && (
          <SplashScreen onStart={startSurvey} />
        )}
        
        {state.step === 'name' && (
          <NameInput onSubmit={submitName} />
        )}
        
        {state.step === 'tutorial' && (
          <Tutorial onComplete={completeTutorial} />
        )}
        
        {state.step === 'gameplay' && currentBenefit && (
          <Gameplay 
            currentBenefit={currentBenefit}
            allBenefits={state.shuffledBenefits}
            currentIndex={state.currentBenefitIndex}
            totalCount={state.shuffledBenefits.length}
            ratingOptions={activeTheme.options}
            onRate={selectRating}
          />
        )}
        
        {state.step === 'final_questions' && (
          <FinalQuestions onSubmit={submitSurvey} />
        )}
        
        {state.step === 'submitting' && (
          <LoadingScreen />
        )}
        
        {state.step === 'completed' && (
          <SuccessScreen />
        )}
        
        {state.step === 'error' && (
          <ErrorScreen errorMsg={state.errorMsg} onRetry={retrySubmit} />
        )}
      </main>
    </div>
  );
}

export default App;
