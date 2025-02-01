import { Figma, Github, Send } from 'lucide-react';

/* eslint-disable no-inline-styles/no-inline-styles */
export const Footer = () => {
  return (
    <section className="w-full">
      <div
        className="h-[50px] bg-purple"
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
          className="h-[50px] w-full rounded-b-[50px] bg-dark"
        ></div>
      </div>
      <div
        style={{
          backgroundImage: "url('/Noise2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
        className="bg-purple py-[150px]"
      >
        <div className="flex items-center justify-around">
          <a href="" target="_blank" className="flex items-center gap-5">
            <Figma width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Figma Project File
            </p>
          </a>
          <a href="" target="_blank" className="flex items-center gap-5">
            <Github width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Github Project
            </p>
          </a>
          <a href="" target="_blank" className="flex items-center gap-5">
            <Send width={32} height={32} />
            <p className="font-roboto text-[20px] underline underline-offset-2">
              Our Contact
            </p>
          </a>
        </div>
        <p className="text-center font-space text-[20px] uppercase text-dark">
          The product is made specifically for ETHKyiv Impulse
        </p>
      </div>
    </section>
  );
};
