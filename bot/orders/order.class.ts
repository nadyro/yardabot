import * as ax from 'axios'

const axios = ax.default;
const league = {
    apiUrl: 'https://euw1.api.riotgames.com',
    leagueSummonerUrl: '/lol/summoner/v4/summoners/by-name/',
    apiKey: 'RGAPI-c6cd3a59-d877-4f21-a0dc-485c4de86fca',
};
type reg = {
    bruiser: number,
    assassinMage: number,
    support: number,
    marksman: number
};
export class OrderHandler {
    private regularComp: reg = {
        bruiser: 2,
        assassinMage: 1,
        support: 1,
        marksman: 1
    };
    private isRegularComp = this.regularComp.bruiser + this.regularComp.assassinMage + this.regularComp.support + this.regularComp.marksman;
    private finalComp: any[] = [];

    constructor() {
    }

    private updateRegularCompInitialization(initNumber: number): reg {
        this.regularComp.bruiser *= initNumber;
        this.regularComp.assassinMage *= initNumber;
        this.regularComp.support *= initNumber;
        this.regularComp.marksman *= initNumber;
        return this.regularComp;
    }
    private updateRegularCompStatus(rc: reg): number {
        this.isRegularComp = rc.bruiser + rc.assassinMage + rc.support + rc.marksman;
        return this.isRegularComp;
    }

    private getRegularComp(champions: any[]): number {
        champions.forEach(champion => {
            if (this.regularComp.bruiser > 0 && ((champion.tags[0] === 'Tank' && champion.tags[1] === 'Fighter') || (champion.tags[0] === 'Fighter' && champion.tags[1] === 'Tank'))) {
                if (!this.finalComp.includes(champion)) {
                    this.finalComp.push(champion);
                    this.regularComp.bruiser--;
                }
                this.updateRegularCompStatus(this.regularComp);
            } else if (this.regularComp.support > 0 && (champion.tags[0] === 'Support')) {
                if (!this.finalComp.includes(champion)) {
                    this.finalComp.push(champion);
                    this.regularComp.support--;
                }
                this.updateRegularCompStatus(this.regularComp);
            } else if (this.regularComp.assassinMage > 0 && ((champion.tags[0] === 'Mage' || champion.tags[1] === 'Mage'))) {
                if (!this.finalComp.includes(champion)) {
                    this.finalComp.push(champion);
                    this.regularComp.assassinMage--;
                }
                this.updateRegularCompStatus(this.regularComp);
            } else if (this.regularComp.marksman > 0 && (champion.tags[0] === 'Marksman')) {
                if (!this.finalComp.includes(champion)) {
                    this.finalComp.push(champion);
                    this.regularComp.marksman--;
                }
                this.updateRegularCompStatus(this.regularComp);
            }
        });
        return this.isRegularComp;
    }

    private getChampionsByRole(role: string) {
        switch (role) {
            case ('adc'):
                this.regularComp.marksman = 1;
                break;
            case('mid'):
                this.regularComp.assassinMage = 1;
                break;
            case('supp'):
                this.regularComp.support = 1;
                break;
            case('top'):
                this.regularComp.bruiser = 1;
                break;
            case('jungle'):
                this.regularComp.bruiser = 1;
                break;
            default:
                break;
        }
    }
    public getChampions(maxChampions: number, role?: string): Promise<any> {
        let arrayIndexes = [];
        let arrayChampions = [];
        let i = 0;
        let turns = 0;
        if (role) {
            this.updateRegularCompInitialization(0);
            this.getChampionsByRole(role);
        }
        if (maxChampions === 10) {
            this.regularComp = this.updateRegularCompInitialization(2);
        }
        if (maxChampions > 0)
        return axios.get('http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json')
            .then(response => {
                const bulkData = response.data.data;
                const ObjectKeys = Object.keys(bulkData);
                while (1) {
                    i = 0;
                    while (i < maxChampions) {
                        let rdm = Math.floor(Math.random() * (ObjectKeys.length));
                        while (arrayIndexes.includes(rdm)) {
                            rdm = Math.floor(Math.random() * (ObjectKeys.length));
                        }
                        arrayIndexes.push(Math.floor(rdm));
                        i++;
                    }
                    i = 0;
                    while (i < arrayIndexes.length) {
                        arrayChampions.push(bulkData[ObjectKeys[arrayIndexes[i]]]);
                        i++;
                    }
                    if (this.getRegularComp(arrayChampions) === 0) {
                        break;
                    } else {
                        arrayIndexes = [];
                        arrayChampions = [];
                    }
                    turns++;

                    console.log('Turn :' + turns);
                }
                return this.finalComp;
            })
            .catch(error => {
                console.log(error);
            });
    }
}