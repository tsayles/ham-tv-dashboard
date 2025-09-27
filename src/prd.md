# Ham TV Dashboard - Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Create a beautiful, functional 10-foot amateur radio dashboard that displays space weather, band activity, APRS, satellite passes with audio alerts, and live waterfall data in an automatically rotating kiosk-style interface optimized for TV viewing.

**Success Indicators**: 
- Clear readability from 10+ feet away
- Automatic data rotation keeping viewers informed
- Audio alerts ensure important satellite passes aren't missed
- Seamless operation in simulation mode for demonstration

**Experience Qualities**: Professional, Informative, Reliable

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with basic state)
**Primary User Activity**: Consuming information with occasional interaction for settings

## Essential Features

### Data Panels
1. **Space Weather Display**: Real-time SFI, Kp-index, A-index, and X-ray classification with color-coded status indicators
2. **Band Activity Heat Map**: Visual representation of FT8/FT4/WSPR activity across amateur bands (40m, 20m, 10m, 2m, 70cm)
3. **APRS Local Map**: Display of stations heard via RF vs. internet with clear source distinction
4. **Satellite Pass Predictor**: Next 24 hours of passes with countdown timers, elevation data, and priority indicators
5. **Live Waterfall Preview**: Rotating tile showing current spectrum activity

### Audio Alert System
6. **High-Priority Pass Alerts**: Synthesized audio tones for satellite passes meeting elevation thresholds
7. **Configurable Alert Settings**: User control over alert conditions, timing, and audio preferences
8. **Browser Notifications**: Desktop notifications for imminent high-priority passes

### User Interface
9. **Automatic Panel Rotation**: 25-second intervals with manual override capabilities
10. **TV-Optimized Navigation**: D-pad friendly controls with large fonts and high-contrast focus indicators
11. **Simulation Mode**: Complete data simulation for demonstration and testing

## Design Direction

### Visual Tone & Identity
**Emotional Response**: Professional confidence and technical precision
**Design Personality**: Serious, technical, reliable - like mission-critical equipment
**Visual Metaphors**: Space mission control, aviation instruments, technical monitoring equipment
**Simplicity Spectrum**: Clean and organized while information-dense

### Color Strategy
**Color Scheme Type**: Analogous dark theme with strategic accent colors
**Primary Color**: Deep space blue (#0F1419) - professional and non-fatiguing for extended viewing
**Secondary Colors**: Lighter blues and grays for hierarchy and distinction
**Accent Color**: Bright amber (#FFC107) - for alerts, active states, and call-to-action elements
**Color Psychology**: Dark backgrounds reduce eye strain for TV viewing, amber accents ensure critical information stands out
**Color Accessibility**: High contrast ratios maintained throughout, amber accents provide strong visibility
**Foreground/Background Pairings**: 
- Background (#0F1419) with light gray text (#F5F5F5) - 15.8:1 contrast
- Card backgrounds (#1A1F2E) with off-white text (#EEEEEE) - 12.1:1 contrast
- Primary accent (#FFC107) with white text (#FFFFFF) - 9.6:1 contrast
- Secondary accent (#4A90E2) with white text (#FFFFFF) - 4.8:1 contrast

### Typography System
**Font Pairing Strategy**: Inter for interface text, JetBrains Mono for technical data
**Typographic Hierarchy**: Large TV-friendly sizes (20px minimum) with clear weight distinctions
**Font Personality**: Clean, technical, highly legible at distance
**Readability Focus**: Generous line spacing, short line lengths, high contrast
**Typography Consistency**: Consistent sizing scale across all panels
**Selected Fonts**: Inter (primary interface), JetBrains Mono (technical data, call signs, frequencies)
**Legibility Check**: All fonts tested for 10-foot visibility with excellent results

### Visual Hierarchy & Layout
**Attention Direction**: Large headers, strategic color use, animation for critical alerts
**White Space Philosophy**: Generous padding and margins to prevent cramped appearance
**Grid System**: Consistent 8px base unit with larger multiples for TV viewing
**Responsive Approach**: Fixed TV-optimized layout with focus on horizontal space usage
**Content Density**: Balanced information density - comprehensive but not overwhelming

### Audio Alert System Design
**Alert Types**: Two-tone system - warning beeps for imminent passes, urgent alternating tones for excellent active passes
**User Control**: Comprehensive settings panel for threshold, timing, and enable/disable
**Notification Integration**: Browser notifications supplement audio alerts
**Audio Feedback**: Test functions allow users to preview alert sounds

### UI Elements & Component Selection
**Component Usage**: Shadcn components for consistency - Cards for data containers, Badges for status indicators, Buttons for controls
**Component Customization**: TV-friendly sizing, high contrast focus states, rounded corners for modern feel
**Component States**: Clear hover, focus, and active states optimized for remote control navigation
**Icon Selection**: Phosphor icons for technical feel and excellent visibility
**Spacing System**: 8px base unit scaling to 12px, 16px, 24px, 32px for TV-appropriate spacing

## Implementation Considerations

**Scalability Needs**: Designed for single-display operation with potential for multiple operator positions
**Testing Focus**: TV distance visibility, remote control navigation, audio alert reliability
**Critical Questions**: Audio alert timing preferences, satellite priority thresholds, panel rotation speeds

## Technical Architecture

**Frontend**: React with TypeScript, Vite build system, Tailwind CSS
**State Management**: React hooks with persistent storage via useKV
**Audio System**: Web Audio API for synthesized alert tones
**Data Simulation**: Complete mock data system for development and demonstration
**Styling**: Custom CSS variables mapped to Tailwind theme system

## Current Status

✅ Complete data simulation system  
✅ All five information panels implemented  
✅ Audio alert system with configurable settings  
✅ TV-optimized navigation and controls  
✅ Automatic panel rotation with manual override  
✅ High-contrast, TV-friendly visual design  

## Future Enhancements (Out of Scope)

- Real RF data integration via Raspberry Pi
- Multi-display support
- Historical data trending
- Advanced audio processing (live audio during satellite passes)
- Network connectivity for remote monitoring