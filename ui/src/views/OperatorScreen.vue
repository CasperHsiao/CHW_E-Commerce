<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="info" text-variant="white" :header="`Work Screen for ${name}`" />
    <h2>Orders</h2>
    <b-modal size="lg" id="modal-1" title="Add New Items!" hide-footer>
      <form>
        <div class="form-group">
          <label style="color: teal;font-weight: 500;">Item Name</label>
          <input class = "form-control form-control-sm" v-model="product.name" placeholder="item name" />
        </div>
        <div class="form-group">
          <label style="color: teal;font-weight: 500;">Item Price</label>
          <input class = "form-control" v-model.number="product.price" type="number" />
        </div>
        <div class="form-group">
          <label style="color: teal;font-weight: 500;">Item Description</label>
          <input class = "form-control form-control-sm" v-model="product.description" placeholder="item description" />
        </div>
        <div class="form-group">
          <label style="color: teal;font-weight: 500;">Item Rating</label>
          <input class = "form-control" v-model.number="product.rating" type="number" />
        </div>
      </form>
      <div class="mt-2 mx-1">
        <b-button @click="() => {addItem(); $bvModal.hide('modal-1');}">Confirm</b-button>
      </div>
    </b-modal>
    <div class="d-flex mb-3">
      <b-button @click="refresh">Refresh</b-button>
      <b-button class="mx-3" v-b-modal.modal-1 variant="primary">Add Item</b-button>
    </div>
    <b-table :items="orders" :fields="fields">
      <template #cell(operatorId)="cellScope">
        <span v-if="cellScope.value">
          {{ cellScope.value }}
          <b-button variant="success" @click="updateOrder(cellScope.item._id, 'done')" v-if="cellScope.value === user?.preferred_username && cellScope.item.state !== 'done'">
            Done
          </b-button>
        </span>
        <b-button variant="warning" v-else @click="updateOrder(cellScope.item._id, 'delivering')">Start Delivering</b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, Ref, inject } from 'vue'
import { Operator, Order, Product } from "../../../server/data"

const operator: Ref<Operator | null> = ref(null)
const orders: Ref<Order[]> = ref([])
const product: Ref<Product> = ref({
  name: "",
  price: 0,
  description: "",
  rating: 0,
});

const user: Ref<any> = inject("user")!
const name = computed(() => operator.value?.name || user.value.name)

async function refresh() {
  if (user.value) {
    operator.value = await (await fetch("/api/operator/")).json()
  }
  orders.value = await (await fetch("/api/orders/")).json()
}
watch(user, refresh, { immediate: true })

const fields = ["_id", "customerId", "state", {key: 'productIds', label: 'Ingredients', formatter: (value: string[]) => {return value.join(", ")}}, "operatorId"]

async function updateOrder(orderId: string, state: string) {
  await fetch(
    "/api/order/" + encodeURIComponent(orderId),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        operatorId: user.value.preferred_username,
        state,
      })
    }
  )
  await refresh()
}

async function addItem() {
  await fetch(
    "/api/operator/addnewitem",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ 
        name: product.value.name,
        price: product.value.price, 
        description: product.value.description, 
        rating: product.value.rating,
        })
    }
  )

  product.value.name = ""
  product.value.price = 0
  product.value.description = ""
  product.value.rating = 0
}

</script>