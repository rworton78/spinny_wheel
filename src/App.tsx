import React from 'react';
import SpinningWheel, { BrandSegment } from './SpinningWheel';
import './App.css';

const App: React.FC = () => {
  const [targetSegment, setTargetSegment] = React.useState<string>('1');
  const [segments, setSegments] = React.useState<BrandSegment[]>([
    { id: '1', name: 'Google', color: '#4285f4', logo: '🔍', isDisplayed: true, winningMessage: 'You won a Google gift card!', claimURL: 'https://www.google.com' },
    { id: '2', name: 'Adidas', color: '#000000', logo: '👟', isDisplayed: true, winningMessage: 'You won Adidas sneakers!', claimURL: 'https://www.adidas.com' },
    { id: '3', name: 'Greggs', color: '#ff6b35', logo: '🥖', isDisplayed: true, winningMessage: 'You won a free Greggs sandwich!', claimURL: 'https://www.greggs.co.uk' },
    { id: '4', name: 'Apple', color: '#007aff', logo: '🍎', isDisplayed: true, winningMessage: 'You won an Apple product!', claimURL: 'https://www.apple.com' },
    { id: '5', name: 'Nike', color: '#ff6600', logo: '✅', isDisplayed: true, winningMessage: 'You won Nike gear!', claimURL: 'https://www.nike.com' },
    { id: '6', name: 'No Win', color: '#666666', logo: '❌', isDisplayed: true, isNoWin: true, winningMessage: 'Better luck next time!' }
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