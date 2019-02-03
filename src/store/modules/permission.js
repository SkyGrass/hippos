import {asyncRouterMap, constantRouterMap, routerMap} from '@/router'
import {getMenuByRole} from '@/api/menu'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

function generateAsyncRouter(routerMap, serverRouterMap) {
    serverRouterMap.forEach(function (item, index) {
        item.component = routerMap[item.component]
        if (item.children && item.children.length > 0) {
            generateAsyncRouter(routerMap, item.children)
        }
    })
    return serverRouterMap
}

function deleteChildrenMenuRedirectPro(menu) {
    menu.forEach(item => {
        item.children.forEach(child => {
            delete child.redirect
        })
    })

    return menu
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRouter(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const permission = {
    state: {
        routers: [],
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                const {roles} = data
                let accessedRouters = []
                getMenuByRole(roles).then(response => {

                    let {data} = response
                    data = deleteChildrenMenuRedirectPro(data)

                    let serverRouterMap = generateAsyncRouter(routerMap, data)
                    accessedRouters = [...filterAsyncRouter(serverRouterMap, roles), ...filterAsyncRouter(asyncRouterMap, roles)]

                    commit('SET_ROUTERS', accessedRouters)
                    resolve()
                }).catch(error => {
                    reject(error)
                })

                // let accessedRouters
                // if (roles.includes('admin')) {
                //   accessedRouters = asyncRouterMap
                // } else {
                //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
                // }
                // commit('SET_ROUTERS', accessedRouters)
                // resolve()
            })
        }
    }
}

export default permission
