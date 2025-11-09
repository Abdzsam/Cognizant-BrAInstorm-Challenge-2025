export type StyleVibe = 'Streetwear' | 'Vintage' | 'Minimalist' | 'Y2K' | 'Formal';

export type BudgetRange = '<$30' | '<$60' | '<$100';

export interface QuizAnswers {
  vibe: StyleVibe | null;
  colors: string[];
  budget: BudgetRange | null;
}

export interface ThriftItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  price: number;
  image_url: string;
  store_name: string;
  style_category: string;
  created_at: string;
}

export interface OutfitSuggestion {
  name: string;
  color: string;
  style: string;
  reason: string;
}
