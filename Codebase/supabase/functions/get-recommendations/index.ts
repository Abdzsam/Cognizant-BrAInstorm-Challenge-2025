import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const { itemId } = await req.json();
    
    console.log('Getting recommendations for item:', itemId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the source item's embedding
    const { data: sourceItem, error: sourceError } = await supabase
      .from('thrift_items')
      .select('embedding')
      .eq('id', itemId)
      .single();

    if (sourceError || !sourceItem || !sourceItem.embedding) {
      console.error('Error fetching source item:', sourceError);
      throw new Error('Item not found or has no embedding');
    }

    // Use RPC to find similar items using vector similarity
    const { data: recommendations, error: recError } = await supabase
      .rpc('match_thrift_items', {
        query_embedding: sourceItem.embedding,
        match_threshold: 0.5,
        match_count: 5
      });

    if (recError) {
      console.error('Error getting recommendations:', recError);
      // Fallback: get random items if RPC doesn't work
      const { data: fallbackItems } = await supabase
        .from('thrift_items')
        .select('*')
        .neq('id', itemId)
        .limit(5);
      
      return new Response(
        JSON.stringify({ recommendations: fallbackItems || [] }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter out the source item from recommendations
    const filteredRecs = recommendations?.filter((item: any) => item.id !== itemId) || [];

    return new Response(
      JSON.stringify({ recommendations: filteredRecs }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        recommendations: []
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
