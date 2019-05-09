import { endpoint, masterKey } from '../config'
import { CosmosClient } from '@azure/cosmos'

async function main() {
  const client = new CosmosClient({
    endpoint,
    auth: {
      masterKey
    }
  })

  const container = client
    .database('api-demo-database')
    .container('api-demo-container')

  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), 10000)

  const iterator = await container.items.query(
    {
      query: 'SELECT * FROM Families f WHERE  f.lastName = @lastName',
      parameters: [
        {
          name: '@lastName',
          value: 'Andersen'
        }
      ]
    },
    { abortSignal: abortController.signal }
  )

  await iterator.fetchAll()
}

main()
