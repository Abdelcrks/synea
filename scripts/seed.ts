/**
 * Seed script — Synea demo data
 * Usage: npx dotenv-cli -e .env -- tsx scripts/seed.ts
 */

import { db } from "@/lib/db/drizzle"
import { users, accounts } from "@/lib/db/auth-schema"
import { profiles, contactRequests, conversations, conversationParticipants, messages, CANCER_TYPES } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { hashPassword } from "better-auth/crypto"
import { v4 as uuidv4 } from "uuid"

// ─── CONFIG ───
const PASSWORD = "Synea2025!"

type CancerType = typeof CANCER_TYPES[number]

interface UserSeedData {
  name: string
  email: string
  cancerType: CancerType
  bio: string
  region: string
  avatarUrl?: string
}

// ─── HÉROS (en traitement) ───
const heroData: UserSeedData[] = [
  {
    name: "Camille Martin",
    email: "camille@demo.synea.fr",
    cancerType: "breast",
    bio: "Diagnostiquée il y a 6 mois. Je cherche à échanger avec quelqu'un qui a traversé la même chose.",
    region: "Île-de-France",
    avatarUrl: "https://i.pravatar.cc/150?u=camille@demo.synea.fr",
  },
  {
    name: "Thomas Petit",
    email: "thomas@demo.synea.fr",
    cancerType: "lymphoma",
    bio: "En chimio depuis 3 mois. Les nuits sont longues, les questions nombreuses.",
    region: "Auvergne-Rhône-Alpes",
    avatarUrl: "https://i.pravatar.cc/150?u=thomas@demo.synea.fr",
  },
  {
    name: "Amina Benali",
    email: "amina@demo.synea.fr",
    cancerType: "leukemia",
    bio: "J'ai besoin de parler à quelqu'un qui comprend vraiment ce que c'est.",
    region: "Provence-Alpes-Côte d'Azur",
    avatarUrl: "https://i.pravatar.cc/150?u=amina@demo.synea.fr",
  },
  {
    name: "Lucas Dupont",
    email: "lucas@demo.synea.fr",
    cancerType: "brain",
    bio: "Opéré il y a 2 mois. Je traverse une période difficile et cherche du soutien.",
    region: "Occitanie",
    avatarUrl: "https://i.pravatar.cc/150?u=lucas@demo.synea.fr",
  },
  {
    name: "Sophie Lemaire",
    email: "sophie@demo.synea.fr",
    cancerType: "lung",
    bio: "Non-fumeuse diagnostiquée d'un cancer du poumon. Je veux briser l'isolement.",
    region: "Hauts-de-France",
    avatarUrl: "https://i.pravatar.cc/150?u=sophie@demo.synea.fr",
  },
  {
    name: "Mehdi Karim",
    email: "mehdi@demo.synea.fr",
    cancerType: "urologic",
    bio: "30 ans, cancer de la prostate. Peu de personnes de mon âge comprennent.",
    region: "Normandie",
  },
  {
    name: "Isabelle Roux",
    email: "isabelle@demo.synea.fr",
    cancerType: "gynecologic",
    bio: "En traitement depuis 4 mois. Cherche à échanger avec une femme en rémission.",
    region: "Bretagne",
  },
  {
    name: "Antoine Moreau",
    email: "antoine@demo.synea.fr",
    cancerType: "sarcoma",
    bio: "Cancer rare, peu de témoignages disponibles. Je veux trouver quelqu'un qui a vécu ça.",
    region: "Grand Est",
  },
  {
    name: "Fatima Ouali",
    email: "fatima@demo.synea.fr",
    cancerType: "skin",
    bio: "Mélanome diagnostiqué il y a 3 mois. J'ai besoin de soutien au quotidien.",
    region: "Nouvelle-Aquitaine",
  },
  {
    name: "Julien Blanc",
    email: "julien@demo.synea.fr",
    cancerType: "digestive",
    bio: "Cancer colorectal à 35 ans. Cherche à parler à quelqu'un qui a surmonté ça.",
    region: "Pays de la Loire",
  },
]

