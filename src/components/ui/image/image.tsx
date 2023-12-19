import { type VariantProps, cva } from "class-variance-authority"
import { useState } from "react"

const image = cva(["w-10", "h-10", "rounded-full"], {
  variants: {
    variant: {
      brokenImage: ["bg-gray-200", "flex", "font-bold", "items-center", "justify-center"],
    },
  },
})

interface ImageProps extends VariantProps<typeof image> {
  altText: string
  first_name?: string
  imageUrl?: string
}

export default function Image({ altText, first_name, imageUrl, variant }: ImageProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return !imageError ? (
    <img alt={altText} className={image()} onError={handleImageError} src={imageUrl} />
  ) : (
    <div className={image({ variant })}>{first_name?.charAt(0).toUpperCase()}</div>
  )
}
