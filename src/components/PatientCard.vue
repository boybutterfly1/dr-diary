<template>
  <div class="patient"
       v-if="patient"
  >
    <span>{{patient.name}}</span>
    <span>{{'Поступил: ' + patient.admissionDate}}</span>
    <span>{{'Следйющий осмотр: ' + patient.nextExaminationDate}}</span>
    <span>{{'Общее состояние: ' + patient.generalCondition}}</span>
    <span>{{'Локальный статус: ' + patient.localStatus}}</span>
  </div>
</template>

<script setup lang="ts">
import {usePatientStore} from "@/store/patient";
import {patientT} from "@/types/types";
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";

const patientStore = usePatientStore()

const route = useRoute()
const patient = computed<patientT | null>(() => {
  const id = +route.params.id
  return patientStore.patients.find((patient: patientT) => patient.id === id) || null
})

</script>

<style lang="sass" scoped>
.patient
  padding: 20px
  display: flex
  flex-direction: column
</style>
