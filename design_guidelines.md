# LearnSphere Design Guidelines

## Design Approach

**Hybrid Reference-Based System**
- Primary inspiration: LinkedIn (professional social feed) + Discord (real-time communication) + Notion (organized content)
- Secondary influences: Zoom (live sessions), Slack (messaging), Linear (clean interfaces)
- Rationale: Combines social engagement patterns with productivity-focused transcription and learning tools

## Core Design Principles

1. **Unified Navigation**: Persistent sidebar with mode switching (Chat, Speaker, Education, Notes, Feed)
2. **Real-time First**: Live updates, typing indicators, active session badges
3. **Content Density Balance**: Social feed is spacious, transcripts are compact and scannable
4. **Multi-panel Layouts**: Split-screen for sessions (transcript + participants/chat)
5. **Mobile-Responsive**: Collapsible sidebars, bottom nav on mobile

---

## Typography System

**Font Families:**
- Primary: Inter (headings, UI elements, buttons)
- Secondary: system-ui (body text, transcripts for readability)

**Hierarchy:**
- Hero/Page Titles: text-4xl to text-5xl, font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg, font-semibold
- Body Text: text-base, font-normal
- Metadata/Timestamps: text-sm, font-medium
- Captions/Labels: text-xs, uppercase, tracking-wide

---

## Spacing System

**Tailwind Units:** Consistently use 2, 4, 6, 8, 12, 16, 20, 24 units
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Icon-text spacing: gap-2
- Grid gaps: gap-6 to gap-8

---

## Layout Architecture

### Global Structure
```
┌─────────────────────────────────────┐
│ Top Navigation Bar (h-16)          │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │   Main Content Area          │
│ Nav  │   (max-w-7xl mx-auto)        │
│      │                              │
│(w-64)│                              │
└──────┴──────────────────────────────┘
```

**Sidebar Navigation:**
- Fixed left sidebar (w-64) on desktop
- Icons + labels for: Feed, Chat, Speaker, Education, Notes, Profile, Settings
- Active state indicators
- Collapsed to icon-only on tablets (w-20)
- Bottom nav on mobile

**Main Content Patterns:**
- Single column feed: max-w-3xl mx-auto
- Two-column session view: 60/40 split (transcript/sidebar)
- Three-column chat: 20/55/25 (contacts/messages/details)

---

## Component Library

### Navigation Components
**Top Bar:**
- Logo + app name (left)
- Global search (center, max-w-md)
- Notifications + Profile avatar (right)
- Height: h-16, border-b

**Sidebar:**
- Nav items: p-3, rounded-lg, hover/active states
- Section dividers
- Quick session indicators (live badges)

### Social Feed Components
**Post Card:**
- Full-width container with rounded-xl, border
- Padding: p-6
- Avatar (12x12) + username + timestamp
- Content preview (3-line clamp for transcripts)
- Engagement row: Like, Comment, Share icons (gap-6)
- Session type badge (top-right)

**Session Discovery:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Card includes: thumbnail/icon, title, host info, participant count, language badges, join button

### Chat Interface
**Message List:**
- Alternating sender alignment
- Message bubbles: max-w-md, rounded-2xl, p-3
- Timestamp below bubble: text-xs
- Voice message: waveform visualization + play button
- Translation toggle beneath message

**Composer:**
- Fixed bottom: sticky bottom-0
- Input field + voice button + send button
- File attachment icon
- Real-time translation toggle

### Live Session Interface
**Session Header:**
- Session title (text-2xl, font-bold)
- Host info + participant count
- Recording indicator (pulsing dot)
- Actions: Share QR, End session, Settings

**Transcript Panel (Main):**
- Auto-scrolling container
- Speaker segments: border-left accent, pl-4
- Timestamp gutter (left): text-xs, opacity-60
- Searchable, highlightable text
- Language selector dropdown (top-right)

**Participants Sidebar:**
- Live participant list with avatars
- Speaking indicator (animated ring)
- Language preference badges
- Mute/unmute controls

**Q&A Section:**
- Tabbed interface: Transcript | Q&A | Discussion
- Question cards with upvote buttons
- Answer threads beneath
- Ask question button (fixed bottom)

### Education Hub
**Classroom Card:**
- Banner image or subject icon
- Course title + instructor
- Student count + session count
- Schedule info
- Join/Browse sessions button

**Lecture Archive:**
- Timeline view: vertical line with session nodes
- Each node: date, topic, duration, view transcript link
- Search bar with filters (date, topic, speaker)

### Note-Taker
**Recording Interface:**
- Large record/stop button (center)
- Live waveform visualization
- Timer display
- Pause button
- Format selector: Notes, Meeting Minutes, Lecture

**Transcript Editor:**
- Rich text editor with formatting toolbar
- Timestamp markers (clickable)
- Export options: PDF, TXT, Share link
- Save to session/folder

### Discussion Forums
**Thread List:**
- Card-based layout
- Original question + answer count
- Last activity timestamp
- Tags for topics
- Sort options: Recent, Popular, Unanswered

**Thread View:**
- Question post (emphasized, larger)
- Answer cards with timestamps
- Nested reply threads (indented)
- Best answer highlight
- Add answer composer (bottom)

---

## Key Interactions

**Real-time Updates:**
- Typing indicators: "Speaker is talking..." with animated dots
- New message badges
- Live transcript auto-scroll with manual scroll override
- Participant join/leave notifications

**Session Management:**
- Start session modal: Title, description, privacy, languages
- QR code generation for sharing
- Copy link button
- Session controls: Recording, Discussion toggle, End

**Multi-language:**
- Language selector (dropdown with flags)
- Translation badge on messages
- Edit translation before send (chat mode)
- Side-by-side transcript views (optional)

---

## Responsive Breakpoints

**Desktop (lg: 1024px+):**
- Full sidebar + multi-column layouts
- Max content width: max-w-7xl

**Tablet (md: 768px):**
- Icon-only sidebar or hidden
- Two-column max
- Drawer menus for secondary content

**Mobile (base: <768px):**
- Single column layouts
- Bottom navigation (5 icons)
- Full-width cards
- Collapsible sections
- Hamburger menu for filters

---

## Accessibility

- Focus states on all interactive elements (ring-2 offset-2)
- Keyboard navigation for session controls
- ARIA labels for icon-only buttons
- Skip to content link
- Transcript font size controls
- High contrast mode support

---

## Images

**Use images strategically:**
- User avatars throughout (required)
- Session thumbnails in discovery grid
- Education course banners
- Speaker profile photos in live sessions
- QR codes for sharing
- Placeholder illustrations for empty states

**No hero image** - This is a productivity/social app that launches directly into the feed or dashboard.

---

## Special Considerations

**Live Session Polish:**
- Session should feel professional, like Zoom/Meet quality
- Clear speaker attribution
- Smooth real-time updates
- Easy navigation between transcript, Q&A, discussion

**Social Engagement:**
- Feed should encourage interaction
- Session previews are rich and inviting
- Easy discovery of active sessions
- Community feel through participant counts, reactions

**Information Architecture:**
- Clear mode separation but unified design
- Persistent access to active sessions
- Easy switching between contexts
- Search works globally across all content