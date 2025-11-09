import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ThriftItem } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Filter } from 'lucide-react';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { useToast } from '@/hooks/use-toast';

const Feed = () => {
  const { answers, hasCompletedQuiz } = useQuiz();
  const { toast } = useToast();
  const [items, setItems] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ThriftItem | null>(null);
  const [filterByStyle, setFilterByStyle] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [filterByStyle, answers.vibe]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('thrift_items')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by user's style preference if quiz completed and filter enabled
      if (hasCompletedQuiz && filterByStyle && answers.vibe) {
        query = query.eq('style_category', answers.vibe);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: 'Error loading items',
        description: 'Please try refreshing the page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground py-6 px-4" role="banner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Thrift Feed</h1>
          {hasCompletedQuiz && (
            <p className="text-primary-foreground/90">
              Curated for: {answers.vibe} style • Budget: {answers.budget}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {hasCompletedQuiz && (
          <div className="mb-6 flex items-center gap-4">
            <Button
              onClick={() => setFilterByStyle(!filterByStyle)}
              variant={filterByStyle ? 'default' : 'outline'}
              aria-pressed={filterByStyle}
              aria-label={filterByStyle ? 'Show all styles' : 'Show only my style preference'}
            >
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              {filterByStyle ? `Showing ${answers.vibe} items` : 'Show all styles'}
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20" role="status">
            <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Loading thrift items</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No items found matching your style</p>
            <Button onClick={() => setFilterByStyle(false)} className="mt-4">
              View all items
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
            aria-label="Thrift items"
          >
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-elevated transition-all cursor-pointer group"
                onClick={() => setSelectedItem(item)}
                role="listitem"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.image_url}
                    alt={`${item.name} from ${item.store_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                    ${item.price.toFixed(2)}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-foreground line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.store_name}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          userAnswers={answers}
        />
      )}
    </div>
  );
};

export default Feed;
