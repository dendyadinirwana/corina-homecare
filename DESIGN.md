---
name: "Corina Wulandari - Personal Health & Homecare"
description: "Production-grade mobile-first personal medical homecare web app with Apple HIG tactile aesthetics"
colors:
  primary: "#D4F636"
  primary-hover: "#C2E22E"
  secondary: "#1E3322"
  secondary-light: "#E8F8EE"
  canvas: "#F2F2F7"
  surface: "#FFFFFF"
  card: "#F8F8FA"
  card-hover: "#F0F0F3"
  border-subtle: "#F0F0F2"
  border-hairline: "#E5E7EB"
  text-primary: "#000000"
  text-secondary: "#555555"
  text-muted: "#8E8E93"
  text-inverse: "#FFFFFF"
  status-live: "#34C759"
  whatsapp: "#25D366"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-forest:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  card-surface:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  card-tonal:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  pill-status:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: Corina Wulandari - Personal Health & Homecare

## 1. Overview

**Creative North Star: "The Clinical Sanctuary on Wheels"**

Corina Wulandari Personal Health & Homecare is an independent, mobile-first doctor-to-patient service interface engineered for utmost clinical reassurance, speed of access, and authentic tactile craftsmanship. In medical emergencies and home visits, cognitive load is high: patients and their families may be anxious, dealing with acute symptoms, or navigating on small mobile viewports with one hand. The design system therefore eliminates every shred of generic AI aesthetic drift—there are no lavender-blue gradient blobs, no simulated smartphone dynamic islands or fake iOS battery icons drawn on screen, no decorative blueprint grids, no gratuitous glassmorphism, and no endless rows of identical template cards.

Instead, the interface is rooted in authentic Apple iOS Human Interface Guidelines (HIG) with deliberate tactile feedback (`transitions-dev`). It pairs an authoritative, reassuring **Deep Clinical Forest Green** (`#1E3322`) representing professional medical precision, with an electric, high-contrast **Signature Lime** (`#D4F636`) reserved strictly for forward-momentum primary actions (such as scheduling home visits and confirming reservations). Background surfaces use pure iOS grouped canvas tones (`#F2F2F7`) and clean white squircle surfaces (`#FFFFFF`) with ultra-fine structural hairlines, ensuring clear separation of information without muddy visual noise.

Every single interactive element guarantees a minimum touch target of **44×44px** with active press scale compression (`scale(0.96)`) and natural deceleration curves (`cubic-bezier(0.22, 1, 0.36, 1)`). Real-world context is respected throughout: phone numbers and WhatsApp links trigger genuine telephone and messaging protocols, maps utilize live Leaflet OpenStreetMap coordinates with radar-pulse accuracy beacons, and text labels wrap naturally without abrupt mid-word ellipsis truncation.

### Key Characteristics:
- **Mobile-First Apple HIG Architecture**: Centered 393px–420px bounded frame on desktop displays, native 100vw responsive adaptation on handheld devices without artificial browser chrome.
- **Committed Two-Tone Clinical Palette**: Deep Forest Green (`#1E3322`) for clinical gravitas + Signature Lime (`#D4F636`) for primary action conversion, anchored on clean neutral surfaces.
- **Micro-Tactile Ergonomics (`transitions-dev`)**: Mechanical scale compression on press (`active:scale-96`), spring checkmark entry (`ease-bounce`), and 2s infinite radar pulse for geolocation accuracy.
- **Zero-AI-Slop Discipline**: Strict prohibition against decorative gradients, fake mock status bars, ghost drop shadows, and synthetic marketing buzzwords.
- **Universal Accessibility (WCAG 2.1 AA/AAA)**: Minimum 4.5:1 text contrast on body copy, keyboard navigation focus rings, visible form labels, and robust cross-browser touch target sizing.

---

## 2. Colors

The color palette is built around two committed brand anchors: **Deep Clinical Forest Green** as the foundation of medical authority, and **Signature Lime** as the energetic catalyst for booking conversion. Neutral surfaces mirror iOS system architecture with crisp separation between canvas, surface, and cards.

