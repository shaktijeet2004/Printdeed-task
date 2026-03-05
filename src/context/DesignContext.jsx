import { createContext, useContext, useReducer, useCallback, useRef } from 'react';

const DesignContext = createContext();

const MAX_HISTORY = 50;

const initialState = {
    elements: [],
    selectedId: null,
    clipboard: null,
    backgroundColor: '#ffffff',
    backgroundImage: null,
    canvasWidth: 800,
    canvasHeight: 600,
    zoom: 100,
    history: [],
    historyIndex: -1,
    nextId: 1,
};

function pushHistory(state, overrides = {}) {
    const snapshot = {
        elements: overrides.elements || state.elements,
        backgroundColor: overrides.backgroundColor ?? state.backgroundColor,
        backgroundImage: overrides.backgroundImage ?? state.backgroundImage,
    };
    const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        snapshot,
    ].slice(-MAX_HISTORY);
    return { history: newHistory, historyIndex: newHistory.length - 1 };
}

function designReducer(state, action) {
    switch (action.type) {
        case 'ADD_ELEMENT': {
            const newElement = {
                visible: true,
                locked: false,
                opacity: 1,
                rotation: 0,
                ...action.payload,
                id: state.nextId,
            };
            const newElements = [...state.elements, newElement];
            return {
                ...state,
                elements: newElements,
                selectedId: state.nextId,
                nextId: state.nextId + 1,
                ...pushHistory(state, { elements: newElements }),
            };
        }
        case 'UPDATE_ELEMENT': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
            );
            return {
                ...state,
                elements: newElements,
                ...pushHistory(state, { elements: newElements }),
            };
        }
        case 'DELETE_ELEMENT': {
            const newElements = state.elements.filter((el) => el.id !== action.payload);
            return {
                ...state,
                elements: newElements,
                selectedId: state.selectedId === action.payload ? null : state.selectedId,
                ...pushHistory(state, { elements: newElements }),
            };
        }
        case 'SELECT_ELEMENT':
            return { ...state, selectedId: action.payload };

        case 'DUPLICATE_ELEMENT': {
            const source = state.elements.find((el) => el.id === action.payload);
            if (!source) return state;
            const dup = { ...source, id: state.nextId, x: (source.x || 0) + 20, y: (source.y || 0) + 20 };
            const newElements = [...state.elements, dup];
            return {
                ...state,
                elements: newElements,
                selectedId: state.nextId,
                nextId: state.nextId + 1,
                ...pushHistory(state, { elements: newElements }),
            };
        }
        case 'COPY_ELEMENT': {
            const el = state.elements.find((e) => e.id === action.payload);
            if (!el) return state;
            return { ...state, clipboard: { ...el } };
        }
        case 'PASTE_ELEMENT': {
            if (!state.clipboard) return state;
            const pasted = {
                ...state.clipboard,
                id: state.nextId,
                x: (state.clipboard.x || 0) + 30,
                y: (state.clipboard.y || 0) + 30,
            };
            const newElements = [...state.elements, pasted];
            return {
                ...state,
                elements: newElements,
                selectedId: state.nextId,
                nextId: state.nextId + 1,
                clipboard: { ...pasted },
                ...pushHistory(state, { elements: newElements }),
            };
        }
        case 'TOGGLE_VISIBILITY': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload ? { ...el, visible: !el.visible } : el
            );
            return { ...state, elements: newElements };
        }
        case 'TOGGLE_LOCK': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload ? { ...el, locked: !el.locked } : el
            );
            return { ...state, elements: newElements };
        }
        case 'REORDER_ELEMENTS': {
            return {
                ...state,
                elements: action.payload,
                ...pushHistory(state, { elements: action.payload }),
            };
        }
        case 'SET_BACKGROUND_COLOR': {
            return {
                ...state,
                backgroundColor: action.payload,
                ...pushHistory(state, { backgroundColor: action.payload }),
            };
        }
        case 'SET_BACKGROUND_IMAGE': {
            return {
                ...state,
                backgroundImage: action.payload,
                ...pushHistory(state, { backgroundImage: action.payload }),
            };
        }
        case 'REMOVE_BACKGROUND': {
            return {
                ...state,
                backgroundColor: '#ffffff',
                backgroundImage: null,
                ...pushHistory(state, { backgroundColor: '#ffffff', backgroundImage: null }),
            };
        }
        case 'SET_CANVAS_SIZE': {
            return {
                ...state,
                canvasWidth: action.payload.width,
                canvasHeight: action.payload.height,
            };
        }
        case 'SET_ZOOM':
            return { ...state, zoom: Math.max(10, Math.min(300, action.payload)) };
        case 'UNDO': {
            if (state.historyIndex <= 0) return state;
            const prev = state.history[state.historyIndex - 1];
            return {
                ...state,
                elements: prev.elements,
                backgroundColor: prev.backgroundColor,
                backgroundImage: prev.backgroundImage,
                historyIndex: state.historyIndex - 1,
                selectedId: null,
            };
        }
        case 'REDO': {
            if (state.historyIndex >= state.history.length - 1) return state;
            const next = state.history[state.historyIndex + 1];
            return {
                ...state,
                elements: next.elements,
                backgroundColor: next.backgroundColor,
                backgroundImage: next.backgroundImage,
                historyIndex: state.historyIndex + 1,
                selectedId: null,
            };
        }
        case 'TRANSFORM_ELEMENT': {
            const { id, ...transforms } = action.payload;
            const newElements = state.elements.map((el) =>
                el.id === id ? { ...el, ...transforms } : el
            );
            return { ...state, elements: newElements };
        }
        case 'COMMIT_TRANSFORM': {
            return {
                ...state,
                ...pushHistory(state),
            };
        }
        case 'LOAD_PROJECT': {
            const p = action.payload;
            return {
                ...state,
                elements: p.elements || [],
                backgroundColor: p.backgroundColor || '#ffffff',
                backgroundImage: p.backgroundImage || null,
                canvasWidth: p.canvasWidth || 800,
                canvasHeight: p.canvasHeight || 600,
                selectedId: null,
                nextId: p.nextId || (p.elements ? Math.max(...p.elements.map(e => e.id), 0) + 1 : 1),
                history: [],
                historyIndex: -1,
            };
        }
        default:
            return state;
    }
}

