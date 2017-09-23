Vue.component('v-select', VueSelect.VueSelect);

var app = new Vue({
    el: '#app',
    data: {
        team0Select: false,
        team1Select: false,
        teamsList: null,
        score: [],
        teams: [null, null],
        match: null
    },
    created: async function () {

        this.teamsList = (await axios.get('/teams.json')).data;
    },
    methods:{
        update:function(event, type){
            this.score[type] = +event.data;
        },
    },
    watch: {
        teams: function (val) {
            console.log(val[0])
        }
    }
});
