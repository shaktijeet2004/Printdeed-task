export default function KeyboardShortcutsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['Ctrl', 'Z'], desc: 'Undo' },
        { keys: ['Ctrl', 'Y'], desc: 'Redo' },
        { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo (alt)' },
        { keys: ['Ctrl', 'D'], desc: 'Duplicate element' },
        { keys: ['Ctrl', 'C'], desc: 'Copy element' },
        { keys: ['Ctrl', 'V'], desc: 'Paste element' },
        { keys: ['Delete'], desc: 'Delete element' },
        { keys: ['Backspace'], desc: 'Delete element' },
        { keys: ['Escape'], desc: 'Deselect' },
        { keys: ['↑ ↓ ← →'], desc: 'Nudge 1px' },
        { keys: ['Shift', '↑ ↓ ← →'], desc: 'Nudge 10px' },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Keyboard Shortcuts</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="shortcuts-list">
                        {shortcuts.map((s, i) => (
                            <div key={i} className="shortcut-row">
                                <div className="shortcut-keys">
                                    {s.keys.map((k, j) => (
                                        <span key={j}>
                                            <kbd>{k}</kbd>
                                            {j < s.keys.length - 1 && <span className="key-plus">+</span>}
                                        </span>
                                    ))}
                                </div>
                                <span className="shortcut-desc">{s.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
