
type ConfigAPP = {
    APP_NAME : string,
    HOST_API_URL : string
}

export const CONFIG_APP : ConfigAPP = {
    APP_NAME: process.env.APP_NAME ?? 'APP_NAME',
    HOST_API_URL : process.env.HOST_API_URL ?? "http://localhost:4040",
} 