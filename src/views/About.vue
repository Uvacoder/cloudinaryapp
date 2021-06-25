<template>
  <div class="about">
    <h1>This is an about page</h1>
    <img id="testing" alt="">
    <img id="testing2" alt="">
  </div>
</template>

<script>
  import logo from "@/assets/logo.png";
  import houseIcon from "@/assets/house.png";
  import resizeandsave from "@/assets/resizeandsave.js"

  export default {
    data(){
      return{
        img: '',
        imagesToUpload: [logo, houseIcon],
        api: {
          url: "https://api.cloudinary.com/v1_1/www-r2diesel-com/image/upload", 
          key: "428361364281799", 
          preset: "iwo6z8wd"
        },
      }
    },
    async mounted(){
      let processedImage = await resizeandsave.processFile('https://res.cloudinary.com/katsudev/image/upload/v1619820530/Stardew_Valley_4_4_2021_6_46_56_p._m._j2ccn3.png', 'testing');

      const uploading = (state, progress) => {
        console.log({state, progress});
      }

      console.warn(processedImage);

      await resizeandsave.saveMultipleImages(processedImage, this.api, uploading).then(res => {
        console.log(res);
      });
    }
  }
</script>