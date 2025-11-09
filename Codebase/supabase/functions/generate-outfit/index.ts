import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemDescription, itemName, userStyle, userColors, userBudget } = await req.json();
    
    console.log('Generating outfit for:', { itemName, userStyle, userBudget });

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const prompt = `You are an expert fashion stylist specializing in thrift store fashion.

User's style preference: ${userStyle}
User's favorite colors: ${userColors.join(', ')}
User's budget: ${userBudget}

The user is interested in this thrift item:
Name: ${itemName}
Description: ${itemDescription}

Suggest 3 complementary thrift clothing pieces that would complete an outfit with this item. Consider the user's style, colors, and budget.

Return ONLY a valid JSON array with this exact structure (no markdown, no backticks, no additional text):
[
  {
    "name": "specific item name",
    "color": "color of the item",
    "style": "style category (e.g., vintage, modern, casual)",
    "reason": "brief explanation of why this piece works with the original item"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fashion stylist. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const outfitText = data.choices[0].message.content.trim();
    
    console.log('OpenAI response:', outfitText);
    
    // Clean up response - remove markdown code blocks if present
    let cleanedText = outfitText;
    if (outfitText.includes('```')) {
      cleanedText = outfitText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    let outfitSuggestions;
    try {
      outfitSuggestions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', cleanedText);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify({ suggestions: outfitSuggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-outfit function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        suggestions: []
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
