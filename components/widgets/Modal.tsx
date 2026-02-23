"use client"

import { useEffect, useRef, useState } from "react"

type ConfirmActionModalProps = {
  triggerText: string
  title: string
  description?: string

  confirmText?: string
  cancelText?: string

  action: (formData: FormData) => void | Promise<void>

  // inputs hidden envois des données
  hiddenFields?: Record<string, string>

  // styles 
  triggerClassName?: string
  confirmClassName?: string
  cancelClassName?: string
}

export function Modal({
  triggerText,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  action,
  hiddenFields,
  triggerClassName = "btn btn--secondary",
  confirmClassName = "btn btn--primary",
  cancelClassName = "btn btn--secondary",
}: ConfirmActionModalProps) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // fermeture via ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  // fermeture via click overlay
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) setOpen(false)
  }

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerText}
      </button>

      {open && (
        <div
          ref={dialogRef}
          onClick={onOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/10">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-sm muted">{description}</p>}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className={cancelClassName}
                onClick={() => setOpen(false)}
              >
                {cancelText}
              </button>

              <form
                action={async (formData) => {
                  await action(formData)
                  // si l’action ne redirect pas on ferme
                  setOpen(false)
                }}
              >
                {hiddenFields &&
                  Object.entries(hiddenFields).map(([k, v]) => (
                    <input key={k} type="hidden" name={k} value={v} />
                  ))}

                <button type="submit" className={confirmClassName}>
                  {confirmText}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}