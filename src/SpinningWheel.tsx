import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './SpinningWheel.css';

export interface BrandSegment {
  id: string;
  name: string;
  color: string;
  logo?: string; // URL or emoji
  isDisplayed: boolean;
  isNoWin?: boolean;
}

export interface SpinningWheelProps {
  segments: BrandSegment[];
  targetSegmentId?: string; // 'random' | segmentId | undefined
}

const SPIN_DURATION = 5.5;

const SpinningWheel: React.FC<SpinningWheelProps> = ({ segments, targetSegmentId = 'random' }) => {
  const displayedSegments = segments.filter(segment => segment.isDisplayed);
  const segmentCount = displayedSegments.length;
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Ready to spin!');
  const [currentRotation, setCurrentRotation] = useState<number>(0);

  const wheelRef = useRef<HTMLDivElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement>(null);



  const drawWheel = (): void => {
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
      path.setAttribute('fill', displayedSegments[i].color);
      path.setAttribute('stroke', '#fff');
      svg.appendChild(path);

      const midAngle = (startAngle + endAngle) / 2;
      
      // Position for number (top of segment)
      const numberTx = cx + 80 * Math.cos((midAngle - 90) * Math.PI / 180);
      const numberTy = cy + 80 * Math.sin((midAngle - 90) * Math.PI / 180);
      
      // Position for emoji (bottom of segment)
      const emojiTx = cx + 130 * Math.cos((midAngle - 90) * Math.PI / 180);
      const emojiTy = cy + 130 * Math.sin((midAngle - 90) * Math.PI / 180);

      const segment = displayedSegments[i];
      
      // Add brand name text (at top)
      const nameText = document.createElementNS(svgNS, 'text');
      nameText.setAttribute('x', numberTx.toString());
      nameText.setAttribute('y', numberTy.toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('dominant-baseline', 'middle');
      nameText.setAttribute('fill', 'white');
      nameText.setAttribute('font-size', '14');
      nameText.setAttribute('font-weight', 'bold');
      nameText.setAttribute('transform', `rotate(${midAngle}, ${numberTx}, ${numberTy})`);
      nameText.textContent = segment.name;
      svg.appendChild(nameText);

      // Add logo/emoji text (larger, at bottom)
      if (segment.logo) {
        const logoText = document.createElementNS(svgNS, 'text');
        logoText.setAttribute('x', emojiTx.toString());
        logoText.setAttribute('y', emojiTy.toString());
        logoText.setAttribute('text-anchor', 'middle');
        logoText.setAttribute('dominant-baseline', 'middle');
        logoText.setAttribute('font-size', '32');
        logoText.setAttribute('transform', `rotate(${midAngle}, ${emojiTx}, ${emojiTy})`);
        logoText.textContent = segment.logo;
        svg.appendChild(logoText);
      }
    }

    wheelRef.current.appendChild(svg);
  };

  const calculateTargetAngle = (segmentId: string): number => {
    const anglePerSegment = 360 / segmentCount;
    const index = displayedSegments.findIndex(seg => seg.id === segmentId);
    if (index === -1) return 0;
    const centerAngle = index * anglePerSegment + anglePerSegment / 2;
    return ((-centerAngle % 360) + 360) % 360;
  };


  const playSpinSound = (): void => {
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

  const spin = (): void => {
    if (isSpinning) return;
    setIsSpinning(true);

    const selected = targetSegmentId;
    const duration = SPIN_DURATION;
    const spins = 5;
    let targetSegment: BrandSegment;
    let targetAngle: number;

    if (selected === 'random') {
      const randomIndex = Math.floor(Math.random() * displayedSegments.length);
      targetSegment = displayedSegments[randomIndex];
    } else {
      const foundSegment = displayedSegments.find(seg => seg.id === selected);
      targetSegment = foundSegment || displayedSegments[0];
    }

    targetAngle = calculateTargetAngle(targetSegment.id);
    
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
        const resultMessage = targetSegment.isNoWin 
          ? `❌ No Win!` 
          : `🎯 Landed on ${targetSegment.name}!`;
        setStatus(resultMessage);
      }
    });
  };

  useEffect(() => {
    drawWheel();
  }, [displayedSegments]);


  return (
    <div className="spinning-wheel-container">
      <audio ref={spinAudioRef} preload="auto">
        <source src="/spin.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="container">
        

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