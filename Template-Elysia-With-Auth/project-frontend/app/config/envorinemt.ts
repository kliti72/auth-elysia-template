
type ConfigAPP = {
    HOST_API_URL : string
}

export const CONFIG_APP : ConfigAPP = {
    HOST_API_URL : process.env.HOST_API_URL ?? "http://localhost:4040",
} 