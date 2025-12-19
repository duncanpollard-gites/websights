import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-10 h-10", text: "text-2xl" },
  };

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizes[size].icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="20" cy="20" r="16" stroke="#2563eb" strokeWidth="2.5" fill="none"/>
          {/* Inner circle */}
          <circle cx="20" cy="20" r="6" fill="#2563eb"/>
          {/* Globe lines */}
          <ellipse cx="20" cy="20" rx="16" ry="8" stroke="#2563eb" strokeWidth="1.5" fill="none"/>
          <line x1="20" y1="4" x2="20" y2="36" stroke="#2563eb" strokeWidth="1.5"/>
        </svg>
      </div>
      {/* Text */}
      <span className={`${sizes[size].text} font-bold`}>
        <span className="text-gray-900">Trade</span>
        <span className="text-blue-600">Vista</span>
      </span>
    </Link>
  );
}
