# Carousel Generator

Open-source LinkedIn/Instagram carousel maker built with Next.js 14 (App Router).
Deployed at carouselgenerator.vercel.app.

## Tech Stack

- **Framework**: Next.js 14 (App Router, `"use client"` single-page app)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix primitives)
- **State**: React Hook Form + Zod validation + React Context
- **AI**: OpenAI (gpt-4o-mini) via LangChain function calling
- **Export**: html-to-image + jsPDF (PDF) or JSZip (images ZIP)
- **Carousel UI**: embla-carousel-react
- **Package Manager**: pnpm

## Project Structure

```
src/
  app/
    page.tsx              # Entry: wraps <Editor> in <DocumentProvider>
    layout.tsx            # Root layout: loads 11 Google Fonts as CSS vars
    actions.tsx           # Server action: AI carousel generation
    api/proxy/route.ts    # Edge route: image proxy for CORS in PDF export
    globals.css           # CSS vars (shadcn theme tokens)
  components/
    editor.tsx            # Main layout: sidebar + slides area
    slides-editor.tsx     # Carousel view + AI panel
    settings-panel.tsx    # Left sidebar with vertical tabs (Brand/Theme/Fonts/Numbers/File)
    style-menu.tsx        # Appears when element selected (fontSize, align, lineHeight, letterSpacing, bottomSpacing, objectFit, image)
    main-nav.tsx          # Top bar: Pager + download popover (PDF or Images ZIP)
    slide-menubar.tsx     # Per-slide actions: move, clone, delete
    element-menubar-wrapper.tsx  # Per-element actions: move, clone, delete, change type
    ai-panel.tsx          # "Generate with AI" section
    ai-input-form.tsx     # AI prompt input + generate button
    pager.tsx             # Slide navigation (first/prev/counter/next/last)
    pages/
      document.tsx        # Renders embla Carousel with all slides
      common-page.tsx     # Single slide renderer (layers + elements + footer)
      page-base.tsx       # Slide wrapper with sizing
      page-frame.tsx      # Click handler for slide selection
      page-layout.tsx     # Flex column layout for elements
      new-page.tsx        # "Add slide" button + dialog
      add-element.tsx     # "+" button inside slide + dialog
    elements/
      title.tsx           # Title element (font1, primary color, large text)
      subtitle.tsx        # Subtitle element (font1, secondary color)
      description.tsx     # Description element (font2, secondary color)
      content-image.tsx   # Inline image element + ContentImageFillLayer for Fill mode
      signature.tsx       # Brand name + handle in footer
      footer.tsx          # Signature + page number
      background-layer.tsx    # Solid color background
      background-image-layer.tsx  # Background image overlay
      page-number.tsx     # Slide number display
    forms/
      brand-form.tsx      # Show brand toggle + name, handle, avatar image
      theme-form.tsx      # Palette picker or custom hex colors
      fonts-form.tsx      # Font1 (titles) + Font2 (body) selectors
      page-number-form.tsx  # Show/hide page numbers toggle
      file-form.tsx       # File tab: export/import settings & content, reset
      fields/
        slider-input-field.tsx  # Reusable slider + number input combo
        ...                     # Other reusable form field components
    ui/                   # shadcn/ui primitives (button, dialog, tabs, etc.)
  lib/
    validation/
      document-schema.tsx   # Root: { slides, config, filename }
      slide-schema.tsx      # CommonSlideSchema: { elements[], backgroundImage }
      element-type.tsx      # ElementType enum + discriminated union
      text-schema.tsx       # Title/Subtitle/Description schemas + TextStyleSchema
      image-schema.tsx      # Image/ContentImage schemas + ImageStyleSchema
      theme-schema.tsx      # ThemeSchema: primary/secondary/background hex + palette
      brand-schema.tsx      # BrandSchema: name, handle, avatar
      fonts-schema.tsx      # FontsSchema: font1, font2
      page-number-schema.tsx  # PageNumberSchema: showNumbers boolean
    providers/
      document-provider.tsx   # Root provider: form + all contexts + localStorage persistence
      form-provider.tsx       # Re-export of React Hook Form's FormProvider
      pager-context.tsx       # Current page state + navigation
      selection-context.tsx   # Currently selected element field path
      keys-context.tsx        # OpenAI API key
      editor-status-context.tsx  # Loading/ready status for AI generation
      reference-context.tsx   # DOM ref to carousel for PDF export
    hooks/
      use-component-printer.tsx   # Export: DOM clone → html-to-image → jsPDF (PDF) or JSZip (images)
      use-field-array-values.tsx  # Get field array length from form context
      use-fields-file-importer.tsx  # JSON file import with Zod validation
      use-keys.tsx               # API key state from env
      use-pager.tsx              # Pagination state hook
      use-persist-form.tsx       # localStorage save/load with Zod validation
      use-selection.tsx          # Element selection state
      use-media-query.tsx        # Responsive breakpoint detection
      use-window-dimensions.tsx  # Viewport size tracking
    themes.ts             # 40+ DaisyUI color palettes
    theme-utils.ts        # Color manipulation with culori (contrast, foreground gen)
    pallettes.tsx         # Converts DaisyUI palettes → app Colors objects
    fonts-map.tsx         # 11 fonts: id → { className, displayName }
    page-size.tsx         # Slide dimensions: 400x500px
    field-path.tsx        # Utilities: getSlideNumber, getElementNumber, getStyleSibling, getParent
    text-style-to-classes.ts  # TextStyleSchema → Tailwind classes
    default-document.tsx  # Default doc with 5 slides (Intro, 3 Content, Outro)
    default-slides.tsx    # Template slides per type
    convert-file.tsx      # File → base64 data URL conversion
    langchain.ts          # LangChain OpenAI setup + carousel generation prompt
```

