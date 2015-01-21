if(Meteor.isServer){
    if(Meteor.settings === undefined){
        throw new Meteor.Error("pass production.settings or sandbox.settings on the command line using --setings");
    }

    if(Meteor.settings.public.env1self === undefined){
        throw new Meteor.Error("specify the 1self environment by adding the env1self property under public in settings file");
    }
}

if (Meteor.isClient) {

    var config = {
        appId: "app-id-4f357d816aae322b7353b18226e8bee1",
        appSecret: "app-secret-14634e5b240c73c41a66ea01c6640b066b1878732424fb2b203b287bd8d55ac6",
        "appName": "co.1self.crackercounter",
        "appVersion": "0.0.1"
    };

    var lib1self = new Lib1self(config, Meteor.settings.public.env1self);
    

    Meteor.startup(function () {
        var isStreamRegistered = function () {
            return window.localStorage.streamId !== undefined;
        };

        var storeStreamDetails = function (stream) {
            window.localStorage.streamId = stream.streamid;
            window.localStorage.readToken = stream.readToken;
            window.localStorage.writeToken = stream.writeToken;
        };

        if (!isStreamRegistered()) {
            console.info("registering stream.");
            lib1self.registerStream(function (stream) {
                storeStreamDetails(stream);
            });
        }
    });
    
    
    Template.logging.events({
        'click #logActivity': function () {
            var cookieInput = $("input[name='cookie']");
            var cookieEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["num", "cookie"],
                "actionTags": ["eat"],
                 "properties": {
                    "num": parseInt(cookieInput.val())
                }
            };
            
            lib1self.sendEvent(cookieEvent, window.localStorage.streamId, window.localStorage.writeToken, function(){});
            cookieInput.val("");
            console.log("Event sent:");
            console.log(cookieEvent)
        }
    });
    
    Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });
    
    
    Template.selectVisualizations.events({
        'click #cookieViz': function () {
          console.log("in cookie viz")
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["num", "cookie"])
                .actionTags(["eat"])
                .sum("num")
                .barChart()
                .backgroundColor("84c341")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });

}


