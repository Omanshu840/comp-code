import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const current = images[index]

  if (!current) {
    return null
  }

  return (
    <div className="mt-5 border border-border bg-muted/30 p-2">
      <div className="aspect-video overflow-hidden bg-background">
        <img alt="" className="h-full w-full object-contain" src={current} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Button
          aria-label="Previous image"
          disabled={images.length < 2}
          size="icon-sm"
          variant="outline"
          onClick={() => setIndex((value) => (value === 0 ? images.length - 1 : value - 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex gap-1">
          {images.map((image, dotIndex) => (
            <span
              className={cn("size-2 border border-foreground", dotIndex === index && "bg-foreground")}
              key={image}
            />
          ))}
        </div>
        <Button
          aria-label="Next image"
          disabled={images.length < 2}
          size="icon-sm"
          variant="outline"
          onClick={() => setIndex((value) => (value + 1) % images.length)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
