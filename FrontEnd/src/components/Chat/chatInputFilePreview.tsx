import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    return (
        <div className="relative inline-block mr-2">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg border-2 border-default-400"
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-1.5 -right-1.5 bg-danger hover:bg-danger-600 rounded-full p-0.5 text-foreground shadow-md transition-all hover:scale-110"
                    aria-label="Remove file"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};
