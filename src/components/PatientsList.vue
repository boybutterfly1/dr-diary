<template>
  <div class="container">
    <div class="generator">
      <form class="generator__options">
        <div>
          <span>Даты поступления и выписки</span>
          <n-date-picker v-model:value="generatorStore.hospitalizationDates" type="daterange" clearable />
        </div>
        <div>
          <span>Общее состояние при поступлении</span>
          <n-select
              v-model:value="generatorStore.hospitalizationCondition"
              :options="generatorStore.conditions"
          />
        </div>
        <div>
          <span>Дата операции</span>
          <n-date-picker v-model:value="generatorStore.surgeryDate" type="date" clearable />
        </div>
        <div>
          <span>Общее состояние после операции</span>
          <n-select
              v-model:value="generatorStore.surgeryCondition"
              :options="generatorStore.conditions"
          />
        </div>
        <div>
          <span>Изменение общего состояния</span>
          <n-date-picker v-model:value="generatorStore.afterSurgeryExaminationDate" type="date" clearable />
          <n-select
              v-model:value="generatorStore.afterSurgeryExaminationCondition"
              :options="generatorStore.conditions"
          />
        </div>
        <n-button
            type="primary"
            @click="generatorStore.copy"
        >
          Скопировать записи
          <Toast position="bottom-right" group="br" class="toast"/>
        </n-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import {useGeneratorStore} from "@/store/generator";
const generatorStore = useGeneratorStore()



function createCopyText(patient: patientT) {
  const days = (hospitalizationDates.value[1]-hospitalizationDates.value[0])/(24*60*60*1000) + 1
  let date = hospitalizationDates.value[0]
  let time = '12:00'
  switch (patient.localStatus) {
    case 'Удовлетворительный':
      for (let i = 0; i < days; i+=2 ) {
        if (date === hospitalizationDates.value[1]) {
          patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 172800000
          time = '08:00'
        }
      }
      if (date !== hospitalizationDates.value[1]) patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
    break;
    case 'Средний':
      for (let i = 0; i < days; i+=1 ) {
        if (date === hospitalizationDates.value[1]) {
          patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 86400000
          time = '08:00'
        }
      }
      if (date !== hospitalizationDates.value[1]) patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
      break;
    case 'Тяжелый':
      for (let i = 0; i < days; i+=0.5 ) {
        (i ^ 0) === i ? time = '08:00' : time = '20:00'
        if (date === hospitalizationDates.value[1]) {
          patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
          break;
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 43200000
          time = '08:00'
        }
      }
      if (date !== hospitalizationDates.value[1]) patient.copyText.push(generateText(patient, hospitalizationDates.value[1], '10:00'))
      break;
  }
}

</script>

<style lang="sass" scoped>
.container
  display: flex
  justify-content: center
  padding: 100px 0
.generator
  padding: 10px 20px 30px
  width: 700px
  height: auto
  border-radius: 10px
  border: 2px solid #18a058
  background-color: white
  &__options
    display: flex
    flex-direction: column
    gap: 15px
    & div
      display: flex
      flex-direction: column
      gap: 5px
      & span
        font-weight: bold
        font-size: 16px
</style>
