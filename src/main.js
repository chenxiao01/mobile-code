import Vue from 'vue'
import MintUI from 'mint-ui';
import App from './App';
import router from './router';

Vue.use(MintUI);
// Vue.prototype.$Recorder = Recorder;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})