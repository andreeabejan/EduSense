const vader = require('vader-sentiment');

function analyzeSentiment(text) {
    const sentimentResult = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    return sentimentResult;
}

module.exports = function processFeedback(feedback) {
    const sentiment = analyzeSentiment(feedback);

    let sentimentAnalysis;
    if (sentiment.compound >= 0.05) {
        sentimentAnalysis = "positive";
    } else if (sentiment.compound <= -0.05) {
        sentimentAnalysis = "negative";
    } else {
        sentimentAnalysis = "neutral";
    }

    const result = {
        success: true,
        message: `Your feedback has been processed successfully. Sentiment: ${sentimentAnalysis}`,
        compound: sentiment.compound 
    };

    return result;
};
