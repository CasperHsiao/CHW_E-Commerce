<template>
  <div class="mx-3 my-3">
    <b-jumbotron header="Welcome CHW Shopping Center!" />
    <h3 v-if="user.name">Navigate to My Orders to start shopping</h3>
    <h3 v-if="!user.name">Please login to start shopping</h3>
  </div>
</template>

<script setup lang="ts">import { BJumbotron } from 'bootstrap-vue';
import { Ref, inject } from 'vue';

const user: Ref<any> = inject("user")!
</script>