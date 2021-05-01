<template>
  <div class="home">
    <div style="max-height: 300px; max-width: 300px">
      <img style="max-width: 100%; max-height: 100%" :src="imgPreview" alt="">
    </div>
    <form @submit.prevent="saveImage()" method="post">
      <input type="file" @change="processFile($event)" />
      <button type="submit">subir imagen</button>
    </form>
    <div>
      <h1>
        Imágenes recientemente subidas
        <span style="font-size: 1rem; font-style: italic">
          Mostradas desde el componente de cloudinary
        </span>
      </h1>
      <div>
        <cld-context cloudName="katsudev">
          <cld-image 
            v-for="img in uploaded"
            :publicId="img.publicID"
            :key="img.publicID"
            width="300"
            height="200"
            crop="fit"
          />
        </cld-context>
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
        <img 
          style="width: 50%"
          src="https://res.cloudinary.com/katsudev/image/upload/v1619820530/Stardew_Valley_4_4_2021_6_46_56_p._m._j2ccn3.png" 
        />
      </h1>
    </div>
  </div>
</template>

<style lang="scss">
  .cld-image img{
    width: 50%;
  }
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return{ 
      CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/katsudev/image/upload",
      CLOUDINARY_UPLOAD_PRESET: "ub0fxdpi",
      CLOUDINARY_API_KEY: "832771279844432",
      CLOUDINARY_API_SECRET: "E90jXPytaCVOFNYGocR5BodX3XA",
      imagen: [],
      imgPreview: 'https://freepikpsd.com/wp-content/uploads/2019/10/no-image-available-icon-png-8-Transparent-Images.png',
      uploaded:
      [
        // {
          // publicID: '',
          // url: ''
        // },
      ] 
    }
  },
  methods: {
     processFile(event) {
      this.imagen = event.target.files[0];

      let reader = new FileReader();
      reader.onload = (event) => {
        this.imgPreview = event.target.result;
      }
      reader.readAsDataURL(this.imagen);
    },
    saveImage(){
      // Creatie signature
      // Doc: https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
      
      // Creating payload
      let formData = new FormData();
      formData.append("file", this.imagen);
      formData.append("api_key", this.CLOUDINARY_API_KEY);
      formData.append("upload_preset", this.CLOUDINARY_UPLOAD_PRESET);
      formData.append("timestamp", timestamp);

      // Subiendo imagen
      fetch(this.CLOUDINARY_URL, { method: "POST", body: formData })
        .then(response => response.json()) //convertimos la respuesta en json
        .then(data => {
          this.uploaded.push({publicID: data.public_id, url: data.url})
          console.log({data});
        })// obtenemos la url de la imagen guardada
        .catch(error => console.log("ocurrio un error " , error)); //capturamos un posible error
    }
  },
}
</script>
