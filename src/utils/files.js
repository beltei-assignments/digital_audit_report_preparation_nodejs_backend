import fs from 'fs'

export function deleteDirectory(path) {
  fs.rmdirSync(path, { recursive: true, force: true }, (err) => {
    throw err
  })
}

export async function readJsonFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (err) {
    console.error('Error reading or parsing the file:', err)
  }
}
