import { motion } from 'framer-motion';

import { About } from '@/components/about/about';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { JoinGame } from '@/components/landing/join-game';
import { MainText } from '@/components/landing/main-text';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Team } from '@/components/team/team';
import { useSessions } from '@/hooks/queries/use-sessions';
import { useSectionScroll } from '@/hooks/use-section-scroll';

export default function Home() {
  useSessions();
  const { isInView, sectionsRef, ref } = useSectionScroll();
  return (
    <>
      <div className="flex min-h-screen flex-col gap-10 bg-white px-[90px]">
        <div
          ref={(el) => el && (sectionsRef.current[0] = el)}
          className="h-[calc(100vh-156px)]"
        >
          <div className="pt-10">
            <Header />
          </div>
          <div className="pt-[100px]">
            <MainText />
          </div>
          <div className="3xl:pt-[40vh] pt-[28vh]">
            <JoinGame />
          </div>
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
      <Footer isDark={true} ref={(el) => el && (sectionsRef.current[5] = el)} />
    </>
  );
}
