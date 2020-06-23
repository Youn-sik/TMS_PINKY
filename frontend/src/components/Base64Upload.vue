<template>
<div class="base64-upload" style="text-align: center;">
  <img
    v-if="!imageSrc"
    src="../assets/imageDefault.jpg"
    style="padding:10px 0px;"/>
  <img 
    v-else
    :src="imageSrc.indexOf('172.16.135.89') >= 0 ? imageSrc : 'data:image/jpeg;base64,'+imageSrc"
    style="padding:10px 0px;"/>
  <input type="file"
    accept="image/*"
    @change="onChange" />
</div>
</template>

<script>
export default {
  props: {
    imageStyle: Object,
    imageSrc : String,
  },
  methods: {
    onChange(event) {
      if (event.target.files && event.target.files[0]) {
        let file = event.target.files[0]
        let reader = new FileReader()
        reader.addEventListener('load', e => {
          this.src = e.target.result
          let [, base64] = this.src.split(',')
          this.$emit('change', {
            size: file.size,
            type: file.type,
            name: file.name,
            base64: base64
          })
        })
        reader.readAsDataURL(file)
      }
    }
  },
}
</script>

<style scoped>
.base64-upload {
  border : 2px solid #2196F3;
  width: 100%;
  position: relative;
}
img {
  width: 50%;
  height: 50%;
}
input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>
