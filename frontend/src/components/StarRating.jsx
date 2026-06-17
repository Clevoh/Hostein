import React from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  size = 18,
  readonly = false,
  className = "",
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {stars.map((star) => {
        const active = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={`transition ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={active ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
}