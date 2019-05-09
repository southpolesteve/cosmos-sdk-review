import { endpoint, masterKey } from '../config'
import { CosmosClient } from '@azure/cosmos'

async function main() {
  const client = new CosmosClient({
    endpoint,
    auth: {
      masterKey
    }
  })

  const databaseResponse = await client.databases.createIfNotExists({
    id: 'api-demo-database'
  })

  const { database } = databaseResponse

  // const dbResponse = await client.databases.create({
  //   id: 'api-demo-db'
  // })

  const containerResponse = await database.containers.createIfNotExists({
    id: 'api-demo-container'
  })

  // const containerResponse = await database.containers.create({
  //   id: 'api-demo-container'
  // })

  const { container } = containerResponse
}

main()
