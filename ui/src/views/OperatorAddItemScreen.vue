<template>
  <div class="mx-3 my-3">
    <b-jumbotron
      bg-variant="info"
      text-variant="white"
      :header="`Add Item Screen`"
    />
    <h2>Add Items</h2>
    <div class="mt-2 mx-1">
      <p>Item Name:</p>
      <input v-model="product.name" placeholder="Item Name" />

      <p>Item Price:</p>
      <input v-model="product.price" placeholder="Item Price" />

      <p>Item Description:</p>
      <textarea v-model="product.description" placeholder="Item Description"></textarea>

      <p>Item Rate:</p>
      <input v-model="product.rating" placeholder="Item Rate" />
    </div>
    <div class="mt-2 mx-1">
      <b-button @click="addItem()">Confirm</b-button>
    </div>
    <div class="mt-2 mx-1">
      <b-button @click="$router.go(-1)">Back To Operator</b-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from "vue";
import { Operator, Order } from "../../../server/data";

import { Product } from "../../../server/data";

// props
// interface Props {
//   operatorId: string
// }

// // default values for props
// const props = withDefaults(defineProps<Props>(), {
//   operatorId: "",
// })

// const operator: Ref<Operator | null> = ref(null)
// const orders: Ref<Order[]> = ref([])

// const name = computed(() => operator.value?.name || props.operatorId)

const product: Ref<Product | undefined> = ref({
  name: "",
  price: 0,
  description: "",
  rating: 0,
});

function addItem() {
  // this.itemName = this.item_name

  console.log("wilson");
  console.log(product.value.name);
  console.log(product.value.price);
  console.log(product.value.description);
  console.log(product.value.rating);
  // console.log()
}
// async function refresh() {
//   if (props.operatorId) {
//     operator.value = await (await fetch("/api/operator/" + encodeURIComponent(props.operatorId))).json()
//   }
//   orders.value = await (await fetch("/api/orders/")).json()
// }
// onMounted(refresh)

// const fields = ["_id", "customerId", "state", {key: 'ingredientIds', label: 'Ingredients', formatter: (value: string[]) => {return value.join(", ")}}, "operatorId"]

// async function updateOrder(orderId: string, state: string) {
//   await fetch(
//     "/api/order/" + encodeURIComponent(orderId),
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "PUT",
//       body: JSON.stringify({
//         operatorId: props.operatorId,
//         state,
//       })
//     }
//   )
//   await refresh()
// }
</script>