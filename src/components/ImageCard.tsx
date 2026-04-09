import Link from "next/link";
import { Calendar } from "lucide-react";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

export default function ImageCard({
  id,
  imageUrl,
  prompt,
  createdAt,
}: ImageCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/image/${id}`} className="group block">
      <div className="bg-navy-800 rounded-xl overflow-hidden border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 card-glow">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-300 line-clamp-2 mb-2">{prompt}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
