"use client"

import { useState } from "react"
import { Building2, ChevronLeft, ChevronRight, X } from "lucide-react"

export default function PropertyGallery({ property }: { property: any }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const images: string[] = property.images || []

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
        <Building2 className="h-16 w-16 text-muted-foreground" />
      </div>
    )
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length)
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="space-y-4">
      {/* Imagem principal */}
      <div className="aspect-video h-full w-full overflow-hidden rounded-lg bg-muted">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={property.title}
          className="h-100 full w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setSelectedIndex(0)}
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {images.slice(1, 4).map((image, index) => (
            <div
              key={index}
              className="aspect-video w-full overflow-hidden rounded-lg bg-muted"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${property.title} ${index + 2}`}
                className="h-full w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedIndex(index + 1)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
          onClick={() => setSelectedIndex(null)}
        >
          {/* BOTÃO FECHAR FORA DA IMAGEM */}
          <div className="w-full flex justify-end px-10 mb-2 ">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(null)
              }}
              className="text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* CONTEÚDO DA IMAGEM */}
          <div className="relative flex items-center justify-center p-4">
            <div className="relative w-[1000px] h-[550px] max-w-[90vw] max-h-[70vh] ">
              <img
                src={images[selectedIndex]}
                alt="Imagem ampliada"
                className="rounded-lg object-cover w-full h-full shadow-lg"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="  absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}
        </div>
            </div>
      )}
    </div>
  )
}
