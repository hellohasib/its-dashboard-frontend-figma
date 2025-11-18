
interface StatusBadgeProps {
  status: 'active' | 'wait' | 'offline' | 'inactive';
  label?: string;
  className?: string;
}

const StatusBadge = ({ status, label, className = '' }: StatusBadgeProps) => {
  const styles = {
    active: {
      bg: 'bg-[#E9FFEF]',
      text: 'text-[#409261]',
      dot: 'bg-[#409261]',
    },
    wait: {
      bg: 'bg-[#FFF2DD]',
      text: 'text-[#D98634]',
      dot: 'bg-[#D98634]',
    },
    offline: {
      bg: 'bg-[#E4E4E4]',
      text: 'text-[#666970]',
      dot: 'bg-[#666970]',
    },
    inactive: {
      bg: 'bg-[#FFE9E6]',
      text: 'text-[#FF746A]',
      dot: 'bg-[#FF746A]',
    },
  };

  const style = styles[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${style.bg} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span className={`text-xs ${style.text}`}>
        {label || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

export default StatusBadge;

