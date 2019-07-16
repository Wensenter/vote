import Vue from 'vue';
import Router from 'vue-router';
import indexPage from '@/page/indexPage';
import rankPage from "@/page/rankPage";
import explainPage from "@/page/explainPage";
import homePage from "@/page/homePage";
import enrollPage from "@/page/enrollPage";
import partyInfoPage from "@/page/partyInfoPage";
import offlinePage from "@/page/offlinePage";
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'indexPage',
      component: indexPage,
      redirect:'/homePage',
      children: [
        {
          path: '/rankPage',
          name: 'rankPage',
          component: rankPage
        },
        {
          path: '/explainPage',
          name: 'explainPage',
          component: explainPage
        },
        {
          path: '/homePage',
          name: 'homePage',
          component: homePage
        },
      ]
    },
    {
      path: '/partyInfoPage',
      name: 'partyInfoPage',
      component: partyInfoPage
    },
    {
      path: '/enrollPage',
      name: 'enrollPage',
      component: enrollPage
    },
    {
      path:'/offlinePage',
      name:'offlinePage',
      component:offlinePage
    }
  ]
})
