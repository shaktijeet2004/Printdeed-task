import { useRef, useState, useEffect, useCallback } from "react";
import {
  Stage, Layer, Rect, Circle, Text, Image as KonvaImage,
  Star, Line, Path, Transformer, Group,
} from "react-konva";
import { useDesign } from "../context/DesignContext";

/* ─── hook: load image ─── */
function useKonvaImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) { setImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = src;
    return () => { img.onload = null; img.onerror = null; };
  }, [src]);
  return image;
}

/* ─── snap guide calculation ─── */
const SNAP_THRESHOLD = 6;

function getSnapLines(elements, dragId, canvasW, canvasH) {
  const lines = {
    vertical: [0, canvasW / 2, canvasW],
    horizontal: [0, canvasH / 2, canvasH],
  };
  elements.forEach((el) => {
    if (el.id === dragId || !el.visible) return;
    lines.vertical.push(el.x, el.x + (el.width || 0) / 2, el.x + (el.width || 0));
    lines.horizontal.push(el.y, el.y + (el.height || 0) / 2, el.y + (el.height || 0));
  });
  return lines;
}

function getSnapped(pos, size, guides) {
  const edges = [pos, pos + size / 2, pos + size];
  let best = null;
  let bestDist = SNAP_THRESHOLD;
  for (const g of guides) {
    for (let i = 0; i < edges.length; i++) {
      const d = Math.abs(edges[i] - g);
      if (d < bestDist) { bestDist = d; best = { guide: g, offset: g - edges[i] }; }
    }
  }
  return best;
}

/* ─── inner shape renderer (draws at 0,0 within a Group) ─── */
function InnerShape({ shapeType, width, height, fill }) {
  const f = fill || "#6c5ce7";
  switch (shapeType) {
    case "rectangle":
      return <Rect width={width} height={height} fill={f} cornerRadius={4} />;
    case "roundedRect":
      return <Rect width={width} height={height} fill={f} cornerRadius={Math.min(width, height) * 0.2} />;
    case "circle":
      return <Circle x={width / 2} y={height / 2} radius={Math.min(width, height) / 2} fill={f} />;
    case "triangle":
      return <Line points={[width / 2, 0, width, height, 0, height]} closed fill={f} />;
    case "star":
      return <Star x={width / 2} y={height / 2} numPoints={5} innerRadius={Math.min(width, height) / 2 * 0.4} outerRadius={Math.min(width, height) / 2} fill={f} />;
    case "diamond":
      return <Line points={[width / 2, 0, width, height / 2, width / 2, height, 0, height / 2]} closed fill={f} />;
    case "hexagon":
      return <Star x={width / 2} y={height / 2} numPoints={6} innerRadius={Math.min(width, height) / 2} outerRadius={Math.min(width, height) / 2} fill={f} />;
    case "pentagon":
      return <Star x={width / 2} y={height / 2} numPoints={5} innerRadius={Math.min(width, height) / 2} outerRadius={Math.min(width, height) / 2} fill={f} />;
    case "arrow":
      return <Line points={[0, height * 0.3, width * 0.65, height * 0.3, width * 0.65, 0, width, height / 2, width * 0.65, height, width * 0.65, height * 0.7, 0, height * 0.7]} closed fill={f} />;
    case "heart":
      return <Path data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={f} scaleX={width / 24} scaleY={height / 24} />;
    case "cross":
      return <Line points={[width / 3, 0, width * 2 / 3, 0, width * 2 / 3, height / 3, width, height / 3, width, height * 2 / 3, width * 2 / 3, height * 2 / 3, width * 2 / 3, height, width / 3, height, width / 3, height * 2 / 3, 0, height * 2 / 3, 0, height / 3, width / 3, height / 3]} closed fill={f} />;
    case "octagon":
      return <Star x={width / 2} y={height / 2} numPoints={8} innerRadius={Math.min(width, height) / 2} outerRadius={Math.min(width, height) / 2} fill={f} />;
    case "parallelogram":
      return <Line points={[width * 0.2, 0, width, 0, width * 0.8, height, 0, height]} closed fill={f} />;
    case "trapezoid":
      return <Line points={[width * 0.2, 0, width * 0.8, 0, width, height, 0, height]} closed fill={f} />;
    case "lightning":
      return <Line points={[width * 0.54, 0, width * 0.21, height * 0.58, width * 0.46, height * 0.58, width * 0.375, height, width * 0.79, height * 0.42, width * 0.54, height * 0.42]} closed fill={f} />;
    case "ring":
      return <Star x={width / 2} y={height / 2} numPoints={40} innerRadius={Math.min(width, height) / 2 * 0.6} outerRadius={Math.min(width, height) / 2} fill={f} />;
    case "pill":
      return <Rect y={height * 0.15} width={width} height={height * 0.7} cornerRadius={height * 0.35} fill={f} />;
    case "chevron":
      return <Line points={[0, 0, width * 0.6, height / 2, 0, height, width * 0.3, height, width, height / 2, width * 0.3, 0]} closed fill={f} />;
    case "shield":
      return <Path data="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={f} scaleX={width / 24} scaleY={height / 24} />;
    case "tag":
      return <Line points={[0, height * 0.15, 0, height * 0.45, width * 0.55, height, width * 0.95, height * 0.6, width * 0.4, 0.05 * height]} closed fill={f} />;
    case "semicircle":
      return <Path data="M2 16 A10 10 0 0 1 22 16 Z" fill={f} scaleX={width / 24} scaleY={height / 24} />;
    default:
      return <Rect width={width} height={height} fill={f} />;
  }
}

