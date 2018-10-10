import Vue from 'vue'
import Router from 'vue-router'
import News from '@/components/NewsList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'news',
      component: News
    }
  ]
})
