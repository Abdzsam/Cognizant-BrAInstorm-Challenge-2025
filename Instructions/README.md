# Areca.ai 
### *Discovered fashion that matches your style — powered by real AI.*

Areca.ai brings local  stores online and uses **AI styling + recommendation systems** to help users find sustainable outfits personalized to their unique fashion vibe.  
Built in 24 hours for a hackathon, AI combines **GPT-4o-mini** for outfit generation and **vector similarity embeddings** for real fashion recommendations.

---

## 🌟 Features

### 👗 1. AI-Powered Outfit Generator  
When a user clicks on a  item, the AI stylist (GPT-4o-mini) generates 3 matching pieces that complete the look.  
**Example:**  
> “You picked a vintage denim jacket — here’s how to style it.”  
> → *White graphic tee, black cargo pants, and retro sneakers.*

### 🧠 2. Real Recommendation System (Vector Similarity)
- Each  item is embedded using **OpenAI’s `text-embedding-3-small`** model.  
- When a user views or likes an item, the app performs a **vector similarity search** to find semantically related items.  
- Feels like *Spotify for fashion* — users get “You may also like” suggestions based on what they browse.

```sql
SELECT *
FROM _items
ORDER BY embedding <-> (SELECT embedding FROM _items WHERE id = $clickedItem)
LIMIT 5;
````

### 🎯 3. Personalized Feed

A quick 3-question quiz learns your vibe (Streetwear, Vintage, Y2K, Minimalist, etc.) and curates your  feed accordingly.

### 🌍 4. Sustainability Dashboard

Textile savings from reused items, aligning with **UN SDG #12 – Responsible Consumption & Production.**

### ♿ 5. Accessible & Inclusive UX

AI is designed for everyone — following **WCAG 2.1 AA** guidelines:

* High-contrast color palette
* Keyboard-navigable buttons
* `aria-live="polite"` for dynamic AI content
* Alt-text for every image
* Inclusive, unisex language
* Responsive layout (mobile-first)

---

## 🧩 Tech Stack

| Layer         | Tech                                          |
| ------------- | --------------------------------------------- |
| **Frontend**  | React + Tailwind CSS                          |
| **Backend**   | Next.js API Routes / Node.js                  |
| **Database**  | Supabase (with Vector Extension)              |
| **AI Models** | OpenAI GPT-4o-mini  ·  text-embedding-3-small |
| **Hosting**   | Vercel (frontend)  ·  Supabase (backend & DB) |

---

## ⚙️ Setup & Installation

1. **Clone this repo**

   ```bash
   git clone https://github.com/<your-username>/ai.git
   cd ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add environment variables**
   Create `.env.local`:

   ```env
   OPENAI_API_KEY=your_openai_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run locally**

   ```bash
   npm run dev
   ```

   App runs on [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI Integration

### ✨ Outfit Generator (OpenAI)

```js
const prompt = `
You are a fashion stylist for  shoppers.
User style: ${style}, preferred colors: ${colors}, budget: ${budget}.
Given  item: "${itemDescription}".
Suggest 3  pieces to complete this outfit.
Return JSON: [{ "name": "", "color": "", "style": "", "reason": "" }]
`;
```

### 🧩 Vector Recommendation System (Supabase)

Each item’s description is embedded via `text-embedding-3-small`
and stored in a Supabase `vector` column.
When a user clicks an item, AI queries the nearest vectors to find similar products.

---

## 🎬 Demo Flow (for hackathons)

1. **Take the Style Quiz** → AI defines your persona (“Streetwear Explorer”)
2. **Browse  Feed** → personalized by quiz + tags
3. **Click an Item** → “AI Stylist” generates matching outfit live
4. **See “Recommended For You”** → powered by vector similarity
5. **Sustainability Counter** → visual impact metric

---

## 💚 Accessibility Checklist

| ✅ | Requirement      | Description                    |
| - | ---------------- | ------------------------------ |
| ✔ | High contrast    | Meets WCAG 2.1 AA              |
| ✔ | Keyboard nav     | All buttons tabbable           |
| ✔ | Screen reader    | `aria-live` on dynamic content |
| ✔ | Alt-text         | For every image                |
| ✔ | Inclusive design | Unisex language & imagery      |

---

## 🌱 Vision

> To make sustainable fashion **accessible, personalized, and intelligent** — empowering local  stores with AI tools while helping users reduce waste through smarter consumption.

---

## 🧑‍💻 Contributors

* **Abdul Samad** – Developer
* **Falilou** – Developer
* **Jazib Ahmad** – Developer
* Hackathon Team - Areca

---

## 📜 License

MIT License © 2025 AI

---

## 🚀 Future Roadmap

* [ ] AI image search (“Upload an outfit → find  dupes”)
* [ ] Collaborative filtering recommendations
* [ ] Store onboarding portal
* [ ] Real-time sustainability analytics
* [ ] Multi-city  map integration`