/* ─── unified element component using Group ─── */
function CanvasElement({ element, onSelect, onDragEnd, onTransformEnd, onDblClick, onDragMove, registerRef }) {
  const groupRef = useRef(null);

  useEffect(() => {
    registerRef(element.id, groupRef.current);
    return () => registerRef(element.id, null);
  });

  const { id, type, x, y, width, height, opacity, locked, rotation } = element;

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;
    const sx = node.scaleX(), sy = node.scaleY();
    // Reset scale to 1, bake into width/height
    node.scaleX(1);
    node.scaleY(1);
    onTransformEnd(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(10, (width || 100) * sx),
      height: Math.max(10, (height || 100) * sy),
      rotation: node.rotation(),
    });
  };

  const handleDragEnd = (e) => {
    onDragEnd(id, e.target.x(), e.target.y());
  };

  const handleDragMove = (e) => {
    if (onDragMove) onDragMove(e, element);
  };

  // Text element
  if (type === "text") {
    const fontStyleStr = (element.fontStyle === "italic" ? "italic " : "") + (element.fontWeight ? String(element.fontWeight) : "400");
    let text = element.content || "";
    if (element.textTransform === "uppercase") text = text.toUpperCase();
    return (
      <Text
        ref={groupRef}
        x={x} y={y}
        text={text}
        fontSize={element.fontSize || 16}
        fontFamily={element.fontFamily || "Inter, sans-serif"}
        fontStyle={fontStyleStr}
        fill={element.color || "#000000"}
        width={width}
        opacity={opacity ?? 1}
        rotation={rotation || 0}
        draggable={!locked}
        onClick={() => onSelect(id)}
        onTap={() => onSelect(id)}
        onDblClick={() => onDblClick(id)}
        onDblTap={() => onDblClick(id)}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;
          const sx = node.scaleX();
          node.scaleX(1); node.scaleY(1);
          onTransformEnd(id, {
            x: node.x(), y: node.y(),
            width: Math.max(20, node.width() * sx),
            rotation: node.rotation(),
          });
        }}
      />
    );
  }

  // Image element
  if (type === "image") {
    return (
      <KonvaImageWrapper
        ref={groupRef}
        element={element}
        onSelect={onSelect}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onTransformEnd={handleTransformEnd}
        registerRef={registerRef}
      />
    );
  }

  // Shape element — rendered inside a Group for consistent transforms
  return (
    <Group
      ref={groupRef}
      x={x} y={y}
      width={width} height={height}
      opacity={opacity ?? 1}
      rotation={rotation || 0}
      draggable={!locked}
      onClick={() => onSelect(id)}
      onTap={() => onSelect(id)}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      <InnerShape shapeType={element.shapeType} width={width} height={height} fill={element.fill} />
    </Group>
  );
}

