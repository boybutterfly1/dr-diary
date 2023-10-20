<template>
  <div class="container">
    <div class="container__header">
      <span>Doctor's Diary</span>
      <n-button
          type="primary"
          @click="showModal = true"
      >
        Добавить пациента
      </n-button>
    </div>
    <table>
      <thead>
      <tr class="head">
        <th>Имя</th>
        <th>Локальный статус</th>
        <th>Следующий осмотр</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr
          class="list"
          v-for="patient in patientStore.patients"
      >
        <td>{{patient.name}}</td>
        <td>{{patient.localStatus}}</td>
        <td>
          <n-date-picker v-model:value="range" type="daterange" clearable />
        </td>
        <td>
          <Toast position="bottom-right" group="br" class="toast"/>
            <img src="https://img.icons8.com/ios-filled/50/000000/documents.png"
                 alt="copy"
                 @click="copy(patient)"
            />
        </td>
        <td>
          <n-popconfirm
              @positive-click="patientStore.deletePatient(patient.id)"
              negative-text="Отмена"
              positive-text="Удалить"
          >
            <template #trigger>
          <img src="https://img.icons8.com/ios-filled/50/000000/waste.png"
               alt="delete"
          >
            </template>
            Вы уверены?
          </n-popconfirm>
        </td>

      </tr>
      </tbody>
    </table>
    <n-modal
        v-model:show="showModal">
        <n-card class="new-patient-form"
            style="width: 400px"
            title="Новый пациент"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
          <div class="new-patient-form inputs">
            <n-input
                v-model:value="newPatient.name"
                type="text"
                placeholder="Имя"
            />
            <n-select
                v-model:value="newPatient.localStatus"
                :options="localStatuses"
            />
          </div>
          <template #footer>
            <div class="new-patient-form btns">
              <n-button
                  type="default"
                  @click="showModal = false"
              >
                Отмена
              </n-button>
              <n-button
                  type="primary"
                  @click="addNewPatient"
              >
                Добавить
              </n-button>
            </div>
          </template>
        </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { usePatientStore } from "@/store/patient";
import {onMounted, ref} from "vue";
import {patientT} from "@/types/types";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const {rando} = require('@nastyox/rando.js');
const toast = useToast()

const range= ref<[number, number]>([Date.now(), Date.now()])
const timestamp = ref<number>(Date.now())
const patientStore = usePatientStore()
const newPatient = ref<patientT>({
  id: 0,
  name: '',
  copyText: [],
  parameters: {
    bp: null,
    hr: null,
    rr: null,
    temperature: null
  },
  localStatus: ''
})
const localStatuses = ref<{}[]>([
  {label: 'Удовлетворительный', value: 'Удовлетворительный'},
  {label: 'Средний', value: 'Средний'},
  {label: 'Тяжелый', value: 'Тяжелый'}
])
const showModal = ref(false)
function createCopyText(patient: patientT) {
  const days = (range.value[1]-range.value[0])/(24*60*60*1000) + 1
  let date = range.value[0]
  let time = '12:00'
  switch (patient.localStatus) {
    case 'Удовлетворительный':
      for (let i = 0; i < days; i+=2 ) {
        if (date === range.value[1]) {
          patient.copyText.push(generateText(patient, range.value[1], '10:00'))
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 172800000
          time = '08:00'
        }
      }
      if (date !== range.value[1]) patient.copyText.push(generateText(patient, range.value[1], '10:00'))
    break;
    case 'Средний':
      for (let i = 0; i < days; i+=1 ) {
        if (date === range.value[1]) {
          patient.copyText.push(generateText(patient, range.value[1], '10:00'))
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 86400000
          time = '08:00'
        }
      }
      if (date !== range.value[1]) patient.copyText.push(generateText(patient, range.value[1], '10:00'))
      break;
    case 'Тяжелый':
      for (let i = 0; i < days; i+=0.5 ) {
        (i ^ 0) === i ? time = '08:00' : time = '20:00'
        if (date === range.value[1]) {
          patient.copyText.push(generateText(patient, range.value[1], '10:00'))
          break;
        } else {
          patient.copyText.push(generateText(patient, date, time))
          date += 43200000
          time = '08:00'
        }
      }
      if (date !== range.value[1]) patient.copyText.push(generateText(patient, range.value[1], '10:00'))
      break;
  }
}
function generateText(patient: patientT, date: number, time: string): string {
  patient.parameters.bp = String(rando(110, 129)) + '/' + String(rando(70, 89));
  patient.parameters.hr = rando(65, 79);
  patient.parameters.rr = rando(12, 17);
  patient.parameters.temperature = rando(36.5, 36.8, 'float').toFixed(1);

  return (
        `Дата: ${new Date(date).toLocaleDateString()} Время: ${time}\n` +
        '\n' +
        'Жалобы:\n' +
        'Общее состояние удовлетворительное. \n' +
        `Тоны сердца ясные, ритм не нарушен. АД ${patient.parameters.bp} мм рт ст. ЧСС ${patient.parameters.hr} ударов в минуту.\n` +
        `Дыхание везикулярное, хрипов нет. ЧДД ${patient.parameters.rr} в минуту.\n` +
        `Кожные покровы физиологической окраски. Температура тела ${patient.parameters.temperature} 0С.\n` +
        'Живот не вздут, мягкий, безболезненный, перитонеальных знаков нет.\n' +
        'Стул и мочеиспускание не нарушены.\n' +
        `Локальный статус: ${patient.localStatus}\n` +
        '\n' +
        'Врач: '
  )
}
function addNewPatient() {
  patientStore.addNewPatient(newPatient.value);
  newPatient.value.name = '';
  showModal.value = false;
}
function copy(patient: patientT) {
  if (navigator.clipboard) {
    createCopyText(patient)
    navigator.clipboard.writeText(patient.copyText.join('\n'))
        .then(() => {
          console.log('Текст скопирован')
          showSuccess()
          patient.copyText = []
        })
        .catch((error) => {
          console.error('Ошибка при копировании текста: ' + error);
        });
  } else {
    console.error('API Clipboard не поддерживается в этом браузере.');
  }
}
const showSuccess = () => {
  toast.add({group: 'br', detail: 'Текст скопирован', life: 3000 });
};

onMounted(() => {
  const patientsLocalStorage = localStorage.getItem('patients')
  if (JSON.parse(String(patientsLocalStorage))) {
    patientStore.patients = JSON.parse(String(patientsLocalStorage))
  }
})
</script>

<style lang="sass" scoped>
.container
  padding: 40px
  margin: 0 auto
  width: 1000px
  &__header
    display: flex
    margin-bottom: 30px
    justify-content: space-between
    & span
      font-size: 30px
      font-weight: bold
    & button
      margin-top: 10px
  table
    width: 100%
    border-collapse: collapse
    font-size: 14px
    text-align: left
    & thead
      & th
        font-weight: bold
        padding: 10px
        border-bottom: 1px solid #b7b6b6
    & tbody
      & tr
        cursor: pointer
        &:hover
          background-color: #eeebea
        & td
          padding: 10px
          & img
            width: 18px
            margin-left: 10px
            transition: transform 0.3s ease
            &:hover
              transform: scale(1.15)
          &:nth-child(1)
            width: 30%
            text-align: left
          &:nth-child(2)
            width: 30%
            text-align: left
          &:nth-child(3)
            width: 270px
            text-align: left
          &:nth-child(5)
            text-align: right
.new-patient-form
  & .inputs
    display: flex
    flex-direction: column
    gap: 10px
  & .btns
    display: flex
    gap: 20px
    justify-content: flex-end
</style>
