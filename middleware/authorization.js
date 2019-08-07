export default function ({ route, store, redirect, app }) {

    if (!route.meta[0].noAuthRequired && store.getters.isExpired) {
        store.commit('destroyToken');
    }

    if (!route.meta[0].noAuthRequired && !store.state.token) {
        redirect({ path: '/login'});
        return;
    }
    
    if(route.name === "index"){
        redirect({ path: '/areas'});
    }
}
