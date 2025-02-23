export const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"] as const
export type METHODS = typeof METHODS[number]
export const METHODS_LOWERCASE = ["get", "post", "put", "delete", "options", "patch"] as const
export type METHODS_LOWERCASE = typeof METHODS_LOWERCASE[number]
