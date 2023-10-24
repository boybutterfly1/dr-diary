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
