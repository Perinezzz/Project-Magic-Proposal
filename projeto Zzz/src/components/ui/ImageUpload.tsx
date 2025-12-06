import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { imageToBase64 } from '../../services/storage';

interface ImageUploadProps {
    value: string;
    onChange: (base64: string) => void;
    label?: string;
    aspectRatio?: 'square' | 'video' | 'wide';
    placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label,
    aspectRatio = 'video',
    placeholder = 'Arraste uma imagem ou clique para fazer upload',
}) => {
    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[21/9]',
    };

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const base64 = await imageToBase64(file);
                onChange(base64);
            }
        },
        [onChange]
    );

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const base64 = await imageToBase64(file);
                onChange(base64);
            }
        },
        [onChange]
    );

    const handleRemove = useCallback(() => {
        onChange('');
    }, [onChange]);

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <motion.div
                whileHover={{ scale: 1.01 }}
                className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 ${value
                        ? 'border-transparent'
                        : 'border-gray-300 hover:border-primary/50 bg-gray-50'
                    }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={handleRemove}
                            className="absolute top-3 right-3 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg"
                        >
                            <X size={20} />
                        </motion.button>
                    </>
                ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors"
                        >
                            <ImageIcon size={28} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </motion.div>
                        <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <Upload size={18} />
                            <span>Fazer Upload</span>
                        </div>
                        <p className="text-sm text-gray-400 text-center px-4">
                            {placeholder}
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </motion.div>
        </div>
    );
};

export default ImageUpload;
