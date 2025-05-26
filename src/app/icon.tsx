import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <img
        src="/icon.png"
        alt="Computer Science Quiz App"
        width={32}
        height={32}
      />
    ),
    {
      ...size,
    }
  )
} 