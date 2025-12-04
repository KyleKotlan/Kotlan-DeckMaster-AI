import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DeckDimensions } from '../types';

interface VisualizerProps {
  dimensions: DeckDimensions;
}

const Visualizer: React.FC<VisualizerProps> = ({ dimensions }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const { length, width } = dimensions;
    const padding = 40;
    
    // Get container size
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = Math.min(containerWidth * 0.75, 500); // 4:3 aspect ratio max

    // Create scales
    // We want to fit the deck into the container while maintaining aspect ratio
    // Length is X axis, Width is Y axis (top-down view)
    // Scale domain: [0, length in ft], [0, width in ft]
    
    // Determine scale factor to fit
    const scaleX = (containerWidth - padding * 2) / length;
    const scaleY = (containerHeight - padding * 2) / width;
    const scale = Math.min(scaleX, scaleY);

    const pixelLength = length * scale;
    const pixelWidth = width * scale;

    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

    const g = svg.append("g")
      .attr("transform", `translate(${(containerWidth - pixelLength) / 2}, ${(containerHeight - pixelWidth) / 2})`);

    // Draw Deck Outline
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", pixelLength)
      .attr("height", pixelWidth)
      .attr("fill", "#f0fdf4")
      .attr("stroke", "#15803d")
      .attr("stroke-width", 3);

    // Draw Joists (Vertical lines along length)
    // Joists run perpendicular to the ledger. 
    // Usually ledger is on the long side attached to house, or short side? 
    // Let's assume Length is along the house (horizontal), so joists run vertical (Width).
    const joistSpacingFt = 16 / 12; // 16 inches in feet
    const numJoists = Math.floor(length / joistSpacingFt) + 1;

    const joistsGroup = g.append("g").attr("class", "joists");

    for (let i = 0; i <= numJoists; i++) {
      const xPos = Math.min(i * joistSpacingFt * scale, pixelLength); // Clamp to end
      
      joistsGroup.append("line")
        .attr("x1", xPos)
        .attr("y1", 0)
        .attr("x2", xPos)
        .attr("y2", pixelWidth)
        .attr("stroke", "#86efac")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 2");
    }

    // Draw Posts
    // Simple logic: Max beam span approx 8-10ft. Max joist span depends on lumber size.
    // We'll just visualize generic post placements for aesthetics.
    const beamSpacingFt = 8; // approx
    const postSpacingFt = 8; // approx
    
    const numBeams = Math.ceil(width / beamSpacingFt); // Beams run parallel to length usually?
    // Actually, usually beams run parallel to house (Length), supporting joists which run perpendicular.
    // Let's place a beam at the outer edge and maybe one in middle if wide.
    
    // Simplified: Place posts at corners and distributed along the outer beam.
    // Let's assume a simple beam at the outer edge (y = pixelWidth).
    
    const postsGroup = g.append("g").attr("class", "posts");
    const numPostsX = Math.ceil(length / postSpacingFt) + 1;

    // Draw outer beam line
    g.append("line")
        .attr("x1", 0)
        .attr("y1", pixelWidth - (1 * scale)) // indented slightly
        .attr("x2", pixelLength)
        .attr("y2", pixelWidth - (1 * scale))
        .attr("stroke", "#166534")
        .attr("stroke-width", 4)
        .attr("opacity", 0.5);

    for (let i = 0; i < numPostsX; i++) {
        const xPos = Math.min(i * (length / (numPostsX - 1)) * scale, pixelLength);
        // Post at outer beam
        postsGroup.append("rect")
            .attr("x", xPos - 4) // Centered 8px box
            .attr("y", pixelWidth - (1 * scale) - 4)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", "#14532d");
    }


    // Add Dimensions Text
    // Width
    svg.append("text")
      .attr("x", (containerWidth - pixelLength) / 2 - 15)
      .attr("y", containerHeight / 2)
      .attr("text-anchor", "end")
      .attr("transform", `rotate(-90, ${(containerWidth - pixelLength) / 2 - 15}, ${containerHeight / 2})`)
      .attr("class", "text-xs font-mono fill-slate-500")
      .text(`${width} ft`);

    // Length
    svg.append("text")
      .attr("x", containerWidth / 2)
      .attr("y", (containerHeight - pixelWidth) / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs font-mono fill-slate-500")
      .text(`${length} ft`);

  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default Visualizer;
