(function() {
    "use strict";
    
    const http = require("http");
    const fs = require("fs");
    const path = require("path");
    const cheerio = require("cheerio");
    const request = require("request");

    const YEP_EXTENSION_URL = "http://yanfly.moe/plugins/en/";

    var downloadTask = function(extensionUrl, dirName) {
        var stream = fs.createWriteStream(dirName + "/" + extensionUrl[0]);
        request(extensionUrl[1]).pipe(stream).on('close', function() {
            console.log("download " + extensionUrl + " successed!");
        }); 
    };

    var createDownloadList = function(url, callback) {
        //TD
        http.get(YEP_EXTENSION_URL, function(res) {
            let html = "";
            let titles = [];
            res.setEncoding("utf-8");

            res.on("data", function(chunk) {
                html += chunk;
            });

            res.on("end", function() {
                let $ = cheerio.load(html);
                let aTagList = $("a");
                let extensionList = new Array();
                aTagList.map(function(key, value) {
                    if ( value.attribs.href.lastIndexOf(".js") != -1 ) {
                        extensionList.push([value.attribs.href, YEP_EXTENSION_URL + value.attribs.href]);
                    }
                });
                if (callback != null) {
                    callback(extensionList);
                }
            });
        });
    };

    var createDownloadTaskList = function(extensionList) {
        //TD
        let count = 0;
        extensionList.map(function(value) {
            setTimeout(function() {
                downloadTask(value,"extensions");
            }, 500*count);
            count++;
        });
    };

    var start = function (url, dirName) {
        //TD
        createDownloadList(url, createDownloadTaskList);
    };

    start();
})();