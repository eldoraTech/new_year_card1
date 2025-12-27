import { useEffect, useState } from "react";
import "./styles.css";

import StageCurtainFullscreen from "./components3D/StageCurtain/StageCurtainFullscreen.jsx";

import BalloonPopCanvas from "./components2D/Balloons/BalloonPopCanvas";
import SparkleGlowConfettiCanvas from "./components2D/Confetti/SparkleGlowConfettiCanvas";
import ConfettiClickBlastCanvas from "./components2D/Confetti/ConfettiClickBlastCanvas.jsx";
import SkyRocketFireworksCanvas from "./components2D/Fireworks/SkyRocketFireworksCanvas";
import Card1 from "./card1.jsx";

export default function NewYearCard() {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [step, setStep] = useState(0);

  /* ⏳ Show content AFTER curtain animation */
  useEffect(() => {
    if (!isCurtainOpen) return;

    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 1200); // match curtain animation duration

    return () => clearTimeout(timeout);
  }, [isCurtainOpen]);

    /* 🎉 Manage steps for effects */
  useEffect(() => {
    if (!showContent) return;
    else {
      const t1 = setTimeout(() => setStep(1), 3000);  // after 5s
      const t2 = setTimeout(() => setStep(2), 6000); // after 11s
      const t3 = setTimeout(() => setStep(3), 10000); // after 25s

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [showContent]);

  return (
    <>
      {!showContent && (<StageCurtainFullscreen onOpenChange={setIsCurtainOpen} />)}
      {/* <StageCurtainFullscreen onOpenChange={setIsCurtainOpen} /> */}

      {showContent && (
        <>
            {step >= 0 && <BalloonPopCanvas />}
        
              {step >= 1 && <SparkleGlowConfettiCanvas />}
        
              {step >= 2 && <SkyRocketFireworksCanvas />}

              {step >= 3 && <Card1 />}

              {step >= 3 && <ConfettiClickBlastCanvas />}

              {/* {step >= 3 && <TwistedRibbon3D />} */}
        </>
      )}
    </>
  );
}
