import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-[300px] bg-gray-700/50"></div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 w-8 bg-gray-700/50 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-700/50 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
