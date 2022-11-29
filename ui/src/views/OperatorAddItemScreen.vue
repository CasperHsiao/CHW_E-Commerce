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
        <input class = "form-control" v-model="product.price" />
      </div>
      <div class="form-group">
        <label style="color: teal;font-weight: 500;">Item Description</label>
        <input class = "form-control form-control-sm" v-model="product.description" placeholder="item description" />
      </div>
      <div class="form-group">
        <label style="color: teal;font-weight: 500;">Item Rating</label>
        <input class = "form-control" v-model="product.rating" />
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
import { onMounted, ref, computed, Ref } from "vue";
import { Operator, Order } from "../../../server/data";

import { Product } from "../../../server/data";

const product: Ref<Product | undefined> = ref({
  name: "",
  price: 0,
  description: "",
  rating: 0,
});

async function addItem() {
  console.log(product.value.name);
  console.log(product.value.price);
  console.log(product.value.description);
  console.log(product.value.rating);

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
}

</script>