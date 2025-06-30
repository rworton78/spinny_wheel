# Spinning Wheel React Component

A fully-featured React spinning wheel component with guaranteed targeting, animations, and sound effects.

## Features

- **Dynamic Segments**: Configurable 2-12 segments
- **Predetermined Landing**: Select exact winning segment or random
- **Flexible Duration**: Adjustable spin duration (1-10 seconds)
- **Visual Elements**: Colorful segments with emojis and numbers
- **Sound Effects**: Plays spin.mp3 audio file
- **Smooth Animations**: GSAP-powered realistic spinning physics
- **Random Variation**: 5-10 degree natural variation for authenticity

## Installation

```bash
npm install react react-dom gsap
```

## Usage

```jsx
import React from 'react';
import SpinningWheel from './SpinningWheel';
import './SpinningWheel.css';

function App() {
  return (
    <div className="App">
      <SpinningWheel />
    </div>
  );
}

export default App;
```

## Props

The component is currently self-contained but can be easily extended to accept props:

- `initialSegments`: Number of initial segments (default: 6)
- `onSpinComplete`: Callback function when spin finishes
- `audioSrc`: Path to custom audio file (default: "spin.mp3")
- `colors`: Custom color array for segments
- `emojis`: Custom emoji array for segments

## Requirements

- React 16.8+ (uses hooks)
- GSAP 3.x
- Audio file: `spin.mp3` in public directory

## Customization

### Colors
The component uses a predefined color array that cycles through segments:
```javascript
const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#feca57', '#ff9ff3', '#a8e6cf', '#ff8b94',
  '#ffaaa5', '#ff677d', '#d4a4eb', '#a8dadc'
];
```

### Emojis
Emojis are assigned to each segment from this array:
```javascript
const emojis = [
  '🎯', '🍀', '⭐', '🎉', '🔥', '💎', 
  '🚀', '🎊', '🌟', '🎈', '🎁', '🏆'
];
```

## File Structure

```
spinning-wheel/
├── SpinningWheel.jsx    # Main React component
├── SpinningWheel.css    # Styles
├── package.json         # Dependencies
├── README.md           # Documentation
└── spin.mp3            # Audio file (not included)
```

## License

MIT License