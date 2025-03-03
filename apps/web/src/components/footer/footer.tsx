import { Figma, Github, Send } from 'lucide-react';
import { forwardRef } from 'react';

import { Card } from '../ui/card';

/* eslint-disable no-inline-styles/no-inline-styles */

type Props = {
  isDark: boolean;
};
export const Footer = forwardRef<HTMLDivElement, Props>(({ isDark }, ref) => {
  return !isDark ? (
    <section className="w-full">
      <div
        className="bg-purple"
        style={{
          backgroundImage: "url('/Noise2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      >
        <div
          style={{
            backgroundImage: "url('/Noise.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
          }}
          className="h-[100px] w-full rounded-b-[50px] bg-dark"
        ></div>
      </div>
      <div
        style={{
          backgroundImage: "url('/Noise2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
        className="flex flex-col gap-[300px] bg-purple py-[150px]"
      >
        <div className="flex items-center justify-around">
          <a
            href="https://www.figma.com/design/NAPzWZ5T3KSVosHOqSpxXj/HOTorCOLD.ai?node-id=1-666&t=kAHps1aEckfOfDED-0"
            target="_blank"
            className="flex items-center gap-5"
          >
            <Figma width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Figma Project File
            </p>
          </a>
          <a
            href="https://github.com/RedDuck-Software/icanguess.ai"
            target="_blank"
            className="flex items-center gap-5"
          >
            <Github width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Github Project
            </p>
          </a>
          <a
            href="https://t.me/MrJeleika"
            target="_blank"
            className="flex items-center gap-5"
          >
            <Send width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Our Contact
            </p>
          </a>
        </div>
        <p
          ref={ref}
          className="text-center font-space text-[20px] uppercase text-dark"
        >
          The product is made specifically for One Trillion Agents Hackathon
        </p>
      </div>
    </section>
  ) : (
    <section className="relative z-30 h-[78vh] max-h-[800px] w-full">
      <Card
        className="h-full w-full flex-col gap-10 rounded-b-none p-10"
        variant={'dark'}
        radius={50}
        lightNoise
      >
        <div className="flex items-center gap-5">
          <p className="font-space text-[24px] uppercase text-dark"></p>
        </div>
        <div className="flex w-full flex-col gap-[300px] py-[150px] text-white">
          <div className="flex w-full items-center justify-around">
            <a
              href="https://www.figma.com/design/NAPzWZ5T3KSVosHOqSpxXj/HOTorCOLD.ai?node-id=1-666&t=kAHps1aEckfOfDED-0"
              target="_blank"
              className="flex items-center gap-5"
            >
              <Figma width={32} height={32} />
              <p className="font-roboto text-[20px] underline underline-offset-2">
                Figma Project File
              </p>
            </a>
            <a
              href="https://github.com/RedDuck-Software/icanguess.ai"
              target="_blank"
              className="flex items-center gap-5"
            >
              <Github width={32} height={32} />
              <p className="font-roboto text-[20px] underline underline-offset-2">
                Github Project
              </p>
            </a>
            <a
              href="https://t.me/MrJeleika"
              target="_blank"
              className="flex items-center gap-5"
            >
              <Send width={32} height={32} />
              <p className="font-roboto text-[20px] underline underline-offset-2">
                Our Contact
              </p>
            </a>
          </div>
          <p ref={ref} className="text-center font-space text-[20px] uppercase">
            The product is made specifically for One Trillion Agents Hackathon
          </p>
        </div>
      </Card>
    </section>
  );
});
