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
        type: 'BO'
    },
    created: async function () {
        this.teamsList = (await axios.get('/teams.json')).data;
    },
    methods:{
        updateScore: function(event, type){
            this.score[type] = +event.target.innerText;
        },
        updateType: function(event){
            this.type = event.target.innerText;
        },
        saveMatch: async function () {
            const url = (this.id)? '/saveMatch'  :'/createMatch';
            try {
                const res = await axios.post(url, {
                    id: this.id,
                    teams: this.teams,
                    score: this.score,
                    type: this.type
                });
                alert('Матч сохранен!');
                res.data.redirect?  window.location = res.data.redirect : null
            } catch (e) {
                alert('Ошибка!');
                console.log('ERROR', e)
            }
        }
    }
});
