import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, TrendingUp, Leaf } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
              <span>Arec.ai</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight">
              Discover thrifted fashion
              <br />
              that matches{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                your style
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Take our quick style quiz and let AI help you find the perfect thrifted pieces that match your vibe, colors, and budget.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={() => navigate('/quiz')}
                size="lg"
                className="text-lg px-8 py-6 h-auto shadow-elevated hover:shadow-soft transition-all"
                aria-label="Start your personalized style quiz"
              >
                <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                Take Your Style Quiz
              </Button>
              <Button
                onClick={() => navigate('/feed')}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                aria-label="Browse all thrift items"
              >
                Browse All Items
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4" role="article">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">AI-Powered Styling</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized outfit recommendations from our AI stylist based on your unique style preferences and budget.
              </p>
            </div>

            <div className="text-center space-y-4" role="article">
              <div className="inline-flex p-4 bg-secondary/20 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-secondary" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Smart Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover similar items you'll love with our vector-based recommendation system that learns from your choices.
              </p>
            </div>

            <div className="text-center space-y-4" role="article">
              <div className="inline-flex p-4 bg-accent/20 rounded-2xl">
                <Heart className="w-8 h-8 text-accent" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Sustainable Shopping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Shop guilt-free knowing you're giving pre-loved fashion a second life while reducing environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Footer */}
      <footer className="py-12 px-4 text-center bg-gradient-card" role="contentinfo">
        <div className="max-w-4xl mx-auto space-y-4">
          <Leaf className="w-12 h-12 text-secondary mx-auto" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-foreground">
            Built with Accessibility in Mind
          </h2>
          <p className="text-muted-foreground">
            Arec.ai is designed following WCAG 2.1 AA guidelines to ensure everyone can discover their perfect thrifted style.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by real AI • Vector embeddings • OpenAI GPT-4o-mini
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
