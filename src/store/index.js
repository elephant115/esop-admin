import { createStore } from 'vuex'
// import { createObjectProperty } from '_@vue_compiler-core@3.2.41@@vue/compiler-core'
import createPersistedstate from 'vuex-persistedstate'
import getters from './getters.js'

import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
export default createStore({
  getters,
  modules: {
    app,
    permission,
    user
  },
  plugins: [
    createPersistedstate({
      key: 'vuex-Storage',
      paths: ['app', 'permission', 'user']
    })
  ]
})
