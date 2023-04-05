import { Router } from "express"
import { IpFilter } from "express-ipfilter"
import {
    getConfigFile,
    parseCorsOrigins,
} from "medusa-core-utils"
import {
    ConfigModule,
} from "@medusajs/medusa/dist/types/global"
import cors from "cors"

// Allow the following IPs
const ips = ['85.564.564.588']

export default (rootDirectory, pluginOptions) => {
    const router = Router()

    const { configModule } =
        getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
    const { projectConfig } = configModule
    const storeCorsOptions = {
        origin: projectConfig.store_cors.split(","),
        credentials: true,
    }
    const adminCorsOptions = {
        origin: projectConfig.admin_cors.split(","),
        credentials: true,
    }

    // Create the server
    // router.use(IpFilter(ips, { mode: 'allow' }))

    router.get(
        "/store/hello",
        cors(storeCorsOptions),
        (req, res) => {

            res.json({
                message: "Welcome to Your Store!",
            })
        }
    )

    router.get(
        "/admint/hello",
        cors(adminCorsOptions),
        (req, res) => {
            res.json({
                message: "Welcome to Your Store!",
            })
        }
    )
    return router
}