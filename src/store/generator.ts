import {defineStore} from "pinia";
import {ref} from "vue";
import {parametersT} from "@/types/types";
import { useToast } from 'primevue/usetoast';
export const useGeneratorStore = defineStore('generator', () => {
  const {rando} = require('@nastyox/rando.js');
  const toast = useToast()
  const conditions = ref<{}[]>([
    {label: 'Удовлетворительное', value: 'Удовлетворительное'},
    {label: 'Среднее', value: 'Среднее'},
    {label: 'Тяжелое', value: 'Тяжелое'}
  ])
  const parameters = ref<parametersT>({
    bp: null,
    hr: null,
    rr: null,
    temperature: null
  })

  const hospitalizationDates= ref<[number, number]>([Date.now(), Date.now()])
  const hospitalizationCondition = ref('Удовлетворительное')
  const surgeryDate = ref<number>(Date.now())
  const surgeryCondition = ref('Среднее')
  const afterSurgeryExaminationDate = ref<number>(Date.now())
  const afterSurgeryExaminationCondition = ref('Удовлетворительное')
  const generatedText = ref<string[]>([])

  function generateText() {
    const daysBeforeSurgery :number = (surgeryDate.value - hospitalizationDates.value[0])/(24*60*60*1000)
    const daysBeforeConditionChange :number = (afterSurgeryExaminationDate.value - surgeryDate.value)/(24*60*60*1000) - 1
    const daysBeforeDischarge :number = (hospitalizationDates.value[1] - afterSurgeryExaminationDate.value)/(24*60*60*1000) + 1
    let date: number = hospitalizationDates.value[0]
    let time: string = '10:00'
      // `${new Date(hospitalizationDates.value[0]).getHours().toString().padStart(2, '0')}:` +
      // `${new Date(hospitalizationDates.value[0]).getMinutes().toString().padStart(2, '0')}`

    // BEFORE SURGERY
    switch (hospitalizationCondition.value) {
      case 'Удовлетворительное':
        for (let i = 0; i < daysBeforeSurgery; i+=2 ) {
          generatedText.value.push(generateNote(date, time))
          date += 172800000
          time = '08:00'
        }
        if (date != surgeryDate.value) generatedText.value.push(generateNote(surgeryDate.value, time))
        break;
      case 'Среднее':
        for (let i = 0; i < daysBeforeSurgery; i+=1 ) {
          generatedText.value.push(generateNote(date, time))
          date += 86400000
          time = '08:00'
        }
        if (date != surgeryDate.value) generatedText.value.push(generateNote(surgeryDate.value, time))
        break;
      case 'Тяжелое':
        for (let i = 0; i < daysBeforeSurgery; i+=0.5 ) {
          (i ^ 0) === i ? time = '08:00' : time = '20:00'
          generatedText.value.push(generateNote(date, time))
          date += 43200000
        }
        generatedText.value.push(generateNote(surgeryDate.value, time))
        break;
    }

    // BEFORE EXAMINATION
    switch (surgeryCondition.value) {
      case 'Удовлетворительное':
        date = surgeryDate.value
        time = '15:00'
        generatedText.value.push(generateNote(date, time, surgeryCondition.value))
        date += 86400000
        time = '08:00'
        for (let i = 0; i < daysBeforeConditionChange; i+=2) {
          generatedText.value.push(generateNote(date, time, surgeryCondition.value))
          date += 172800000
        }
        break;
      case 'Среднее':
        date = surgeryDate.value
        time = '15:00'
        generatedText.value.push(generateNote(date, time, surgeryCondition.value))
        date += 86400000
        time = '08:00'
        for (let i = 0; i < daysBeforeConditionChange; i+=1) {
          generatedText.value.push(generateNote(date, time, surgeryCondition.value))
          date += 86400000
        }
        break;
      case 'Тяжелое':
        date = surgeryDate.value
        time = '15:00'
        generatedText.value.push(generateNote(date, time, surgeryCondition.value))
        date += 86400000
        for (let i = 0; i < daysBeforeConditionChange; i+=0.5) {
          (i ^ 0) === i ? time = '08:00' : time = '20:00'
          generatedText.value.push(generateNote(date, time, surgeryCondition.value))
          date += 43200000
        }
        break;
    }

    // BEFORE DISCHARGE
    switch (afterSurgeryExaminationCondition.value) {
      case 'Удовлетворительное':
        time = '08:00'
        for (let i = 0; i < daysBeforeDischarge; i+=2 ) {
          if (date === hospitalizationDates.value[1]) {
            generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
            break;
          } else {
            generatedText.value.push(generateNote(date, time))
            date += 172800000
          }
        }
        if (date !== hospitalizationDates.value[1]) generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
        break;
      case 'Среднее':
        time = '08:00'
        for (let i = 0; i < daysBeforeDischarge; i+=1 ) {
          if (date === hospitalizationDates.value[1]) {
            generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
            break;
          } else {
            generatedText.value.push(generateNote(date, time))
            date += 86400000
          }
        }
        if (date !== hospitalizationDates.value[1]) generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
        break;
      case 'Тяжелое':
        for (let i = 0; i < daysBeforeDischarge; i+=0.5 ) {
          if (date === hospitalizationDates.value[1]) {
            generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
            break;
          } else {
            (i ^ 0) === i ? time = '08:00' : time = '20:00'
            generatedText.value.push(generateNote(date, time))
            date += 43200000
          }
        }
        if (date !== hospitalizationDates.value[1]) generatedText.value.push(generateNote(hospitalizationDates.value[1], '10:00', afterSurgeryExaminationCondition.value))
        break;
    }
  }
  function generateNote(date: number, time: string, text?: string): string {
    parameters.value.bp = String(rando(110, 129)) + '/' + String(rando(70, 89));
    parameters.value.hr = rando(65, 79);
    parameters.value.rr = rando(12, 17);
    parameters.value.temperature = rando(36.5, 36.8, 'float').toFixed(1);

    let dischargeComplaints = ''
    let dischargeText = ''
    let dischargeStatus = ''
    let generalCondition = 'удовлетворительное'

    if (text) generalCondition = text.toLowerCase()
    if (date === hospitalizationDates.value[1]) {
      dischargeComplaints = 'Болезненность в области послеоперационной раны'
      dischargeStatus = 'Повязки сухие, швы состоятельны, рана заживает первичным натяжением без признаков воспаления. Дистальнее нейротрофических нарушений не наблюдается. Конечность иммобилизована в гипсовой повязке.'
      dischargeText = 'Выписывается с улучшением в удовлетворительном состоянии для дальнейшего лечения в амбулаторных условиях\n'
    }

    return (
      `Дата: ${new Date(date).toLocaleDateString()} Время: ${time}\n` +
      '\n' +
      `Жалобы: ${dischargeComplaints}\n` +
      `Общее состояние ${generalCondition}\n` +
      `Тоны сердца ясные, ритм не нарушен. АД ${parameters.value.bp} мм рт ст. ЧСС ${parameters.value.hr} ударов в минуту.\n` +
      `Дыхание везикулярное, хрипов нет. ЧДД ${parameters.value.rr} в минуту.\n` +
      `Кожные покровы физиологической окраски. Температура тела ${parameters.value.temperature} 0С.\n` +
      'Живот не вздут, мягкий, безболезненный, перитонеальных знаков нет.\n' +
      'Стул и мочеиспускание не нарушены.\n' +
      `Общее состояние: ${dischargeStatus}\n` +
      `${dischargeText}\n` +
      'Врач:\n\n'
    )
  }
  function copy() {
    if (navigator.clipboard) {
      generateText()
      navigator.clipboard.writeText(generatedText.value.join('\n'))
        .then(() => {
          console.log('Текст скопирован')
          showSuccess()
          generatedText.value = []
        })
        .catch((error) => {
          console.error('Ошибка при копировании текста: ' + error);
        });
    } else {
      console.error('API Clipboard не поддерживается в этом браузере.');
    }
  }
  function showSuccess() {
    toast.add({group: 'br', detail: 'Текст скопирован', life: 3000 });
  }
  return {
    conditions,
    parameters,
    hospitalizationDates,
    hospitalizationCondition,
    surgeryDate,
    surgeryCondition,
    afterSurgeryExaminationDate,
    afterSurgeryExaminationCondition,
    generatedText,
    copy
  }
})