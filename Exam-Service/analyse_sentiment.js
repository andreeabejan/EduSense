const vader = require('vader-sentiment');

function analyzeSentiment(text) {
    const sentimentResult = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    return sentimentResult;
}

module.exports = analyzeSentiment;