# Ham TV Dashboard - Product Requirements Document

A living, kiosk-style Amateur Radio Dashboard for Android TV that displays real-time ham radio activity, space weather, and satellite information in a rotating 10-foot UI.

**Experience Qualities**:
1. **Immersive** - Full-screen dashboard that transforms any TV into a ham radio command center
2. **Informative** - Dense but digestible information display optimized for across-the-room viewing
3. **Autonomous** - Self-updating carousel that requires minimal interaction once configured

**Complexity Level**: Light Application (multiple features with basic state)
- Displays real-time data from multiple sources with automatic rotation between information panels

## Essential Features

### Auto-Rotating Dashboard Carousel
- **Functionality**: Automatically cycles between 5 information panels every 20-30 seconds
- **Purpose**: Provides continuous overview of ham radio conditions without user intervention
- **Trigger**: Loads automatically on app start, continuous rotation
- **Progression**: Panel 1 → Panel 2 → Panel 3 → Panel 4 → Panel 5 → Panel 1 (repeat)
- **Success criteria**: Smooth transitions, configurable timing, pause functionality

### Space Weather Panel
- **Functionality**: Displays SFI, K-index, A-index, X-ray flux, and grayline information
- **Purpose**: Shows HF propagation conditions critical for amateur radio operations
- **Trigger**: Real-time updates from space weather APIs (simulated in MVP)
- **Progression**: Data fetch → Parse → Display → Auto-refresh every 15 minutes
- **Success criteria**: Clear numeric displays, color-coded condition indicators

### Band Activity Heat Map
- **Functionality**: Shows activity levels across amateur radio bands (40m, 20m, 10m, 2m, 70cm)
- **Purpose**: Indicates where the action is happening across the spectrum
- **Trigger**: Spot data from PSKReporter/WSPR (simulated)
- **Progression**: Spot aggregation → Band analysis → Visual heat map → Real-time updates
- **Success criteria**: Horizontal bar charts, activity count numbers, band labels

### APRS Local Map Panel
- **Functionality**: Lists local APRS stations with RF vs Internet source indication
- **Purpose**: Shows local amateur radio activity and station positions
- **Trigger**: APRS data feed (simulated with local stations)
- **Progression**: APRS decode → Location parsing → Station list → Map placeholder
- **Success criteria**: Scrollable station list, RF/IS source indicators, last-heard timestamps

### Satellite Pass Tracker
- **Functionality**: Shows next 5 satellite passes with AOS countdown timers
- **Purpose**: Never miss a satellite pass opportunity
- **Trigger**: TLE data processing and pass prediction
- **Progression**: TLE fetch → Pass calculation → Next passes display → Countdown updates
- **Success criteria**: Pass times, elevation angles, real-time countdowns

## Edge Case Handling

- **Data Connection Loss**: Show last known data with "stale data" indicator after 5 minutes
- **Invalid Data**: Display error state with retry mechanism, fallback to simulated data
- **Panel Rendering Errors**: Skip to next panel, log error, continue rotation
- **WebSocket Disconnection**: Auto-reconnect with exponential backoff

## Design Direction

The interface should feel professional and technical like mission control software - clean, high-contrast, and immediately readable from across a room with a focus on data density over decoration.

## Color Selection

Complementary (opposite colors) - Deep space blue primary with warm amber accents to evoke the classic feel of radio equipment displays and provide excellent contrast for TV viewing.

- **Primary Color**: Deep Space Blue (oklch(0.25 0.15 240)) - Communicates technical professionalism and space/radio heritage
- **Secondary Colors**: Dark Navy (oklch(0.15 0.1 240)) for backgrounds, Light Blue (oklch(0.8 0.1 240)) for secondary elements
- **Accent Color**: Warm Amber (oklch(0.75 0.15 60)) - Attention-grabbing highlight for active elements and important data
- **Foreground/Background Pairings**: 
  - Background (Deep Space Blue #1e3a5f): White text (#ffffff) - Ratio 8.2:1 ✓
  - Card (Dark Navy #0f1f3d): Light Gray text (#e5e7eb) - Ratio 12.1:1 ✓
  - Primary (Deep Space Blue): White text (#ffffff) - Ratio 8.2:1 ✓
  - Accent (Warm Orange #d97706): White text (#ffffff) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey technical precision and excellent readability at distance - using a monospace font for data values to ensure perfect alignment and a clean sans-serif for labels and headings.

- **Typographic Hierarchy**: 
  - H1 (Panel Titles): Inter Bold/48px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/32px/normal spacing  
  - Data Values: JetBrains Mono/28px/tabular numbers
  - Labels: Inter Regular/24px/normal spacing
  - Status Text: Inter Medium/20px/normal spacing

## Animations

Subtle and functional animations that guide attention without distraction - smooth panel transitions and gentle data updates that feel reliable and professional rather than flashy.

- **Purposeful Meaning**: Panel transitions communicate progression, data updates show freshness, loading states indicate system activity
- **Hierarchy of Movement**: Panel transitions are primary, data value changes are secondary, status indicators are tertiary

## Component Selection

- **Components**: Cards for each panel section, Progress bars for band activity, Badges for status indicators, Tabs for manual panel selection (hidden by default)
- **Customizations**: Large text sizes for TV viewing, high contrast focus states, custom countdown timers, data value animations
- **States**: Clear loading states with skeletons, error states with retry options, stale data indicators, connection status
- **Icon Selection**: Satellite, Radio, Globe, Activity, Settings icons from Phosphor for clear recognition
- **Spacing**: Generous padding (8-12 Tailwind units) for TV viewing, consistent gaps between elements
- **Mobile**: Responsive design that works on tablets and phones as secondary use case, maintaining readability at all sizes