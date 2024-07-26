export type Column = {
  id: string
  title: string
}
export type Task = {
  id: string
  title: string
  column: string
  createdAt: string
  order: number
  description?: string
}