export function DesignProvider({ children }) {
    const [state, dispatch] = useReducer(designReducer, initialState);
    const stageRef = useRef(null);

    const addElement = useCallback((el) => dispatch({ type: 'ADD_ELEMENT', payload: el }), []);
    const updateElement = useCallback((id, updates) => dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } }), []);
    const deleteElement = useCallback((id) => dispatch({ type: 'DELETE_ELEMENT', payload: id }), []);
    const selectElement = useCallback((id) => dispatch({ type: 'SELECT_ELEMENT', payload: id }), []);
    const duplicateElement = useCallback((id) => dispatch({ type: 'DUPLICATE_ELEMENT', payload: id }), []);
    const copyElement = useCallback((id) => dispatch({ type: 'COPY_ELEMENT', payload: id }), []);
    const pasteElement = useCallback(() => dispatch({ type: 'PASTE_ELEMENT' }), []);
    const toggleVisibility = useCallback((id) => dispatch({ type: 'TOGGLE_VISIBILITY', payload: id }), []);
    const toggleLock = useCallback((id) => dispatch({ type: 'TOGGLE_LOCK', payload: id }), []);
    const reorderElements = useCallback((elements) => dispatch({ type: 'REORDER_ELEMENTS', payload: elements }), []);
    const setBackgroundColor = useCallback((color) => dispatch({ type: 'SET_BACKGROUND_COLOR', payload: color }), []);
    const setBackgroundImage = useCallback((url) => dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: url }), []);
    const removeBackground = useCallback(() => dispatch({ type: 'REMOVE_BACKGROUND' }), []);
    const setCanvasSize = useCallback((width, height) => dispatch({ type: 'SET_CANVAS_SIZE', payload: { width, height } }), []);
    const setZoom = useCallback((zoom) => dispatch({ type: 'SET_ZOOM', payload: zoom }), []);
    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
    const transformElement = useCallback((id, transforms) => dispatch({ type: 'TRANSFORM_ELEMENT', payload: { id, ...transforms } }), []);
    const commitTransform = useCallback(() => dispatch({ type: 'COMMIT_TRANSFORM' }), []);
    const loadProject = useCallback((data) => dispatch({ type: 'LOAD_PROJECT', payload: data }), []);

    // Backward-compat aliases
    const moveElement = useCallback((id, x, y) => dispatch({ type: 'TRANSFORM_ELEMENT', payload: { id, x, y } }), []);
    const commitMove = useCallback(() => dispatch({ type: 'COMMIT_TRANSFORM' }), []);
    const resizeElement = useCallback((id, width, height, x, y) => dispatch({ type: 'TRANSFORM_ELEMENT', payload: { id, width, height, x, y } }), []);

    return (
        <DesignContext.Provider
            value={{
                ...state,
                stageRef,
                addElement,
                updateElement,
                deleteElement,
                selectElement,
                duplicateElement,
                copyElement,
                pasteElement,
                toggleVisibility,
                toggleLock,
                reorderElements,
                setBackgroundColor,
                setBackgroundImage,
                removeBackground,
                setCanvasSize,
                setZoom,
                undo,
                redo,
                moveElement,
                commitMove,
                resizeElement,
                transformElement,
                commitTransform,
                loadProject,
            }}
        >
            {children}
        </DesignContext.Provider>
    );
}

export function useDesign() {
    const context = useContext(DesignContext);
    if (!context) throw new Error('useDesign must be used within DesignProvider');
    return context;
}
