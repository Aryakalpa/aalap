export default function Skeleton({ width = '100%', height = '20px', radius = '4px', style }) {
  return (
    <div 
      className="skeleton" 
      style={{ width, height, borderRadius: radius, ...style }} 
    />
  );
}