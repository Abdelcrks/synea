import { useFormStatus } from "react-dom"


type SubmitButtonProps = {
    disabled?: boolean
    label: string
    pendingLabel?: string
}

export const SubmitButton = ({disabled = false, label, pendingLabel = "chargement.."}: SubmitButtonProps) => {
    const {pending} = useFormStatus()

    return (
        <button type="submit" disabled={disabled || pending}
        className={`rounded-full py-3 px-4 text-white ${
            disabled || pending ? "bg-black/40 cursor-not-allowed" : "btn-primary cursor-pointer "
        }`}>
            {pending ? pendingLabel : label}
        </button>
    )
}