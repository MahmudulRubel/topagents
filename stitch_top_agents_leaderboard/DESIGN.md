---
name: Literalist Utility
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f0069'
  on-tertiary-container: '#7671ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  unit: 4px
  container-max: 800px
  gutter: 16px
  row-padding: 12px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system prioritizes speed of information and raw utility over aesthetic flourish. It adopts a **Hyper-Minimalist** and **Literal** style, stripping away all non-essential decorative elements to focus entirely on data hierarchy and transactional clarity. 

The personality is "scrappy and authentic"—it feels like a tool rather than a marketing site. There are no hero sections, no illustrations, and no complex animations. The emotional response should be one of efficiency and transparency. Every pixel must serve a functional purpose.

## Colors

The palette is strictly functional, utilizing high-contrast neutrals to establish a clear information hierarchy.

- **Background**: Use `#FAFAFA` for the page body and `#FFFFFF` for interactive or contained elements to create subtle separation without shadows.
- **Text**: Primary content (names, amounts) uses `#111111`. Secondary data (timestamps, labels) uses `#666666`.
- **Accent**: Muted Indigo (`#4F46E5`) is used sparingly for Call-to-Action (CTA) buttons, text links, and highlighting the highest bid amounts.
- **Borders**: A consistent `#E5E5E5` hairline border defines all structure.

## Typography

The system utilizes a default system sans-serif stack led by **Inter**. It is a text-heavy system where hierarchy is created through weight and color rather than size.

- **Headlines**: Kept small and tight. Large display type is avoided to maintain the utility feel.
- **Data Display**: For specific numeric values or IDs, a monospaced stack can be used to ensure alignment in lists.
- **Labels**: Use small, uppercase labels for table headers and metadata categories.
- **Links**: Always use the accent color; never use underlines unless in a long-form paragraph.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy, centered on the screen with a maximum width of 800px to ensure readability. 

- **Grid**: A simple 12-column system is used, but most content will reside in a single central column or a 2-column split (Content | Sidebar).
- **Rhythm**: All spacing is derived from a 4px baseline.
- **Leaderboard Rows**: Vertical padding is kept tight (12px) to maximize the number of visible entries.
- **Mobile**: Margins reduce to 16px. Table columns that are non-essential (e.g., secondary timestamps) should be hidden on smaller breakpoints.

## Elevation & Depth

This design system uses **Zero Elevation**. 

- **No Shadows**: Depth is never conveyed through drop shadows or blurs.
- **Flat Layers**: Separation is achieved solely through 1px hairline borders (`#E5E5E5`) and subtle background shifts (white on off-white).
- **Stacked Interface**: When a modal or overlay is required, it should be a simple bordered box with a solid background, potentially using a semi-transparent white (not blurred) backdrop to dim the content behind.

## Shapes

The shape language is strictly **Sharp**. 

- **Corners**: All buttons, input fields, avatars, and containers have a 0px border radius.
- **Borders**: Always use a 1px solid hairline. Do not use double borders or thick strokes. 
- **Avatars**: Users are represented by square blocks containing their initials. These blocks use a rotation of muted background colors with dark text.

## Components

### Buttons & Links
- **Primary Button**: Solid `#4F46E5` background, `#FFFFFF` text, sharp corners, no shadow.
- **Secondary Button**: White background, 1px `#E5E5E5` border, `#111111` text.
- **Navigation**: Text-only links in `#666666` that turn `#111111` on hover.

### Input Fields
- **Text Inputs**: 1px solid `#E5E5E5` border, sharp corners. Focus state changes border color to `#4F46E5`. 
- **Labels**: Placed directly above the input in `body-sm` bold.

### Leaderboard Rows
- **List Items**: Horizontal rows separated by a 1px `#E5E5E5` bottom border.
- **Hover State**: Rows should change background color to `#F5F5F5` on hover to indicate interactivity.
- **Rankings**: Bold numbers on the far left, followed by the square avatar.

### Chips & Badges
- Small rectangular boxes with a light gray `#F0F0F0` background and `#666666` text. No rounded corners.

### Avatars
- 32x32px or 40x40px squares. 
- Literal letter-based initials (e.g., "JD").
- Backgrounds should be a muted palette (e.g., light blue, light sage, light sand).