### Primary Accent
- **Signature Lime** (`#D4F636` / `oklch(91.8% 0.185 119.4)`): High-visibility, modern lime accent. Used exclusively on primary CTA buttons (`Pesan Kunjungan`, `Jadwalkan Kunjungan`, `Konfirmasi Janji Temu`) and active progress indicators. Generates immediate focal clarity against both dark forest containers and clean white surfaces.
- **Signature Lime Hover** (`#C2E22E` / `oklch(87.1% 0.176 118.8)`): Tactile press and hover state for primary lime buttons.

### Secondary Accent & Clinical Foundation
- **Deep Clinical Forest Green** (`#1E3322` / `oklch(26.2% 0.045 142.6)`): Authoritative, calm, grounding deep green. Used for doctor identity branding, emergency WhatsApp card containers, primary headers, active stepper circles, and high-emphasis clinical tags.
- **Forest Light Status Tint** (`#E8F8EE` / `oklch(96.4% 0.024 148.2)`): Very soft clinical tint used for availability badges, active stepper line progression, and selected state backdrops.

### System & Surface Neutrals
- **iOS Canvas Background** (`#F2F2F7` / `oklch(95.6% 0.004 264.5)`): The outer ambient canvas for desktop framing and grouped list views.
- **Surface Pure White** (`#FFFFFF` / `oklch(100% 0 0)`): Primary content card fill, modal background, and top navigation bar surface.
- **Tonal Card Surface** (`#F8F8FA` / `oklch(98.1% 0.003 270.0)`): Soft contrast fill for form inputs, nested section cards, and unselected options.
- **Card Hover** (`#F0F0F3` / `oklch(95.2% 0.004 270.0)`): Interactive card hover and tap state.
- **Border Subtle** (`#F0F0F2` / `oklch(95.8% 0.003 270.0)`): Card borders and section dividers.
- **Border Hairline** (`#E5E7EB` / `oklch(92.4% 0.006 264.5)`): Input borders, navigation dividers, and outer mobile frame border.

### Ink & Typography
- **Ink Primary** (`#000000` / `oklch(0% 0 0)`): Pure, uncompromising black for primary headlines, patient names, service titles, and key data points. Delivers maximum legibility under bright outdoor light.
- **Ink Secondary** (`#555555` / `oklch(44.5% 0 0)`): Neutral dark gray for descriptions, doctor credentials, subtitles, and input values. Hits 7.4:1 contrast ratio against white (exceeds WCAG AAA).
- **Ink Muted** (`#8E8E93` / `oklch(64.8% 0.008 264.5)`): iOS system gray for secondary metadata, date labels, and inactive steps.
- **Ink Inverse** (`#FFFFFF` / `oklch(100% 0 0)`): Text on dark Forest Green cards and badge containers.

### Functional & Live Indicators
- **Live Availability Green** (`#34C759` / `oklch(73.5% 0.198 142.5)`): Apple HIG status green for the live pulsing beacon, active doctor availability dot, and iOS switch toggle when active.
- **WhatsApp Direct Green** (`#25D366` / `oklch(76.2% 0.182 142.1)`): Standard verified WhatsApp messaging brand tone for emergency direct chat links.

### Named Rules

**The Signature Lime Rule.**
Signature Lime (`#D4F636`) is strictly reserved for the single highest-priority conversion element on screen (primary CTA, active navigation action). It must never be applied to body text, large background panels, or decorative borders. Its rarity is what commands immediate user action.

**The Clinical Authority Rule.**
Deep Forest Green (`#1E3322`) carries the gravitas of medical professionalism. Headers, trust badges, and medical credentials must anchor in Forest Green or Ink Primary—never playful pastel shades or neon hues.

**The Contrast Floor Rule.**
Body text must never drop below 4.5:1 contrast against its immediate background. Muted gray text (`#8E8E93`) is permitted only on non-essential supporting metadata at sizes 12px or above; all essential instructions and labels must use `#000000` or `#555555`.

---

## 3. Typography

