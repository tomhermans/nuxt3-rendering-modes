<template>
  <div>
    <p>wp-ssg {{ pageType }} page (ID: {{ params.id }})</p>
    <pre>Time after hydration: {{ new Date().toUTCString() }} </pre>
    <pre>Time in server rendered HTML: {{ data }}</pre>

    <hr>
    <h2>Route Parameters</h2>
    <pre>{{ JSON.stringify(params, null, 2) }}</pre>
    <hr>

    <div>
      <h2>WP Pull Data</h2>
      <pre>{{ myPosts }}</pre>
    </div>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const pageType = "SSG [id]";
const { data } = await useFetch('/api/hello');
const { params } = useRoute();


console.log(params);
import useWordpressApi from '../composables/useWordpressApi';

// const { data: article, error } = await useWordpressApi().getPost(
//   route.params.id
// );
// const post = article.value[0];

const { data: posts } = await useWordpressApi().getBlog();

const myPosts = ref(posts);

</script>