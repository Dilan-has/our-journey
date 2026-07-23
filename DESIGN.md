---
name: Aethel
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#514442'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#837371'
  outline-variant: '#d5c2c0'
  surface-tint: '#7f534d'
  primary: '#714641'
  on-primary: '#ffffff'
  primary-container: '#8c5e58'
  on-primary-container: '#ffe5e1'
  inverse-primary: '#f2b9b1'
  secondary: '#6b5c4c'
  on-secondary: '#ffffff'
  secondary-container: '#f4dfcb'
  on-secondary-container: '#716252'
  tertiary: '#4f5441'
  on-tertiary: '#ffffff'
  tertiary-container: '#676c58'
  on-tertiary-container: '#e9edd5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#f2b9b1'
  on-primary-fixed: '#31120e'
  on-primary-fixed-variant: '#643c37'
  secondary-fixed: '#f4dfcb'
  secondary-fixed-dim: '#d7c3b0'
  on-secondary-fixed: '#241a0e'
  on-secondary-fixed-variant: '#524436'
  tertiary-fixed: '#e0e5cc'
  tertiary-fixed-dim: '#c4c9b1'
  on-tertiary-fixed: '#191d0e'
  on-tertiary-fixed-variant: '#444937'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 24px
  section-gap: 48px
---

## Brand & Style
The design system is centered on **Intimate Minimalism**. It aims to create a digital sanctuary for couples, moving away from the cluttered anxiety of traditional planning tools toward a shared, calm journal experience. The aesthetic is "Warm Editorial"—it feels like a high-end physical stationery set brought to life.

The visual direction combines heavy whitespace with a refined, sophisticated structure. It evokes an emotional response of serenity, partnership, and anticipation. By utilizing soft transitions and breathable layouts, the interface recedes to let the couple's personal content and memories take center stage.

## Colors
The palette is built on a foundation of "Warm Whites" and "Champagne" to avoid the clinical feel of pure #FFFFFF. 

- **Primary (Romantic Rose):** A desaturated, deep rose used sparingly for high-intent actions and meaningful milestones.
- **Secondary (Champagne):** Used for subtle backgrounds, dividers, and decorative accents to provide warmth.
- **Tertiary (Sage Green):** An organic accent used for growth-related items, like "completed" states or nature-themed bucket list categories.
- **Neutral/Base:** A series of linen and parchment tones that provide a soft, low-strain reading environment.
- **Contrast:** High-contrast typography (#2D2926) ensures accessibility without the harshness of true black.

## Typography
The typography strategy pairings create a balance between "The Emotional" and "The Functional." 

**Playfair Display** is used for all headlines and display moments. Its high-contrast strokes and elegant serifs provide a literary, sophisticated feel reminiscent of a wedding invitation. 

**Inter** serves as the workhorse for all body copy and UI labels. It was chosen for its exceptional legibility at small sizes and its neutral character, which prevents the interface from feeling overly "frilly" or cluttered. 

Use ample line height (1.6x) for body text to maintain the open, airy journal aesthetic.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. On desktop, content is centered within a 1100px max-width container to maintain focus and prevent eye-strain. On mobile, a generous 20px side margin is maintained.

Spacing relies on a strict 8px grid, but emphasizes "Negative Space as a Feature." Sections should be separated by large gaps (48px+) to allow the couple's photos and text to breathe. Avoid dense clusters of information; if a screen feels "full," it likely needs to be broken into multiple steps or paginated.

## Elevation & Depth
In keeping with the journal aesthetic, this design system avoids heavy shadows. Depth is communicated through:

- **Tonal Layering:** Using the secondary "Champagne" color to define surface areas against the "Warm White" background.
- **Soft Ambient Shadows:** When a surface must appear elevated (like a floating action button or an active card), use a very large blur (24px+) with a low opacity (4-6%) shadow tinted with the primary rose color to keep it warm.
- **Hairline Borders:** Use 1px borders in a slightly darker neutral tone for input fields and cards to provide structure without adding visual "weight."

## Shapes
The shape language is "Intentionally Soft." 

A consistent 8px (0.5rem) corner radius is used for standard buttons and cards. This provides a approachable feel that is modern but not overly clinical. For specific "personal" elements, such as profile avatars or featured image containers, use `rounded-xl` (24px) to create a "scrapbook" feel. Interactive tags and chips should use a full pill-shape for maximum distinction from buttons.

## Components

### Buttons
Primary buttons use a solid fill of the Primary Rose with white text. Secondary buttons use a Champagne background with Primary Rose text. High-emphasis buttons should feature a subtle hover transition that deepens the color slightly.

### Elegant Cards
Cards should have no background (transparent) with a 1px soft-neutral border, or a very light Champagne fill with no border. Padding inside cards must be generous (min 24px).

### List Items & Checkboxes
List items for the bucket list use wide spacing. Checkboxes are custom: instead of a standard box, use a circular "ring" that fills with a soft Sage Green and a delicate checkmark when selected, signifying a completed "growth" moment.

### Input Fields
Fields are "Minimalist Underlines" or "Soft Rectangles." Placeholders should be in a light-italic serif to mimic a handwritten prompt in a journal.

### Navigation
A bottom navigation bar on mobile with thin-stroke icons and no labels to maximize whitespace. On desktop, a persistent side navigation with wide margins and clear typography.

### Progress Indicators
Use thin, elegant lines rather than chunky bars. For wedding planning milestones, use a "dot and line" timeline aesthetic.