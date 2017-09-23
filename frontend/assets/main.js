Vue.component('v-select', VueSelect.VueSelect);

var app = new Vue({
    el: '#app',
    data: {
        id: null,
        team0Select: false,
        team1Select: false,
        teamsList: null,
        score: [],
        teams: [null, null],
        type: null
    },
    created: async function () {
        this.teamsList = (await axios.get('/teams.json')).data;
    },
    methods:{
        updateScore: function(event, type){
            this.score[type] = +event.data;
        },
        updateType: function(event){
            this.type = event.target.innerText;
        },
        saveMatch: function () {
            axios.post('/saveMatch', {
                id: this.id,
                teams: this.teams,
                score: this.score,
                type: this.type
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
});
