import { endpoint, masterKey } from '../config'
import { CosmosClient } from '@azure/cosmos'

async function main() {
  let requestCount = 0
  let operationCount = 0

  const client = new CosmosClient({
    endpoint,
    auth: {
      masterKey
    },
    plugins: [
      {
        on: 'operation',
        plugin: async (context, next) => {
          operationCount++
          return next(context)
        }
      },
      {
        on: 'request',
        plugin: async (context, next) => {
          requestCount++
          return next(context)
        }
      },
      {
        on: 'request',
        plugin: async (context: any, next) => {
          let response
          try {
            response = next(context)
          } catch (error) {
            if (error.statusCode === 500) {
              context.globalEndpointManager.markCurrentLocationUnavailableForRead()
              context.endpoint = context.globalEndpointManager.nextEndpoint()
              return next(context)
            }
            throw error
          }
          return response
        }
      }
    ]
  })

  const container = client
    .database('api-demo-database')
    .container('api-demo-container')

  const iterator = await container.items.readAll().fetchAll()
}
main()
