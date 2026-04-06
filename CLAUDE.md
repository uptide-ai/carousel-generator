# Carousel Generator

Open-source LinkedIn/Instagram carousel maker built with Next.js 14 (App Router).
Deployed at carouselgenerator.vercel.app.

## Tech Stack

- **Framework**: Next.js 14 (App Router, `"use client"` single-page app)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix primitives)
- **State**: React Hook Form + Zod validation + React Context
- **AI**: Anthropic Claude Haiku 4.5 via `@anthropic-ai/sdk` tool use
- **Export**: html-to-image + jsPDF (PDF) or JSZip (images ZIP)
- **Carousel UI**: embla-carousel-react
- **Package Manager**: pnpm

## Project Structure

```
src/
  app/
    page.tsx              # Entry: wraps <Editor> in <DocumentProvider>
    layout.tsx            # Root layout: loads 35 Google Fonts as CSS vars
    actions.tsx           # Server action: AI carousel generation
    api/proxy/route.ts    # Edge route: image proxy for CORS in PDF export
    globals.css           # CSS vars (shadcn theme tokens)
  components/
    editor.tsx            # Main layout: sidebar + slides area
    slides-editor.tsx     # Carousel view + AI panel
    settings-panel.tsx    # Left sidebar with vertical tabs (Settings/Theme/Fonts/File)
    style-menu.tsx        # Appears when element selected (fontSize, align, bottomSpacing, objectFit, image)
    main-nav.tsx          # Top bar: Pager + download popover (PDF or Images ZIP)
    slide-menubar.tsx     # Per-slide actions: move, clone, delete
    element-menubar-wrapper.tsx  # Per-element actions: move, clone, delete, change type
    ai-panel.tsx          # "Format with AI" section
    ai-textarea-form.tsx  # AI text paste + format button
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
      brand-form.tsx      # Brand config: show toggle + name, handle, avatar image (inside Settings tab)
      theme-form.tsx      # Palette picker or custom hex colors
      fonts-form.tsx      # Font1 (titles) + Font2 (body) selectors with searchable combobox + per-font style controls
      page-number-form.tsx  # Show/hide page numbers toggle (inside Settings tab)
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
      theme-schema.tsx      # ThemeSchema: primary/secondary/background hex + palette + padding
      brand-schema.tsx      # BrandSchema: name, handle, avatar
      fonts-schema.tsx      # FontsSchema: font1, font2, font1Style, font2Style (fontSize, lineHeight, letterSpacing, fontWeight, textBalance)
      page-number-schema.tsx  # PageNumberSchema: showNumbers boolean
    providers/
      document-provider.tsx   # Root provider: form + all contexts + localStorage persistence
      form-provider.tsx       # Re-export of React Hook Form's FormProvider
      pager-context.tsx       # Current page state + navigation
      selection-context.tsx   # Currently selected element field path
      keys-context.tsx        # API key context (legacy, server-side key used now)
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
    fonts-map.tsx         # 35 fonts: id → { className, displayName }
    page-size.tsx         # Slide dimensions: 400x500px
    field-path.tsx        # Utilities: getSlideNumber, getElementNumber, getStyleSibling, getParent
    text-style-to-classes.ts  # TextStyleSchema → Tailwind classes
    default-document.tsx  # Default doc with 5 slides (Intro, 3 Content, Outro)
    default-slides.tsx    # Template slides per type
    convert-file.tsx      # File → base64 data URL conversion
    langchain.ts          # Anthropic Claude SDK + carousel generation prompt
```

## Data Model

