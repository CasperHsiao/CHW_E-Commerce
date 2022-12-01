<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />
    <b-modal size="lg" id="modal-1" title="Your Items!" hide-footer>
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
      <div class="mt-2 mx-1">
        <b-button variant="success" @click="() => {checkout(); $bvModal.hide('modal-1');}" >Checkout</b-button>
      </div>
    </b-modal>
    <h2>My Orders</h2>
    <b-button @click="refresh" class="mb-2 mt-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" :fields="orderFields"/>
    <h2 class="text-center">My Shop</h2>
    <div class="d-flex justify-content-end mr-5 mb-2">
      <b-button v-b-modal.modal-1 variant="info">
        Shopping Cart <b-badge variant="light">{{cart.length}}</b-badge>
      </b-button>
    </div>
    <b-card-group columns>
      <b-card
        v-for="(prod, idx) in inventory"
        :key="idx"
        no-body
      >
        <b-card-body>
          <b-card-title>{{prod.name}}</b-card-title>
          <b-card-sub-title class="mb-2">$ {{prod.price}}</b-card-sub-title>
          <b-card-text>{{prod.description}}</b-card-text>
        </b-card-body>
        <b-card-footer>
          <b-button variant="primary" @click="addToCart(prod.name)">Add to cart</b-button>
        </b-card-footer>
      </b-card>
    </b-card-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref, watch, inject } from 'vue'
import { CustomerWithOrders, Product } from "../../../server/data"

const customer: Ref<CustomerWithOrders | null> = ref(null)
const user: Ref<any> = inject("user")!

const name = computed(() => customer.value?.name || user.value.name)
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

  if (user.value) {
    customer.value = await (await fetch("/api/customer/")).json()
    cart.value = (await (await fetch("/api/customer/cart")).json())?.productIds || []
  }
}
watch(user, refresh, {immediate: true})

const orderFields = [{key: '_id', label: 'Order ID'}, 'state', {key: 'productIds', label: 'Products', formatter: (value: string[]) => {return value.join(", ")}}]

async function checkout() {
  await fetch(
    "/api/customer/checkout-cart",
    { method: "POST" }
  )
  await refresh()
}

async function addToCart(product: string) {
  cart.value.push(product)
  await fetch(
    "/api/customer/update-cart",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ productIds: cart.value })
    }
  ) 
}

async function removeFromCart(idx: number) {
  cart.value.splice(idx, 1)
}
</script>