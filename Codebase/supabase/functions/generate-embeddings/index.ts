import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting embedding generation for all items without embeddings');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all items that don't have embeddings yet
    const { data: items, error: fetchError } = await supabase
      .from('thrift_items')
      .select('id, name, description, tags')
      .is('embedding', null);

    if (fetchError) {
      console.error('Error fetching items:', fetchError);
      throw fetchError;
    }

    if (!items || items.length === 0) {
      console.log('No items need embeddings');
      return new Response(
        JSON.stringify({ message: 'All items already have embeddings', count: 0 }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating embeddings for ${items.length} items`);
    let successCount = 0;

    for (const item of items) {
      try {
        // Create embedding text from item data
        const embeddingText = `${item.name}. ${item.description}. Tags: ${item.tags.join(', ')}`;

        // Call OpenAI Embeddings API
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: embeddingText,
          }),
        });

        if (!embeddingResponse.ok) {
          console.error(`OpenAI API error for item ${item.id}:`, embeddingResponse.status);
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Update the item with its embedding
        const { error: updateError } = await supabase
          .from('thrift_items')
          .update({ embedding })
          .eq('id', item.id);

        if (updateError) {
          console.error(`Error updating item ${item.id}:`, updateError);
        } else {
          successCount++;
          console.log(`Generated embedding for: ${item.name}`);
        }

      } catch (itemError) {
        console.error(`Error processing item ${item.id}:`, itemError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Generated embeddings for ${successCount} items`, 
        count: successCount 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-embeddings function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
