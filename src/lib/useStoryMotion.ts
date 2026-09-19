import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePhraseReveal(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const stage = root.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top 82%",
            end: "bottom 22%",
            scrub: 0.8,
          },
        });
        reveal
          .fromTo(
            line,
            { autoAlpha: 0, y: 38, scale: 0.975, filter: "blur(6px)" },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "none",
              duration: 0.35,
            },
          )
          .to(line, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            duration: 0.3,
          })
          .to(line, {
            autoAlpha: 0,
            y: -34,
            scale: 0.985,
            filter: "blur(5px)",
            ease: "none",
            duration: 0.35,
          });
      });
    }, stage);
    return () => context.revert();
  }, [root]);
}

/**
 * A deliberately small GSAP layer for the moments that need a shared scroll
 * clock. Canvas atmospheres and ambient CSS movement remain independent.
 */
export function useStoryMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const container = root.current;
    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const context = gsap.context(() => {
      const hero = container.querySelector<HTMLElement>(".hero");
      if (hero) {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        heroTimeline
          .to(
            hero.querySelector(".hero-image"),
            { scale: 1.13, yPercent: 5, ease: "none" },
            0,
          )
          .to(hero.querySelector(".hero-sky"), { yPercent: 9, ease: "none" }, 0)
          .to(
            hero.querySelector(".hero-copy"),
            { yPercent: -22, opacity: 0.16, ease: "none" },
            0,
          )
          .to(
            hero.querySelector(".scroll-cue"),
            { opacity: 0, y: 12, ease: "none" },
            0,
          );
      }

      const addAtmosphereMotion = (
        selector: string,
        target: string,
        vars: gsap.TweenVars,
      ) => {
        const section = container.querySelector(selector);
        const element = section?.querySelector(target);
        if (!section || !element) return;
        gsap.to(element, {
          ...vars,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      };

      addAtmosphereMotion("#looks", ".aurora", {
        scale: 1.1,
        xPercent: -5,
        yPercent: 4,
      });
      addAtmosphereMotion("#almost", ".liquid", { yPercent: -9, scale: 1.05 });
      addAtmosphereMotion("#us", ".rose", {
        xPercent: -5,
        yPercent: -6,
        scale: 1.08,
      });

      gsap.utils
        .toArray<HTMLElement>(".scene-transition")
        .forEach((transition) => {
          gsap.fromTo(
            transition.querySelector(".scene-transition__veil"),
            { opacity: 0.2, scale: 1.2 },
            {
              opacity: 0.9,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: transition,
                start: "top 88%",
                end: "bottom 18%",
                scrub: 0.8,
              },
            },
          );
        });

      const interlude = container.querySelector<HTMLElement>(".interlude");
      const thread = interlude?.querySelector<SVGPathElement>(".thread path");
      if (interlude && thread) {
        const length = thread.getTotalLength();
        gsap.set(thread, { strokeDasharray: length, strokeDashoffset: length });
        gsap.fromTo(
          thread,
          { strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: interlude,
              start: "top 92%",
              end: "bottom 8%",
              scrub: 2,
            },
          },
        );
        const copyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: interlude,
            start: "top 78%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
        copyTimeline
          .fromTo(
            interlude.querySelectorAll(".interlude-copy > p"),
            { opacity: 0.18, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, ease: "none" },
            0,
          )
          .fromTo(
            interlude.querySelector(".interlude-copy h2"),
            { opacity: 0.12, scale: 0.94 },
            { opacity: 1, scale: 1, ease: "none" },
            0.38,
          );
      }

      const august = container.querySelector<HTMLElement>("#august");
      const question = august?.querySelector<HTMLElement>(".question");
      if (august && question) {
        gsap.fromTo(
          question,
          { opacity: 0.08, y: 56, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: august,
              start: "42% 76%",
              end: "64% 52%",
              scrub: 0.8,
            },
          },
        );
      }
    }, container);

    return () => context.revert();
  }, [root]);
}
