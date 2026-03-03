import { useDesign } from '../../context/DesignContext';

const shapes = [
    {
        name: 'Rectangle',
        svg: <rect x="2" y="4" width="20" height="16" rx="2" />,
        shapeType: 'rectangle',
    },
    {
        name: 'Circle',
        svg: <circle cx="12" cy="12" r="10" />,
        shapeType: 'circle',
    },
    {
        name: 'Triangle',
        svg: <polygon points="12,2 22,22 2,22" />,
        shapeType: 'triangle',
    },
    {
        name: 'Star',
        svg: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />,
        shapeType: 'star',
    },
    {
        name: 'Diamond',
        svg: <polygon points="12,2 22,12 12,22 2,12" />,
        shapeType: 'diamond',
    },
    {
        name: 'Hexagon',
        svg: <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />,
        shapeType: 'hexagon',
    },
    {
        name: 'Pentagon',
        svg: <polygon points="12,2 22,9 18.5,21 5.5,21 2,9" />,
        shapeType: 'pentagon',
    },
    {
        name: 'Arrow Right',
        svg: <polygon points="2,8 16,8 16,3 23,12 16,21 16,16 2,16" />,
        shapeType: 'arrow',
    },
    {
        name: 'Heart',
        svg: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
        shapeType: 'heart',
    },
];

const shapeColors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#e17055', '#00b894', '#0984e3', '#e84393', '#636e72'];

export default function ElementsPanel() {
    const { addElement } = useDesign();

    const addShape = (shape) => {
        const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
        addElement({
            type: 'shape',
            shapeType: shape.shapeType,
            x: 150 + Math.random() * 100,
            y: 150 + Math.random() * 100,
            width: 120,
            height: 120,
            fill: color,
            stroke: 'none',
            strokeWidth: 0,
        });
    };

    return (
        <>
            <div className="panel-header">
                <h3>Elements</h3>
            </div>
            <div className="panel-content">
                <div className="panel-section-title">Shapes</div>
                <div className="elements-grid">
                    {shapes.map((shape) => (
                        <button
                            key={shape.name}
                            className="element-item"
                            onClick={() => addShape(shape)}
                            title={shape.name}
                        >
                            <svg viewBox="0 0 24 24">{shape.svg}</svg>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
