import axios from "axios"
import { Firestore } from "@google-cloud/firestore"
import CollectionReference = FirebaseFirestore.CollectionReference
import DocumentData = FirebaseFirestore.DocumentData

interface Grass {
  today: number
  week: number
  year: number
  image: string
}
const isGrass = (item: any): item is Grass =>
  typeof item?.today === "number" &&
  typeof item?.week === "number" &&
  typeof item?.year === "number" &&
  typeof item?.image === "string"

interface Config {
  enable?: boolean
  dark?: boolean
  display?: boolean
  target?: "today" | "week" | "year"
}
interface GrassDoc extends Grass, Config {
  name: string
  enable: boolean
  dark: boolean
  display: boolean
  target: "today" | "week" | "year"
}
const isGrassDoc = (item: any): item is GrassDoc =>
  typeof item?.name === "string" &&
  typeof item?.enable === "boolean" &&
  typeof item?.dark === "boolean" &&
  typeof item?.display === "boolean" &&
  ["today", "week", "year"].includes(item?.target) &&
  isGrass(item)

const database = new Firestore()
const grassCollection = (): CollectionReference<DocumentData> =>
  database.collection("grass")

export function fetchGrass(
  name: string,
  isDark: boolean,
): Promise<Grass | null> {
  const url = process.env.GET_GRASS_URL
  if (!url) throw new Error("env is undefined")
  return axios
    .post(url, { name, dark: isDark })
    .then((res) => (isGrass(res.data) ? res.data : null))
    .catch(() => null)
}

export async function setGrass(userId: string, grass: GrassDoc): Promise<void> {
  await grassCollection()
    .doc(userId)
    .set({
      today: grass.today,
      week: grass.week,
      year: grass.year,
      image: grass.image,
      enable: grass.enable,
      dark: grass.dark,
      display: grass.display,
      target: grass.target,
      name: grass.name,
    } as GrassDoc)
}

export async function getGrass(userId: string): Promise<GrassDoc | null> {
  const ref = await grassCollection().doc(userId).get()
  const grass = ref.data()
  return isGrassDoc(grass) ? grass : null
}

export async function updateGrass(userId: string): Promise<void> {
  const user = await getGrass(userId)
  if (!user) throw new Error("user is not found")
  const grass = await fetchGrass(user.name, user.dark)
  if (!grass) return
  await grassCollection().doc(userId).update(grass)
}

export async function updateAllGrass(): Promise<void> {
  const docs = await grassCollection().get()
  const updatePromise: Promise<void>[] = []
  docs.forEach((doc) => {
    const id = doc.id
    updatePromise.push(updateGrass(id))
  })
  await Promise.all(updatePromise)
}

export async function updateConfig(
  userId: string,
  config: Config,
): Promise<void> {
  const user = await getGrass(userId)
  if (!user) throw new Error("user is not found")
  await grassCollection().doc(userId).update(config)
}
