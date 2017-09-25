Vue.component('v-select', VueSelect.VueSelect);

var app = new Vue({
    el: '#app',
    data: {
        id: null,
        teamSelect: [false, false],
        teamSelect0: false,
        teamsList: null,
        score: [],
        teams: [null, null],
        type: 'BO',
        options: []
    },
    created: async function () {
        //this.teamsList = (await axios.get('/teams.json')).data;
    },
    methods:{
        getTeams: async function(search, loading) {
            loading(true);
            this.teamsList = (await this.fetch(`https://api.opendota.com/api/explorer?sql=SELECT * FROM teams WHERE tag ~* '${search}'`)).rows;
            loading(false)
        },
        getOptions: async function (search, loading) {
            loading(true);
            this.options = await this.fetch(`https://api.github.com/search/repositories?q=${search}`);
            console.log(this.options);
            loading(false);

        },
        onTeamSelect: function(type, val) {
            console.log(type, val)
            this.teams[type] = val.name;
            this.teamSelect0 = false
        },
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
        },
        fetch: function (url) {
            return fetch(url).then(res => res.json())
        }
    }
});
