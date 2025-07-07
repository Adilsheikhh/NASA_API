import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { NASAImage, GPTExplanation } from '@/types';
import ImageCard from './ImageCard';

interface ImageGalleryProps {
  images: NASAImage[];
  explanations: Record<string, GPTExplanation>;
  loadingExplanations: Record<string, boolean>;
  onExplainClick: (image: NASAImage) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  explanations,
  loadingExplanations,
  onExplainClick
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section id="gallery" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cosmic Image Gallery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore breathtaking astronomical images from NASA, each enhanced with AI-powered explanations 
            to help you understand the wonders of our universe.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-1 w-12 bg-blue-500 rounded"></div>
            <div className="text-sm text-gray-500 font-medium">
              {images.length} Images Available
            </div>
            <div className="h-1 w-12 bg-blue-500 rounded"></div>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.date}
              variants={itemVariants}
              custom={index}
            >
              <ImageCard
                image={image}
                gptExplanation={explanations[image.date]}
                onExplainClick={onExplainClick}
                isLoading={loadingExplanations[image.date] || false}
              />
            </motion.div>
          ))}
        </motion.div>

        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Available</h3>
            <p className="text-gray-600">
              Click the buttons above to start exploring NASA&apos;s amazing astronomical images.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ImageGallery;
