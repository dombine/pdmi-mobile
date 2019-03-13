import Vue from 'vue'
import Router from 'vue-router'

import Product from '../components/product/Product.vue'
import NewText from '../components/create/NewText.vue'
import NewImg from '../components/create/NewImg.vue'
import NewVideo from '../components/create/NewVideo.vue'
import ProductSearch from '../components/product/ProductSearch.vue'
import cgAudit from '../components/product/buttonOperation/cgAudit.vue'
import productMove from '../components/product/buttonOperation/productMove.vue'
import issuer from '../components/product/buttonOperation/issuer.vue'
import textDetail from '../components/detail/TextDetail.vue'
import imageDetail from '../components/detail/ImageDetail.vue'
import videoDetail from '../components/detail/VideoDetail.vue'
import editAttrs from '../components/product/buttonOperation/EditAttrs.vue'
import audit from '../components/detail/audit.vue'
import turnAudit from '../components/detail/turnAudit.vue'

//以下方式为懒加载
/*const Product = r => require.ensure([], () => r(require('../components/product/Product.vue')), 'Product');
const NewText = r => require.ensure([], () => r(require('../components/create/NewText.vue')), 'NewText');
const NewImg = r => require.ensure([], () => r(require('../components/create/NewImg.vue')), 'NewImg');
const NewVideo = r => require.ensure([], () => r(require('../components/create/NewVideo.vue')), 'NewVideo');
const ProductSearch = r => require.ensure([], () => r(require('../components/product/ProductSearch.vue')), 'ProductSearch');
const cgAudit = r => require.ensure([], () => r(require('../components/product/buttonOperation/cgAudit.vue')), 'cgAudit');
const productMove = r => require.ensure([], () => r(require('../components/product/buttonOperation/productMove.vue')), 'productMove');
const issuer = r => require.ensure([], () => r(require('../components/product/buttonOperation/issuer.vue')), 'issuer');
const textDetail = r => require.ensure([], () => r(require('../components/detail/TextDetail.vue')), 'textDetail');
const imageDetail = r => require.ensure([], () => r(require('../components/detail/ImageDetail.vue')), 'imageDetail');
const videoDetail = r => require.ensure([], () => r(require('../components/detail/VideoDetail.vue')), 'videoDetail');
const editAttrs = r => require.ensure([], () => r(require('../components/product/buttonOperation/EditAttrs.vue')), 'editAttrs');
const audit = r => require.ensure([], () => r(require('../components/detail/audit.vue')), 'audit');
const turnAudit = r => require.ensure([], () => r(require('../components/detail/turnAudit.vue')), 'turnAudit');*/

Vue.use(Router);
const router = new Router({
  mode: 'history',
  history: true, // use history=false when testing
  routes: [{
    path: '*',
    redirect: '/resourceMobile/product'
  },
    {
      path: '/resourceMobile/newvideo',
      name: 'NewVideo',
      component: NewVideo
    },
    {
      path: '/resourceMobile/newimg',
      name: 'NewImg',
      component: NewImg
    },
    {
      path: '/resourceMobile/newtext',
      name: 'NewText',
      component: NewText
    }, {
      path: '/resourceMobile/product',
      name: 'product',
      component: Product,
      meta: {keepAlive: true}
    }, {
      path: '/resourceMobile/search',
      name: 'ProductSearch',
      component: ProductSearch,
      meta: {keepAlive: true}
    }, {
      path: '/resourceMobile/audit4draft/:resourceID',
      name: 'audit4draft',
      component: cgAudit
    }, {
      path: '/resourceMobile/move/:resourceID/:organizationId',
      name: 'move',
      component: productMove
    }, {
      path: '/resourceMobile/issuer/:resourceID',
      name: 'issuer',
      component: issuer
    }, {
      path: '/resourceMobile/textDetail/:resourceID/:type',
      name: 'textDetail',
      component: textDetail
    }, {
      path: '/resourceMobile/imageDetail/:resourceID/:type',
      name: 'imageDetail',
      component: imageDetail
    }, {
      path: '/resourceMobile/videoDetail/:resourceID/:type',
      name: 'videoDetail',
      component: videoDetail
    }, {
      path: '/resourceMobile/edittext/:resourceID',
      name: 'EditText',
      component: NewText
    }, {
      path: '/resourceMobile/editAttrs/:resourceID',
      name: 'editAttrs',
      component: editAttrs
    }, {
      path: '/resourceMobile/audit/:resourceID',
      name: 'audit',
      component: audit
    }, {
      path: '/resourceMobile/turn_audit/:resourceID/:departmentId',
      name: 'turnAudit',
      component: turnAudit
    }
  ]
});

//在跳转之前记录滚动条的位置
router.beforeEach((to, from, next) => {
  from.meta.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  to.meta.prevPage = from.name;
  next();
});

window.router = router;

export default router
