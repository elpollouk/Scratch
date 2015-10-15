(function () {

	"use strict";

	var StartWorker = function (main, onmessage, onerror)	{

		var workerURL = URL.createObjectURL(new Blob(["(", main.toString(), ")(this);"], { type: "application/javascript" }));

		console.log(workerURL);
		var worker = new Worker(workerURL);
		worker.onmessage = onmessage || null;
		worker.onerror = onerror || null;

		URL.revokeObjectURL(workerURL);

		return worker;
	}


	var workerMain = function (global) {
		"use strict";

		global.postMessage("foo");
		global.onmessage = function (e) {
			console.log("Worker got message: " + e.data);
			throw new Error("Blah");
		};

		console.log("Worker started");
	}

	var w = StartWorker(workerMain, function (e) {
		console.log("Got message: " + e.data);
	}, function (e) {
		console.log("Error: " + e.message);
		console.log(e.filename + ":" + e.lineno);
	});

	setTimeout(function () {
		w.postMessage("bar");
	}, 0);

})();