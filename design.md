# Contexo Dashboard --- Basic Design

**Scope:** Phase 1 of V1. Layout and UI guidance aligned with
`contexo_v1_phase1_prd.md`.

## Design direction

Keep the first version simple and functional. The dashboard is a content
library and connected-sources workspace, not an analytics dashboard.

Use a simple left sidebar and a main content area that changes based on
the selected navigation item. Prefer minimal styling, clear labels, and
straightforward content cards. Avoid decorative charts, KPI cards,
promotional banners, and complex dashboard widgets.

## 1. App layout

The app has two main areas:

### Sidebar

A narrow, fixed-width navigation panel on the left.

-   Contexo logo / wordmark at the top.
-   **Categories**
-   **Recents**
-   **Connections**

These three sections are the only Phase 1 sidebar items (P1-DASH-01).
Keep the navigation simple, with a clear active state for the selected
section.

### Main content

The remaining space displays the selected page.

-   Page title at the top.
-   Main page content below.
-   Use a simple, consistent spacing system.
-   Avoid unnecessary nested panels.

## 2. Categories page

This is the default page after opening Contexo.

### Header

Show the page title:

**Categories**

### Category cards

Display predefined content-format category cards only. Users cannot
create top-level categories (P1-CAT-01).

Discussed Phase 1 categories (exact final list still to be confirmed):

-   Links
-   Images / Screenshots
-   Texts
-   PDFs

Each category card should show:

-   Category name
-   Item count
-   Simple item previews within the category (P1-CAT-02)
-   A simple icon if useful

Cards are clickable and open that category. Avoid charts, analytics, or
complex metadata.

The Categories page should display category cards only. Do not include a
Recents section on this page, and do not list every saved item directly
on the Categories landing page.

### Category contents

When a user opens a category, show the saved items belonging to that
type, plus any user folders within that category.

-   Keep the layout simple.
-   Items should display a title and basic source information where
    available.
-   Clicking an item opens its original source URL. Phase 1 has no
    in-app item preview/details panel (P1-ITEM-01).
-   Support Grid and List views. The selected view should stay
    consistent while navigating between categories (P1-VIEW-01).
-   Do not add advanced filtering or analytics in this phase.

### Links category — source sections

Inside **Links**, organise items into system-generated source sections
such as:

-   LinkedIn
-   YouTube
-   X
-   Websites
-   Others (unrecognised sources)

Source sections are automatic. Do not create a new source section for
every unknown website (P1-LINK-01, P1-LINK-02). Users may create their
own folders alongside these source sections.

### Folders within categories

Within a category, users can:

-   Create custom folders and subfolders
-   Upload files into folders
-   Organise items manually, including drag-and-drop
-   Add the same item to multiple folders (references, not duplicates)

Keep folder UI basic and scannable. Do not invent move-versus-add
semantics beyond what product has confirmed.

## 3. Recents page

Recents is a separate sidebar section and page (P1-RECENT-01).

### Header

Show the page title:

**Recents**

### Content

-   Show recently saved items across categories.
-   Recents is a view of existing items, not a separate storage location
    or duplicate copy.
-   Keep the presentation simple (list or compact cards).
-   Clicking an item opens its original source URL.
-   Do not add analytics, filters, or promotional content on this page.

## 4. Connections page

The Connections page is where users connect external apps and manage
syncing into Contexo.

### Header

Show the page title:

**Connections**

### Connected apps / integrations

Display a simple list or grid of integration cards for the Phase 1
providers (P1-CONN-01):

-   Google Drive
-   Notion
-   Dropbox
-   OneDrive

Each integration card should show:

-   App name and icon
-   Connection status (Connected / Not connected)
-   A primary action: **Connect** or **Manage**

### Sync behaviour

Users choose specific folders and/or files to sync. Only selected
content syncs into Contexo (P1-CONN-02).

Keep sync controls basic:

-   Show whether syncing is enabled
-   Show a simple sync status or last-synced time when available
-   Allow the user to connect, manage selections, or disconnect

On disconnect: stop future syncing, but keep previously synced content
available in Contexo (P1-SYNC-03).

Do not add detailed sync analytics, complex settings, or multi-step
monitoring dashboards in this initial design.

## 5. Visual style

Use a restrained, neutral interface.

-   Background: near-white or very light neutral.
-   Sidebar: slightly distinct light surface.
-   Main content: clean and uncluttered.
-   Text: dark charcoal for headings; muted grey for secondary labels.
-   Borders: subtle light grey.
-   Accent: Contexo's existing brand color, used sparingly for active
    navigation and primary actions.
-   Cards: simple rectangular surfaces with modest rounded corners.
-   Icons: consistent, simple line icons.

Do not carry over the AETHER reference's lavender analytics styling,
pastel KPI cards, chart treatments, or promotional card.

## 6. Responsive behavior

-   Desktop: sidebar on the left; content on the right.
-   Tablet: keep the sidebar compact if needed.
-   Mobile: use a menu drawer or compact navigation and stack category /
    integration tiles vertically.
-   Prevent horizontal page overflow.

## 7. Basic component structure

``` text
ContexoApp
├── Sidebar
│   ├── Logo
│   ├── CategoriesNavigation
│   ├── RecentsNavigation
│   └── ConnectionsNavigation
└── MainContent
    ├── CategoriesPage
    │   └── CategoryCard × predefined content types
    │       (name, item count, item previews)
    ├── CategoryDetailPage
    │   ├── ViewToggle (Grid | List)
    │   ├── SourceSections (Links only)
    │   ├── UserFolders
    │   └── SavedItems
    ├── RecentsPage
    │   └── RecentItemList (view of existing items)
    └── ConnectionsPage
        └── IntegrationCard × Google Drive, Notion, Dropbox, OneDrive
```

## 8. Phase 1 design checklist

-   [ ] Sidebar with logo, Categories, Recents, and Connections.
-   [ ] Categories is the default page.
-   [ ] Categories page shows predefined category cards only (no Recents
    block on this page).
-   [ ] Category cards show name, item count, and item previews.
-   [ ] Category detail supports Grid and List views with persistent
    selection.
-   [ ] Links category shows automatic source sections; unrecognised
    sources go to Others.
-   [ ] Users can create folders/subfolders within categories and organise
    items (including multi-folder references).
-   [ ] Recents page shows recently saved items across categories without
    duplicating storage.
-   [ ] Saved items open their original source URL; no in-app details
    panel in Phase 1.
-   [ ] Connections page lists Google Drive, Notion, Dropbox, and
    OneDrive.
-   [ ] Users can connect, choose content to sync, manage, and disconnect
    integrations.
-   [ ] Disconnect preserves previously synced content.
-   [ ] Basic sync status is visible where available.
-   [ ] No analytics dashboard, KPI cards, charts, or promotional
    widgets in Phase 1.
-   [ ] Layout works on desktop, tablet, and mobile.