/* ─── image wrapper (needs useKonvaImage hook) ─── */
function KonvaImageWrapperInner({ element, onSelect, onDragEnd, onDragMove, onTransformEnd, innerRef }) {
  const image = useKonvaImage(element.src);
  const { id, x, y, width, height, opacity, locked, rotation } = element;
  return (
    <KonvaImage
      ref={innerRef}
      image={image}
      x={x} y={y}
      width={width} height={height}
      opacity={opacity ?? 1}
      rotation={rotation || 0}
      draggable={!locked}
      onClick={() => onSelect(id)}
      onTap={() => onSelect(id)}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={() => {
        const node = innerRef.current;
        if (!node) return;
        const sx = node.scaleX(), sy = node.scaleY();
        node.scaleX(1); node.scaleY(1);
        onTransformEnd(id, {
          x: node.x(), y: node.y(),
          width: Math.max(10, node.width() * sx),
          height: Math.max(10, node.height() * sy),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

import { forwardRef } from "react";
const KonvaImageWrapper = forwardRef(function KonvaImageWrapper(props, ref) {
  const groupRef = useRef(null);
  const { element, registerRef, ...rest } = props;

  useEffect(() => {
    registerRef(element.id, groupRef.current);
    return () => registerRef(element.id, null);
  });

  return <KonvaImageWrapperInner {...rest} element={element} innerRef={groupRef} />;
});

/* ═══════════════ MAIN CANVAS ═══════════════ */

export default function Canvas() {
  const {
    elements, selectedId, backgroundColor, backgroundImage,
    zoom, canvasWidth, canvasHeight, stageRef,
    selectElement, updateElement, deleteElement, transformElement,
    commitTransform, undo, redo, duplicateElement, copyElement, pasteElement,
  } = useDesign();

  const transformerRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [containerSize, setContainerSize] = useState({ width: 900, height: 700 });
  const [snapLines, setSnapLines] = useState([]);
  const bgImage = useKonvaImage(backgroundImage);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Register refs
  const registerRef = useCallback((id, node) => {
    if (node) nodeRefs.current[id] = node;
    else delete nodeRefs.current[id];
  }, []);

  // Attach transformer
  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;
    const el = elements.find(e => e.id === selectedId);
    if (selectedId && nodeRefs.current[selectedId] && el && !el.locked) {
      tr.nodes([nodeRefs.current[selectedId]]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedId) { e.preventDefault(); copyElement(selectedId); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); pasteElement(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) { e.preventDefault(); duplicateElement(selectedId); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) { deleteElement(selectedId); return; }
      if (e.key === "Escape") { selectElement(null); return; }
      if (selectedId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const el = elements.find(el => el.id === selectedId);
        if (!el || el.locked) return;
        const step = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === "ArrowUp") dy = -step;
        if (e.key === "ArrowDown") dy = step;
        if (e.key === "ArrowLeft") dx = -step;
        if (e.key === "ArrowRight") dx = step;
        transformElement(selectedId, { x: (el.x || 0) + dx, y: (el.y || 0) + dy });
        commitTransform();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, deleteElement, selectElement, undo, redo, duplicateElement, copyElement, pasteElement, transformElement, commitTransform]);

  // Handlers
  const handleDragEnd = useCallback((id, x, y) => {
    transformElement(id, { x, y });
    commitTransform();
    setSnapLines([]);
  }, [transformElement, commitTransform]);

  const handleTransformEnd = useCallback((id, transforms) => {
    transformElement(id, transforms);
    commitTransform();
  }, [transformElement, commitTransform]);

  const handleStageClick = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === "bg-rect" || e.target.attrs.id === "bg-image";
    if (clickedOnEmpty) selectElement(null);
  };

  // Snap guide drag handler
  const handleDragMove = useCallback((e, element) => {
    const node = e.target;
    const guides = getSnapLines(elements, element.id, canvasWidth, canvasHeight);
    const newLines = [];
    const snapH = getSnapped(node.x(), element.width || 0, guides.vertical);
    const snapV = getSnapped(node.y(), element.height || 0, guides.horizontal);
    if (snapH) { node.x(node.x() + snapH.offset); newLines.push({ type: 'v', pos: snapH.guide }); }
    if (snapV) { node.y(node.y() + snapV.offset); newLines.push({ type: 'h', pos: snapV.guide }); }
    setSnapLines(newLines);
  }, [elements, canvasWidth, canvasHeight]);

  // Inline text editing
  const handleTextDblClick = useCallback((id) => {
    const el = elements.find((e) => e.id === id);
    if (!el || el.type !== "text" || el.locked) return;
    const stage = stageRef.current;
    if (!stage) return;
    const textNode = nodeRefs.current[id];
    if (!textNode) return;

    textNode.hide();
    transformerRef.current?.hide();
    stage.batchDraw();

    const stageContainer = stage.container();
    const stageBox = stageContainer.getBoundingClientRect();
    const scale = zoom / 100;
    const absPos = textNode.getAbsolutePosition();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = el.content || "";
    textarea.style.position = "fixed";
    textarea.style.top = stageBox.top + absPos.y * scale + "px";
    textarea.style.left = stageBox.left + absPos.x * scale + "px";
    textarea.style.width = el.width * scale + "px";
    textarea.style.minHeight = (el.fontSize || 16) * 1.5 * scale + "px";
    textarea.style.fontSize = (el.fontSize || 16) * scale + "px";
    textarea.style.fontFamily = el.fontFamily || "Inter, sans-serif";
    textarea.style.fontWeight = el.fontWeight || 400;
    textarea.style.fontStyle = el.fontStyle || "normal";
    textarea.style.color = el.color || "#000000";
    textarea.style.border = "2px solid #6c63ff";
    textarea.style.borderRadius = "4px";
    textarea.style.padding = "4px";
    textarea.style.margin = "0";
    textarea.style.overflow = "hidden";
    textarea.style.background = "rgba(255,255,255,0.95)";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = "1.2";
    textarea.style.zIndex = "10000";
    textarea.style.textTransform = el.textTransform || "none";
    textarea.focus();
    textarea.select();

    let finished = false;
    const finishEditing = () => {
      if (finished) return;
      finished = true;
      updateElement(id, { content: textarea.value });
      if (textarea.parentNode) document.body.removeChild(textarea);
      textNode.show();
      transformerRef.current?.show();
      stage.batchDraw();
    };
    textarea.addEventListener("blur", finishEditing);
    textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" || (ev.key === "Enter" && !ev.shiftKey)) textarea.blur();
    });
  }, [elements, zoom, stageRef, updateElement]);

  // Render
  const scale = zoom / 100;
  const stageX = Math.max(0, (containerSize.width - canvasWidth * scale) / 2);
  const stageY = Math.max(0, (containerSize.height - canvasHeight * scale) / 2);
  const visibleElements = elements.filter((el) => el.visible !== false);

  return (
    <div className="canvas-area" ref={containerRef}>
      <div className="canvas-stage-wrapper" style={{ position: "absolute", left: stageX, top: stageY }}>
        <Stage
          ref={stageRef}
          width={canvasWidth * scale}
          height={canvasHeight * scale}
          scaleX={scale} scaleY={scale}
          onClick={handleStageClick}
          onTap={handleStageClick}
          style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
        >
          <Layer>
            <Rect id="bg-rect" x={0} y={0} width={canvasWidth} height={canvasHeight} fill={backgroundColor} listening={true} />
            {bgImage && <KonvaImage id="bg-image" image={bgImage} x={0} y={0} width={canvasWidth} height={canvasHeight} listening={true} />}
          </Layer>
          <Layer>
            {visibleElements.map((el) => (
              <CanvasElement
                key={el.id}
                element={el}
                onSelect={selectElement}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                onDblClick={handleTextDblClick}
                onDragMove={handleDragMove}
                registerRef={registerRef}
              />
            ))}
            <Transformer
              ref={transformerRef}
              borderStroke="#6c63ff"
              borderStrokeWidth={2}
              anchorFill="#ffffff"
              anchorStroke="#6c63ff"
              anchorSize={10}
              anchorCornerRadius={2}
              padding={4}
              rotateEnabled={true}
              keepRatio={false}
              enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left']}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return oldBox;
                return newBox;
              }}
            />
            {snapLines.map((line, i) =>
              line.type === 'v' ? (
                <Line key={'snap-' + i} points={[line.pos, 0, line.pos, canvasHeight]} stroke="#6c63ff" strokeWidth={1} dash={[6, 4]} />
              ) : (
                <Line key={'snap-' + i} points={[0, line.pos, canvasWidth, line.pos]} stroke="#6c63ff" strokeWidth={1} dash={[6, 4]} />
              )
            )}
          </Layer>
        </Stage>
      </div>
      {selectedId && (
        <button className="delete-btn" onClick={() => deleteElement(selectedId)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      )}
    </div>
  );
}
