<template>
  <el-table :data="rows" border stripe style="width: 100%">
    <el-table-column v-for="c in columns" :key="c.name" :prop="c.name" :label="c.label"></el-table-column>
  </el-table>
</template>
<script>
export default {
  props: { columns: { default: [] }, rows: { default: [] } }
}
</script>