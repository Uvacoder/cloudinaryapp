<template>
  <div class="home">
    <div style="max-height: 300px; max-width: 300px">
      <img id="imgPreview" style="max-width: 100%; max-height: 100%" alt="">
    </div>
    <form @submit.prevent="saveMultipleImages()" method="post">
      <input type="file" @change="processFile($event)" />
      <button type="submit">subir imagen en varias calidades</button>
      <button @click.prevent="saveSingleImage()">subir imagen original</button>
    </form>


    <!-- Progress Bar -->
    <div class="progress-bar" v-if="uploading.state || uploading.state == 'done'">
      <div class="progress-bar--container">
        <div 
          class="progress-bar--bar" 
          :style="{width: uploading.uploadProgress + '%', background: uploading.state == 'done'? 'green':'blue'}"
        >
        </div>
        <span class="progress-bar--progressIndicator">
          {{uploading.uploadProgress}}%
        </span>
      </div>
      Progress bar
    </div>

    <div>
      <h1>
        Imágenes recientemente subidas
        <span style="font-size: 1rem; font-style: italic">
          Mostradas desde el componente de cloudinary
        </span>
      </h1>
      <div>
      </div>
    </div>
    <hr>
    <br>
    <div>
      <h1>
        Imágenes recientemente subidas
        <span style="font-size: 1rem; font-style: italic">
          Mostradas desde img con la url en el src
        </span>
        <div :key="img.url" v-for="img in uploaded">
          <img
            style="max-width: 50%; text-align:center; margin-top: 2rem"
            :src="img.url" 
          />
          <br>
          {{img.secure_url}}
        </div>
      </h1>
    </div>
  </div>
</template>

<style lang="scss">
  .cld-image img{
    width: 50%;
  }

  .progress-bar{
    &--container{
      border: 1px solid black;
      text-align: center;
      border-radius: 10px;
      overflow: hidden;
      height: 15px;
      position: relative;
    }

    &--bar{
      transition-timing-function: ease-in-out;
      transition-property: width background-color;
      transition-duration: 1s;
      height: inherit;
    }

    &--progressIndicator{
      background: inherit;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
  }
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import resizeandsave from '@/assets/resizeandsave.js';

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return{ 
      api: {
        url: "https://api.cloudinary.com/v1_1/www-r2diesel-com/image/upload", 
        key: "428361364281799", 
        preset: "iwo6z8wd"
      },
      imagen: [],
      uploaded: [],
      uploading: {
        uploadProgress: 0,
        state: false // True, false, done
      }
    }
  },
  methods: {
    // Showing Preview and getting image
    processFile(event) {
      this.imagen = resizeandsave.processFile(event, "imgPreview");
    },
    // Uploading a single image with the library
    async saveSingleImage(){
      await resizeandsave.saveImage(this.imagen, this.api).then(res => {
        this.uploaded = this.uploaded.concat(res);
      }).catch(e => {
        console.log(e);
      });
    },
    // Uploading a image in multiple resolutions with the library
    async saveMultipleImages(){
      const uploading = (state, num) => {
        this.uploading.state = state;
        this.uploading.uploadProgress = num;
      }

      await resizeandsave.saveMultipleImages(this.imagen, this.api, uploading)
        .then(res => {
          this.uploaded = this.uploaded.concat(res);
        }).catch(e => {
          console.log(e)
        })
    }
  },
}
</script>
