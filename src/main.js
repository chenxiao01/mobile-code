import Vue from 'vue'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App';
import router from './router';
// import Recorder from './dep/recorder/recorder.js';

Vue.use(MintUI);
// Vue.prototype.$Recorder = Recorder;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})