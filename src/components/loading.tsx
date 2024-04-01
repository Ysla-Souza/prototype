import Image from "next/image";

export default function Loading() {
  return(
    <div className="flex items-center justify-center">
      <Image
        src="/faceInvader.png"
        className="w-28 h-28 object-cover bg-black p-3 rounded-full animate-spin border border-2 border-prot-light"
        width={2000}
        height={2000}
        alt="background image"
        />
    </div>
  )
}