# Design Improvement Plan: Joboy.dev (Public Site + Admin)

## Progress log

Implementation started 2026-09-28. Verified after each chunk with `npx tsc --noEmit` and `npm run build` (both clean throughout). No visual/browser QA tool was available in this environment — changes are verified by type-check, build, and code review only; a manual pass in the browser is still recommended before shipping.

- [x] **Step 1 (Phase 0 foundation)** — `app/globals.css` rewritten: removed the global `*` transition, fixed color tokens for AA contrast (`--primary-strong`, `--primary-soft`, unified stone grays, `--card` now elevated in dark mode), added radius/shadow/z-index/motion CSS tokens, fixed `.page-padding`/`.nav-padding` to self-center in a 1200px column via `max()` (no markup changes needed), added `lib/motion.ts` JS timing tokens, `disableTransitionOnChange` on `ThemeProvider`. Hygiene: deleted unused `components/shared/styles.ts` and `AuthNavbar.tsx`, removed all `console.log`s, fixed the `bg-gradeint-accent` typo and every broken dynamic-Tailwind-class (`ProgressBar`, `Breadcrumb`, `Form.tsx`), fixed `width="100%%"` typo, fixed `Emai Address` / `Oops!` / "Let us" copy.
- [x] **Step 2 (motion tokens + hero)** — `Reveal`/`RevealGroup`/`RevealItem` rewritten on `transform` strings with a reduced-motion fade fallback; `TypewriterHeading` timing tightened; home hero timeline cut from ~2.3s to ~0.7s total; removed the purposeless `animate-pulse` decorative blobs on Home and About heroes; rewrote `not-found.tsx`.
- [x] **Step 3 (Button, LinkButton, Badge, Card)** — removed `hover:scale` + `transition-all` everywhere, added proper `focus-visible` rings and a single `transition-[...]` property list; `LinkButton` now renders a real `<a target="_blank">` for external URLs instead of relying on `window.open`; `Badge` no longer borrows Button's clickable styling (static chips are `<span>`, only real `onClick` badges become `<button>`); `Card` only lifts on hover when it is actually a link (`linkTo`), and the always-on gradient top bar is now a hover-revealed accent edge on link cards only.
- [x] **Step 4 (Dialog primitive)** — added `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs` (plan decision D3). New `components/shared/modal/Dialog.tsx` gives every overlay focus trap, Escape, focus return, and body scroll lock for free, with framer-motion enter/exit. `Modal`, `FormModal`, and `ConfirmationModal` all rebuilt on it. `ConfirmationModal`'s Cancel/Confirm colors were swapped back to correct semantics (Cancel = neutral, Confirm = danger only when destructive). `DropdownButton` rebuilt on Radix's dropdown-menu (real keyboard nav, `role="menu"`, origin-anchored scale-in). `FormModal`'s close button is no longer a red "danger" button, and it no longer auto-closes the instant `onSubmit()` fires — it now only closes when the calling page's own async handler decides to (fixed one real bug this exposed: `Gallery.tsx`'s upload form was relying on that premature auto-close and would otherwise never close; it now awaits and closes on success, toasts on failure).
- [x] **Step 7 (admin delete safety)** — every unconfirmed destructive action is fixed: added `lib/hooks/useConfirm.tsx` (a promise-free `confirm({ onConfirm })` helper backed by `ConfirmationModal`) and wired it into all 10 admin delete sites that previously deleted on a single click with no confirmation (awards, certifications, education, experience, messages, projects, services, skills, testimonials, and `FileCard`). Each confirm dialog names the item being deleted, shows a loading state, and closes only after the delete actually succeeds (via `.unwrap()`); a failure keeps the dialog open and shows an error toast instead of silently discarding the attempt.
- [x] **Step 5 (Tabs, Pagination, SearchField, core form fields)** — `NavigationBar` rebuilt on `@radix-ui/react-tabs` with a shared `layoutId` sliding pill and a fade-in on content switch (real `tablist`/`tab`/`tabpanel` roles, arrow-key navigation, `min-h-screen` removed per the plan). `Pagination` rewritten as a windowed page list (first/last/current±1 + ellipsis, 40px targets, `aria-current`, a mobile "Page X of Y" fallback instead of every page rendering off-screen). `SearchField` rewritten: single input, debounced (350ms) auto-search plus Enter-to-search-now and Escape-to-clear, inline clear button, dropped the separate submit button and the redundant "Searching for:" badge. `FormInput`/`TextAreaInput` now link `label`/`id`, set `aria-invalid`/`aria-describedby`, and use `:focus-within` instead of a manual focus-state hook; `PasswordInput`'s show/hide toggle is now a real `<button>` with `aria-pressed` instead of an unlabelled clickable icon. (`DropdownButton`, listed under Menu in the plan, was already done in the previous stage.) Not done: the more specialized fields (`SelectField`/react-select, `DateInput`, `PhoneInput`, `CurrencySelect`, `SelectLocationFields`, `DynamicFormGroup`, `FileSelectField`, Tiptap/Markdown editor fields) — still on the old styling.
- [x] **Step 6 (Skeletons, EmptyState, Image, Avatar, Toasts)** — `ListEmpty` is now a compact, quiet empty state (icon in a tinted square, no more `h-[50vh]`). `Avatar` initials fixed from invisible white-on-muted to a readable tinted tone. `Image` no longer sets `cursor-pointer` on non-clickable images, no longer mounts a hidden preview dialog when `showImageInModalOnClick` is off, and gets an opacity fade-in when `showLoader` is used. Toasts are now themed once globally (`app/layout.tsx`'s `<Toaster toastOptions>`) off the same CSS tokens as the rest of the UI instead of hardcoded `color: "green"/"red"` inline styles that ignored dark mode; fixed `toaster.info` actually calling `toast.error`. Added the shaped skeleton building blocks the plan calls for (`SkeletonProjectCard`, `SkeletonBlogCard`, `SkeletonListRow`, `SkeletonHero`) and wired the first two in: the public Projects and Blog list pages now show content-shaped skeletons instead of blanking the entire page (hero, toolbar and all) into a spinner on every load or search keystroke. `SkeletonListRow`/`SkeletonHero` exist but aren't wired into any page yet. next/image migration was intentionally skipped — the app loads images from a backend-controlled host `next/image` doesn't know about, and configuring `remotePatterns` blind (without confirming the actual media domain) risks silently breaking every image.
- [x] **Skeleton loaders site-wide** (user request, ahead of plan order) — every `isLoading ? <Loading/> : (...)` spinner gate in the app (23 files: all 10 admin CRUD pages, files/profile admin pages, admin auth-check shell, all 6 About tabs, About/Home/Project-detail/Blog-detail pages, and the dead-code Gallery widget) now shows a skeleton shaped like that page's real content instead of a full-page spinner. Added `AdminListSkeleton`, `SkeletonTimelineItem`, and reused the earlier `SkeletonProjectCard`/`SkeletonBlogCard`/`SkeletonCard`/`SkeletonHero`. The Next.js route-level `app/loading.tsx` fallback is now a generic skeleton shell too. Found and fixed two real bugs along the way: (1) `useAuth.ts` retried a failed session check forever with no backoff or retry limit, capable of flooding the network tab; now it retries once and then logs out cleanly. (2) The admin Profile page shared one `isLoading` flag between the initial fetch and the Save submit, so clicking Save blanked the entire form back to a spinner every time; it now only skeleton-gates the true first load.
- [x] **Hero height, Projects/Blog listing** — tuned twice on feedback; settled on `min-h-[45vh]` with a single-line heading (was `min-h-[80vh]` with a 2-line `text-7xl` headline).
- [x] **X (Twitter) icon fix** — Home and About were using `FaX` (react-icons' plain letter-X/close glyph), not the brand logo; swapped to `FaXTwitter` in both places.
- [x] **Floating WhatsApp button** — new `WhatsAppButton.tsx`, fixed bottom-right on every public page (added to the `(external)` layout and to Home, which renders its own chrome outside that layout group). Hides itself if no `whatsapp_url` is set.
- [x] **Home page content** — added an "About teaser" section (bio + the stats that were previously hidden inline in the hero) and a real "Selected Work" section showing up to 3 featured projects with a "View all projects" link — the home page previously showed zero actual project content.
- [x] **Footer rebuild** — was a single logo + copyright line; now three columns (brand/bio/socials, Explore nav, Get in touch with email/location/résumé) plus a bottom bar with copyright and a "Back to top" control, all driven by real profile data.
- [x] **Step 8 (public chrome: Navbar, CTASection)** — `PublicNavbar` rebuilt: fixed `h-16`, border now appears only after scroll (via framer's `useScroll`, not a raw scroll listener), active-link matching uses `pathname.startsWith` with a shared `layoutId` underline, a persistent "Get in touch" button that opens `ContactForm` directly, and the mobile menu is now a real sheet (`clip-path` reveal, staggered links, closes on route change and Escape, `aria-expanded`/`aria-controls` on the toggle). `CTASection` restyled off the plan's spec — a quiet `bg-card` block with a soft emerald corner glow instead of a full emerald band, which fixes a real contrast failure (white text/button on a ~2.5:1 emerald background failed AA; the old "ghost + bg-white" button also silently risked losing its override to Tailwind's utility-ordering, not class order).
- [x] **Project/Blog cards + project detail bugs** — `ProjectCard` had a real HTML-validity bug (`<MarkdownRenderer>`'s block output nested inside a `<p>`); fixed. Both `ProjectCard` and `BlogCard` now wrap the image and title in a real `Link` (bigger click target) while keeping the action-button row as plain buttons/anchors outside any anchor (avoids illegal nested-`<a>` markup). External project links (`live_link`, `github_link`, etc.) are now real `<a target="_blank">` elements with `aria-label`s instead of unlabelled icon buttons calling `window.open`. Found and fixed a real logic bug on the project detail page: the "similar projects" filter compared `project.id !== project?.id` where the callback parameter shadowed the outer `project`, so the filter always evaluated false and the section could never show anything even when it rendered; it also ran synchronously against stale Redux state right after dispatching the fetch. Rewrote as two effects — fetch the project, then once it has actually loaded, fetch related-by-tag projects and filter using `.unwrap()`'s resolved data. The screenshot gallery's prev/next controls are now real 40px `<button>`s with labels and `disabled` states, arrow-key navigation was added to the gallery, and thumbnails use an `outline` ring instead of a `border-3` that shifted layout. Removed `min-h-screen` from the project/blog "similar/related" sections and the blog article body (was forcing a full viewport of empty space under a three-paragraph post), and fixed the article body to use a real `max-w-[68ch]` reading measure instead of dead `prose` classes from an uninstalled Tailwind Typography plugin. Bumped `.markdown-content` to a slightly larger base size (17px) for comfortable reading.
- [x] **Step 9 (Home Stack/Services restyle)** — turned out to already be done (part of an earlier, unlogged "ui: redesign" commit): Stack is a plain logo grid (name + logo, no progress bars), Services is the 2-column hairline-divided list from the plan. Not done and left alone: grouping Stack into Frontend/Backend/Tooling sub-headings — `Skill` has no category field, so this needs a backend schema change first; the mobile marquee was explicitly optional in the plan and was skipped. The "99% Client Satisfaction" fake stat (D2) is also still there — still waiting on you to confirm whether it's real data or should be swapped for a real count.
- [x] **Step 10 (Projects list + detail)** — List page: hero is now left-aligned with a plain-color H1 (was centered with gradient text on "Projects", one of the taste-skill "AI tells" this plan calls out), bumped to `min-h-[50vh]`. Toolbar is now `sticky` under the nav with horizontal-scrolling domain filter chips instead of a dropdown, plus a live result count. Featured section becomes a 1-large/2-stacked asymmetric grid when there are 3+ featured projects (falls back to a plain grid otherwise) instead of uniform equal-size cards. Refetches (search, filter, pagination) now dim the existing grid to 60% opacity instead of unmounting it into a full skeleton — only the true first load shows the skeleton. Detail page: added a "← Projects" back link (P-something: dead-end pages had no way back), dropped `min-h-screen` on the header section (was forcing full-viewport height even for short content), collapsed the six separate `<h2>` metadata blocks (Project Type/Role/Domain/Client/Timeline/Status — six headings for what's really one line of facts) into a single wrapping `<dl>` row, and replaced the external action buttons (`<Button onClick={() => window.open(...)}>`, which breaks middle-click/ctrl-click/right-click-to-copy) with `LinkButton`, which already renders a real `<a target="_blank">` for external URLs.
- [x] **`ProjectCard`/`BlogCard` — whole card as one link** (user request, revisits Step 10/11) — both cards now use a single click/tap target covering the entire card instead of a separate "View Project"/"Read Post" button. `BlogCard` uses `Card`'s existing `linkTo` prop (no external links inside it, so wrapping everything in one `<Link>` is safe). `ProjectCard` has external action links (live/GitHub/Figma/Drive/Postman) that must stay real, independently-clickable `<a>` tags — nesting them inside the card's own `<Link>` would be invalid HTML (`<a>` inside `<a>`) and would break their click targets, so it uses a "stretched link" pattern instead: an absolutely-positioned `<Link>` covers the card as a DOM *sibling* of the external-links row (not an ancestor), with the visible content in between marked `pointer-events-none` so clicks fall through to it. Both cards get a `group-hover` lift/shadow/accent-bar for a clear hover state.
- [x] **Step 11 (Blog list + detail)** — done alongside the card rewrite above: list hero is left-aligned/plain-color (was centered + gradient "Blog", same taste-skill tell as Step 10), toolbar is sticky, first post on page 1 with no search renders as a large horizontal featured card (`BlogCard featured`), refetches dim the existing grid instead of unmounting to a full skeleton. Added `getReadTime()` (`lib/utils/formatter.ts`, ~200wpm estimate from the post's markdown content) and show it next to the date on every card. **Not done:** the blog detail page's own markdown/reading-experience polish from §5.7 (reading-progress bar, code-block copy button, previous/next post links) — the body already got a reading-width/typography pass in an earlier session, but those three additions haven't been built yet.
- [x] **`ProjectCard` click-target hardening** (follow-up to the above) — the stretched-link `<Link>` was at `z-0`, same implicit stacking level as the plain, non-positioned content sitting after it in the DOM; bumped it to an explicit `z-10` (content stays unpositioned, so there's no ambiguity about which layer wins) and the external-links footer to `z-20` above that. `pointer-events-none` on the content was already correct and stays as a second line of defense.
- [x] **Step 12 (About)** — Hero: `min-h-screen` → `min-h-dvh` (F2/P7 — same iOS-Safari-viewport-jump issue fixed elsewhere), portrait frame changed from a solid `border-2` to an offset `ring-1 ring-primary/30 ring-offset-4` (a "static frame" per the plan, not a border touching the edge). Copy pass: the page had its own two duplicate contact-CTA labels ("Contact Me", "Start a Conversation") plus Home had a third ("Start a Project") — all three are now "Get in touch", matching the label Navbar/Footer already use (P1). Skills tab was already exactly per spec (logo grid, level word, no bars) — no change needed. Experience/Education: the "Show details" disclosure was doing `{isOpen && <div className="animate-fade-in">}` — `animate-fade-in` is dead CSS (the plugin that would have registered it was removed earlier this session per F8), so this was popping open with no transition at all; replaced with a real `grid-template-rows: 0fr → 1fr` reveal (M8b) on both tabs. Certifications and Awards were the exact "three equal cards" tell the plan calls out (P5) — rewritten as compact hairline-divided rows (logo, name, issuer · date, and a real `<a>` verify-credential icon on Certifications, replacing another `window.open` button). Testimonials: added a "Read more"/"Show less" toggle for messages over 140 characters (the `line-clamp-3` had no way to read the rest before), and swapped a hardcoded `text-yellow-400` for the `--warning` token. **Not done:** `?tab=` URL sync for deep-linking tabs — explicitly optional in the plan, and would mean touching the shared `NavigationBar`/Tabs component, not just this page.
- [x] **Step 13 (Admin shell + Dashboard)** — Sidebar: extracted its nav data into `lib/constants/adminNav.ts` (shared with the new top bar's page-title lookup, so they can't drift apart). Collapse state now animates (`transition-[width]` on `--dur-base`/`--ease-drawer`, was an instant snap — A3) and persists to `localStorage`. Fixed the duplicate `Award` icon on Skills *and* Certifications (A3) — Skills is now `Sparkles`, Certifications `BadgeCheck`. Mobile no longer permanently shows a squashed icon rail (a one-time `window.innerWidth` check on mount that never responded to resize) — it's hidden entirely on `md:` down and opens as a real left-sliding sheet (backdrop, Escape/outside-click via the same `AnimatePresence` pattern the public mobile nav uses, closes on route change) triggered by a hamburger in the new top bar. Top bar: new `AdminTopBar.tsx` replaces the old empty `<div></div>` (A4) with the current page's title (from the shared nav map), is `sticky top-0`, and the layout no longer nests a second scroll container (`overflow-y-scroll h-screen` on the content pane, A4) — the sidebar is `sticky top-0 h-screen` instead, and the page scrolls on `body` like the plan asks. Dashboard: stat tiles now use `font-mono font-tabular` for the numbers; added **Recent Messages** and **Recent Content** (latest 5 projects+blogs merged by date, each with its Draft/Published badge) — for messages and blog this replaced the old `per_page: 1`-just-for-the-count fetch with `per_page: 5`, so the same request now serves both the stat tile and the list, at no extra cost. Skeletons added for both new panels. **Not done:** quick actions still navigate to the list page rather than opening its create modal directly (`?new=1`, per the plan) — that means touching all 10 list pages' modal-open logic just for this entry point, scoped out for Step 14 instead, where those pages get touched anyway.
- [x] **Step 14 (List-page template, Messages inbox)** — Applied the two mechanical fixes from §6.3 across all 10 CRUD list pages (awards, certifications, education, experience, projects, services, skills, testimonials, blog, files) plus messages:
  - **A2 (never unmount into a spinner on refetch):** every page's `isLoading ? <Skeleton/> : (...)` became `isLoading && !hasLoadedOnce.current ? <Skeleton/> : (...)`, with the previously-rendered list dimmed to 60% opacity (`aria-busy`) instead of disappearing, on every search/filter/pagination refetch. Only the true first load shows the full skeleton now — same pattern already proven on the public Projects/Blog pages.
  - **A6 (duplicate title):** `ListSection`'s `title` prop is now optional (falls back to just showing `subtitle` next to the icon) — each page's breadcrumb already says "Award Management" etc., so `ListSection` repeating the exact same string right underneath it was pure noise. Same fix applied to `ActionBreadcrumb` (`action`/`actionLabel` now optional, so a page with nothing to create doesn't need a fake no-op button — used by the new Messages page below).
  - **Messages → Inbox:** full rewrite per §6.3's page-specific spec. Two-pane layout (list | reading pane) on `md+`, single pane with a "← Back" button on mobile. Bold name + a filled dot for unread messages, relative time (`formatRelativeTime`, new in `formatter.ts`) in the list, "Reply" as a real `mailto:` link with the subject prefilled, delete moved into the reading pane. Removed "Add Message" entirely (admins don't create inbound messages, per the plan) — one honest limitation: the backend `Message` model has no `is_read` column, so read state is tracked client-side only (`localStorage`, per browser) rather than being a real synced field; noted in a code comment rather than pretending it's server state.
  - **Files:** already done in the earlier file-management pass (dynamic categories, thumbnail grid, bulk delete) — nothing further needed here.
  - **Not done:** the rest of the "AdminListPage" template unification (a literal dense table on `md+` with columns, always-visible actions on touch, a per-page-size selector) — the 10 pages already share `ListCard`/`ListSection`/`Pagination`, and restyling every one into a genuinely different (table) layout is a much larger, higher-risk rewrite that really needs live browser verification, which this environment doesn't have. Scoped out rather than shipped unverified.
- [x] **Step 15 (Forms, Profile, Login)** — Profile (§6.3 "Profile" + §6.4): was already organized into `FormSection` blocks (Identity/Basic Info, Location, Bio, Interests, Social Links) from earlier work, so that part of the plan turned out already done. Added the one real gap: `FormWrapper` gained an opt-in `stickyFooter` prop — when set, the submit button moves into a `sticky bottom-4` bar that only renders while `methods.formState.isDirty` is true (via `AnimatePresence`), and disappears again once the save succeeds and the form resets to the fresh server data. Kept off by default so `LoginForm` (the component's other consumer) is untouched. Login (§6.5): removed the "Register" tab (A9 — the feature is permanently disabled, the tab just linked to a dead end) and deleted the now-fully-unreachable `RegisterForm.tsx`; page is now a single centered `max-w-sm` card on `bg-secondary/50` with the same `hero-texture` backdrop used elsewhere, logo above the card instead of a duplicate heading (the card's own `FormWrapper` title already says "Welcome back"). **Not done — explicitly scoped out, not forgotten:** D5's dedicated edit-route migration for Projects/Blog (`/admin/projects/[id]` instead of the modal). Their forms are the two largest and most complex in the admin (Projects' alone is 700+ lines with tag-attach/file-upload sub-modals). Rebuilding that as routed pages with deep-linking and state hydration is a real architecture change, not a styling pass, and shipping it unverified in a sandbox with no live browser felt like the wrong risk to take. Recommend doing this one as its own reviewed pass with real browser testing, not folded into this sweep.
- [x] **Copy pass sweep (§5.8)** — grepped the whole app for the three concrete violations the plan calls out: `Let us` / `Oops!` (zero hits — already clean from earlier work) and em dashes in actual rendered UI copy (one hit, a `FileCard` modal description, reworded to a plain comma clause). Also re-swept for `console.log` (zero) and stray `window.open` outside of dropdown-menu actions and dynamic-URL cases, which are the established, consistent pattern elsewhere in this codebase — left those alone.
- [ ] **Still open, by choice, not oversight:** §7's Lighthouse/axe-driven accessibility and performance audit (no browser in this environment — everything gated on `tsc`/`eslint`/`next build`, so this genuinely needs a person or a real browser tool); D2 (drop or justify the "99% Client Satisfaction" stat — still waiting on you); D4 (`react-hot-toast` → `sonner` migration — cosmetic upgrade, never blocking, never picked up); D5 (dedicated Projects/Blog edit routes, see above); Stack category grouping on Home (needs a new `Skill.category` backend field, flagged back in Step 9). None of these block anything else in the plan.


> Status: PLAN ONLY. No source code has been changed yet.
> Base commit: `375d16b` (main)
> Stack: Next.js 15 (App Router, client pages), React 19, Tailwind v4 (CSS-first `@theme`), framer-motion 12, Redux Toolkit, lucide-react + react-icons, react-hot-toast.

---

## 0. Design read and guiding principles

**Design read (taste-skill §0.B):**
*Reading this as a **redesign that preserves the brand** of a developer portfolio for recruiters and prospective clients. The visual language is technical but warm: emerald on warm stone, Bricolage Grotesque with IBM Plex. The plan leans toward Tailwind v4 tokens, restrained and purposeful motion, and a crisp "Operate" admin CMS.*

**Mode split (impeccable "Modes"):**

| Surface | Mode | What success means | Dials (variance / motion / density) |
|---|---|---|---|
| Home, About, Projects list | Persuade / Experience | Visitor grasps who you are in 5s and clicks into work | 6 / 5 / 4 |
| Project detail, Blog detail | Read | Visitor reads comfortably and finds the next thing | 5 / 3 / 3 |
| Admin (`/admin/**`) | Operate | You finish CRUD tasks fast, safely, without surprises | 3 / 2 / 6 |

**Principles (apply in every phase):**
1. **Preserve the brand, fix the craft.** Keep the emerald accent, the warm stone neutrals, the three fonts, the `//` code motif, and all routes and slugs. Change how the pieces are built, not who the site is (taste-skill §11, redesign-skill "Fix Priority").
2. **Every animation needs a reason** (feedback, state change, spatial continuity, or storytelling). Anything used tens of times a day gets little or no motion (emil-design-eng decision framework).
3. **Only `transform` and `opacity` animate.** Nothing else.
4. **Tokens before components, components before pages.** Most of the visible wins come from fixing about 15 shared primitives.
5. **Accessibility is part of the design.** Contrast, focus, keyboard, and reduced motion are acceptance criteria (ui-ux-pro-max priority 1 and 2).

**Skills this plan draws on (and where each applies):**

| Skill | Used for |
|---|---|
| `taste-skill` | Public page audit, anti-slop rules (eyebrow cap, CTA intent, gradient text, fake-UI tells, hero discipline) |
| `redesign-skill` | Audit checklist and fix-priority order |
| `ui-ux-pro-max` | Design-system query, UX guideline checks (focus, confirmation dialogs, content jumping, sticky nav) |
| `emil-design-eng` + `improve-animations` (AUDIT.md) | Motion audit, exact easing and duration values, interruptibility |
| `impeccable` | Mode split, admin "Operate" guidance, polish/harden passes |
| `design-system` | Three-layer token architecture (primitive → semantic → component) |
| `apple-design` | Sheet and drawer physics, reduced-motion behavior |
| `ask-sonner` | Toast migration (if approved, see §9) |
| `find-animation-opportunities` | "Missed opportunity" list in §3.3 |

---

## 1. Audit: what is wrong today

Severity: **HIGH** = broken or feel-breaking. **MED** = clearly off. **LOW** = polish.

### 1.1 Foundation (global CSS, tokens, layout)

| # | Sev | Where | Finding |
|---|---|---|---|
| F1 | HIGH | [globals.css:171-176](app/globals.css#L171-L176) | `* { transition-property: color, background-color, …, transform, … 150ms }` puts a transition on **every element**. It fights framer-motion transforms, makes theme switches ripple unevenly, and adds style work to every hover. This is the biggest cause of "animations aren't smooth". |
| F2 | HIGH | [globals.css:217-219](app/globals.css#L217-L219) | `.page-padding` uses `lg:px-[300px]`. At the 976px `lg` breakpoint that leaves **376px** of content width. Layout is cramped on laptops and too wide on large screens. There is no `max-width` container. |
| F3 | HIGH | `:root` tokens | Contrast failures. `#10b981` on white is **2.5:1** and white on `#10b981` is **2.5:1** (AA needs 4.5:1). This affects every primary button, `text-primary` taglines, company names, eyebrows, active nav, and the white CTA button on the emerald CTA band. |
| F4 | MED | `:root` / `.dark` | Mixed gray families: warm stone (`#f4f3f0`, `#746f6a`) next to neutral (`#e5e5e5`, `#d1d5db`, `#2a2a2a`). In dark mode `--card` equals `--background` (`#0e0c0a`), so cards have no elevation. |
| F5 | MED | [lib/constants/styles.ts](lib/constants/styles.ts) | Variant bugs: `bg-gradeint-accent` (typo, renders nothing). `primary` has `hover:bg-primary/80`, which does nothing because `background-image` sits on top. `dangerOutline` hover makes text the same color as its background (invisible). `outline` hover gives `text-foreground` on emerald. [components/shared/styles.ts](components/shared/styles.ts) is a stale duplicate. |
| F6 | MED | Form.tsx, ProgressBar.tsx, Breadcrumb.tsx | Dynamic Tailwind classes (`w-[${width}%]`, `bg-${backgroundColor}`, `text-${titleSize}`) are never generated by Tailwind v4. Login card background and ProgressBar width silently fall back. `width="100%%"` typo on home. |
| F7 | MED | globals.css | No radius, shadow, z-index, or motion tokens. Radii are mixed (`rounded-xl` Button, `rounded-lg` LinkButton, `rounded-sm` images). Z-index values are ad hoc (`z-10` nav, `z-40/50` modals). |
| F8 | LOW | globals.css | `animate-fade-in` is used in Experience.tsx and elsewhere but `tailwindcss-animate` is never registered, so it is dead. `.animate-float` is unused. |
| F9 | LOW | [layout.tsx](app/layout.tsx) | `ThemeProvider` has no `disableTransitionOnChange`, which combines badly with F1. Custom breakpoints (`sm 480 / md 768 / lg 976`, no `xl`) have no step for wide screens. |

### 1.2 Motion (improve-animations categories)

| # | Sev | Category | Where | Finding |
|---|---|---|---|---|
| M1 | HIGH | Purpose / duration | [page.tsx:136-160](app/page.tsx#L136-L160) | Hero timeline is **2.3s** before the bio and stats appear (typed lines at 0.1/0.65/1.2s, cursor 1.75s, bio 2.1s, stats 2.3s). The page feels slow on every visit. |
| M2 | HIGH | Performance | F1 + `Card` `transition-all duration-300` + Button/LinkButton `transition-all` | `transition: all` everywhere animates unintended properties off the GPU. |
| M3 | HIGH | Missing exit | Modal, FormModal, ConfirmationModal, DropdownButton, mobile nav | All mount and unmount with `if (!isOpen) return null`. No enter or exit, and no Escape key, focus trap, or scroll lock. Open and close feel like teleporting. |
| M4 | MED | Physicality | Button, LinkButton | `hover:scale-[1.02]` on every button, including icon rows and admin list actions (seen tens of times a day). Hover scale is not gated to `(hover: hover)`, so it misfires on touch. |
| M5 | MED | Physicality | [Card.tsx:622](components/shared/card/Card.tsx#L622) | `hover:-translate-y-1 hover:shadow-xl` at 300ms on every card, including non-clickable ones (skills, services, Overview tabs). Lifting a card that isn't a link implies an affordance that isn't there. |
| M6 | MED | Cohesion | Reveal, TypewriterHeading, page.tsx | Easing is hand-typed `[0.4,0,0.2,1]` (weak Material standard) and `[0.65,0,0.35,1]`. No shared tokens. Stagger is done by passing `index * 0.08` delays instead of parent variants. |
| M7 | MED | Decorative loops | page.tsx, about/page.tsx | Two `animate-pulse` gradient squares behind the hero asset loop forever with no purpose. Reduced motion does not stop them. |
| M8 | MED | Missing transitions | NavigationBar tabs, SlidePanel tabs, project gallery, Experience "Show details" | Content swaps instantly. The active tab pill jumps. The gallery image hard-cuts. The accordion pops open with no height reveal. |
| M9 | MED | Drawer curve | [SlidePanel.tsx:1131](components/shared/SlidePanel.tsx#L1131) | `transition-transform duration-300 ease-in-out` is the wrong curve for a drawer, and exit is the same speed as enter. |
| M10 | LOW | Accessibility | globals.css | CSS animations (`animate-pulse`, `animate-spin`, hover transforms) have no `prefers-reduced-motion` handling. Only the framer components check it. |
| M11 | LOW | Loading | [app/loading.tsx](app/loading.tsx) | A full-screen spinner replaces whole pages (public and admin), and even whole tab panels on About. Swapping spinner to content is the most visible "jank" moment. |

### 1.3 Components

| # | Sev | Component | Finding |
|---|---|---|---|
| C1 | HIGH | Modal / FormModal | No `role="dialog"`, `aria-modal`, labelled title, Escape, focus trap, focus return, or body scroll lock. FormModal close is a red "danger" button with a literal `x`. |
| C2 | HIGH | ConfirmationModal | "Cancel" is styled `danger` (red) and "Proceed" is `primary`. The semantics are inverted. |
| C3 | MED | DropdownButton | Items are `<div onClick>`, so they can't be reached by keyboard and have no `role="menu"`. No Escape. No enter animation. Origin is not anchored to the trigger. |
| C4 | MED | FormInput / TextField | Label isn't linked (`htmlFor`/`id`). Errors use raw `text-red-500` with no `aria-invalid`/`aria-describedby`. Fixed `h-[40px]` with a 14px font. Focus ring is driven by React state instead of `:focus-within`. |
| C5 | MED | Badge | Reuses **button** variants (with `cursor-pointer` and hover), so static chips look clickable. `onClick` sits on a `<span>`. |
| C6 | MED | Pagination | Renders every page number (no ellipsis). Targets are about 28px (below 44px). Uses `text-white` on `bg-primary` (contrast issue F3). No `aria-current`. |
| C7 | MED | ProgressBar | Filled-track bars are used as "proficiency" on the home page, About, and admin. taste-skill §9.F bans these as comparison visuals, and the dynamic width class is broken (F6). |
| C8 | MED | ImageComponent | Raw `<img>` without `next/image`. Every instance mounts a hidden Modal. Fallback `bg-gray-200`. `cursor-pointer` even when not clickable. |
| C9 | MED | Avatar | Initials are `text-white` on `bg-muted`, which is invisible in light mode. |
| C10 | LOW | Skeleton | A good set of primitives exists but is **never used**. |
| C11 | LOW | ListEmpty | Generic `Code2` icon, `gap-10`, `h-[50vh]`. No call to action. |
| C12 | LOW | toaster.ts | `info` calls `toast.error` in red. Toasts are colored by text color only, with no theming or dark mode. |
| C13 | LOW | Icons | lucide and react-icons are mixed for UI glyphs (Sidebar uses `FaLessThan`/`FaGreaterThan` for collapse). Stroke widths vary. |

### 1.4 Public pages (taste-skill pre-flight)

| # | Sev | Where | Finding |
|---|---|---|---|
| P1 | HIGH | All CTAs | Duplicate CTA intent: "Start a Project", "Get In Touch", "Start a Conversation", "Contact Me", "Let's Work Together". That's five labels for one action (contact). |
| P2 | MED | Every section | An eyebrow (`// stack`, `// services`, `// portfolio`, `// related`…) sits above **every** heading. taste-skill caps this at 1 per 3 sections. The `//` motif loses its punch. |
| P3 | MED | Home hero | Too many text elements: badge, 3-line headline, bio, stats strip, 2 CTAs, a 7-icon social grid. The social grid wraps to 3–4 rows on mobile. "99% Client Satisfaction" is a fake-precise stat (taste-skill §4.9). |
| P4 | MED | Home hero | `CodeWindow` is a div-built fake editor (taste-skill §9.F "fake product UI" tell). It is data-driven and on-brand, so it's a judgment call (see §9). |
| P5 | MED | Home, About, Projects | Every grid is 3 equal columns of identical cards (skills, services, projects, blog). This is the "three equal cards" tell repeated four times. |
| P6 | MED | Projects / Blog / About hero | Gradient-clipped text on every H1 ("Projects", "Blog", last name). Gradient text should appear once (home hero), not as a page template. |
| P7 | MED | Many sections | `min-h-screen` on content sections (About tabs, project detail tabs, related posts, `NavigationBar`, `AboutMe`) creates large empty gaps. Heroes use `min-h-screen` instead of `min-h-[100dvh]`. |
| P8 | MED | PublicNavbar | Active state only matches exact paths (`/projects/foo` doesn't highlight "Projects"). The mobile toggle has no `aria-label`/`aria-expanded`. The mobile menu has no animation and doesn't close on route change or Escape. `text-lg` links. `z-10`. |
| P9 | MED | ProjectCard | 5–7 separate buttons per card (View + up to 5 icon-only `window.open` buttons with no labels). The card itself isn't a link. `<MarkdownRenderer>` sits inside `<p>` (invalid nesting, hydration warning). Images use `objectFit=contain` on an `accent/70` box, so thumbnails letterbox. |
| P10 | MED | Project detail | The gallery uses tiny 16px arrow icons with `onClick` (no buttons, no keyboard). Thumbnails get a `border-3` jump. A 6-item metadata grid of `h2`s dilutes the heading outline. External links use `window.open` buttons instead of `<a>`. |
| P11 | MED | Blog detail | Article is full `page-padding` width (no 65–72ch measure). Uses `prose` without the typography plugin. No read time, no progress indication, no back link. |
| P12 | LOW | Footer | Logo and copyright only. No nav, socials, or contact. On the home page, Navbar and Footer are rendered inside `page.tsx` (it sits outside the `(external)` layout). |
| P13 | LOW | 404 | `text-grey` (non-existent class). The page has no personality, despite the `//` motif being a free win here. |
| P14 | LOW | Copy | "Let us" phrasing ("Let us discuss", "Let us Work Together") reads stiff. Mixed Title Case and sentence case. "Emai Address" typo on login. |

### 1.5 Admin (impeccable "Operate")

| # | Sev | Where | Finding |
|---|---|---|---|
| A1 | HIGH | 10 of 11 list pages | **Delete fires immediately with no confirmation** (awards, certifications, education, experience, messages, projects, services, skills, testimonials; only blog confirms). ui-ux-pro-max rates this High severity. |
| A2 | HIGH | Every admin list | `isLoading ? <Loading/> : page`. Every search, page change, or mutation unmounts the whole page into a full-screen spinner, then remounts it. Scroll position and modal state are lost. |
| A3 | MED | Sidebar | The width toggle snaps (no transition). On mobile it's a permanent 100px icon rail with no drawer. The active state only matches exact paths. Duplicate `Award` icon for Skills and Certifications. |
| A4 | MED | Admin top bar | The left side is an empty `<div></div>`. There's no page title, breadcrumb, or search, and the bar doesn't stick. `overflow-y-scroll h-screen` creates a nested scroll container. |
| A5 | MED | Dashboard | Only count tiles and 4 quick-action links. There's no "recent messages", "drafts", or "recently edited". Quick actions just navigate to list pages instead of opening the create form. |
| A6 | MED | ListSection / ListCard | Each page repeats the title ("Skill Management") in the breadcrumb and again in the ListSection header. ListCard hover is `hover:bg-background/10` (invisible). Actions aren't hidden until hover on desktop. |
| A7 | MED | Messages | Rendered as a `text-lg` "Label: value" dump. No read/unread state, no reply (`mailto:`), no date, no preview truncation. |
| A8 | MED | FormModal | Header layout breaks on mobile. The step indicator uses a fixed `w-16` connector. The modal closes via `onClose` immediately after `onSubmit()` fires, before async success or failure is known. |
| A9 | LOW | Login | Shows "Register" tab for a disabled feature. The form card relies on a broken `bg-foreground` dynamic class. `console.log` is in layout.tsx and 13 other files. |

---

## 2. Phase 0: Foundation (tokens and global CSS)

> Goal: fix F1–F9. After this phase the site looks nearly the same, but everything built on top is consistent. **Do this first. Every later phase depends on it.**

### 2.1 Remove the global transition (F1, M2)
- Delete the `* { transition-* }` block in `app/globals.css`. Keep `box-sizing`.
- Add `disableTransitionOnChange` to `<ThemeProvider>` in `app/layout.tsx` so theme switches are instant and uniform.
- Components opt in with explicit transitions (§2.4 utilities).

### 2.2 Color tokens (F3, F4)
Keep the brand hue and add a **strong** step for text and fills that must pass AA. Unify grays to the warm stone family.

```css
:root {
  --background: #fbfaf8;        /* off-white, warm (no pure #fff) */
  --foreground: #1c1917;        /* stone-900 */
  --card: #ffffff;
  --card-foreground: #1c1917;
  --muted: #f4f3f0;
  --muted-foreground: #6b645d;  /* ≥4.5:1 on --background */
  --border: #e7e3de;            /* warm, replaces neutral #e5e5e5 */
  --input: #e7e3de;

  --primary: #10b981;           /* brand emerald: decoration, focus, large text */
  --primary-strong: #047857;    /* emerald-700: button fill + small accent text (white 5.5:1) */
  --primary-soft: #ecfdf5;      /* tinted backgrounds, selected rows */
  --primary-foreground: #ffffff;
  --ring: #10b981;
  --destructive: #dc2626;
  --success: #047857;
  --warning: #b45309;
}
.dark {
  --background: #0e0c0a;
  --foreground: #f5f2ee;
  --card: #171412;              /* now elevated above background */
  --card-foreground: #f5f2ee;
  --muted: #221e1b;
  --muted-foreground: #a49a8e;
  --border: #2b2622;
  --input: #2b2622;
  --primary: #10b981;
  --primary-strong: #34d399;    /* on dark, lighter step is the readable one */
  --primary-soft: #0c2a20;
  --primary-foreground: #0e0c0a;
  --destructive: #ef4444;
}
```
- Register `--color-primary-strong`, `--color-primary-soft`, `--color-success`, `--color-warning` in `@theme`.
- Rule: **small text in the accent uses `text-primary-strong`**. `text-primary` is for icons, borders, and large display text only.
- Retire `--gradient-background-secondary/accent` (neutral grays). Keep one `--gradient-primary`, used only for the Logo mark and the home hero headline word.
- Replace raw `text-red-500`, `border-red-500`, `text-white`, `bg-white`, `bg-gray-200`, `bg-black/30` with tokens (roughly 50 sites, found via grep).

### 2.3 Shape, elevation, layering tokens (F7)
```css
@theme {
  --radius-sm: 6px;    /* chips inside inputs, thumbnails */
  --radius-md: 10px;   /* buttons, inputs, dropdown items */
  --radius-lg: 14px;   /* cards, modals, panels */
  /* pills (badges, avatars, toggles) use rounded-full */

  --shadow-sm: 0 1px 2px rgb(28 25 23 / 0.06);
  --shadow-md: 0 4px 12px -2px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.05);
  --shadow-lg: 0 16px 40px -12px rgb(28 25 23 / 0.18);   /* tinted to stone, not black */
}
```
Z-index scale (document in `lib/constants/layers.ts`, use per-layer via e.g. `z-(--z-nav)`):
`--z-nav: 40; --z-dropdown: 50; --z-overlay: 60; --z-modal: 70; --z-toast: 80;`

### 2.4 Motion tokens (M6), from AUDIT.md, values copied exactly
```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* UI enter/exit */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* on-screen movement */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* sheets, sidebar, slide panel */
  --dur-press: 140ms;   /* button :active */
  --dur-fast: 180ms;    /* hover color, tooltip, dropdown */
  --dur-base: 240ms;    /* modal, tabs, accordion */
  --dur-slow: 420ms;    /* scroll reveal, drawer enter */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; }
}
```
Mirror them in `lib/motion.ts` for framer-motion:
```ts
export const ease = { out: [0.23, 1, 0.32, 1], inOut: [0.77, 0, 0.175, 1], drawer: [0.32, 0.72, 0, 1] } as const
export const dur = { press: 0.14, fast: 0.18, base: 0.24, slow: 0.42 } as const
export const spring = { snappy: { type: 'spring', duration: 0.35, bounce: 0.1 }, soft: { type: 'spring', duration: 0.5, bounce: 0.15 } } as const
```
Tailwind utilities: `@utility transition-press { transition: transform var(--dur-press) var(--ease-out); }` and `@utility transition-colors-fast { transition: color, background-color, border-color var(--dur-fast) ease; }`. Also add a `@custom-variant hover-fine (@media (hover: hover) and (pointer: fine) { &:hover })` so hover transforms never fire on touch.

### 2.5 Layout container (F2, P7)
- Replace `.page-padding` and `.nav-padding` with:
  ```css
  @utility container-page { width: 100%; max-width: 1200px; margin-inline: auto; padding-inline: 1rem; @media (width >= 768px) { padding-inline: 2rem; } }
  @utility section-y { padding-block: 5rem; @media (width >= 976px) { padding-block: 7rem; } }
  ```
- Add `--breakpoint-xl: 1280px` so there's a wide-screen step.
- Heroes use `min-h-[100dvh]` minus nav height. Remove `min-h-screen` from every non-hero section and from `NavigationBar`/`AboutMe`.

### 2.6 Typography polish
- Keep Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (labels, numbers). The ui-ux-pro-max query suggested a mono display font. We reject that for the public site (too cold for recruiters) but adopt its advice to use **mono for all numbers**: add `font-variant-numeric: tabular-nums` to stats and counts.
- `h1,h2,h3 { text-wrap: balance }` and `p { text-wrap: pretty; }`. Body paragraphs get `max-w-[65ch]`.
- Type scale: display `text-5xl md:text-6xl lg:text-7xl` (hero only), page H1 `text-4xl md:text-5xl`, H2 `text-3xl md:text-4xl`, H3 `text-xl`, body `text-base md:text-lg`, small `text-sm`, eyebrow `text-xs` mono.
- Fix `.markdown-content` to use tokens and a proper reading rhythm (see P11).

### 2.7 Hygiene
- Delete `components/shared/styles.ts` (stale duplicate) and `AuthNavbar.tsx` (unused, commented).
- Remove dead `animate-fade-in` / `animate-float` usage.
- Remove all `console.log` (14 files).
- Remove dynamic class interpolation (F6). Use props that map to static class strings or inline `style`.

**Acceptance:** light and dark screenshots look the same or better. Grep shows no `transition-all`, `gradeint`, `text-red-500`, or `w-[${`. Primary buttons pass 4.5:1 in both themes.

---

## 3. Phase 1: Motion system

### 3.1 Motion audit table (vetted, ordered by leverage)

| # | Sev | Location | Fix |
|---|---|---|---|
| M1 | HIGH | Home hero timeline | Compress the full sequence to **≤ 900ms**. Typed lines at 0 / 0.08 / 0.16s, each 0.5s with `ease.inOut`. Bio at 0.35s. CTAs and stats at 0.45s. Asset at 0.2s. The cursor blinks twice then holds. Reduced motion shows everything instantly. |
| M2 | HIGH | Global `*` + `transition-all` | Removed in Phase 0. Buttons: `transition: transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) ease`. |
| M3 | HIGH | Modal / FormModal / Confirm / Dropdown / mobile nav | Wrap in `AnimatePresence`. **Modal:** overlay opacity 0→1 over `dur.base`. Panel `opacity 0, transform: scale(0.96) translateY(8px)` → identity with `ease.out` over `dur.base`. Exit is faster (160ms). Origin stays centered. **Dropdown:** `scale(0.97) → 1`, opacity, 180ms, `transform-origin: top right` (anchored to trigger). **Mobile nav:** height-free reveal using `clip-path: inset(0 0 100% 0) → inset(0)` plus link stagger of 40ms. |
| M4 | MED | Button / LinkButton | Remove `hover:scale-[1.02]`. Keep `active:scale-[0.97]` with `--dur-press`. Hover becomes a color shift only. |
| M5 | MED | Card | Lift only when the card is interactive (`as="a"` / `href`). Use `hover-fine:-translate-y-0.5` + `--shadow-md` over 240ms `ease-out`. Static cards get no hover motion. |
| M6 | MED | Reveal | Rewrite as `Reveal` + `RevealGroup` using variants and `staggerChildren: 0.06`. Initial `opacity 0, transform translateY(16px)` → identity, `dur.slow`, `ease.out`, `viewport { once: true, amount: 0.2 }`. Use the `transform` string, not the `y` shorthand (it runs on the main thread, per emil-design-eng). Reduced motion becomes an opacity-only fade of 200ms, not "no animation". |
| M7 | MED | Pulsing hero squares | Delete. |
| M8 | MED | Tabs (NavigationBar, SlidePanel) | Active pill uses `layoutId="tab-pill"` with `spring.snappy`. Panel content cross-fades (opacity plus 4px translate, 180ms, exit 120ms) using `AnimatePresence mode="wait"`. |
| M8b | MED | Experience "Show details" | Replace with a disclosure. Use a `grid-template-rows: 0fr → 1fr` transition (240ms `ease.out`) with the chevron rotating 180°. No height animation in JS. |
| M8c | MED | Project gallery | Main image cross-fades (200ms) keyed by index. Thumbnails get a ring via `outline` (no border-width jump). Arrow keys navigate. |
| M9 | MED | SlidePanel | `transform: translateX(100%) → 0` with `--ease-drawer`: 420ms enter, 240ms exit. Overlay fades. Escape and focus trap shared with Modal. |
| M10 | LOW | Reduced motion | The global CSS guard from §2.4, plus `useReducedMotion` in every framer component (Reveal already does this, so extend it to the new ones). |
| M11 | LOW | Loaders | Skeletons replace spinners (Phase 2). The skeleton shimmer is a CSS gradient sweep over 1.4s linear, and is disabled under reduced motion. |

### 3.2 Shared motion components to build (`components/shared/motion/`)
- `Reveal.tsx` (rewrite) and `RevealGroup.tsx` (stagger parent).
- `Presence.tsx`: a thin `AnimatePresence` wrapper with the modal/popover presets from `lib/motion.ts`.
- `TypedLine` (tuned per M1). The cursor gets a `blinks` prop.
- `Counter.tsx` (optional): stats count up once on first view, 800ms `ease.out`, tabular numbers. Skipped under reduced motion.

### 3.3 Missed opportunities (find-animation-opportunities, additive only)
1. **Nav active indicator:** a shared `layoutId` underline that slides between links on route change. This gives spatial continuity at a frequency of a few times per visit, so it's fine.
2. **Blog reading progress:** a 2px `scaleX` bar under the nav driven by `useScroll`/`useTransform` (no scroll listeners, per taste-skill §5.D).
3. **Contact form success:** the submit button morphs into a check with the label "Sent" (200ms blur-masked crossfade), then the modal closes after 900ms. This is a rare, high-emotion moment, so delight is allowed.
4. **Theme toggle:** icon rotate and crossfade (180ms). No page-level animation.

**Do NOT animate:** admin list rows, sidebar links, pagination, form inputs, or any keyboard action. These are high-frequency (emil-design-eng frequency table).

---

## 4. Phase 2: Component library upgrade

Every component below is used on both public and admin surfaces. Fix each once and both benefit.

| Component | Changes |
|---|---|
| **Button / LinkButton** | Merge the shared base into `buttonVariants()` (plain function, no new dependency). Variants: `primary` (solid `bg-primary-strong text-white`, hover darker), `secondary` (`bg-muted`), `outline` (`border-border`), `ghost`, `danger`, `link`. Sizes `sm 36px / md 40px / lg 48px`, with icon-only `size="icon"` at 40×40 (44 on touch). `rounded-md`. Visible `focus-visible:outline-2 outline-offset-2 outline-ring`. Loading state keeps the width (spinner overlays the label). Disabled uses `aria-disabled`. LinkButton renders `<a target="_blank" rel="noreferrer">` for external URLs, replacing all `window.open` buttons (P9, P10). |
| **Badge** | Split into `Badge` (static, no cursor/hover). Tones: `neutral`, `accent`, `outline`, `success`, `warning`. Uses `rounded-full`, `text-xs`, `px-2.5 py-0.5`. Add a separate `Chip` for clickable filter pills (`<button>`, `aria-pressed`). |
| **Card** | Polymorphic `as` / `href`. Only link cards lift (M5). Remove the always-on top gradient bar; show it only on hover for link cards as a 2px `scaleX` 0→1 from the left. `rounded-lg`, `bg-card`, `border-border`, `shadow-sm`. Sub-parts `Card.Media` (fixed `aspect-[16/10]`, `object-cover`), `Card.Body`, `Card.Footer` (pinned to bottom via `mt-auto` so CTAs align across a row, per redesign-skill). |
| **Modal (Dialog)** | One `Dialog` primitive: portal, `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape to close, focus trap, focus return to trigger, body scroll lock, click outside (configurable). Motion per M3. Close button is a ghost icon button with `aria-label="Close"`. Mobile is a **bottom sheet** (`translateY(100%) → 0`, `--ease-drawer`) under `md`. `Modal`, `FormModal`, `ConfirmationModal`, and the image preview all compose it. |
| **ConfirmationModal** | Cancel is `secondary` and Confirm is `danger` for destructive actions. Title, description, and confirm label come from the caller ("Delete skill"). Confirm shows loading and closes **only on success**. Expose a `useConfirm()` hook returning `Promise<boolean>` so pages call `if (await confirm({...})) dispatch(delete…)` (fixes A1 in one line per page). |
| **DropdownButton → Menu** | `<button aria-haspopup="menu" aria-expanded>`. Items are `role="menuitem"` buttons with arrow-key, Home/End, Escape, and type-ahead support. Motion per M3. Destructive items are tinted `text-destructive`. |
| **SlidePanel → Sheet** | Built on `Dialog` internals. Motion per M9. Tabs reuse the new `Tabs`. |
| **NavigationBar → Tabs** | `role="tablist"` / `tab` / `tabpanel`, with arrow-key navigation. `layoutId` pill (M8). Optional `?tab=` URL sync for deep links (ui-ux-pro-max "deep linking"). Horizontal scroll with edge fade mask on mobile. |
| **Form fields** (FormInput, TextArea, Select, Password, Date, FileSelect, Toggle, Checkbox) | Shared `Field` wrapper: `<label htmlFor>` above, control, optional helper, error below with `role="alert"`, `aria-invalid`, `aria-describedby`. Control height 40px, `text-base` (16px, which prevents iOS zoom), `rounded-md`, focus ring via `:focus-visible` / `focus-within` (drop the `activeField` state). Error color comes from the `--destructive` token. Apply the same classes to `reactSelectClassNames.ts` so react-select matches. |
| **SearchField** | Single input with a leading icon and an inline clear button inside the field. Submit on Enter plus a **300ms debounce** (so the separate search button goes away). Remove the redundant "Searching for:" badge. |
| **Pagination** | Windowed pages (`1 … 4 5 6 … 12`), 40px targets, `aria-current="page"`, Prev/Next as icon buttons with labels, and a "Page X of Y" label on mobile. |
| **Skeleton** | Wire up the existing primitives. Add `SkeletonProjectCard`, `SkeletonBlogCard`, `SkeletonListRow`, `SkeletonHero`, all shaped like the real content (taste-skill §4.5, ui-ux-pro-max "content jumping"). |
| **EmptyState** (replaces ListEmpty) | Icon in a soft tinted square, a one-line title, a helper sentence, and an optional action button ("Add skill"). Compact height (`py-16`), not `h-[50vh]`. |
| **Image** | Migrate to `next/image` where the domain is known (configure `images.remotePatterns` in `next.config.ts`). Reserve space with `aspect-ratio`. Fade in on load (opacity 0→1, 240ms). Mount the preview modal lazily, only when `showImageInModalOnClick`. No `cursor-pointer` unless clickable. |
| **Avatar** | Initials use `text-muted-foreground` on `bg-muted`. Use `next/image`. |
| **ProgressBar** | Keep for admin only (a small inline bar, no heavy track). On public pages, replace with a proficiency **label** or grouping (see §5). |
| **Toasts** | Theme via tokens (card background, border, shadow, icon color by type). Fix `info`. Position bottom-right on desktop, top-center on mobile. See §9 for the Sonner option. |
| **Icons** | Lucide for all UI glyphs with global `strokeWidth={1.75}`. `react-icons/fa6` for **brand logos only** (GitHub, LinkedIn, Figma…). Replace `FaLessThan`/`FaGreaterThan` with `PanelLeftClose`/`PanelLeftOpen`. |

---

## 5. Phase 3: Public site, page by page

### 5.1 Global chrome
- **PublicNavbar:** height 64px, `sticky top-0` using `z-[var(--z-nav)]`, `bg-background/80 backdrop-blur-md`. The border appears only after scroll (`useScroll` → a data attribute, no listener). Links `text-sm font-medium`. Active matching uses `pathname.startsWith`. Sliding `layoutId` underline (§3.3). One persistent **"Get in touch"** button (the single contact label, P1) opens the ContactForm. Mobile uses a full-width sheet with a clip-path reveal and 40ms link stagger, closes on route change and Escape, and has `aria-expanded`/`aria-controls`. Move Navbar and Footer for `/` into a shared layout so the home page stops rendering them itself.
- **Footer:** two rows. Row 1 has the logo, a one-line positioning statement, and the nav links. Row 2 has social icons (with labels), "© 2026 Adegbehingbe Oluwakorede", and a "Back to top" link. No 4-column link farm.
- **CTASection:** keep one on Home and one on About only. Remove it from Projects, Blog, and details (replace with a quiet inline "Get in touch" line). Restyle: `bg-card` block with a subtle emerald radial glow in the corner (not a full gradient band), headline left-aligned, one primary button, one text link. Fixes the white-button contrast failure.
- **Loading:** `app/loading.tsx` becomes a minimal nav-plus-hero skeleton. Pages show section-level skeletons instead of `isLoading ? <Loading/>`.
- **404:** `// 404` eyebrow, "This page wandered off." headline, `CodeWindow`-style one-liner (`return notFound()`), links to Home / Projects / Blog.

### 5.2 Home (`app/page.tsx`)
Section plan (4 layout families, eyebrows on 2 of 5 sections):
1. **Hero (split, left text / right asset).** Availability badge (keep; it's real semantic state, so one dot is fine). Headline "Crafting digital experiences" in 2 lines with gradient on one word only. Bio of 20 words or fewer. CTAs: **View work** (primary) and **Résumé** (outline, opens PDF in a new tab). Stats move out of the hero into section 2. Socials collapse to a compact row of 4 icon buttons max (GitHub, LinkedIn, X, Email); the rest move to the footer. Asset: see decision §9 (refined CodeWindow vs portrait). Motion per M1.
2. **Proof strip.** A full-width band with 3 real stats (projects, years, technologies) as large tabular mono numbers with a count-up. Drop "99% Client Satisfaction" unless it's backed by real data.
3. **Selected work (new).** The 3 featured projects in an **asymmetric bento** (1 large + 2 stacked), each a full-card link with image, name, and tagline. "All projects →" link. This is the biggest missing piece: a portfolio home page that shows no work.
4. **Stack.** Replace the 6 progress-bar cards with a **grouped logo grid** (Frontend / Backend / Tooling), using skill logos with names and no percentages. Optional single slow marquee on mobile (max one marquee per page).
5. **Services.** Change from 3 equal cards to a 2-column list: service name and description on the left, skills as chips on the right, separated by hairlines. Logos shrink to 40px.
6. **CTA** (restyled).

### 5.3 About
- **Hero:** keep the portrait split, but make the portrait `aspect-[4/5]`, `rounded-lg`, with a thin offset outline in `primary/30` (a static frame, no pulsing blobs). Plain-color name (no gradient). Title and a 2-line bio. CTAs: Résumé and "Get in touch".
- **Profile tabs:** new `Tabs` with URL sync (`/about?tab=experience`). Remove `min-h-screen`. Each tab gets a skeleton loader instead of the full-page spinner.
  - *About me:* 2-column layout. Markdown bio (65ch) on the left; Interests and Hobbies as chip clusters on the right (no nested bordered cards).
  - *Skills:* grouped grid of logo tiles (logo, name, level word like "Advanced" instead of a percentage bar).
  - *Experience:* keep the Timeline. Tighten cards (logo 40px, role as H3, company in `primary-strong`, dates in mono). Disclosure per M8b.
  - *Education / Certifications / Awards:* compact list rows with logo, title, issuer, date, and an external link icon. No card grid.
  - *Testimonials:* quote-first cards, max 3 lines with "Read more", attribution with name, role, and company (taste-skill §4.10).

### 5.4 Projects list
- **Hero:** shorter (`min-h-[50vh]`), left-aligned H1 "Projects" in plain color, one sentence of intro (25 words or fewer).
- **Toolbar:** sticky under the nav. Debounced search plus **domain filter chips** (horizontal scroll on mobile) instead of a dropdown, since chips show state at a glance. Shows result count.
- **Grid:** featured projects in a bento (as on Home). Remaining projects in a 3-column grid of the new `ProjectCard`: whole card is a link, `aspect-[16/10]` cover image with `object-cover` and a subtle 1.03 zoom on hover (fine pointer only), sector and role as meta text, name, 2-line tagline, up to 3 tool chips plus "+N". External link icons sit in the footer as labelled `<a>` elements (stopPropagation).
- **Loading:** 6 `SkeletonProjectCard`. Keep the previous results visible while refetching (dim to 60% opacity) so the grid never collapses.

### 5.5 Project detail (case study)
- **Header:** breadcrumb back link "← Projects". Name as H1, tagline, and a **metadata row** (Role · Type · Domain · Timeline · Status) as a definition list in one line that wraps, instead of six `h2` blocks. Link buttons as `<a>` (Live site primary; GitHub, Figma, Drive, and Postman as outline icon-plus-label).
- **Gallery:** full-width `aspect-video` stage with `object-contain` on `bg-muted`, prev/next buttons (40px, labelled, keyboard arrows), a thumbnail strip with scroll-snap, click-to-open lightbox (Dialog). Crossfade per M8c.
- **Body:** description at 65ch. Tabs (Overview / Features / Challenges / Technical) stay but render at reading width. "Key results" becomes a highlighted callout (`bg-primary-soft`, check icons).
- **Similar projects:** fix the current bug where `similarProjects` is computed from stale state inside the same effect, so it's usually empty or wrong. Show 3 cards. No `min-h-screen`.

### 5.6 Blog list
- Same hero and toolbar pattern as Projects (search plus tag chips).
- The first post renders as a **large featured card** (horizontal image and text). The rest go in a 3-column grid with date, read time (computed from word count), title, 3-line excerpt, and tags. The whole card is a link; no "Read Post" button.
- "Load more" keeps its behavior. New items fade in with the stagger group. Skeleton cards while loading.

### 5.7 Blog detail (Read mode)
- Article column at `max-w-[68ch] mx-auto`. Header: back link, tags, H1, date · read time, excerpt as a lead paragraph. Cover image full-bleed within `max-w-4xl`, `aspect-video`, `rounded-lg`.
- Rework `.markdown-content`: body `text-[1.0625rem] leading-[1.75]`, H2 `mt-12 mb-4`, H3 `mt-8 mb-3`, a consistent `space-y-5` rhythm, code blocks with a filename-style header and a copy button, links in `primary-strong` with an underline offset, block quotes with a `primary` left border.
- Reading progress bar (§3.3). Related posts use 3 cards. Previous/next post links at the end.

### 5.8 Copy pass (taste-skill §4.9 self-audit)
- One contact label everywhere: **"Get in touch"**. One work label: **"View work"**.
- Sentence case for headings ("Let's work together", not "Let us Work Together").
- Replace "Let us" with "Let's". Remove "Oops!". Fix "Emai Address".
- No em-dashes in UI copy.

---

## 6. Phase 4: Admin (Operate mode)

> impeccable "Operate": scanability, consistency, and predictable behavior come before expression. The brand shows up in precise details: the accent, the mono numbers, the `//` labels in the sidebar.

### 6.1 Shell
- **Layout:** CSS grid `[sidebar] [main]`. The page scrolls on `body` (remove the nested `h-screen overflow-y-scroll`).
- **Sidebar:** 248px expanded, 72px collapsed, animated with `transform`/`width` swapped for a `grid-template-columns` transition (240ms `--ease-drawer`). Labels fade (120ms). The collapsed state persists in `localStorage`. Active state uses `startsWith` with a 2px accent bar at the left edge plus `bg-primary-soft`. Distinct icons (Skills → `Sparkles`, Certifications → `BadgeCheck`). A "View site" link pinned at the bottom. **Mobile:** hidden, opened by a hamburger in the top bar as a left `Sheet` (drawer curve, focus trap).
- **Top bar:** sticky, 56px. Left: page title from a route map (replaces the empty `<div>`). Right: theme toggle and account menu (new `Menu`). Optional ⌘K quick-jump later (no open/close animation, per emil-design-eng's command-palette rule).

### 6.2 Dashboard
- Stat tiles: tabular mono numbers, label, and a link (the whole tile is a link with no scale-on-hover, just a border color shift).
- Add **"Recent messages"** (latest 5: name, 1-line preview, relative time, unread dot) and **"Recent content"** (latest projects and blog posts with status badges Draft/Published and edit links).
- Quick actions open the **create modal directly** (`/admin/projects?new=1` read by the page) instead of just navigating.
- Skeleton tiles while counts load.

### 6.3 List pages (projects, blog, skills, services, awards, certifications, education, experience, testimonials, files)
Standardize every page on one template (`AdminListPage` pattern, not necessarily one component):
1. **Page header:** title, count ("12 skills"), and a primary "Add skill" button. Remove the duplicate `ListSection` title (A6).
2. **Toolbar:** debounced search plus filters (status, domain) inline.
3. **List:** dense rows (table on `md+`, stacked cards on mobile). Columns: thumbnail, name plus secondary line, status badge, updated date (mono), actions. Row hover is `bg-muted/60`. On fine pointers, actions show on row hover and focus-within, and are always visible on touch. Edit and Delete are labelled icon buttons with tooltips.
4. **Delete:** always goes through `useConfirm()` (A1). Show a toast with the result.
5. **Loading:** first load shows skeleton rows. **Refetch keeps the old rows** at reduced opacity with a thin top progress bar (A2). Never unmount the page.
6. **Empty:** `EmptyState` with the "Add …" action.
7. **Pagination:** the new component, with the per-page selector on the right.

Page-specific:
- **Messages → Inbox:** two-pane on `md+` (list | reading pane), single pane with a back button on mobile. Unread dot and bold, relative time, "Reply" as a `mailto:` link with the subject prefilled, and "Mark read". Remove "Add Message" (admins don't create inbound messages).
- **Files:** masonry-ish grid of `FileCard` with type icon or thumbnail, a multi-select checkbox on hover, and a copy-URL action with a "Copied" toast.
- **Projects / Blog forms (large):** move from modal to a **slide-over Sheet (xl)** or a dedicated `/admin/projects/[id]` edit page with a sticky save bar. Multi-step `FormModal` steps become a left vertical stepper (desktop) or top segmented progress (mobile). Unsaved-changes guard on close.
- **Profile:** sectioned settings layout (Identity, Bio, Links, Résumé) with a sticky "Save changes" bar that appears only when the form is dirty.

### 6.4 Forms (all admin modals)
- Modal size `lg` becomes a Sheet on mobile. Header: title, subtitle, and a ghost close icon. Footer (sticky): Cancel (secondary) and Save (primary, loading).
- **Close only after a successful submit** (A8): `await dispatch(...).unwrap()` then close. On failure keep the modal open, show a toast, and map field errors inline.
- Two-column field grid on `md+` for short fields (dates, numbers), full width for text areas and editors.
- Tiptap / Markdown editor: toolbar sticky inside the scroll area, same border and focus tokens as inputs.

### 6.5 Login
- Centered card `max-w-sm` on `bg-muted` with the hero-texture dot grid. Logo, "Admin sign in" heading, email and password fields (new `Field`), primary button, and the error message inline above the button. Remove the Register tab. Password field has a show/hide toggle with `aria-pressed`.

---

## 7. Phase 5: Accessibility, performance, QA

**Accessibility (ui-ux-pro-max priority 1 and 2):**
- [ ] Contrast of 4.5:1 or better for all body and small text in both themes (verify `primary-strong`, `muted-foreground`, badge tones).
- [ ] Visible `:focus-visible` ring (2px `ring`, 2px offset) on every interactive element. No `outline-none` without a replacement.
- [ ] Keyboard: nav, tabs, menus, dialogs, gallery, and pagination all work without a mouse. Escape closes overlays. Focus returns to the trigger.
- [ ] Icon-only buttons have `aria-label`. Decorative icons have `aria-hidden`.
- [ ] Touch targets of 44×44 or larger on mobile (social icons, pagination, list actions).
- [ ] "Skip to content" link in both layouts. `<main id="content">` landmarks.
- [ ] `prefers-reduced-motion` verified: no transforms, only opacity fades.

**Performance:**
- [ ] `next/image` with `priority` for the hero asset, and sizes set for cards (LCP under 2.5s).
- [ ] Reserved aspect ratios everywhere (CLS under 0.1).
- [ ] Lazy-load Tiptap, react-select, and `countrycitystatejson` in admin via `next/dynamic`.
- [ ] Framer-motion is imported only in client leaf components. Consider `LazyMotion` + `domAnimation` to cut bundle size.
- [ ] Lighthouse on Home, Project detail, Blog detail, and Admin dashboard (mobile profile).

**QA pass (impeccable "bounded passes"):**
One batched round per phase: screenshots at 375 / 768 / 1280 / 1536 in light and dark, and animation checks in Chrome's Animations panel at 10% speed (emil-design-eng slow-motion test). Fix everything in one batch, confirm once, and stop.

---

## 8. Execution order

Each step is roughly one PR. Steps within a phase can run in parallel once that phase's first step lands.

| Step | Scope | Depends on | Size |
|---|---|---|---|
| 1 | Phase 0: tokens, global CSS cleanup, container, hygiene (§2) | none | M |
| 2 | Motion tokens plus `lib/motion.ts`, Reveal/RevealGroup rewrite, hero timeline (§3.1 M1, M6, M7) | 1 | S |
| 3 | Button, LinkButton, Badge/Chip, Card (§4) | 1 | M |
| 4 | Dialog primitive → Modal, FormModal, Confirm + `useConfirm`, Sheet (§4, M3, M9) | 1, 2 | L |
| 5 | Menu, Tabs, Pagination, SearchField, Field and form controls (§4) | 3 | L |
| 6 | Skeletons, EmptyState, Image, Avatar, Toasts (§4) | 3 | M |
| 7 | **Admin safety quick win:** `useConfirm` on all 10 delete sites, keep-data-on-refetch (A1, A2) | 4, 6 | S |
| 8 | Public chrome: Navbar, Footer, CTASection, loading, 404 (§5.1) | 3, 4, 5 | M |
| 9 | Home (§5.2) | 8 | M |
| 10 | Projects list plus detail (§5.4, §5.5) | 8 | L |
| 11 | Blog list plus detail, markdown styles (§5.6, §5.7) | 8 | M |
| 12 | About (§5.3) | 8 | M |
| 13 | Admin shell plus dashboard (§6.1, §6.2) | 4, 5 | M |
| 14 | Admin list template across 10 pages, Messages inbox, Files (§6.3) | 13 | L |
| 15 | Admin forms, Sheet editors, Profile, Login (§6.4, §6.5) | 14 | L |
| 16 | Copy pass, a11y/perf QA, Lighthouse (§5.8, §7) | all | S |

**Suggested first milestone (highest impact, lowest risk):** steps 1, 2, 3, 4, and 7. These fix animation smoothness (global transition, hero timing, modal presence), contrast, and the dangerous admin deletes, without touching any page layout.

---

## 9. Decisions needing your input

| # | Question | Recommendation |
|---|---|---|
| D1 | **Home hero asset:** keep the `CodeWindow` (on-brand, but it's a "fake UI" pattern) or use your portrait? | Keep `CodeWindow` but make it **real**: syntax-highlight properly and add a subtle line-by-line reveal. The portrait stays on About. It's data-driven, not a mockup, so it passes the spirit of the rule. |
| D2 | **"99% Client Satisfaction" stat:** is it backed by real data? | Remove it unless real. Replace it with "Blog posts" or "Certifications" (real counts). |
| D3 | **Accessible primitives:** hand-roll Dialog, Menu, and Tabs, or add `@radix-ui/react-dialog`, `-dropdown-menu`, `-tabs` (about 30kb total, unstyled)? | **Radix.** Focus trap, scroll lock, and keyboard handling are easy to get subtly wrong. Styling stays 100% ours with the tokens above. |
| D4 | **Toasts:** theme `react-hot-toast`, or migrate to `sonner` (the ask-sonner skill is available)? | **Sonner.** It has better default motion (interruptible transitions, swipe to dismiss), built-in promise toasts for admin saves, and theme support. The migration is small since everything goes through `lib/utils/toaster.ts`. |
| D5 | **Admin large editors (Projects, Blog):** slide-over Sheet or dedicated edit routes? | **Dedicated routes** (`/admin/projects/[id]`). The forms are long (768-line page), benefit from deep links, and avoid scroll-in-modal problems. |
| D6 | **Skill proficiency %:** keep percentages publicly? | Show level words (Familiar / Proficient / Advanced / Expert) derived from the number. Keep the number in admin only. |

---

## 10. Definition of done (whole project)

- No `transition-all`, no global `*` transition, no `hover:scale` on buttons, and no infinite decorative loops.
- Every overlay has enter and exit motion, Escape, focus trap, and focus return. Exits are faster than entrances.
- Primary actions pass WCAG AA contrast in light and dark.
- One radius system, one shadow family, one gray family, one accent, one contact CTA label.
- No full-page spinner anywhere after the initial route load. Skeletons match the layout.
- Every destructive admin action is confirmed. Admin lists never unmount on refetch.
- Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100 on Home, Project detail, and Blog detail.
- taste-skill §14 pre-flight passes for public pages. The impeccable polish checklist passes for admin.
