<template>
  <div class="container">
    <div class="container__header">
      <n-button
          type="primary"
          class="container__header btn"
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
          <n-date-picker v-model:value="timestamp" type="date"/>
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
import router from "@/router";
import {onMounted, ref} from "vue";
import {patientT} from "@/types/types";
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const {rando} = require('@nastyox/rando.js');
const toast = useToast()
const timestamp = ref<number>(Date.now())
const patientStore = usePatientStore()
const newPatient = ref<patientT>({
  id: 0,
  name: '',
  isAdded: false,
  parameters: {
    bp: null,
    hr: null,
    rr: null
  },
  localStatus: ''
})
const localStatuses = ref<{}[]>([
  {label: 'Удовлетворительное', value: 'Удовлетворительное'},
  {label: 'Среднее', value: 'Среднее'},
  {label: 'Тяжелое', value: 'Тяжелое'}
])
const showModal = ref(false)

function addNewPatient() {
  patientStore.addNewPatient(newPatient.value)
  newPatient.value.name = ''
  showModal.value = false
}
function copy(patient: patientT) {
  if (navigator.clipboard) {
    patient.parameters.bp = String(rando(110, 129)) + '/' + String(rando(70, 89));
    patient.parameters.hr = rando(65, 79);
    patient.parameters.rr = rando(12, 17);
    let time: string | Date = '08:00'
    let nextDate = timestamp.value
    if (!patient.isAdded) {
      time = '12:00'
    }
    navigator.clipboard.writeText(`Дата: ${new Date(nextDate).toLocaleDateString()} Время: ${time}\n` +
        `Объективный статус: Состояние удовлетворительное. ` +
        'Положение активное. Кожные покровы бледно-розового цвета, теплые на ощупь. ' +
        `В лёгких дыхание везикулярное, хрипов нет. ЧДД ${patient.parameters.rr} в минуту. ` +
        `Тоны сердца приглушены, ритмичные. ЧСС ${patient.parameters.hr} в минуту. ` +
        `АД ${patient.parameters.bp} мм.рт.ст. Живот мягкий, безболезненный. Физиологические отправления не нарушены.\n` +
        `Локальный статус: ${patient.localStatus}`)
        .then(() => {
          patient.isAdded = true
          switch (patient.localStatus){
            case 'Удовлетворительное' :
              nextDate = timestamp.value + 172800000
              timestamp.value = nextDate
              break;
            case 'Среднее' :
              nextDate = timestamp.value + 86400000
              timestamp.value = nextDate
              break;
            case 'Тяжелое':
              nextDate = timestamp.value + 43200000
              timestamp.value = nextDate
          }
          showSuccess()
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
  display: flex
  flex-direction: column
  padding: 20px
  &__header
    display: flex
    margin-bottom: 20px
    justify-content: flex-end
  table
    border-collapse: collapse
    font-size: 14px
    text-align: left
    width: 100%
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
          &:nth-child(7)
            width: 5%
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
