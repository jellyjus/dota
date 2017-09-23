Vue.component('v-select', VueSelect.VueSelect);

const app = new Vue({
    el: '#app',
    data: {
        team0Select: false,
        team1Select: false,
        teamsList: null,
        team1: null,
        score: [],
        teams: [null, null]
    },
    created: async function () {
        this.teamsList = (await axios.get('/teams.json')).data;
    },
    methods:{
        update:function(event, type){
            console.log('score updated', type, event.data)
        },
    },
    watch: {
        teams: function (val) {
            console.log(val[0])
        }
    }
});
