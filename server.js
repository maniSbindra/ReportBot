var restify = require('restify');
var builder = require('botbuilder');


// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: process.env.APP_ID, appSecret: process.env.APP_SECRET });


var dialog = new builder.LuisDialog(process.env.LUIS_URL    );
bot.add('/', dialog);

dialog.on('ShowReportTypes', [
    function (session, args) {
       
        builder.Prompts.text(session, "You can generate the following reports : 1,2,3"); //values to be read from JSON and shown
       
    }
]);

dialog.on('Greeting', [
    function (session, args) {
       
        builder.Prompts.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports"); //values to be read from JSON and shown
       
    }
]);

dialog.on('GenerateReport', [
    function (session, args) {
       
        var reportType = builder.EntityRecognizer.findEntity(args.entities, 'ReportType');
        if (!reportType) {
            builder.Prompts.text(session, "Could not Identify which report you want to generate");
        } else {
            // next({ response: task.entity });
            builder.Prompts.text(session, "Do you want to generate the " + reportType.entity + " report");
        }
        
       
    }
]);

dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});