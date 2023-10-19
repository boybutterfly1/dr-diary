export interface patientT {
  id: number,
  name: string,
  isAdded: boolean
  parameters: parametersT,
  localStatus: string
}
export interface parametersT {
  bp: string | null,
  hr: number | null,
  rr: number | null
}