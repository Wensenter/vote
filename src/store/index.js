import vue from "vue";
import vuex from "vuex";

vue.use(vuex)
const store = {
    state: {
        showHttpLoading: false,
        showVoteSuccess: false,
        showEnrollSuccess: false,
        VoteSuccessUrl: '',
    },
    mutations:{
        UPDATE_SHOW_HTTP_LOADING(state,flag){
            state.showHttpLoading = flag
        },
        UPDATE_SHOW_VOTE_SUCCESS(state,flag){
            state.showVoteSuccess = flag
        },
        UPDATE_VOTE_SUCCESS_URL(state,url){
            state.VoteSuccessUrl = url
        },
        UPDATE_SHOW_ENROLL_SUCCESS(state, flag) {
            state.showEnrollSuccess = flag
        }
    }
}

const stores = new vuex.Store(store)
export default stores;