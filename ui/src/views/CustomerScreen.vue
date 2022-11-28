<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />

    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" :fields="orderFields"/>
    
    <h2>Draft Order</h2>
    <p>Add the ingredients you want:</p>
    <b-button-group>
      <b-button
        v-for="(ing, idx) in possibleIngredients.keys()"
        :key="idx"
        variant="primary"
        @click="addIngredient(ing)"
      >
        Add {{ ing }}
      </b-button>
    </b-button-group>
    <h3>
      Ingredients
    </h3>
    <b-list-group flush>
      <b-list-group-item
        v-for="(ing, idx) in draftOrderIngredients"
        :key="idx"
        class="d-flex justify-content-between align-items-center"
      >
        <span title="ing">{{ ing }}</span>
        <b-button variant="danger" @click="deleteIngredient(idx)">Delete</b-button>
      </b-list-group-item>
    </b-list-group>
    <h3>
      Total cost: {{ totalCost }}
    </h3>
    <div class="mt-2">
      <b-button @click="save">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { CustomerWithOrders, Ingredient } from "../../../server/data"

// props
interface Props {
  customerId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer: Ref<CustomerWithOrders | null> = ref(null)

const name = computed(() => customer.value?.name || props.customerId)
const draftOrderIngredients: Ref<string[]> = ref([])
const possibleIngredients: Ref<Map<string, number>> = ref(new Map<string, number>)
const totalCost = computed(() => {
  return draftOrderIngredients.value.reduce((previousValue, currentValue) => {
    const currCost = possibleIngredients.value.get(currentValue)
    if (currCost) {
      return previousValue + currCost
    }
    return previousValue}, 0)
})

async function refresh() {
  (await (await fetch("/api/possible-ingredients")).json()).forEach((element: Ingredient) => {
    possibleIngredients.value.set(element.name, element.price)
  });

  if (props.customerId) {
    customer.value = await (await fetch("/api/customer/" + encodeURIComponent(props.customerId))).json()
    draftOrderIngredients.value = (await (await fetch("/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order")).json())?.ingredientIds || []
  }
}
onMounted(refresh)

const orderFields = [{key: '_id', label: 'Order ID  '}, 'state', {key: 'ingredientIds', label: 'Ingredients', formatter: (value: string[]) => {return value.join(", ")}}]

async function save() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredientIds: draftOrderIngredients.value })
    }
  )
}

async function submit() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
}

async function addIngredient(ingredient: string) {
  draftOrderIngredients.value.push(ingredient) 
}

async function deleteIngredient(idx: number) {
  draftOrderIngredients.value.splice(idx, 1)
}
</script>