import Vue from 'vue';
import Cloudinary, { CldImage,CldTransformation,CldContext }  from 'cloudinary-vue';

Vue.use(Cloudinary, {
    configuration: { cloudName: 'www-r2diesel-com' },
    components: [ CldImage,CldTransformation,CldContext ]
})
