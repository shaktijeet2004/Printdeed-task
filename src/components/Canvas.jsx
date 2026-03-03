import { useRef, useState, useCallback, useEffect } from 'react';
import { useDesign } from '../context/DesignContext';

function ShapeRenderer({ element }) {
    const { shapeType, fill } = element;
    switch (shapeType) {
        case 'rectangle':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><rect x="1" y="3" width="22" height="18" rx="2" fill={fill} /></svg>;
        case 'circle':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={fill} /></svg>;
        case 'triangle':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="12,1 23,23 1,23" fill={fill} /></svg>;
        case 'star':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={fill} /></svg>;
        case 'diamond':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="12,1 23,12 12,23 1,12" fill={fill} /></svg>;
        case 'hexagon':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="12,1 22,6.5 22,17.5 12,23 2,17.5 2,6.5" fill={fill} /></svg>;
        case 'pentagon':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="12,1 23,9 19,22 5,22 1,9" fill={fill} /></svg>;
        case 'arrow':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><polygon points="2,8 16,8 16,3 23,12 16,21 16,16 2,16" fill={fill} /></svg>;
        case 'heart':
            return <svg className="canvas-shape" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={fill} /></svg>;
        default:
            return <svg className="canvas-shape" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" fill={fill} /></svg>;
    }
}

function CanvasElement({ element, isSelected, onSelect, onDragStart, onDoubleClick }) {
    const style = {
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
    };

    const handleMouseDown = (e) => {
        e.stopPropagation();
        onSelect(element.id);
        if (!element._editing) {
            onDragStart(e, element.id);
        }
    };

    const handleDblClick = (e) => {
        e.stopPropagation();
        if (element.type === 'text') {
            onDoubleClick(element.id);
        }
    };

    return (
        <div
            className={`canvas-element ${isSelected ? 'selected' : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDblClick}
        >
            {element.type === 'text' && (
                <div
                    className={`canvas-text ${element._editing ? 'editing' : ''}`}
                    contentEditable={element._editing}
                    suppressContentEditableWarning
                    style={{
                        fontSize: element.fontSize,
                        fontWeight: element.fontWeight,
                        fontFamily: element.fontFamily,
                        fontStyle: element.fontStyle,
                        color: element.color,
                        textTransform: element.textTransform,
                        width: '100%',
                        height: '100%',
                    }}
                    data-element-id={element.id}
                >
                    {element.content}
                </div>
            )}
            {element.type === 'image' && (
                <img className="canvas-image" src={element.src} alt="Uploaded" draggable={false} />
            )}
            {element.type === 'shape' && (
                <ShapeRenderer element={element} />
            )}
            {isSelected && (
                <>
                    <div className="resize-handle bottom-right" data-resize="br" onMouseDown={(e) => e.stopPropagation()} />
                </>
            )}
        </div>
    );
}

export default function Canvas() {
    const {
        elements,
        selectedId,
        backgroundColor,
        backgroundImage,
        zoom,
        selectElement,
        moveElement,
        commitMove,
        updateElement,
        deleteElement,
        resizeElement,
    } = useDesign();

    const canvasRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [resizing, setResizing] = useState(null);

    const handleCanvasClick = () => {
        // Commit any editing text
        const editingEl = elements.find(el => el._editing);
        if (editingEl) {
            const domEl = document.querySelector(`[data-element-id="${editingEl.id}"]`);
            if (domEl) {
                updateElement(editingEl.id, { content: domEl.textContent, _editing: false });
            }
        }
        selectElement(null);
    };

    const handleDoubleClick = (id) => {
        updateElement(id, { _editing: true });
    };

    const handleDragStart = useCallback((e, id) => {
        const el = elements.find((el) => el.id === id);
        if (!el) return;
        const startX = e.clientX;
        const startY = e.clientY;
        const elX = el.x;
        const elY = el.y;
        const scale = zoom / 100;

        setDragging({ id, startX, startY, elX, elY, scale });
    }, [elements, zoom]);

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e) => {
            const dx = (e.clientX - dragging.startX) / dragging.scale;
            const dy = (e.clientY - dragging.startY) / dragging.scale;
            moveElement(dragging.id, dragging.elX + dx, dragging.elY + dy);
        };

        const handleMouseUp = () => {
            commitMove();
            setDragging(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, moveElement, commitMove]);

    // Resize logic
    useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e) => {
            const scale = zoom / 100;
            const dx = (e.clientX - resizing.startX) / scale;
            const dy = (e.clientY - resizing.startY) / scale;
            const newW = Math.max(30, resizing.elW + dx);
            const newH = Math.max(30, resizing.elH + dy);
            resizeElement(resizing.id, newW, newH);
        };

        const handleMouseUp = () => {
            setResizing(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, zoom, resizeElement]);

    // Handle resize handle mousedown
    useEffect(() => {
        const handleResizeStart = (e) => {
            if (e.target.classList.contains('resize-handle')) {
                e.stopPropagation();
                e.preventDefault();
                const parent = e.target.closest('.canvas-element');
                const elId = elements.find(
                    (el) => el.x === parseFloat(parent.style.left) && el.y === parseFloat(parent.style.top)
                );
                if (!elId) return;
                setResizing({
                    id: elId.id,
                    startX: e.clientX,
                    startY: e.clientY,
                    elW: elId.width,
                    elH: elId.height,
                });
            }
        };

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('mousedown', handleResizeStart, true);
            return () => canvas.removeEventListener('mousedown', handleResizeStart, true);
        }
    }, [elements]);

    // Delete with keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                const editingEl = elements.find(el => el._editing);
                if (editingEl) return; // Don't delete while editing text
                deleteElement(selectedId);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteElement, elements]);

    const canvasStyle = {
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="canvas-area" onMouseDown={handleCanvasClick}>
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom / 100})` }}>
                <div id="design-canvas" className="canvas" ref={canvasRef} style={canvasStyle} onMouseDown={(e) => e.stopPropagation()}>
                    {elements.map((el) => (
                        <CanvasElement
                            key={el.id}
                            element={el}
                            isSelected={selectedId === el.id}
                            onSelect={selectElement}
                            onDragStart={handleDragStart}
                            onDoubleClick={handleDoubleClick}
                        />
                    ))}
                </div>
            </div>
            {selectedId && (
                <button className="delete-btn" onClick={() => deleteElement(selectedId)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                </button>
            )}
        </div>
    );
}
