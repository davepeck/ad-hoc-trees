import { useRef, useEffect, RefObject } from "react";

/** Utility to force a canvas to match bounding dimensions and pixel density. */
const resizeCanvasContext = (context: CanvasRenderingContext2D): void => {
  const canvas = context.canvas;
  const { width, height } = canvas.getBoundingClientRect();

  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
  }
};

/** The type of a drawing callback function. */
export type CanvasDrawFunction = (ctx: CanvasRenderingContext2D) => void;

/** Hook to support the use of a 2D canvas from within React code. */
export const useCanvas = (
  draw: CanvasDrawFunction,
  options: CanvasRenderingContext2DSettings = {}
): RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", options);
      if (context !== null) {
        resizeCanvasContext(context);
        draw(context);
      }
    }
  }, [draw, canvasRef]);

  return canvasRef;
};
