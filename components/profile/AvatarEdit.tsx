"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar } from "./Avatar"
import { Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateAvatarAction } from "@/lib/actions/profile/updateAvatarAction"



type AvatarEditProps = {
    name:string,
    avatarUrl?: string | null,
}

export const AvatarEdit = ({name, avatarUrl}: AvatarEditProps) => {
    const router= useRouter()

    const inputRef = useRef<HTMLInputElement | null >(null)
    const [file, setFile] = useState<File | null > (null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<string  | null >(null)

    useEffect(() => {
        return () => {
            if(previewUrl){
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    async function uploadToCloudinary(selectedFile: File): Promise<string> {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
        if (!cloudName || !preset) {
          throw new Error("Env Cloudinary manquantes (cloud name / preset)");
        }
    
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("upload_preset", preset)
    
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
    
        const data = await res.json()
    
        if (!res.ok) {
          throw new Error(data?.error?.message ?? "Upload Cloudinary échoué");
        }
    
        return data.secure_url as string;
      }
    
      async function onSave() {
        setError(null)
    
        if (!file) {
          setError("Choisis une image d’abord.")
          return
        }
    
        setLoading(true)
        try {
          // Upload Cloudinary
          const secureUrl = await uploadToCloudinary(file)
    
          
          const result = await updateAvatarAction(secureUrl)// Update DB via server action
          if (!result.ok) {
            setError(result.message);
            return;
          }
    
          // reset l’état local et on refresh l’UI
          setFile(null)
          setPreviewUrl(null)
          router.refresh()
        } catch (e) {
          setError(e instanceof Error ? e.message : "Erreur inconnue")
        } finally {
          setLoading(false)
        }
      }


    return(
        <div className="flex flex-col items-center gap-3">
            <div className="relative inline-flex items-center justify-center">
                <Avatar name={name} avatarUrl={previewUrl ?? avatarUrl} sizeClassName="h-24 w-24 lg:h-40 lg:w-40"></Avatar>

                <input type="file" 
                ref={inputRef}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null
                    setFile(selected)
                    if(selected){
                        const localUrl = URL.createObjectURL(selected)
                        setPreviewUrl(localUrl)
                    }else{
                        setPreviewUrl(null)
                    }
                }}
                />

                <button type="button" onClick={() => inputRef.current?.click()} className="absolute bottom-0 right-0 flex h-8 w-8 items-center cursor-pointer justify-center rounded-full bg-(--primary) hover:bg-(--primary-hover)
                text-white shadow-lg">
                    <Camera size={16}></Camera>
                </button>
            </div>
            {file && (
                <button type="button" onClick={onSave} disabled={loading} className="rounded-full bg-(--primary) hover:bg-(--primary-hover) text-sm font-semibold px-5 py-2 text-white disabled:opacity-45">
                    {loading ? "envoi en cours" : "Enregistrer"}
                </button>
            )}
            {error && <p className="text-red-600!">{error}</p>}
        </div>
    )

}