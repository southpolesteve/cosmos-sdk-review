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

  const iterator = await container.items.readAll()

  const iterator2 = await container.items.query(
    'SELECT * from c WHERE c.price > 1000'
  )

  const iterator3 = await container.items.query({
    query: 'SELECT * FROM Families f WHERE  f.lastName = @lastName',
    parameters: [
      {
        name: '@lastName',
        value: 'Andersen'
      }
    ]
  })

  const page = await iterator.fetchNext()
  page.resources

  iterator.hasMoreResults() // True

  iterator.forEach(item => console.log(item.id))

  const allResults = await iterator.fetchAll()
  allResults.resources

  const asyncIterator = iterator.getAsyncIterator()

  for await (let { resources } of asyncIterator) {
    console.log(resources)
  }
}

main()
