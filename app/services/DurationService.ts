import * as moment from 'moment';
// "We got this number by [reason]."
const REASONS = [
    'having monkeys throw poo at a calendar',
    'interpreting whalesong in binary and translating it into a date',
    'converting background radiation shifts into binary',
    'calculating when bitcoins will hit $0',
    'making up a date on the spot',
    'writing dates on cards and going "pick a card, any card"',
    'asking passers-by for a date they liked',
    'rolling <a href="https://en.wikipedia.org/wiki/Zocchihedron">100-sided dice</a>',
    'measuring quantum leaps by firing the laser at some enriched uranium',
    'hiring a medium to foretell the future',
    'checking the zodiac, and it\'s looking bad for you right now',
    'writing dates on a field and seeing which one a cow dropped a pat on',
    'using a <a href="https://en.wikipedia.org/wiki/Hardware_random_number_generator">True Random Number Generator</a> to pick a date',
];


class DurationService {
    private getFutureTime() {
        var now = moment();
        now.add(random(10, 60), 'days')
        now.add(random(0, 86400), 'seconds');
        return now.format('MMM DD, HH:mm');
    }

    public getTime(): string {
        return this.getFutureTime();
    }

    public getReason(): string {
        return randomElement(REASONS);
    }
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let instance = new DurationService();

export { instance as DurationService };