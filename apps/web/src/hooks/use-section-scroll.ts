import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export const useSectionScroll = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (isScrolling) return;
      setIsScrolling(true);

      const delta = event.deltaY;
      let nextSectionIndex = currentSection;

      if (delta > 0 && currentSection < sectionsRef.current.length - 1) {
        // Scroll down
        nextSectionIndex = currentSection + 1;
      } else if (delta < 0 && currentSection > 0) {
        // Scroll up
        nextSectionIndex = currentSection - 1;
      }

      if (nextSectionIndex !== currentSection) {
        if (nextSectionIndex === 0) {
          scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          sectionsRef.current[nextSectionIndex]?.scrollIntoView({
            behavior: 'smooth',
          });
        }
        setCurrentSection(nextSectionIndex);
      }

      setTimeout(() => setIsScrolling(false), 600);
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentSection, isScrolling]);

  return { sectionsRef, isInView, ref };
};
