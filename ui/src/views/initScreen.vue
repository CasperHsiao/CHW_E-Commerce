<template>
  <div class="mx-3 my-3">
    <b-jumbotron header="Welcome shopping! Please login" />
    <!-- <b-button  @click="login" class="mb-2">Login</b-button> -->
    <b-button href="/api/login" class="mb-2">Login</b-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// async function login() {
//   await fetch("/api/login")
// }
// onMounted(refresh)
</script>