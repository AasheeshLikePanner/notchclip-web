import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const WaterBackground = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const waterParticlesRef = useRef([]);

  useEffect(() => {
    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xADD8E6, // Light blue background
        antialias: false, // For pixelation effect
        canvas: canvasRef.current,
      });
      appRef.current = app;

      const container = new PIXI.Container();
      app.stage.addChild(container);

      const particleSize = 10; // Size of each pixelated water particle
      const numCols = Math.ceil(app.screen.width / particleSize);
      const numRows = Math.ceil(app.screen.height / particleSize);

      // Create a grid of black squares
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          const particle = new PIXI.Graphics();
          particle.fill(0x00008B); // Dark blue color
          particle.alpha = 0.7; // Add transparency
          particle.drawRect(0, 0, particleSize, particleSize);
          particle.endFill();
          particle.x = j * particleSize;
          particle.y = i * particleSize;
          container.addChild(particle);
          waterParticlesRef.current.push(particle);
        }
      }

      // Simple pixelation filter (applied to the whole stage)
      const pixelateFilter = new PIXI.filters.PixelateFilter();
      pixelateFilter.size = 10; // Adjust for desired pixel size
      app.stage.filters = [pixelateFilter];

      // Basic interaction for drops
      app.canvas.addEventListener('pointerdown', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Simulate a ripple effect by briefly scaling particles around the click
        waterParticlesRef.current.forEach(particle => {
          const dist = Math.sqrt(Math.pow(particle.x - mouseX, 2) + Math.pow(particle.y - mouseY, 2));
          if (dist < 100) { // Affect particles within a certain radius
            const scale = 1 - (dist / 100) * 0.5; // Scale down closer particles more
            particle.scale.set(scale);
            setTimeout(() => particle.scale.set(1), 300); // Reset after a short delay
          }
        });
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        // Recreate particles on resize for simplicity, or adjust existing ones
        container.removeChildren();
        waterParticlesRef.current = [];
        const newNumCols = Math.ceil(app.screen.width / particleSize);
        const newNumRows = Math.ceil(app.screen.height / particleSize);
        for (let i = 0; i < newNumRows; i++) {
          for (let j = 0; j < newNumCols; j++) {
            const particle = new PIXI.Graphics();
            particle.fill(0x00008B);
            particle.alpha = 0.7;
            particle.drawRect(0, 0, particleSize, particleSize);
            particle.endFill();
            particle.x = j * particleSize;
            particle.y = i * particleSize;
            container.addChild(particle);
            waterParticlesRef.current.push(particle);
          }
        }
      };

      window.addEventListener('resize', handleResize);
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default WaterBackground;
