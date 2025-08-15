"use client";
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

        const links = document.querySelectorAll("a[href^=*/*]");
        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const href = e.currentTarget.href;
                const url = new URL(href).pathname;
                if (url !== pathname) {
                    handleRouteChange(url);
                }
            });
        });

        return () => {
            links.forEach((link) => {
                link.removeEventListener("click", handleRouteChange);
            });
        };
    }, [router, pathname]);

    const coverPage = (url) => {
        const tl = gsap.timeline({
            onComplete: () => router.push(url),
        });

        tl.to(blocksRef.current, {
            scaleX: 1,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.out",
            transformOrigin: "left",
        })
            .set(
                logoOverlayRef.current,
                {
                    opacity: 1,
                },
                "-=0.2"
            )
            .set(
                logoRef.current.querySelector("path"),
                {
                    strokeDashoffset: logoRef.current
                        .querySelector("path")
                        .getTotalLength(),
                    fill: "transparent",
                },
                "-=0.25"
            ).to(logoRef.current.querySelector("path"),
                {
                    strokeDashoffset: 0,
                    duration: 2,
                    ease: "power2.inOut",
                },
                "-=0.5")
    };

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
    );
};

export default PageTransition;
