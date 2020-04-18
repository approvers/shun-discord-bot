import { Storage } from "@google-cloud/storage"

const storage = new Storage()
const bucketName = "github-grass"

export async function addImage(name: string, image: Buffer): Promise<string> {
  const fileName = `${name}.png`
  const file = storage.bucket(bucketName).file(fileName)
  await file.save(image)
  await file.makePublic()
  return `https://storage.googleapis.com/${bucketName}/${fileName}`
}
