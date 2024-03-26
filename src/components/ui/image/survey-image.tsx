import { type VariantProps, cva } from "class-variance-authority"
import { useState } from "react"
import { Icon } from "../icon/icon"

const image = cva(["rounded-t-lg", "object-cover", "w-full", "h-48"], {
  variants: {
    variant: {
      brokenImage: ["bg-gray-200", "h-48", "flex", "justify-center", "items-center", "2xl:w-80"],
    },
  },
})

interface SurveyImageProps extends VariantProps<typeof image> {
  altText: string
  imageUrl?: string
}

export default function SurveyImage({ altText, imageUrl, variant }: SurveyImageProps) {
  const [imageError, setImageError] = useState<boolean>(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return !imageError ? (
    <img alt={altText} className={image()} onError={handleImageError} src={imageUrl} />
  ) : (
    <div className={image({ variant })}>
      <Icon icon='DefaultImage' size='large' />
    </div>
  )
}
