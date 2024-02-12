const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentWeather: {
        type: Object,
        required: true
    },
    cityInfo: {
        type: Object,
        required: true
    },
    forecast16Days: {
        type: Object,
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

// const Forecast = mongoose.model('Forecast', ForecastSchema);
exports.Forecast = mongoose.model('Forecast', ForecastSchema);
// module.exports = Forecast;
