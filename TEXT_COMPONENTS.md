# Text Components Design System

This document outlines all text components in the Profound Careers page project. These components are designed to be reusable and adaptable for various text content throughout a new project.

---

## Table of Contents

1. [Mission Statement Component](#mission-statement-component)
2. [Stats/Metrics Component](#statsmetrics-component)
3. [Process Feature Component](#process-feature-component)
4. [Values Component](#values-component)
5. [Hero Text Component](#hero-text-component)
6. [Design Opportunities Component](#design-opportunities-component)
7. [Component Usage Guide](#component-usage-guide)

---

## Mission Statement Component

**Location:** `app/components/Jobs.tsx` (lines 176-194)

**What it does:** Displays a mission statement or key messaging with a heading, primary statement, and supporting paragraphs.

**Best for:**
- Company mission statements
- Value propositions
- Key messaging sections
- About/Introduction content
- Section headers with descriptive text

**Code:**

```tsx
{/* Mission section - Mobile: full width, Desktop: spans columns 1-2 */}
<div className="col-span-2 md:col-span-2 px-4">
  {/* Height is based on content */}
  <h2 className="text-h3 text-[var(--text-primary)] mb-4">
    Our mission
  </h2>
  <p className="text-h2 text-[var(--text-primary)] mb-6 max-w-[324px]">
    To build the best technology so businesses can understand and control how they appear in AI answers.
  </p>
  <p className="text-body-md text-[var(--text-secondary)] mb-8 max-w-[384px]">
    At Profound, we believe that AI visibility will become every company&apos;s most important metric.
  </p>
  <p className="text-body-md text-[var(--text-secondary)] max-w-[384px]">
    We&apos;re building an early-stage team here in NYC, SF, Buenos Aires, and London to work on one of the world&apos;s most interesting technical challenges: AI interpretability.
  </p>
</div>
```

**Structure:**
- **Heading (h2)**: Section title using `text-h3` class
- **Primary statement (p)**: Large, prominent text using `text-h2` class, max-width 324px
- **Supporting paragraphs (p)**: Secondary text using `text-body-md` class, max-width 384px

**Grid Layout:**
- Mobile: Full width (col-span-2)
- Desktop: Spans 2 columns (col-span-2) out of 4-column grid

**Typography Hierarchy:**
- Heading: `text-h3` (24px, primary color)
- Primary statement: `text-h2` (24px, primary color, bold)
- Supporting text: `text-body-md` (16px, secondary color)

**Customization:**
- Adjust `max-w-[324px]` for primary statement width
- Adjust `max-w-[384px]` for supporting text width
- Modify spacing with `mb-*` classes
- Change heading level/class as needed

---

## Stats/Metrics Component

**Location:** `app/components/Jobs.tsx` (lines 195-222)

**What it does:** Displays statistics or metrics in a vertical list format with visual dividers between items.

**Best for:**
- Key metrics and statistics
- Performance numbers
- Achievement highlights
- Data points
- Quantitative information display

**Code:**

```tsx
{/* Stats wrapper - Mobile: all stats in column 1 stacked, Desktop: column 3 */}
<div className="col-span-1 md:col-span-1 px-4 stats-column stats-column-1 mt-8 md:mt-0">
  {/* Height is based on content */}
  <div className="mb-8 relative">
    {/* Left border aligned with grid column line - visible on mobile and desktop */}
    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-[#555555]" />
    <div className="text-h2 text-[var(--text-primary)] mb-2">1B+</div>
    <div className="text-body text-[var(--text-secondary)]">Citations analyzed daily</div>
  </div>
  <div className="mb-8 md:mb-0 relative">
    {/* Left border aligned with grid column line - visible on mobile and desktop */}
    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-[#555555]" />
    <div className="text-h2 text-[var(--text-primary)] mb-2">30B+</div>
    <div className="text-body text-[var(--text-secondary)]">Crawler visits analyzed daily</div>
  </div>
</div>

{/* Stats section - Mobile: continues in column 1 (below previous stats), Desktop: column 4 */}
<div className="col-span-1 md:col-span-1 px-4 stats-column stats-column-2">
  {/* Height is based on content */}
  <div className="relative">
    {/* Left border aligned with grid column line - visible on mobile and desktop */}
    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-[#555555]" />
    <div className="text-h2 text-[var(--text-primary)] mb-2">10M+</div>
    <div className="text-body text-[var(--text-secondary)]">Prompts analyzed daily</div>
  </div>
</div>
```

**Structure:**
- **Stat value**: Large number/text using `text-h2` class
- **Stat label**: Descriptive text using `text-body` class
- **Visual divider**: Vertical line (`bg-[#555555]`) positioned at left edge

**Grid Layout:**
- Mobile: All stats stack in column 1
- Desktop: Stats split across columns 3 and 4 (using `stats-column-1` and `stats-column-2` classes)

**Visual Design:**
- Each stat item has a vertical divider line on the left
- Divider color: `#555555` (medium gray)
- Spacing between items: `mb-8` (32px)

**CSS Classes Required:**
```css
.stats-column {
  grid-column: 1;
}

@media (min-width: 768px) {
  .stats-column-1 {
    grid-column: 3;
  }
  .stats-column-2 {
    grid-column: 4;
  }
}
```

**Customization:**
- Change divider color (`bg-[#555555]`)
- Adjust spacing between items (`mb-8`)
- Modify stat value size (`text-h2`)
- Change label text size (`text-body`)
- Add/remove divider lines as needed

---

## Process Feature Component

**Location:** `app/components/ProcessFeature.tsx`

**What it does:** Displays a split layout with a sticky left side containing a tagline/phrase, and a right side containing numbered steps in a vertical list.

**Best for:**
- Process explanations
- Step-by-step guides
- How-it-works sections
- Numbered lists with descriptions
- Split content layouts (tagline + details)

**Code:**

```tsx
interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  showDivider?: boolean;
}

function ProcessStep({ number, title, description, showDivider = true }: ProcessStepProps) {
  return (
    <div className="relative">
      <div className="px-8 py-8 flex flex-col justify-between min-h-[132px]">
        {/* Number at top */}
        <div className="text-body mb-2 text-[var(--text-primary)]">
          {number}.
        </div>
        {/* Title and Description at bottom */}
        <div className="flex flex-col gap-2" style={{ maxWidth: '384px' }}>
          <div className="text-body text-[var(--text-primary)]">
            {title}
          </div>
          <div className="text-body text-[var(--text-secondary)]">
            {description}
          </div>
        </div>
      </div>
      {/* Solid divider at the bottom */}
      {showDivider && (
        <div 
          className="absolute left-0 right-0 bottom-0 border-b border-[var(--divider)]"
        />
      )}
    </div>
  );
}

export default function ProcessFeature() {
  return (
    <div className="relative">
      {/* Title - left aligned with same spacing as "Our investors" */}
      <div className="container-main relative mb-6">
        <div className="process-title-grid grid">
          <div className="col-span-2 md:col-span-4 px-1">
            <h3 className="text-body-md text-[var(--text-primary)]">
              Our process
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked layout, Desktop: Two boxes side by side */}
      <div className="relative">
        <div className="container-main relative">
          <div className="grid -mx-4 items-stretch process-feature-grid flex-col md:grid">
            {/* Left box - Mobile: small height, Desktop: spans 2 columns */}
            <div className="relative col-span-2 bg-[#0F0F0F] border-t border-b border-l border-r md:border-r-0 border-[var(--divider)] flex flex-col process-left-box">
              {/* Mobile: Small box with minimal padding, Desktop: Full height sticky */}
              <div className="relative flex-1">
                <div className="px-8 py-4 md:sticky md:px-8 md:py-8 flex items-center md:items-start" style={{ top: '54px', bottom: '32px' }}>
                  <div className="text-h2 text-[var(--text-primary)] font-medium" style={{ maxWidth: '384px' }}>
                    Candid. Respectful. Honest
                  </div>
                </div>
              </div>
              {/* Dotted divider on the right - Desktop only */}
              <div className="hidden md:block absolute right-0 top-0 bottom-0 dotted-line" />
            </div>

            {/* Right box - Mobile: stacked, Desktop: spans 2 columns */}
            <div className="relative col-span-2 bg-[#0F0F0F] border-t border-b border-l border-r md:border-l-0 border-[var(--divider)] flex flex-col">
              <div className="flex flex-col">
                <div className="relative">
                  <ProcessStep
                    number="01"
                    title="Intro call"
                    description="We'll schedule a 15-30 minute chat to get to know you, discuss your work history, and answer your questions."
                    showDivider={true}
                  />
                </div>
                <div className="relative">
                  <ProcessStep
                    number="02"
                    title="Debrief"
                    description="We'll debrief as a team and get back to you within a few days."
                    showDivider={true}
                  />
                </div>
                <div className="relative">
                  <ProcessStep
                    number="03"
                    title="Onsite"
                    description="If you're a good fit, we'll invite you to a day-long onsite. This onsite will give both you and our team the chance to collaborate and determine if we're the right match."
                    showDivider={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Structure:**

1. **Section Title**: Optional heading above the component
2. **Left Box**: Sticky tagline/phrase (desktop only)
3. **Right Box**: Numbered steps with titles and descriptions

**ProcessStep Props:**
- `number`: Step number (e.g., "01", "02")
- `title`: Step title
- `description`: Step description text
- `showDivider`: Whether to show bottom border divider

**Layout:**
- Mobile: Stacked vertically (left box on top, then right box)
- Desktop: Side-by-side (left: 2 columns, right: 2 columns)
- Left box is sticky on desktop (stays visible while scrolling)

**Visual Design:**
- Bordered boxes with `border-[var(--divider)]`
- Dotted vertical divider between left and right boxes (desktop)
- Solid horizontal dividers between steps
- Minimum height per step: 132px

**CSS Classes Required:**
```css
.process-title-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .process-title-grid {
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}

.process-feature-grid {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .process-feature-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}

.process-left-box {
  min-height: auto;
  height: auto;
}

@media (min-width: 768px) {
  .process-left-box {
    min-height: auto;
    height: auto;
  }
}
```

**Best for:**
- Process explanations
- Step-by-step instructions
- How-it-works sections
- Numbered lists with detailed descriptions
- Split layouts with tagline + content

**Customization:**
- Modify sticky positioning (`top: '54px'`)
- Adjust step minimum height (`min-h-[132px]`)
- Change max-width of content (`maxWidth: '384px'`)
- Customize divider visibility per step
- Modify border styling

---

## Values Component

**Location:** `app/components/Values.tsx` + `app/components/Value.tsx`

**What it does:** Displays a grid of value cards, each containing a number, category, title, and description in a structured card layout.

**Best for:**
- Company values
- Feature highlights
- Benefit cards
- Content cards in a grid
- Structured information display

**Code:**

### Value.tsx (Individual Card Component)

```tsx
interface ValueProps {
  number: string;
  category: string;
  title: string;
  description: string;
  height?: string | number;
  borderClasses?: string;
  showRightDivider?: boolean;
}

export default function Value({
  number,
  category,
  title,
  description,
  height = '396px',
  borderClasses = 'border-t border-b border-l border-[var(--divider)]',
  showRightDivider = true,
}: ValueProps) {
  return (
    <div 
      className={`relative col-span-2 bg-[var(--bg-black)] ${borderClasses}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="h-full px-8 py-8 flex flex-col justify-between">
        {/* Top: Number / Category */}
        <div className="text-body-sm">
          <span className="text-[var(--text-secondary)]">{number}.</span>
          <span className="text-[var(--text-primary)]"> / {category}</span>
        </div>
        
        {/* Bottom: Title and Description */}
        <div className="flex flex-col gap-2">
          <div className="text-h3 text-[var(--text-primary)] font-medium">
            {title}
          </div>
          <div className="text-body text-[var(--text-secondary)]" style={{ maxWidth: '384px' }}>
            {description}
          </div>
        </div>
      </div>
      {/* Dotted divider on the right */}
      {showRightDivider && <div className="absolute right-0 top-0 bottom-0 dotted-line" />}
    </div>
  );
}
```

### Values.tsx (Grid Container)

```tsx
import Value from './Value';

export default function Values() {
  return (
    <div className="relative">
      {/* Title - left aligned */}
      <div className="container-main relative mb-6">
        <div className="values-title-grid grid">
          <div className="col-span-2 md:col-span-4 px-1">
            <h3 className="text-body-md text-[var(--text-primary)]">
              Our values
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked values, Desktop: 2x2 grid */}
      <div className="relative">
        <div className="container-main relative">
          <div className="grid -mx-4 values-grid">
            {/* Row 1 */}
            <Value
              number="01"
              category="Invent"
              title="Invent things and lead change"
              description="Creating things is fun! Why not do it every day? Forget tweaking old code. Add new knowledge to the world instead."
              borderClasses="border-t border-l border-r md:border-r-0 border-[var(--divider)]"
              showRightDivider={true}
            />
            <Value
              number="02"
              category="Experiment"
              title="Build with a bias toward action"
              description="Supercharge your impact with a team that's moving fast, for the biggest brands on Earth."
              borderClasses="border-t border-l border-r md:border-r md:border-l-0 border-[var(--divider)]"
              showRightDivider={false}
            />

            {/* Row 2 */}
            <Value
              number="03"
              category="Impact"
              title="Do the best work of your career"
              description="Come to Profound to do work that you didn't know you were capable of. Tackle challenges you didn't know existed."
              borderClasses="border-l border-r md:border-r-0 border-t border-b border-[var(--divider)]"
              showRightDivider={true}
            />
            <Value
              number="04"
              category="Build"
              title="Be part of the best culture"
              description="Join smart people who are passionate about their work, building things, and growing together. And have some fun while doing it."
              borderClasses="border-r border-l border-t border-b md:border-l-0 border-[var(--divider)]"
              showRightDivider={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Structure:**

**Value Component Props:**
- `number`: Number prefix (e.g., "01")
- `category`: Category label
- `title`: Main heading
- `description`: Supporting text
- `height`: Card height (default: '396px')
- `borderClasses`: Custom border classes for grid positioning
- `showRightDivider`: Whether to show dotted divider on right

**Layout:**
- Mobile: Stacked vertically (1 column)
- Desktop: 2x2 grid (2 columns, 2 rows)
- Each card spans 2 columns on mobile, 1 column on desktop

**Visual Design:**
- Fixed height cards (396px default)
- Number and category at top
- Title and description at bottom
- Dotted vertical dividers between cards
- Border styling varies by position in grid

**CSS Classes Required:**
```css
.values-title-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .values-title-grid {
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}

.values-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(4, minmax(0, 264px));
  }
}
```

**Best for:**
- Company values
- Feature highlights
- Benefit cards
- Content cards in a grid
- Structured information display

**Customization:**
- Adjust card height (`height` prop)
- Modify border classes for different grid positions
- Change typography sizes
- Adjust spacing (`px-8 py-8`)
- Customize divider visibility

---

## Hero Text Component

**Location:** `app/components/Hero.tsx`

**What it does:** Displays centered hero text with a main heading, subheading, and optional CTA button.

**Best for:**
- Landing page heroes
- Section headers
- Prominent messaging
- Call-to-action sections

**Code:**

```tsx
export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-[#000000]">
      {/* Container with max-width and padding */}
      <div className="container-main relative h-full">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div 
          className="hero-grid relative grid h-full"
        >
          {/* Overlay content - centered vertically, following grid layout */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center h-full relative z-10">
            {/* Main heading */}
            <h1 className="text-[32px] leading-[40px] tracking-[-1.5px] md:text-[56px] md:leading-[64px] md:tracking-[-2.94px] md:font-medium text-[var(--text-primary)] text-center mb-4 md:mb-6 max-w-xl px-4 md:px-0">
              We help the world understand AI
            </h1>
            
            {/* Subheading */}
            <p className="text-[16px] leading-[22px] tracking-[-0.2px] md:text-[18px] md:leading-[24px] md:tracking-[-0.045px] text-[var(--text-primary)] text-center mb-6 md:mb-8 max-w-sm px-4 md:px-0">
              Join the team that's defining AI visibility for some of the biggest brands in the world
            </p>
            
            {/* Button */}
            <button 
              className="bg-white text-[var(--text-dark)] px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-opacity hover:opacity-80"
            >
              View open roles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Structure:**
- **Main heading (h1)**: Large, prominent text
- **Subheading (p)**: Supporting descriptive text
- **CTA button**: Optional call-to-action

**Typography:**
- Mobile heading: 32px, 40px line-height
- Desktop heading: 56px, 64px line-height
- Mobile subheading: 16px, 22px line-height
- Desktop subheading: 18px, 24px line-height

**Layout:**
- Centered vertically and horizontally
- Full viewport height (`h-screen`)
- Responsive text sizing

**Best for:**
- Landing page heroes
- Section headers
- Prominent messaging

---

## Design Opportunities Component

**Location:** `app/components/DesignOpportunities.tsx`

**What it does:** Displays a card with heading, description, and CTA button. Includes interactive cursor animations (optional).

**Best for:**
- Feature highlights
- Call-to-action cards
- Promotional sections
- Interactive content cards

**Code:**

```tsx
export default function DesignOpportunities() {
  return (
    <div className="relative border border-[var(--divider)]" style={{ height: '172px' }}>
      <div className="relative bg-[var(--bg-black)] hover:bg-[#131313] transition-colors overflow-hidden h-full">
        <div className="container-main relative h-full">
          <div className="relative grid h-full design-opportunities-grid">
            {/* Content spans columns 1-2 on desktop, full width on mobile */}
            <div className="col-span-2 md:col-span-2 px-4 flex flex-col justify-center h-full gap-4">
              {/* Text content (h3 + p) */}
              <div className="flex flex-col gap-2">
                <h3 className="text-h2 text-[var(--text-primary)]" style={{ fontSize: "18px" }}>
                  Design Opportunities at Profound
                </h3>
                <p className="text-body-md text-[var(--text-secondary)]">
                  Explore our design team, philosophy, and opportunities.
                </p>
              </div>
              {/* Button */}
              <div className="flex flex-col">
                <button className="btn-primary w-fit cursor-pointer">
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Structure:**
- **Heading (h3)**: Section title
- **Description (p)**: Supporting text
- **CTA button**: Call-to-action

**Visual Design:**
- Fixed height card (172px)
- Border styling
- Hover effect (background color change)
- Centered content vertically

**Best for:**
- Feature highlights
- Call-to-action cards
- Promotional sections

---

## Component Usage Guide

### When to Use Each Component

#### Mission Statement Component
- **Use when:** You need to display a key message or value proposition
- **Best for:** About sections, value propositions, key messaging
- **Layout:** 2-column span on desktop, full width on mobile

#### Stats/Metrics Component
- **Use when:** You need to display quantitative data or achievements
- **Best for:** Metrics, statistics, performance numbers
- **Layout:** Split across columns 3-4 on desktop, stacked on mobile

#### Process Feature Component
- **Use when:** You need to explain a process or show steps
- **Best for:** How-it-works, step-by-step guides, processes
- **Layout:** Split layout with sticky left side (desktop)

#### Values Component
- **Use when:** You need to display multiple related items in a grid
- **Best for:** Company values, features, benefits, content cards
- **Layout:** 2x2 grid on desktop, stacked on mobile

#### Hero Text Component
- **Use when:** You need prominent, centered messaging
- **Best for:** Landing page heroes, section headers
- **Layout:** Centered, full-width

#### Design Opportunities Component
- **Use when:** You need a simple card with heading, text, and CTA
- **Best for:** Feature highlights, promotional cards
- **Layout:** Fixed height card, content spans 2 columns

### Typography Reference

**Heading Classes:**
- `text-h1`: 56px / 64px line-height (hero headings)
- `text-h2`: 24px / 32px line-height (section headings)
- `text-h3`: 24px / 32px line-height (subheadings)

**Body Classes:**
- `text-body-lg`: 18px / 24px line-height
- `text-body`: 16px / 24px line-height
- `text-body-md`: 16px / 24px line-height
- `text-body-sm`: 14px / 20px line-height
- `text-small`: 14px / 20px line-height (semibold)

**Color Variables:**
- `text-[var(--text-primary)]`: #edf2f5 (main text)
- `text-[var(--text-secondary)]`: #9f9f9f (secondary text)
- `text-[var(--text-muted)]`: #828282 (muted text)

### Grid System

All components use a responsive 4-column grid system:
- **Mobile:** 2 columns (50% each)
- **Desktop:** 4 columns (264px each, max-width 1088px)

**Grid Classes:**
- `col-span-2`: Spans 2 columns (mobile: full width, desktop: 50%)
- `col-span-4`: Spans all 4 columns (full width)
- `md:col-span-1`: Desktop: spans 1 column (25%)
- `md:col-span-2`: Desktop: spans 2 columns (50%)

### Spacing Reference

- `px-4`: 16px horizontal padding
- `px-8`: 32px horizontal padding
- `py-4`: 16px vertical padding
- `py-8`: 32px vertical padding
- `mb-2`: 8px bottom margin
- `mb-4`: 16px bottom margin
- `mb-6`: 24px bottom margin
- `mb-8`: 32px bottom margin
- `gap-2`: 8px gap
- `gap-4`: 16px gap

### Border and Divider Styles

**Solid Borders:**
- `border-[var(--divider)]`: #232323 (standard divider)

**Dotted Dividers:**
- `.dotted-line`: Vertical dotted line pattern
- Used between columns and sections

**Border Combinations:**
- `border-t border-b border-l border-r`: Full border
- `border-t border-l border-r md:border-r-0`: Top, left, right (desktop: no right)
- Custom combinations for grid positioning

---

## Repurposing for New Projects

### Step 1: Copy Component Files
Copy the component files you need:
- `ProcessFeature.tsx`
- `Values.tsx` + `Value.tsx`
- Extract mission/stats sections from `Jobs.tsx`

### Step 2: Copy Required CSS
Ensure these CSS classes are available:
- Grid classes (`.process-title-grid`, `.values-grid`, etc.)
- Typography classes (`.text-h2`, `.text-body`, etc.)
- Layout utilities (`.container-main`, `.dotted-line`, etc.)

### Step 3: Update Content
Replace placeholder content with your own:
- Update text content
- Modify props/data
- Adjust styling as needed

### Step 4: Customize Styling
- Adjust colors using CSS variables
- Modify spacing and sizing
- Update border styles
- Customize typography

### Step 5: Test Responsive Behavior
- Verify mobile layout (2 columns)
- Verify desktop layout (4 columns)
- Test at breakpoint (768px)

---

## Notes

- All components use the same 4-column grid system for consistency
- Typography scales responsively between mobile and desktop
- Components are designed to work independently or together
- Border styling is carefully managed for grid positioning
- Spacing follows a consistent 8px base unit system

