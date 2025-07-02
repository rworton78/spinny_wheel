import React from 'react';
import SpinningWheel, { BrandSegment } from './SpinningWheel';
import './App.css';

const App: React.FC = () => {
  const [targetSegment, setTargetSegment] = React.useState<string>('random');
  const [segments, setSegments] = React.useState<BrandSegment[]>([
    { id: '1', name: 'Google', color: '#4285f4', logo: '🔍', isDisplayed: true },
    { id: '2', name: 'Adidas', color: '#000000', logo: '👟', isDisplayed: true },
    { id: '3', name: 'Greggs', color: '#ff6b35', logo: '🥖', isDisplayed: true },
    { id: '4', name: 'Apple', color: '#007aff', logo: '🍎', isDisplayed: true },
    { id: '5', name: 'Nike', color: '#ff6600', logo: '✅', isDisplayed: true },
    { id: '6', name: 'No Win', color: '#666666', logo: '❌', isDisplayed: true, isNoWin: true }
  ]);

  const displayedSegments = segments.filter(seg => seg.isDisplayed);

  const toggleSegmentDisplay = (segmentId: string) => {
    setSegments(prev => prev.map(segment => 
      segment.id === segmentId 
        ? { ...segment, isDisplayed: !segment.isDisplayed }
        : segment
    ));
  };

  return (
    <div className="App">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="targetSegment" style={{ marginRight: '10px' }}>
            Winning Segment:
          </label>
          <select 
            id="targetSegment"
            value={targetSegment}
            onChange={(e) => setTargetSegment(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            <option value="random">Random</option>
            {displayedSegments.map(segment => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <h4>Segments to Display:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {segments.map(segment => (
              <label key={segment.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={segment.isDisplayed}
                  onChange={() => toggleSegmentDisplay(segment.id)}
                />
                <span style={{ color: segment.color, fontWeight: 'bold' }}>
                  {segment.logo} {segment.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <SpinningWheel segments={segments} targetSegmentId={targetSegment} />
    </div>
  );
};

export default App;