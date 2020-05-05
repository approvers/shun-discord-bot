import axios from "axios"
import { Firestore } from "@google-cloud/firestore"

export interface Grass {
  today: number
  week: number
  year: number
  image: Buffer
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGrass = (item: any): item is Grass =>
  typeof item?.today === "number" &&
  typeof item?.week === "number" &&
  typeof item?.year === "number" &&
  item?.image instanceof Buffer

export interface Config {
  dark: boolean
  display: boolean
  target: "today" | "week" | "year"
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isConfig = (item: any): item is Config =>
  typeof item?.dark === "boolean" &&
  typeof item?.display === "boolean" &&
  ["today", "week", "year"].includes(item?.target)

interface GrassDoc extends Grass, Config {
  name: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGrassDoc = (item: any): item is GrassDoc =>
  typeof item?.name === "string" && isGrass(item) && isConfig(item)

const database = new Firestore()
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const grassCollection = () => database.collection("grass")

export const fetchGrass = async (
  name: string,
  isDark: boolean,
): Promise<Grass | null> => {
  const url = process.env.GET_GRASS_URL
  if (!url) throw new Error("GET_GRASS_URL is undefined")
  const { data } = await axios.post(url, { name, dark: isDark })
  if (!data?.image) return null
  const image = Buffer.from(data.image, "base64")
  const grass = { ...data, image }
  return isGrass(grass) ? grass : null
}

export const setGrass = async (
  userId: string,
  grass: GrassDoc,
): Promise<void> => {
  const data: GrassDoc = {
    today: grass.today,
    week: grass.week,
    year: grass.year,
    image: grass.image,
    dark: grass.dark,
    display: grass.display,
    target: grass.target,
    name: grass.name,
  }
  await grassCollection().doc(userId).set(data)
}

export const getGrass = async (userId: string): Promise<GrassDoc | null> => {
  const ref = await grassCollection().doc(userId).get()
  const data = ref.data()
  return isGrassDoc(data) ? data : null
}

export const updateConfig = async (
  userId: string,
  config: Partial<Config>,
): Promise<boolean> => {
  const user = await getGrass(userId)
  if (!user) return false
  await grassCollection().doc(userId).update(config)
  return true
}

export const updateGrass = async (userId: string): Promise<boolean> => {
  const user = await getGrass(userId)
  if (!user) return false
  const grass = await fetchGrass(user.name, user.dark)
  if (!grass) return false
  await grassCollection().doc(userId).update(grass)
  return true
}

export const updateAllGrass = async (): Promise<void> => {
  const { docs } = await grassCollection().get()
  const updatePromise = docs.map(({ id }) => updateGrass(id))
  await Promise.all(updatePromise)
}
