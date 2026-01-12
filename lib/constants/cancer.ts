import type { CancerType } from "@/lib/db/schema"

export const CANCER_LABELS: Record<CancerType, string> = {
  bone: "Cancer des os",
  breast: "Cancer du sein",
  lung: "Cancer du poumon",
  skin: "Cancer de la peau",
  brain: "Cancer du cerveau",
  digestive: "Cancer digestif",
  gynecologic: "Cancer gynécologique",
  urologic: "Cancer urologique",
  head_neck: "Cancer ORL (tête et cou)",
  leukemia: "Leucémie",
  lymphoma: "Lymphome",
  myeloma: "Myélome",
  sarcoma: "Sarcome",
  other: "Autre",
}
