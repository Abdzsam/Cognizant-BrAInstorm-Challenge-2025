-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create thrift items table with vector embeddings
CREATE TABLE public.thrift_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  store_name TEXT NOT NULL,
  style_category TEXT NOT NULL CHECK (style_category IN ('Streetwear', 'Vintage', 'Minimalist', 'Y2K', 'Formal')),
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.thrift_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (thrift items are publicly viewable)
CREATE POLICY "Thrift items are viewable by everyone" 
ON public.thrift_items 
FOR SELECT 
USING (true);

-- Create index for vector similarity search
CREATE INDEX thrift_items_embedding_idx ON public.thrift_items 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create index for filtering by style category
CREATE INDEX thrift_items_style_category_idx ON public.thrift_items(style_category);

-- Insert sample thrift items
INSERT INTO public.thrift_items (name, description, tags, price, image_url, store_name, style_category) VALUES
  ('Vintage Denim Jacket', 'Classic 90s denim jacket with distressed details and faded wash. Perfect for layering.', ARRAY['denim', 'jacket', 'vintage', '90s'], 45.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Retro Finds', 'Vintage'),
  ('Oversized Band Tee', 'Authentic vintage band tee from the 80s. Soft, worn-in fabric with iconic graphics.', ARRAY['tshirt', 'band', 'oversized', '80s'], 28.00, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', 'Urban Thrift', 'Streetwear'),
  ('Minimalist Wool Coat', 'Clean-cut wool coat in charcoal gray. Timeless design with modern silhouette.', ARRAY['coat', 'wool', 'minimalist', 'gray'], 85.00, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', 'Modern Vintage', 'Minimalist'),
  ('Y2K Mini Skirt', 'Low-rise denim mini skirt with rhinestone details. True 2000s aesthetic.', ARRAY['skirt', 'denim', 'y2k', 'rhinestones'], 32.00, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', 'Throwback Threads', 'Y2K'),
  ('Formal Blazer', 'Tailored black blazer with satin lapels. Perfect for professional settings or evening events.', ARRAY['blazer', 'formal', 'black', 'tailored'], 68.00, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 'Classic Closet', 'Formal'),
  ('Cargo Pants', 'Baggy olive cargo pants with multiple pockets. Perfect streetwear staple.', ARRAY['pants', 'cargo', 'streetwear', 'olive'], 38.00, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', 'Urban Thrift', 'Streetwear'),
  -- ('Floral Maxi Dress', 'Vintage floral print maxi dress. Flowing fabric, perfect for summer.', ARRAY['dress', 'floral', 'maxi', 'summer'], 42.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 'Retro Finds', 'Vintage'),
  ('White Button-Down', 'Crisp white cotton button-down shirt. Minimalist essential.', ARRAY['shirt', 'white', 'cotton', 'minimalist'], 25.00, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400', 'Modern Vintage', 'Minimalist'),
  -- ('Low-Rise Jeans', 'Authentic Y2K low-rise flare jeans in light wash.', ARRAY['jeans', 'y2k', 'flare', 'lowrise'], 35.00, 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400', 'Throwback Threads', 'Y2K'),
  ('Salvatore Ferràgamo Bag', 'Luxurious silk tie in navy with subtle pattern. Professional accessory.', ARRAY['tie', 'silk', 'formal', 'navy'], 18.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', 'Classic Closet', 'Formal'),
  -- ('Bomber Jacket', 'Classic bomber jacket in sage green. Versatile streetwear piece.', ARRAY['jacket', 'bomber', 'streetwear', 'green'], 52.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', 'Urban Thrift', 'Streetwear'),
  ('Leather Belt', 'Vintage brown leather belt with brass buckle. Timeless accessory.', ARRAY['belt', 'leather', 'vintage', 'brown'], 22.00, 'c:\Users\mouha\AppData\Local\Temp\classic-leather-belt-35-mm-tobacco-bis-berluti_01-1.jpg', 'Retro Finds', 'Vintage');