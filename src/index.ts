import './config'
process.on('uncaughtException', (err) => {
  console.error(new Date().toString(), ': uncaughtException', err)
})

process.on('unhandledRejection', (rejection) => {
  console.error(new Date().toString(), ': unhandledRejection', rejection)
})


import { LeeaAgent } from '@leealabs/agent-js-sdk'
import { z } from 'zod'
import { appConfig } from './config'
import { RequestHandler } from '@leealabs/agent-js-sdk'
import { InputData } from './types/schema'
import { ethers } from 'ethers';

export const runWorkflow: RequestHandler = async (data: InputData, ctx) => {
  const MANTLE_TESTNET_RPC = 'https://mantle.drpc.org';

  const provider = new ethers.JsonRpcProvider(MANTLE_TESTNET_RPC);
  const receipt = await provider.getTransactionReceipt(data.tx);
  if (receipt) {
    return "true"
  }
  return "false"
}


const main = async () => {
  const agent = new LeeaAgent()
  await agent.initialize({
    name: 'mantle',
    fee: 10000,
    description: `I can check if there is a transaction on Mantle Testnet`,
    inputSchema: z.object({
      tx: z.string({ description: 'Transaction hash' }),
    }),
    outputSchema: z.boolean(),
    secretPath: './id.json',
    apiToken: appConfig.LEEA_API_TOKEN,
    requestHandler: runWorkflow,
    displayName: 'Twitter searcher',
    avatarPath: './logo.png',
  })
}

main()
