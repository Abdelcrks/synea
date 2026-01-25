export function makeParticipantDuoId(userIdA: string, userIdB: string) {
    const [first, second] = [userIdA, userIdB].sort() // evite les doublons, classe par odre alphabetique pour toujours retourner le meme ordre
    return `${first}:${second}`
  }


// impose l'ordre unique et tjr identique donc si a, b ou b,a au final ce sera classé par .sort() (alphabetique)
// donc (a,b) ou (b,a) === même clé au moment du return 

  