<template>
  <div class="home">
    <div style="max-height: 300px; max-width: 300px">
      <img style="max-width: 100%; max-height: 100%" :src="imgPreview" alt="">
    </div>
    <form @submit.prevent="saveMultipleImages()" method="post">
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
            :publicId="img.publicId"
            :key="img.publicId"
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
          v-for="img in uploaded"
          style="width: 50%"
          :src="img.url" 
          :key="img.url"
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
import skaler from 'skaler';

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
      imgPreview: '',
      uploaded:
      [
        // {
          // publicId: '',
          // url: ''
        // },
      ] 
    }
  },
  methods: {
    // Showing Preview and getting image
    processFile(event) {
      this.imagen = event.target.files[0];

      let reader = new FileReader();

      reader.onload = (event) => {
        this.imgPreview = event.target.result;
      }

      reader.readAsDataURL(this.imagen);
    },
    async editImg(file, opts){
      return new Promise(async resolve => {
        const img = await skaler(file, opts);
        resolve({img});
      });
    },
    async saveImage(){
      // Creating payload
      let formData = new FormData();
      formData.append("file", this.imagen);
      formData.append("api_key", this.CLOUDINARY_API_KEY);
      formData.append("upload_preset", this.CLOUDINARY_UPLOAD_PRESET);

      // Upload image
      return new Promise(async (resolve, reject) => {
        try{
          await fetch(this.CLOUDINARY_URL, { method: "POST", body: formData })
                .then(response => response.json()) //convertimos la respuesta en json
                .then(data => {
                  resolve({publicId: data.public_id, url: data.url})
                })
                .catch(error => reject({error}));
        } catch(error){
          reject(error)
        }

      });
    },
    async saveMultipleImages(){
      const images = await Promise.all([
        this.editImg(this.imagen, {width: 200}),
        this.editImg(this.imagen, {width: 500}),
        this.editImg(this.imagen, {width: 900})
      ]);

      let imagesURL = [];

      for (const {img} of images){
        let saved = false;
        this.imagen = img;

        await this.saveImage().then(res=>{
          saved = true;
          imagesURL.push(res);
        }).catch(_=>{
          saved = false;
          imagesURL = [];
        });

        if(!saved){
          alert('Ocurrió un error. Vuelve a intentar');
          return 0;
        }
      }

      // Aqui se pueden subir los enlaces a la BD,
      // En este caso, guardaré los enlaces en la variable
      // que uso para mostrar las imagenes subidas
      if(imagesURL.length){
        this.uploaded = this.uploaded.concat(imagesURL);
        imagesURL = [];
        console.log({uploaded: this.uploaded, imagesURL});
      }
    }
  },
}
</script>
