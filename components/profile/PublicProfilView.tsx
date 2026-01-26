import Image from "next/image";
import Link from "next/link";
import { CANCER_LABELS } from "@/lib/constants/cancer";
import { ROLE_LABELS } from "@/lib/constants/roles";
import type { PublicProfile } from "@/lib/db/queries/profile";
import { Avatar } from "./Avatar";
import { sendContactRequestForm } from "@/lib/actions/contact-requests/forms/sendFromProfile";
import { cancelContactRequestForm } from "@/lib/actions/contact-requests/forms/cancelFromProfile";
import { acceptContactRequestForm } from "@/lib/actions/contact-requests/forms/acceptFromProfile";
import { rejectContactRequestForm } from "@/lib/actions/contact-requests/forms/rejectFromProfile"
import type { RelationStatus } from "@/app/(app)/profiles/[id]/page";
import { removeContactFormAction } from "@/lib/actions/contacts/removeContactFormAction";
import { openOrCreateConversationAndRedirect } from "@/lib/actions/messages/forms/openOrCreateConversationAndRedirect";


type PublicProfileViewProps = {
  profile: PublicProfile;
  relationStatus: RelationStatus,
  requestId: number | null
}




export function PublicProfileView({ profile, relationStatus, requestId }: PublicProfileViewProps) {


    const renduProfilStatus = () => {
        if(relationStatus === "self"){
           return(
            <div className="w-full space-y-2 pt-2">
                <p className="text-sm text-center">Ceci est votre profil public.</p>
                <Link
                href="/profile"
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-(--secondary) text-white bg-(--primary)"
                >
                Aller à mon profil 
                </Link>
            </div>
        )}
        if(relationStatus === "connected"){
            return ( 
                <div className="w-full pt-2 grid grid-cols1 gap-3 sm:grid-cols:2">
                    {/* <Link
                        href="/messages"
                        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white btn-primary"
                    >
                        Envoyer un message
                    </Link> */}
                    <form action={openOrCreateConversationAndRedirect} className="w-full">
                      <input type="hidden" name="toUserId" value={profile.userId} />
                      <button type="submit" className="inline-flex cursor-pointer w-full px-6 py-3 rounded-full text-sm justify-center font-semibold text-white btn-primary">Envoyer un message</button>
                    </form>
                    {requestId ? (
                        <form action={removeContactFormAction} className="w-full">
                            <input type="hidden" name="requestId" value={requestId} />
                            <input type = "hidden" name="profileId" value={profile.id}></input>
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center cursor-pointer rounded-full hover:bg-red-800 px-6 py-3 text-sm font-semibold bg-red-600 text-white"
                                 >Supprimer le contact
                            </button>
                        </form>
                        ):(
                            <button disabled className=" cursor-not-allowed">Contact</button>
                        )
                    }

                </div>
            )
        }


        if (relationStatus === "pending_outgoing") {
            return (
              <div className="w-full flex gap-3 pt-2">
                {requestId ? (
                  <form action={cancelContactRequestForm} className="w-full">
                    <input type="hidden" name="requestId" value={String(requestId)} />
                    <input type="hidden" name="profileId" value={profile.id} />
          
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-[#9F86C0]/15 text-[#6D647A]"
                    >
                      Annuler la demande
                    </button>
                  </form>
                ) : (
                  <button
                    disabled
                    className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-[#9F86C0]/15 text-[#6D647A] cursor-not-allowed"
                  >
                    Demande en cours
                  </button>
                )}
              </div>
            );
          }          
  
      if (relationStatus === "pending_incoming") {
        return (
          <div className="w-full flex gap-3 pt-2">
            {requestId ? (
              <>
                <form action={acceptContactRequestForm} className="w-full">
                  <input type="hidden" name="requestId" value={String(requestId)} />
                  <input type="hidden" name="profileId" value={profile.id} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white btn-primary"
                  >
                    Accepter
                  </button>
                </form>
      
                <form action={rejectContactRequestForm} className="w-full">
                  <input type="hidden" name="requestId" value={String(requestId)} />
                  <input type="hidden" name="profileId" value={profile.id} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-[#9F86C0]/15 text-[#6D647A]"
                  >
                    Refuser
                  </button>
                </form>
              </>
            ) : (
              <button
                disabled
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-[#9F86C0]/15 text-[#6D647A] cursor-not-allowed"
              >
                Demande reçue
              </button>
            )}
          </div>
        );
      }
      

      return ( //none
        <div className="w-full flex gap-3 pt-2">
          <form action={sendContactRequestForm} className="w-full">
            <input type="hidden" name="toUserId" value={profile.userId} />
            <input type="hidden" name="profileId" value={profile.id} />
      
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white btn-primary"
            >
              Envoyer une demande
            </button>
          </form>
        </div>
      );
    }
      
    return (
        <section className="mx-auto max-w-xl p-4 md:p-8 space-y-6">
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Profil</h1>
            <p className="text-sm text-muted-foreground">
            Aperçu public — informations partagées avec la communauté
            </p>
        </div>

        <div className="rounded-2xl bg-white p-4 space-y-3 flex flex-col items-center justify-center shadow-xl">
            <div className="h-12 w-12 relative object-cover rounded-full flex items-center justify-center overflow-hidden border border-[#9F86C0]">
            {profile.avatarUrl ? (
                <Image alt={`Avatar de ${profile.namePublic}`} fill src={profile.avatarUrl} />
            ) : (
                <Avatar name={profile.namePublic} avatarUrl={profile.avatarUrl} />
            )}
            </div>

            <h2 className="font-semibold">{profile.namePublic}</h2>

            <span className="text-sm px-3 py-1 rounded-full bg-[#9F86C0]/30 text-[#6D647A] font-semibold">
            {ROLE_LABELS[profile.role]}
            </span>

            <p>{profile.locationRegion ?? "Région non renseignée"}</p>

            {renduProfilStatus()}
        </div>

        <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
            <h3 className="font-semibold">À propos</h3>
            <p>{profile.bio ?? "Aucune bio."}</p>
        </div>

        <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
            <h3 className="font-semibold">Informations (optionnel)</h3>
            <p>
            Type de cancer (optionnel) :{" "}
            {profile.cancerType ? CANCER_LABELS[profile.cancerType] : "Non renseigné"}
            </p>
            <p className="text-xs italic">
            Ces informations sont facultatives. Chaque membre choisit ce qu’il partage.
            </p>
        </div>
        </section>
    )
}
