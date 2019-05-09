import { endpoint, masterKey } from '../config'
import { CosmosClient } from '@azure/cosmos'

interface User {
  email: string
  id: number
}

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

  const response = await container.item('id', 'partitionKey').read()

  const responseWithType = await container
    .item('id', 'partitionKey')
    .read<User>()

  const response2 = await container
    .item('id', 'partitionKey')
    .replace({ email: 'stfaul@microsoft.com' })

  const response3 = await container.items.create({
    id: 'newUser',
    partitionKey: 'foo',
    email: 'stfaul@microsoft.com'
  })

  const response4 = await container.items.upsert({
    id: 'newUser',
    partitionKey: 'foo',
    email: 'stfaul@microsoft.com'
  })

  const response5 = await container.item('id', 'partitionKey').delete()
}

main()