The typographic system utilizes Apple's native platform font hierarchy (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `SF Pro Display`, with `Inter` as the robust modern web fallback). The type scale is optimized for swift readability on mobile devices.

### Type Family Stacks
- **Display & Headings**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif`
- **Body & Controls**: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif`
- **Monospace/Numbers**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (used for GPS coordinate pill: `lat`, `lng`)

### Hierarchy & Scale
- **Display 1 (Hero Title)**: `clamp(1.5rem, 5vw, 1.75rem)` (24px–28px), Weight 700 (Bold), Line-height 1.2, Letter-spacing `-0.02em`. Used for doctor's name on homepage and primary confirmation banner.
- **Headline (Section Title)**: `1.125rem` (18px), Weight 700 (Bold), Line-height 1.3, Letter-spacing `-0.015em`. Used for card headers, modal sheet titles, and review scores.
- **Title (Sub-Header / Card Header)**: `0.9375rem` (15px), Weight 600 (Semibold), Line-height 1.35, Letter-spacing `-0.01em`. Used for service item titles and step labels.
- **Body (Running Copy)**: `0.875rem` (14px), Weight 400/500, Line-height 1.5 (21px), Letter-spacing `normal`. Max line-length capped at 65ch. Used for medical descriptions, review paragraphs, and instructions.
- **Caption / Secondary**: `0.8125rem` (13px), Weight 500, Line-height 1.4, Letter-spacing `normal`. Used for doctor bio notes, pricing details, and time slots.
- **Label / Micro (Badges, Pills, Form Labels)**: `0.6875rem–0.75rem` (11px–12px), Weight 600/700, Line-height 1.25, Letter-spacing `0.02em` when uppercase. Used for input labels (`Patokan / Ciri Rumah`, `Nomor WhatsApp`), credentials, and live availability pill.

### Typographic Rules

**The Roman Purity Rule.**
Headings and display titles are strictly Roman (`font-style: normal`). Italic styling in headings is explicitly banned. Emphasis in headers is conveyed solely via font-weight (700 bold) or color (Forest Green vs Ink Primary). Italics are permitted only for gentle body-copy annotations (e.g. `(Patokan: samping masjid)`).

**The No-Ellipsis-on-Addresses Rule.**
User addresses and location descriptions must never be truncated with CSS `truncate` or `text-overflow: ellipsis`. In homecare logistics, cutting off a house number or street block can cause delayed medical arrival. Addresses must wrap completely using natural text wrap.

---

## 4. Elevation & Spatial Hierarchy

The interface rejects heavy, artificial drop shadows and muddy multi-stop blurs. Instead, it relies on tonal plane layering (canvas `#F2F2F7` → surface `#FFFFFF` → card `#F8F8FA`), ultra-clean hairlines, and featherweight iOS ambient diffusion.