## Data Model

```
Document
├── filename: string
├── config
│   ├── brand: { showBrand, name, handle, avatar: ImageSchema }
│   ├── theme: { primary, secondary, background (hex), isCustom, pallette }
│   ├── fonts: { font1, font2 }
│   └── pageNumber: { showNumbers }
└── slides: CommonSlideSchema[]
    ├── elements: (Title | Subtitle | Description | ContentImage)[]
    │   ├── type: ElementType discriminator
    │   ├── text: string (for text elements)
    │   ├── source: { src, type } (for image elements)
    │   └── style: TextStyleSchema | ContentImageStyleSchema
    └── backgroundImage: ImageSchema
```

**Element types**: Title, Subtitle, Description, ContentImage, Image
**Text style**: fontSize (Small/Medium/Large), align (Left/Center/Right), lineHeight (0.5-4), letterSpacing (-0.1 to 0.5em), paragraphSpacing/bottomSpacing (0-3em)
**Image style**: opacity (0-100), objectFit (Contain/Cover/Expand/Fill)
  - Contain: image fits inside element
  - Cover: image fills element with crop (fixed h-40)
  - Expand: image goes edge-to-edge horizontally (escapes PageFrame p-10 padding via negative margins on wrapper); if first/last element, also removes top/bottom padding
  - Fill: image becomes full-slide background layer (rendered via ContentImageFillLayer at PageBase level)
**Brand**: showBrand toggle controls footer signature visibility

## State Management

All state lives in a single React Hook Form instance (`useForm` with `zodResolver(DocumentSchema)`).
- Wrapped by `DocumentProvider` which composes all context providers
- Components read/write via `useFormContext()`
- Slide/element arrays managed by `useFieldArray()`
- Auto-persisted to localStorage (key: `"documentFormKey"`)
- Validated on load; falls back to defaults if invalid

## Key Patterns

- **Field paths as strings**: `"slides.0.elements.1.style.fontSize"` — used for form access, selection tracking, and style resolution
- **Zod discriminated unions**: Elements dispatched by `type` field
- **Unstyled + Styled schemas**: AI generates unstyled content, merged with style defaults via Zod `.parse({})`
- **Deep clone for mutations**: `JSON.parse(JSON.stringify(obj))` when duplicating slides/elements
- **Menubar wrappers**: `SlideMenubarWrapper` and `ElementMenubarWrapper` add context actions (move/clone/delete/change type) to their children
- **Expand image layout**: CommonPage detects Expand images at first/last position to adjust PageFrame padding (pt-0/pb-0) and PageLayout justify. Negative margins on ElementMenubarWrapper push image edge-to-edge.
- **Export modes**: Download button opens popover with PDF (jsPDF) or Images ZIP (JSZip) options. Both use html-to-image canvas pipeline. Image proxy (api/proxy) handles CORS; falls back to window.location.origin if NEXT_PUBLIC_APP_URL not set.

## Commands

```bash
pnpm dev          # Dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

## Environment Variables

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OPENAI_KEY=     # Client-side OpenAI key (for testing)
OPENAI_API_KEY=""           # Server-side OpenAI key
KV_REST_API_URL=""          # Optional: Upstash Redis for rate limiting
KV_REST_API_TOKEN=""        # Optional: Upstash Redis token
```
