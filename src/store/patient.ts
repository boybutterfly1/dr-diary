import {defineStore} from "pinia";
import {patientT} from "@/types/types";
import {ref} from "vue";
export const usePatientStore = defineStore('patient', () => {

  const patients = ref<patientT[]>([])
  function addNewPatient(newPatient: patientT) {
    if (newPatient.name && newPatient.localStatus) {
      newPatient.id = Date.now()
      patients.value.push({...newPatient})
      localStorage.setItem('patients', JSON.stringify(patients.value))
    }
  }
  function deletePatient(id: number) {
    patients.value = patients.value.filter((patient: patientT) => patient.id !== id)
    localStorage.setItem('patients', JSON.stringify(patients.value))
  }

  return {
    patients,
    addNewPatient,
    deletePatient
  }
})