### Shadow Vocabulary
- **Flat Ground Plane** (`box-shadow: none`): Default state for standard cards, inputs, and inline controls. Separation is established by subtle 1px border lines (`#F0F0F2` or `#E5E7EB`).
- **iOS Card Ambient** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`): Applied to elevated interactive cards, doctor portrait profile badge, and service selection tiles.
- **iOS Floating Bar / Modal** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)`): Applied to sticky bottom action containers (`Sticky Bottom CTA`), floating GPS locator pill on map, and confirmation dialogs.
- **Desktop Device Enclosure Shadow** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15)`): Applied exclusively to the outer `MobileFrame` when viewed on viewport sizes wider than 640px.

### Spatial Rhythm Scale
- **4px (`space-1` / `p-1`)**: Micro gaps between icon and text label in pills.
- **8px (`space-2` / `p-2`)**: Standard compact separation between list items and pill groups.
- **12px (`space-3` / `p-3`)**: Form field vertical rhythm and card internal padding (compact).
- **16px (`space-4` / `p-4`)**: Standard mobile page gutters, card padding, and modal padding.
- **20px–24px (`space-5`–`space-6` / `p-5`–`p-6`)**: Major section dividers and bottom sticky CTA wrapper padding.

### Named Rules

**The No-Ghost-Card Rule.**
A component must never combine a dark 1px border with a soft, wide drop shadow (`≥16px blur`). Surfaces must either be defined by a crisp hairline border (`border border-border-hairline`) or an ambient light shadow (`box-shadow-ios-card`), never heavy decorative blur layering.

**The Concurrency Radius Rule.**
Border radius follows a strict nested geometry: outer mobile frame = `rounded-[44px]`, primary surface cards = `rounded-2xl` (24px), inputs and inner tiles = `rounded-xl` (12px), buttons and badge pills = `rounded-full` (9999px). Concentric radii create optical harmony without chaotic curvature.

---

## 5. Components

### 5.1 Buttons (`Button.tsx`)
Tactile, touch-compliant button system built with active mechanical spring compression (`btn-tactile`).

- **Shape & Dimensions**:
  - `sm`: Min-height 44px, padding `8px 14px`, text 12px, `rounded-full`.
  - `md`: Min-height 44px, padding `10px 20px`, text 14px, `rounded-full`.
  - `lg`: Min-height 52px, padding `14px 24px`, text 16px, `rounded-full`.
  - `icon`: Exactly 44×44px, `rounded-full`, flex center.
- **Variants**:
  - `lime` (Primary CTA): Background `#D4F636`, text `#000000`, font-weight 600. Hover `#C2E22E`, active `#B8D829`.
  - `forest` / `primary`: Background `#1E3322`, text `#FFFFFF`, font-weight 500. Hover `#16271A`.
  - `outline`: Background transparent, border 1px `#E5E7EB`, text `#000000`. Hover `#000000/0.05`.
  - `subtle`: Background `#F8F8FA`, text `#000000`. Hover `#F0F0F3`.
  - `ghost`: Background transparent, text `#000000`. Hover `#000000/0.05`.
- **States (8-State Discipline)**:
  - *Default*: High-contrast solid fill.
  - *Hover*: Subtle brightness shift (`hover:bg-lime-hover`).
  - *Focus-Visible*: `outline: none; ring: 2px ring-forest/20`.
  - *Active*: `transform: scale(0.96); transition: 150ms cubic-bezier(0.22, 1, 0.36, 1)`.
  - *Disabled*: `opacity: 0.5; pointer-events: none; transform: none`.
  - *Loading*: Disabled with spinning SVG circle loader and preserved button dimensions.

### 5.2 Cards & Containers (`Card.tsx`)
Universal content grouping card with squircle curvature and ambient depth.
- **Variants**:
  - `card`: Background `#F8F8FA`, border 1px `#F0F0F2`.
  - `surface`: Background `#FFFFFF`, border 1px `#F0F0F2`.
  - `outline`: Background transparent, border 1px `#E5E7EB`.
- **Corner Radii**: `rounded-xl` (12px), `rounded-2xl` (24px default), `rounded-3xl` (28px).
- **Interactive Mode**: When `interactive` or `onClick` is supplied, applies `.btn-tactile`, `active:scale-[0.98]`, and `hover:bg-card-hover`.

### 5.3 Progress Stepper (`Stepper.tsx`)
Progress tracker for the 3-step booking flow (`(1) Tanggal`, `(2) Waktu`, `(3) Detail`).
- **Circle**: 32×32px rounded circle.
  - *Completed*: Deep Forest Green `#1E3322` with white checkmark (`Check` icon).
  - *Active*: Deep Forest Green `#1E3322` with white step number, framed by a 4px breathing ring of `#E8F8EE`.
  - *Upcoming*: Muted gray `#F0F0F2` with gray text `#8E8E93`.
- **Connecting Line**: 2px hairline divider. Fills with `#1E3322` as steps complete.
- **Labels**: 12px text situated cleanly below each circle, highlighted when active.

### 5.4 Map & Geolocation Picker (`MapPicker.tsx`)
Integrated Leaflet OpenStreetMap canvas designed for precise home entrance pinning.
- **Viewport**: 260px height container with `rounded-2xl` overflow clipping and 1px hairline border.
- **Target Reticle / Radar**: Centered medical pin marker with dual-layer animation:
  - Static central pin: 32×32px circle in Forest Green `#1E3322` with lime location marker.
  - Live Radar Wave (`animate-radar`): Outer ring expanding from 0 to 16px with fade-out over 2 seconds (`rgba(52, 199, 89, 0.5)`).
