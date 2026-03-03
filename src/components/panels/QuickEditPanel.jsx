import { useDesign } from '../../context/DesignContext';

export default function QuickEditPanel() {
    const { elements, updateElement } = useDesign();
    const textElements = elements.filter((el) => el.type === 'text');

    if (textElements.length === 0) {
        return (
            <>
                <div className="panel-header">
                    <h3>Quick Edit</h3>
                </div>
                <div className="panel-content">
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <p>No text elements on the canvas yet.<br />Add text from the Text tab to start editing.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="panel-header">
                <h3>Quick Edit</h3>
            </div>
            <div className="panel-content">
                <div className="quick-edit-list">
                    {textElements.map((el) => (
                        <div key={el.id} className="quick-edit-item">
                            <label className="quick-edit-label">
                                Text #{el.id} — {el.fontSize}px
                            </label>
                            <textarea
                                className="quick-edit-textarea"
                                value={el.content}
                                onChange={(e) => updateElement(el.id, { content: e.target.value })}
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
