const request = require('supertest');
const app = require('../src/server/server');

mockData = {
  latitude: 52.40451488171361,
  longitude: 4.891274330675293,
  temperature: 37.61,
  tripStartDate: '2020-03-01',
  tripEndDate: '2020-03-02',
  cityName: 'Amsterdam',
  pictureURL: 'https://pixabay.com/get/57e1d0434953a514f6da8c7dda79367b1738dde451506c48702779d49344c75bb0_640.jpg',
  country: 'NL'
};

describe('POST /addWeatherData', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/addWeatherData')
      .send(mockData)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body = mockData;
      })
      .expect(200, done)
  });
});

describe('GET /all', function() {
  it('responds with json and mockData', function(done) {
    request(app)
      .get('/all')
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body = mockData;
      })
      .expect(200, done)
  })
})