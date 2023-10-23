export interface patientT {
  id: number,
  name: string,
  copyText: string[]
  parameters: parametersT,
  localStatus: string,
}
export interface parametersT {
  bp: string | null,
  hr: number | null,
  rr: number | null,
  temperature: number | null
}