- **Controls**:
  - `Gunakan Lokasi Saat Ini`: 44px min-height floating pill button (`bg-white/95 backdrop-blur-md`). Clean text label without redundant icons. Active geolocation triggers spinning `Crosshair` and `"Mendeteksi..."`.
  - Coordinates Pill: Floating bottom badge displaying verified GPS coordinates in monospace typography (`GPS: -6.2841° S, 106.7265° E`).

### 5.5 Interactive Star Rating (`StarRating.tsx`)
Accessible rating component supporting both read-only display and interactive review submission.
- **Sizes**: `sm` (16px), `md` (24px), `lg` (32px).
- **Touch Target**: Interactive buttons wrap stars in 44×44px circular tap zones.
- **Color**: Active stars filled with `#FFB800` (warm gold); inactive stars stroked in `#E5E7EB`.
- **Interaction**: Spring bounce scale on click and hover preview support.

### 5.6 iOS Toggle Switch (`IosSwitch.tsx`)
Strict Apple Human Interface Guidelines specification switch for binary preferences (e.g. *Tampilkan sebagai Pasien Anonim*).
- **Dimensions**: Exactly 51×31px container, `rounded-full`, 2px internal padding.
- **Track**: `#34C759` when active/checked; `#E9E9EA` when inactive.
- **Thumb**: 27×27px white circle with crisp `box-shadow: 0 3px 8px rgba(0,0,0,0.15)`. Smooth translation of 20px via `cubic-bezier(0.22, 1, 0.36, 1)`.

### 5.7 Navigation Top Bar (`TopNavBar.tsx`)
Standardized header navigation with back button, screen title, and optional right-action slot.
- **Height**: 56px fixed header.
- **Back Button**: 44×44px circular tap target with `ChevronLeft` icon.
- **Title**: 16px semibold text centered or left-aligned depending on modal status.
- **Border**: Border-b hairline `#F0F0F2`.

---

## 6. Do's and Don'ts

### Do:
- **Do** maintain a minimum **44×44px** touch target on all clickable buttons, inputs, pills, and navigation icons.
- **Do** reserve **Signature Lime** (`#D4F636`) strictly for primary action CTA buttons to preserve its visual hierarchy.
- **Do** display full, un-truncated patient addresses (`text-right break-words`) in confirmation and summary cards so delivery details are never obscured.
- **Do** use authentic `.btn-tactile` press feedback with `scale(0.96)` compression and `150ms` spring timing on all interactive cards and buttons.
- **Do** keep headings strictly Roman (`font-style: normal`), utilizing font weight (700) and color contrast for visual hierarchy.
- **Do** respect the user's ambient device environment; let the browser and operating system provide genuine status bars and chrome.
- **Do** provide clear loading states (`isLoading`, animated spin icons) and disable buttons during asynchronous network or geolocation operations.

### Don't:
- **Don't** use generic blue-to-purple or purple-to-pink gradient fills; keep surfaces solid, clean, and clinical.
- **Don't** draw simulated operating system decorations (no fake battery indicators, no fake Wi-Fi icons, no fake Dynamic Island, and no fake iOS home indicator bars).
- **Don't** use decorative background grids, graph-paper lines, or hand-drawn sketch doodles on clinical medical screens.
- **Don't** apply uniform pill shapes to everything; reserve `rounded-full` for buttons, badges, and avatars, using `rounded-2xl` (24px) for cards and `rounded-xl` (12px) for inputs.
- **Don't** combine a 1px solid border with a soft drop shadow (`≥16px blur`) on the same card ("ghost card" anti-pattern).
- **Don't** allow body text contrast to fall below 4.5:1 against its background. Never use light gray text on off-white cards.
- **Don't** invent fake marketing metrics, fabricated customer counter numbers, or artificial urgency countdowns.
