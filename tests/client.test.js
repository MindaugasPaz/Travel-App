let tripDuration = require('./../src/client/js/script');

const tripStartDate = '2020/03/01';
const tripEndDate = '2020/03/20';

test('trip duration testing', () => {
    expect(tripDuration(tripStartDate, tripEndDate)).toBe(19);
})
