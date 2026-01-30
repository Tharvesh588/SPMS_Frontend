# OG Image Requirements

## Social Media Sharing Image

**Filename**: `og-image.png`
**Location**: `/public/og-image.png`
**Dimensions**: 1200px × 630px
**Format**: PNG (or JPG)

## Design Specifications

### Layout
- **Background**: Gradient (Blue to Purple or brand colors)
- **Logo**: ProjectVerse logo (top center or left)
- **Title**: "ProjectVerse" (Large, bold)
- **Subtitle**: "Student Project Management System"
- **Tagline**: "By TM Nexus Tools"
- **Footer**: "spms.egspgroup.in"

### Typography
- Primary font: Inter or Space Grotesk
- Title size: 72-96px
- Subtitle size: 36-48px

### Branding
- Include EGSP Group branding if available
- TM Nexus Tools mention
- Clean, professional design
- High contrast for readability

### Colors
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Text: White or dark gray
- Background: Gradient or solid with texture

## Alternative Sizes (Optional)

For better optimization across platforms:
- **Twitter**: 1200 × 628px (current works)
- **Facebook**: 1200 × 630px ✓
- **LinkedIn**: 1200 × 627px (current works)

## How to Add

1. Create the image using:
   - Canva (recommended for quick creation)
   - Figma (for professional design)
   - Adobe Photoshop
   - Any graphic design tool

2. Save as `og-image.png`

3. Place in `public/` folder:
   ```
   public/
   └── og-image.png
   ```

4. The metadata is already configured in `layout.tsx` to use this image!

## Testing

After adding the image, test using:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

**Note**: The current implementation already references this image. Just create and add it to see it in action when sharing on social media!