// ─── PAIR-HÉROS (en rémission) ───
const peerHeroData: UserSeedData[] = [
  {
    name: "Marie Fontaine",
    email: "marie@demo.synea.fr",
    cancerType: "breast",
    bio: "En rémission depuis 3 ans après un cancer du sein. Je suis là pour vous écouter.",
    region: "Île-de-France",
    avatarUrl: "https://i.pravatar.cc/150?u=marie@demo.synea.fr",
  },
  {
    name: "Pierre Garnier",
    email: "pierre@demo.synea.fr",
    cancerType: "lymphoma",
    bio: "Lymphome de Hodgkin — rémission depuis 5 ans. Je connais le chemin.",
    region: "Auvergne-Rhône-Alpes",
    avatarUrl: "https://i.pravatar.cc/150?u=pierre@demo.synea.fr",
  },
  {
    name: "Nadia Hamidi",
    email: "nadia@demo.synea.fr",
    cancerType: "leukemia",
    bio: "Leucémie surmontée il y a 4 ans. Chaque jour en rémission est un cadeau.",
    region: "Île-de-France",
    avatarUrl: "https://i.pravatar.cc/150?u=nadia@demo.synea.fr",
  },
  {
    name: "François Durand",
    email: "francois@demo.synea.fr",
    cancerType: "digestive",
    bio: "Cancer du côlon — opéré et guéri. Je veux aider ceux qui commencent ce chemin.",
    region: "Occitanie",
    avatarUrl: "https://i.pravatar.cc/150?u=francois@demo.synea.fr",
  },
  {
    name: "Céline Bernard",
    email: "celine@demo.synea.fr",
    cancerType: "gynecologic",
    bio: "Rémission depuis 2 ans. Les femmes méritent un soutien spécifique.",
    region: "Bretagne",
    avatarUrl: "https://i.pravatar.cc/150?u=celine@demo.synea.fr",
  },
  {
    name: "Karim Mansour",
    email: "karim@demo.synea.fr",
    cancerType: "lung",
    bio: "Non-fumeur, cancer du poumon — rémission complète après 18 mois.",
    region: "Hauts-de-France",
  },
  {
    name: "Élise Morel",
    email: "elise@demo.synea.fr",
    cancerType: "skin",
    bio: "Mélanome malin grade 3 — aujourd'hui complètement guérie.",
    region: "Nouvelle-Aquitaine",
  },
  {
    name: "David Laurent",
    email: "david@demo.synea.fr",
    cancerType: "brain",
    bio: "Tumeur cérébrale opérée il y a 3 ans. Je suis vivant et je veux le dire.",
    region: "Grand Est",
  },
  {
    name: "Yasmine Benkirane",
    email: "yasmine@demo.synea.fr",
    cancerType: "bone",
    bio: "Sarcome osseux — rémission depuis 6 ans. Je connais la douleur.",
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: "Nicolas Perrin",
    email: "nicolas@demo.synea.fr",
    cancerType: "urologic",
    bio: "Cancer du rein traité avec succès. En rémission depuis 2 ans.",
    region: "Normandie",
  },
]

async function clearDatabase() {
  console.log("🗑️  Nettoyage de la base...")
  await db.execute(sql`TRUNCATE TABLE messages CASCADE`)
  await db.execute(sql`TRUNCATE TABLE conversation_participants CASCADE`)
  await db.execute(sql`TRUNCATE TABLE conversations CASCADE`)
  await db.execute(sql`TRUNCATE TABLE contact_requests CASCADE`)
  await db.execute(sql`TRUNCATE TABLE profiles CASCADE`)
  await db.execute(sql`TRUNCATE TABLE account CASCADE`)
  await db.execute(sql`TRUNCATE TABLE session CASCADE`)
  await db.execute(sql`TRUNCATE TABLE verification CASCADE`)
  await db.execute(sql`TRUNCATE TABLE "user" CASCADE`)
  console.log("✅ Base nettoyée\n")
}

