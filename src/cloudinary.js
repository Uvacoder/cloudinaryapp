import Vue from 'vue';
import Cloudinary, { CldImage,CldTransformation,CldContext }  from 'cloudinary-vue';

Vue.use(Cloudinary, {
    configuration: { cloudName: 'katsudev' },
    components: [ CldImage,CldTransformation,CldContext ]
})
