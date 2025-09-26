import React, { useEffect, useState } from "react";
import parse, { domToReact, type HTMLReactParserOptions } from "html-react-parser";


interface RotatorBlock {rotatorText: string;}
interface TextRotatorContent {preText?: string; rotatorBlock?: RotatorBlock[];}
interface TextContent {bodytext?: string;}
interface HeroSectionProps {
  textRotator?: TextRotatorContent; // id 2640
  textContent?: TextContent;       // id 2639
}

const HeroSection: React.FC<HeroSectionProps> = ({
  textRotator,
  textContent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (textRotator?.rotatorBlock?.length && textRotator.rotatorBlock.length > 1) {
      const interval = setInterval(() => {
        setIsAnimatingOut(true);

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % textRotator.rotatorBlock!.length);
          setIsAnimatingOut(false);
        }, 600); 
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [textRotator]);

  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === "h1") return <></>; 
      if (domNode.name === "span" && domNode.attribs) {
        const cls = domNode.attribs.class || "";
        if (cls.includes("secondary-color")) {
          return (
            <span className="text-sm sm:text-base md:text-lg text-white/90">
              {domToReact(domNode.children)}
            </span>
          );
        }
      }
    },
  };

  return (
    <section className="relative bg-[#4DD0E1] min-h-[480px] md:min-h-[600px] lg:min-h-screen flex items-center overflow-hidden">
      <div className="hidden md:block absolute right-6 md:right-10 top-12 md:top-20 w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border border-blue-400/50">
        <div className="absolute inset-3 md:inset-4 rounded-full border border-blue-400/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">{/* id 2640 */}
              {textRotator?.preText}{" "}
              <span className="inline-flex items-baseline relative overflow-hidden align-baseline h-[1.2em]">
                {textRotator?.rotatorBlock && (
                  <span
                    key={currentIndex}
                    className={`block transition-transform duration-700 ease-in-out ${
                      isAnimatingOut ? "animate-slide-up" : "animate-slide-in"
                    }`}
                  >
                    {textRotator.rotatorBlock[currentIndex].rotatorText}
                  </span>
                )}
              </span>
              <br />
             <span className="relative inline-block">
                <span className="relative z-10">website today</span>
                <span className="absolute left-0 bottom-1 w-full h-2 bg-gradient-to-r from-blue-600 to-transparent z-0"></span>
              </span>

            </h1>
            {textContent?.bodytext && (
              <div className="mt-4 max-w-xl md:max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg leading-relaxed">
                {parse(textContent.bodytext, parseOptions)}
              </div>
            )}
            <div className="mt-6">
              <a href="/" className="inline-block bg-gradient-to-r from-blue-600 to-pink-500 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg shadow-lg hover:opacity-90 transition">
                Build your website →
              </a>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0 flex justify-center">
            <img
              src="https://t3-reva.t3planet.de/fileadmin/_processed_/1/8/csm_reva_hero_1_513e8c265d.png"
              alt="IMG"
              className="w-full h-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl drop-shadow-xl"
            />
          </div>
        </div>
      </div>
      <style>
  {`
    @keyframes slideInFromTop {
      0% { transform: translateY(-100%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    .animate-slide-in {
      animation: slideInFromTop 0.6s ease forwards;
    }
    
  `}
</style>

    </section>
  );
};

export default HeroSection;
