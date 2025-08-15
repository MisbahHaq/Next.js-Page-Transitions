"use client"
import Logo from "./Logo";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";

const PageTransition = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const overlayRef = useRef(null);
    const logoOverlayRef = useRef(null);
    const blockRef = useRef([]);
    const isTransitioning = useRef(false);

    useEffect(() => {
        const createBlocks = () => {
            if (!overlayRef.current) return;
            overlayRef.current.innerHTML = "";
            blockRef.current = [];

            for (let i = 0; i < 20; i++) {
                const block = document.createElement("div");
                block.className = "block";
                overlayRef.current.appendChild(block);
                blockRef.current.push(block);
            }
        };

        createBlocks();
        gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

        if (logoRef.current) {
            const path = logoRef.current.querySelector("path");
            if (path) {
                const length = path.getTotalLength();
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    fill: "transparent",
                });
            }
        }
        revealPage();

        const handleRouteChange = (url) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };
    }, [router, pathname]);

    return (
        <>
            <div ref={overlayRef} className="transition-overlay"></div>
            <div ref={logoOverlayRef} className="logo-overlay">
                <div className="logo-container">
                    <Logo ref={logoRef} />
                </div>
            </div>
            {children}
        </>
    )
}

export default PageTransition;