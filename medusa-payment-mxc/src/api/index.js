import { Router } from "express"

import { 
  getConfigFile, 
} from "medusa-core-utils"
import cors from "cors"

export default (rootDirectory) => {
  const router = Router()

  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule

  const corsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }

  router.get("/erc20-token/price", cors(corsOptions), async (req, res) => {
    const mxcErc20ProviderService = req.scope.resolve("mxcErc20ProviderService")

    const price = await mxcErc20ProviderService.getPrice();
    res.json({
      price
    })
  })

  router.get("/erc20-payment_intent/status", cors(corsOptions), async (req, res) => {
    const { address } = req.query;
    const mxcErc20ProviderService = req.scope.resolve("mxcErc20ProviderService")

    const status = await mxcErc20ProviderService.getIntentStatus(address);
    res.json({
      status
    })
  })

  return router;
}