<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />

    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" :fields="orderFields"/>
    <h2>Shop</h2>
    <b-button-group>
      <b-button
        v-for="(prod, idx) in inventory"
        :key="idx"
        variant="primary"
        @click="addToCart(prod.name)"
      >
        Add {{ prod.name }}
      </b-button>
    </b-button-group>
    <h3>Your Cart</h3>
    <b-list-group flush>
      <b-list-group-item
        v-for="(ing, idx) in cart"
        :key="idx"
        class="d-flex justify-content-between align-items-center"
      >
        <span title="ing">{{ ing }}</span>
        <b-button variant="danger" @click="removeFromCart(idx)">Delete</b-button>
      </b-list-group-item>
    </b-list-group>
    <h3>
      Total cost: {{ totalCost }}
    </h3>
    <b-row align-h="start">
    <div class="mt-2 mx-1">
      <b-button @click="saveCart">Save Cart</b-button>
    </div>
    <div class="mt-2 mx-1">
      <b-button @click="checkout">Checkout</b-button>
      Note: must save cart before checking out
    </div>
  </b-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { CustomerWithOrders, Product } from "../../../server/data"

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
const cart: Ref<string[]> = ref([])
const inventory: Ref<Product[]> = ref([])
const totalCost = computed(() => {
  return cart.value.reduce((previousValue, currentValue) => {
    const prod = inventory.value.find(prod => {
      return prod.name === currentValue
    })
    if (prod) {
      return previousValue + prod.price
    }
    return previousValue}, 0)
})

async function refresh() {
  inventory.value = await (await fetch("/api/inventory")).json()

  if (props.customerId) {
    customer.value = await (await fetch("/api/customer/" + encodeURIComponent(props.customerId))).json()
    cart.value = (await (await fetch("/api/customer/" + encodeURIComponent(props.customerId) + "/cart")).json())?.productIds || []
  }
}
onMounted(refresh)

const orderFields = [{key: '_id', label: 'Order ID'}, 'state', {key: 'productIds', label: 'Products', formatter: (value: string[]) => {return value.join(", ")}}]

async function saveCart() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/update-cart",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ productIds: cart.value })
    }
  )
}

async function checkout() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/checkout-cart",
    { method: "POST" }
  )
  await refresh()
}

async function addToCart(product: string) {
  cart.value.push(product) 
}

async function removeFromCart(idx: number) {
  cart.value.splice(idx, 1)
}
</script>