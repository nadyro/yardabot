import {OrderHandler} from "./order.class";

export const orderHandler = async function (order: string) {
    return new Promise<any>((resolve, reject) => {
        const oh = new OrderHandler();
        switch (order) {
            case ('!gc'):
                resolve(oh.getChampions(5));
                break;
            case('!gc10'):
                resolve(oh.getChampions(10));
                break;
            case('!gc top'):
                resolve(oh.getChampions(1, 'top'));
                break;
            case('!gc jungle'):
                resolve(oh.getChampions(1, 'jungle'));
                break;
            case('!gc mid'):
                resolve(oh.getChampions(1, 'mid'));
                break;
            case('!gc adc'):
                resolve(oh.getChampions(1, 'adc'));
                break;
            case('!gc supp'):
                resolve(oh.getChampions(1, 'supp'));
        }
        reject('null');
    });
}