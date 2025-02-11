import { useEffect, useRef } from "react";

export default function LoginAnimationPage({
  isPageLoaded,
}: {
  isPageLoaded: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      if (!document.querySelector('script[src="/js/lottie.min.js"]')) {
        const script = document.createElement("script");
        script.src = "/js/lottie.min.js";
        script.async = true;
        scriptRef.current = script;

        await new Promise<void>((resolve) => {
          script.onload = () => {
            if (isMounted && containerRef.current) {
              // @ts-ignore
              animationRef.current = window.lottie?.loadAnimation({
                container: containerRef.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: "/animations/hr-animation.json",
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
          path: "/animations/hr-animation.json",
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

  return (
    <div
      className={`w-full md:w-1/2 bg-gradient-to-b from-blue-600 to-blue-800 p-8 flex flex-col justify-center items-center transform transition-all duration-1000 ease-out
              ${
                isPageLoaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
    >
      <div
        className={`text-white text-center mb-8 transition-all duration-700 delay-300 transform
              ${
                isPageLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
      >
        <h2 className="text-3xl font-bold mb-2">Hệ Thống Quản Lý Nhân Sự</h2>
        <p className="text-blue-100">Chuyên nghiệp - Hiệu quả - An toàn</p>
      </div>

      <div
        ref={containerRef}
        className={`w-full max-w-md h-[500px] transition-all duration-700 delay-500 transform
                ${
                  isPageLoaded
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-10 opacity-0 scale-95"
                }`}
      />

      <div
        className={`mt-8 text-blue-100 text-center transition-all duration-700 delay-700 transform
              ${
                isPageLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
      >
        <p className="text-sm">© 2024 HR Management System</p>
        <p className="text-xs mt-2">Version 2.0.0</p>
      </div>
    </div>
  );
}
