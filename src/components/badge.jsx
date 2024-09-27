const badgeStyles = {
  yellow100: "bg-yellow-100 text-yellow-800",
  green100: "bg-green-100 text-green-800",
  red100: "bg-red-100 text-red-800",
  blue100: "bg-blue-100 text-blue-800",
  gray100: "bg-gray-100 text-gray-800",
  purple100: "bg-purple-800 text-white",
  teal100: "bg-teal-800 text-white",
  orange100: "bg-orange-100 text-orange-800",
  pink100: "bg-pink-100 text-pink-800",
  indigo100: "bg-indigo-100 text-indigo-800",
  gray200: "bg-gray-200 text-gray-800",
  green200: "bg-green-200 text-green-800",
  red200: "bg-red-200 text-red-800",
  green300: "bg-green-300 text-green-900",
  gray300: "bg-gray-300 text-gray-900",
  yello300: "bg-yellow-400 text-white",
  blue300: "bg-[#002e66] text-white",
  gray400: "bg-gray-400 text-gray-900",
};

const PATROL_STATUS = {
  pending: {
    label: "Pending",
    className: badgeStyles.orange100,
  },
  abandoned: {
    label: "Abandoned",
    className: badgeStyles.red100,
  },
  completed: {
    label: "Completed",
    className: badgeStyles.blue300,
  },
};

const LOG_TYPE = {
  "clock action": {
    label: "Clock Action",
    className: badgeStyles.purple100,
  },
  "patrol action": {
    label: "Patrol Action",
    className: badgeStyles.yello300,
  },
  "guard action": {
    label: "Guard action",
    className: badgeStyles.teal100,
  },
};

const OptionTypes = {
  PATROL_STATUS: PATROL_STATUS,
  LOG_TYPE: LOG_TYPE,
};

export const Badge = ({ status, type }) => {
  const normalizedStatus = status.toString().toLowerCase();

  const badge = OptionTypes[type][normalizedStatus] || {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};
