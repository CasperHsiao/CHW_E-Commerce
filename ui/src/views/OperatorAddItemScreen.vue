<template>
  <div class="mx-3 my-3">
    <b-jumbotron
      bg-variant="info"
      text-variant="white"
      :header="`Add Item Screen`"
    />
    <h2 style="color: Brown;">Add Items</h2>
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
      <b-button @click="addItem()">Confirm</b-button>
    </div>
    <div class="mt-2 mx-1">
      <b-button @click="$router.go(-1)">Back To Operator</b-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";

import { Product } from "../../../server/data";

const product: Ref<Product | undefined> = ref({
  name: "",
  price: 0,
  description: "",
  rating: 0,
});

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