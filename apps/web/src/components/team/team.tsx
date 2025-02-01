/* eslint-disable no-inline-styles/no-inline-styles */
import { Send } from 'lucide-react';
import { forwardRef } from 'react';

import { Card } from '../ui/card';

const members = [
  {
    image: '/guy1.png',
    tgLink: 'https://t.me/kotomops',
    tgHandle: '@kotomops',
    name: 'Kostya Mospan',
  },
  {
    image: '/guy2.png',
    tgLink: 'https://t.me/kotomops',
    tgHandle: '@kotomops',
    name: 'Kostya Mospan',
  },
  {
    image: '/guy3.png',
    tgLink: 'https://t.me/kotomops',
    tgHandle: '@kotomops',
    name: 'Kostya Mospan',
  },
  {
    image: '/guy4.png',
    tgLink: 'https://t.me/kotomops',
    tgHandle: '@kotomops',
    name: 'Kostya Mospan',
  },
  {
    image: '/guy5.png',
    tgLink: 'https://t.me/MrJeleika',
    tgHandle: '@MrJeleika',
    name: 'Denys Proskura',
  },
] satisfies MemberProps[];

export const Team = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section className="z-1 relative h-[98vh] w-full">
      <div
        style={{
          backgroundImage: "url('/Noise2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
        className="absolute -left-[90px] -top-10 z-[1] h-[120vh] w-screen bg-purple"
      ></div>

      <Card
        className="relative z-10 h-full w-full flex-col gap-10 p-10"
        variant={'purple'}
        radius={50}
        lightNoise
      >
        <div className="flex items-center gap-5">
          <p className="font-space text-[24px] uppercase text-dark">TEAm</p>
          <img src="/icons/arrow-down.svg" alt="arrow" />
        </div>
        <div
          ref={ref}
          className="flex h-full flex-col items-center justify-center gap-5"
        >
          <h2 className="font-space text-[80px] text-dark">Team Members</h2>
          <div className="flex items-center gap-5">
            {members.map((member) => (
              <Member {...member} />
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
});

type MemberProps = {
  image: string;
  name: string;
  tgLink: string;
  tgHandle: string;
};

export const Member = (props: MemberProps) => {
  return (
    <div className="flex flex-col gap-3">
      <img src={props.image} alt={props.name} />
      <div className="flex flex-col items-center gap-2">
        <p className="font-roboto text-[20px] text-dark">{props.name}</p>
        <a
          className="flex items-center gap-1"
          href={props.tgLink}
          target="_blank"
        >
          <Send className="w-4" />
          <p>{props.tgHandle}</p>
        </a>
      </div>
    </div>
  );
};