async function createUser(
  data: UserSeedData,
  role: "hero" | "peer_hero",
) {
  const userId = uuidv4()
  const profileId = uuidv4()
  const now = new Date()

  const hashedPassword = await hashPassword(PASSWORD)

  await db.insert(users).values({
    id: userId,
    name: data.name,
    email: data.email,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(accounts).values({
    id: uuidv4(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(profiles).values({
    id: profileId,
    userId,
    role,
    namePublic: data.name.split(" ")[0],
    cancerType: data.cancerType,
    bio: data.bio,
    locationRegion: data.region,
    showRegionPublic: true,
    isVisible: true,
    avatarUrl: data.avatarUrl ?? null,
    createdAt: now,
    updatedAt: now,
  })

  return userId
}

async function createConversationWithMessages(
  heroId: string,
  peerHeroId: string,
  heroName: string,
  peerHeroName: string,
) {
  const now = new Date()
  const duoId = [heroId, peerHeroId].sort().join("_")

  const [conv] = await db.insert(conversations).values({
    participantDuoId: duoId,
    createdByUserId: heroId,
    createdAt: now,
  }).returning()

  await db.insert(conversationParticipants).values([
    {
      userKey: heroId,
      conversationId: conv.id,
      userId: heroId,
      userNameSnapshot: heroName,
      createdAt: now,
    },
    {
      userKey: peerHeroId,
      conversationId: conv.id,
      userId: peerHeroId,
      userNameSnapshot: peerHeroName,
      createdAt: now,
    },
  ])

  const sampleMessages = [
    { senderId: heroId, senderName: heroName, content: "Bonjour, je suis vraiment content(e) qu'on puisse échanger. J'ai lu votre profil et ça m'a beaucoup touché." },
    { senderId: peerHeroId, senderName: peerHeroName, content: "Bonjour ! Je suis là pour vous écouter. Qu'est-ce qui vous pèse le plus en ce moment ?" },
    { senderId: heroId, senderName: heroName, content: "Les nuits sont difficiles. Je pense beaucoup à l'avenir. Comment vous avez fait pour traverser ça ?" },
    { senderId: peerHeroId, senderName: peerHeroName, content: "Je comprends parfaitement. Un jour à la fois — c'est littéralement tout ce qu'on peut faire. Et ça suffit. Vous n'êtes pas seul(e)." },
  ]

  for (let i = 0; i < sampleMessages.length; i++) {
    const msg = sampleMessages[i]
    await db.insert(messages).values({
      conversationId: conv.id,
      senderId: msg.senderId,
      senderNameSnapshot: msg.senderName,
      content: msg.content,
      createdAt: new Date(now.getTime() + i * 60000),
    })
  }
}

async function main() {
  console.log("🌱 Démarrage du seed Synea...\n")

  await clearDatabase()

  console.log("👤 Création des Héros...")
  const heroIds: { id: string; name: string }[] = []
  for (const hero of heroData) {
    const id = await createUser(hero, "hero")
    heroIds.push({ id, name: hero.name })
    console.log(`  ✅ ${hero.name}`)
  }

  console.log("\n🤝 Création des Pair-Héros...")
  const peerIds: { id: string; name: string }[] = []
  for (const peer of peerHeroData) {
    const id = await createUser(peer, "peer_hero")
    peerIds.push({ id, name: peer.name })
    console.log(`  ✅ ${peer.name}`)
  }

  console.log("\n📬 Création des conversations...")
  const acceptedPairs = [
    { hero: heroIds[0], peer: peerIds[0] },
    { hero: heroIds[1], peer: peerIds[1] },
    { hero: heroIds[2], peer: peerIds[2] },
  ]

  for (const pair of acceptedPairs) {
    await db.insert(contactRequests).values({
      fromUserId: pair.hero.id,
      toUserId: pair.peer.id,
      status: "accepted",
      createdAt: new Date(),
      respondedAt: new Date(),
    })
    await createConversationWithMessages(
      pair.hero.id,
      pair.peer.id,
      pair.hero.name.split(" ")[0],
      pair.peer.name.split(" ")[0],
    )
    console.log(`  ✅ ${pair.hero.name} ↔ ${pair.peer.name}`)
  }

  console.log("\n📨 Création des demandes en attente...")
  for (let i = 3; i < 6; i++) {
    await db.insert(contactRequests).values({
      fromUserId: heroIds[i].id,
      toUserId: peerIds[i].id,
      status: "pending",
      createdAt: new Date(),
    })
    console.log(`  ⏳ ${heroIds[i].name} → ${peerIds[i].name}`)
  }

  console.log("\n🎉 Seed terminé !")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`📧 Format : prenom@demo.synea.fr`)
  console.log(`🔑 Mot de passe : ${PASSWORD}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Erreur seed :", err)
  process.exit(1)
})