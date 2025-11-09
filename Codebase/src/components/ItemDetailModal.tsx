import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThriftItem, OutfitSuggestion, QuizAnswers } from '@/types/quiz';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ItemDetailModalProps {
  item: ThriftItem;
  isOpen: boolean;
  onClose: () => void;
  userAnswers: QuizAnswers;
}

export const ItemDetailModal = ({ item, isOpen, onClose, userAnswers }: ItemDetailModalProps) => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateOutfit();
      fetchRecommendations();
    }
  }, [isOpen, item.id]);

  const generateOutfit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-outfit', {
        body: {
          itemDescription: item.description,
          itemName: item.name,
          userStyle: userAnswers.vibe || 'Casual',
          userColors: userAnswers.colors.length > 0 ? userAnswers.colors : ['Neutral'],
          userBudget: userAnswers.budget || '<$60',
        },
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error generating outfit:', error);
      toast({
        title: 'Error generating outfit',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: { itemId: item.id },
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="item-description">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Item Image and Details */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              <img
                src={item.image_url}
                alt={`${item.name} from ${item.store_name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div id="item-description">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                <Badge variant="secondary" className="text-sm">
                  {item.store_name}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* AI Outfit Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                AI Stylist Suggests
              </h3>
              <Button
                onClick={generateOutfit}
                disabled={loading}
                variant="outline"
                size="sm"
                aria-label="Generate new outfit suggestions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10" role="status">
                <Loader2 className="w-6 h-6 animate-spin text-primary" aria-hidden="true" />
                <span className="sr-only">Generating outfit suggestions</span>
              </div>
            ) : (
              <div className="space-y-3" aria-live="polite">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="bg-gradient-card">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">{suggestion.name}</h4>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.color}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.style}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Vector-based Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">🧠 You May Also Like</h3>
                {loadingRecs ? (
                  <div className="flex justify-center py-6" role="status">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" aria-hidden="true" />
                    <span className="sr-only">Loading recommendations</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3" aria-live="polite">
                    {recommendations.slice(0, 4).map((rec) => (
                      <Card key={rec.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                        <div className="aspect-square bg-muted">
                          <img
                            src={rec.image_url}
                            alt={`${rec.name} from ${rec.store_name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs font-medium line-clamp-1">{rec.name}</p>
                          <p className="text-xs text-primary">${rec.price.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
