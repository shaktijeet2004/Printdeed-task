import { createContext, useContext, useReducer, useCallback } from 'react';

const DesignContext = createContext();

const MAX_HISTORY = 50;

const initialState = {
    elements: [],
    selectedId: null,
    backgroundColor: '#ffffff',
    backgroundImage: null,
    zoom: 100,
    history: [],
    historyIndex: -1,
    nextId: 1,
};

function designReducer(state, action) {
    switch (action.type) {
        case 'ADD_ELEMENT': {
            const newElement = { ...action.payload, id: state.nextId };
            const newElements = [...state.elements, newElement];
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: newElements, backgroundColor: state.backgroundColor, backgroundImage: state.backgroundImage },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                elements: newElements,
                selectedId: state.nextId,
                nextId: state.nextId + 1,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'UPDATE_ELEMENT': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
            );
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: newElements, backgroundColor: state.backgroundColor, backgroundImage: state.backgroundImage },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                elements: newElements,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'DELETE_ELEMENT': {
            const newElements = state.elements.filter((el) => el.id !== action.payload);
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: newElements, backgroundColor: state.backgroundColor, backgroundImage: state.backgroundImage },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                elements: newElements,
                selectedId: state.selectedId === action.payload ? null : state.selectedId,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'SELECT_ELEMENT':
            return { ...state, selectedId: action.payload };
        case 'SET_BACKGROUND_COLOR': {
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: state.elements, backgroundColor: action.payload, backgroundImage: state.backgroundImage },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                backgroundColor: action.payload,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'SET_BACKGROUND_IMAGE': {
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: state.elements, backgroundColor: state.backgroundColor, backgroundImage: action.payload },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                backgroundImage: action.payload,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'REMOVE_BACKGROUND': {
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: state.elements, backgroundColor: '#ffffff', backgroundImage: null },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                backgroundColor: '#ffffff',
                backgroundImage: null,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'SET_ZOOM':
            return { ...state, zoom: Math.max(25, Math.min(200, action.payload)) };
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
        case 'MOVE_ELEMENT': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload.id
                    ? { ...el, x: action.payload.x, y: action.payload.y }
                    : el
            );
            return { ...state, elements: newElements };
        }
        case 'COMMIT_MOVE': {
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                { elements: state.elements, backgroundColor: state.backgroundColor, backgroundImage: state.backgroundImage },
            ].slice(-MAX_HISTORY);
            return {
                ...state,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'RESIZE_ELEMENT': {
            const newElements = state.elements.map((el) =>
                el.id === action.payload.id
                    ? { ...el, width: action.payload.width, height: action.payload.height, x: action.payload.x, y: action.payload.y }
                    : el
            );
            return { ...state, elements: newElements };
        }
        default:
            return state;
    }
}

export function DesignProvider({ children }) {
    const [state, dispatch] = useReducer(designReducer, initialState);

    const addElement = useCallback((element) => dispatch({ type: 'ADD_ELEMENT', payload: element }), []);
    const updateElement = useCallback((id, updates) => dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } }), []);
    const deleteElement = useCallback((id) => dispatch({ type: 'DELETE_ELEMENT', payload: id }), []);
    const selectElement = useCallback((id) => dispatch({ type: 'SELECT_ELEMENT', payload: id }), []);
    const setBackgroundColor = useCallback((color) => dispatch({ type: 'SET_BACKGROUND_COLOR', payload: color }), []);
    const setBackgroundImage = useCallback((url) => dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: url }), []);
    const removeBackground = useCallback(() => dispatch({ type: 'REMOVE_BACKGROUND' }), []);
    const setZoom = useCallback((zoom) => dispatch({ type: 'SET_ZOOM', payload: zoom }), []);
    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
    const moveElement = useCallback((id, x, y) => dispatch({ type: 'MOVE_ELEMENT', payload: { id, x, y } }), []);
    const commitMove = useCallback(() => dispatch({ type: 'COMMIT_MOVE' }), []);
    const resizeElement = useCallback((id, width, height, x, y) => dispatch({ type: 'RESIZE_ELEMENT', payload: { id, width, height, x, y } }), []);

    return (
        <DesignContext.Provider
            value={{
                ...state,
                addElement,
                updateElement,
                deleteElement,
                selectElement,
                setBackgroundColor,
                setBackgroundImage,
                removeBackground,
                setZoom,
                undo,
                redo,
                moveElement,
                commitMove,
                resizeElement,
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
