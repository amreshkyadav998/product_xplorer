import Skeleton from 'react-loading-skeleton';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height={192} />
      <div className="p-4">
        <Skeleton width={150} height={20} />
        <Skeleton width={80} height={16} />
      </div>
    </div>
  );
};

export default SkeletonCard;