```
Document
├── filename: string
├── config
│   ├── brand: { showBrand, name, handle, avatar: ImageSchema }
│   ├── theme: { primary, secondary, background (hex), isCustom, pallette, padding }
│   ├── fonts: { font1, font2, font1Style, font2Style }
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
**Text style** (per-element override): fontSize (8-200px, optional — if unset computed from global), align (Left/Center/Right), paragraphSpacing/bottomSpacing (0-3em)
**Font style** (global per-font in config.fonts): fontSize (8-200px, default font1=48, font2=18), lineHeight (0.5-4), letterSpacing (-0.1 to 0.5em), fontWeight (100-900), textBalance (boolean → `text-wrap: balance`)
**Font size proportional scaling**: Title uses global font1 fontSize directly. Subtitle uses font1 fontSize × 0.65. Description uses global font2 fontSize. Per-element fontSize override takes priority over global.
**Slide padding**: configurable via `config.theme.padding` (0-80px, default 40px) — controls inner padding of all slides
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
- **Quick-add (no dialogs)**: "+" for new slide directly creates a Content slide (no type picker dialog). "+" for new element directly adds a Description element (no type picker dialog). Dialog components are commented out but preserved for future use (`new-page-dialog-content.tsx`, `new-element-dialog-content.tsx`). Users change element type after creation via the element menubar's swap button.
- **Keyboard navigation**: Arrow keys navigate between slides via a global `document` keydown listener in `carousel.tsx`. Listener skips navigation when focus is on a `textarea`, `input`, or `contentEditable` element, allowing normal text cursor movement.

## AI Formatting (Format with AI)

### Flow
1. User pastes text in `AITextAreaForm` → sent directly to server action (text is passed as-is)
3. Claude Haiku 4.5 responds via **tool use** (`carouselCreator` tool) with structured JSON
4. Response validated against `UnstyledDocumentSchema` (Zod safeParse)
5. Valid output transformed to `MultiSlideSchema` (adds default styles: fontSize, align, etc.)
6. `setValue("slides", generatedSlides)` **replaces all slides** in React Hook Form state
7. UI re-renders, localStorage auto-saves

### How the AI knows the schema
- `zodToJsonSchema()` converts Zod schemas into JSON Schema sent as the tool's `input_schema`
- `z.string().max(160)` becomes `"maxLength": 160` in JSON Schema
- `z.discriminatedUnion` becomes `anyOf` with `$ref` to each element type
- `tool_choice: { type: "tool", name: "carouselCreator" }` forces Claude to respond in this exact format

### Security
- System prompt, tool schema, and raw AI response are **server-side only** — never sent to the browser
- Browser only sees the user's own input and the final parsed slides array
- API key is in `ANTHROPIC_API_KEY` env var, never exposed to client

### Debug logging
- `langchain.ts` has collapsible `console.groupCollapsed("[AI] Request/Response")` logs
- Visible in the **terminal** running `pnpm dev` (not in browser)
- Shows: prompt, model, system prompt, tool schema, usage, stop reason, full tool output
- To disable: comment the blocks between `--- AI Debug Logs ---` markers

### AI Output Schema (Unstyled)
```json
{
  "slides": [
    {
      "elements": [
        { "type": "Title", "text": "Your Title Here" },
        { "type": "Subtitle", "text": "A subtitle" },
        { "type": "Description", "text": "Short description" }
      ]
    }
  ]
}
```
After validation, Zod applies default styles (align: "Left", lineHeight: 1.3, etc.) and adds empty `backgroundImage` to each slide. fontSize is left unset (optional) so elements inherit from global font size.

### Capabilities & Limitations
- **Format only** — AI organizes/splits provided text into slides, does NOT generate new content
- **Create only** — formatting replaces all existing slides
- **Text elements only** — outputs Title (max 160 chars), Subtitle (max 160 chars), Description
- **No images from AI** — images must be added manually after formatting
- **8-15 slides** per formatting, 2-3 elements per slide

### Key Files
- `src/lib/langchain.ts` — system prompt, Anthropic SDK client, tool schema, validation, debug logs
- `src/app/actions.tsx` — server action wrapper with optional rate limiting (Upstash Redis)
- `src/components/ai-textarea-form.tsx` — textarea for pasting text, calls server action, updates form state
- `src/lib/validation/slide-schema.tsx` — `UnstyledDocumentSchema`, `MultiSlideSchema`

### Persistence & Images
- All state (slides, config, images) auto-saved to **localStorage** (key: `"documentFormKey"`)
- Uploaded images converted to **base64 data URL** via `convert-file.tsx` — stored inline in form state, no server upload
- Images persist across page reloads (via localStorage)
- localStorage limit ~5-10MB depending on browser

### Rate Limiting (optional)
- Uses Upstash Redis via `KV_REST_API_URL` + `KV_REST_API_TOKEN` env vars
- Limits AI generation requests per IP
- Only active when both env vars are set; otherwise no rate limiting

## Commands

```bash
pnpm dev          # Dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

## Environment Variables

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=""        # Server-side Anthropic key (Claude Haiku)
KV_REST_API_URL=""          # Optional: Upstash Redis for rate limiting
KV_REST_API_TOKEN=""        # Optional: Upstash Redis token
```
