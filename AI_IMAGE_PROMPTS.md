# 🎨 AI Image Generation Prompts

Use these prompts with **Midjourney**, **DALL-E 3**, or **Stable Diffusion** to generate professional images for the landing page.

---

## 📍 Image Placeholder 1: Hero Section
**Location:** Landing page hero (right side)
**Dimensions:** 500px height, responsive width
**Purpose:** Main visual showing professional visa interview scene

### Prompt:
```
Professional US visa interview scene, confident young professional applicant
speaking with consular officer across desk, modern US embassy setting,
warm natural lighting, photorealistic style, cinematic composition,
shallow depth of field creating focus on applicant, official atmosphere
with American flag subtly visible in background, professional business attire,
positive body language, high detail facial features, architectural photography style,
shot with 50mm lens, f/1.8 aperture, golden hour lighting
```

### Alternative Shorter Prompt:
```
Professional visa interview, confident applicant at embassy desk,
modern office setting, warm lighting, photorealistic, cinematic,
shallow depth of field, official atmosphere
```

### Generation Tips:
- Use **aspect ratio 4:5** or **3:4** for portrait orientation
- Add `--ar 4:5` in Midjourney
- Style: Photorealistic, professional photography
- Avoid overly dramatic or staged looks
- Focus on conveying confidence and professionalism

---

## 📍 Image Placeholder 2: How It Works Section
**Location:** Landing page "How It Works" section (left side)
**Dimensions:** 400px height, responsive width
**Purpose:** Show modern dashboard/analytics visualization

### Prompt:
```
Modern dark UI dashboard showing visa interview analytics,
elegant interface with warm orange coral accents (#FF7A59),
data visualization charts and graphs, progress tracking metrics,
floating 3D interface elements, professional SaaS design aesthetic,
dark burgundy background (#4A2828), clean typography,
minimalist composition, high detail interface design,
isometric perspective view, soft glow effects on accent elements,
contemporary tech visualization, premium quality render
```

### Alternative Shorter Prompt:
```
Dark elegant dashboard UI, orange coral accents, data visualization,
progress charts, 3D floating elements, professional design,
dark background, high detail, isometric view
```

### Generation Tips:
- Use **aspect ratio 1:1** or **16:9**  for square/landscape
- Add `--ar 1:1` in Midjourney
- Style: UI/UX design, 3D render
- Emphasize dark theme with orange accents
- Include data/analytics visualization elements

---

## 🎯 Recommended AI Tools

### **Option 1: Midjourney (Best Quality)**
1. Go to: https://www.midjourney.com/
2. Join Discord server
3. Use `/imagine` command with prompts above
4. Add parameters: `--ar 4:5 --v 6 --style raw`
5. Upscale and download

### **Option 2: DALL-E 3 (Easiest)**
1. Go to: https://chat.openai.com/ (ChatGPT Plus)
2. Or: https://www.bing.com/images/create (Free)
3. Paste prompt directly
4. Generate and download

### **Option 3: Leonardo.ai (Free Credits)**
1. Go to: https://leonardo.ai/
2. Sign up for free credits
3. Use "Leonardo Diffusion XL" model
4. Paste prompt and generate

### **Option 4: Ideogram.ai (Great for UI)**
1. Go to: https://ideogram.ai/
2. Free tier available
3. Good for dashboard/UI visualizations
4. Use prompt #2 for best results

---

## 📐 Image Specifications

| Placeholder | Type | Dimensions | Format | Style |
|-------------|------|------------|--------|-------|
| Hero Image | Portrait | 500h × ~400w | PNG/WebP | Photorealistic |
| Dashboard | Landscape | 400h × ~600w | PNG/WebP | UI/3D Render |

---

## 🔄 How to Add Generated Images

Once you have the images:

1. **Save images to:**
   ```
   /Users/apple/prepared/frontend/public/images/
   ```

2. **Update Landing.jsx:**
   Replace the placeholder divs with:
   ```jsx
   {/* Replace first placeholder */}
   <img
     src="/images/hero-interview.png"
     alt="Professional visa interview"
     className="rounded-2xl shadow-2xl glow-accent"
   />

   {/* Replace second placeholder */}
   <img
     src="/images/dashboard-analytics.png"
     alt="Interview analytics dashboard"
     className="rounded-2xl shadow-2xl glow-accent"
   />
   ```

3. **Optimize images:**
   - Use https://tinypng.com/ to compress
   - Target < 200KB per image
   - WebP format recommended

---

## 🎨 Color Palette Reference

Use these colors if customizing images:

```css
Primary Dark:    #3D1F1F
Background:      #4A2828
Accent Coral:    #FF7A59
Accent Orange:   #FF8C6B
Text Light:      #F5E6D3
Text Cream:      #E8D5C4
Text Muted:      #B39B8A
Card Dark:       #2E1616
Border:          #5A3838
```

---

## 💡 Tips for Best Results

1. **Be Specific**: More details = better results
2. **Iterate**: Generate 4-5 variations, pick the best
3. **Style Consistency**: Use similar prompts for cohesive look
4. **Avoid Text**: AI struggles with text in images
5. **Check Licensing**: Use commercial-license-friendly tools

---

## 🚀 Quick Start (5 Minutes)

**Fastest Option:**
1. Go to https://www.bing.com/images/create (free, no signup)
2. Copy/paste Prompt #1
3. Wait 30 seconds
4. Download image
5. Repeat for Prompt #2
6. Done!

---

**Generated:** Dec 30, 2025
**For:** Prepared - US Visa Interview Practice
**Design Reference:** Dark burgundy theme with coral accents
