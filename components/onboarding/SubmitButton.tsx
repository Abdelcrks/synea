import { useFormStatus } from "react-dom"



export const SubmitButton = ({disabled}: {disabled:boolean}) => {
    const {pending} = useFormStatus()

    return (
        <button type="submit" disabled={disabled || pending}
        className={`rounded-full py-3 text-white ${
            disabled || pending ? "bg-black/40 cursor-not-allowed" : "bg-black"
        }`}>
            {pending ? "Création..." : "Créer mon compte"}
        </button>
    )
}