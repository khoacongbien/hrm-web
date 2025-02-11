"use client";
import { useEffect, useRef } from "react";

export default function HomeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      if (!document.querySelector('script[src="/js/lottie.min.js"]')) {
        return new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "/js/lottie.min.js";
          script.async = true;
          scriptRef.current = script;

          script.onload = () => {
            if (isMounted && containerRef.current) {
              // @ts-ignore
              animationRef.current = window.lottie?.loadAnimation({
                container: containerRef.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: "/animations/printcard.json",
              });
            }
            resolve();
          };

          document.body.appendChild(script);
        });
      } else if (containerRef.current) {
        // @ts-ignore
        animationRef.current = window.lottie?.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/animations/printcard.json",
        });
      }
    };
    loadAnimation();

    return () => {
      isMounted = false;
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full max-w-md h-[500px]" />;
}
