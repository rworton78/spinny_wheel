import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './SpinningWheel.css';

const SpinningWheel = () => {
  const [segmentCount, setSegmentCount] = useState(6);
  const [winningSegment, setWinningSegment] = useState('random');
  const [spinDuration, setSpinDuration] = useState(5.5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [status, setStatus] = useState('Ready to spin!');
  const [currentRotation, setCurrentRotation] = useState(0);

  const wheelRef = useRef(null);
  const spinAudioRef = useRef(null);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
    '#feca57', '#ff9ff3', '#a8e6cf', '#ff8b94',
    '#ffaaa5', '#ff677d', '#d4a4eb', '#a8dadc'
  ];

  const emojis = [
    '🎯', '🍀', '⭐', '🎉', '🔥', '💎', 
    '🚀', '🎊', '🌟', '🎈', '🎁', '🏆'
  ];

  const updateSegmentCount = (newCount) => {
    const count = parseInt(newCount);
    if (count >= 2 && count <= 12) {
      setSegmentCount(count);
      setStatus(`Updated to ${count} segments`);
      
      // Reset winning segment if it's higher than new count
      if (winningSegment !== 'random' && parseInt(winningSegment) > count) {
        setWinningSegment('random');
      }
      
      setTimeout(() => {
        if (!isSpinning) setStatus('Ready to spin!');
      }, 2000);
    }
  };

  const drawWheel = () => {
    if (!wheelRef.current) return;

    wheelRef.current.innerHTML = '';
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 350 350');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const cx = 175;
    const cy = 175;
    const r = 165;
    const angle = 360 / segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;

      const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180);

      const largeArc = angle > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', colors[i % colors.length]);
      path.setAttribute('stroke', '#fff');
      svg.appendChild(path);

      const midAngle = (startAngle + endAngle) / 2;
      
      // Position for number (top of segment)
      const numberTx = cx + 80 * Math.cos((midAngle - 90) * Math.PI / 180);
      const numberTy = cy + 80 * Math.sin((midAngle - 90) * Math.PI / 180);
      
      // Position for emoji (bottom of segment)
      const emojiTx = cx + 130 * Math.cos((midAngle - 90) * Math.PI / 180);
      const emojiTy = cy + 130 * Math.sin((midAngle - 90) * Math.PI / 180);

      // Add number text (at top)
      const numberText = document.createElementNS(svgNS, 'text');
      numberText.setAttribute('x', numberTx);
      numberText.setAttribute('y', numberTy);
      numberText.setAttribute('text-anchor', 'middle');
      numberText.setAttribute('dominant-baseline', 'middle');
      numberText.setAttribute('fill', 'white');
      numberText.setAttribute('font-size', '18');
      numberText.setAttribute('font-weight', 'bold');
      numberText.setAttribute('transform', `rotate(${midAngle}, ${numberTx}, ${numberTy})`);
      numberText.textContent = i + 1;
      svg.appendChild(numberText);

      // Add emoji text (larger, at bottom)
      const emojiText = document.createElementNS(svgNS, 'text');
      emojiText.setAttribute('x', emojiTx);
      emojiText.setAttribute('y', emojiTy);
      emojiText.setAttribute('text-anchor', 'middle');
      emojiText.setAttribute('dominant-baseline', 'middle');
      emojiText.setAttribute('font-size', '32');
      emojiText.setAttribute('transform', `rotate(${midAngle}, ${emojiTx}, ${emojiTy})`);
      emojiText.textContent = emojis[i % emojis.length];
      svg.appendChild(emojiText);
    }

    wheelRef.current.appendChild(svg);
  };

  const calculateTargetAngle = (segment) => {
    const anglePerSegment = 360 / segmentCount;
    const index = parseInt(segment) - 1;
    const centerAngle = index * anglePerSegment + anglePerSegment / 2;
    return ((-centerAngle % 360) + 360) % 360;
  };

  const detectSegment = (finalRotation) => {
    const normalized = ((finalRotation % 360) + 360) % 360;
    const adjusted = (normalized + 90) % 360;
    const segment = Math.floor(adjusted / (360 / segmentCount));
    return segment + 1;
  };

  const playSpinSound = () => {
    if (spinAudioRef.current) {
      try {
        spinAudioRef.current.currentTime = 0;
        spinAudioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      } catch (error) {
        console.log('Audio error:', error);
      }
    }
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const selected = winningSegment;
    const duration = parseFloat(spinDuration);
    const spins = 5;
    let targetSegment, targetAngle;

    if (selected === 'random') {
      targetSegment = Math.floor(Math.random() * segmentCount) + 1;
    } else {
      targetSegment = parseInt(selected);
    }

    targetAngle = calculateTargetAngle(targetSegment);
    
    // Add random variation between 5-10 degrees for slight variation
    const randomVariation = 5 + Math.random() * 5; // 5-10 degrees
    const variationDirection = Math.random() < 0.5 ? -1 : 1; // randomly clockwise or counterclockwise
    const addedRotation = randomVariation * variationDirection;
    const finalTargetAngle = targetAngle + addedRotation;
    
    console.log(`Added rotation: ${addedRotation.toFixed(2)}°`);
    
    const baseRotation = Math.round(currentRotation / 360) * 360;
    const finalRotation = baseRotation + spins * 360 + finalTargetAngle;

    setStatus('Spinning...');
    playSpinSound();

    gsap.to(wheelRef.current, {
      rotation: finalRotation,
      duration: duration,
      ease: "power2.out",
      onComplete: () => {
        setIsSpinning(false);
        setCurrentRotation(finalRotation);
        setStatus(`🎯 Landed on Segment ${targetSegment}!`);
      }
    });
  };

  useEffect(() => {
    drawWheel();
  }, [segmentCount]);

  const generateWinningOptions = () => {
    const options = [<option key="random" value="random">Random</option>];
    for (let i = 1; i <= segmentCount; i++) {
      options.push(
        <option key={i} value={i}> {i}</option>
      );
    }
    return options;
  };

  return (
    <div className="spinning-wheel-container">
      <audio ref={spinAudioRef} preload="auto">
        <source src="/spin.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="container">
        <h1>🎯 Guaranteed Spinning Wheel</h1>
        
        <div className="controls">
          <div className="control-group">
            <label htmlFor="segmentCount">Segments:</label>
            <input 
              type="number" 
              id="segmentCount" 
              min="2" 
              max="12" 
              value={segmentCount}
              onChange={(e) => updateSegmentCount(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label htmlFor="winningSegment">Winning Segment:</label>
            <select 
              id="winningSegment"
              value={winningSegment}
              onChange={(e) => setWinningSegment(e.target.value)}
            >
              {generateWinningOptions()}
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="spinDuration">Spin Duration (s):</label>
            <input 
              type="number" 
              id="spinDuration" 
              min="1" 
              max="10" 
              value={spinDuration}
              step="0.5"
              onChange={(e) => setSpinDuration(e.target.value)}
            />
          </div>
        </div>

        <div className="wheel-container">
          <div className="wheel" ref={wheelRef}></div>
          <div className="pointer"></div>
          <div className="center-dot"></div>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning}
        >
          {isSpinning ? '🌟 SPINNING...' : '🎲 SPIN THE WHEEL'}
        </button>
        
        <div className="status">{status}</div>
      </div>
    </div>
  );
};

export default SpinningWheel;