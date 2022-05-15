import React from 'react'
import { useCanvas } from './useCanvas'
import type { CanvasDrawFunction } from './useCanvas';


/** Props to our generic React Canvas component. */
export interface CanvasProps {
  /** The drawing function. */
  draw: CanvasDrawFunction;

  /** The options to pass to the canvas. */
  options?: CanvasRenderingContext2DSettings;

  /** Arbitrary props to send to the canvas component. */
  [key: string]: any;
}


/** A generic React Canvas element. Takes a drawing function as input. */
export const Canvas: React.FC<CanvasProps> = ({ draw, options, ...rest }) => {
  const canvasRef = useCanvas(draw, options);
  return <canvas ref={canvasRef} {...rest} />
}
