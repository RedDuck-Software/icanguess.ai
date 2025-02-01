import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { About } from '@/components/about/about';
import { JoinGame } from '@/components/landing/join-game';
import { MainText } from '@/components/landing/main-text';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Team } from '@/components/team/team';
import { Footer } from '@/components/footer/footer';

export default function Home() {
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

      setTimeout(() => setIsScrolling(false), 600); // Reset scroll lock after smooth scroll
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentSection, isScrolling]);

  return (
    <>
      <div className="flex min-h-screen flex-col gap-10 bg-white px-[90px] pt-[100px]">
        <div
          ref={(el) => el && (sectionsRef.current[0] = el)}
          className="mb-10"
        >
          <MainText />
          <JoinGame />
        </div>
        <div ref={ref}>
          <motion.div
            initial={{ y: 500, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 2.4 }}
          >
            <Mode ref={(el) => el && (sectionsRef.current[1] = el)} />
          </motion.div>
        </div>
        <About ref={(el) => el && (sectionsRef.current[2] = el)} />
        <Rules ref={(el) => el && (sectionsRef.current[3] = el)} />
        <Team ref={(el) => el && (sectionsRef.current[4] = el)} />
      </div>
      <Footer isDark={true} />
    </>
  );
}
