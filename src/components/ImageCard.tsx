import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Sparkles, Eye, Copyright, Clock, Maximize2 } from 'lucide-react';
import { ImageCardProps } from '@/types';
import LoadingSpinner from './LoadingSpinner';

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  gptExplanation,
  onExplainClick,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        )}
        
        {image.media_type === 'image' ? (
          <>
            <Image
              src={image.url}
              alt={image.title}
              fill
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            />
            
            {/* HD Button Overlay */}
            {image.hdurl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8
                }}
                className="absolute top-4 right-4"
              >
                <a
                  href={image.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-sm text-white rounded-full text-sm hover:bg-black/80 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>HD</span>
                </a>
              </motion.div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-60" />
              <span className="text-lg font-medium">Video Content</span>
              <p className="text-sm opacity-75 mt-1">Click to view</p>
            </div>
          </div>
        )}
        
        {/* Copyright Badge */}
        {image.copyright && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
          >
            <Copyright className="w-3 h-3" />
            <span>{image.copyright}</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date and Category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(image.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>APOD</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-gray-900 mb-4 leading-tight"
        >
          {image.title}
        </motion.h3>

        <div className="space-y-4">
          {/* Original NASA Explanation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              NASA Description
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {showFullDescription 
                ? image.explanation 
                : truncateText(image.explanation, 150)
              }
              {image.explanation.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:text-blue-700 ml-1 font-medium text-sm"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>
          </motion.div>

          {/* AI Enhanced Explanation */}
          <AnimatePresence>
            {gptExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4"
              >
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Enhanced Explanation
                </h4>
                
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">
                    {gptExplanation.explanation}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">Key Features</h5>
                      <ul className="space-y-1">
                        {gptExplanation.keyFeatures.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-xs text-gray-700 flex items-start gap-2"
                          >
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">Scientific Context</h5>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {gptExplanation.scientificContext}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onExplainClick(image)}
            disabled={isLoading || !!gptExplanation}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              gptExplanation
                ? 'bg-green-100 text-green-700 cursor-default'
                : isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Analyzing...</span>
              </>
            ) : gptExplanation ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI Analysis Complete</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get AI Explanation</span>
              </>
            )}
          </motion.button>

          {image.hdurl && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={image.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View HD</span>
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
