<template>
  <div class="mx-3 my-3">
    <b-jumbotron header="Welcome CHW Shopping Center!" />
    <h3 v-if="user?.roles?.includes('customer')">Navigate to My Orders to start shopping</h3>
    <h3 v-if="user?.roles?.includes('operator')">Navigate to My Work Screen to start operating</h3>
    <h3 v-if="!user.name">Please login to navigate</h3>
  </div>
</template>

<script setup lang="ts">import { BJumbotron } from 'bootstrap-vue';
import { Ref, inject } from 'vue';

const user: Ref<any> = inject("user")!
</script>