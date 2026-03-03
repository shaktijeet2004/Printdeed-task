import { useState, useRef } from 'react';
import { useDesign } from '../../context/DesignContext';

export default function UploadsPanel() {
    const { addElement } = useDesign();
    const [uploadedImages, setUploadedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                setUploadedImages((prev) => [...prev, { id: Date.now() + Math.random(), src: dataUrl, name: file.name }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const addImageToCanvas = (src) => {
        const img = new Image();
        img.onload = () => {
            const maxW = 300;
            const ratio = img.width / img.height;
            const w = Math.min(img.width, maxW);
            const h = w / ratio;
            addElement({
                type: 'image',
                x: 100 + Math.random() * 100,
                y: 100 + Math.random() * 100,
                width: w,
                height: h,
                src,
            });
        };
        img.src = src;
    };

    return (
        <>
            <div className="panel-header">
                <h3>Uploads</h3>
            </div>
            <div className="panel-content">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                />
                <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Image
                </button>

                {uploadedImages.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p>No images uploaded yet.<br />Upload images from your device to use in your design.</p>
                    </div>
                ) : (
                    <>
                        <div className="panel-section-title">Your Images</div>
                        <div className="uploaded-images-grid">
                            {uploadedImages.map((img) => (
                                <div key={img.id} className="uploaded-image" onClick={() => addImageToCanvas(img.src)} title={img.name}>
                                    <img src={img.src} alt={img.name} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
