export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-200 rounded-lg h-80"></div>
        <div className="bg-gray-200 rounded-lg h-80"></div>
      </div>

      <div className="bg-gray-200 rounded-lg h-96"></div>
    </div>
  );
};
