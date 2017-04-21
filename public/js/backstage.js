/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "da5cd7eb75d8d78cc710"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(50)(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(4);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	if (typeof execScript !== "undefined")
		execScript(src);
	else
		eval.call(null, src);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(9))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(5);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.1.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2016-09-22T22:30Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			resolve.call( undefined, value );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.call( undefined, value );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

function manipulationTarget( elem, content ) {
	if ( jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE <=9 only
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val,
		valueIsBorderBox = true,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Support: IE <=11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	if ( elem.getClientRects().length ) {
		val = elem.getBoundingClientRect()[ name ];
	}

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function raf() {
	if ( timerId ) {
		window.requestAnimationFrame( raf );
		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off or if document is hidden
	if ( jQuery.fx.off || document.hidden ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.requestAnimationFrame ?
			window.requestAnimationFrame( raf ) :
			window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	if ( window.cancelAnimationFrame ) {
		window.cancelAnimationFrame( timerId );
	} else {
		window.clearInterval( timerId );
	}

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( jQuery.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win, rect, doc,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		// Make sure element is not hidden (display: none)
		if ( rect.width || rect.height ) {
			doc = elem.ownerDocument;
			win = getWindow( doc );
			docElem = doc.documentElement;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		}

		// Return zeros for disconnected and hidden elements (gh-2310)
		return rect;
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.parseJSON = JSON.parse;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}





return jQuery;
} );


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress\n * @license MIT */\n\n;(function (root, factory) {\n\n  if (typeof define === 'function' && define.amd) {\n    define(factory);\n  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {\n    module.exports = factory();\n  } else {\n    root.NProgress = factory();\n  }\n})(this, function () {\n  var NProgress = {};\n\n  NProgress.version = '0.2.0';\n\n  var Settings = NProgress.settings = {\n    minimum: 0.08,\n    easing: 'linear',\n    positionUsing: '',\n    speed: 200,\n    trickle: true,\n    trickleSpeed: 200,\n    showSpinner: true,\n    barSelector: '[role=\"bar\"]',\n    spinnerSelector: '[role=\"spinner\"]',\n    parent: 'body',\n    template: '<div class=\"bar\" role=\"bar\"><div class=\"peg\"></div></div><div class=\"spinner\" role=\"spinner\"><div class=\"spinner-icon\"></div></div>'\n  };\n\n  /**\n   * Updates configuration.\n   *\n   *     NProgress.configure({\n   *       minimum: 0.1\n   *     });\n   */\n  NProgress.configure = function (options) {\n    var key, value;\n    for (key in options) {\n      value = options[key];\n      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;\n    }\n\n    return this;\n  };\n\n  /**\n   * Last number.\n   */\n\n  NProgress.status = null;\n\n  /**\n   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.\n   *\n   *     NProgress.set(0.4);\n   *     NProgress.set(1.0);\n   */\n\n  NProgress.set = function (n) {\n    var started = NProgress.isStarted();\n\n    n = clamp(n, Settings.minimum, 1);\n    NProgress.status = n === 1 ? null : n;\n\n    var progress = NProgress.render(!started),\n        bar = progress.querySelector(Settings.barSelector),\n        speed = Settings.speed,\n        ease = Settings.easing;\n\n    progress.offsetWidth; /* Repaint */\n\n    queue(function (next) {\n      // Set positionUsing if it hasn't already been set\n      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();\n\n      // Add transition\n      css(bar, barPositionCSS(n, speed, ease));\n\n      if (n === 1) {\n        // Fade out\n        css(progress, {\n          transition: 'none',\n          opacity: 1\n        });\n        progress.offsetWidth; /* Repaint */\n\n        setTimeout(function () {\n          css(progress, {\n            transition: 'all ' + speed + 'ms linear',\n            opacity: 0\n          });\n          setTimeout(function () {\n            NProgress.remove();\n            next();\n          }, speed);\n        }, speed);\n      } else {\n        setTimeout(next, speed);\n      }\n    });\n\n    return this;\n  };\n\n  NProgress.isStarted = function () {\n    return typeof NProgress.status === 'number';\n  };\n\n  /**\n   * Shows the progress bar.\n   * This is the same as setting the status to 0%, except that it doesn't go backwards.\n   *\n   *     NProgress.start();\n   *\n   */\n  NProgress.start = function () {\n    if (!NProgress.status) NProgress.set(0);\n\n    var work = function work() {\n      setTimeout(function () {\n        if (!NProgress.status) return;\n        NProgress.trickle();\n        work();\n      }, Settings.trickleSpeed);\n    };\n\n    if (Settings.trickle) work();\n\n    return this;\n  };\n\n  /**\n   * Hides the progress bar.\n   * This is the *sort of* the same as setting the status to 100%, with the\n   * difference being `done()` makes some placebo effect of some realistic motion.\n   *\n   *     NProgress.done();\n   *\n   * If `true` is passed, it will show the progress bar even if its hidden.\n   *\n   *     NProgress.done(true);\n   */\n\n  NProgress.done = function (force) {\n    if (!force && !NProgress.status) return this;\n\n    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);\n  };\n\n  /**\n   * Increments by a random amount.\n   */\n\n  NProgress.inc = function (amount) {\n    var n = NProgress.status;\n\n    if (!n) {\n      return NProgress.start();\n    } else if (n > 1) {\n      return;\n    } else {\n      if (typeof amount !== 'number') {\n        if (n >= 0 && n < 0.2) {\n          amount = 0.1;\n        } else if (n >= 0.2 && n < 0.5) {\n          amount = 0.04;\n        } else if (n >= 0.5 && n < 0.8) {\n          amount = 0.02;\n        } else if (n >= 0.8 && n < 0.99) {\n          amount = 0.005;\n        } else {\n          amount = 0;\n        }\n      }\n\n      n = clamp(n + amount, 0, 0.994);\n      return NProgress.set(n);\n    }\n  };\n\n  NProgress.trickle = function () {\n    return NProgress.inc();\n  };\n\n  /**\n   * Waits for all supplied jQuery promises and\n   * increases the progress as the promises resolve.\n   *\n   * @param $promise jQUery Promise\n   */\n  (function () {\n    var initial = 0,\n        current = 0;\n\n    NProgress.promise = function ($promise) {\n      if (!$promise || $promise.state() === \"resolved\") {\n        return this;\n      }\n\n      if (current === 0) {\n        NProgress.start();\n      }\n\n      initial++;\n      current++;\n\n      $promise.always(function () {\n        current--;\n        if (current === 0) {\n          initial = 0;\n          NProgress.done();\n        } else {\n          NProgress.set((initial - current) / initial);\n        }\n      });\n\n      return this;\n    };\n  })();\n\n  /**\n   * (Internal) renders the progress bar markup based on the `template`\n   * setting.\n   */\n\n  NProgress.render = function (fromStart) {\n    if (NProgress.isRendered()) return document.getElementById('nprogress');\n\n    addClass(document.documentElement, 'nprogress-busy');\n\n    var progress = document.createElement('div');\n    progress.id = 'nprogress';\n    progress.innerHTML = Settings.template;\n\n    var bar = progress.querySelector(Settings.barSelector),\n        perc = fromStart ? '-100' : toBarPerc(NProgress.status || 0),\n        parent = document.querySelector(Settings.parent),\n        spinner;\n\n    css(bar, {\n      transition: 'all 0 linear',\n      transform: 'translate3d(' + perc + '%,0,0)'\n    });\n\n    if (!Settings.showSpinner) {\n      spinner = progress.querySelector(Settings.spinnerSelector);\n      spinner && removeElement(spinner);\n    }\n\n    if (parent != document.body) {\n      addClass(parent, 'nprogress-custom-parent');\n    }\n\n    parent.appendChild(progress);\n    return progress;\n  };\n\n  /**\n   * Removes the element. Opposite of render().\n   */\n\n  NProgress.remove = function () {\n    removeClass(document.documentElement, 'nprogress-busy');\n    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');\n    var progress = document.getElementById('nprogress');\n    progress && removeElement(progress);\n  };\n\n  /**\n   * Checks if the progress bar is rendered.\n   */\n\n  NProgress.isRendered = function () {\n    return !!document.getElementById('nprogress');\n  };\n\n  /**\n   * Determine which positioning CSS rule to use.\n   */\n\n  NProgress.getPositioningCSS = function () {\n    // Sniff on document.body.style\n    var bodyStyle = document.body.style;\n\n    // Sniff prefixes\n    var vendorPrefix = 'WebkitTransform' in bodyStyle ? 'Webkit' : 'MozTransform' in bodyStyle ? 'Moz' : 'msTransform' in bodyStyle ? 'ms' : 'OTransform' in bodyStyle ? 'O' : '';\n\n    if (vendorPrefix + 'Perspective' in bodyStyle) {\n      // Modern browsers with 3D support, e.g. Webkit, IE10\n      return 'translate3d';\n    } else if (vendorPrefix + 'Transform' in bodyStyle) {\n      // Browsers without 3D support, e.g. IE9\n      return 'translate';\n    } else {\n      // Browsers without translate() support, e.g. IE7-8\n      return 'margin';\n    }\n  };\n\n  /**\n   * Helpers\n   */\n\n  function clamp(n, min, max) {\n    if (n < min) return min;\n    if (n > max) return max;\n    return n;\n  }\n\n  /**\n   * (Internal) converts a percentage (`0..1`) to a bar translateX\n   * percentage (`-100%..0%`).\n   */\n\n  function toBarPerc(n) {\n    return (-1 + n) * 100;\n  }\n\n  /**\n   * (Internal) returns the correct CSS for changing the bar's\n   * position given an n percentage, and speed and ease from Settings\n   */\n\n  function barPositionCSS(n, speed, ease) {\n    var barCSS;\n\n    if (Settings.positionUsing === 'translate3d') {\n      barCSS = { transform: 'translate3d(' + toBarPerc(n) + '%,0,0)' };\n    } else if (Settings.positionUsing === 'translate') {\n      barCSS = { transform: 'translate(' + toBarPerc(n) + '%,0)' };\n    } else {\n      barCSS = { 'margin-left': toBarPerc(n) + '%' };\n    }\n\n    barCSS.transition = 'all ' + speed + 'ms ' + ease;\n\n    return barCSS;\n  }\n\n  /**\n   * (Internal) Queues a function to be executed.\n   */\n\n  var queue = function () {\n    var pending = [];\n\n    function next() {\n      var fn = pending.shift();\n      if (fn) {\n        fn(next);\n      }\n    }\n\n    return function (fn) {\n      pending.push(fn);\n      if (pending.length == 1) next();\n    };\n  }();\n\n  /**\n   * (Internal) Applies css properties to an element, similar to the jQuery\n   * css method.\n   *\n   * While this helper does assist with vendor prefixed property names, it\n   * does not perform any manipulation of values prior to setting styles.\n   */\n\n  var css = function () {\n    var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],\n        cssProps = {};\n\n    function camelCase(string) {\n      return string.replace(/^-ms-/, 'ms-').replace(/-([\\da-z])/gi, function (match, letter) {\n        return letter.toUpperCase();\n      });\n    }\n\n    function getVendorProp(name) {\n      var style = document.body.style;\n      if (name in style) return name;\n\n      var i = cssPrefixes.length,\n          capName = name.charAt(0).toUpperCase() + name.slice(1),\n          vendorName;\n      while (i--) {\n        vendorName = cssPrefixes[i] + capName;\n        if (vendorName in style) return vendorName;\n      }\n\n      return name;\n    }\n\n    function getStyleProp(name) {\n      name = camelCase(name);\n      return cssProps[name] || (cssProps[name] = getVendorProp(name));\n    }\n\n    function applyCss(element, prop, value) {\n      prop = getStyleProp(prop);\n      element.style[prop] = value;\n    }\n\n    return function (element, properties) {\n      var args = arguments,\n          prop,\n          value;\n\n      if (args.length == 2) {\n        for (prop in properties) {\n          value = properties[prop];\n          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);\n        }\n      } else {\n        applyCss(element, args[1], args[2]);\n      }\n    };\n  }();\n\n  /**\n   * (Internal) Determines if an element or space separated list of class names contains a class name.\n   */\n\n  function hasClass(element, name) {\n    var list = typeof element == 'string' ? element : classList(element);\n    return list.indexOf(' ' + name + ' ') >= 0;\n  }\n\n  /**\n   * (Internal) Adds a class to an element.\n   */\n\n  function addClass(element, name) {\n    var oldList = classList(element),\n        newList = oldList + name;\n\n    if (hasClass(oldList, name)) return;\n\n    // Trim the opening space.\n    element.className = newList.substring(1);\n  }\n\n  /**\n   * (Internal) Removes a class from an element.\n   */\n\n  function removeClass(element, name) {\n    var oldList = classList(element),\n        newList;\n\n    if (!hasClass(element, name)) return;\n\n    // Replace the class name.\n    newList = oldList.replace(' ' + name + ' ', ' ');\n\n    // Trim the opening and closing spaces.\n    element.className = newList.substring(1, newList.length - 1);\n  }\n\n  /**\n   * (Internal) Gets a space separated list of the class names on the element.\n   * The list is wrapped with a single space on each end to facilitate finding\n   * matches within the list.\n   */\n\n  function classList(element) {\n    return (' ' + (element && element.className || '') + ' ').replace(/\\s+/gi, ' ');\n  }\n\n  /**\n   * (Internal) Removes an element from the DOM.\n   */\n\n  function removeElement(element) {\n    element && element.parentNode && element.parentNode.removeChild(element);\n  }\n\n  return NProgress;\n});"

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(15))

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "*{\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nhtml,body {\r\n    height: 100%;\r\n    background-color: #4C3B2F;\r\n}\r\n\r\nul,ol,dl,dd,dt,li {\r\n    list-style: none;\r\n}\r\n\r\n.col-md-2 {\r\n    padding-left: 0;\r\n}\r\n\r\na,a:hover {\r\n    text-decoration: none;\r\n}\r\n\r\na,a:link,a:active,a:hover,a:visited {\r\n    text-decoration: none;\r\n}\r\n\r\n.page {\r\n    width: 100%;\r\n}\r\n\r\n/*侧边栏开始*/\r\n.nav-side {\r\n    width: 16.5%;\r\n    height: 100%;\r\n    min-height: 100%;\r\n    position: absolute;\r\n    background-color: #4C3B2F;\r\n}\r\n\r\n.nav-side-header {\r\n    color: #fff;\r\n    padding-top: 40px;\r\n    background-color: #F1AC59;\r\n}\r\n\r\n.nav-side-header .author {\r\n    font-size: 18px;\r\n}\r\n\r\n.nav-side-header .explain {\r\n    font-size: 12px;\r\n    position: relative;\r\n    top: -10px;\r\n}\r\n\r\n/*一级菜单*/\r\n.side-first-level {\r\n    background: #4C3B2F;\r\n    /*防止一级菜单超出body高度后出现空白*/\r\n}\r\n\r\n.side-first-level a {\r\n    color: #fff;\r\n    display: block;\r\n    font-size: 16px;\r\n    position: relative;\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n    padding-left: 15%;\r\n    /*增加侧边栏的凹凸感*/\r\n    border-left: 1px #4C3B2F solid; \r\n}\r\n\r\n.side-first-level a:hover {\r\n    color: #F1AC59;\r\n    border-left: 0; \r\n    background-color: #37281E;\r\n}\r\n\r\n.side-first-level-active {\r\n    border-left: 3px #F1AC59 solid; \r\n    background-color: #37281E;\r\n}\r\n\r\n.side-first-level-active a span{\r\n    color: #F1AC59;\r\n}\r\n\r\n\r\n/*进度条*/\r\n#nprogress .bar {\r\n    background: #29d;\r\n    position: fixed;\r\n    z-index: 1031;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 2px;\r\n}\r\n\r\n.first-top {\r\n    margin-top: -9px;\r\n}\r\n\r\n.top-offset-4 {\r\n    margin-top: 4px\r\n}\r\n\r\n.top-offset-8 {\r\n    margin-top: 8px\r\n}\r\n\r\n/*下拉图标*/\r\n.side-first-level .drop-image {\r\n    width:0; \r\n    height:0; \r\n    border:5px solid; \r\n    border-color:#ccc #4C3B2F #4C3B2F #4C3B2F;\r\n    position: absolute;\r\n    top: 18px;\r\n    right: 5%;\r\n}\r\n\r\n/*side-first-level-active状态下的下拉图标*/\r\n.side-first-level a:hover .drop-image,.side-first-level-active .drop-image {\r\n    border-color:#ccc #37281E #37281E #37281E;\r\n}\r\n\r\n/*二级菜单*/\r\n.side-first-level .side-second-level {\r\n    display: none;\r\n}\r\n.side-first-level .side-second-level li a {\r\n    font-size: 14px;\r\n    padding-left: 35%;\r\n}\r\n\r\n.side-first-level .side-second-level-active {\r\n    color: #F1AC59;\r\n}\r\n\r\n/*侧边栏图标*/\r\n.nav-icon {\r\n    display: inline-block;    \r\n    width: 20px;\r\n    height: 15px;\r\n    position: relative;\r\n    top: 2px;\r\n}\r\n\r\n/*首页*/\r\n.nav-home-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -146px;\r\n}\r\n\r\n/*目录管理*/\r\n.nav-catalog-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -217px;\r\n}\r\n\r\n/*文章管理*/\r\n.nav-article-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -433px;            \r\n}\r\n\r\n/*相册管理*/\r\n.nav-album-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -72px;\r\n}\r\n\r\n/*发布文章*/\r\n.nav-public-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 0;    \r\n}\r\n\r\n/*评论管理*/\r\n.nav-comment-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -648px;        \r\n}\r\n\r\n/*帐号管理*/\r\n.nav-accounts-icon {\r\n    background: url(/img/icons.jpg) no-repeat 0 -720px;            \r\n}\r\n/*侧边栏结束*/\r\n\r\n/*主体内容开始*/\r\n\r\n.right-page {\r\n    width: 83.5%;\r\n    height: 100%;\r\n    padding: 0 15px;\r\n    position: relative;\r\n    left: 16.5%;\r\n    min-height: 1200px;\r\n    background-color: #EDEEF2;\r\n}\r\n\r\n/*头部导航栏开始*/\r\n\r\n.nav-top a {\r\n    color: #999999;\r\n}\r\n\r\n.nav-top-icon {\r\n    width: 50px;\r\n    height: 60px;\r\n    line-height: 60px;\r\n    padding-left: 10px;\r\n    display: inline-block;\r\n}\r\n\r\n.navbar-top-body {\r\n    display: inline-block;\r\n    margin-right: 0px;\r\n    background-color: #fff;\r\n}\r\n\r\n.nav-top li a, .nav-top li a:link, .nav-top li a:hover {\r\n    background-color: #fff;\r\n}\r\n\r\n.nav-top .nav .open>a:focus, .nav .open>a:visited {\r\n    background-color: #fff;\r\n}\r\n\r\n.nav-top-bottom {\r\n    border-bottom: 1px EDEEF2 solid\r\n}\r\n\r\n/*头部导航栏结束*/\r\n\r\n\r\n/*首页统计表开始*/\r\n.statistical {\r\n    min-height: 100px;\r\n    margin-bottom: 20px;\r\n    font-size: 16px;\r\n    position: relative;\r\n}\r\n\r\n.statistical-list {\r\n    width: 100%;\r\n    min-height: 100px;\r\n    background: #fff;\r\n}\r\n\r\n.statistical-list-header {\r\n    padding-left: 30px;\r\n    padding-top: 10px;\r\n    padding-bottom: 8px;\r\n    border-bottom: 2px #EDEEF2 solid;\r\n}\r\n\r\n.statistical-list-body {\r\n    padding-left: 30px;\r\n}\r\n/*首页统计表结束*/\r\n\r\n/*相册管理开始*/\r\n#album-page div a.thumbnail {\r\n    height: 200px;\r\n    display: table-cell;\r\n    vertical-align: middle;\r\n}\r\n\r\n/*发布文章开始*/\r\n#public-page {\r\n    overflow: hidden;\r\n    background-color: #fff;\r\n    margin: 0 auto;\r\n}\r\n\r\n\r\n#album-page {\r\n    background-color: #fff;\r\n    height: 800px;\r\n}\r\n\r\n/*帐号管理开始*/\r\n.accounts-page-title {\r\n    font-size: 16px;\r\n    font-weight: 700;\r\n    padding: 10px 25px;\r\n    border-bottom: 2px #EDEEF2 solid;\r\n}\r\n\r\n.accounts-page-body {\r\n    padding-top: 20px;\r\n}\r\n\r\n.accounts-page-body .explain {\r\n    padding-top: 2px;\r\n    color: #666;\r\n}\r\n\r\n\r\n/*公共样式开始*/\r\n.btn-add:link {\r\n    color: #fff;\r\n    background-color: #5A98DE;\r\n}\r\n\r\n.btn-add:hover {\r\n    color: #fff;\r\n    background-color: #0a6999;\r\n}\r\n\r\n.btn-delete {\r\n    color: #fff;\r\n    background-color: #DD514C;    \r\n}\r\n\r\n.btn-delete:link {\r\n    color: #fff;\r\n    background-color: #DD514C;    \r\n}\r\n.btn-delete:hover {\r\n    color: #fff;\r\n    background-color: #c62b26;\r\n}\r\n\r\n/*背景颜色*/\r\n\r\n.white-color {\r\n    background-color: #fff;\r\n}\r\n\r\n.black-color {\r\n    background-color: #000;\r\n}\r\n\r\n/*编辑器*/\r\n#editor {\r\n    width: 100%;\r\n    min-height: 800px;\r\n}\r\n\r\n/*透明层样式*/\r\n #shadow {\r\n    display: none;\r\n    opacity: 0;\r\n    position: fixed;\r\n    z-index: 1;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, .5);\r\n    z-index: 9999;\r\n}\r\n\r\n.form-control:focus {\r\n    border-color: #4C3B2F;\r\n    outline: 0;\r\n    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 2px rgba(76,59,47, .6);\r\n            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 2px rgba(76,59,47, .6);\r\n}\r\n\r\n/*表格样式开始*/\r\n.right-page table thead tr th,\r\n.right-page table tbody tr th,\r\n.right-page table tbody tr td {\r\n    text-align: center;\r\n    vertical-align: middle\r\n}\r\n\r\n.right-page table tbody td a {\r\n    color: #000;\r\n    margin-right: 5px;\r\n    vertical-align: middle\r\n}\r\n\r\n\r\n.main-header {\r\n    padding: 10px 30px;\r\n    background-color: #fff;\r\n}\r\n\r\n.main-header a i {\r\n    padding-right: 5px\r\n}\r\n\r\n.main-header span:last-child {\r\n    margin-top: 8px;\r\n}\r\n\r\n.main-body {\r\n    background: #fff;\r\n    padding: 5px 30px;\r\n    color: #000\r\n}\r\n\r\n\r\n/*提醒框，编辑框*/\r\n.edit,\r\n.reminder {\r\n    width: 300px;\r\n    border-radius: 5px;\r\n    background-color: red;\r\n    position: absolute;\r\n    top: 200px;\r\n    left: 25%;\r\n    z-index: 2;\r\n    background-color: #fff;\r\n    z-index: 9999;\r\n}\r\n\r\n.edit-header,\r\n.reminder-header {\r\n    padding: 10px 0 10px 20px;\r\n    border-bottom: 1px solid #ccc;\r\n    font-size: 16px;\r\n}\r\n\r\n.edit-header i,\r\n.reminder-header i {\r\n    position: relative;\r\n    top: 3px;\r\n}\r\n\r\n.edit-header .glyphicon-remove,\r\n.reminder-header .glyphicon-remove {\r\n    color: #000;    \r\n    float: right;\r\n    padding-right: 20px;\r\n}\r\n\r\n.edit-header .glyphicon-remove:hover, \r\n.reminder-header .glyphicon-remove:hover {\r\n    color: #666;\r\n}\r\n\r\n.edit-body,\r\n.reminder-body  {\r\n    padding: 20px 0 10px 20px;\r\n    border-bottom: 1px solid #ccc;\r\n}\r\n\r\n.edit-footer,\r\n.reminder-footer  {\r\n    padding: 10px 20px;\r\n}\r\n\r\n.edit-footer .btn-default,\r\n.reminder-footer .btn-default  {\r\n    margin-left: 10px;\r\n}\r\n\r\n.edit-input {\r\n    width: 90%;\r\n    height: 25px;\r\n    outline: none;\r\n    border-top: none;\r\n    border-left: none;\r\n    border-right: none;\r\n    border-bottom: 1px #5A98DE solid;\r\n}\r\n\r\n/*开关按钮样式*/\r\n[class|=switch] {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 50px;\r\n    height: 25px;\r\n    border-radius: 16px;\r\n    line-height: 32px;\r\n    -webkit-tap-highlight-color:rgba(255,255,255,0);\r\n}\r\n.slider {\r\n    position: absolute;\r\n    display: inline-block;\r\n    width: 25px;\r\n    height: 25px;\r\n    background: white;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\r\n    border-radius: 50%;\r\n    left: 0;\r\n    top: -1px;\r\n}\r\n.switch-on {\r\n    border: 1px solid white;\r\n    box-shadow: white 0px 0px 0px 16px inset;\r\n    transition: border 0.4s, box-shadow 0.2s, background-color 1.2s;\r\n    background-color: white;\r\n    cursor: pointer;\r\n}\r\n.switch-on .slider {\r\n    left: 25px;\r\n    transition: background-color 0.4s, left 0.2s;\r\n}\r\n.switch-off {\r\n    border: 1px solid #dfdfdf;\r\n    transition: border 0.4s, box-shadow 0.4s;\r\n    background-color: rgb(255, 255, 255);\r\n    box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset;\r\n    background-color: rgb(255, 255, 255);\r\n    cursor: pointer;\r\n}\r\n.switch-off .slider {\r\n    transition: background-color 0.4s, left 0.2s;\r\n}\r\n\r\n/*文件上传样式*/\r\n[class^=\"dropify-font-\"]:before, [class*=\" dropify-font-\"]:before, .dropify-font:before, .dropify-wrapper .dropify-message span.file-icon:before, .dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-filename span.file-icon:before {\r\n    display: inline-block;\r\n    margin-right: .2em;\r\n    margin-left: .2em;\r\n    width: 1em;\r\n    text-align: center;\r\n    text-decoration: inherit;\r\n    text-transform: none;\r\n    font-weight: normal;\r\n    font-style: normal;\r\n    font-variant: normal;\r\n    font-family: \"dropify\";\r\n    line-height: 1em;\r\n    speak: none;\r\n}\r\n\r\n .dropify-font-file:before {\r\n    content: '\\E801'; \r\n }\r\n\r\n.dropify-wrapper {\r\n    position: relative;\r\n    display: block;\r\n    overflow: hidden;\r\n    padding: 5px 10px;\r\n    width: 100%;\r\n    height: 200px;\r\n    max-width: 100%;\r\n    border: 2px solid #E5E5E5;\r\n    background-color: #FFF;\r\n    background-image: none;\r\n    color: #777;\r\n    text-align: center;\r\n    font-size: 14px;\r\n    font-family: \"Roboto\", \"Helvetica Neue\", \"Helvetica\", \"Arial\";\r\n    line-height: 22px;\r\n    cursor: pointer;\r\n    -webkit-transition: border-color 0.15s linear;\r\n    transition: border-color 0.15s linear;\r\n}\r\n\r\n.dropify-wrapper:hover {\r\n    background-image: -webkit-linear-gradient(135deg, #F6F6F6 25%, transparent 25%, transparent 50%, #F6F6F6 50%, #F6F6F6 75%, transparent 75%, transparent);\r\n    background-image: linear-gradient(-45deg, #F6F6F6 25%, transparent 25%, transparent 50%, #F6F6F6 50%, #F6F6F6 75%, transparent 75%, transparent);\r\n    background-size: 30px 30px;\r\n    -webkit-animation: stripes 2s linear infinite;\r\n    animation: stripes 2s linear infinite;\r\n}\r\n\r\n.dropify-wrapper.has-preview .dropify-clear {\r\n    display: block;\r\n}\r\n\r\n.dropify-wrapper.has-error {\r\n    border-color: #F34141;\r\n}\r\n\r\n.dropify-wrapper.has-error .dropify-message .dropify-error {\r\n    display: block;\r\n}\r\n\r\n.dropify-wrapper.has-error:hover .dropify-errors-container {\r\n    visibility: visible;\r\n    opacity: 1;\r\n    -webkit-transition-delay: 0s;\r\n    transition-delay: 0s;\r\n}\r\n\r\n.dropify-wrapper.disabled input {\r\n    cursor: not-allowed;\r\n}\r\n\r\n.dropify-wrapper.disabled:hover {\r\n    background-image: none;\r\n    -webkit-animation: none;\r\n    animation: none;\r\n}\r\n\r\n.dropify-wrapper.disabled .dropify-message {\r\n    text-decoration: line-through;\r\n    opacity: 0.5;\r\n}\r\n\r\n.dropify-wrapper.disabled .dropify-infos-message {\r\n    display: none;\r\n}\r\n\r\n.dropify-wrapper input {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    z-index: 5;\r\n    width: 100%;\r\n    height: 100%;\r\n    opacity: 0;\r\n    cursor: pointer;\r\n}\r\n\r\n.dropify-wrapper .dropify-message {\r\n    position: relative;\r\n    top: 50%;\r\n    -webkit-transform: translateY(-50%);\r\n    transform: translateY(-50%);\r\n}\r\n\r\n.dropify-wrapper .dropify-message span.file-icon {\r\n    color: #CCC;\r\n    font-size: 50px;\r\n}\r\n\r\n.dropify-wrapper .dropify-message p {\r\n    margin: 5px 0 0 0;\r\n}\r\n\r\n.dropify-wrapper .dropify-message p.dropify-error {\r\n    display: none;\r\n    color: #F34141;\r\n    font-weight: bold;\r\n}\r\n\r\n.dropify-wrapper .dropify-clear {\r\n    position: absolute;\r\n    top: 10px;\r\n    right: 10px;\r\n    z-index: 7;\r\n    display: none;\r\n    padding: 4px 8px;\r\n    border: 2px solid #FFF;\r\n    background: none;\r\n    color: #FFF;\r\n    text-transform: uppercase;\r\n    font-weight: bold;\r\n    font-size: 11px;\r\n    font-family: \"Roboto\", \"Helvetica Neue\", \"Helvetica\", \"Arial\";\r\n    opacity: 0;\r\n    -webkit-transition: all 0.15s linear;\r\n    transition: all 0.15s linear;\r\n}\r\n\r\n.dropify-wrapper .dropify-clear:hover {\r\n    background: rgba(255, 255, 255, 0.2);\r\n}\r\n\r\n.dropify-wrapper .dropify-preview {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    z-index: 1;\r\n    display: none;\r\n    overflow: hidden;\r\n    padding: 5px;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #FFF;\r\n    text-align: center;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-render img {\r\n    position: relative;\r\n    top: 50%;\r\n    max-width: 100%;\r\n    max-height: 100%;\r\n    background-color: #FFF;\r\n    -webkit-transition: border-color 0.15s linear;\r\n    transition: border-color 0.15s linear;\r\n    -webkit-transform: translate(0, -50%);\r\n    transform: translate(0, -50%);\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-render i {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    color: #777;\r\n    font-size: 70px;\r\n    -webkit-transform: translate(-50%, -50%);\r\n    transform: translate(-50%, -50%);\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-render .dropify-extension {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    overflow: hidden;\r\n    margin-top: 10px;\r\n    width: 42px;\r\n    text-transform: uppercase;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    letter-spacing: -0.03em;\r\n    font-weight: 900;\r\n    font-size: 13px;\r\n    -webkit-transform: translate(-50%, -50%);\r\n    transform: translate(-50%, -50%);\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    z-index: 3;\r\n    background: rgba(0, 0, 0, 0.7);\r\n    opacity: 0;\r\n    -webkit-transition: opacity 0.15s linear;\r\n    transition: opacity 0.15s linear;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner {\r\n    position: absolute;\r\n    top: 50%;\r\n    padding: 0 20px;\r\n    width: 100%;\r\n    -webkit-transition: all 0.2s ease;\r\n    transition: all 0.2s ease;\r\n    -webkit-transform: translate(0, -40%);\r\n    transform: translate(0, -40%);\r\n    -webkit-backface-visibility: hidden;\r\n    backface-visibility: hidden;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner p {\r\n    position: relative;\r\n    overflow: hidden;\r\n    margin: 0;\r\n    padding: 0;\r\n    width: 100%;\r\n    color: #FFF;\r\n    text-align: center;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    font-weight: bold;\r\n    line-height: 25px;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-filename span.file-icon {\r\n    margin-right: 2px;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-infos-message {\r\n    position: relative;\r\n    margin-top: 15px;\r\n    padding-top: 15px;\r\n    font-size: 12px;\r\n    opacity: 0.5;\r\n}\r\n\r\n.dropify-wrapper .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-infos-message::before {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 50%;\r\n    width: 30px;\r\n    height: 2px;\r\n    background: #FFF;\r\n    content: '';\r\n    -webkit-transform: translate(-50%, 0);\r\n    transform: translate(-50%, 0);\r\n}\r\n\r\n.dropify-wrapper:hover .dropify-clear {\r\n    opacity: 1;\r\n}\r\n\r\n.dropify-wrapper:hover .dropify-preview .dropify-infos {\r\n    opacity: 1;\r\n}\r\n\r\n.dropify-wrapper:hover .dropify-preview .dropify-infos .dropify-infos-inner {\r\n    margin-top: -5px;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback {\r\n    height: auto !important;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback:hover {\r\n    background-image: none;\r\n    -webkit-animation: none;\r\n    animation: none;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview {\r\n    position: relative;\r\n    padding: 0;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-render {\r\n    position: relative;\r\n    display: block;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-render .dropify-font-file {\r\n    position: relative;\r\n    top: 0;\r\n    left: 0;\r\n    -webkit-transform: translate(0, 0);\r\n    transform: translate(0, 0);\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-render .dropify-font-file::before {\r\n    margin-top: 30px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-render img {\r\n    position: relative;\r\n    -webkit-transform: translate(0, 0);\r\n    transform: translate(0, 0);\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos {\r\n    position: relative;\r\n    background: transparent;\r\n    opacity: 1;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos .dropify-infos-inner {\r\n    position: relative;\r\n    top: 0;\r\n    padding: 5px 90px 5px 0;\r\n    -webkit-transform: translate(0, 0);\r\n    transform: translate(0, 0);\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos .dropify-infos-inner p {\r\n    position: relative;\r\n    overflow: hidden;\r\n    margin: 0;\r\n    padding: 0;\r\n    width: 100%;\r\n    color: #777;\r\n    text-align: left;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    line-height: 25px;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-filename {\r\n    font-weight: bold;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-infos-message {\r\n    position: relative;\r\n    margin-top: 0;\r\n    padding-top: 0;\r\n    font-size: 11px;\r\n    opacity: 1;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-preview .dropify-infos .dropify-infos-inner p.dropify-infos-message::before {\r\n    display: none;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-message {\r\n    padding: 40px 0;\r\n    -webkit-transform: translate(0, 0);\r\n    transform: translate(0, 0);\r\n}\r\n\r\n.dropify-wrapper.touch-fallback .dropify-clear {\r\n    top: auto;\r\n    bottom: 23px;\r\n    border-color: rgba(119, 119, 119, 0.7);\r\n    color: #777;\r\n    opacity: 1;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback.has-preview .dropify-message {\r\n    display: none;\r\n}\r\n\r\n.dropify-wrapper.touch-fallback:hover .dropify-preview .dropify-infos .dropify-infos-inner {\r\n    margin-top: 0;\r\n}\r\n\r\n.dropify-wrapper .dropify-loader {\r\n    position: absolute;\r\n    top: 15px;\r\n    right: 15px;\r\n    z-index: 9;\r\n    display: none;\r\n}\r\n\r\n.dropify-wrapper .dropify-loader::after {\r\n    position: relative;\r\n    display: block;\r\n    width: 20px;\r\n    height: 20px;\r\n    border-top: 1px solid #CCC;\r\n    border-right: 1px solid #777;\r\n    border-bottom: 1px solid #777;\r\n    border-left: 1px solid #CCC;\r\n    border-radius: 100%;\r\n    content: '';\r\n    -webkit-animation: rotate 0.6s linear infinite;\r\n    animation: rotate 0.6s linear infinite;\r\n}\r\n\r\n.dropify-wrapper .dropify-errors-container {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    z-index: 3;\r\n    visibility: hidden;\r\n    background: rgba(243, 65, 65, 0.8);\r\n    text-align: left;\r\n    opacity: 0;\r\n    -webkit-transition: visibility 0s linear 0.15s,opacity 0.15s linear;\r\n    transition: visibility 0s linear 0.15s,opacity 0.15s linear;\r\n}\r\n\r\n.dropify-wrapper .dropify-errors-container ul {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 0;\r\n    margin: 0;\r\n    padding: 10px 20px;\r\n    -webkit-transform: translateY(-50%);\r\n    transform: translateY(-50%);\r\n}\r\n\r\n.dropify-wrapper .dropify-errors-container ul li {\r\n    margin-left: 20px;\r\n    color: #FFF;\r\n    font-weight: bold;\r\n}\r\n\r\n.dropify-wrapper .dropify-errors-container.visible {\r\n    visibility: visible;\r\n    opacity: 1;\r\n    -webkit-transition-delay: 0s;\r\n    transition-delay: 0s;\r\n}\r\n\r\n.dropify-wrapper ~ .dropify-errors-container ul {\r\n    margin: 15px 0;\r\n    padding: 0;\r\n}\r\n\r\n.dropify-wrapper ~ .dropify-errors-container ul li {\r\n    margin-left: 20px;\r\n    color: #F34141;\r\n    font-weight: bold;\r\n}\r\n\r\n@-webkit-keyframes stripes {\r\n    from {\r\n        background-position: 0 0;\r\n    }\r\n\r\n    to {\r\n        background-position: 60px 30px;\r\n    }\r\n}\r\n\r\n@keyframes stripes {\r\n    from {\r\n        background-position: 0 0;\r\n    }\r\n\r\n    to {\r\n        background-position: 60px 30px;\r\n    }\r\n}\r\n\r\n@-webkit-keyframes rotate {\r\n    0% {\r\n        -webkit-transform: rotateZ(-360deg);\r\n        transform: rotateZ(-360deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotateZ(0deg);\r\n        transform: rotateZ(0deg);\r\n    }\r\n}\r\n\r\n@keyframes rotate {\r\n    0% {\r\n        -webkit-transform: rotateZ(-360deg);\r\n        transform: rotateZ(-360deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotateZ(0deg);\r\n        transform: rotateZ(0deg);\r\n    }\r\n}\r\n\r\n\r\n/*公共样式结束*/\r\n\r\n\r\n@media(min-width: 768px){\r\n    .nav-top {\r\n        height: 60px;\r\n        /*padding-right: 30px;*/\r\n        /*background-color: #fff;*/\r\n    }\r\n\r\n    .nav-top li {\r\n        height: 38px;\r\n        line-height: 38px;\r\n        text-align: center\r\n    }\r\n\r\n}\r\n\r\n @media( max-width: 768px) {\r\n    .hidden-xs {\r\n        display: none\r\n    }\r\n\r\n    .right-page-xs {\r\n        width: 100%;\r\n        left: 0%;\r\n    }\r\n\r\n    /*头部导航栏开始*/\r\n    .nav-side-xs {\r\n        width: 0px;\r\n        overflow: hidden;\r\n    }\r\n\r\n    .navbar-top-body-space {\r\n        display: inline-block;\r\n        width: 2em;\r\n    }\r\n\r\n    .navbar-top-body-xs {\r\n        padding-right: 0px;    \r\n    }\r\n\r\n    .navbar-top-body-xs li a {\r\n        padding: 10px 10px;\r\n        float: right;       \r\n    }\r\n\r\n}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "/*!\r\n laypage默认样式\r\n*/.laypage_main a,.laypage_main input,.laypage_main span{height:26px;line-height:26px}.laypage_main button,.laypage_main input,.laypageskin_default a{border:1px solid #ccc;background-color:#fff}.laypage_main{font-size:0;clear:both;color:#666}.laypage_main *{display:inline-block;vertical-align:top;font-size:12px}.laypage_main a{text-decoration:none;color:#666}.laypage_main a,.laypage_main span{margin:0 3px 6px;padding:0 10px}.laypage_main input{width:40px;margin:0 5px;padding:0 5px}.laypage_main button{height:28px;line-height:28px;margin-left:5px;padding:0 10px;color:#666}.laypageskin_default span{height:28px;line-height:28px;color:#999}.laypageskin_default .laypage_curr{font-weight:700;color:#666}.laypageskin_molv a,.laypageskin_molv span{padding:0 12px;border-radius:2px}.laypageskin_molv a{background-color:#f1eff0}.laypageskin_molv .laypage_curr{background-color:#00AA91;color:#fff}.laypageskin_molv input{height:24px;line-height:24px}.laypageskin_molv button{height:26px;line-height:26px}.laypageskin_yahei{color:#333}.laypageskin_yahei a,.laypageskin_yahei span{padding:0 13px;border-radius:2px;color:#333}.laypageskin_yahei .laypage_curr{background-color:#333;color:#fff}.laypageskin_flow{text-align:center}.laypageskin_flow .page_nomore{color:#999}", ""]);

// exports


/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (f) {\n  if ((typeof exports === \"undefined\" ? \"undefined\" : _typeof(exports)) === \"object\" && typeof module !== \"undefined\") {\n    module.exports = f();\n  } else if (typeof define === \"function\" && define.amd) {\n    define([], f);\n  } else {\n    var g;if (typeof window !== \"undefined\") {\n      g = window;\n    } else if (typeof global !== \"undefined\") {\n      g = global;\n    } else if (typeof self !== \"undefined\") {\n      g = self;\n    } else {\n      g = this;\n    }g.ejs = f();\n  }\n})(function () {\n  var define, module, exports;return function e(t, n, r) {\n    function s(o, u) {\n      if (!n[o]) {\n        if (!t[o]) {\n          var a = typeof require == \"function\" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error(\"Cannot find module '\" + o + \"'\");throw f.code = \"MODULE_NOT_FOUND\", f;\n        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {\n          var n = t[o][1][e];return s(n ? n : e);\n        }, l, l.exports, e, t, n, r);\n      }return n[o].exports;\n    }var i = typeof require == \"function\" && require;for (var o = 0; o < r.length; o++) {\n      s(r[o]);\n    }return s;\n  }({ 1: [function (require, module, exports) {\n      \"use strict\";\n      var fs = require(\"fs\");var path = require(\"path\");var utils = require(\"./utils\");var scopeOptionWarned = false;var _VERSION_STRING = require(\"../package.json\").version;var _DEFAULT_DELIMITER = \"%\";var _DEFAULT_LOCALS_NAME = \"locals\";var _NAME = \"ejs\";var _REGEX_STRING = \"(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)\";var _OPTS = [\"delimiter\", \"scope\", \"context\", \"debug\", \"compileDebug\", \"client\", \"_with\", \"rmWhitespace\", \"strict\", \"filename\"];var _OPTS_EXPRESS = _OPTS.concat(\"cache\");var _BOM = /^\\uFEFF/;exports.cache = utils.cache;exports.fileLoader = fs.readFileSync;exports.localsName = _DEFAULT_LOCALS_NAME;exports.resolveInclude = function (name, filename, isDir) {\n        var dirname = path.dirname;var extname = path.extname;var resolve = path.resolve;var includePath = resolve(isDir ? filename : dirname(filename), name);var ext = extname(name);if (!ext) {\n          includePath += \".ejs\";\n        }return includePath;\n      };function getIncludePath(path, options) {\n        var includePath;if (path.charAt(0) == \"/\") {\n          includePath = exports.resolveInclude(path.replace(/^\\/*/, \"\"), options.root || \"/\", true);\n        } else {\n          if (!options.filename) {\n            throw new Error(\"`include` use relative path requires the 'filename' option.\");\n          }includePath = exports.resolveInclude(path, options.filename);\n        }return includePath;\n      }function handleCache(options, template) {\n        var func;var filename = options.filename;var hasTemplate = arguments.length > 1;if (options.cache) {\n          if (!filename) {\n            throw new Error(\"cache option requires a filename\");\n          }func = exports.cache.get(filename);if (func) {\n            return func;\n          }if (!hasTemplate) {\n            template = fileLoader(filename).toString().replace(_BOM, \"\");\n          }\n        } else if (!hasTemplate) {\n          if (!filename) {\n            throw new Error(\"Internal EJS error: no file name or template \" + \"provided\");\n          }template = fileLoader(filename).toString().replace(_BOM, \"\");\n        }func = exports.compile(template, options);if (options.cache) {\n          exports.cache.set(filename, func);\n        }return func;\n      }function tryHandleCache(options, data, cb) {\n        var result;try {\n          result = handleCache(options)(data);\n        } catch (err) {\n          return cb(err);\n        }return cb(null, result);\n      }function fileLoader(filePath) {\n        return exports.fileLoader(filePath);\n      }function includeFile(path, options) {\n        var opts = utils.shallowCopy({}, options);opts.filename = getIncludePath(path, opts);return handleCache(opts);\n      }function includeSource(path, options) {\n        var opts = utils.shallowCopy({}, options);var includePath;var template;includePath = getIncludePath(path, opts);template = fileLoader(includePath).toString().replace(_BOM, \"\");opts.filename = includePath;var templ = new Template(template, opts);templ.generateSource();return { source: templ.source, filename: includePath, template: template };\n      }function rethrow(err, str, flnm, lineno, esc) {\n        var lines = str.split(\"\\n\");var start = Math.max(lineno - 3, 0);var end = Math.min(lines.length, lineno + 3);var filename = esc(flnm);var context = lines.slice(start, end).map(function (line, i) {\n          var curr = i + start + 1;return (curr == lineno ? \" >> \" : \"    \") + curr + \"| \" + line;\n        }).join(\"\\n\");err.path = filename;err.message = (filename || \"ejs\") + \":\" + lineno + \"\\n\" + context + \"\\n\\n\" + err.message;throw err;\n      }function stripSemi(str) {\n        return str.replace(/;(\\s*$)/, \"$1\");\n      }exports.compile = function compile(template, opts) {\n        var templ;if (opts && opts.scope) {\n          if (!scopeOptionWarned) {\n            console.warn(\"`scope` option is deprecated and will be removed in EJS 3\");scopeOptionWarned = true;\n          }if (!opts.context) {\n            opts.context = opts.scope;\n          }delete opts.scope;\n        }templ = new Template(template, opts);return templ.compile();\n      };exports.render = function (template, d, o) {\n        var data = d || {};var opts = o || {};if (arguments.length == 2) {\n          utils.shallowCopyFromList(opts, data, _OPTS);\n        }return handleCache(opts, template)(data);\n      };exports.renderFile = function () {\n        var filename = arguments[0];var cb = arguments[arguments.length - 1];var opts = { filename: filename };var data;if (arguments.length > 2) {\n          data = arguments[1];if (arguments.length === 3) {\n            if (data.settings && data.settings[\"view options\"]) {\n              utils.shallowCopyFromList(opts, data.settings[\"view options\"], _OPTS_EXPRESS);\n            } else {\n              utils.shallowCopyFromList(opts, data, _OPTS_EXPRESS);\n            }\n          } else {\n            utils.shallowCopy(opts, arguments[2]);\n          }opts.filename = filename;\n        } else {\n          data = {};\n        }return tryHandleCache(opts, data, cb);\n      };exports.clearCache = function () {\n        exports.cache.reset();\n      };function Template(text, opts) {\n        opts = opts || {};var options = {};this.templateText = text;this.mode = null;this.truncate = false;this.currentLine = 1;this.source = \"\";this.dependencies = [];options.client = opts.client || false;options.escapeFunction = opts.escape || utils.escapeXML;options.compileDebug = opts.compileDebug !== false;options.debug = !!opts.debug;options.filename = opts.filename;options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;options.strict = opts.strict || false;options.context = opts.context;options.cache = opts.cache || false;options.rmWhitespace = opts.rmWhitespace;options.root = opts.root;options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;if (options.strict) {\n          options._with = false;\n        } else {\n          options._with = typeof opts._with != \"undefined\" ? opts._with : true;\n        }this.opts = options;this.regex = this.createRegex();\n      }Template.modes = { EVAL: \"eval\", ESCAPED: \"escaped\", RAW: \"raw\", COMMENT: \"comment\", LITERAL: \"literal\" };Template.prototype = { createRegex: function createRegex() {\n          var str = _REGEX_STRING;var delim = utils.escapeRegExpChars(this.opts.delimiter);str = str.replace(/%/g, delim);return new RegExp(str);\n        }, compile: function compile() {\n          var src;var fn;var opts = this.opts;var prepended = \"\";var appended = \"\";var escapeFn = opts.escapeFunction;if (!this.source) {\n            this.generateSource();prepended += \"  var __output = [], __append = __output.push.bind(__output);\" + \"\\n\";if (opts._with !== false) {\n              prepended += \"  with (\" + opts.localsName + \" || {}) {\" + \"\\n\";appended += \"  }\" + \"\\n\";\n            }appended += '  return __output.join(\"\");' + \"\\n\";this.source = prepended + this.source + appended;\n          }if (opts.compileDebug) {\n            src = \"var __line = 1\" + \"\\n\" + \"  , __lines = \" + JSON.stringify(this.templateText) + \"\\n\" + \"  , __filename = \" + (opts.filename ? JSON.stringify(opts.filename) : \"undefined\") + \";\" + \"\\n\" + \"try {\" + \"\\n\" + this.source + \"} catch (e) {\" + \"\\n\" + \"  rethrow(e, __lines, __filename, __line, escapeFn);\" + \"\\n\" + \"}\" + \"\\n\";\n          } else {\n            src = this.source;\n          }if (opts.debug) {\n            console.log(src);\n          }if (opts.client) {\n            src = \"escapeFn = escapeFn || \" + escapeFn.toString() + \";\" + \"\\n\" + src;if (opts.compileDebug) {\n              src = \"rethrow = rethrow || \" + rethrow.toString() + \";\" + \"\\n\" + src;\n            }\n          }if (opts.strict) {\n            src = '\"use strict\";\\n' + src;\n          }try {\n            fn = new Function(opts.localsName + \", escapeFn, include, rethrow\", src);\n          } catch (e) {\n            if (e instanceof SyntaxError) {\n              if (opts.filename) {\n                e.message += \" in \" + opts.filename;\n              }e.message += \" while compiling ejs\\n\\n\";e.message += \"If the above error is not helpful, you may want to try EJS-Lint:\\n\";e.message += \"https://github.com/RyanZim/EJS-Lint\";\n            }throw e;\n          }if (opts.client) {\n            fn.dependencies = this.dependencies;return fn;\n          }var returnedFn = function returnedFn(data) {\n            var include = function include(path, includeData) {\n              var d = utils.shallowCopy({}, data);if (includeData) {\n                d = utils.shallowCopy(d, includeData);\n              }return includeFile(path, opts)(d);\n            };return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);\n          };returnedFn.dependencies = this.dependencies;return returnedFn;\n        }, generateSource: function generateSource() {\n          var opts = this.opts;if (opts.rmWhitespace) {\n            this.templateText = this.templateText.replace(/\\r/g, \"\").replace(/^\\s+|\\s+$/gm, \"\");\n          }this.templateText = this.templateText.replace(/[ \\t]*<%_/gm, \"<%_\").replace(/_%>[ \\t]*/gm, \"_%>\");var self = this;var matches = this.parseTemplateText();var d = this.opts.delimiter;if (matches && matches.length) {\n            matches.forEach(function (line, index) {\n              var opening;var closing;var include;var includeOpts;var includeObj;var includeSrc;if (line.indexOf(\"<\" + d) === 0 && line.indexOf(\"<\" + d + d) !== 0) {\n                closing = matches[index + 2];if (!(closing == d + \">\" || closing == \"-\" + d + \">\" || closing == \"_\" + d + \">\")) {\n                  throw new Error('Could not find matching close tag for \"' + line + '\".');\n                }\n              }if (include = line.match(/^\\s*include\\s+(\\S+)/)) {\n                opening = matches[index - 1];if (opening && (opening == \"<\" + d || opening == \"<\" + d + \"-\" || opening == \"<\" + d + \"_\")) {\n                  includeOpts = utils.shallowCopy({}, self.opts);includeObj = includeSource(include[1], includeOpts);if (self.opts.compileDebug) {\n                    includeSrc = \"    ; (function(){\" + \"\\n\" + \"      var __line = 1\" + \"\\n\" + \"      , __lines = \" + JSON.stringify(includeObj.template) + \"\\n\" + \"      , __filename = \" + JSON.stringify(includeObj.filename) + \";\" + \"\\n\" + \"      try {\" + \"\\n\" + includeObj.source + \"      } catch (e) {\" + \"\\n\" + \"        rethrow(e, __lines, __filename, __line);\" + \"\\n\" + \"      }\" + \"\\n\" + \"    ; }).call(this)\" + \"\\n\";\n                  } else {\n                    includeSrc = \"    ; (function(){\" + \"\\n\" + includeObj.source + \"    ; }).call(this)\" + \"\\n\";\n                  }self.source += includeSrc;self.dependencies.push(exports.resolveInclude(include[1], includeOpts.filename));return;\n                }\n              }self.scanLine(line);\n            });\n          }\n        }, parseTemplateText: function parseTemplateText() {\n          var str = this.templateText;var pat = this.regex;var result = pat.exec(str);var arr = [];var firstPos;while (result) {\n            firstPos = result.index;if (firstPos !== 0) {\n              arr.push(str.substring(0, firstPos));str = str.slice(firstPos);\n            }arr.push(result[0]);str = str.slice(result[0].length);result = pat.exec(str);\n          }if (str) {\n            arr.push(str);\n          }return arr;\n        }, scanLine: function scanLine(line) {\n          var self = this;var d = this.opts.delimiter;var newLineCount = 0;function _addOutput() {\n            if (self.truncate) {\n              line = line.replace(/^(?:\\r\\n|\\r|\\n)/, \"\");self.truncate = false;\n            } else if (self.opts.rmWhitespace) {\n              line = line.replace(/^\\n/, \"\");\n            }if (!line) {\n              return;\n            }line = line.replace(/\\\\/g, \"\\\\\\\\\");line = line.replace(/\\n/g, \"\\\\n\");line = line.replace(/\\r/g, \"\\\\r\");line = line.replace(/\"/g, '\\\\\"');self.source += '    ; __append(\"' + line + '\")' + \"\\n\";\n          }newLineCount = line.split(\"\\n\").length - 1;switch (line) {case \"<\" + d:case \"<\" + d + \"_\":\n              this.mode = Template.modes.EVAL;break;case \"<\" + d + \"=\":\n              this.mode = Template.modes.ESCAPED;break;case \"<\" + d + \"-\":\n              this.mode = Template.modes.RAW;break;case \"<\" + d + \"#\":\n              this.mode = Template.modes.COMMENT;break;case \"<\" + d + d:\n              this.mode = Template.modes.LITERAL;this.source += '    ; __append(\"' + line.replace(\"<\" + d + d, \"<\" + d) + '\")' + \"\\n\";break;case d + d + \">\":\n              this.mode = Template.modes.LITERAL;this.source += '    ; __append(\"' + line.replace(d + d + \">\", d + \">\") + '\")' + \"\\n\";break;case d + \">\":case \"-\" + d + \">\":case \"_\" + d + \">\":\n              if (this.mode == Template.modes.LITERAL) {\n                _addOutput();\n              }this.mode = null;this.truncate = line.indexOf(\"-\") === 0 || line.indexOf(\"_\") === 0;break;default:\n              if (this.mode) {\n                switch (this.mode) {case Template.modes.EVAL:case Template.modes.ESCAPED:case Template.modes.RAW:\n                    if (line.lastIndexOf(\"//\") > line.lastIndexOf(\"\\n\")) {\n                      line += \"\\n\";\n                    }}switch (this.mode) {case Template.modes.EVAL:\n                    this.source += \"    ; \" + line + \"\\n\";break;case Template.modes.ESCAPED:\n                    this.source += \"    ; __append(escapeFn(\" + stripSemi(line) + \"))\" + \"\\n\";break;case Template.modes.RAW:\n                    this.source += \"    ; __append(\" + stripSemi(line) + \")\" + \"\\n\";break;case Template.modes.COMMENT:\n                    break;case Template.modes.LITERAL:\n                    _addOutput();break;}\n              } else {\n                _addOutput();\n              }}if (self.opts.compileDebug && newLineCount) {\n            this.currentLine += newLineCount;this.source += \"    ; __line = \" + this.currentLine + \"\\n\";\n          }\n        } };exports.escapeXML = utils.escapeXML;exports.__express = exports.renderFile;if (require.extensions) {\n        require.extensions[\".ejs\"] = function (module, flnm) {\n          var filename = flnm || module.filename;var options = { filename: filename, client: true };var template = fileLoader(filename).toString();var fn = exports.compile(template, options);module._compile(\"module.exports = \" + fn.toString() + \";\", filename);\n        };\n      }exports.VERSION = _VERSION_STRING;exports.name = _NAME;if (typeof window != \"undefined\") {\n        window.ejs = exports;\n      }\n    }, { \"../package.json\": 6, \"./utils\": 2, fs: 3, path: 4 }], 2: [function (require, module, exports) {\n      \"use strict\";\n      var regExpChars = /[|\\\\{}()[\\]^$+*?.]/g;exports.escapeRegExpChars = function (string) {\n        if (!string) {\n          return \"\";\n        }return String(string).replace(regExpChars, \"\\\\$&\");\n      };var _ENCODE_HTML_RULES = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&#34;\", \"'\": \"&#39;\" };var _MATCH_HTML = /[&<>\\'\"]/g;function encode_char(c) {\n        return _ENCODE_HTML_RULES[c] || c;\n      }var escapeFuncStr = \"var _ENCODE_HTML_RULES = {\\n\" + '      \"&\": \"&amp;\"\\n' + '    , \"<\": \"&lt;\"\\n' + '    , \">\": \"&gt;\"\\n' + '    , \\'\"\\': \"&#34;\"\\n' + '    , \"\\'\": \"&#39;\"\\n' + \"    }\\n\" + \"  , _MATCH_HTML = /[&<>'\\\"]/g;\\n\" + \"function encode_char(c) {\\n\" + \"  return _ENCODE_HTML_RULES[c] || c;\\n\" + \"};\\n\";exports.escapeXML = function (markup) {\n        return markup == undefined ? \"\" : String(markup).replace(_MATCH_HTML, encode_char);\n      };exports.escapeXML.toString = function () {\n        return Function.prototype.toString.call(this) + \";\\n\" + escapeFuncStr;\n      };exports.shallowCopy = function (to, from) {\n        from = from || {};for (var p in from) {\n          to[p] = from[p];\n        }return to;\n      };exports.shallowCopyFromList = function (to, from, list) {\n        for (var i = 0; i < list.length; i++) {\n          var p = list[i];if (typeof from[p] != \"undefined\") {\n            to[p] = from[p];\n          }\n        }return to;\n      };exports.cache = { _data: {}, set: function set(key, val) {\n          this._data[key] = val;\n        }, get: function get(key) {\n          return this._data[key];\n        }, reset: function reset() {\n          this._data = {};\n        } };\n    }, {}], 3: [function (require, module, exports) {}, {}], 4: [function (require, module, exports) {\n      (function (process) {\n        function normalizeArray(parts, allowAboveRoot) {\n          var up = 0;for (var i = parts.length - 1; i >= 0; i--) {\n            var last = parts[i];if (last === \".\") {\n              parts.splice(i, 1);\n            } else if (last === \"..\") {\n              parts.splice(i, 1);up++;\n            } else if (up) {\n              parts.splice(i, 1);up--;\n            }\n          }if (allowAboveRoot) {\n            for (; up--; up) {\n              parts.unshift(\"..\");\n            }\n          }return parts;\n        }var splitPathRe = /^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/;var splitPath = function splitPath(filename) {\n          return splitPathRe.exec(filename).slice(1);\n        };exports.resolve = function () {\n          var resolvedPath = \"\",\n              resolvedAbsolute = false;for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {\n            var path = i >= 0 ? arguments[i] : process.cwd();if (typeof path !== \"string\") {\n              throw new TypeError(\"Arguments to path.resolve must be strings\");\n            } else if (!path) {\n              continue;\n            }resolvedPath = path + \"/\" + resolvedPath;resolvedAbsolute = path.charAt(0) === \"/\";\n          }resolvedPath = normalizeArray(filter(resolvedPath.split(\"/\"), function (p) {\n            return !!p;\n          }), !resolvedAbsolute).join(\"/\");return (resolvedAbsolute ? \"/\" : \"\") + resolvedPath || \".\";\n        };exports.normalize = function (path) {\n          var isAbsolute = exports.isAbsolute(path),\n              trailingSlash = substr(path, -1) === \"/\";path = normalizeArray(filter(path.split(\"/\"), function (p) {\n            return !!p;\n          }), !isAbsolute).join(\"/\");if (!path && !isAbsolute) {\n            path = \".\";\n          }if (path && trailingSlash) {\n            path += \"/\";\n          }return (isAbsolute ? \"/\" : \"\") + path;\n        };exports.isAbsolute = function (path) {\n          return path.charAt(0) === \"/\";\n        };exports.join = function () {\n          var paths = Array.prototype.slice.call(arguments, 0);return exports.normalize(filter(paths, function (p, index) {\n            if (typeof p !== \"string\") {\n              throw new TypeError(\"Arguments to path.join must be strings\");\n            }return p;\n          }).join(\"/\"));\n        };exports.relative = function (from, to) {\n          from = exports.resolve(from).substr(1);to = exports.resolve(to).substr(1);function trim(arr) {\n            var start = 0;for (; start < arr.length; start++) {\n              if (arr[start] !== \"\") break;\n            }var end = arr.length - 1;for (; end >= 0; end--) {\n              if (arr[end] !== \"\") break;\n            }if (start > end) return [];return arr.slice(start, end - start + 1);\n          }var fromParts = trim(from.split(\"/\"));var toParts = trim(to.split(\"/\"));var length = Math.min(fromParts.length, toParts.length);var samePartsLength = length;for (var i = 0; i < length; i++) {\n            if (fromParts[i] !== toParts[i]) {\n              samePartsLength = i;break;\n            }\n          }var outputParts = [];for (var i = samePartsLength; i < fromParts.length; i++) {\n            outputParts.push(\"..\");\n          }outputParts = outputParts.concat(toParts.slice(samePartsLength));return outputParts.join(\"/\");\n        };exports.sep = \"/\";exports.delimiter = \":\";exports.dirname = function (path) {\n          var result = splitPath(path),\n              root = result[0],\n              dir = result[1];if (!root && !dir) {\n            return \".\";\n          }if (dir) {\n            dir = dir.substr(0, dir.length - 1);\n          }return root + dir;\n        };exports.basename = function (path, ext) {\n          var f = splitPath(path)[2];if (ext && f.substr(-1 * ext.length) === ext) {\n            f = f.substr(0, f.length - ext.length);\n          }return f;\n        };exports.extname = function (path) {\n          return splitPath(path)[3];\n        };function filter(xs, f) {\n          if (xs.filter) return xs.filter(f);var res = [];for (var i = 0; i < xs.length; i++) {\n            if (f(xs[i], i, xs)) res.push(xs[i]);\n          }return res;\n        }var substr = \"ab\".substr(-1) === \"b\" ? function (str, start, len) {\n          return str.substr(start, len);\n        } : function (str, start, len) {\n          if (start < 0) start = str.length + start;return str.substr(start, len);\n        };\n      }).call(this, require(\"_process\"));\n    }, { _process: 5 }], 5: [function (require, module, exports) {\n      var process = module.exports = {};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout() {\n        throw new Error(\"setTimeout has not been defined\");\n      }function defaultClearTimeout() {\n        throw new Error(\"clearTimeout has not been defined\");\n      }(function () {\n        try {\n          if (typeof setTimeout === \"function\") {\n            cachedSetTimeout = setTimeout;\n          } else {\n            cachedSetTimeout = defaultSetTimout;\n          }\n        } catch (e) {\n          cachedSetTimeout = defaultSetTimout;\n        }try {\n          if (typeof clearTimeout === \"function\") {\n            cachedClearTimeout = clearTimeout;\n          } else {\n            cachedClearTimeout = defaultClearTimeout;\n          }\n        } catch (e) {\n          cachedClearTimeout = defaultClearTimeout;\n        }\n      })();function runTimeout(fun) {\n        if (cachedSetTimeout === setTimeout) {\n          return setTimeout(fun, 0);\n        }if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n          cachedSetTimeout = setTimeout;return setTimeout(fun, 0);\n        }try {\n          return cachedSetTimeout(fun, 0);\n        } catch (e) {\n          try {\n            return cachedSetTimeout.call(null, fun, 0);\n          } catch (e) {\n            return cachedSetTimeout.call(this, fun, 0);\n          }\n        }\n      }function runClearTimeout(marker) {\n        if (cachedClearTimeout === clearTimeout) {\n          return clearTimeout(marker);\n        }if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n          cachedClearTimeout = clearTimeout;return clearTimeout(marker);\n        }try {\n          return cachedClearTimeout(marker);\n        } catch (e) {\n          try {\n            return cachedClearTimeout.call(null, marker);\n          } catch (e) {\n            return cachedClearTimeout.call(this, marker);\n          }\n        }\n      }var queue = [];var draining = false;var currentQueue;var queueIndex = -1;function cleanUpNextTick() {\n        if (!draining || !currentQueue) {\n          return;\n        }draining = false;if (currentQueue.length) {\n          queue = currentQueue.concat(queue);\n        } else {\n          queueIndex = -1;\n        }if (queue.length) {\n          drainQueue();\n        }\n      }function drainQueue() {\n        if (draining) {\n          return;\n        }var timeout = runTimeout(cleanUpNextTick);draining = true;var len = queue.length;while (len) {\n          currentQueue = queue;queue = [];while (++queueIndex < len) {\n            if (currentQueue) {\n              currentQueue[queueIndex].run();\n            }\n          }queueIndex = -1;len = queue.length;\n        }currentQueue = null;draining = false;runClearTimeout(timeout);\n      }process.nextTick = function (fun) {\n        var args = new Array(arguments.length - 1);if (arguments.length > 1) {\n          for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n          }\n        }queue.push(new Item(fun, args));if (queue.length === 1 && !draining) {\n          runTimeout(drainQueue);\n        }\n      };function Item(fun, array) {\n        this.fun = fun;this.array = array;\n      }Item.prototype.run = function () {\n        this.fun.apply(null, this.array);\n      };process.title = \"browser\";process.browser = true;process.env = {};process.argv = [];process.version = \"\";process.versions = {};function noop() {}process.on = noop;process.addListener = noop;process.once = noop;process.off = noop;process.removeListener = noop;process.removeAllListeners = noop;process.emit = noop;process.binding = function (name) {\n        throw new Error(\"process.binding is not supported\");\n      };process.cwd = function () {\n        return \"/\";\n      };process.chdir = function (dir) {\n        throw new Error(\"process.chdir is not supported\");\n      };process.umask = function () {\n        return 0;\n      };\n    }, {}], 6: [function (require, module, exports) {\n      module.exports = { name: \"ejs\", description: \"Embedded JavaScript templates\", keywords: [\"template\", \"engine\", \"ejs\"], version: \"2.5.5\", author: \"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)\", contributors: [\"Timothy Gu <timothygu99@gmail.com> (https://timothygu.github.io)\"], license: \"Apache-2.0\", main: \"./lib/ejs.js\", repository: { type: \"git\", url: \"git://github.com/mde/ejs.git\" }, bugs: \"https://github.com/mde/ejs/issues\", homepage: \"https://github.com/mde/ejs\", dependencies: {}, devDependencies: { browserify: \"^13.0.1\", eslint: \"^3.0.0\", \"git-directory-deploy\": \"^1.5.1\", istanbul: \"~0.4.3\", jake: \"^8.0.0\", jsdoc: \"^3.4.0\", \"lru-cache\": \"^4.0.1\", mocha: \"^3.0.2\", \"uglify-js\": \"^2.6.2\" }, engines: { node: \">=0.10.0\" }, scripts: { test: \"mocha\", lint: 'eslint \"**/*.js\" Jakefile', coverage: \"istanbul cover node_modules/mocha/bin/_mocha\", doc: \"jake doc\", devdoc: \"jake doc[dev]\" } };\n    }, {}] }, {}, [1])(1);\n});"

/***/ }),
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(41))

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(44))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(45))

/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(47))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(48))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(49))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(7)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(12, function() {
			var newContent = __webpack_require__(12);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(7)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(13, function() {
			var newContent = __webpack_require__(13);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/*!\n * =============================================================\n * dropify v0.2.1 - Override your input files with style.\n * https://github.com/JeremyFagis/dropify\n *\n * (c) 2016 - Jeremy FAGIS <jeremy@fagis.fr> (http://fagis.fr)\n * =============================================================\n */\n\n;(function (root, factory) {\n    if (typeof define === 'function' && define.amd) {\n        define(['jquery'], factory);\n    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {\n        module.exports = factory(require('jquery'));\n    } else {\n        root.Dropify = factory(root.jQuery);\n    }\n})(this, function ($) {\n    var pluginName = \"dropify\";\n\n    /**\n     * Dropify plugin\n     *\n     * @param {Object} element\n     * @param {Array} options\n     */\n    function Dropify(element, options) {\n        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {\n            return;\n        }\n\n        var defaults = {\n            defaultFile: '',\n            maxFileSize: 0,\n            minWidth: 0,\n            maxWidth: 0,\n            minHeight: 0,\n            maxHeight: 0,\n            showRemove: true,\n            showLoader: true,\n            showErrors: true,\n            errorTimeout: 3000,\n            errorsPosition: 'overlay',\n            imgFileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],\n            maxFileSizePreview: \"5M\",\n            allowedFormats: ['portrait', 'square', 'landscape'],\n            allowedFileExtensions: ['*'],\n            messages: {\n                'default': '点击或拖拽上传图片',\n                'replace': '点击或拖拽替换图片',\n                'remove': '移除',\n                'error': '出现错误，请检查'\n            },\n            error: {\n                'fileSize': 'The file size is too big ({{ value }} max).',\n                'minWidth': 'The image width is too small ({{ value }}}px min).',\n                'maxWidth': 'The image width is too big ({{ value }}}px max).',\n                'minHeight': 'The image height is too small ({{ value }}}px min).',\n                'maxHeight': 'The image height is too big ({{ value }}px max).',\n                'imageFormat': 'The image format is not allowed ({{ value }} only).',\n                'fileExtension': 'The file is not allowed ({{ value }} only).'\n            },\n            tpl: {\n                wrap: '<div class=\"dropify-wrapper\"></div>',\n                loader: '<div class=\"dropify-loader\"></div>',\n                message: '<div class=\"dropify-message\"><span class=\"file-icon\" /> <p>{{ default }}</p></div>',\n                preview: '<div class=\"dropify-preview\"><span class=\"dropify-render\"></span><div class=\"dropify-infos\"><div class=\"dropify-infos-inner\"><p class=\"dropify-infos-message\">{{ replace }}</p></div></div></div>',\n                filename: '<p class=\"dropify-filename\"><span class=\"file-icon\"></span> <span class=\"dropify-filename-inner\"></span></p>',\n                clearButton: '<button type=\"button\" class=\"dropify-clear\">{{ remove }}</button>',\n                errorLine: '<p class=\"dropify-error\">{{ error }}</p>',\n                errorsContainer: '<div class=\"dropify-errors-container\"><ul></ul></div>'\n            }\n        };\n\n        this.element = element;\n        this.input = $(this.element);\n        this.wrapper = null;\n        this.preview = null;\n        this.filenameWrapper = null;\n        this.settings = $.extend(true, defaults, options, this.input.data());\n        this.errorsEvent = $.Event('dropify.errors');\n        this.isDisabled = false;\n        this.isInit = false;\n        this.file = {\n            object: null,\n            name: null,\n            size: null,\n            width: null,\n            height: null,\n            type: null\n        };\n\n        if (!Array.isArray(this.settings.allowedFormats)) {\n            this.settings.allowedFormats = this.settings.allowedFormats.split(' ');\n        }\n\n        if (!Array.isArray(this.settings.allowedFileExtensions)) {\n            this.settings.allowedFileExtensions = this.settings.allowedFileExtensions.split(' ');\n        }\n\n        this.onChange = this.onChange.bind(this);\n        this.clearElement = this.clearElement.bind(this);\n        this.onFileReady = this.onFileReady.bind(this);\n\n        this.translateMessages();\n        this.createElements();\n        this.setContainerSize();\n\n        this.errorsEvent.errors = [];\n\n        this.input.on('change', this.onChange);\n    }\n\n    /**\n     * On change event\n     */\n    Dropify.prototype.onChange = function () {\n        this.resetPreview();\n        this.readFile(this.element);\n    };\n\n    /**\n     * Create dom elements\n     */\n    Dropify.prototype.createElements = function () {\n        this.isInit = true;\n        this.input.wrap($(this.settings.tpl.wrap));\n        this.wrapper = this.input.parent();\n\n        var messageWrapper = $(this.settings.tpl.message).insertBefore(this.input);\n        $(this.settings.tpl.errorLine).appendTo(messageWrapper);\n\n        if (this.isTouchDevice() === true) {\n            this.wrapper.addClass('touch-fallback');\n        }\n\n        if (this.input.attr('disabled')) {\n            this.isDisabled = true;\n            this.wrapper.addClass('disabled');\n        }\n\n        if (this.settings.showLoader === true) {\n            this.loader = $(this.settings.tpl.loader);\n            this.loader.insertBefore(this.input);\n        }\n\n        this.preview = $(this.settings.tpl.preview);\n        this.preview.insertAfter(this.input);\n\n        if (this.isDisabled === false && this.settings.showRemove === true) {\n            this.clearButton = $(this.settings.tpl.clearButton);\n            this.clearButton.insertAfter(this.input);\n            this.clearButton.on('click', this.clearElement);\n        }\n\n        this.filenameWrapper = $(this.settings.tpl.filename);\n        this.filenameWrapper.prependTo(this.preview.find('.dropify-infos-inner'));\n\n        if (this.settings.showErrors === true) {\n            this.errorsContainer = $(this.settings.tpl.errorsContainer);\n\n            if (this.settings.errorsPosition === 'outside') {\n                this.errorsContainer.insertAfter(this.wrapper);\n            } else {\n                this.errorsContainer.insertBefore(this.input);\n            }\n        }\n\n        var defaultFile = this.settings.defaultFile || '';\n\n        if (defaultFile.trim() !== '') {\n            this.file.name = this.cleanFilename(defaultFile);\n            this.setPreview(this.isImage(), defaultFile);\n        }\n    };\n\n    /**\n     * Read the file using FileReader\n     *\n     * @param  {Object} input\n     */\n    Dropify.prototype.readFile = function (input) {\n        if (input.files && input.files[0]) {\n            var reader = new FileReader();\n            var image = new Image();\n            var file = input.files[0];\n            var srcBase64 = null;\n            var _this = this;\n            var eventFileReady = $.Event(\"dropify.fileReady\");\n\n            this.clearErrors();\n            this.showLoader();\n            this.setFileInformations(file);\n            this.errorsEvent.errors = [];\n            this.checkFileSize();\n            this.isFileExtensionAllowed();\n\n            if (this.isImage() && this.file.size < this.sizeToByte(this.settings.maxFileSizePreview)) {\n                this.input.on('dropify.fileReady', this.onFileReady);\n                reader.readAsDataURL(file);\n                reader.onload = function (_file) {\n                    srcBase64 = _file.target.result;\n                    image.src = _file.target.result;\n                    image.onload = function () {\n                        _this.setFileDimensions(this.width, this.height);\n                        _this.validateImage();\n                        _this.input.trigger(eventFileReady, [true, srcBase64]);\n                    };\n                }.bind(this);\n            } else {\n                this.onFileReady(false);\n            }\n        }\n    };\n\n    /**\n     * On file ready to show\n     *\n     * @param  {Event} event\n     * @param  {Bool} previewable\n     * @param  {String} src\n     */\n    Dropify.prototype.onFileReady = function (event, previewable, src) {\n        this.input.off('dropify.fileReady', this.onFileReady);\n\n        if (this.errorsEvent.errors.length === 0) {\n            this.setPreview(previewable, src);\n        } else {\n            this.input.trigger(this.errorsEvent, [this]);\n            for (var i = this.errorsEvent.errors.length - 1; i >= 0; i--) {\n                var errorNamespace = this.errorsEvent.errors[i].namespace;\n                var errorKey = errorNamespace.split('.').pop();\n                this.showError(errorKey);\n            }\n\n            if (typeof this.errorsContainer !== \"undefined\") {\n                this.errorsContainer.addClass('visible');\n\n                var errorsContainer = this.errorsContainer;\n                setTimeout(function () {\n                    errorsContainer.removeClass('visible');\n                }, this.settings.errorTimeout);\n            }\n\n            this.wrapper.addClass('has-error');\n            this.resetPreview();\n            this.clearElement();\n        }\n    };\n\n    /**\n     * Set file informations\n     *\n     * @param {File} file\n     */\n    Dropify.prototype.setFileInformations = function (file) {\n        this.file.object = file;\n        this.file.name = file.name;\n        this.file.size = file.size;\n        this.file.type = file.type;\n        this.file.width = null;\n        this.file.height = null;\n    };\n\n    /**\n     * Set file dimensions\n     *\n     * @param {Int} width\n     * @param {Int} height\n     */\n    Dropify.prototype.setFileDimensions = function (width, height) {\n        this.file.width = width;\n        this.file.height = height;\n    };\n\n    /**\n     * Set the preview and animate it\n     *\n     * @param {String} src\n     */\n    Dropify.prototype.setPreview = function (previewable, src) {\n        this.wrapper.removeClass('has-error').addClass('has-preview');\n        this.filenameWrapper.children('.dropify-filename-inner').html(this.file.name);\n        var render = this.preview.children('.dropify-render');\n\n        this.hideLoader();\n\n        if (previewable === true) {\n            var imgTag = $('<img />').attr('src', src);\n\n            if (this.settings.height) {\n                imgTag.css(\"max-height\", this.settings.height);\n            }\n\n            imgTag.appendTo(render);\n        } else {\n            $('<i />').attr('class', 'dropify-font-file').appendTo(render);\n            $('<span class=\"dropify-extension\" />').html(this.getFileType()).appendTo(render);\n        }\n        this.preview.fadeIn();\n    };\n\n    /**\n     * Reset the preview\n     */\n    Dropify.prototype.resetPreview = function () {\n        this.wrapper.removeClass('has-preview');\n        var render = this.preview.children('.dropify-render');\n        render.find('.dropify-extension').remove();\n        render.find('i').remove();\n        render.find('img').remove();\n        this.preview.hide();\n        this.hideLoader();\n    };\n\n    /**\n     * Clean the src and get the filename\n     *\n     * @param  {String} src\n     *\n     * @return {String} filename\n     */\n    Dropify.prototype.cleanFilename = function (src) {\n        var filename = src.split('\\\\').pop();\n        if (filename == src) {\n            filename = src.split('/').pop();\n        }\n\n        return src !== \"\" ? filename : '';\n    };\n\n    /**\n     * Clear the element, events are available\n     */\n    Dropify.prototype.clearElement = function () {\n        if (this.errorsEvent.errors.length === 0) {\n            var eventBefore = $.Event(\"dropify.beforeClear\");\n            this.input.trigger(eventBefore, [this]);\n\n            if (eventBefore.result !== false) {\n                this.resetFile();\n                this.input.val('');\n                this.resetPreview();\n\n                this.input.trigger($.Event(\"dropify.afterClear\"), [this]);\n            }\n        } else {\n            this.resetFile();\n            this.input.val('');\n            this.resetPreview();\n        }\n    };\n\n    /**\n     * Reset file informations\n     */\n    Dropify.prototype.resetFile = function () {\n        this.file.object = null;\n        this.file.name = null;\n        this.file.size = null;\n        this.file.type = null;\n        this.file.width = null;\n        this.file.height = null;\n    };\n\n    /**\n     * Set the container height\n     */\n    Dropify.prototype.setContainerSize = function () {\n        if (this.settings.height) {\n            this.wrapper.height(this.settings.height);\n        }\n    };\n\n    /**\n     * Test if it's touch screen\n     *\n     * @return {Boolean}\n     */\n    Dropify.prototype.isTouchDevice = function () {\n        return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;\n    };\n\n    /**\n     * Get the file type.\n     *\n     * @return {String}\n     */\n    Dropify.prototype.getFileType = function () {\n        return this.file.name.split('.').pop().toLowerCase();\n    };\n\n    /**\n     * Test if the file is an image\n     *\n     * @return {Boolean}\n     */\n    Dropify.prototype.isImage = function () {\n        if (this.settings.imgFileExtensions.indexOf(this.getFileType()) != \"-1\") {\n            return true;\n        }\n\n        return false;\n    };\n\n    /**\n    * Test if the file extension is allowed\n    *\n    * @return {Boolean}\n    */\n    Dropify.prototype.isFileExtensionAllowed = function () {\n\n        if (this.settings.allowedFileExtensions.indexOf('*') != \"-1\" || this.settings.allowedFileExtensions.indexOf(this.getFileType()) != \"-1\") {\n            return true;\n        }\n        this.pushError(\"fileExtension\");\n\n        return false;\n    };\n\n    /**\n     * Translate messages if needed.\n     */\n    Dropify.prototype.translateMessages = function () {\n        for (var name in this.settings.tpl) {\n            for (var key in this.settings.messages) {\n                this.settings.tpl[name] = this.settings.tpl[name].replace('{{ ' + key + ' }}', this.settings.messages[key]);\n            }\n        }\n    };\n\n    /**\n     * Check the limit filesize.\n     */\n    Dropify.prototype.checkFileSize = function () {\n        if (this.sizeToByte(this.settings.maxFileSize) !== 0 && this.file.size > this.sizeToByte(this.settings.maxFileSize)) {\n            this.pushError(\"fileSize\");\n        }\n    };\n\n    /**\n     * Convert filesize to byte.\n     *\n     * @return {Int} value\n     */\n    Dropify.prototype.sizeToByte = function (size) {\n        var value = 0;\n\n        if (size !== 0) {\n            var unit = size.slice(-1).toUpperCase(),\n                kb = 1024,\n                mb = kb * 1024,\n                gb = mb * 1024;\n\n            if (unit === 'K') {\n                value = parseFloat(size) * kb;\n            } else if (unit === 'M') {\n                value = parseFloat(size) * mb;\n            } else if (unit === 'G') {\n                value = parseFloat(size) * gb;\n            }\n        }\n\n        return value;\n    };\n\n    /**\n     * Validate image dimensions and format\n     */\n    Dropify.prototype.validateImage = function () {\n        if (this.settings.minWidth !== 0 && this.settings.minWidth >= this.file.width) {\n            this.pushError(\"minWidth\");\n        }\n\n        if (this.settings.maxWidth !== 0 && this.settings.maxWidth <= this.file.width) {\n            this.pushError(\"maxWidth\");\n        }\n\n        if (this.settings.minHeight !== 0 && this.settings.minHeight >= this.file.height) {\n            this.pushError(\"minHeight\");\n        }\n\n        if (this.settings.maxHeight !== 0 && this.settings.maxHeight <= this.file.height) {\n            this.pushError(\"maxHeight\");\n        }\n\n        if (this.settings.allowedFormats.indexOf(this.getImageFormat()) == \"-1\") {\n            this.pushError(\"imageFormat\");\n        }\n    };\n\n    /**\n     * Get image format.\n     *\n     * @return {String}\n     */\n    Dropify.prototype.getImageFormat = function () {\n        if (this.file.width == this.file.height) {\n            return \"square\";\n        }\n\n        if (this.file.width < this.file.height) {\n            return \"portrait\";\n        }\n\n        if (this.file.width > this.file.height) {\n            return \"landscape\";\n        }\n    };\n\n    /**\n    * Push error\n    *\n    * @param {String} errorKey\n    */\n    Dropify.prototype.pushError = function (errorKey) {\n        var e = $.Event(\"dropify.error.\" + errorKey);\n        this.errorsEvent.errors.push(e);\n        this.input.trigger(e, [this]);\n    };\n\n    /**\n     * Clear errors\n     */\n    Dropify.prototype.clearErrors = function () {\n        if (typeof this.errorsContainer !== \"undefined\") {\n            this.errorsContainer.children('ul').html('');\n        }\n    };\n\n    /**\n     * Show error in DOM\n     *\n     * @param  {String} errorKey\n     */\n    Dropify.prototype.showError = function (errorKey) {\n        if (typeof this.errorsContainer !== \"undefined\") {\n            this.errorsContainer.children('ul').append('<li>' + this.getError(errorKey) + '</li>');\n        }\n    };\n\n    /**\n     * Get error message\n     *\n     * @return  {String} message\n     */\n    Dropify.prototype.getError = function (errorKey) {\n        var error = this.settings.error[errorKey],\n            value = '';\n\n        if (errorKey === 'fileSize') {\n            value = this.settings.maxFileSize;\n        } else if (errorKey === 'minWidth') {\n            value = this.settings.minWidth;\n        } else if (errorKey === 'maxWidth') {\n            value = this.settings.maxWidth;\n        } else if (errorKey === 'minHeight') {\n            value = this.settings.minHeight;\n        } else if (errorKey === 'maxHeight') {\n            value = this.settings.maxHeight;\n        } else if (errorKey === 'imageFormat') {\n            value = this.settings.allowedFormats.join(', ');\n        } else if (errorKey === 'fileExtension') {\n            value = this.settings.allowedFileExtensions.join(', ');\n        }\n\n        if (value !== '') {\n            return error.replace('{{ value }}', value);\n        }\n\n        return error;\n    };\n\n    /**\n     * Show the loader\n     */\n    Dropify.prototype.showLoader = function () {\n        if (typeof this.loader !== \"undefined\") {\n            this.loader.show();\n        }\n    };\n\n    /**\n     * Hide the loader\n     */\n    Dropify.prototype.hideLoader = function () {\n        if (typeof this.loader !== \"undefined\") {\n            this.loader.hide();\n        }\n    };\n\n    /**\n     * Destroy dropify\n     */\n    Dropify.prototype.destroy = function () {\n        this.input.siblings().remove();\n        this.input.unwrap();\n        this.isInit = false;\n    };\n\n    /**\n     * Init dropify\n     */\n    Dropify.prototype.init = function () {\n        this.createElements();\n    };\n\n    /**\n     * Test if element is init\n     */\n    Dropify.prototype.isDropified = function () {\n        return this.isInit;\n    };\n\n    $.fn[pluginName] = function (options) {\n        this.each(function () {\n            if (!$.data(this, pluginName)) {\n                $.data(this, pluginName, new Dropify(this, options));\n            }\n        });\n\n        return this;\n    };\n\n    return Dropify;\n});"

/***/ }),
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/*! layPage-v1.3.0 分页组件 License MIT  http://laypage.layui.com/ By 贤心 */\n\n// &&f.use(a.dir,e)被手动删除\n;!function () {\n  \"use strict\";\n  function a(d) {\n    var e = \"laypagecss\";a.dir = \"dir\" in a ? a.dir : f.getpath + \"../css/laypage.css\", new f(d), a.dir && !b[c](e);\n  }a.v = \"1.3\";var b = document,\n      c = \"getElementById\",\n      d = \"getElementsByTagName\",\n      e = 0,\n      f = function f(a) {\n    var b = this,\n        c = b.config = a || {};c.item = e++, b.render(!0);\n  };f.on = function (a, b, c) {\n    return a.attachEvent ? a.attachEvent(\"on\" + b, function () {\n      c.call(a, window.even);\n    }) : a.addEventListener(b, c, !1), f;\n  }, f.getpath = function () {\n    var a = document.scripts,\n        b = a[a.length - 1].src;return b.substring(0, b.lastIndexOf(\"/\") + 1);\n  }(), f.use = function (c, e) {\n    var f = b.createElement(\"link\");f.type = \"text/css\", f.rel = \"stylesheet\", f.href = a.dir, e && (f.id = e), b[d](\"head\")[0].appendChild(f), f = null;\n  }, f.prototype.type = function () {\n    var a = this.config;return \"object\" == _typeof(a.cont) ? void 0 === a.cont.length ? 2 : 3 : void 0;\n  }, f.prototype.view = function () {\n    var b = this,\n        c = b.config,\n        d = [],\n        e = {};if (c.pages = 0 | c.pages, c.curr = 0 | c.curr || 1, c.groups = \"groups\" in c ? 0 | c.groups : 5, c.first = \"first\" in c ? c.first : \"&#x9996;&#x9875;\", c.last = \"last\" in c ? c.last : \"&#x5C3E;&#x9875;\", c.prev = \"prev\" in c ? c.prev : \"&#x4E0A;&#x4E00;&#x9875;\", c.next = \"next\" in c ? c.next : \"&#x4E0B;&#x4E00;&#x9875;\", c.pages <= 1) return \"\";for (c.groups > c.pages && (c.groups = c.pages), e.index = Math.ceil((c.curr + (c.groups > 1 && c.groups !== c.pages ? 1 : 0)) / (0 === c.groups ? 1 : c.groups)), c.curr > 1 && c.prev && d.push('<a href=\"javascript:;\" class=\"laypage_prev\" data-page=\"' + (c.curr - 1) + '\">' + c.prev + \"</a>\"), e.index > 1 && c.first && 0 !== c.groups && d.push('<a href=\"javascript:;\" class=\"laypage_first\" data-page=\"1\"  title=\"&#x9996;&#x9875;\">' + c.first + \"</a><span>&#x2026;</span>\"), e.poor = Math.floor((c.groups - 1) / 2), e.start = e.index > 1 ? c.curr - e.poor : 1, e.end = e.index > 1 ? function () {\n      var a = c.curr + (c.groups - e.poor - 1);return a > c.pages ? c.pages : a;\n    }() : c.groups, e.end - e.start < c.groups - 1 && (e.start = e.end - c.groups + 1); e.start <= e.end; e.start++) {\n      e.start === c.curr ? d.push('<span class=\"laypage_curr\" ' + (/^#/.test(c.skin) ? 'style=\"background-color:' + c.skin + '\"' : \"\") + \">\" + e.start + \"</span>\") : d.push('<a href=\"javascript:;\" data-page=\"' + e.start + '\">' + e.start + \"</a>\");\n    }return c.pages > c.groups && e.end < c.pages && c.last && 0 !== c.groups && d.push('<span>&#x2026;</span><a href=\"javascript:;\" class=\"laypage_last\" title=\"&#x5C3E;&#x9875;\"  data-page=\"' + c.pages + '\">' + c.last + \"</a>\"), e.flow = !c.prev && 0 === c.groups, (c.curr !== c.pages && c.next || e.flow) && d.push(function () {\n      return e.flow && c.curr === c.pages ? '<span class=\"page_nomore\" title=\"&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;\">' + c.next + \"</span>\" : '<a href=\"javascript:;\" class=\"laypage_next\" data-page=\"' + (c.curr + 1) + '\">' + c.next + \"</a>\";\n    }()), '<div name=\"laypage' + a.v + '\" class=\"laypage_main laypageskin_' + (c.skin ? function (a) {\n      return (/^#/.test(a) ? \"molv\" : a\n      );\n    }(c.skin) : \"default\") + '\" id=\"laypage_' + b.config.item + '\">' + d.join(\"\") + function () {\n      return c.skip ? '<span class=\"laypage_total\"><label>&#x5230;&#x7B2C;</label><input type=\"number\" min=\"1\" onkeyup=\"this.value=this.value.replace(/\\\\D/, \\'\\');\" class=\"laypage_skip\"><label>&#x9875;</label><button type=\"button\" class=\"laypage_btn\">&#x786e;&#x5b9a;</button></span>' : \"\";\n    }() + \"</div>\";\n  }, f.prototype.jump = function (a) {\n    if (a) {\n      for (var b = this, c = b.config, e = a.children, g = a[d](\"button\")[0], h = a[d](\"input\")[0], i = 0, j = e.length; j > i; i++) {\n        \"a\" === e[i].nodeName.toLowerCase() && f.on(e[i], \"click\", function () {\n          var a = 0 | this.getAttribute(\"data-page\");c.curr = a, b.render();\n        });\n      }g && f.on(g, \"click\", function () {\n        var a = 0 | h.value.replace(/\\s|\\D/g, \"\");a && a <= c.pages && (c.curr = a, b.render());\n      });\n    }\n  }, f.prototype.render = function (a) {\n    var d = this,\n        e = d.config,\n        f = d.type(),\n        g = d.view();2 === f ? e.cont.innerHTML = g : 3 === f ? e.cont.html(g) : b[c](e.cont).innerHTML = g, e.jump && e.jump(e, a), d.jump(b[c](\"laypage_\" + e.item)), e.hash && !a && (location.hash = \"!\" + e.hash + \"=\" + e.curr);\n  }, \"function\" == typeof define ? define(function () {\n    return a;\n  }) : \"undefined\" != typeof exports ? module.exports = a : window.laypage = a;\n}();"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/*!\r\n * Masonry PACKAGED v4.1.1\r\n * Cascading grid layout library\r\n * http://masonry.desandro.com\r\n * MIT License\r\n * by David DeSandro\r\n */\n\n/**\r\n * Bridget makes jQuery widgets\r\n * v2.0.1\r\n * MIT license\r\n */\n\n/* jshint browser: true, strict: true, undef: true, unused: true */\n\n(function (window, factory) {\n  // universal module definition\n  /*jshint strict: false */ /* globals define, module, require */\n  if (typeof define == 'function' && define.amd) {\n    // AMD\n    define('jquery-bridget/jquery-bridget', ['jquery'], function (jQuery) {\n      return factory(window, jQuery);\n    });\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS\n    module.exports = factory(window, require('jquery'));\n  } else {\n    // browser global\n    window.jQueryBridget = factory(window, window.jQuery);\n  }\n})(window, function factory(window, jQuery) {\n  'use strict';\n\n  // ----- utils ----- //\n\n  var arraySlice = Array.prototype.slice;\n\n  // helper function for logging errors\n  // $.error breaks jQuery chaining\n  var console = window.console;\n  var logError = typeof console == 'undefined' ? function () {} : function (message) {\n    console.error(message);\n  };\n\n  // ----- jQueryBridget ----- //\n\n  function jQueryBridget(namespace, PluginClass, $) {\n    $ = $ || jQuery || window.jQuery;\n    if (!$) {\n      return;\n    }\n\n    // add option method -> $().plugin('option', {...})\n    if (!PluginClass.prototype.option) {\n      // option setter\n      PluginClass.prototype.option = function (opts) {\n        // bail out if not an object\n        if (!$.isPlainObject(opts)) {\n          return;\n        }\n        this.options = $.extend(true, this.options, opts);\n      };\n    }\n\n    // make jQuery plugin\n    $.fn[namespace] = function (arg0 /*, arg1 */) {\n      if (typeof arg0 == 'string') {\n        // method call $().plugin( 'methodName', { options } )\n        // shift arguments by 1\n        var args = arraySlice.call(arguments, 1);\n        return methodCall(this, arg0, args);\n      }\n      // just $().plugin({ options })\n      plainCall(this, arg0);\n      return this;\n    };\n\n    // $().plugin('methodName')\n    function methodCall($elems, methodName, args) {\n      var returnValue;\n      var pluginMethodStr = '$().' + namespace + '(\"' + methodName + '\")';\n\n      $elems.each(function (i, elem) {\n        // get instance\n        var instance = $.data(elem, namespace);\n        if (!instance) {\n          logError(namespace + ' not initialized. Cannot call methods, i.e. ' + pluginMethodStr);\n          return;\n        }\n\n        var method = instance[methodName];\n        if (!method || methodName.charAt(0) == '_') {\n          logError(pluginMethodStr + ' is not a valid method');\n          return;\n        }\n\n        // apply method, get return value\n        var value = method.apply(instance, args);\n        // set return value if value is returned, use only first value\n        returnValue = returnValue === undefined ? value : returnValue;\n      });\n\n      return returnValue !== undefined ? returnValue : $elems;\n    }\n\n    function plainCall($elems, options) {\n      $elems.each(function (i, elem) {\n        var instance = $.data(elem, namespace);\n        if (instance) {\n          // set options & init\n          instance.option(options);\n          instance._init();\n        } else {\n          // initialize new instance\n          instance = new PluginClass(elem, options);\n          $.data(elem, namespace, instance);\n        }\n      });\n    }\n\n    updateJQuery($);\n  }\n\n  // ----- updateJQuery ----- //\n\n  // set $.bridget for v1 backwards compatibility\n  function updateJQuery($) {\n    if (!$ || $ && $.bridget) {\n      return;\n    }\n    $.bridget = jQueryBridget;\n  }\n\n  updateJQuery(jQuery || window.jQuery);\n\n  // -----  ----- //\n\n  return jQueryBridget;\n});\n\n/**\r\n * EvEmitter v1.0.3\r\n * Lil' event emitter\r\n * MIT License\r\n */\n\n/* jshint unused: true, undef: true, strict: true */\n\n(function (global, factory) {\n  // universal module definition\n  /* jshint strict: false */ /* globals define, module, window */\n  if (typeof define == 'function' && define.amd) {\n    // AMD - RequireJS\n    define('ev-emitter/ev-emitter', factory);\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS - Browserify, Webpack\n    module.exports = factory();\n  } else {\n    // Browser globals\n    global.EvEmitter = factory();\n  }\n})(typeof window != 'undefined' ? window : this, function () {\n\n  function EvEmitter() {}\n\n  var proto = EvEmitter.prototype;\n\n  proto.on = function (eventName, listener) {\n    if (!eventName || !listener) {\n      return;\n    }\n    // set events hash\n    var events = this._events = this._events || {};\n    // set listeners array\n    var listeners = events[eventName] = events[eventName] || [];\n    // only add once\n    if (listeners.indexOf(listener) == -1) {\n      listeners.push(listener);\n    }\n\n    return this;\n  };\n\n  proto.once = function (eventName, listener) {\n    if (!eventName || !listener) {\n      return;\n    }\n    // add event\n    this.on(eventName, listener);\n    // set once flag\n    // set onceEvents hash\n    var onceEvents = this._onceEvents = this._onceEvents || {};\n    // set onceListeners object\n    var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};\n    // set flag\n    onceListeners[listener] = true;\n\n    return this;\n  };\n\n  proto.off = function (eventName, listener) {\n    var listeners = this._events && this._events[eventName];\n    if (!listeners || !listeners.length) {\n      return;\n    }\n    var index = listeners.indexOf(listener);\n    if (index != -1) {\n      listeners.splice(index, 1);\n    }\n\n    return this;\n  };\n\n  proto.emitEvent = function (eventName, args) {\n    var listeners = this._events && this._events[eventName];\n    if (!listeners || !listeners.length) {\n      return;\n    }\n    var i = 0;\n    var listener = listeners[i];\n    args = args || [];\n    // once stuff\n    var onceListeners = this._onceEvents && this._onceEvents[eventName];\n\n    while (listener) {\n      var isOnce = onceListeners && onceListeners[listener];\n      if (isOnce) {\n        // remove listener\n        // remove before trigger to prevent recursion\n        this.off(eventName, listener);\n        // unset once flag\n        delete onceListeners[listener];\n      }\n      // trigger listener\n      listener.apply(this, args);\n      // get next listener\n      i += isOnce ? 0 : 1;\n      listener = listeners[i];\n    }\n\n    return this;\n  };\n\n  return EvEmitter;\n});\n\n/*!\r\n * getSize v2.0.2\r\n * measure size of elements\r\n * MIT license\r\n */\n\n/*jshint browser: true, strict: true, undef: true, unused: true */\n/*global define: false, module: false, console: false */\n\n(function (window, factory) {\n  'use strict';\n\n  if (typeof define == 'function' && define.amd) {\n    // AMD\n    define('get-size/get-size', [], function () {\n      return factory();\n    });\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS\n    module.exports = factory();\n  } else {\n    // browser global\n    window.getSize = factory();\n  }\n})(window, function factory() {\n  'use strict';\n\n  // -------------------------- helpers -------------------------- //\n\n  // get a number from a string, not a percentage\n\n  function getStyleSize(value) {\n    var num = parseFloat(value);\n    // not a percent like '100%', and a number\n    var isValid = value.indexOf('%') == -1 && !isNaN(num);\n    return isValid && num;\n  }\n\n  function noop() {}\n\n  var logError = typeof console == 'undefined' ? noop : function (message) {\n    console.error(message);\n  };\n\n  // -------------------------- measurements -------------------------- //\n\n  var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];\n\n  var measurementsLength = measurements.length;\n\n  function getZeroSize() {\n    var size = {\n      width: 0,\n      height: 0,\n      innerWidth: 0,\n      innerHeight: 0,\n      outerWidth: 0,\n      outerHeight: 0\n    };\n    for (var i = 0; i < measurementsLength; i++) {\n      var measurement = measurements[i];\n      size[measurement] = 0;\n    }\n    return size;\n  }\n\n  // -------------------------- getStyle -------------------------- //\n\n  /**\r\n   * getStyle, get style of element, check for Firefox bug\r\n   * https://bugzilla.mozilla.org/show_bug.cgi?id=548397\r\n   */\n  function getStyle(elem) {\n    var style = getComputedStyle(elem);\n    if (!style) {\n      logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1');\n    }\n    return style;\n  }\n\n  // -------------------------- setup -------------------------- //\n\n  var isSetup = false;\n\n  var isBoxSizeOuter;\n\n  /**\r\n   * setup\r\n   * check isBoxSizerOuter\r\n   * do on first getSize() rather than on page load for Firefox bug\r\n   */\n  function setup() {\n    // setup once\n    if (isSetup) {\n      return;\n    }\n    isSetup = true;\n\n    // -------------------------- box sizing -------------------------- //\n\n    /**\r\n     * WebKit measures the outer-width on style.width on border-box elems\r\n     * IE & Firefox<29 measures the inner-width\r\n     */\n    var div = document.createElement('div');\n    div.style.width = '200px';\n    div.style.padding = '1px 2px 3px 4px';\n    div.style.borderStyle = 'solid';\n    div.style.borderWidth = '1px 2px 3px 4px';\n    div.style.boxSizing = 'border-box';\n\n    var body = document.body || document.documentElement;\n    body.appendChild(div);\n    var style = getStyle(div);\n\n    getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200;\n    body.removeChild(div);\n  }\n\n  // -------------------------- getSize -------------------------- //\n\n  function getSize(elem) {\n    setup();\n\n    // use querySeletor if elem is string\n    if (typeof elem == 'string') {\n      elem = document.querySelector(elem);\n    }\n\n    // do not proceed on non-objects\n    if (!elem || (typeof elem === 'undefined' ? 'undefined' : _typeof(elem)) != 'object' || !elem.nodeType) {\n      return;\n    }\n\n    var style = getStyle(elem);\n\n    // if hidden, everything is 0\n    if (style.display == 'none') {\n      return getZeroSize();\n    }\n\n    var size = {};\n    size.width = elem.offsetWidth;\n    size.height = elem.offsetHeight;\n\n    var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';\n\n    // get all measurements\n    for (var i = 0; i < measurementsLength; i++) {\n      var measurement = measurements[i];\n      var value = style[measurement];\n      var num = parseFloat(value);\n      // any 'auto', 'medium' value will be 0\n      size[measurement] = !isNaN(num) ? num : 0;\n    }\n\n    var paddingWidth = size.paddingLeft + size.paddingRight;\n    var paddingHeight = size.paddingTop + size.paddingBottom;\n    var marginWidth = size.marginLeft + size.marginRight;\n    var marginHeight = size.marginTop + size.marginBottom;\n    var borderWidth = size.borderLeftWidth + size.borderRightWidth;\n    var borderHeight = size.borderTopWidth + size.borderBottomWidth;\n\n    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;\n\n    // overwrite width and height if we can get it from style\n    var styleWidth = getStyleSize(style.width);\n    if (styleWidth !== false) {\n      size.width = styleWidth + (\n      // add padding and border unless it's already including it\n      isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);\n    }\n\n    var styleHeight = getStyleSize(style.height);\n    if (styleHeight !== false) {\n      size.height = styleHeight + (\n      // add padding and border unless it's already including it\n      isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);\n    }\n\n    size.innerWidth = size.width - (paddingWidth + borderWidth);\n    size.innerHeight = size.height - (paddingHeight + borderHeight);\n\n    size.outerWidth = size.width + marginWidth;\n    size.outerHeight = size.height + marginHeight;\n\n    return size;\n  }\n\n  return getSize;\n});\n\n/**\r\n * matchesSelector v2.0.1\r\n * matchesSelector( element, '.selector' )\r\n * MIT license\r\n */\n\n/*jshint browser: true, strict: true, undef: true, unused: true */\n\n(function (window, factory) {\n  /*global define: false, module: false */\n  'use strict';\n  // universal module definition\n\n  if (typeof define == 'function' && define.amd) {\n    // AMD\n    define('desandro-matches-selector/matches-selector', factory);\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS\n    module.exports = factory();\n  } else {\n    // browser global\n    window.matchesSelector = factory();\n  }\n})(window, function factory() {\n  'use strict';\n\n  var matchesMethod = function () {\n    var ElemProto = Element.prototype;\n    // check for the standard method name first\n    if (ElemProto.matches) {\n      return 'matches';\n    }\n    // check un-prefixed\n    if (ElemProto.matchesSelector) {\n      return 'matchesSelector';\n    }\n    // check vendor prefixes\n    var prefixes = ['webkit', 'moz', 'ms', 'o'];\n\n    for (var i = 0; i < prefixes.length; i++) {\n      var prefix = prefixes[i];\n      var method = prefix + 'MatchesSelector';\n      if (ElemProto[method]) {\n        return method;\n      }\n    }\n  }();\n\n  return function matchesSelector(elem, selector) {\n    return elem[matchesMethod](selector);\n  };\n});\n\n/**\r\n * Fizzy UI utils v2.0.2\r\n * MIT license\r\n */\n\n/*jshint browser: true, undef: true, unused: true, strict: true */\n\n(function (window, factory) {\n  // universal module definition\n  /*jshint strict: false */ /*globals define, module, require */\n\n  if (typeof define == 'function' && define.amd) {\n    // AMD\n    define('fizzy-ui-utils/utils', ['desandro-matches-selector/matches-selector'], function (matchesSelector) {\n      return factory(window, matchesSelector);\n    });\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS\n    module.exports = factory(window, require('desandro-matches-selector'));\n  } else {\n    // browser global\n    window.fizzyUIUtils = factory(window, window.matchesSelector);\n  }\n})(window, function factory(window, matchesSelector) {\n\n  var utils = {};\n\n  // ----- extend ----- //\n\n  // extends objects\n  utils.extend = function (a, b) {\n    for (var prop in b) {\n      a[prop] = b[prop];\n    }\n    return a;\n  };\n\n  // ----- modulo ----- //\n\n  utils.modulo = function (num, div) {\n    return (num % div + div) % div;\n  };\n\n  // ----- makeArray ----- //\n\n  // turn element or nodeList into an array\n  utils.makeArray = function (obj) {\n    var ary = [];\n    if (Array.isArray(obj)) {\n      // use object if already an array\n      ary = obj;\n    } else if (obj && typeof obj.length == 'number') {\n      // convert nodeList to array\n      for (var i = 0; i < obj.length; i++) {\n        ary.push(obj[i]);\n      }\n    } else {\n      // array of single index\n      ary.push(obj);\n    }\n    return ary;\n  };\n\n  // ----- removeFrom ----- //\n\n  utils.removeFrom = function (ary, obj) {\n    var index = ary.indexOf(obj);\n    if (index != -1) {\n      ary.splice(index, 1);\n    }\n  };\n\n  // ----- getParent ----- //\n\n  utils.getParent = function (elem, selector) {\n    while (elem != document.body) {\n      elem = elem.parentNode;\n      if (matchesSelector(elem, selector)) {\n        return elem;\n      }\n    }\n  };\n\n  // ----- getQueryElement ----- //\n\n  // use element as selector string\n  utils.getQueryElement = function (elem) {\n    if (typeof elem == 'string') {\n      return document.querySelector(elem);\n    }\n    return elem;\n  };\n\n  // ----- handleEvent ----- //\n\n  // enable .ontype to trigger from .addEventListener( elem, 'type' )\n  utils.handleEvent = function (event) {\n    var method = 'on' + event.type;\n    if (this[method]) {\n      this[method](event);\n    }\n  };\n\n  // ----- filterFindElements ----- //\n\n  utils.filterFindElements = function (elems, selector) {\n    // make array of elems\n    elems = utils.makeArray(elems);\n    var ffElems = [];\n\n    elems.forEach(function (elem) {\n      // check that elem is an actual element\n      if (!(elem instanceof HTMLElement)) {\n        return;\n      }\n      // add elem if no selector\n      if (!selector) {\n        ffElems.push(elem);\n        return;\n      }\n      // filter & find items if we have a selector\n      // filter\n      if (matchesSelector(elem, selector)) {\n        ffElems.push(elem);\n      }\n      // find children\n      var childElems = elem.querySelectorAll(selector);\n      // concat childElems to filterFound array\n      for (var i = 0; i < childElems.length; i++) {\n        ffElems.push(childElems[i]);\n      }\n    });\n\n    return ffElems;\n  };\n\n  // ----- debounceMethod ----- //\n\n  utils.debounceMethod = function (_class, methodName, threshold) {\n    // original method\n    var method = _class.prototype[methodName];\n    var timeoutName = methodName + 'Timeout';\n\n    _class.prototype[methodName] = function () {\n      var timeout = this[timeoutName];\n      if (timeout) {\n        clearTimeout(timeout);\n      }\n      var args = arguments;\n\n      var _this = this;\n      this[timeoutName] = setTimeout(function () {\n        method.apply(_this, args);\n        delete _this[timeoutName];\n      }, threshold || 100);\n    };\n  };\n\n  // ----- docReady ----- //\n\n  utils.docReady = function (callback) {\n    var readyState = document.readyState;\n    if (readyState == 'complete' || readyState == 'interactive') {\n      callback();\n    } else {\n      document.addEventListener('DOMContentLoaded', callback);\n    }\n  };\n\n  // ----- htmlInit ----- //\n\n  // http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/\n  utils.toDashed = function (str) {\n    return str.replace(/(.)([A-Z])/g, function (match, $1, $2) {\n      return $1 + '-' + $2;\n    }).toLowerCase();\n  };\n\n  var console = window.console;\n  /**\r\n   * allow user to initialize classes via [data-namespace] or .js-namespace class\r\n   * htmlInit( Widget, 'widgetName' )\r\n   * options are parsed from data-namespace-options\r\n   */\n  utils.htmlInit = function (WidgetClass, namespace) {\n    utils.docReady(function () {\n      var dashedNamespace = utils.toDashed(namespace);\n      var dataAttr = 'data-' + dashedNamespace;\n      var dataAttrElems = document.querySelectorAll('[' + dataAttr + ']');\n      var jsDashElems = document.querySelectorAll('.js-' + dashedNamespace);\n      var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));\n      var dataOptionsAttr = dataAttr + '-options';\n      var jQuery = window.jQuery;\n\n      elems.forEach(function (elem) {\n        var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);\n        var options;\n        try {\n          options = attr && JSON.parse(attr);\n        } catch (error) {\n          // log error, do not initialize\n          if (console) {\n            console.error('Error parsing ' + dataAttr + ' on ' + elem.className + ': ' + error);\n          }\n          return;\n        }\n        // initialize\n        var instance = new WidgetClass(elem, options);\n        // make available via $().data('layoutname')\n        if (jQuery) {\n          jQuery.data(elem, namespace, instance);\n        }\n      });\n    });\n  };\n\n  // -----  ----- //\n\n  return utils;\n});\n\n/**\r\n * Outlayer Item\r\n */\n\n(function (window, factory) {\n  // universal module definition\n  /* jshint strict: false */ /* globals define, module, require */\n  if (typeof define == 'function' && define.amd) {\n    // AMD - RequireJS\n    define('outlayer/item', ['ev-emitter/ev-emitter', 'get-size/get-size'], factory);\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS - Browserify, Webpack\n    module.exports = factory(require('ev-emitter'), require('get-size'));\n  } else {\n    // browser global\n    window.Outlayer = {};\n    window.Outlayer.Item = factory(window.EvEmitter, window.getSize);\n  }\n})(window, function factory(EvEmitter, getSize) {\n  'use strict';\n\n  // ----- helpers ----- //\n\n  function isEmptyObj(obj) {\n    for (var prop in obj) {\n      return false;\n    }\n    prop = null;\n    return true;\n  }\n\n  // -------------------------- CSS3 support -------------------------- //\n\n\n  var docElemStyle = document.documentElement.style;\n\n  var transitionProperty = typeof docElemStyle.transition == 'string' ? 'transition' : 'WebkitTransition';\n  var transformProperty = typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';\n\n  var transitionEndEvent = {\n    WebkitTransition: 'webkitTransitionEnd',\n    transition: 'transitionend'\n  }[transitionProperty];\n\n  // cache all vendor properties that could have vendor prefix\n  var vendorProperties = {\n    transform: transformProperty,\n    transition: transitionProperty,\n    transitionDuration: transitionProperty + 'Duration',\n    transitionProperty: transitionProperty + 'Property',\n    transitionDelay: transitionProperty + 'Delay'\n  };\n\n  // -------------------------- Item -------------------------- //\n\n  function Item(element, layout) {\n    if (!element) {\n      return;\n    }\n\n    this.element = element;\n    // parent layout class, i.e. Masonry, Isotope, or Packery\n    this.layout = layout;\n    this.position = {\n      x: 0,\n      y: 0\n    };\n\n    this._create();\n  }\n\n  // inherit EvEmitter\n  var proto = Item.prototype = Object.create(EvEmitter.prototype);\n  proto.constructor = Item;\n\n  proto._create = function () {\n    // transition objects\n    this._transn = {\n      ingProperties: {},\n      clean: {},\n      onEnd: {}\n    };\n\n    this.css({\n      position: 'absolute'\n    });\n  };\n\n  // trigger specified handler for event type\n  proto.handleEvent = function (event) {\n    var method = 'on' + event.type;\n    if (this[method]) {\n      this[method](event);\n    }\n  };\n\n  proto.getSize = function () {\n    this.size = getSize(this.element);\n  };\n\n  /**\r\n   * apply CSS styles to element\r\n   * @param {Object} style\r\n   */\n  proto.css = function (style) {\n    var elemStyle = this.element.style;\n\n    for (var prop in style) {\n      // use vendor property if available\n      var supportedProp = vendorProperties[prop] || prop;\n      elemStyle[supportedProp] = style[prop];\n    }\n  };\n\n  // measure position, and sets it\n  proto.getPosition = function () {\n    var style = getComputedStyle(this.element);\n    var isOriginLeft = this.layout._getOption('originLeft');\n    var isOriginTop = this.layout._getOption('originTop');\n    var xValue = style[isOriginLeft ? 'left' : 'right'];\n    var yValue = style[isOriginTop ? 'top' : 'bottom'];\n    // convert percent to pixels\n    var layoutSize = this.layout.size;\n    var x = xValue.indexOf('%') != -1 ? parseFloat(xValue) / 100 * layoutSize.width : parseInt(xValue, 10);\n    var y = yValue.indexOf('%') != -1 ? parseFloat(yValue) / 100 * layoutSize.height : parseInt(yValue, 10);\n\n    // clean up 'auto' or other non-integer values\n    x = isNaN(x) ? 0 : x;\n    y = isNaN(y) ? 0 : y;\n    // remove padding from measurement\n    x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;\n    y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;\n\n    this.position.x = x;\n    this.position.y = y;\n  };\n\n  // set settled position, apply padding\n  proto.layoutPosition = function () {\n    var layoutSize = this.layout.size;\n    var style = {};\n    var isOriginLeft = this.layout._getOption('originLeft');\n    var isOriginTop = this.layout._getOption('originTop');\n\n    // x\n    var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';\n    var xProperty = isOriginLeft ? 'left' : 'right';\n    var xResetProperty = isOriginLeft ? 'right' : 'left';\n\n    var x = this.position.x + layoutSize[xPadding];\n    // set in percentage or pixels\n    style[xProperty] = this.getXValue(x);\n    // reset other property\n    style[xResetProperty] = '';\n\n    // y\n    var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';\n    var yProperty = isOriginTop ? 'top' : 'bottom';\n    var yResetProperty = isOriginTop ? 'bottom' : 'top';\n\n    var y = this.position.y + layoutSize[yPadding];\n    // set in percentage or pixels\n    style[yProperty] = this.getYValue(y);\n    // reset other property\n    style[yResetProperty] = '';\n\n    this.css(style);\n    this.emitEvent('layout', [this]);\n  };\n\n  proto.getXValue = function (x) {\n    var isHorizontal = this.layout._getOption('horizontal');\n    return this.layout.options.percentPosition && !isHorizontal ? x / this.layout.size.width * 100 + '%' : x + 'px';\n  };\n\n  proto.getYValue = function (y) {\n    var isHorizontal = this.layout._getOption('horizontal');\n    return this.layout.options.percentPosition && isHorizontal ? y / this.layout.size.height * 100 + '%' : y + 'px';\n  };\n\n  proto._transitionTo = function (x, y) {\n    this.getPosition();\n    // get current x & y from top/left\n    var curX = this.position.x;\n    var curY = this.position.y;\n\n    var compareX = parseInt(x, 10);\n    var compareY = parseInt(y, 10);\n    var didNotMove = compareX === this.position.x && compareY === this.position.y;\n\n    // save end position\n    this.setPosition(x, y);\n\n    // if did not move and not transitioning, just go to layout\n    if (didNotMove && !this.isTransitioning) {\n      this.layoutPosition();\n      return;\n    }\n\n    var transX = x - curX;\n    var transY = y - curY;\n    var transitionStyle = {};\n    transitionStyle.transform = this.getTranslate(transX, transY);\n\n    this.transition({\n      to: transitionStyle,\n      onTransitionEnd: {\n        transform: this.layoutPosition\n      },\n      isCleaning: true\n    });\n  };\n\n  proto.getTranslate = function (x, y) {\n    // flip cooridinates if origin on right or bottom\n    var isOriginLeft = this.layout._getOption('originLeft');\n    var isOriginTop = this.layout._getOption('originTop');\n    x = isOriginLeft ? x : -x;\n    y = isOriginTop ? y : -y;\n    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';\n  };\n\n  // non transition + transform support\n  proto.goTo = function (x, y) {\n    this.setPosition(x, y);\n    this.layoutPosition();\n  };\n\n  proto.moveTo = proto._transitionTo;\n\n  proto.setPosition = function (x, y) {\n    this.position.x = parseInt(x, 10);\n    this.position.y = parseInt(y, 10);\n  };\n\n  // ----- transition ----- //\n\n  /**\r\n   * @param {Object} style - CSS\r\n   * @param {Function} onTransitionEnd\r\n   */\n\n  // non transition, just trigger callback\n  proto._nonTransition = function (args) {\n    this.css(args.to);\n    if (args.isCleaning) {\n      this._removeStyles(args.to);\n    }\n    for (var prop in args.onTransitionEnd) {\n      args.onTransitionEnd[prop].call(this);\n    }\n  };\n\n  /**\r\n   * proper transition\r\n   * @param {Object} args - arguments\r\n   *   @param {Object} to - style to transition to\r\n   *   @param {Object} from - style to start transition from\r\n   *   @param {Boolean} isCleaning - removes transition styles after transition\r\n   *   @param {Function} onTransitionEnd - callback\r\n   */\n  proto.transition = function (args) {\n    // redirect to nonTransition if no transition duration\n    if (!parseFloat(this.layout.options.transitionDuration)) {\n      this._nonTransition(args);\n      return;\n    }\n\n    var _transition = this._transn;\n    // keep track of onTransitionEnd callback by css property\n    for (var prop in args.onTransitionEnd) {\n      _transition.onEnd[prop] = args.onTransitionEnd[prop];\n    }\n    // keep track of properties that are transitioning\n    for (prop in args.to) {\n      _transition.ingProperties[prop] = true;\n      // keep track of properties to clean up when transition is done\n      if (args.isCleaning) {\n        _transition.clean[prop] = true;\n      }\n    }\n\n    // set from styles\n    if (args.from) {\n      this.css(args.from);\n      // force redraw. http://blog.alexmaccaw.com/css-transitions\n      var h = this.element.offsetHeight;\n      // hack for JSHint to hush about unused var\n      h = null;\n    }\n    // enable transition\n    this.enableTransition(args.to);\n    // set styles that are transitioning\n    this.css(args.to);\n\n    this.isTransitioning = true;\n  };\n\n  // dash before all cap letters, including first for\n  // WebkitTransform => -webkit-transform\n  function toDashedAll(str) {\n    return str.replace(/([A-Z])/g, function ($1) {\n      return '-' + $1.toLowerCase();\n    });\n  }\n\n  var transitionProps = 'opacity,' + toDashedAll(transformProperty);\n\n  proto.enableTransition = function () /* style */{\n    // HACK changing transitionProperty during a transition\n    // will cause transition to jump\n    if (this.isTransitioning) {\n      return;\n    }\n\n    // make `transition: foo, bar, baz` from style object\n    // HACK un-comment this when enableTransition can work\n    // while a transition is happening\n    // var transitionValues = [];\n    // for ( var prop in style ) {\n    //   // dash-ify camelCased properties like WebkitTransition\n    //   prop = vendorProperties[ prop ] || prop;\n    //   transitionValues.push( toDashedAll( prop ) );\n    // }\n    // munge number to millisecond, to match stagger\n    var duration = this.layout.options.transitionDuration;\n    duration = typeof duration == 'number' ? duration + 'ms' : duration;\n    // enable transition styles\n    this.css({\n      transitionProperty: transitionProps,\n      transitionDuration: duration,\n      transitionDelay: this.staggerDelay || 0\n    });\n    // listen for transition end event\n    this.element.addEventListener(transitionEndEvent, this, false);\n  };\n\n  // ----- events ----- //\n\n  proto.onwebkitTransitionEnd = function (event) {\n    this.ontransitionend(event);\n  };\n\n  proto.onotransitionend = function (event) {\n    this.ontransitionend(event);\n  };\n\n  // properties that I munge to make my life easier\n  var dashedVendorProperties = {\n    '-webkit-transform': 'transform'\n  };\n\n  proto.ontransitionend = function (event) {\n    // disregard bubbled events from children\n    if (event.target !== this.element) {\n      return;\n    }\n    var _transition = this._transn;\n    // get property name of transitioned property, convert to prefix-free\n    var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;\n\n    // remove property that has completed transitioning\n    delete _transition.ingProperties[propertyName];\n    // check if any properties are still transitioning\n    if (isEmptyObj(_transition.ingProperties)) {\n      // all properties have completed transitioning\n      this.disableTransition();\n    }\n    // clean style\n    if (propertyName in _transition.clean) {\n      // clean up style\n      this.element.style[event.propertyName] = '';\n      delete _transition.clean[propertyName];\n    }\n    // trigger onTransitionEnd callback\n    if (propertyName in _transition.onEnd) {\n      var onTransitionEnd = _transition.onEnd[propertyName];\n      onTransitionEnd.call(this);\n      delete _transition.onEnd[propertyName];\n    }\n\n    this.emitEvent('transitionEnd', [this]);\n  };\n\n  proto.disableTransition = function () {\n    this.removeTransitionStyles();\n    this.element.removeEventListener(transitionEndEvent, this, false);\n    this.isTransitioning = false;\n  };\n\n  /**\r\n   * removes style property from element\r\n   * @param {Object} style\r\n  **/\n  proto._removeStyles = function (style) {\n    // clean up transition styles\n    var cleanStyle = {};\n    for (var prop in style) {\n      cleanStyle[prop] = '';\n    }\n    this.css(cleanStyle);\n  };\n\n  var cleanTransitionStyle = {\n    transitionProperty: '',\n    transitionDuration: '',\n    transitionDelay: ''\n  };\n\n  proto.removeTransitionStyles = function () {\n    // remove transition\n    this.css(cleanTransitionStyle);\n  };\n\n  // ----- stagger ----- //\n\n  proto.stagger = function (delay) {\n    delay = isNaN(delay) ? 0 : delay;\n    this.staggerDelay = delay + 'ms';\n  };\n\n  // ----- show/hide/remove ----- //\n\n  // remove element from DOM\n  proto.removeElem = function () {\n    this.element.parentNode.removeChild(this.element);\n    // remove display: none\n    this.css({ display: '' });\n    this.emitEvent('remove', [this]);\n  };\n\n  proto.remove = function () {\n    // just remove element if no transition support or no transition\n    if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {\n      this.removeElem();\n      return;\n    }\n\n    // start transition\n    this.once('transitionEnd', function () {\n      this.removeElem();\n    });\n    this.hide();\n  };\n\n  proto.reveal = function () {\n    delete this.isHidden;\n    // remove display: none\n    this.css({ display: '' });\n\n    var options = this.layout.options;\n\n    var onTransitionEnd = {};\n    var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');\n    onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;\n\n    this.transition({\n      from: options.hiddenStyle,\n      to: options.visibleStyle,\n      isCleaning: true,\n      onTransitionEnd: onTransitionEnd\n    });\n  };\n\n  proto.onRevealTransitionEnd = function () {\n    // check if still visible\n    // during transition, item may have been hidden\n    if (!this.isHidden) {\n      this.emitEvent('reveal');\n    }\n  };\n\n  /**\r\n   * get style property use for hide/reveal transition end\r\n   * @param {String} styleProperty - hiddenStyle/visibleStyle\r\n   * @returns {String}\r\n   */\n  proto.getHideRevealTransitionEndProperty = function (styleProperty) {\n    var optionStyle = this.layout.options[styleProperty];\n    // use opacity\n    if (optionStyle.opacity) {\n      return 'opacity';\n    }\n    // get first property\n    for (var prop in optionStyle) {\n      return prop;\n    }\n  };\n\n  proto.hide = function () {\n    // set flag\n    this.isHidden = true;\n    // remove display: none\n    this.css({ display: '' });\n\n    var options = this.layout.options;\n\n    var onTransitionEnd = {};\n    var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');\n    onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;\n\n    this.transition({\n      from: options.visibleStyle,\n      to: options.hiddenStyle,\n      // keep hidden stuff hidden\n      isCleaning: true,\n      onTransitionEnd: onTransitionEnd\n    });\n  };\n\n  proto.onHideTransitionEnd = function () {\n    // check if still hidden\n    // during transition, item may have been un-hidden\n    if (this.isHidden) {\n      this.css({ display: 'none' });\n      this.emitEvent('hide');\n    }\n  };\n\n  proto.destroy = function () {\n    this.css({\n      position: '',\n      left: '',\n      right: '',\n      top: '',\n      bottom: '',\n      transition: '',\n      transform: ''\n    });\n  };\n\n  return Item;\n});\n\n/*!\r\n * Outlayer v2.1.0\r\n * the brains and guts of a layout library\r\n * MIT license\r\n */\n\n(function (window, factory) {\n  'use strict';\n  // universal module definition\n  /* jshint strict: false */ /* globals define, module, require */\n\n  if (typeof define == 'function' && define.amd) {\n    // AMD - RequireJS\n    define('outlayer/outlayer', ['ev-emitter/ev-emitter', 'get-size/get-size', 'fizzy-ui-utils/utils', './item'], function (EvEmitter, getSize, utils, Item) {\n      return factory(window, EvEmitter, getSize, utils, Item);\n    });\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS - Browserify, Webpack\n    module.exports = factory(window, require('ev-emitter'), require('get-size'), require('fizzy-ui-utils'), require('./item'));\n  } else {\n    // browser global\n    window.Outlayer = factory(window, window.EvEmitter, window.getSize, window.fizzyUIUtils, window.Outlayer.Item);\n  }\n})(window, function factory(window, EvEmitter, getSize, utils, Item) {\n  'use strict';\n\n  // ----- vars ----- //\n\n  var console = window.console;\n  var jQuery = window.jQuery;\n  var noop = function noop() {};\n\n  // -------------------------- Outlayer -------------------------- //\n\n  // globally unique identifiers\n  var GUID = 0;\n  // internal store of all Outlayer intances\n  var instances = {};\n\n  /**\r\n   * @param {Element, String} element\r\n   * @param {Object} options\r\n   * @constructor\r\n   */\n  function Outlayer(element, options) {\n    var queryElement = utils.getQueryElement(element);\n    if (!queryElement) {\n      if (console) {\n        console.error('Bad element for ' + this.constructor.namespace + ': ' + (queryElement || element));\n      }\n      return;\n    }\n    this.element = queryElement;\n    // add jQuery\n    if (jQuery) {\n      this.$element = jQuery(this.element);\n    }\n\n    // options\n    this.options = utils.extend({}, this.constructor.defaults);\n    this.option(options);\n\n    // add id for Outlayer.getFromElement\n    var id = ++GUID;\n    this.element.outlayerGUID = id; // expando\n    instances[id] = this; // associate via id\n\n    // kick it off\n    this._create();\n\n    var isInitLayout = this._getOption('initLayout');\n    if (isInitLayout) {\n      this.layout();\n    }\n  }\n\n  // settings are for internal use only\n  Outlayer.namespace = 'outlayer';\n  Outlayer.Item = Item;\n\n  // default options\n  Outlayer.defaults = {\n    containerStyle: {\n      position: 'relative'\n    },\n    initLayout: true,\n    originLeft: true,\n    originTop: true,\n    resize: true,\n    resizeContainer: true,\n    // item options\n    transitionDuration: '0.4s',\n    hiddenStyle: {\n      opacity: 0,\n      transform: 'scale(0.001)'\n    },\n    visibleStyle: {\n      opacity: 1,\n      transform: 'scale(1)'\n    }\n  };\n\n  var proto = Outlayer.prototype;\n  // inherit EvEmitter\n  utils.extend(proto, EvEmitter.prototype);\n\n  /**\r\n   * set options\r\n   * @param {Object} opts\r\n   */\n  proto.option = function (opts) {\n    utils.extend(this.options, opts);\n  };\n\n  /**\r\n   * get backwards compatible option value, check old name\r\n   */\n  proto._getOption = function (option) {\n    var oldOption = this.constructor.compatOptions[option];\n    return oldOption && this.options[oldOption] !== undefined ? this.options[oldOption] : this.options[option];\n  };\n\n  Outlayer.compatOptions = {\n    // currentName: oldName\n    initLayout: 'isInitLayout',\n    horizontal: 'isHorizontal',\n    layoutInstant: 'isLayoutInstant',\n    originLeft: 'isOriginLeft',\n    originTop: 'isOriginTop',\n    resize: 'isResizeBound',\n    resizeContainer: 'isResizingContainer'\n  };\n\n  proto._create = function () {\n    // get items from children\n    this.reloadItems();\n    // elements that affect layout, but are not laid out\n    this.stamps = [];\n    this.stamp(this.options.stamp);\n    // set container style\n    utils.extend(this.element.style, this.options.containerStyle);\n\n    // bind resize method\n    var canBindResize = this._getOption('resize');\n    if (canBindResize) {\n      this.bindResize();\n    }\n  };\n\n  // goes through all children again and gets bricks in proper order\n  proto.reloadItems = function () {\n    // collection of item elements\n    this.items = this._itemize(this.element.children);\n  };\n\n  /**\r\n   * turn elements into Outlayer.Items to be used in layout\r\n   * @param {Array or NodeList or HTMLElement} elems\r\n   * @returns {Array} items - collection of new Outlayer Items\r\n   */\n  proto._itemize = function (elems) {\n\n    var itemElems = this._filterFindItemElements(elems);\n    var Item = this.constructor.Item;\n\n    // create new Outlayer Items for collection\n    var items = [];\n    for (var i = 0; i < itemElems.length; i++) {\n      var elem = itemElems[i];\n      var item = new Item(elem, this);\n      items.push(item);\n    }\n\n    return items;\n  };\n\n  /**\r\n   * get item elements to be used in layout\r\n   * @param {Array or NodeList or HTMLElement} elems\r\n   * @returns {Array} items - item elements\r\n   */\n  proto._filterFindItemElements = function (elems) {\n    return utils.filterFindElements(elems, this.options.itemSelector);\n  };\n\n  /**\r\n   * getter method for getting item elements\r\n   * @returns {Array} elems - collection of item elements\r\n   */\n  proto.getItemElements = function () {\n    return this.items.map(function (item) {\n      return item.element;\n    });\n  };\n\n  // ----- init & layout ----- //\n\n  /**\r\n   * lays out all items\r\n   */\n  proto.layout = function () {\n    this._resetLayout();\n    this._manageStamps();\n\n    // don't animate first layout\n    var layoutInstant = this._getOption('layoutInstant');\n    var isInstant = layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;\n    this.layoutItems(this.items, isInstant);\n\n    // flag for initalized\n    this._isLayoutInited = true;\n  };\n\n  // _init is alias for layout\n  proto._init = proto.layout;\n\n  /**\r\n   * logic before any new layout\r\n   */\n  proto._resetLayout = function () {\n    this.getSize();\n  };\n\n  proto.getSize = function () {\n    this.size = getSize(this.element);\n  };\n\n  /**\r\n   * get measurement from option, for columnWidth, rowHeight, gutter\r\n   * if option is String -> get element from selector string, & get size of element\r\n   * if option is Element -> get size of element\r\n   * else use option as a number\r\n   *\r\n   * @param {String} measurement\r\n   * @param {String} size - width or height\r\n   * @private\r\n   */\n  proto._getMeasurement = function (measurement, size) {\n    var option = this.options[measurement];\n    var elem;\n    if (!option) {\n      // default to 0\n      this[measurement] = 0;\n    } else {\n      // use option as an element\n      if (typeof option == 'string') {\n        elem = this.element.querySelector(option);\n      } else if (option instanceof HTMLElement) {\n        elem = option;\n      }\n      // use size of element, if element\n      this[measurement] = elem ? getSize(elem)[size] : option;\n    }\n  };\n\n  /**\r\n   * layout a collection of item elements\r\n   * @api public\r\n   */\n  proto.layoutItems = function (items, isInstant) {\n    items = this._getItemsForLayout(items);\n\n    this._layoutItems(items, isInstant);\n\n    this._postLayout();\n  };\n\n  /**\r\n   * get the items to be laid out\r\n   * you may want to skip over some items\r\n   * @param {Array} items\r\n   * @returns {Array} items\r\n   */\n  proto._getItemsForLayout = function (items) {\n    return items.filter(function (item) {\n      return !item.isIgnored;\n    });\n  };\n\n  /**\r\n   * layout items\r\n   * @param {Array} items\r\n   * @param {Boolean} isInstant\r\n   */\n  proto._layoutItems = function (items, isInstant) {\n    this._emitCompleteOnItems('layout', items);\n\n    if (!items || !items.length) {\n      // no items, emit event with empty array\n      return;\n    }\n\n    var queue = [];\n\n    items.forEach(function (item) {\n      // get x/y object from method\n      var position = this._getItemLayoutPosition(item);\n      // enqueue\n      position.item = item;\n      position.isInstant = isInstant || item.isLayoutInstant;\n      queue.push(position);\n    }, this);\n\n    this._processLayoutQueue(queue);\n  };\n\n  /**\r\n   * get item layout position\r\n   * @param {Outlayer.Item} item\r\n   * @returns {Object} x and y position\r\n   */\n  proto._getItemLayoutPosition = function () /* item */{\n    return {\n      x: 0,\n      y: 0\n    };\n  };\n\n  /**\r\n   * iterate over array and position each item\r\n   * Reason being - separating this logic prevents 'layout invalidation'\r\n   * thx @paul_irish\r\n   * @param {Array} queue\r\n   */\n  proto._processLayoutQueue = function (queue) {\n    this.updateStagger();\n    queue.forEach(function (obj, i) {\n      this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);\n    }, this);\n  };\n\n  // set stagger from option in milliseconds number\n  proto.updateStagger = function () {\n    var stagger = this.options.stagger;\n    if (stagger === null || stagger === undefined) {\n      this.stagger = 0;\n      return;\n    }\n    this.stagger = getMilliseconds(stagger);\n    return this.stagger;\n  };\n\n  /**\r\n   * Sets position of item in DOM\r\n   * @param {Outlayer.Item} item\r\n   * @param {Number} x - horizontal position\r\n   * @param {Number} y - vertical position\r\n   * @param {Boolean} isInstant - disables transitions\r\n   */\n  proto._positionItem = function (item, x, y, isInstant, i) {\n    if (isInstant) {\n      // if not transition, just set CSS\n      item.goTo(x, y);\n    } else {\n      item.stagger(i * this.stagger);\n      item.moveTo(x, y);\n    }\n  };\n\n  /**\r\n   * Any logic you want to do after each layout,\r\n   * i.e. size the container\r\n   */\n  proto._postLayout = function () {\n    this.resizeContainer();\n  };\n\n  proto.resizeContainer = function () {\n    var isResizingContainer = this._getOption('resizeContainer');\n    if (!isResizingContainer) {\n      return;\n    }\n    var size = this._getContainerSize();\n    if (size) {\n      this._setContainerMeasure(size.width, true);\n      this._setContainerMeasure(size.height, false);\n    }\n  };\n\n  /**\r\n   * Sets width or height of container if returned\r\n   * @returns {Object} size\r\n   *   @param {Number} width\r\n   *   @param {Number} height\r\n   */\n  proto._getContainerSize = noop;\n\n  /**\r\n   * @param {Number} measure - size of width or height\r\n   * @param {Boolean} isWidth\r\n   */\n  proto._setContainerMeasure = function (measure, isWidth) {\n    if (measure === undefined) {\n      return;\n    }\n\n    var elemSize = this.size;\n    // add padding and border width if border box\n    if (elemSize.isBorderBox) {\n      measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;\n    }\n\n    measure = Math.max(measure, 0);\n    this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';\n  };\n\n  /**\r\n   * emit eventComplete on a collection of items events\r\n   * @param {String} eventName\r\n   * @param {Array} items - Outlayer.Items\r\n   */\n  proto._emitCompleteOnItems = function (eventName, items) {\n    var _this = this;\n    function onComplete() {\n      _this.dispatchEvent(eventName + 'Complete', null, [items]);\n    }\n\n    var count = items.length;\n    if (!items || !count) {\n      onComplete();\n      return;\n    }\n\n    var doneCount = 0;\n    function tick() {\n      doneCount++;\n      if (doneCount == count) {\n        onComplete();\n      }\n    }\n\n    // bind callback\n    items.forEach(function (item) {\n      item.once(eventName, tick);\n    });\n  };\n\n  /**\r\n   * emits events via EvEmitter and jQuery events\r\n   * @param {String} type - name of event\r\n   * @param {Event} event - original event\r\n   * @param {Array} args - extra arguments\r\n   */\n  proto.dispatchEvent = function (type, event, args) {\n    // add original event to arguments\n    var emitArgs = event ? [event].concat(args) : args;\n    this.emitEvent(type, emitArgs);\n\n    if (jQuery) {\n      // set this.$element\n      this.$element = this.$element || jQuery(this.element);\n      if (event) {\n        // create jQuery event\n        var $event = jQuery.Event(event);\n        $event.type = type;\n        this.$element.trigger($event, args);\n      } else {\n        // just trigger with type if no event available\n        this.$element.trigger(type, args);\n      }\n    }\n  };\n\n  // -------------------------- ignore & stamps -------------------------- //\n\n\n  /**\r\n   * keep item in collection, but do not lay it out\r\n   * ignored items do not get skipped in layout\r\n   * @param {Element} elem\r\n   */\n  proto.ignore = function (elem) {\n    var item = this.getItem(elem);\n    if (item) {\n      item.isIgnored = true;\n    }\n  };\n\n  /**\r\n   * return item to layout collection\r\n   * @param {Element} elem\r\n   */\n  proto.unignore = function (elem) {\n    var item = this.getItem(elem);\n    if (item) {\n      delete item.isIgnored;\n    }\n  };\n\n  /**\r\n   * adds elements to stamps\r\n   * @param {NodeList, Array, Element, or String} elems\r\n   */\n  proto.stamp = function (elems) {\n    elems = this._find(elems);\n    if (!elems) {\n      return;\n    }\n\n    this.stamps = this.stamps.concat(elems);\n    // ignore\n    elems.forEach(this.ignore, this);\n  };\n\n  /**\r\n   * removes elements to stamps\r\n   * @param {NodeList, Array, or Element} elems\r\n   */\n  proto.unstamp = function (elems) {\n    elems = this._find(elems);\n    if (!elems) {\n      return;\n    }\n\n    elems.forEach(function (elem) {\n      // filter out removed stamp elements\n      utils.removeFrom(this.stamps, elem);\n      this.unignore(elem);\n    }, this);\n  };\n\n  /**\r\n   * finds child elements\r\n   * @param {NodeList, Array, Element, or String} elems\r\n   * @returns {Array} elems\r\n   */\n  proto._find = function (elems) {\n    if (!elems) {\n      return;\n    }\n    // if string, use argument as selector string\n    if (typeof elems == 'string') {\n      elems = this.element.querySelectorAll(elems);\n    }\n    elems = utils.makeArray(elems);\n    return elems;\n  };\n\n  proto._manageStamps = function () {\n    if (!this.stamps || !this.stamps.length) {\n      return;\n    }\n\n    this._getBoundingRect();\n\n    this.stamps.forEach(this._manageStamp, this);\n  };\n\n  // update boundingLeft / Top\n  proto._getBoundingRect = function () {\n    // get bounding rect for container element\n    var boundingRect = this.element.getBoundingClientRect();\n    var size = this.size;\n    this._boundingRect = {\n      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,\n      top: boundingRect.top + size.paddingTop + size.borderTopWidth,\n      right: boundingRect.right - (size.paddingRight + size.borderRightWidth),\n      bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)\n    };\n  };\n\n  /**\r\n   * @param {Element} stamp\r\n  **/\n  proto._manageStamp = noop;\n\n  /**\r\n   * get x/y position of element relative to container element\r\n   * @param {Element} elem\r\n   * @returns {Object} offset - has left, top, right, bottom\r\n   */\n  proto._getElementOffset = function (elem) {\n    var boundingRect = elem.getBoundingClientRect();\n    var thisRect = this._boundingRect;\n    var size = getSize(elem);\n    var offset = {\n      left: boundingRect.left - thisRect.left - size.marginLeft,\n      top: boundingRect.top - thisRect.top - size.marginTop,\n      right: thisRect.right - boundingRect.right - size.marginRight,\n      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom\n    };\n    return offset;\n  };\n\n  // -------------------------- resize -------------------------- //\n\n  // enable event handlers for listeners\n  // i.e. resize -> onresize\n  proto.handleEvent = utils.handleEvent;\n\n  /**\r\n   * Bind layout to window resizing\r\n   */\n  proto.bindResize = function () {\n    window.addEventListener('resize', this);\n    this.isResizeBound = true;\n  };\n\n  /**\r\n   * Unbind layout to window resizing\r\n   */\n  proto.unbindResize = function () {\n    window.removeEventListener('resize', this);\n    this.isResizeBound = false;\n  };\n\n  proto.onresize = function () {\n    this.resize();\n  };\n\n  utils.debounceMethod(Outlayer, 'onresize', 100);\n\n  proto.resize = function () {\n    // don't trigger if size did not change\n    // or if resize was unbound. See #9\n    if (!this.isResizeBound || !this.needsResizeLayout()) {\n      return;\n    }\n\n    this.layout();\n  };\n\n  /**\r\n   * check if layout is needed post layout\r\n   * @returns Boolean\r\n   */\n  proto.needsResizeLayout = function () {\n    var size = getSize(this.element);\n    // check that this.size and size are there\n    // IE8 triggers resize on body size change, so they might not be\n    var hasSizes = this.size && size;\n    return hasSizes && size.innerWidth !== this.size.innerWidth;\n  };\n\n  // -------------------------- methods -------------------------- //\n\n  /**\r\n   * add items to Outlayer instance\r\n   * @param {Array or NodeList or Element} elems\r\n   * @returns {Array} items - Outlayer.Items\r\n  **/\n  proto.addItems = function (elems) {\n    var items = this._itemize(elems);\n    // add items to collection\n    if (items.length) {\n      this.items = this.items.concat(items);\n    }\n    return items;\n  };\n\n  /**\r\n   * Layout newly-appended item elements\r\n   * @param {Array or NodeList or Element} elems\r\n   */\n  proto.appended = function (elems) {\n    var items = this.addItems(elems);\n    if (!items.length) {\n      return;\n    }\n    // layout and reveal just the new items\n    this.layoutItems(items, true);\n    this.reveal(items);\n  };\n\n  /**\r\n   * Layout prepended elements\r\n   * @param {Array or NodeList or Element} elems\r\n   */\n  proto.prepended = function (elems) {\n    var items = this._itemize(elems);\n    if (!items.length) {\n      return;\n    }\n    // add items to beginning of collection\n    var previousItems = this.items.slice(0);\n    this.items = items.concat(previousItems);\n    // start new layout\n    this._resetLayout();\n    this._manageStamps();\n    // layout new stuff without transition\n    this.layoutItems(items, true);\n    this.reveal(items);\n    // layout previous items\n    this.layoutItems(previousItems);\n  };\n\n  /**\r\n   * reveal a collection of items\r\n   * @param {Array of Outlayer.Items} items\r\n   */\n  proto.reveal = function (items) {\n    this._emitCompleteOnItems('reveal', items);\n    if (!items || !items.length) {\n      return;\n    }\n    var stagger = this.updateStagger();\n    items.forEach(function (item, i) {\n      item.stagger(i * stagger);\n      item.reveal();\n    });\n  };\n\n  /**\r\n   * hide a collection of items\r\n   * @param {Array of Outlayer.Items} items\r\n   */\n  proto.hide = function (items) {\n    this._emitCompleteOnItems('hide', items);\n    if (!items || !items.length) {\n      return;\n    }\n    var stagger = this.updateStagger();\n    items.forEach(function (item, i) {\n      item.stagger(i * stagger);\n      item.hide();\n    });\n  };\n\n  /**\r\n   * reveal item elements\r\n   * @param {Array}, {Element}, {NodeList} items\r\n   */\n  proto.revealItemElements = function (elems) {\n    var items = this.getItems(elems);\n    this.reveal(items);\n  };\n\n  /**\r\n   * hide item elements\r\n   * @param {Array}, {Element}, {NodeList} items\r\n   */\n  proto.hideItemElements = function (elems) {\n    var items = this.getItems(elems);\n    this.hide(items);\n  };\n\n  /**\r\n   * get Outlayer.Item, given an Element\r\n   * @param {Element} elem\r\n   * @param {Function} callback\r\n   * @returns {Outlayer.Item} item\r\n   */\n  proto.getItem = function (elem) {\n    // loop through items to get the one that matches\n    for (var i = 0; i < this.items.length; i++) {\n      var item = this.items[i];\n      if (item.element == elem) {\n        // return item\n        return item;\n      }\n    }\n  };\n\n  /**\r\n   * get collection of Outlayer.Items, given Elements\r\n   * @param {Array} elems\r\n   * @returns {Array} items - Outlayer.Items\r\n   */\n  proto.getItems = function (elems) {\n    elems = utils.makeArray(elems);\n    var items = [];\n    elems.forEach(function (elem) {\n      var item = this.getItem(elem);\n      if (item) {\n        items.push(item);\n      }\n    }, this);\n\n    return items;\n  };\n\n  /**\r\n   * remove element(s) from instance and DOM\r\n   * @param {Array or NodeList or Element} elems\r\n   */\n  proto.remove = function (elems) {\n    var removeItems = this.getItems(elems);\n\n    this._emitCompleteOnItems('remove', removeItems);\n\n    // bail if no items to remove\n    if (!removeItems || !removeItems.length) {\n      return;\n    }\n\n    removeItems.forEach(function (item) {\n      item.remove();\n      // remove item from collection\n      utils.removeFrom(this.items, item);\n    }, this);\n  };\n\n  // ----- destroy ----- //\n\n  // remove and disable Outlayer instance\n  proto.destroy = function () {\n    // clean up dynamic styles\n    var style = this.element.style;\n    style.height = '';\n    style.position = '';\n    style.width = '';\n    // destroy items\n    this.items.forEach(function (item) {\n      item.destroy();\n    });\n\n    this.unbindResize();\n\n    var id = this.element.outlayerGUID;\n    delete instances[id]; // remove reference to instance by id\n    delete this.element.outlayerGUID;\n    // remove data for jQuery\n    if (jQuery) {\n      jQuery.removeData(this.element, this.constructor.namespace);\n    }\n  };\n\n  // -------------------------- data -------------------------- //\n\n  /**\r\n   * get Outlayer instance from element\r\n   * @param {Element} elem\r\n   * @returns {Outlayer}\r\n   */\n  Outlayer.data = function (elem) {\n    elem = utils.getQueryElement(elem);\n    var id = elem && elem.outlayerGUID;\n    return id && instances[id];\n  };\n\n  // -------------------------- create Outlayer class -------------------------- //\n\n  /**\r\n   * create a layout class\r\n   * @param {String} namespace\r\n   */\n  Outlayer.create = function (namespace, options) {\n    // sub-class Outlayer\n    var Layout = subclass(Outlayer);\n    // apply new options and compatOptions\n    Layout.defaults = utils.extend({}, Outlayer.defaults);\n    utils.extend(Layout.defaults, options);\n    Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);\n\n    Layout.namespace = namespace;\n\n    Layout.data = Outlayer.data;\n\n    // sub-class Item\n    Layout.Item = subclass(Item);\n\n    // -------------------------- declarative -------------------------- //\n\n    utils.htmlInit(Layout, namespace);\n\n    // -------------------------- jQuery bridge -------------------------- //\n\n    // make into jQuery plugin\n    if (jQuery && jQuery.bridget) {\n      jQuery.bridget(namespace, Layout);\n    }\n\n    return Layout;\n  };\n\n  function subclass(Parent) {\n    function SubClass() {\n      Parent.apply(this, arguments);\n    }\n\n    SubClass.prototype = Object.create(Parent.prototype);\n    SubClass.prototype.constructor = SubClass;\n\n    return SubClass;\n  }\n\n  // ----- helpers ----- //\n\n  // how many milliseconds are in each unit\n  var msUnits = {\n    ms: 1,\n    s: 1000\n  };\n\n  // munge time-like parameter into millisecond number\n  // '0.4s' -> 40\n  function getMilliseconds(time) {\n    if (typeof time == 'number') {\n      return time;\n    }\n    var matches = time.match(/(^\\d*\\.?\\d*)(\\w*)/);\n    var num = matches && matches[1];\n    var unit = matches && matches[2];\n    if (!num.length) {\n      return 0;\n    }\n    num = parseFloat(num);\n    var mult = msUnits[unit] || 1;\n    return num * mult;\n  }\n\n  // ----- fin ----- //\n\n  // back in global\n  Outlayer.Item = Item;\n\n  return Outlayer;\n});\n\n/*!\r\n * Masonry v4.1.1\r\n * Cascading grid layout library\r\n * http://masonry.desandro.com\r\n * MIT License\r\n * by David DeSandro\r\n */\n\n(function (window, factory) {\n  // universal module definition\n  /* jshint strict: false */ /*globals define, module, require */\n  if (typeof define == 'function' && define.amd) {\n    // AMD\n    define(['outlayer/outlayer', 'get-size/get-size'], factory);\n  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {\n    // CommonJS\n    module.exports = factory(require('outlayer'), require('get-size'));\n  } else {\n    // browser global\n    window.Masonry = factory(window.Outlayer, window.getSize);\n  }\n})(window, function factory(Outlayer, getSize) {\n\n  // -------------------------- masonryDefinition -------------------------- //\n\n  // create an Outlayer layout class\n  var Masonry = Outlayer.create('masonry');\n  // isFitWidth -> fitWidth\n  Masonry.compatOptions.fitWidth = 'isFitWidth';\n\n  Masonry.prototype._resetLayout = function () {\n    this.getSize();\n    this._getMeasurement('columnWidth', 'outerWidth');\n    this._getMeasurement('gutter', 'outerWidth');\n    this.measureColumns();\n\n    // reset column Y\n    this.colYs = [];\n    for (var i = 0; i < this.cols; i++) {\n      this.colYs.push(0);\n    }\n\n    this.maxY = 0;\n  };\n\n  Masonry.prototype.measureColumns = function () {\n    this.getContainerWidth();\n    // if columnWidth is 0, default to outerWidth of first item\n    if (!this.columnWidth) {\n      var firstItem = this.items[0];\n      var firstItemElem = firstItem && firstItem.element;\n      // columnWidth fall back to item of first element\n      this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth ||\n      // if first elem has no width, default to size of container\n      this.containerWidth;\n    }\n\n    var columnWidth = this.columnWidth += this.gutter;\n\n    // calculate columns\n    var containerWidth = this.containerWidth + this.gutter;\n    var cols = containerWidth / columnWidth;\n    // fix rounding errors, typically with gutters\n    var excess = columnWidth - containerWidth % columnWidth;\n    // if overshoot is less than a pixel, round up, otherwise floor it\n    var mathMethod = excess && excess < 1 ? 'round' : 'floor';\n    cols = Math[mathMethod](cols);\n    this.cols = Math.max(cols, 1);\n  };\n\n  Masonry.prototype.getContainerWidth = function () {\n    // container is parent if fit width\n    var isFitWidth = this._getOption('fitWidth');\n    var container = isFitWidth ? this.element.parentNode : this.element;\n    // check that this.size and size are there\n    // IE8 triggers resize on body size change, so they might not be\n    var size = getSize(container);\n    this.containerWidth = size && size.innerWidth;\n  };\n\n  Masonry.prototype._getItemLayoutPosition = function (item) {\n    item.getSize();\n    // how many columns does this brick span\n    var remainder = item.size.outerWidth % this.columnWidth;\n    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';\n    // round if off by 1 pixel, otherwise use ceil\n    var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);\n    colSpan = Math.min(colSpan, this.cols);\n\n    var colGroup = this._getColGroup(colSpan);\n    // get the minimum Y value from the columns\n    var minimumY = Math.min.apply(Math, colGroup);\n    var shortColIndex = colGroup.indexOf(minimumY);\n\n    // position the brick\n    var position = {\n      x: this.columnWidth * shortColIndex,\n      y: minimumY\n    };\n\n    // apply setHeight to necessary columns\n    var setHeight = minimumY + item.size.outerHeight;\n    var setSpan = this.cols + 1 - colGroup.length;\n    for (var i = 0; i < setSpan; i++) {\n      this.colYs[shortColIndex + i] = setHeight;\n    }\n\n    return position;\n  };\n\n  /**\r\n   * @param {Number} colSpan - number of columns the element spans\r\n   * @returns {Array} colGroup\r\n   */\n  Masonry.prototype._getColGroup = function (colSpan) {\n    if (colSpan < 2) {\n      // if brick spans only one column, use all the column Ys\n      return this.colYs;\n    }\n\n    var colGroup = [];\n    // how many different places could this brick fit horizontally\n    var groupCount = this.cols + 1 - colSpan;\n    // for each group potential horizontal position\n    for (var i = 0; i < groupCount; i++) {\n      // make an array of colY values for that one group\n      var groupColYs = this.colYs.slice(i, i + colSpan);\n      // and get the max value of the array\n      colGroup[i] = Math.max.apply(Math, groupColYs);\n    }\n    return colGroup;\n  };\n\n  Masonry.prototype._manageStamp = function (stamp) {\n    var stampSize = getSize(stamp);\n    var offset = this._getElementOffset(stamp);\n    // get the columns that this stamp affects\n    var isOriginLeft = this._getOption('originLeft');\n    var firstX = isOriginLeft ? offset.left : offset.right;\n    var lastX = firstX + stampSize.outerWidth;\n    var firstCol = Math.floor(firstX / this.columnWidth);\n    firstCol = Math.max(0, firstCol);\n    var lastCol = Math.floor(lastX / this.columnWidth);\n    // lastCol should not go over if multiple of columnWidth #425\n    lastCol -= lastX % this.columnWidth ? 0 : 1;\n    lastCol = Math.min(this.cols - 1, lastCol);\n    // set colYs to bottom of the stamp\n\n    var isOriginTop = this._getOption('originTop');\n    var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;\n    for (var i = firstCol; i <= lastCol; i++) {\n      this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);\n    }\n  };\n\n  Masonry.prototype._getContainerSize = function () {\n    this.maxY = Math.max.apply(Math, this.colYs);\n    var size = {\n      height: this.maxY\n    };\n\n    if (this._getOption('fitWidth')) {\n      size.width = this._getContainerFitWidth();\n    }\n\n    return size;\n  };\n\n  Masonry.prototype._getContainerFitWidth = function () {\n    var unusedCols = 0;\n    // count unused columns\n    var i = this.cols;\n    while (--i) {\n      if (this.colYs[i] !== 0) {\n        break;\n      }\n      unusedCols++;\n    }\n    // fit container to columns that have been used\n    return (this.cols - unusedCols) * this.columnWidth - this.gutter;\n  };\n\n  Masonry.prototype.needsResizeLayout = function () {\n    var previousWidth = this.containerWidth;\n    this.getContainerWidth();\n    return previousWidth != this.containerWidth;\n  };\n\n  return Masonry;\n});"

/***/ }),
/* 46 */,
/* 47 */
/***/ (function(module, exports) {

module.exports = "var _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n!function () {\n  UEDITOR_CONFIG = window.UEDITOR_CONFIG || {};var baidu = window.baidu || {};window.baidu = baidu;window.UE = baidu.editor = window.UE || {};UE.plugins = {};UE.commands = {};UE.instants = {};UE.I18N = {};UE._customizeUI = {};UE.version = \"1.4.3\";var dom = UE.dom = {};var browser = UE.browser = function () {\n    var agent = navigator.userAgent.toLowerCase(),\n        opera = window.opera,\n        browser = { ie: /(msie\\s|trident.*rv:)([\\w.]+)/.test(agent), opera: !!opera && opera.version, webkit: agent.indexOf(\" applewebkit/\") > -1, mac: agent.indexOf(\"macintosh\") > -1, quirks: document.compatMode == \"BackCompat\" };browser.gecko = navigator.product == \"Gecko\" && !browser.webkit && !browser.opera && !browser.ie;var version = 0;if (browser.ie) {\n      var v1 = agent.match(/(?:msie\\s([\\w.]+))/);var v2 = agent.match(/(?:trident.*rv:([\\w.]+))/);if (v1 && v2 && v1[1] && v2[1]) {\n        version = Math.max(v1[1] * 1, v2[1] * 1);\n      } else if (v1 && v1[1]) {\n        version = v1[1] * 1;\n      } else if (v2 && v2[1]) {\n        version = v2[1] * 1;\n      } else {\n        version = 0;\n      }browser.ie11Compat = document.documentMode == 11;browser.ie9Compat = document.documentMode == 9;browser.ie8 = !!document.documentMode;browser.ie8Compat = document.documentMode == 8;browser.ie7Compat = version == 7 && !document.documentMode || document.documentMode == 7;browser.ie6Compat = version < 7 || browser.quirks;browser.ie9above = version > 8;browser.ie9below = version < 9;browser.ie11above = version > 10;browser.ie11below = version < 11;\n    }if (browser.gecko) {\n      var geckoRelease = agent.match(/rv:([\\d\\.]+)/);if (geckoRelease) {\n        geckoRelease = geckoRelease[1].split(\".\");version = geckoRelease[0] * 1e4 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;\n      }\n    }if (/chrome\\/(\\d+\\.\\d)/i.test(agent)) {\n      browser.chrome = +RegExp[\"$1\"];\n    }if (/(\\d+\\.\\d)?(?:\\.\\d)?\\s+safari\\/?(\\d+\\.\\d+)?/i.test(agent) && !/chrome/i.test(agent)) {\n      browser.safari = +(RegExp[\"$1\"] || RegExp[\"$2\"]);\n    }if (browser.opera) version = parseFloat(opera.version());if (browser.webkit) version = parseFloat(agent.match(/ applewebkit\\/(\\d+)/)[1]);browser.version = version;browser.isCompatible = !browser.mobile && (browser.ie && version >= 6 || browser.gecko && version >= 10801 || browser.opera && version >= 9.5 || browser.air && version >= 1 || browser.webkit && version >= 522 || false);return browser;\n  }();var ie = browser.ie,\n      webkit = browser.webkit,\n      gecko = browser.gecko,\n      opera = browser.opera;var utils = UE.utils = { each: function each(obj, iterator, context) {\n      if (obj == null) return;if (obj.length === +obj.length) {\n        for (var i = 0, l = obj.length; i < l; i++) {\n          if (iterator.call(context, obj[i], i, obj) === false) return false;\n        }\n      } else {\n        for (var key in obj) {\n          if (obj.hasOwnProperty(key)) {\n            if (iterator.call(context, obj[key], key, obj) === false) return false;\n          }\n        }\n      }\n    }, makeInstance: function makeInstance(obj) {\n      var noop = new Function();noop.prototype = obj;obj = new noop();noop.prototype = null;return obj;\n    }, extend: function extend(t, s, b) {\n      if (s) {\n        for (var k in s) {\n          if (!b || !t.hasOwnProperty(k)) {\n            t[k] = s[k];\n          }\n        }\n      }return t;\n    }, extend2: function extend2(t) {\n      var a = arguments;for (var i = 1; i < a.length; i++) {\n        var x = a[i];for (var k in x) {\n          if (!t.hasOwnProperty(k)) {\n            t[k] = x[k];\n          }\n        }\n      }return t;\n    }, inherits: function inherits(subClass, superClass) {\n      var oldP = subClass.prototype,\n          newP = utils.makeInstance(superClass.prototype);utils.extend(newP, oldP, true);subClass.prototype = newP;return newP.constructor = subClass;\n    }, bind: function bind(fn, context) {\n      return function () {\n        return fn.apply(context, arguments);\n      };\n    }, defer: function defer(fn, delay, exclusion) {\n      var timerID;return function () {\n        if (exclusion) {\n          clearTimeout(timerID);\n        }timerID = setTimeout(fn, delay);\n      };\n    }, indexOf: function indexOf(array, item, start) {\n      var index = -1;start = this.isNumber(start) ? start : 0;this.each(array, function (v, i) {\n        if (i >= start && v === item) {\n          index = i;return false;\n        }\n      });return index;\n    }, removeItem: function removeItem(array, item) {\n      for (var i = 0, l = array.length; i < l; i++) {\n        if (array[i] === item) {\n          array.splice(i, 1);i--;\n        }\n      }\n    }, trim: function trim(str) {\n      return str.replace(/(^[ \\t\\n\\r]+)|([ \\t\\n\\r]+$)/g, \"\");\n    }, listToMap: function listToMap(list) {\n      if (!list) return {};list = utils.isArray(list) ? list : list.split(\",\");for (var i = 0, ci, obj = {}; ci = list[i++];) {\n        obj[ci.toUpperCase()] = obj[ci] = 1;\n      }return obj;\n    }, unhtml: function unhtml(str, reg) {\n      return str ? str.replace(reg || /[&<\">'](?:(amp|lt|quot|gt|#39|nbsp|#\\d+);)?/g, function (a, b) {\n        if (b) {\n          return a;\n        } else {\n          return { \"<\": \"&lt;\", \"&\": \"&amp;\", '\"': \"&quot;\", \">\": \"&gt;\", \"'\": \"&#39;\" }[a];\n        }\n      }) : \"\";\n    }, html: function html(str) {\n      return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {\n        return { \"&lt;\": \"<\", \"&amp;\": \"&\", \"&quot;\": '\"', \"&gt;\": \">\", \"&#39;\": \"'\", \"&nbsp;\": \" \" }[m];\n      }) : \"\";\n    }, cssStyleToDomStyle: function () {\n      var test = document.createElement(\"div\").style,\n          cache = { \"float\": test.cssFloat != undefined ? \"cssFloat\" : test.styleFloat != undefined ? \"styleFloat\" : \"float\" };return function (cssName) {\n        return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {\n          return match.charAt(1).toUpperCase();\n        }));\n      };\n    }(), loadFile: function () {\n      var tmpList = [];function getItem(doc, obj) {\n        try {\n          for (var i = 0, ci; ci = tmpList[i++];) {\n            if (ci.doc === doc && ci.url == (obj.src || obj.href)) {\n              return ci;\n            }\n          }\n        } catch (e) {\n          return null;\n        }\n      }return function (doc, obj, fn) {\n        var item = getItem(doc, obj);if (item) {\n          if (item.ready) {\n            fn && fn();\n          } else {\n            item.funs.push(fn);\n          }return;\n        }tmpList.push({ doc: doc, url: obj.src || obj.href, funs: [fn] });if (!doc.body) {\n          var html = [];for (var p in obj) {\n            if (p == \"tag\") continue;html.push(p + '=\"' + obj[p] + '\"');\n          }doc.write(\"<\" + obj.tag + \" \" + html.join(\" \") + \" ></\" + obj.tag + \">\");return;\n        }if (obj.id && doc.getElementById(obj.id)) {\n          return;\n        }var element = doc.createElement(obj.tag);delete obj.tag;for (var p in obj) {\n          element.setAttribute(p, obj[p]);\n        }element.onload = element.onreadystatechange = function () {\n          if (!this.readyState || /loaded|complete/.test(this.readyState)) {\n            item = getItem(doc, obj);if (item.funs.length > 0) {\n              item.ready = 1;for (var fi; fi = item.funs.pop();) {\n                fi();\n              }\n            }element.onload = element.onreadystatechange = null;\n          }\n        };element.onerror = function () {\n          throw Error(\"The load \" + (obj.href || obj.src) + \" fails,check the url settings of file ueditor.config.js \");\n        };doc.getElementsByTagName(\"head\")[0].appendChild(element);\n      };\n    }(), isEmptyObject: function isEmptyObject(obj) {\n      if (obj == null) return true;if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;for (var key in obj) {\n        if (obj.hasOwnProperty(key)) return false;\n      }return true;\n    }, fixColor: function fixColor(name, value) {\n      if (/color/i.test(name) && /rgba?/.test(value)) {\n        var array = value.split(\",\");if (array.length > 3) return \"\";value = \"#\";for (var i = 0, color; color = array[i++];) {\n          color = parseInt(color.replace(/[^\\d]/gi, \"\"), 10).toString(16);value += color.length == 1 ? \"0\" + color : color;\n        }value = value.toUpperCase();\n      }return value;\n    }, optCss: function optCss(val) {\n      var padding, margin, border;val = val.replace(/(padding|margin|border)\\-([^:]+):([^;]+);?/gi, function (str, key, name, val) {\n        if (val.split(\" \").length == 1) {\n          switch (key) {case \"padding\":\n              !padding && (padding = {});padding[name] = val;return \"\";case \"margin\":\n              !margin && (margin = {});margin[name] = val;return \"\";case \"border\":\n              return val == \"initial\" ? \"\" : str;}\n        }return str;\n      });function opt(obj, name) {\n        if (!obj) {\n          return \"\";\n        }var t = obj.top,\n            b = obj.bottom,\n            l = obj.left,\n            r = obj.right,\n            val = \"\";if (!t || !l || !b || !r) {\n          for (var p in obj) {\n            val += \";\" + name + \"-\" + p + \":\" + obj[p] + \";\";\n          }\n        } else {\n          val += \";\" + name + \":\" + (t == b && b == l && l == r ? t : t == b && l == r ? t + \" \" + l : l == r ? t + \" \" + l + \" \" + b : t + \" \" + r + \" \" + b + \" \" + l) + \";\";\n        }return val;\n      }val += opt(padding, \"padding\") + opt(margin, \"margin\");return val.replace(/^[ \\n\\r\\t;]*|[ \\n\\r\\t]*$/, \"\").replace(/;([ \\n\\r\\t]+)|\\1;/g, \";\").replace(/(&((l|g)t|quot|#39))?;{2,}/g, function (a, b) {\n        return b ? b + \";;\" : \";\";\n      });\n    }, clone: function clone(source, target) {\n      var tmp;target = target || {};for (var i in source) {\n        if (source.hasOwnProperty(i)) {\n          tmp = source[i];if ((typeof tmp === \"undefined\" ? \"undefined\" : _typeof(tmp)) == \"object\") {\n            target[i] = utils.isArray(tmp) ? [] : {};utils.clone(source[i], target[i]);\n          } else {\n            target[i] = tmp;\n          }\n        }\n      }return target;\n    }, transUnitToPx: function transUnitToPx(val) {\n      if (!/(pt|cm)/.test(val)) {\n        return val;\n      }var unit;val.replace(/([\\d.]+)(\\w+)/, function (str, v, u) {\n        val = v;unit = u;\n      });switch (unit) {case \"cm\":\n          val = parseFloat(val) * 25;break;case \"pt\":\n          val = Math.round(parseFloat(val) * 96 / 72);}return val + (val ? \"px\" : \"\");\n    }, domReady: function () {\n      var fnArr = [];function doReady(doc) {\n        doc.isReady = true;for (var ci; ci = fnArr.pop(); ci()) {}\n      }return function (onready, win) {\n        win = win || window;var doc = win.document;onready && fnArr.push(onready);if (doc.readyState === \"complete\") {\n          doReady(doc);\n        } else {\n          doc.isReady && doReady(doc);if (browser.ie && browser.version != 11) {\n            !function () {\n              if (doc.isReady) return;try {\n                doc.documentElement.doScroll(\"left\");\n              } catch (error) {\n                setTimeout(arguments.callee, 0);return;\n              }doReady(doc);\n            }();win.attachEvent(\"onload\", function () {\n              doReady(doc);\n            });\n          } else {\n            doc.addEventListener(\"DOMContentLoaded\", function () {\n              doc.removeEventListener(\"DOMContentLoaded\", arguments.callee, false);doReady(doc);\n            }, false);win.addEventListener(\"load\", function () {\n              doReady(doc);\n            }, false);\n          }\n        }\n      };\n    }(), cssRule: browser.ie && browser.version != 11 ? function (key, style, doc) {\n      var indexList, index;if (style === undefined || style && style.nodeType && style.nodeType == 9) {\n        doc = style && style.nodeType && style.nodeType == 9 ? style : doc || document;indexList = doc.indexList || (doc.indexList = {});index = indexList[key];if (index !== undefined) {\n          return doc.styleSheets[index].cssText;\n        }return undefined;\n      }doc = doc || document;indexList = doc.indexList || (doc.indexList = {});index = indexList[key];if (style === \"\") {\n        if (index !== undefined) {\n          doc.styleSheets[index].cssText = \"\";delete indexList[key];return true;\n        }return false;\n      }if (index !== undefined) {\n        sheetStyle = doc.styleSheets[index];\n      } else {\n        sheetStyle = doc.createStyleSheet(\"\", index = doc.styleSheets.length);indexList[key] = index;\n      }sheetStyle.cssText = style;\n    } : function (key, style, doc) {\n      var head, node;if (style === undefined || style && style.nodeType && style.nodeType == 9) {\n        doc = style && style.nodeType && style.nodeType == 9 ? style : doc || document;node = doc.getElementById(key);return node ? node.innerHTML : undefined;\n      }doc = doc || document;node = doc.getElementById(key);if (style === \"\") {\n        if (node) {\n          node.parentNode.removeChild(node);return true;\n        }return false;\n      }if (node) {\n        node.innerHTML = style;\n      } else {\n        node = doc.createElement(\"style\");node.id = key;node.innerHTML = style;doc.getElementsByTagName(\"head\")[0].appendChild(node);\n      }\n    }, sort: function sort(array, compareFn) {\n      compareFn = compareFn || function (item1, item2) {\n        return item1.localeCompare(item2);\n      };for (var i = 0, len = array.length; i < len; i++) {\n        for (var j = i, length = array.length; j < length; j++) {\n          if (compareFn(array[i], array[j]) > 0) {\n            var t = array[i];array[i] = array[j];array[j] = t;\n          }\n        }\n      }return array;\n    }, serializeParam: function serializeParam(json) {\n      var strArr = [];for (var i in json) {\n        if (i == \"method\" || i == \"timeout\" || i == \"async\") continue;if (!(_typeof(json[i]).toLowerCase() == \"function\" || _typeof(json[i]).toLowerCase() == \"object\")) {\n          strArr.push(encodeURIComponent(i) + \"=\" + encodeURIComponent(json[i]));\n        } else if (utils.isArray(json[i])) {\n          for (var j = 0; j < json[i].length; j++) {\n            strArr.push(encodeURIComponent(i) + \"[]=\" + encodeURIComponent(json[i][j]));\n          }\n        }\n      }return strArr.join(\"&\");\n    }, formatUrl: function formatUrl(url) {\n      var u = url.replace(/&&/g, \"&\");u = u.replace(/\\?&/g, \"?\");u = u.replace(/&$/g, \"\");u = u.replace(/&#/g, \"#\");u = u.replace(/&+/g, \"&\");return u;\n    }, isCrossDomainUrl: function isCrossDomainUrl(url) {\n      var a = document.createElement(\"a\");a.href = url;if (browser.ie) {\n        a.href = a.href;\n      }return !(a.protocol == location.protocol && a.hostname == location.hostname && (a.port == location.port || a.port == \"80\" && location.port == \"\" || a.port == \"\" && location.port == \"80\"));\n    }, clearEmptyAttrs: function clearEmptyAttrs(obj) {\n      for (var p in obj) {\n        if (obj[p] === \"\") {\n          delete obj[p];\n        }\n      }return obj;\n    }, str2json: function str2json(s) {\n      if (!utils.isString(s)) return null;if (window.JSON) {\n        return JSON.parse(s);\n      } else {\n        return new Function(\"return \" + utils.trim(s || \"\"))();\n      }\n    }, json2str: function () {\n      if (window.JSON) {\n        return JSON.stringify;\n      } else {\n        var escapeMap;\n\n        var _ret = function () {\n          var encodeString = function encodeString(source) {\n            if (/[\"\\\\\\x00-\\x1f]/.test(source)) {\n              source = source.replace(/[\"\\\\\\x00-\\x1f]/g, function (match) {\n                var c = escapeMap[match];if (c) {\n                  return c;\n                }c = match.charCodeAt();return \"\\\\u00\" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);\n              });\n            }return '\"' + source + '\"';\n          };\n\n          var encodeArray = function encodeArray(source) {\n            var result = [\"[\"],\n                l = source.length,\n                preComma,\n                i,\n                item;for (i = 0; i < l; i++) {\n              item = source[i];switch (typeof item === \"undefined\" ? \"undefined\" : _typeof(item)) {case \"undefined\":case \"function\":case \"unknown\":\n                  break;default:\n                  if (preComma) {\n                    result.push(\",\");\n                  }result.push(utils.json2str(item));preComma = 1;}\n            }result.push(\"]\");return result.join(\"\");\n          };\n\n          var pad = function pad(source) {\n            return source < 10 ? \"0\" + source : source;\n          };\n\n          var encodeDate = function encodeDate(source) {\n            return '\"' + source.getFullYear() + \"-\" + pad(source.getMonth() + 1) + \"-\" + pad(source.getDate()) + \"T\" + pad(source.getHours()) + \":\" + pad(source.getMinutes()) + \":\" + pad(source.getSeconds()) + '\"';\n          };\n\n          escapeMap = { \"\\b\": \"\\\\b\", \"\t\": \"\\\\t\", \"\\n\": \"\\\\n\", \"\\f\": \"\\\\f\", \"\\r\": \"\\\\r\", '\"': '\\\\\"', \"\\\\\": \"\\\\\\\\\" };\n          return {\n            v: function v(value) {\n              switch (typeof value === \"undefined\" ? \"undefined\" : _typeof(value)) {case \"undefined\":\n                  return \"undefined\";case \"number\":\n                  return isFinite(value) ? String(value) : \"null\";case \"string\":\n                  return encodeString(value);case \"boolean\":\n                  return String(value);default:\n                  if (value === null) {\n                    return \"null\";\n                  } else if (utils.isArray(value)) {\n                    return encodeArray(value);\n                  } else if (utils.isDate(value)) {\n                    return encodeDate(value);\n                  } else {\n                    var result = [\"{\"],\n                        encode = utils.json2str,\n                        preComma,\n                        item;for (var key in value) {\n                      if (Object.prototype.hasOwnProperty.call(value, key)) {\n                        item = value[key];switch (typeof item === \"undefined\" ? \"undefined\" : _typeof(item)) {case \"undefined\":case \"unknown\":case \"function\":\n                            break;default:\n                            if (preComma) {\n                              result.push(\",\");\n                            }preComma = 1;result.push(encode(key) + \":\" + encode(item));}\n                      }\n                    }result.push(\"}\");return result.join(\"\");\n                  }}\n            }\n          };\n        }();\n\n        if ((typeof _ret === \"undefined\" ? \"undefined\" : _typeof(_ret)) === \"object\") return _ret.v;\n      }\n    }() };utils.each([\"String\", \"Function\", \"Array\", \"Number\", \"RegExp\", \"Object\", \"Date\"], function (v) {\n    UE.utils[\"is\" + v] = function (obj) {\n      return Object.prototype.toString.apply(obj) == \"[object \" + v + \"]\";\n    };\n  });var EventBase = UE.EventBase = function () {};EventBase.prototype = { addListener: function addListener(types, listener) {\n      types = utils.trim(types).split(/\\s+/);for (var i = 0, ti; ti = types[i++];) {\n        getListener(this, ti, true).push(listener);\n      }\n    }, on: function on(types, listener) {\n      return this.addListener(types, listener);\n    }, off: function off(types, listener) {\n      return this.removeListener(types, listener);\n    }, trigger: function trigger() {\n      return this.fireEvent.apply(this, arguments);\n    }, removeListener: function removeListener(types, listener) {\n      types = utils.trim(types).split(/\\s+/);for (var i = 0, ti; ti = types[i++];) {\n        utils.removeItem(getListener(this, ti) || [], listener);\n      }\n    }, fireEvent: function fireEvent() {\n      var types = arguments[0];types = utils.trim(types).split(\" \");for (var i = 0, ti; ti = types[i++];) {\n        var listeners = getListener(this, ti),\n            r,\n            t,\n            k;if (listeners) {\n          k = listeners.length;while (k--) {\n            if (!listeners[k]) continue;t = listeners[k].apply(this, arguments);if (t === true) {\n              return t;\n            }if (t !== undefined) {\n              r = t;\n            }\n          }\n        }if (t = this[\"on\" + ti.toLowerCase()]) {\n          r = t.apply(this, arguments);\n        }\n      }return r;\n    } };function getListener(obj, type, force) {\n    var allListeners;type = type.toLowerCase();return (allListeners = obj.__allListeners || force && (obj.__allListeners = {})) && (allListeners[type] || force && (allListeners[type] = []));\n  }var dtd = dom.dtd = function () {\n    function _(s) {\n      for (var k in s) {\n        s[k.toUpperCase()] = s[k];\n      }return s;\n    }var X = utils.extend2;var A = _({ isindex: 1, fieldset: 1 }),\n        B = _({ input: 1, button: 1, select: 1, textarea: 1, label: 1 }),\n        C = X(_({ a: 1 }), B),\n        D = X({ iframe: 1 }, C),\n        E = _({ hr: 1, ul: 1, menu: 1, div: 1, blockquote: 1, noscript: 1, table: 1, center: 1, address: 1, dir: 1, pre: 1, h5: 1, dl: 1, h4: 1, noframes: 1, h6: 1, ol: 1, h1: 1, h3: 1, h2: 1 }),\n        F = _({ ins: 1, del: 1, script: 1, style: 1 }),\n        G = X(_({ b: 1, acronym: 1, bdo: 1, \"var\": 1, \"#\": 1, abbr: 1, code: 1, br: 1, i: 1, cite: 1, kbd: 1, u: 1, strike: 1, s: 1, tt: 1, strong: 1, q: 1, samp: 1, em: 1, dfn: 1, span: 1 }), F),\n        H = X(_({ sub: 1, img: 1, embed: 1, object: 1, sup: 1, basefont: 1, map: 1, applet: 1, font: 1, big: 1, small: 1 }), G),\n        I = X(_({ p: 1 }), H),\n        J = X(_({ iframe: 1 }), H, B),\n        K = _({ img: 1, embed: 1, noscript: 1, br: 1, kbd: 1, center: 1, button: 1, basefont: 1, h5: 1, h4: 1, samp: 1, h6: 1, ol: 1, h1: 1, h3: 1, h2: 1, form: 1, font: 1, \"#\": 1, select: 1, menu: 1, ins: 1, abbr: 1, label: 1, code: 1, table: 1, script: 1, cite: 1, input: 1, iframe: 1, strong: 1, textarea: 1, noframes: 1, big: 1, small: 1, span: 1, hr: 1, sub: 1, bdo: 1, \"var\": 1, div: 1, object: 1, sup: 1, strike: 1, dir: 1, map: 1, dl: 1, applet: 1, del: 1, isindex: 1, fieldset: 1, ul: 1, b: 1, acronym: 1, a: 1, blockquote: 1, i: 1, u: 1, s: 1, tt: 1, address: 1, q: 1, pre: 1, p: 1, em: 1, dfn: 1 }),\n        L = X(_({ a: 0 }), J),\n        M = _({ tr: 1 }),\n        N = _({ \"#\": 1 }),\n        O = X(_({ param: 1 }), K),\n        P = X(_({ form: 1 }), A, D, E, I),\n        Q = _({ li: 1, ol: 1, ul: 1 }),\n        R = _({ style: 1, script: 1 }),\n        S = _({ base: 1, link: 1, meta: 1, title: 1 }),\n        T = X(S, R),\n        U = _({ head: 1, body: 1 }),\n        V = _({ html: 1 });var block = _({ address: 1, blockquote: 1, center: 1, dir: 1, div: 1, dl: 1, fieldset: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, hr: 1, isindex: 1, menu: 1, noframes: 1, ol: 1, p: 1, pre: 1, table: 1, ul: 1 }),\n        empty = _({ area: 1, base: 1, basefont: 1, br: 1, col: 1, command: 1, dialog: 1, embed: 1, hr: 1, img: 1, input: 1, isindex: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 });return _({ $nonBodyContent: X(V, U, S), $block: block, $inline: L, $inlineWithA: X(_({ a: 1 }), L), $body: X(_({ script: 1, style: 1 }), block), $cdata: _({ script: 1, style: 1 }), $empty: empty, $nonChild: _({ iframe: 1, textarea: 1 }), $listItem: _({ dd: 1, dt: 1, li: 1 }), $list: _({ ul: 1, ol: 1, dl: 1 }), $isNotEmpty: _({ table: 1, ul: 1, ol: 1, dl: 1, iframe: 1, area: 1, base: 1, col: 1, hr: 1, img: 1, embed: 1, input: 1, link: 1, meta: 1, param: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 }), $removeEmpty: _({ a: 1, abbr: 1, acronym: 1, address: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, s: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, tt: 1, u: 1, \"var\": 1 }), $removeEmptyBlock: _({ p: 1, div: 1 }), $tableContent: _({ caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1, table: 1 }), $notTransContent: _({ pre: 1, script: 1, style: 1, textarea: 1 }), html: U, head: T, style: N, script: N, body: P, base: {}, link: {}, meta: {}, title: N, col: {}, tr: _({ td: 1, th: 1 }), img: {}, embed: {}, colgroup: _({ thead: 1, col: 1, tbody: 1, tr: 1, tfoot: 1 }), noscript: P, td: P, br: {}, th: P, center: P, kbd: L, button: X(I, E), basefont: {}, h5: L, h4: L, samp: L, h6: L, ol: Q, h1: L, h3: L, option: N, h2: L, form: X(A, D, E, I), select: _({ optgroup: 1, option: 1 }), font: L, ins: L, menu: Q, abbr: L, label: L, table: _({ thead: 1, col: 1, tbody: 1, tr: 1, colgroup: 1, caption: 1, tfoot: 1 }), code: L, tfoot: M, cite: L, li: P, input: {}, iframe: P, strong: L, textarea: N, noframes: P, big: L, small: L, span: _({ \"#\": 1, br: 1, b: 1, strong: 1, u: 1, i: 1, em: 1, sub: 1, sup: 1, strike: 1, span: 1 }), hr: L, dt: L, sub: L, optgroup: _({ option: 1 }), param: {}, bdo: L, \"var\": L, div: P, object: O, sup: L, dd: P, strike: L, area: {}, dir: Q, map: X(_({ area: 1, form: 1, p: 1 }), A, F, E), applet: O, dl: _({ dt: 1, dd: 1 }), del: L, isindex: {}, fieldset: X(_({ legend: 1 }), K), thead: M, ul: Q, acronym: L, b: L, a: X(_({ a: 1 }), J), blockquote: X(_({ td: 1, tr: 1, tbody: 1, li: 1 }), P), caption: L, i: L, u: L, tbody: M, s: L, address: X(D, I), tt: L, legend: L, q: L, pre: X(G, C), p: X(_({ a: 1 }), L), em: L, dfn: L });\n  }();function getDomNode(node, start, ltr, startFromChild, fn, guard) {\n    var tmpNode = startFromChild && node[start],\n        parent;!tmpNode && (tmpNode = node[ltr]);while (!tmpNode && (parent = (parent || node).parentNode)) {\n      if (parent.tagName == \"BODY\" || guard && !guard(parent)) {\n        return null;\n      }tmpNode = parent[ltr];\n    }if (tmpNode && fn && !fn(tmpNode)) {\n      return getDomNode(tmpNode, start, ltr, false, fn);\n    }return tmpNode;\n  }var attrFix = ie && browser.version < 9 ? { tabindex: \"tabIndex\", readonly: \"readOnly\", \"for\": \"htmlFor\", \"class\": \"className\", maxlength: \"maxLength\", cellspacing: \"cellSpacing\", cellpadding: \"cellPadding\", rowspan: \"rowSpan\", colspan: \"colSpan\", usemap: \"useMap\", frameborder: \"frameBorder\" } : { tabindex: \"tabIndex\", readonly: \"readOnly\" },\n      styleBlock = utils.listToMap([\"-webkit-box\", \"-moz-box\", \"block\", \"list-item\", \"table\", \"table-row-group\", \"table-header-group\", \"table-footer-group\", \"table-row\", \"table-column-group\", \"table-column\", \"table-cell\", \"table-caption\"]);var domUtils = dom.domUtils = { NODE_ELEMENT: 1, NODE_DOCUMENT: 9, NODE_TEXT: 3, NODE_COMMENT: 8, NODE_DOCUMENT_FRAGMENT: 11, POSITION_IDENTICAL: 0, POSITION_DISCONNECTED: 1, POSITION_FOLLOWING: 2, POSITION_PRECEDING: 4, POSITION_IS_CONTAINED: 8, POSITION_CONTAINS: 16, fillChar: ie && browser.version == \"6\" ? \"﻿\" : \"​\", keys: { 8: 1, 46: 1, 16: 1, 17: 1, 18: 1, 37: 1, 38: 1, 39: 1, 40: 1, 13: 1 }, getPosition: function getPosition(nodeA, nodeB) {\n      if (nodeA === nodeB) {\n        return 0;\n      }var node,\n          parentsA = [nodeA],\n          parentsB = [nodeB];node = nodeA;while (node = node.parentNode) {\n        if (node === nodeB) {\n          return 10;\n        }parentsA.push(node);\n      }node = nodeB;while (node = node.parentNode) {\n        if (node === nodeA) {\n          return 20;\n        }parentsB.push(node);\n      }parentsA.reverse();parentsB.reverse();if (parentsA[0] !== parentsB[0]) {\n        return 1;\n      }var i = -1;while (i++, parentsA[i] === parentsB[i]) {}nodeA = parentsA[i];nodeB = parentsB[i];while (nodeA = nodeA.nextSibling) {\n        if (nodeA === nodeB) {\n          return 4;\n        }\n      }return 2;\n    }, getNodeIndex: function getNodeIndex(node, ignoreTextNode) {\n      var preNode = node,\n          i = 0;while (preNode = preNode.previousSibling) {\n        if (ignoreTextNode && preNode.nodeType == 3) {\n          if (preNode.nodeType != preNode.nextSibling.nodeType) {\n            i++;\n          }continue;\n        }i++;\n      }return i;\n    }, inDoc: function inDoc(node, doc) {\n      return domUtils.getPosition(node, doc) == 10;\n    }, findParent: function findParent(node, filterFn, includeSelf) {\n      if (node && !domUtils.isBody(node)) {\n        node = includeSelf ? node : node.parentNode;while (node) {\n          if (!filterFn || filterFn(node) || domUtils.isBody(node)) {\n            return filterFn && !filterFn(node) && domUtils.isBody(node) ? null : node;\n          }node = node.parentNode;\n        }\n      }return null;\n    }, findParentByTagName: function findParentByTagName(node, tagNames, includeSelf, excludeFn) {\n      tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]);return domUtils.findParent(node, function (node) {\n        return tagNames[node.tagName] && !(excludeFn && excludeFn(node));\n      }, includeSelf);\n    }, findParents: function findParents(node, includeSelf, filterFn, closerFirst) {\n      var parents = includeSelf && (filterFn && filterFn(node) || !filterFn) ? [node] : [];while (node = domUtils.findParent(node, filterFn)) {\n        parents.push(node);\n      }return closerFirst ? parents : parents.reverse();\n    }, insertAfter: function insertAfter(node, newNode) {\n      return node.nextSibling ? node.parentNode.insertBefore(newNode, node.nextSibling) : node.parentNode.appendChild(newNode);\n    }, remove: function remove(node, keepChildren) {\n      var parent = node.parentNode,\n          child;if (parent) {\n        if (keepChildren && node.hasChildNodes()) {\n          while (child = node.firstChild) {\n            parent.insertBefore(child, node);\n          }\n        }parent.removeChild(node);\n      }return node;\n    }, getNextDomNode: function getNextDomNode(node, startFromChild, filterFn, guard) {\n      return getDomNode(node, \"firstChild\", \"nextSibling\", startFromChild, filterFn, guard);\n    }, getPreDomNode: function getPreDomNode(node, startFromChild, filterFn, guard) {\n      return getDomNode(node, \"lastChild\", \"previousSibling\", startFromChild, filterFn, guard);\n    }, isBookmarkNode: function isBookmarkNode(node) {\n      return node.nodeType == 1 && node.id && /^_baidu_bookmark_/i.test(node.id);\n    }, getWindow: function getWindow(node) {\n      var doc = node.ownerDocument || node;return doc.defaultView || doc.parentWindow;\n    }, getCommonAncestor: function getCommonAncestor(nodeA, nodeB) {\n      if (nodeA === nodeB) return nodeA;var parentsA = [nodeA],\n          parentsB = [nodeB],\n          parent = nodeA,\n          i = -1;while (parent = parent.parentNode) {\n        if (parent === nodeB) {\n          return parent;\n        }parentsA.push(parent);\n      }parent = nodeB;while (parent = parent.parentNode) {\n        if (parent === nodeA) return parent;parentsB.push(parent);\n      }parentsA.reverse();parentsB.reverse();while (i++, parentsA[i] === parentsB[i]) {}return i == 0 ? null : parentsA[i - 1];\n    }, clearEmptySibling: function clearEmptySibling(node, ignoreNext, ignorePre) {\n      function clear(next, dir) {\n        var tmpNode;while (next && !domUtils.isBookmarkNode(next) && (domUtils.isEmptyInlineElement(next) || !new RegExp(\"[^\t\\n\\r\" + domUtils.fillChar + \"]\").test(next.nodeValue))) {\n          tmpNode = next[dir];domUtils.remove(next);next = tmpNode;\n        }\n      }!ignoreNext && clear(node.nextSibling, \"nextSibling\");!ignorePre && clear(node.previousSibling, \"previousSibling\");\n    }, split: function split(node, offset) {\n      var doc = node.ownerDocument;if (browser.ie && offset == node.nodeValue.length) {\n        var next = doc.createTextNode(\"\");return domUtils.insertAfter(node, next);\n      }var retval = node.splitText(offset);if (browser.ie8) {\n        var tmpNode = doc.createTextNode(\"\");domUtils.insertAfter(retval, tmpNode);domUtils.remove(tmpNode);\n      }return retval;\n    }, isWhitespace: function isWhitespace(node) {\n      return !new RegExp(\"[^ \t\\n\\r\" + domUtils.fillChar + \"]\").test(node.nodeValue);\n    }, getXY: function getXY(element) {\n      var x = 0,\n          y = 0;while (element.offsetParent) {\n        y += element.offsetTop;x += element.offsetLeft;element = element.offsetParent;\n      }return { x: x, y: y };\n    }, on: function on(element, type, handler) {\n      var types = utils.isArray(type) ? type : utils.trim(type).split(/\\s+/),\n          k = types.length;if (k) while (k--) {\n        type = types[k];if (element.addEventListener) {\n          element.addEventListener(type, handler, false);\n        } else {\n          if (!handler._d) {\n            handler._d = { els: [] };\n          }var key = type + handler.toString(),\n              index = utils.indexOf(handler._d.els, element);if (!handler._d[key] || index == -1) {\n            if (index == -1) {\n              handler._d.els.push(element);\n            }if (!handler._d[key]) {\n              handler._d[key] = function (evt) {\n                return handler.call(evt.srcElement, evt || window.event);\n              };\n            }element.attachEvent(\"on\" + type, handler._d[key]);\n          }\n        }\n      }element = null;\n    }, un: function un(element, type, handler) {\n      var types = utils.isArray(type) ? type : utils.trim(type).split(/\\s+/),\n          k = types.length;if (k) while (k--) {\n        type = types[k];if (element.removeEventListener) {\n          element.removeEventListener(type, handler, false);\n        } else {\n          var key = type + handler.toString();try {\n            element.detachEvent(\"on\" + type, handler._d ? handler._d[key] : handler);\n          } catch (e) {}if (handler._d && handler._d[key]) {\n            var index = utils.indexOf(handler._d.els, element);if (index != -1) {\n              handler._d.els.splice(index, 1);\n            }handler._d.els.length == 0 && delete handler._d[key];\n          }\n        }\n      }\n    }, isSameElement: function isSameElement(nodeA, nodeB) {\n      if (nodeA.tagName != nodeB.tagName) {\n        return false;\n      }var thisAttrs = nodeA.attributes,\n          otherAttrs = nodeB.attributes;if (!ie && thisAttrs.length != otherAttrs.length) {\n        return false;\n      }var attrA,\n          attrB,\n          al = 0,\n          bl = 0;for (var i = 0; attrA = thisAttrs[i++];) {\n        if (attrA.nodeName == \"style\") {\n          if (attrA.specified) {\n            al++;\n          }if (domUtils.isSameStyle(nodeA, nodeB)) {\n            continue;\n          } else {\n            return false;\n          }\n        }if (ie) {\n          if (attrA.specified) {\n            al++;attrB = otherAttrs.getNamedItem(attrA.nodeName);\n          } else {\n            continue;\n          }\n        } else {\n          attrB = nodeB.attributes[attrA.nodeName];\n        }if (!attrB.specified || attrA.nodeValue != attrB.nodeValue) {\n          return false;\n        }\n      }if (ie) {\n        for (i = 0; attrB = otherAttrs[i++];) {\n          if (attrB.specified) {\n            bl++;\n          }\n        }if (al != bl) {\n          return false;\n        }\n      }return true;\n    }, isSameStyle: function isSameStyle(nodeA, nodeB) {\n      var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, \";\").replace(/( ?: ?)/g, \":\"),\n          styleB = nodeB.style.cssText.replace(/( ?; ?)/g, \";\").replace(/( ?: ?)/g, \":\");if (browser.opera) {\n        styleA = nodeA.style;styleB = nodeB.style;if (styleA.length != styleB.length) return false;for (var p in styleA) {\n          if (/^(\\d+|csstext)$/i.test(p)) {\n            continue;\n          }if (styleA[p] != styleB[p]) {\n            return false;\n          }\n        }return true;\n      }if (!styleA || !styleB) {\n        return styleA == styleB;\n      }styleA = styleA.split(\";\");styleB = styleB.split(\";\");if (styleA.length != styleB.length) {\n        return false;\n      }for (var i = 0, ci; ci = styleA[i++];) {\n        if (utils.indexOf(styleB, ci) == -1) {\n          return false;\n        }\n      }return true;\n    }, isBlockElm: function isBlockElm(node) {\n      return node.nodeType == 1 && (dtd.$block[node.tagName] || styleBlock[domUtils.getComputedStyle(node, \"display\")]) && !dtd.$nonChild[node.tagName];\n    }, isBody: function isBody(node) {\n      return node && node.nodeType == 1 && node.tagName.toLowerCase() == \"body\";\n    }, breakParent: function breakParent(node, parent) {\n      var tmpNode,\n          parentClone = node,\n          clone = node,\n          leftNodes,\n          rightNodes;do {\n        parentClone = parentClone.parentNode;if (leftNodes) {\n          tmpNode = parentClone.cloneNode(false);tmpNode.appendChild(leftNodes);leftNodes = tmpNode;tmpNode = parentClone.cloneNode(false);tmpNode.appendChild(rightNodes);rightNodes = tmpNode;\n        } else {\n          leftNodes = parentClone.cloneNode(false);rightNodes = leftNodes.cloneNode(false);\n        }while (tmpNode = clone.previousSibling) {\n          leftNodes.insertBefore(tmpNode, leftNodes.firstChild);\n        }while (tmpNode = clone.nextSibling) {\n          rightNodes.appendChild(tmpNode);\n        }clone = parentClone;\n      } while (parent !== parentClone);tmpNode = parent.parentNode;tmpNode.insertBefore(leftNodes, parent);tmpNode.insertBefore(rightNodes, parent);tmpNode.insertBefore(node, rightNodes);domUtils.remove(parent);return node;\n    }, isEmptyInlineElement: function isEmptyInlineElement(node) {\n      if (node.nodeType != 1 || !dtd.$removeEmpty[node.tagName]) {\n        return 0;\n      }node = node.firstChild;while (node) {\n        if (domUtils.isBookmarkNode(node)) {\n          return 0;\n        }if (node.nodeType == 1 && !domUtils.isEmptyInlineElement(node) || node.nodeType == 3 && !domUtils.isWhitespace(node)) {\n          return 0;\n        }node = node.nextSibling;\n      }return 1;\n    }, trimWhiteTextNode: function trimWhiteTextNode(node) {\n      function remove(dir) {\n        var child;while ((child = node[dir]) && child.nodeType == 3 && domUtils.isWhitespace(child)) {\n          node.removeChild(child);\n        }\n      }remove(\"firstChild\");remove(\"lastChild\");\n    }, mergeChild: function mergeChild(node, tagName, attrs) {\n      var list = domUtils.getElementsByTagName(node, node.tagName.toLowerCase());for (var i = 0, ci; ci = list[i++];) {\n        if (!ci.parentNode || domUtils.isBookmarkNode(ci)) {\n          continue;\n        }if (ci.tagName.toLowerCase() == \"span\") {\n          if (node === ci.parentNode) {\n            domUtils.trimWhiteTextNode(node);if (node.childNodes.length == 1) {\n              node.style.cssText = ci.style.cssText + \";\" + node.style.cssText;domUtils.remove(ci, true);continue;\n            }\n          }ci.style.cssText = node.style.cssText + \";\" + ci.style.cssText;if (attrs) {\n            var style = attrs.style;if (style) {\n              style = style.split(\";\");for (var j = 0, s; s = style[j++];) {\n                ci.style[utils.cssStyleToDomStyle(s.split(\":\")[0])] = s.split(\":\")[1];\n              }\n            }\n          }if (domUtils.isSameStyle(ci, node)) {\n            domUtils.remove(ci, true);\n          }continue;\n        }if (domUtils.isSameElement(node, ci)) {\n          domUtils.remove(ci, true);\n        }\n      }\n    }, getElementsByTagName: function getElementsByTagName(node, name, filter) {\n      if (filter && utils.isString(filter)) {\n        var className = filter;filter = function filter(node) {\n          return domUtils.hasClass(node, className);\n        };\n      }name = utils.trim(name).replace(/[ ]{2,}/g, \" \").split(\" \");var arr = [];for (var n = 0, ni; ni = name[n++];) {\n        var list = node.getElementsByTagName(ni);for (var i = 0, ci; ci = list[i++];) {\n          if (!filter || filter(ci)) arr.push(ci);\n        }\n      }return arr;\n    }, mergeToParent: function mergeToParent(node) {\n      var parent = node.parentNode;while (parent && dtd.$removeEmpty[parent.tagName]) {\n        if (parent.tagName == node.tagName || parent.tagName == \"A\") {\n          domUtils.trimWhiteTextNode(parent);if (parent.tagName == \"SPAN\" && !domUtils.isSameStyle(parent, node) || parent.tagName == \"A\" && node.tagName == \"SPAN\") {\n            if (parent.childNodes.length > 1 || parent !== node.parentNode) {\n              node.style.cssText = parent.style.cssText + \";\" + node.style.cssText;parent = parent.parentNode;continue;\n            } else {\n              parent.style.cssText += \";\" + node.style.cssText;if (parent.tagName == \"A\") {\n                parent.style.textDecoration = \"underline\";\n              }\n            }\n          }if (parent.tagName != \"A\") {\n            parent === node.parentNode && domUtils.remove(node, true);break;\n          }\n        }parent = parent.parentNode;\n      }\n    }, mergeSibling: function mergeSibling(node, ignorePre, ignoreNext) {\n      function merge(rtl, start, node) {\n        var next;if ((next = node[rtl]) && !domUtils.isBookmarkNode(next) && next.nodeType == 1 && domUtils.isSameElement(node, next)) {\n          while (next.firstChild) {\n            if (start == \"firstChild\") {\n              node.insertBefore(next.lastChild, node.firstChild);\n            } else {\n              node.appendChild(next.firstChild);\n            }\n          }domUtils.remove(next);\n        }\n      }!ignorePre && merge(\"previousSibling\", \"firstChild\", node);!ignoreNext && merge(\"nextSibling\", \"lastChild\", node);\n    }, unSelectable: ie && browser.ie9below || browser.opera ? function (node) {\n      node.onselectstart = function () {\n        return false;\n      };node.onclick = node.onkeyup = node.onkeydown = function () {\n        return false;\n      };node.unselectable = \"on\";node.setAttribute(\"unselectable\", \"on\");for (var i = 0, ci; ci = node.all[i++];) {\n        switch (ci.tagName.toLowerCase()) {case \"iframe\":case \"textarea\":case \"input\":case \"select\":\n            break;default:\n            ci.unselectable = \"on\";node.setAttribute(\"unselectable\", \"on\");}\n      }\n    } : function (node) {\n      node.style.MozUserSelect = node.style.webkitUserSelect = node.style.msUserSelect = node.style.KhtmlUserSelect = \"none\";\n    }, removeAttributes: function removeAttributes(node, attrNames) {\n      attrNames = utils.isArray(attrNames) ? attrNames : utils.trim(attrNames).replace(/[ ]{2,}/g, \" \").split(\" \");for (var i = 0, ci; ci = attrNames[i++];) {\n        ci = attrFix[ci] || ci;switch (ci) {case \"className\":\n            node[ci] = \"\";break;case \"style\":\n            node.style.cssText = \"\";var val = node.getAttributeNode(\"style\");!browser.ie && val && node.removeAttributeNode(val);}node.removeAttribute(ci);\n      }\n    }, createElement: function createElement(doc, tag, attrs) {\n      return domUtils.setAttributes(doc.createElement(tag), attrs);\n    }, setAttributes: function setAttributes(node, attrs) {\n      for (var attr in attrs) {\n        if (attrs.hasOwnProperty(attr)) {\n          var value = attrs[attr];switch (attr) {case \"class\":\n              node.className = value;break;case \"style\":\n              node.style.cssText = node.style.cssText + \";\" + value;break;case \"innerHTML\":\n              node[attr] = value;break;case \"value\":\n              node.value = value;break;default:\n              node.setAttribute(attrFix[attr] || attr, value);}\n        }\n      }return node;\n    }, getComputedStyle: function getComputedStyle(element, styleName) {\n      var pros = \"width height top left\";if (pros.indexOf(styleName) > -1) {\n        return element[\"offset\" + styleName.replace(/^\\w/, function (s) {\n          return s.toUpperCase();\n        })] + \"px\";\n      }if (element.nodeType == 3) {\n        element = element.parentNode;\n      }if (browser.ie && browser.version < 9 && styleName == \"font-size\" && !element.style.fontSize && !dtd.$empty[element.tagName] && !dtd.$nonChild[element.tagName]) {\n        var span = element.ownerDocument.createElement(\"span\");span.style.cssText = \"padding:0;border:0;font-family:simsun;\";span.innerHTML = \".\";element.appendChild(span);var result = span.offsetHeight;element.removeChild(span);span = null;return result + \"px\";\n      }try {\n        var value = domUtils.getStyle(element, styleName) || (window.getComputedStyle ? domUtils.getWindow(element).getComputedStyle(element, \"\").getPropertyValue(styleName) : (element.currentStyle || element.style)[utils.cssStyleToDomStyle(styleName)]);\n      } catch (e) {\n        return \"\";\n      }return utils.transUnitToPx(utils.fixColor(styleName, value));\n    }, removeClasses: function removeClasses(elm, classNames) {\n      classNames = utils.isArray(classNames) ? classNames : utils.trim(classNames).replace(/[ ]{2,}/g, \" \").split(\" \");for (var i = 0, ci, cls = elm.className; ci = classNames[i++];) {\n        cls = cls.replace(new RegExp(\"\\\\b\" + ci + \"\\\\b\"), \"\");\n      }cls = utils.trim(cls).replace(/[ ]{2,}/g, \" \");if (cls) {\n        elm.className = cls;\n      } else {\n        domUtils.removeAttributes(elm, [\"class\"]);\n      }\n    }, addClass: function addClass(elm, classNames) {\n      if (!elm) return;classNames = utils.trim(classNames).replace(/[ ]{2,}/g, \" \").split(\" \");for (var i = 0, ci, cls = elm.className; ci = classNames[i++];) {\n        if (!new RegExp(\"\\\\b\" + ci + \"\\\\b\").test(cls)) {\n          cls += \" \" + ci;\n        }\n      }elm.className = utils.trim(cls);\n    }, hasClass: function hasClass(element, className) {\n      if (utils.isRegExp(className)) {\n        return className.test(element.className);\n      }className = utils.trim(className).replace(/[ ]{2,}/g, \" \").split(\" \");for (var i = 0, ci, cls = element.className; ci = className[i++];) {\n        if (!new RegExp(\"\\\\b\" + ci + \"\\\\b\", \"i\").test(cls)) {\n          return false;\n        }\n      }return i - 1 == className.length;\n    }, preventDefault: function preventDefault(evt) {\n      evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;\n    }, removeStyle: function removeStyle(element, name) {\n      if (browser.ie) {\n        if (name == \"color\") {\n          name = \"(^|;)\" + name;\n        }element.style.cssText = element.style.cssText.replace(new RegExp(name + \"[^:]*:[^;]+;?\", \"ig\"), \"\");\n      } else {\n        if (element.style.removeProperty) {\n          element.style.removeProperty(name);\n        } else {\n          element.style.removeAttribute(utils.cssStyleToDomStyle(name));\n        }\n      }if (!element.style.cssText) {\n        domUtils.removeAttributes(element, [\"style\"]);\n      }\n    }, getStyle: function getStyle(element, name) {\n      var value = element.style[utils.cssStyleToDomStyle(name)];return utils.fixColor(name, value);\n    }, setStyle: function setStyle(element, name, value) {\n      element.style[utils.cssStyleToDomStyle(name)] = value;if (!utils.trim(element.style.cssText)) {\n        this.removeAttributes(element, \"style\");\n      }\n    }, setStyles: function setStyles(element, styles) {\n      for (var name in styles) {\n        if (styles.hasOwnProperty(name)) {\n          domUtils.setStyle(element, name, styles[name]);\n        }\n      }\n    }, removeDirtyAttr: function removeDirtyAttr(node) {\n      for (var i = 0, ci, nodes = node.getElementsByTagName(\"*\"); ci = nodes[i++];) {\n        ci.removeAttribute(\"_moz_dirty\");\n      }node.removeAttribute(\"_moz_dirty\");\n    }, getChildCount: function getChildCount(node, fn) {\n      var count = 0,\n          first = node.firstChild;fn = fn || function () {\n        return 1;\n      };while (first) {\n        if (fn(first)) {\n          count++;\n        }first = first.nextSibling;\n      }return count;\n    }, isEmptyNode: function isEmptyNode(node) {\n      return !node.firstChild || domUtils.getChildCount(node, function (node) {\n        return !domUtils.isBr(node) && !domUtils.isBookmarkNode(node) && !domUtils.isWhitespace(node);\n      }) == 0;\n    }, clearSelectedArr: function clearSelectedArr(nodes) {\n      var node;while (node = nodes.pop()) {\n        domUtils.removeAttributes(node, [\"class\"]);\n      }\n    }, scrollToView: function scrollToView(node, win, offsetTop) {\n      var getViewPaneSize = function getViewPaneSize() {\n        var doc = win.document,\n            mode = doc.compatMode == \"CSS1Compat\";return { width: (mode ? doc.documentElement.clientWidth : doc.body.clientWidth) || 0, height: (mode ? doc.documentElement.clientHeight : doc.body.clientHeight) || 0 };\n      },\n          getScrollPosition = function getScrollPosition(win) {\n        if (\"pageXOffset\" in win) {\n          return { x: win.pageXOffset || 0, y: win.pageYOffset || 0 };\n        } else {\n          var doc = win.document;return { x: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0, y: doc.documentElement.scrollTop || doc.body.scrollTop || 0 };\n        }\n      };var winHeight = getViewPaneSize().height,\n          offset = winHeight * -1 + offsetTop;offset += node.offsetHeight || 0;var elementPosition = domUtils.getXY(node);offset += elementPosition.y;var currentScroll = getScrollPosition(win).y;if (offset > currentScroll || offset < currentScroll - winHeight) {\n        win.scrollTo(0, offset + (offset < 0 ? -20 : 20));\n      }\n    }, isBr: function isBr(node) {\n      return node.nodeType == 1 && node.tagName == \"BR\";\n    }, isFillChar: function isFillChar(node, isInStart) {\n      if (node.nodeType != 3) return false;var text = node.nodeValue;if (isInStart) {\n        return new RegExp(\"^\" + domUtils.fillChar).test(text);\n      }return !text.replace(new RegExp(domUtils.fillChar, \"g\"), \"\").length;\n    }, isStartInblock: function isStartInblock(range) {\n      var tmpRange = range.cloneRange(),\n          flag = 0,\n          start = tmpRange.startContainer,\n          tmp;if (start.nodeType == 1 && start.childNodes[tmpRange.startOffset]) {\n        start = start.childNodes[tmpRange.startOffset];var pre = start.previousSibling;while (pre && domUtils.isFillChar(pre)) {\n          start = pre;pre = pre.previousSibling;\n        }\n      }if (this.isFillChar(start, true) && tmpRange.startOffset == 1) {\n        tmpRange.setStartBefore(start);start = tmpRange.startContainer;\n      }while (start && domUtils.isFillChar(start)) {\n        tmp = start;start = start.previousSibling;\n      }if (tmp) {\n        tmpRange.setStartBefore(tmp);start = tmpRange.startContainer;\n      }if (start.nodeType == 1 && domUtils.isEmptyNode(start) && tmpRange.startOffset == 1) {\n        tmpRange.setStart(start, 0).collapse(true);\n      }while (!tmpRange.startOffset) {\n        start = tmpRange.startContainer;if (domUtils.isBlockElm(start) || domUtils.isBody(start)) {\n          flag = 1;break;\n        }var pre = tmpRange.startContainer.previousSibling,\n            tmpNode;if (!pre) {\n          tmpRange.setStartBefore(tmpRange.startContainer);\n        } else {\n          while (pre && domUtils.isFillChar(pre)) {\n            tmpNode = pre;pre = pre.previousSibling;\n          }if (tmpNode) {\n            tmpRange.setStartBefore(tmpNode);\n          } else {\n            tmpRange.setStartBefore(tmpRange.startContainer);\n          }\n        }\n      }return flag && !domUtils.isBody(tmpRange.startContainer) ? 1 : 0;\n    }, isEmptyBlock: function isEmptyBlock(node, reg) {\n      if (node.nodeType != 1) return 0;reg = reg || new RegExp(\"[  \t\\r\\n\" + domUtils.fillChar + \"]\", \"g\");if (node[browser.ie ? \"innerText\" : \"textContent\"].replace(reg, \"\").length > 0) {\n        return 0;\n      }for (var n in dtd.$isNotEmpty) {\n        if (node.getElementsByTagName(n).length) {\n          return 0;\n        }\n      }return 1;\n    }, setViewportOffset: function setViewportOffset(element, offset) {\n      var left = parseInt(element.style.left) | 0;var top = parseInt(element.style.top) | 0;var rect = element.getBoundingClientRect();var offsetLeft = offset.left - rect.left;var offsetTop = offset.top - rect.top;if (offsetLeft) {\n        element.style.left = left + offsetLeft + \"px\";\n      }if (offsetTop) {\n        element.style.top = top + offsetTop + \"px\";\n      }\n    }, fillNode: function fillNode(doc, node) {\n      var tmpNode = browser.ie ? doc.createTextNode(domUtils.fillChar) : doc.createElement(\"br\");node.innerHTML = \"\";node.appendChild(tmpNode);\n    }, moveChild: function moveChild(src, tag, dir) {\n      while (src.firstChild) {\n        if (dir && tag.firstChild) {\n          tag.insertBefore(src.lastChild, tag.firstChild);\n        } else {\n          tag.appendChild(src.firstChild);\n        }\n      }\n    }, hasNoAttributes: function hasNoAttributes(node) {\n      return browser.ie ? /^<\\w+\\s*?>/.test(node.outerHTML) : node.attributes.length == 0;\n    }, isCustomeNode: function isCustomeNode(node) {\n      return node.nodeType == 1 && node.getAttribute(\"_ue_custom_node_\");\n    }, isTagNode: function isTagNode(node, tagNames) {\n      return node.nodeType == 1 && new RegExp(\"\\\\b\" + node.tagName + \"\\\\b\", \"i\").test(tagNames);\n    }, filterNodeList: function filterNodeList(nodelist, filter, forAll) {\n      var results = [];if (!utils.isFunction(filter)) {\n        var str = filter;filter = function filter(n) {\n          return utils.indexOf(utils.isArray(str) ? str : str.split(\" \"), n.tagName.toLowerCase()) != -1;\n        };\n      }utils.each(nodelist, function (n) {\n        filter(n) && results.push(n);\n      });return results.length == 0 ? null : results.length == 1 || !forAll ? results[0] : results;\n    }, isInNodeEndBoundary: function isInNodeEndBoundary(rng, node) {\n      var start = rng.startContainer;if (start.nodeType == 3 && rng.startOffset != start.nodeValue.length) {\n        return 0;\n      }if (start.nodeType == 1 && rng.startOffset != start.childNodes.length) {\n        return 0;\n      }while (start !== node) {\n        if (start.nextSibling) {\n          return 0;\n        }start = start.parentNode;\n      }return 1;\n    }, isBoundaryNode: function isBoundaryNode(node, dir) {\n      var tmp;while (!domUtils.isBody(node)) {\n        tmp = node;node = node.parentNode;if (tmp !== node[dir]) {\n          return false;\n        }\n      }return true;\n    }, fillHtml: browser.ie11below ? \"&nbsp;\" : \"<br/>\" };var fillCharReg = new RegExp(domUtils.fillChar, \"g\");!function () {\n    var guid = 0,\n        fillChar = domUtils.fillChar,\n        fillData;function updateCollapse(range) {\n      range.collapsed = range.startContainer && range.endContainer && range.startContainer === range.endContainer && range.startOffset == range.endOffset;\n    }function selectOneNode(rng) {\n      return !rng.collapsed && rng.startContainer.nodeType == 1 && rng.startContainer === rng.endContainer && rng.endOffset - rng.startOffset == 1;\n    }function setEndPoint(toStart, node, offset, range) {\n      if (node.nodeType == 1 && (dtd.$empty[node.tagName] || dtd.$nonChild[node.tagName])) {\n        offset = domUtils.getNodeIndex(node) + (toStart ? 0 : 1);node = node.parentNode;\n      }if (toStart) {\n        range.startContainer = node;range.startOffset = offset;if (!range.endContainer) {\n          range.collapse(true);\n        }\n      } else {\n        range.endContainer = node;range.endOffset = offset;if (!range.startContainer) {\n          range.collapse(false);\n        }\n      }updateCollapse(range);return range;\n    }function execContentsAction(range, action) {\n      var start = range.startContainer,\n          end = range.endContainer,\n          startOffset = range.startOffset,\n          endOffset = range.endOffset,\n          doc = range.document,\n          frag = doc.createDocumentFragment(),\n          tmpStart,\n          tmpEnd;if (start.nodeType == 1) {\n        start = start.childNodes[startOffset] || (tmpStart = start.appendChild(doc.createTextNode(\"\")));\n      }if (end.nodeType == 1) {\n        end = end.childNodes[endOffset] || (tmpEnd = end.appendChild(doc.createTextNode(\"\")));\n      }if (start === end && start.nodeType == 3) {\n        frag.appendChild(doc.createTextNode(start.substringData(startOffset, endOffset - startOffset)));if (action) {\n          start.deleteData(startOffset, endOffset - startOffset);range.collapse(true);\n        }return frag;\n      }var current,\n          currentLevel,\n          clone = frag,\n          startParents = domUtils.findParents(start, true),\n          endParents = domUtils.findParents(end, true);for (var i = 0; startParents[i] == endParents[i];) {\n        i++;\n      }for (var j = i, si; si = startParents[j]; j++) {\n        current = si.nextSibling;if (si == start) {\n          if (!tmpStart) {\n            if (range.startContainer.nodeType == 3) {\n              clone.appendChild(doc.createTextNode(start.nodeValue.slice(startOffset)));if (action) {\n                start.deleteData(startOffset, start.nodeValue.length - startOffset);\n              }\n            } else {\n              clone.appendChild(!action ? start.cloneNode(true) : start);\n            }\n          }\n        } else {\n          currentLevel = si.cloneNode(false);clone.appendChild(currentLevel);\n        }while (current) {\n          if (current === end || current === endParents[j]) {\n            break;\n          }si = current.nextSibling;clone.appendChild(!action ? current.cloneNode(true) : current);current = si;\n        }clone = currentLevel;\n      }clone = frag;if (!startParents[i]) {\n        clone.appendChild(startParents[i - 1].cloneNode(false));clone = clone.firstChild;\n      }for (var j = i, ei; ei = endParents[j]; j++) {\n        current = ei.previousSibling;if (ei == end) {\n          if (!tmpEnd && range.endContainer.nodeType == 3) {\n            clone.appendChild(doc.createTextNode(end.substringData(0, endOffset)));if (action) {\n              end.deleteData(0, endOffset);\n            }\n          }\n        } else {\n          currentLevel = ei.cloneNode(false);clone.appendChild(currentLevel);\n        }if (j != i || !startParents[i]) {\n          while (current) {\n            if (current === start) {\n              break;\n            }ei = current.previousSibling;clone.insertBefore(!action ? current.cloneNode(true) : current, clone.firstChild);current = ei;\n          }\n        }clone = currentLevel;\n      }if (action) {\n        range.setStartBefore(!endParents[i] ? endParents[i - 1] : !startParents[i] ? startParents[i - 1] : endParents[i]).collapse(true);\n      }tmpStart && domUtils.remove(tmpStart);tmpEnd && domUtils.remove(tmpEnd);return frag;\n    }var Range = dom.Range = function (document) {\n      var me = this;me.startContainer = me.startOffset = me.endContainer = me.endOffset = null;me.document = document;me.collapsed = true;\n    };function removeFillData(doc, excludeNode) {\n      try {\n        if (fillData && domUtils.inDoc(fillData, doc)) {\n          if (!fillData.nodeValue.replace(fillCharReg, \"\").length) {\n            var tmpNode = fillData.parentNode;domUtils.remove(fillData);while (tmpNode && domUtils.isEmptyInlineElement(tmpNode) && (browser.safari ? !(domUtils.getPosition(tmpNode, excludeNode) & domUtils.POSITION_CONTAINS) : !tmpNode.contains(excludeNode))) {\n              fillData = tmpNode.parentNode;domUtils.remove(tmpNode);tmpNode = fillData;\n            }\n          } else {\n            fillData.nodeValue = fillData.nodeValue.replace(fillCharReg, \"\");\n          }\n        }\n      } catch (e) {}\n    }function mergeSibling(node, dir) {\n      var tmpNode;node = node[dir];while (node && domUtils.isFillChar(node)) {\n        tmpNode = node[dir];domUtils.remove(node);node = tmpNode;\n      }\n    }Range.prototype = { cloneContents: function cloneContents() {\n        return this.collapsed ? null : execContentsAction(this, 0);\n      }, deleteContents: function deleteContents() {\n        var txt;if (!this.collapsed) {\n          execContentsAction(this, 1);\n        }if (browser.webkit) {\n          txt = this.startContainer;if (txt.nodeType == 3 && !txt.nodeValue.length) {\n            this.setStartBefore(txt).collapse(true);domUtils.remove(txt);\n          }\n        }return this;\n      }, extractContents: function extractContents() {\n        return this.collapsed ? null : execContentsAction(this, 2);\n      }, setStart: function setStart(node, offset) {\n        return setEndPoint(true, node, offset, this);\n      }, setEnd: function setEnd(node, offset) {\n        return setEndPoint(false, node, offset, this);\n      }, setStartAfter: function setStartAfter(node) {\n        return this.setStart(node.parentNode, domUtils.getNodeIndex(node) + 1);\n      }, setStartBefore: function setStartBefore(node) {\n        return this.setStart(node.parentNode, domUtils.getNodeIndex(node));\n      }, setEndAfter: function setEndAfter(node) {\n        return this.setEnd(node.parentNode, domUtils.getNodeIndex(node) + 1);\n      }, setEndBefore: function setEndBefore(node) {\n        return this.setEnd(node.parentNode, domUtils.getNodeIndex(node));\n      }, setStartAtFirst: function setStartAtFirst(node) {\n        return this.setStart(node, 0);\n      }, setStartAtLast: function setStartAtLast(node) {\n        return this.setStart(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);\n      }, setEndAtFirst: function setEndAtFirst(node) {\n        return this.setEnd(node, 0);\n      }, setEndAtLast: function setEndAtLast(node) {\n        return this.setEnd(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);\n      }, selectNode: function selectNode(node) {\n        return this.setStartBefore(node).setEndAfter(node);\n      }, selectNodeContents: function selectNodeContents(node) {\n        return this.setStart(node, 0).setEndAtLast(node);\n      }, cloneRange: function cloneRange() {\n        var me = this;return new Range(me.document).setStart(me.startContainer, me.startOffset).setEnd(me.endContainer, me.endOffset);\n      }, collapse: function collapse(toStart) {\n        var me = this;if (toStart) {\n          me.endContainer = me.startContainer;me.endOffset = me.startOffset;\n        } else {\n          me.startContainer = me.endContainer;me.startOffset = me.endOffset;\n        }me.collapsed = true;return me;\n      }, shrinkBoundary: function shrinkBoundary(ignoreEnd) {\n        var me = this,\n            child,\n            collapsed = me.collapsed;function check(node) {\n          return node.nodeType == 1 && !domUtils.isBookmarkNode(node) && !dtd.$empty[node.tagName] && !dtd.$nonChild[node.tagName];\n        }while (me.startContainer.nodeType == 1 && (child = me.startContainer.childNodes[me.startOffset]) && check(child)) {\n          me.setStart(child, 0);\n        }if (collapsed) {\n          return me.collapse(true);\n        }if (!ignoreEnd) {\n          while (me.endContainer.nodeType == 1 && me.endOffset > 0 && (child = me.endContainer.childNodes[me.endOffset - 1]) && check(child)) {\n            me.setEnd(child, child.childNodes.length);\n          }\n        }return me;\n      }, getCommonAncestor: function getCommonAncestor(includeSelf, ignoreTextNode) {\n        var me = this,\n            start = me.startContainer,\n            end = me.endContainer;if (start === end) {\n          if (includeSelf && selectOneNode(this)) {\n            start = start.childNodes[me.startOffset];if (start.nodeType == 1) return start;\n          }return ignoreTextNode && start.nodeType == 3 ? start.parentNode : start;\n        }return domUtils.getCommonAncestor(start, end);\n      }, trimBoundary: function trimBoundary(ignoreEnd) {\n        this.txtToElmBoundary();var start = this.startContainer,\n            offset = this.startOffset,\n            collapsed = this.collapsed,\n            end = this.endContainer;if (start.nodeType == 3) {\n          if (offset == 0) {\n            this.setStartBefore(start);\n          } else {\n            if (offset >= start.nodeValue.length) {\n              this.setStartAfter(start);\n            } else {\n              var textNode = domUtils.split(start, offset);if (start === end) {\n                this.setEnd(textNode, this.endOffset - offset);\n              } else if (start.parentNode === end) {\n                this.endOffset += 1;\n              }this.setStartBefore(textNode);\n            }\n          }if (collapsed) {\n            return this.collapse(true);\n          }\n        }if (!ignoreEnd) {\n          offset = this.endOffset;end = this.endContainer;if (end.nodeType == 3) {\n            if (offset == 0) {\n              this.setEndBefore(end);\n            } else {\n              offset < end.nodeValue.length && domUtils.split(end, offset);this.setEndAfter(end);\n            }\n          }\n        }return this;\n      }, txtToElmBoundary: function txtToElmBoundary(ignoreCollapsed) {\n        function adjust(r, c) {\n          var container = r[c + \"Container\"],\n              offset = r[c + \"Offset\"];if (container.nodeType == 3) {\n            if (!offset) {\n              r[\"set\" + c.replace(/(\\w)/, function (a) {\n                return a.toUpperCase();\n              }) + \"Before\"](container);\n            } else if (offset >= container.nodeValue.length) {\n              r[\"set\" + c.replace(/(\\w)/, function (a) {\n                return a.toUpperCase();\n              }) + \"After\"](container);\n            }\n          }\n        }if (ignoreCollapsed || !this.collapsed) {\n          adjust(this, \"start\");adjust(this, \"end\");\n        }return this;\n      }, insertNode: function insertNode(node) {\n        var first = node,\n            length = 1;if (node.nodeType == 11) {\n          first = node.firstChild;length = node.childNodes.length;\n        }this.trimBoundary(true);var start = this.startContainer,\n            offset = this.startOffset;var nextNode = start.childNodes[offset];if (nextNode) {\n          start.insertBefore(node, nextNode);\n        } else {\n          start.appendChild(node);\n        }if (first.parentNode === this.endContainer) {\n          this.endOffset = this.endOffset + length;\n        }return this.setStartBefore(first);\n      }, setCursor: function setCursor(toEnd, noFillData) {\n        return this.collapse(!toEnd).select(noFillData);\n      }, createBookmark: function createBookmark(serialize, same) {\n        var endNode,\n            startNode = this.document.createElement(\"span\");startNode.style.cssText = \"display:none;line-height:0px;\";startNode.appendChild(this.document.createTextNode(\"‍\"));startNode.id = \"_baidu_bookmark_start_\" + (same ? \"\" : guid++);if (!this.collapsed) {\n          endNode = startNode.cloneNode(true);endNode.id = \"_baidu_bookmark_end_\" + (same ? \"\" : guid++);\n        }this.insertNode(startNode);if (endNode) {\n          this.collapse().insertNode(endNode).setEndBefore(endNode);\n        }this.setStartAfter(startNode);return { start: serialize ? startNode.id : startNode, end: endNode ? serialize ? endNode.id : endNode : null, id: serialize };\n      }, moveToBookmark: function moveToBookmark(bookmark) {\n        var start = bookmark.id ? this.document.getElementById(bookmark.start) : bookmark.start,\n            end = bookmark.end && bookmark.id ? this.document.getElementById(bookmark.end) : bookmark.end;this.setStartBefore(start);domUtils.remove(start);if (end) {\n          this.setEndBefore(end);domUtils.remove(end);\n        } else {\n          this.collapse(true);\n        }return this;\n      }, enlarge: function enlarge(toBlock, stopFn) {\n        var isBody = domUtils.isBody,\n            pre,\n            node,\n            tmp = this.document.createTextNode(\"\");if (toBlock) {\n          node = this.startContainer;if (node.nodeType == 1) {\n            if (node.childNodes[this.startOffset]) {\n              pre = node = node.childNodes[this.startOffset];\n            } else {\n              node.appendChild(tmp);pre = node = tmp;\n            }\n          } else {\n            pre = node;\n          }while (1) {\n            if (domUtils.isBlockElm(node)) {\n              node = pre;while ((pre = node.previousSibling) && !domUtils.isBlockElm(pre)) {\n                node = pre;\n              }this.setStartBefore(node);break;\n            }pre = node;node = node.parentNode;\n          }node = this.endContainer;if (node.nodeType == 1) {\n            if (pre = node.childNodes[this.endOffset]) {\n              node.insertBefore(tmp, pre);\n            } else {\n              node.appendChild(tmp);\n            }pre = node = tmp;\n          } else {\n            pre = node;\n          }while (1) {\n            if (domUtils.isBlockElm(node)) {\n              node = pre;while ((pre = node.nextSibling) && !domUtils.isBlockElm(pre)) {\n                node = pre;\n              }this.setEndAfter(node);break;\n            }pre = node;node = node.parentNode;\n          }if (tmp.parentNode === this.endContainer) {\n            this.endOffset--;\n          }domUtils.remove(tmp);\n        }if (!this.collapsed) {\n          while (this.startOffset == 0) {\n            if (stopFn && stopFn(this.startContainer)) {\n              break;\n            }if (isBody(this.startContainer)) {\n              break;\n            }this.setStartBefore(this.startContainer);\n          }while (this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length)) {\n            if (stopFn && stopFn(this.endContainer)) {\n              break;\n            }if (isBody(this.endContainer)) {\n              break;\n            }this.setEndAfter(this.endContainer);\n          }\n        }return this;\n      }, enlargeToBlockElm: function enlargeToBlockElm(ignoreEnd) {\n        while (!domUtils.isBlockElm(this.startContainer)) {\n          this.setStartBefore(this.startContainer);\n        }if (!ignoreEnd) {\n          while (!domUtils.isBlockElm(this.endContainer)) {\n            this.setEndAfter(this.endContainer);\n          }\n        }return this;\n      }, adjustmentBoundary: function adjustmentBoundary() {\n        if (!this.collapsed) {\n          while (!domUtils.isBody(this.startContainer) && this.startOffset == this.startContainer[this.startContainer.nodeType == 3 ? \"nodeValue\" : \"childNodes\"].length && this.startContainer[this.startContainer.nodeType == 3 ? \"nodeValue\" : \"childNodes\"].length) {\n            this.setStartAfter(this.startContainer);\n          }while (!domUtils.isBody(this.endContainer) && !this.endOffset && this.endContainer[this.endContainer.nodeType == 3 ? \"nodeValue\" : \"childNodes\"].length) {\n            this.setEndBefore(this.endContainer);\n          }\n        }return this;\n      }, applyInlineStyle: function applyInlineStyle(tagName, attrs, list) {\n        if (this.collapsed) return this;this.trimBoundary().enlarge(false, function (node) {\n          return node.nodeType == 1 && domUtils.isBlockElm(node);\n        }).adjustmentBoundary();var bookmark = this.createBookmark(),\n            end = bookmark.end,\n            filterFn = function filterFn(node) {\n          return node.nodeType == 1 ? node.tagName.toLowerCase() != \"br\" : !domUtils.isWhitespace(node);\n        },\n            current = domUtils.getNextDomNode(bookmark.start, false, filterFn),\n            node,\n            pre,\n            range = this.cloneRange();while (current && domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING) {\n          if (current.nodeType == 3 || dtd[tagName][current.tagName]) {\n            range.setStartBefore(current);node = current;while (node && (node.nodeType == 3 || dtd[tagName][node.tagName]) && node !== end) {\n              pre = node;node = domUtils.getNextDomNode(node, node.nodeType == 1, null, function (parent) {\n                return dtd[tagName][parent.tagName];\n              });\n            }var frag = range.setEndAfter(pre).extractContents(),\n                elm;if (list && list.length > 0) {\n              var level, top;top = level = list[0].cloneNode(false);for (var i = 1, ci; ci = list[i++];) {\n                level.appendChild(ci.cloneNode(false));level = level.firstChild;\n              }elm = level;\n            } else {\n              elm = range.document.createElement(tagName);\n            }if (attrs) {\n              domUtils.setAttributes(elm, attrs);\n            }elm.appendChild(frag);range.insertNode(list ? top : elm);var aNode;if (tagName == \"span\" && attrs.style && /text\\-decoration/.test(attrs.style) && (aNode = domUtils.findParentByTagName(elm, \"a\", true))) {\n              domUtils.setAttributes(aNode, attrs);domUtils.remove(elm, true);elm = aNode;\n            } else {\n              domUtils.mergeSibling(elm);domUtils.clearEmptySibling(elm);\n            }domUtils.mergeChild(elm, attrs);current = domUtils.getNextDomNode(elm, false, filterFn);domUtils.mergeToParent(elm);if (node === end) {\n              break;\n            }\n          } else {\n            current = domUtils.getNextDomNode(current, true, filterFn);\n          }\n        }return this.moveToBookmark(bookmark);\n      }, removeInlineStyle: function removeInlineStyle(tagNames) {\n        if (this.collapsed) return this;tagNames = utils.isArray(tagNames) ? tagNames : [tagNames];this.shrinkBoundary().adjustmentBoundary();var start = this.startContainer,\n            end = this.endContainer;while (1) {\n          if (start.nodeType == 1) {\n            if (utils.indexOf(tagNames, start.tagName.toLowerCase()) > -1) {\n              break;\n            }if (start.tagName.toLowerCase() == \"body\") {\n              start = null;break;\n            }\n          }start = start.parentNode;\n        }while (1) {\n          if (end.nodeType == 1) {\n            if (utils.indexOf(tagNames, end.tagName.toLowerCase()) > -1) {\n              break;\n            }if (end.tagName.toLowerCase() == \"body\") {\n              end = null;break;\n            }\n          }end = end.parentNode;\n        }var bookmark = this.createBookmark(),\n            frag,\n            tmpRange;if (start) {\n          tmpRange = this.cloneRange().setEndBefore(bookmark.start).setStartBefore(start);frag = tmpRange.extractContents();tmpRange.insertNode(frag);domUtils.clearEmptySibling(start, true);start.parentNode.insertBefore(bookmark.start, start);\n        }if (end) {\n          tmpRange = this.cloneRange().setStartAfter(bookmark.end).setEndAfter(end);frag = tmpRange.extractContents();tmpRange.insertNode(frag);domUtils.clearEmptySibling(end, false, true);end.parentNode.insertBefore(bookmark.end, end.nextSibling);\n        }var current = domUtils.getNextDomNode(bookmark.start, false, function (node) {\n          return node.nodeType == 1;\n        }),\n            next;while (current && current !== bookmark.end) {\n          next = domUtils.getNextDomNode(current, true, function (node) {\n            return node.nodeType == 1;\n          });if (utils.indexOf(tagNames, current.tagName.toLowerCase()) > -1) {\n            domUtils.remove(current, true);\n          }current = next;\n        }return this.moveToBookmark(bookmark);\n      }, getClosedNode: function getClosedNode() {\n        var node;if (!this.collapsed) {\n          var range = this.cloneRange().adjustmentBoundary().shrinkBoundary();if (selectOneNode(range)) {\n            var child = range.startContainer.childNodes[range.startOffset];if (child && child.nodeType == 1 && (dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName])) {\n              node = child;\n            }\n          }\n        }return node;\n      }, select: browser.ie ? function (noFillData, textRange) {\n        var nativeRange;if (!this.collapsed) this.shrinkBoundary();var node = this.getClosedNode();if (node && !textRange) {\n          try {\n            nativeRange = this.document.body.createControlRange();nativeRange.addElement(node);nativeRange.select();\n          } catch (e) {}return this;\n        }var bookmark = this.createBookmark(),\n            start = bookmark.start,\n            end;nativeRange = this.document.body.createTextRange();nativeRange.moveToElementText(start);nativeRange.moveStart(\"character\", 1);if (!this.collapsed) {\n          var nativeRangeEnd = this.document.body.createTextRange();end = bookmark.end;nativeRangeEnd.moveToElementText(end);nativeRange.setEndPoint(\"EndToEnd\", nativeRangeEnd);\n        } else {\n          if (!noFillData && this.startContainer.nodeType != 3) {\n            var tmpText = this.document.createTextNode(fillChar),\n                tmp = this.document.createElement(\"span\");tmp.appendChild(this.document.createTextNode(fillChar));start.parentNode.insertBefore(tmp, start);start.parentNode.insertBefore(tmpText, start);removeFillData(this.document, tmpText);fillData = tmpText;mergeSibling(tmp, \"previousSibling\");mergeSibling(start, \"nextSibling\");nativeRange.moveStart(\"character\", -1);nativeRange.collapse(true);\n          }\n        }this.moveToBookmark(bookmark);tmp && domUtils.remove(tmp);try {\n          nativeRange.select();\n        } catch (e) {}return this;\n      } : function (notInsertFillData) {\n        function checkOffset(rng) {\n          function check(node, offset, dir) {\n            if (node.nodeType == 3 && node.nodeValue.length < offset) {\n              rng[dir + \"Offset\"] = node.nodeValue.length;\n            }\n          }check(rng.startContainer, rng.startOffset, \"start\");check(rng.endContainer, rng.endOffset, \"end\");\n        }var win = domUtils.getWindow(this.document),\n            sel = win.getSelection(),\n            txtNode;browser.gecko ? this.document.body.focus() : win.focus();if (sel) {\n          sel.removeAllRanges();if (this.collapsed && !notInsertFillData) {\n            var start = this.startContainer,\n                child = start;if (start.nodeType == 1) {\n              child = start.childNodes[this.startOffset];\n            }if (!(start.nodeType == 3 && this.startOffset) && (child ? !child.previousSibling || child.previousSibling.nodeType != 3 : !start.lastChild || start.lastChild.nodeType != 3)) {\n              txtNode = this.document.createTextNode(fillChar);this.insertNode(txtNode);removeFillData(this.document, txtNode);mergeSibling(txtNode, \"previousSibling\");mergeSibling(txtNode, \"nextSibling\");fillData = txtNode;this.setStart(txtNode, browser.webkit ? 1 : 0).collapse(true);\n            }\n          }var nativeRange = this.document.createRange();if (this.collapsed && browser.opera && this.startContainer.nodeType == 1) {\n            var child = this.startContainer.childNodes[this.startOffset];if (!child) {\n              child = this.startContainer.lastChild;if (child && domUtils.isBr(child)) {\n                this.setStartBefore(child).collapse(true);\n              }\n            } else {\n              while (child && domUtils.isBlockElm(child)) {\n                if (child.nodeType == 1 && child.childNodes[0]) {\n                  child = child.childNodes[0];\n                } else {\n                  break;\n                }\n              }child && this.setStartBefore(child).collapse(true);\n            }\n          }checkOffset(this);nativeRange.setStart(this.startContainer, this.startOffset);nativeRange.setEnd(this.endContainer, this.endOffset);sel.addRange(nativeRange);\n        }return this;\n      }, scrollToView: function scrollToView(win, offset) {\n        win = win ? window : domUtils.getWindow(this.document);var me = this,\n            span = me.document.createElement(\"span\");span.innerHTML = \"&nbsp;\";me.cloneRange().insertNode(span);domUtils.scrollToView(span, win, offset);domUtils.remove(span);return me;\n      }, inFillChar: function inFillChar() {\n        var start = this.startContainer;if (this.collapsed && start.nodeType == 3 && start.nodeValue.replace(new RegExp(\"^\" + domUtils.fillChar), \"\").length + 1 == start.nodeValue.length) {\n          return true;\n        }return false;\n      }, createAddress: function createAddress(ignoreEnd, ignoreTxt) {\n        var addr = {},\n            me = this;function getAddress(isStart) {\n          var node = isStart ? me.startContainer : me.endContainer;var parents = domUtils.findParents(node, true, function (node) {\n            return !domUtils.isBody(node);\n          }),\n              addrs = [];for (var i = 0, ci; ci = parents[i++];) {\n            addrs.push(domUtils.getNodeIndex(ci, ignoreTxt));\n          }var firstIndex = 0;if (ignoreTxt) {\n            if (node.nodeType == 3) {\n              var tmpNode = node.previousSibling;while (tmpNode && tmpNode.nodeType == 3) {\n                firstIndex += tmpNode.nodeValue.replace(fillCharReg, \"\").length;tmpNode = tmpNode.previousSibling;\n              }firstIndex += isStart ? me.startOffset : me.endOffset;\n            } else {\n              node = node.childNodes[isStart ? me.startOffset : me.endOffset];if (node) {\n                firstIndex = domUtils.getNodeIndex(node, ignoreTxt);\n              } else {\n                node = isStart ? me.startContainer : me.endContainer;var first = node.firstChild;while (first) {\n                  if (domUtils.isFillChar(first)) {\n                    first = first.nextSibling;continue;\n                  }firstIndex++;if (first.nodeType == 3) {\n                    while (first && first.nodeType == 3) {\n                      first = first.nextSibling;\n                    }\n                  } else {\n                    first = first.nextSibling;\n                  }\n                }\n              }\n            }\n          } else {\n            firstIndex = isStart ? domUtils.isFillChar(node) ? 0 : me.startOffset : me.endOffset;\n          }if (firstIndex < 0) {\n            firstIndex = 0;\n          }addrs.push(firstIndex);return addrs;\n        }addr.startAddress = getAddress(true);if (!ignoreEnd) {\n          addr.endAddress = me.collapsed ? [].concat(addr.startAddress) : getAddress();\n        }return addr;\n      }, moveToAddress: function moveToAddress(addr, ignoreEnd) {\n        var me = this;function getNode(address, isStart) {\n          var tmpNode = me.document.body,\n              parentNode,\n              offset;for (var i = 0, ci, l = address.length; i < l; i++) {\n            ci = address[i];parentNode = tmpNode;tmpNode = tmpNode.childNodes[ci];if (!tmpNode) {\n              offset = ci;break;\n            }\n          }if (isStart) {\n            if (tmpNode) {\n              me.setStartBefore(tmpNode);\n            } else {\n              me.setStart(parentNode, offset);\n            }\n          } else {\n            if (tmpNode) {\n              me.setEndBefore(tmpNode);\n            } else {\n              me.setEnd(parentNode, offset);\n            }\n          }\n        }getNode(addr.startAddress, true);!ignoreEnd && addr.endAddress && getNode(addr.endAddress);return me;\n      }, equals: function equals(rng) {\n        for (var p in this) {\n          if (this.hasOwnProperty(p)) {\n            if (this[p] !== rng[p]) return false;\n          }\n        }return true;\n      }, traversal: function traversal(doFn, filterFn) {\n        if (this.collapsed) return this;var bookmark = this.createBookmark(),\n            end = bookmark.end,\n            current = domUtils.getNextDomNode(bookmark.start, false, filterFn);while (current && current !== end && domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING) {\n          var tmpNode = domUtils.getNextDomNode(current, false, filterFn);doFn(current);current = tmpNode;\n        }return this.moveToBookmark(bookmark);\n      } };\n  }();!function () {\n    function getBoundaryInformation(range, start) {\n      var getIndex = domUtils.getNodeIndex;range = range.duplicate();range.collapse(start);var parent = range.parentElement();if (!parent.hasChildNodes()) {\n        return { container: parent, offset: 0 };\n      }var siblings = parent.children,\n          child,\n          testRange = range.duplicate(),\n          startIndex = 0,\n          endIndex = siblings.length - 1,\n          index = -1,\n          distance;while (startIndex <= endIndex) {\n        index = Math.floor((startIndex + endIndex) / 2);child = siblings[index];testRange.moveToElementText(child);var position = testRange.compareEndPoints(\"StartToStart\", range);if (position > 0) {\n          endIndex = index - 1;\n        } else if (position < 0) {\n          startIndex = index + 1;\n        } else {\n          return { container: parent, offset: getIndex(child) };\n        }\n      }if (index == -1) {\n        testRange.moveToElementText(parent);testRange.setEndPoint(\"StartToStart\", range);distance = testRange.text.replace(/(\\r\\n|\\r)/g, \"\\n\").length;siblings = parent.childNodes;if (!distance) {\n          child = siblings[siblings.length - 1];return { container: child, offset: child.nodeValue.length };\n        }var i = siblings.length;while (distance > 0) {\n          distance -= siblings[--i].nodeValue.length;\n        }return { container: siblings[i], offset: -distance };\n      }testRange.collapse(position > 0);testRange.setEndPoint(position > 0 ? \"StartToStart\" : \"EndToStart\", range);distance = testRange.text.replace(/(\\r\\n|\\r)/g, \"\\n\").length;if (!distance) {\n        return dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName] ? { container: parent, offset: getIndex(child) + (position > 0 ? 0 : 1) } : { container: child, offset: position > 0 ? 0 : child.childNodes.length };\n      }while (distance > 0) {\n        try {\n          var pre = child;child = child[position > 0 ? \"previousSibling\" : \"nextSibling\"];distance -= child.nodeValue.length;\n        } catch (e) {\n          return { container: parent, offset: getIndex(pre) };\n        }\n      }return { container: child, offset: position > 0 ? -distance : child.nodeValue.length + distance };\n    }function transformIERangeToRange(ieRange, range) {\n      if (ieRange.item) {\n        range.selectNode(ieRange.item(0));\n      } else {\n        var bi = getBoundaryInformation(ieRange, true);range.setStart(bi.container, bi.offset);if (ieRange.compareEndPoints(\"StartToEnd\", ieRange) != 0) {\n          bi = getBoundaryInformation(ieRange, false);range.setEnd(bi.container, bi.offset);\n        }\n      }return range;\n    }function _getIERange(sel) {\n      var ieRange;try {\n        ieRange = sel.getNative().createRange();\n      } catch (e) {\n        return null;\n      }var el = ieRange.item ? ieRange.item(0) : ieRange.parentElement();if ((el.ownerDocument || el) === sel.document) {\n        return ieRange;\n      }return null;\n    }var Selection = dom.Selection = function (doc) {\n      var me = this,\n          iframe;me.document = doc;if (browser.ie9below) {\n        iframe = domUtils.getWindow(doc).frameElement;domUtils.on(iframe, \"beforedeactivate\", function () {\n          me._bakIERange = me.getIERange();\n        });domUtils.on(iframe, \"activate\", function () {\n          try {\n            if (!_getIERange(me) && me._bakIERange) {\n              me._bakIERange.select();\n            }\n          } catch (ex) {}me._bakIERange = null;\n        });\n      }iframe = doc = null;\n    };Selection.prototype = { rangeInBody: function rangeInBody(rng, txtRange) {\n        var node = browser.ie9below || txtRange ? rng.item ? rng.item() : rng.parentElement() : rng.startContainer;return node === this.document.body || domUtils.inDoc(node, this.document);\n      }, getNative: function getNative() {\n        var doc = this.document;try {\n          return !doc ? null : browser.ie9below ? doc.selection : domUtils.getWindow(doc).getSelection();\n        } catch (e) {\n          return null;\n        }\n      }, getIERange: function getIERange() {\n        var ieRange = _getIERange(this);if (!ieRange) {\n          if (this._bakIERange) {\n            return this._bakIERange;\n          }\n        }return ieRange;\n      }, cache: function cache() {\n        this.clear();this._cachedRange = this.getRange();this._cachedStartElement = this.getStart();this._cachedStartElementPath = this.getStartElementPath();\n      }, getStartElementPath: function getStartElementPath() {\n        if (this._cachedStartElementPath) {\n          return this._cachedStartElementPath;\n        }var start = this.getStart();if (start) {\n          return domUtils.findParents(start, true, null, true);\n        }return [];\n      }, clear: function clear() {\n        this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null;\n      }, isFocus: function isFocus() {\n        try {\n          if (browser.ie9below) {\n            var nativeRange = _getIERange(this);return !!(nativeRange && this.rangeInBody(nativeRange));\n          } else {\n            return !!this.getNative().rangeCount;\n          }\n        } catch (e) {\n          return false;\n        }\n      }, getRange: function getRange() {\n        var me = this;function optimze(range) {\n          var child = me.document.body.firstChild,\n              collapsed = range.collapsed;while (child && child.firstChild) {\n            range.setStart(child, 0);child = child.firstChild;\n          }if (!range.startContainer) {\n            range.setStart(me.document.body, 0);\n          }if (collapsed) {\n            range.collapse(true);\n          }\n        }if (me._cachedRange != null) {\n          return this._cachedRange;\n        }var range = new baidu.editor.dom.Range(me.document);if (browser.ie9below) {\n          var nativeRange = me.getIERange();if (nativeRange) {\n            try {\n              transformIERangeToRange(nativeRange, range);\n            } catch (e) {\n              optimze(range);\n            }\n          } else {\n            optimze(range);\n          }\n        } else {\n          var sel = me.getNative();if (sel && sel.rangeCount) {\n            var firstRange = sel.getRangeAt(0);var lastRange = sel.getRangeAt(sel.rangeCount - 1);range.setStart(firstRange.startContainer, firstRange.startOffset).setEnd(lastRange.endContainer, lastRange.endOffset);if (range.collapsed && domUtils.isBody(range.startContainer) && !range.startOffset) {\n              optimze(range);\n            }\n          } else {\n            if (this._bakRange && domUtils.inDoc(this._bakRange.startContainer, this.document)) {\n              return this._bakRange;\n            }optimze(range);\n          }\n        }return this._bakRange = range;\n      }, getStart: function getStart() {\n        if (this._cachedStartElement) {\n          return this._cachedStartElement;\n        }var range = browser.ie9below ? this.getIERange() : this.getRange(),\n            tmpRange,\n            start,\n            tmp,\n            parent;if (browser.ie9below) {\n          if (!range) {\n            return this.document.body.firstChild;\n          }if (range.item) {\n            return range.item(0);\n          }tmpRange = range.duplicate();tmpRange.text.length > 0 && tmpRange.moveStart(\"character\", 1);tmpRange.collapse(1);start = tmpRange.parentElement();parent = tmp = range.parentElement();while (tmp = tmp.parentNode) {\n            if (tmp == start) {\n              start = parent;break;\n            }\n          }\n        } else {\n          range.shrinkBoundary();start = range.startContainer;if (start.nodeType == 1 && start.hasChildNodes()) {\n            start = start.childNodes[Math.min(start.childNodes.length - 1, range.startOffset)];\n          }if (start.nodeType == 3) {\n            return start.parentNode;\n          }\n        }return start;\n      }, getText: function getText() {\n        var nativeSel, nativeRange;if (this.isFocus() && (nativeSel = this.getNative())) {\n          nativeRange = browser.ie9below ? nativeSel.createRange() : nativeSel.getRangeAt(0);return browser.ie9below ? nativeRange.text : nativeRange.toString();\n        }return \"\";\n      }, clearRange: function clearRange() {\n        this.getNative()[browser.ie9below ? \"empty\" : \"removeAllRanges\"]();\n      } };\n  }();!function () {\n    var uid = 0,\n        _selectionChangeTimer;function setValue(form, editor) {\n      var textarea;if (editor.textarea) {\n        if (utils.isString(editor.textarea)) {\n          for (var i = 0, ti, tis = domUtils.getElementsByTagName(form, \"textarea\"); ti = tis[i++];) {\n            if (ti.id == \"ueditor_textarea_\" + editor.options.textarea) {\n              textarea = ti;break;\n            }\n          }\n        } else {\n          textarea = editor.textarea;\n        }\n      }if (!textarea) {\n        form.appendChild(textarea = domUtils.createElement(document, \"textarea\", { name: editor.options.textarea, id: \"ueditor_textarea_\" + editor.options.textarea, style: \"display:none\" }));editor.textarea = textarea;\n      }!textarea.getAttribute(\"name\") && textarea.setAttribute(\"name\", editor.options.textarea);textarea.value = editor.hasContents() ? editor.options.allHtmlEnabled ? editor.getAllHtml() : editor.getContent(null, null, true) : \"\";\n    }function loadPlugins(me) {\n      for (var pi in UE.plugins) {\n        UE.plugins[pi].call(me);\n      }\n    }function checkCurLang(I18N) {\n      for (var lang in I18N) {\n        return lang;\n      }\n    }function langReadied(me) {\n      me.langIsReady = true;me.fireEvent(\"langReady\");\n    }var Editor = UE.Editor = function (options) {\n      var me = this;me.uid = uid++;EventBase.call(me);me.commands = {};me.options = utils.extend(utils.clone(options || {}), UEDITOR_CONFIG, true);me.shortcutkeys = {};me.inputRules = [];me.outputRules = [];me.setOpt(Editor.defaultOptions(me));me.loadServerConfig();if (!utils.isEmptyObject(UE.I18N)) {\n        me.options.lang = checkCurLang(UE.I18N);UE.plugin.load(me);langReadied(me);\n      } else {\n        utils.loadFile(document, { src: me.options.langPath + me.options.lang + \"/\" + me.options.lang + \".js\", tag: \"script\", type: \"text/javascript\", defer: \"defer\" }, function () {\n          UE.plugin.load(me);langReadied(me);\n        });\n      }UE.instants[\"ueditorInstant\" + me.uid] = me;\n    };Editor.prototype = { registerCommand: function registerCommand(name, obj) {\n        this.commands[name] = obj;\n      }, ready: function ready(fn) {\n        var me = this;if (fn) {\n          me.isReady ? fn.apply(me) : me.addListener(\"ready\", fn);\n        }\n      }, setOpt: function setOpt(key, val) {\n        var obj = {};if (utils.isString(key)) {\n          obj[key] = val;\n        } else {\n          obj = key;\n        }utils.extend(this.options, obj, true);\n      }, getOpt: function getOpt(key) {\n        return this.options[key];\n      }, destroy: function destroy() {\n        var me = this;me.fireEvent(\"destroy\");var container = me.container.parentNode;var textarea = me.textarea;if (!textarea) {\n          textarea = document.createElement(\"textarea\");container.parentNode.insertBefore(textarea, container);\n        } else {\n          textarea.style.display = \"\";\n        }textarea.style.width = me.iframe.offsetWidth + \"px\";textarea.style.height = me.iframe.offsetHeight + \"px\";textarea.value = me.getContent();textarea.id = me.key;container.innerHTML = \"\";domUtils.remove(container);var key = me.key;for (var p in me) {\n          if (me.hasOwnProperty(p)) {\n            delete this[p];\n          }\n        }UE.delEditor(key);\n      }, render: function render(container) {\n        var me = this,\n            options = me.options,\n            getStyleValue = function getStyleValue(attr) {\n          return parseInt(domUtils.getComputedStyle(container, attr));\n        };if (utils.isString(container)) {\n          container = document.getElementById(container);\n        }if (container) {\n          if (options.initialFrameWidth) {\n            options.minFrameWidth = options.initialFrameWidth;\n          } else {\n            options.minFrameWidth = options.initialFrameWidth = container.offsetWidth;\n          }if (options.initialFrameHeight) {\n            options.minFrameHeight = options.initialFrameHeight;\n          } else {\n            options.initialFrameHeight = options.minFrameHeight = container.offsetHeight;\n          }container.style.width = /%$/.test(options.initialFrameWidth) ? \"100%\" : options.initialFrameWidth - getStyleValue(\"padding-left\") - getStyleValue(\"padding-right\") + \"px\";container.style.height = /%$/.test(options.initialFrameHeight) ? \"100%\" : options.initialFrameHeight - getStyleValue(\"padding-top\") - getStyleValue(\"padding-bottom\") + \"px\";container.style.zIndex = options.zIndex;var html = (ie && browser.version < 9 ? \"\" : \"<!DOCTYPE html>\") + \"<html xmlns='http://www.w3.org/1999/xhtml' class='view' ><head>\" + \"<style type='text/css'>\" + \".view{padding:0;word-wrap:break-word;cursor:text;height:90%;}\\n\" + \"body{margin:8px;font-family:sans-serif;font-size:16px;}\" + \"p{margin:5px 0;}</style>\" + (options.iframeCssUrl ? \"<link rel='stylesheet' type='text/css' href='\" + utils.unhtml(options.iframeCssUrl) + \"'/>\" : \"\") + (options.initialStyle ? \"<style>\" + options.initialStyle + \"</style>\" : \"\") + \"</head><body class='view' ></body>\" + \"<script type='text/javascript' \" + (ie ? \"defer='defer'\" : \"\") + \" id='_initialScript'>\" + \"setTimeout(function(){editor = window.parent.UE.instants['ueditorInstant\" + me.uid + \"'];editor._setup(document);},0);\" + \"var _tmpScript = document.getElementById('_initialScript');_tmpScript.parentNode.removeChild(_tmpScript);</script></html>\";container.appendChild(domUtils.createElement(document, \"iframe\", { id: \"ueditor_\" + me.uid, width: \"100%\", height: \"100%\", frameborder: \"0\", src: \"javascript:void(function(){document.open();\" + (options.customDomain && document.domain != location.hostname ? 'document.domain=\"' + document.domain + '\";' : \"\") + 'document.write(\"' + html + '\");document.close();}())' }));container.style.overflow = \"hidden\";setTimeout(function () {\n            if (/%$/.test(options.initialFrameWidth)) {\n              options.minFrameWidth = options.initialFrameWidth = container.offsetWidth;\n            }if (/%$/.test(options.initialFrameHeight)) {\n              options.minFrameHeight = options.initialFrameHeight = container.offsetHeight;container.style.height = options.initialFrameHeight + \"px\";\n            }\n          });\n        }\n      }, _setup: function _setup(doc) {\n        var me = this,\n            options = me.options;if (ie) {\n          doc.body.disabled = true;doc.body.contentEditable = true;doc.body.disabled = false;\n        } else {\n          doc.body.contentEditable = true;\n        }doc.body.spellcheck = false;me.document = doc;me.window = doc.defaultView || doc.parentWindow;me.iframe = me.window.frameElement;me.body = doc.body;me.selection = new dom.Selection(doc);var geckoSel;if (browser.gecko && (geckoSel = this.selection.getNative())) {\n          geckoSel.removeAllRanges();\n        }this._initEvents();for (var form = this.iframe.parentNode; !domUtils.isBody(form); form = form.parentNode) {\n          if (form.tagName == \"FORM\") {\n            me.form = form;if (me.options.autoSyncData) {\n              domUtils.on(me.window, \"blur\", function () {\n                setValue(form, me);\n              });\n            } else {\n              domUtils.on(form, \"submit\", function () {\n                setValue(this, me);\n              });\n            }break;\n          }\n        }if (options.initialContent) {\n          if (options.autoClearinitialContent) {\n            var oldExecCommand = me.execCommand;me.execCommand = function () {\n              me.fireEvent(\"firstBeforeExecCommand\");return oldExecCommand.apply(me, arguments);\n            };this._setDefaultContent(options.initialContent);\n          } else this.setContent(options.initialContent, false, true);\n        }if (domUtils.isEmptyNode(me.body)) {\n          me.body.innerHTML = \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";\n        }if (options.focus) {\n          setTimeout(function () {\n            me.focus(me.options.focusInEnd);!me.options.autoClearinitialContent && me._selectionChange();\n          }, 0);\n        }if (!me.container) {\n          me.container = this.iframe.parentNode;\n        }if (options.fullscreen && me.ui) {\n          me.ui.setFullScreen(true);\n        }try {\n          me.document.execCommand(\"2D-position\", false, false);\n        } catch (e) {}try {\n          me.document.execCommand(\"enableInlineTableEditing\", false, false);\n        } catch (e) {}try {\n          me.document.execCommand(\"enableObjectResizing\", false, false);\n        } catch (e) {}me._bindshortcutKeys();me.isReady = 1;me.fireEvent(\"ready\");options.onready && options.onready.call(me);if (!browser.ie9below) {\n          domUtils.on(me.window, [\"blur\", \"focus\"], function (e) {\n            if (e.type == \"blur\") {\n              me._bakRange = me.selection.getRange();try {\n                me._bakNativeRange = me.selection.getNative().getRangeAt(0);me.selection.getNative().removeAllRanges();\n              } catch (e) {\n                me._bakNativeRange = null;\n              }\n            } else {\n              try {\n                me._bakRange && me._bakRange.select();\n              } catch (e) {}\n            }\n          });\n        }if (browser.gecko && browser.version <= 10902) {\n          me.body.contentEditable = false;setTimeout(function () {\n            me.body.contentEditable = true;\n          }, 100);setInterval(function () {\n            me.body.style.height = me.iframe.offsetHeight - 20 + \"px\";\n          }, 100);\n        }!options.isShow && me.setHide();options.readonly && me.setDisabled();\n      }, sync: function sync(formId) {\n        var me = this,\n            form = formId ? document.getElementById(formId) : domUtils.findParent(me.iframe.parentNode, function (node) {\n          return node.tagName == \"FORM\";\n        }, true);form && setValue(form, me);\n      }, setHeight: function setHeight(height, notSetHeight) {\n        if (height !== parseInt(this.iframe.parentNode.style.height)) {\n          this.iframe.parentNode.style.height = height + \"px\";\n        }!notSetHeight && (this.options.minFrameHeight = this.options.initialFrameHeight = height);this.body.style.height = height + \"px\";!notSetHeight && this.trigger(\"setHeight\");\n      }, addshortcutkey: function addshortcutkey(cmd, keys) {\n        var obj = {};if (keys) {\n          obj[cmd] = keys;\n        } else {\n          obj = cmd;\n        }utils.extend(this.shortcutkeys, obj);\n      }, _bindshortcutKeys: function _bindshortcutKeys() {\n        var me = this,\n            shortcutkeys = this.shortcutkeys;me.addListener(\"keydown\", function (type, e) {\n          var keyCode = e.keyCode || e.which;for (var i in shortcutkeys) {\n            var tmp = shortcutkeys[i].split(\",\");for (var t = 0, ti; ti = tmp[t++];) {\n              ti = ti.split(\":\");var key = ti[0],\n                  param = ti[1];if (/^(ctrl)(\\+shift)?\\+(\\d+)$/.test(key.toLowerCase()) || /^(\\d+)$/.test(key)) {\n                if ((RegExp.$1 == \"ctrl\" ? e.ctrlKey || e.metaKey : 0) && (RegExp.$2 != \"\" ? e[RegExp.$2.slice(1) + \"Key\"] : 1) && keyCode == RegExp.$3 || keyCode == RegExp.$1) {\n                  if (me.queryCommandState(i, param) != -1) me.execCommand(i, param);domUtils.preventDefault(e);\n                }\n              }\n            }\n          }\n        });\n      }, getContent: function getContent(cmd, fn, notSetCursor, ignoreBlank, formatter) {\n        var me = this;if (cmd && utils.isFunction(cmd)) {\n          fn = cmd;cmd = \"\";\n        }if (fn ? !fn() : !this.hasContents()) {\n          return \"\";\n        }me.fireEvent(\"beforegetcontent\");var root = UE.htmlparser(me.body.innerHTML, ignoreBlank);me.filterOutputRule(root);me.fireEvent(\"aftergetcontent\", cmd, root);return root.toHtml(formatter);\n      }, getAllHtml: function getAllHtml() {\n        var me = this,\n            headHtml = [],\n            html = \"\";me.fireEvent(\"getAllHtml\", headHtml);if (browser.ie && browser.version > 8) {\n          var headHtmlForIE9 = \"\";utils.each(me.document.styleSheets, function (si) {\n            headHtmlForIE9 += si.href ? '<link rel=\"stylesheet\" type=\"text/css\" href=\"' + si.href + '\" />' : \"<style>\" + si.cssText + \"</style>\";\n          });utils.each(me.document.getElementsByTagName(\"script\"), function (si) {\n            headHtmlForIE9 += si.outerHTML;\n          });\n        }return \"<html><head>\" + (me.options.charset ? '<meta http-equiv=\"Content-Type\" content=\"text/html; charset=' + me.options.charset + '\"/>' : \"\") + (headHtmlForIE9 || me.document.getElementsByTagName(\"head\")[0].innerHTML) + headHtml.join(\"\\n\") + \"</head>\" + \"<body \" + (ie && browser.version < 9 ? 'class=\"view\"' : \"\") + \">\" + me.getContent(null, null, true) + \"</body></html>\";\n      }, getPlainTxt: function getPlainTxt() {\n        var reg = new RegExp(domUtils.fillChar, \"g\"),\n            html = this.body.innerHTML.replace(/[\\n\\r]/g, \"\");html = html.replace(/<(p|div)[^>]*>(<br\\/?>|&nbsp;)<\\/\\1>/gi, \"\\n\").replace(/<br\\/?>/gi, \"\\n\").replace(/<[^>/]+>/g, \"\").replace(/(\\n)?<\\/([^>]+)>/g, function (a, b, c) {\n          return dtd.$block[c] ? \"\\n\" : b ? b : \"\";\n        });return html.replace(reg, \"\").replace(/\\u00a0/g, \" \").replace(/&nbsp;/g, \" \");\n      }, getContentTxt: function getContentTxt() {\n        var reg = new RegExp(domUtils.fillChar, \"g\");return this.body[browser.ie ? \"innerText\" : \"textContent\"].replace(reg, \"\").replace(/\\u00a0/g, \" \");\n      }, setContent: function setContent(html, isAppendTo, notFireSelectionchange) {\n        var me = this;me.fireEvent(\"beforesetcontent\", html);var root = UE.htmlparser(html);me.filterInputRule(root);html = root.toHtml();me.body.innerHTML = (isAppendTo ? me.body.innerHTML : \"\") + html;function isCdataDiv(node) {\n          return node.tagName == \"DIV\" && node.getAttribute(\"cdata_tag\");\n        }if (me.options.enterTag == \"p\") {\n          var child = this.body.firstChild,\n              tmpNode;if (!child || child.nodeType == 1 && (dtd.$cdata[child.tagName] || isCdataDiv(child) || domUtils.isCustomeNode(child)) && child === this.body.lastChild) {\n            this.body.innerHTML = \"<p>\" + (browser.ie ? \"&nbsp;\" : \"<br/>\") + \"</p>\" + this.body.innerHTML;\n          } else {\n            var p = me.document.createElement(\"p\");while (child) {\n              while (child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName])) {\n                tmpNode = child.nextSibling;p.appendChild(child);child = tmpNode;\n              }if (p.firstChild) {\n                if (!child) {\n                  me.body.appendChild(p);break;\n                } else {\n                  child.parentNode.insertBefore(p, child);p = me.document.createElement(\"p\");\n                }\n              }child = child.nextSibling;\n            }\n          }\n        }me.fireEvent(\"aftersetcontent\");me.fireEvent(\"contentchange\");!notFireSelectionchange && me._selectionChange();me._bakRange = me._bakIERange = me._bakNativeRange = null;var geckoSel;if (browser.gecko && (geckoSel = this.selection.getNative())) {\n          geckoSel.removeAllRanges();\n        }if (me.options.autoSyncData) {\n          me.form && setValue(me.form, me);\n        }\n      }, focus: function focus(toEnd) {\n        try {\n          var me = this,\n              rng = me.selection.getRange();if (toEnd) {\n            var node = me.body.lastChild;if (node && node.nodeType == 1 && !dtd.$empty[node.tagName]) {\n              if (domUtils.isEmptyBlock(node)) {\n                rng.setStartAtFirst(node);\n              } else {\n                rng.setStartAtLast(node);\n              }rng.collapse(true);\n            }rng.setCursor(true);\n          } else {\n            if (!rng.collapsed && domUtils.isBody(rng.startContainer) && rng.startOffset == 0) {\n              var node = me.body.firstChild;if (node && node.nodeType == 1 && !dtd.$empty[node.tagName]) {\n                rng.setStartAtFirst(node).collapse(true);\n              }\n            }rng.select(true);\n          }this.fireEvent(\"focus selectionchange\");\n        } catch (e) {}\n      }, isFocus: function isFocus() {\n        return this.selection.isFocus();\n      }, blur: function blur() {\n        var sel = this.selection.getNative();if (sel.empty && browser.ie) {\n          var nativeRng = document.body.createTextRange();nativeRng.moveToElementText(document.body);nativeRng.collapse(true);nativeRng.select();sel.empty();\n        } else {\n          sel.removeAllRanges();\n        }\n      }, _initEvents: function _initEvents() {\n        var me = this,\n            doc = me.document,\n            win = me.window;me._proxyDomEvent = utils.bind(me._proxyDomEvent, me);domUtils.on(doc, [\"click\", \"contextmenu\", \"mousedown\", \"keydown\", \"keyup\", \"keypress\", \"mouseup\", \"mouseover\", \"mouseout\", \"selectstart\"], me._proxyDomEvent);domUtils.on(win, [\"focus\", \"blur\"], me._proxyDomEvent);domUtils.on(me.body, \"drop\", function (e) {\n          if (browser.gecko && e.stopPropagation) {\n            e.stopPropagation();\n          }me.fireEvent(\"contentchange\");\n        });domUtils.on(doc, [\"mouseup\", \"keydown\"], function (evt) {\n          if (evt.type == \"keydown\" && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {\n            return;\n          }if (evt.button == 2) return;me._selectionChange(250, evt);\n        });\n      }, _proxyDomEvent: function _proxyDomEvent(evt) {\n        if (this.fireEvent(\"before\" + evt.type.replace(/^on/, \"\").toLowerCase()) === false) {\n          return false;\n        }if (this.fireEvent(evt.type.replace(/^on/, \"\"), evt) === false) {\n          return false;\n        }return this.fireEvent(\"after\" + evt.type.replace(/^on/, \"\").toLowerCase());\n      }, _selectionChange: function _selectionChange(delay, evt) {\n        var me = this;var hackForMouseUp = false;var mouseX, mouseY;if (browser.ie && browser.version < 9 && evt && evt.type == \"mouseup\") {\n          var range = this.selection.getRange();if (!range.collapsed) {\n            hackForMouseUp = true;mouseX = evt.clientX;mouseY = evt.clientY;\n          }\n        }clearTimeout(_selectionChangeTimer);_selectionChangeTimer = setTimeout(function () {\n          if (!me.selection || !me.selection.getNative()) {\n            return;\n          }var ieRange;if (hackForMouseUp && me.selection.getNative().type == \"None\") {\n            ieRange = me.document.body.createTextRange();try {\n              ieRange.moveToPoint(mouseX, mouseY);\n            } catch (ex) {\n              ieRange = null;\n            }\n          }var bakGetIERange;if (ieRange) {\n            bakGetIERange = me.selection.getIERange;me.selection.getIERange = function () {\n              return ieRange;\n            };\n          }me.selection.cache();if (bakGetIERange) {\n            me.selection.getIERange = bakGetIERange;\n          }if (me.selection._cachedRange && me.selection._cachedStartElement) {\n            me.fireEvent(\"beforeselectionchange\");me.fireEvent(\"selectionchange\", !!evt);me.fireEvent(\"afterselectionchange\");me.selection.clear();\n          }\n        }, delay || 50);\n      }, _callCmdFn: function _callCmdFn(fnName, args) {\n        var cmdName = args[0].toLowerCase(),\n            cmd,\n            cmdFn;cmd = this.commands[cmdName] || UE.commands[cmdName];cmdFn = cmd && cmd[fnName];if ((!cmd || !cmdFn) && fnName == \"queryCommandState\") {\n          return 0;\n        } else if (cmdFn) {\n          return cmdFn.apply(this, args);\n        }\n      }, execCommand: function execCommand(cmdName) {\n        cmdName = cmdName.toLowerCase();var me = this,\n            result,\n            cmd = me.commands[cmdName] || UE.commands[cmdName];if (!cmd || !cmd.execCommand) {\n          return null;\n        }if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {\n          me.__hasEnterExecCommand = true;if (me.queryCommandState.apply(me, arguments) != -1) {\n            me.fireEvent(\"saveScene\");me.fireEvent.apply(me, [\"beforeexeccommand\", cmdName].concat(arguments));result = this._callCmdFn(\"execCommand\", arguments);me.fireEvent.apply(me, [\"afterexeccommand\", cmdName].concat(arguments));me.fireEvent(\"saveScene\");\n          }me.__hasEnterExecCommand = false;\n        } else {\n          result = this._callCmdFn(\"execCommand\", arguments);!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange && me.fireEvent(\"contentchange\");\n        }!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange && me._selectionChange();return result;\n      }, queryCommandState: function queryCommandState(cmdName) {\n        return this._callCmdFn(\"queryCommandState\", arguments);\n      }, queryCommandValue: function queryCommandValue(cmdName) {\n        return this._callCmdFn(\"queryCommandValue\", arguments);\n      }, hasContents: function hasContents(tags) {\n        if (tags) {\n          for (var i = 0, ci; ci = tags[i++];) {\n            if (this.document.getElementsByTagName(ci).length > 0) {\n              return true;\n            }\n          }\n        }if (!domUtils.isEmptyBlock(this.body)) {\n          return true;\n        }tags = [\"div\"];for (i = 0; ci = tags[i++];) {\n          var nodes = domUtils.getElementsByTagName(this.document, ci);for (var n = 0, cn; cn = nodes[n++];) {\n            if (domUtils.isCustomeNode(cn)) {\n              return true;\n            }\n          }\n        }return false;\n      }, reset: function reset() {\n        this.fireEvent(\"reset\");\n      }, setEnabled: function setEnabled() {\n        var me = this,\n            range;if (me.body.contentEditable == \"false\") {\n          me.body.contentEditable = true;range = me.selection.getRange();try {\n            range.moveToBookmark(me.lastBk);delete me.lastBk;\n          } catch (e) {\n            range.setStartAtFirst(me.body).collapse(true);\n          }range.select(true);if (me.bkqueryCommandState) {\n            me.queryCommandState = me.bkqueryCommandState;delete me.bkqueryCommandState;\n          }if (me.bkqueryCommandValue) {\n            me.queryCommandValue = me.bkqueryCommandValue;delete me.bkqueryCommandValue;\n          }me.fireEvent(\"selectionchange\");\n        }\n      }, enable: function enable() {\n        return this.setEnabled();\n      }, setDisabled: function setDisabled(except) {\n        var me = this;except = except ? utils.isArray(except) ? except : [except] : [];if (me.body.contentEditable == \"true\") {\n          if (!me.lastBk) {\n            me.lastBk = me.selection.getRange().createBookmark(true);\n          }me.body.contentEditable = false;me.bkqueryCommandState = me.queryCommandState;me.bkqueryCommandValue = me.queryCommandValue;me.queryCommandState = function (type) {\n            if (utils.indexOf(except, type) != -1) {\n              return me.bkqueryCommandState.apply(me, arguments);\n            }return -1;\n          };me.queryCommandValue = function (type) {\n            if (utils.indexOf(except, type) != -1) {\n              return me.bkqueryCommandValue.apply(me, arguments);\n            }return null;\n          };me.fireEvent(\"selectionchange\");\n        }\n      }, disable: function disable(except) {\n        return this.setDisabled(except);\n      }, _setDefaultContent: function () {\n        function clear() {\n          var me = this;if (me.document.getElementById(\"initContent\")) {\n            me.body.innerHTML = \"<p>\" + (ie ? \"\" : \"<br/>\") + \"</p>\";me.removeListener(\"firstBeforeExecCommand focus\", clear);setTimeout(function () {\n              me.focus();me._selectionChange();\n            }, 0);\n          }\n        }return function (cont) {\n          var me = this;me.body.innerHTML = '<p id=\"initContent\">' + cont + \"</p>\";me.addListener(\"firstBeforeExecCommand focus\", clear);\n        };\n      }(), setShow: function setShow() {\n        var me = this,\n            range = me.selection.getRange();if (me.container.style.display == \"none\") {\n          try {\n            range.moveToBookmark(me.lastBk);delete me.lastBk;\n          } catch (e) {\n            range.setStartAtFirst(me.body).collapse(true);\n          }setTimeout(function () {\n            range.select(true);\n          }, 100);me.container.style.display = \"\";\n        }\n      }, show: function show() {\n        return this.setShow();\n      }, setHide: function setHide() {\n        var me = this;if (!me.lastBk) {\n          me.lastBk = me.selection.getRange().createBookmark(true);\n        }me.container.style.display = \"none\";\n      }, hide: function hide() {\n        return this.setHide();\n      }, getLang: function getLang(path) {\n        var lang = UE.I18N[this.options.lang];if (!lang) {\n          throw Error(\"not import language file\");\n        }path = (path || \"\").split(\".\");for (var i = 0, ci; ci = path[i++];) {\n          lang = lang[ci];if (!lang) break;\n        }return lang;\n      }, getContentLength: function getContentLength(ingoneHtml, tagNames) {\n        var count = this.getContent(false, false, true).length;if (ingoneHtml) {\n          tagNames = (tagNames || []).concat([\"hr\", \"img\", \"iframe\"]);count = this.getContentTxt().replace(/[\\t\\r\\n]+/g, \"\").length;for (var i = 0, ci; ci = tagNames[i++];) {\n            count += this.document.getElementsByTagName(ci).length;\n          }\n        }return count;\n      }, addInputRule: function addInputRule(rule) {\n        this.inputRules.push(rule);\n      }, filterInputRule: function filterInputRule(root) {\n        for (var i = 0, ci; ci = this.inputRules[i++];) {\n          ci.call(this, root);\n        }\n      }, addOutputRule: function addOutputRule(rule) {\n        this.outputRules.push(rule);\n      }, filterOutputRule: function filterOutputRule(root) {\n        for (var i = 0, ci; ci = this.outputRules[i++];) {\n          ci.call(this, root);\n        }\n      }, getActionUrl: function getActionUrl(action) {\n        var actionName = this.getOpt(action) || action,\n            imageUrl = this.getOpt(\"imageUrl\"),\n            serverUrl = this.getOpt(\"serverUrl\");if (!serverUrl && imageUrl) {\n          serverUrl = imageUrl.replace(/^(.*[\\/]).+([\\.].+)$/, \"$1controller$2\");\n        }if (serverUrl) {\n          serverUrl = serverUrl + (serverUrl.indexOf(\"?\") == -1 ? \"?\" : \"&\") + \"action=\" + (actionName || \"\");return utils.formatUrl(serverUrl);\n        } else {\n          return \"\";\n        }\n      } };utils.inherits(Editor, EventBase);\n  }();UE.Editor.defaultOptions = function (editor) {\n    var _url = editor.options.UEDITOR_HOME_URL;return { isShow: true, initialContent: \"\", initialStyle: \"\", autoClearinitialContent: false, iframeCssUrl: _url + \"themes/iframe.css\", textarea: \"editorValue\", focus: false, focusInEnd: true, autoClearEmptyNode: true, fullscreen: false, readonly: false, zIndex: 999, imagePopup: true, enterTag: \"p\", customDomain: false, lang: \"zh-cn\", langPath: _url + \"lang/\", theme: \"default\", themePath: _url + \"themes/\", allHtmlEnabled: false, scaleEnabled: false, tableNativeEditInFF: false, autoSyncData: true, fileNameFormat: \"{time}{rand:6}\" };\n  };!function () {\n    UE.Editor.prototype.loadServerConfig = function () {\n      var me = this;setTimeout(function () {\n        try {\n          me.options.imageUrl && me.setOpt(\"serverUrl\", me.options.imageUrl.replace(/^(.*[\\/]).+([\\.].+)$/, \"$1controller$2\"));var configUrl = me.getActionUrl(\"config\"),\n              isJsonp = utils.isCrossDomainUrl(configUrl);me._serverConfigLoaded = false;configUrl && UE.ajax.request(configUrl, { method: \"GET\", dataType: isJsonp ? \"jsonp\" : \"\", onsuccess: function onsuccess(r) {\n              try {\n                var config = isJsonp ? r : eval(\"(\" + r.responseText + \")\");utils.extend(me.options, config);me.fireEvent(\"serverConfigLoaded\");me._serverConfigLoaded = true;\n              } catch (e) {\n                showErrorMsg(me.getLang(\"loadconfigFormatError\"));\n              }\n            }, onerror: function onerror() {\n              showErrorMsg(me.getLang(\"loadconfigHttpError\"));\n            } });\n        } catch (e) {\n          showErrorMsg(me.getLang(\"loadconfigError\"));\n        }\n      });function showErrorMsg(msg) {\n        console && console.error(msg);\n      }\n    };UE.Editor.prototype.isServerConfigLoaded = function () {\n      var me = this;return me._serverConfigLoaded || false;\n    };UE.Editor.prototype.afterConfigReady = function (handler) {\n      if (!handler || !utils.isFunction(handler)) return;var me = this;var readyHandler = function readyHandler() {\n        handler.apply(me, arguments);me.removeListener(\"serverConfigLoaded\", readyHandler);\n      };if (me.isServerConfigLoaded()) {\n        handler.call(me, \"serverConfigLoaded\");\n      } else {\n        me.addListener(\"serverConfigLoaded\", readyHandler);\n      }\n    };\n  }();UE.ajax = function () {\n    var fnStr = \"XMLHttpRequest()\";try {\n      new ActiveXObject(\"Msxml2.XMLHTTP\");fnStr = \"ActiveXObject('Msxml2.XMLHTTP')\";\n    } catch (e) {\n      try {\n        new ActiveXObject(\"Microsoft.XMLHTTP\");fnStr = \"ActiveXObject('Microsoft.XMLHTTP')\";\n      } catch (e) {}\n    }var creatAjaxRequest = new Function(\"return new \" + fnStr);function json2str(json) {\n      var strArr = [];for (var i in json) {\n        if (i == \"method\" || i == \"timeout\" || i == \"async\" || i == \"dataType\" || i == \"callback\") continue;if (json[i] == undefined || json[i] == null) continue;if (!(_typeof(json[i]).toLowerCase() == \"function\" || _typeof(json[i]).toLowerCase() == \"object\")) {\n          strArr.push(encodeURIComponent(i) + \"=\" + encodeURIComponent(json[i]));\n        } else if (utils.isArray(json[i])) {\n          for (var j = 0; j < json[i].length; j++) {\n            strArr.push(encodeURIComponent(i) + \"[]=\" + encodeURIComponent(json[i][j]));\n          }\n        }\n      }return strArr.join(\"&\");\n    }function doAjax(url, ajaxOptions) {\n      var xhr = creatAjaxRequest(),\n          timeIsOut = false,\n          defaultAjaxOptions = { method: \"POST\", timeout: 5e3, async: true, data: {}, onsuccess: function onsuccess() {}, onerror: function onerror() {} };if ((typeof url === \"undefined\" ? \"undefined\" : _typeof(url)) === \"object\") {\n        ajaxOptions = url;url = ajaxOptions.url;\n      }if (!xhr || !url) return;var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions, ajaxOptions) : defaultAjaxOptions;var submitStr = json2str(ajaxOpts);if (!utils.isEmptyObject(ajaxOpts.data)) {\n        submitStr += (submitStr ? \"&\" : \"\") + json2str(ajaxOpts.data);\n      }var timerID = setTimeout(function () {\n        if (xhr.readyState != 4) {\n          timeIsOut = true;xhr.abort();clearTimeout(timerID);\n        }\n      }, ajaxOpts.timeout);var method = ajaxOpts.method.toUpperCase();var str = url + (url.indexOf(\"?\") == -1 ? \"?\" : \"&\") + (method == \"POST\" ? \"\" : submitStr + \"&noCache=\" + +new Date());xhr.open(method, str, ajaxOpts.async);xhr.onreadystatechange = function () {\n        if (xhr.readyState == 4) {\n          if (!timeIsOut && xhr.status == 200) {\n            ajaxOpts.onsuccess(xhr);\n          } else {\n            ajaxOpts.onerror(xhr);\n          }\n        }\n      };if (method == \"POST\") {\n        xhr.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");xhr.send(submitStr);\n      } else {\n        xhr.send(null);\n      }\n    }function doJsonp(url, opts) {\n      var successhandler = opts.onsuccess || function () {},\n          scr = document.createElement(\"SCRIPT\"),\n          options = opts || {},\n          charset = options[\"charset\"],\n          callbackField = options[\"jsonp\"] || \"callback\",\n          callbackFnName,\n          timeOut = options[\"timeOut\"] || 0,\n          timer,\n          reg = new RegExp(\"(\\\\?|&)\" + callbackField + \"=([^&]*)\"),\n          matches;if (utils.isFunction(successhandler)) {\n        callbackFnName = \"bd__editor__\" + Math.floor(Math.random() * 2147483648).toString(36);window[callbackFnName] = getCallBack(0);\n      } else if (utils.isString(successhandler)) {\n        callbackFnName = successhandler;\n      } else {\n        if (matches = reg.exec(url)) {\n          callbackFnName = matches[2];\n        }\n      }url = url.replace(reg, \"$1\" + callbackField + \"=\" + callbackFnName);if (url.search(reg) < 0) {\n        url += (url.indexOf(\"?\") < 0 ? \"?\" : \"&\") + callbackField + \"=\" + callbackFnName;\n      }var queryStr = json2str(opts);if (!utils.isEmptyObject(opts.data)) {\n        queryStr += (queryStr ? \"&\" : \"\") + json2str(opts.data);\n      }if (queryStr) {\n        url = url.replace(/\\?/, \"?\" + queryStr + \"&\");\n      }scr.onerror = getCallBack(1);if (timeOut) {\n        timer = setTimeout(getCallBack(1), timeOut);\n      }createScriptTag(scr, url, charset);function createScriptTag(scr, url, charset) {\n        scr.setAttribute(\"type\", \"text/javascript\");scr.setAttribute(\"defer\", \"defer\");charset && scr.setAttribute(\"charset\", charset);scr.setAttribute(\"src\", url);document.getElementsByTagName(\"head\")[0].appendChild(scr);\n      }function getCallBack(onTimeOut) {\n        return function () {\n          try {\n            if (onTimeOut) {\n              options.onerror && options.onerror();\n            } else {\n              try {\n                clearTimeout(timer);successhandler.apply(window, arguments);\n              } catch (e) {}\n            }\n          } catch (exception) {\n            options.onerror && options.onerror.call(window, exception);\n          } finally {\n            options.oncomplete && options.oncomplete.apply(window, arguments);scr.parentNode && scr.parentNode.removeChild(scr);window[callbackFnName] = null;try {\n              delete window[callbackFnName];\n            } catch (e) {}\n          }\n        };\n      }\n    }return { request: function request(url, opts) {\n        if (opts && opts.dataType == \"jsonp\") {\n          doJsonp(url, opts);\n        } else {\n          doAjax(url, opts);\n        }\n      }, getJSONP: function getJSONP(url, data, fn) {\n        var opts = { data: data, oncomplete: fn };doJsonp(url, opts);\n      } };\n  }();var filterWord = UE.filterWord = function () {\n    function isWordDocument(str) {\n      return (/(class=\"?Mso|style=\"[^\"]*\\bmso\\-|w:WordDocument|<(v|o):|lang=)/gi.test(str)\n      );\n    }function transUnit(v) {\n      v = v.replace(/[\\d.]+\\w+/g, function (m) {\n        return utils.transUnitToPx(m);\n      });return v;\n    }function filterPasteWord(str) {\n      return str.replace(/[\\t\\r\\n]+/g, \" \").replace(/<!--[\\s\\S]*?-->/gi, \"\").replace(/<v:shape [^>]*>[\\s\\S]*?.<\\/v:shape>/gi, function (str) {\n        if (browser.opera) {\n          return \"\";\n        }try {\n          if (/Bitmap/i.test(str)) {\n            return \"\";\n          }var width = str.match(/width:([ \\d.]*p[tx])/i)[1],\n              height = str.match(/height:([ \\d.]*p[tx])/i)[1],\n              src = str.match(/src=\\s*\"([^\"]*)\"/i)[1];return '<img width=\"' + transUnit(width) + '\" height=\"' + transUnit(height) + '\" src=\"' + src + '\" />';\n        } catch (e) {\n          return \"\";\n        }\n      }).replace(/<\\/?div[^>]*>/g, \"\").replace(/v:\\w+=([\"']?)[^'\"]+\\1/g, \"\").replace(/<(!|script[^>]*>.*?<\\/script(?=[>\\s])|\\/?(\\?xml(:\\w+)?|xml|meta|link|style|\\w+:\\w+)(?=[\\s\\/>]))[^>]*>/gi, \"\").replace(/<p [^>]*class=\"?MsoHeading\"?[^>]*>(.*?)<\\/p>/gi, \"<p><strong>$1</strong></p>\").replace(/\\s+(class|lang|align)\\s*=\\s*(['\"]?)([\\w-]+)\\2/gi, function (str, name, marks, val) {\n        return name == \"class\" && val == \"MsoListParagraph\" ? str : \"\";\n      }).replace(/<(font|span)[^>]*>(\\s*)<\\/\\1>/gi, function (a, b, c) {\n        return c.replace(/[\\t\\r\\n ]+/g, \" \");\n      }).replace(/(<[a-z][^>]*)\\sstyle=([\"'])([^\\2]*?)\\2/gi, function (str, tag, tmp, style) {\n        var n = [],\n            s = style.replace(/^\\s+|\\s+$/, \"\").replace(/&#39;/g, \"'\").replace(/&quot;/gi, \"'\").replace(/[\\d.]+(cm|pt)/g, function (str) {\n          return utils.transUnitToPx(str);\n        }).split(/;\\s*/g);for (var i = 0, v; v = s[i]; i++) {\n          var name,\n              value,\n              parts = v.split(\":\");if (parts.length == 2) {\n            name = parts[0].toLowerCase();value = parts[1].toLowerCase();if (/^(background)\\w*/.test(name) && value.replace(/(initial|\\s)/g, \"\").length == 0 || /^(margin)\\w*/.test(name) && /^0\\w+$/.test(value)) {\n              continue;\n            }switch (name) {case \"mso-padding-alt\":case \"mso-padding-top-alt\":case \"mso-padding-right-alt\":case \"mso-padding-bottom-alt\":case \"mso-padding-left-alt\":case \"mso-margin-alt\":case \"mso-margin-top-alt\":case \"mso-margin-right-alt\":case \"mso-margin-bottom-alt\":case \"mso-margin-left-alt\":case \"mso-height\":case \"mso-width\":case \"mso-vertical-align-alt\":\n                if (!/<table/.test(tag)) n[i] = name.replace(/^mso-|-alt$/g, \"\") + \":\" + transUnit(value);continue;case \"horiz-align\":\n                n[i] = \"text-align:\" + value;continue;case \"vert-align\":\n                n[i] = \"vertical-align:\" + value;continue;case \"font-color\":case \"mso-foreground\":\n                n[i] = \"color:\" + value;continue;case \"mso-background\":case \"mso-highlight\":\n                n[i] = \"background:\" + value;continue;case \"mso-default-height\":\n                n[i] = \"min-height:\" + transUnit(value);continue;case \"mso-default-width\":\n                n[i] = \"min-width:\" + transUnit(value);continue;case \"mso-padding-between-alt\":\n                n[i] = \"border-collapse:separate;border-spacing:\" + transUnit(value);continue;case \"text-line-through\":\n                if (value == \"single\" || value == \"double\") {\n                  n[i] = \"text-decoration:line-through\";\n                }continue;case \"mso-zero-height\":\n                if (value == \"yes\") {\n                  n[i] = \"display:none\";\n                }continue;case \"margin\":\n                if (!/[1-9]/.test(value)) {\n                  continue;\n                }}if (/^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test(name) || /text\\-indent|padding|margin/.test(name) && /\\-[\\d.]+/.test(value)) {\n              continue;\n            }n[i] = name + \":\" + parts[1];\n          }\n        }return tag + (n.length ? ' style=\"' + n.join(\";\").replace(/;{2,}/g, \";\") + '\"' : \"\");\n      });\n    }return function (html) {\n      return isWordDocument(html) ? filterPasteWord(html) : html;\n    };\n  }();!function () {\n    var uNode = UE.uNode = function (obj) {\n      this.type = obj.type;this.data = obj.data;this.tagName = obj.tagName;this.parentNode = obj.parentNode;this.attrs = obj.attrs || {};this.children = obj.children;\n    };var notTransAttrs = { href: 1, src: 1, _src: 1, _href: 1, cdata_data: 1 };var notTransTagName = { style: 1, script: 1 };var indentChar = \"    \",\n        breakChar = \"\\n\";function insertLine(arr, current, begin) {\n      arr.push(breakChar);return current + (begin ? 1 : -1);\n    }function insertIndent(arr, current) {\n      for (var i = 0; i < current; i++) {\n        arr.push(indentChar);\n      }\n    }uNode.createElement = function (html) {\n      if (/[<>]/.test(html)) {\n        return UE.htmlparser(html).children[0];\n      } else {\n        return new uNode({ type: \"element\", children: [], tagName: html });\n      }\n    };uNode.createText = function (data, noTrans) {\n      return new UE.uNode({ type: \"text\", data: noTrans ? data : utils.unhtml(data || \"\") });\n    };function nodeToHtml(node, arr, formatter, current) {\n      switch (node.type) {case \"root\":\n          for (var i = 0, ci; ci = node.children[i++];) {\n            if (formatter && ci.type == \"element\" && !dtd.$inlineWithA[ci.tagName] && i > 1) {\n              insertLine(arr, current, true);insertIndent(arr, current);\n            }nodeToHtml(ci, arr, formatter, current);\n          }break;case \"text\":\n          isText(node, arr);break;case \"element\":\n          isElement(node, arr, formatter, current);break;case \"comment\":\n          isComment(node, arr, formatter);}return arr;\n    }function isText(node, arr) {\n      if (node.parentNode.tagName == \"pre\") {\n        arr.push(node.data);\n      } else {\n        arr.push(notTransTagName[node.parentNode.tagName] ? utils.html(node.data) : node.data.replace(/[ ]{2}/g, \" &nbsp;\"));\n      }\n    }function isElement(node, arr, formatter, current) {\n      var attrhtml = \"\";if (node.attrs) {\n        attrhtml = [];var attrs = node.attrs;for (var a in attrs) {\n          attrhtml.push(a + (attrs[a] !== undefined ? '=\"' + (notTransAttrs[a] ? utils.html(attrs[a]).replace(/[\"]/g, function (a) {\n            return \"&quot;\";\n          }) : utils.unhtml(attrs[a])) + '\"' : \"\"));\n        }attrhtml = attrhtml.join(\" \");\n      }arr.push(\"<\" + node.tagName + (attrhtml ? \" \" + attrhtml : \"\") + (dtd.$empty[node.tagName] ? \"/\" : \"\") + \">\");if (formatter && !dtd.$inlineWithA[node.tagName] && node.tagName != \"pre\") {\n        if (node.children && node.children.length) {\n          current = insertLine(arr, current, true);insertIndent(arr, current);\n        }\n      }if (node.children && node.children.length) {\n        for (var i = 0, ci; ci = node.children[i++];) {\n          if (formatter && ci.type == \"element\" && !dtd.$inlineWithA[ci.tagName] && i > 1) {\n            insertLine(arr, current);insertIndent(arr, current);\n          }nodeToHtml(ci, arr, formatter, current);\n        }\n      }if (!dtd.$empty[node.tagName]) {\n        if (formatter && !dtd.$inlineWithA[node.tagName] && node.tagName != \"pre\") {\n          if (node.children && node.children.length) {\n            current = insertLine(arr, current);insertIndent(arr, current);\n          }\n        }arr.push(\"</\" + node.tagName + \">\");\n      }\n    }function isComment(node, arr) {\n      arr.push(\"<!--\" + node.data + \"-->\");\n    }function _getNodeById(root, id) {\n      var node;if (root.type == \"element\" && root.getAttr(\"id\") == id) {\n        return root;\n      }if (root.children && root.children.length) {\n        for (var i = 0, ci; ci = root.children[i++];) {\n          if (node = _getNodeById(ci, id)) {\n            return node;\n          }\n        }\n      }\n    }function _getNodesByTagName(node, tagName, arr) {\n      if (node.type == \"element\" && node.tagName == tagName) {\n        arr.push(node);\n      }if (node.children && node.children.length) {\n        for (var i = 0, ci; ci = node.children[i++];) {\n          _getNodesByTagName(ci, tagName, arr);\n        }\n      }\n    }function nodeTraversal(root, fn) {\n      if (root.children && root.children.length) {\n        for (var i = 0, ci; ci = root.children[i];) {\n          nodeTraversal(ci, fn);if (ci.parentNode) {\n            if (ci.children && ci.children.length) {\n              fn(ci);\n            }if (ci.parentNode) i++;\n          }\n        }\n      } else {\n        fn(root);\n      }\n    }uNode.prototype = { toHtml: function toHtml(formatter) {\n        var arr = [];nodeToHtml(this, arr, formatter, 0);return arr.join(\"\");\n      }, innerHTML: function innerHTML(htmlstr) {\n        if (this.type != \"element\" || dtd.$empty[this.tagName]) {\n          return this;\n        }if (utils.isString(htmlstr)) {\n          if (this.children) {\n            for (var i = 0, ci; ci = this.children[i++];) {\n              ci.parentNode = null;\n            }\n          }this.children = [];var tmpRoot = UE.htmlparser(htmlstr);for (var i = 0, ci; ci = tmpRoot.children[i++];) {\n            this.children.push(ci);ci.parentNode = this;\n          }return this;\n        } else {\n          var tmpRoot = new UE.uNode({ type: \"root\", children: this.children });return tmpRoot.toHtml();\n        }\n      }, innerText: function innerText(textStr, noTrans) {\n        if (this.type != \"element\" || dtd.$empty[this.tagName]) {\n          return this;\n        }if (textStr) {\n          if (this.children) {\n            for (var i = 0, ci; ci = this.children[i++];) {\n              ci.parentNode = null;\n            }\n          }this.children = [];this.appendChild(uNode.createText(textStr, noTrans));return this;\n        } else {\n          return this.toHtml().replace(/<[^>]+>/g, \"\");\n        }\n      }, getData: function getData() {\n        if (this.type == \"element\") return \"\";return this.data;\n      }, firstChild: function firstChild() {\n        return this.children ? this.children[0] : null;\n      }, lastChild: function lastChild() {\n        return this.children ? this.children[this.children.length - 1] : null;\n      }, previousSibling: function previousSibling() {\n        var parent = this.parentNode;for (var i = 0, ci; ci = parent.children[i]; i++) {\n          if (ci === this) {\n            return i == 0 ? null : parent.children[i - 1];\n          }\n        }\n      }, nextSibling: function nextSibling() {\n        var parent = this.parentNode;for (var i = 0, ci; ci = parent.children[i++];) {\n          if (ci === this) {\n            return parent.children[i];\n          }\n        }\n      }, replaceChild: function replaceChild(target, source) {\n        if (this.children) {\n          if (target.parentNode) {\n            target.parentNode.removeChild(target);\n          }for (var i = 0, ci; ci = this.children[i]; i++) {\n            if (ci === source) {\n              this.children.splice(i, 1, target);source.parentNode = null;target.parentNode = this;return target;\n            }\n          }\n        }\n      }, appendChild: function appendChild(node) {\n        if (this.type == \"root\" || this.type == \"element\" && !dtd.$empty[this.tagName]) {\n          if (!this.children) {\n            this.children = [];\n          }if (node.parentNode) {\n            node.parentNode.removeChild(node);\n          }for (var i = 0, ci; ci = this.children[i]; i++) {\n            if (ci === node) {\n              this.children.splice(i, 1);break;\n            }\n          }this.children.push(node);node.parentNode = this;return node;\n        }\n      }, insertBefore: function insertBefore(target, source) {\n        if (this.children) {\n          if (target.parentNode) {\n            target.parentNode.removeChild(target);\n          }for (var i = 0, ci; ci = this.children[i]; i++) {\n            if (ci === source) {\n              this.children.splice(i, 0, target);target.parentNode = this;return target;\n            }\n          }\n        }\n      }, insertAfter: function insertAfter(target, source) {\n        if (this.children) {\n          if (target.parentNode) {\n            target.parentNode.removeChild(target);\n          }for (var i = 0, ci; ci = this.children[i]; i++) {\n            if (ci === source) {\n              this.children.splice(i + 1, 0, target);target.parentNode = this;return target;\n            }\n          }\n        }\n      }, removeChild: function removeChild(node, keepChildren) {\n        if (this.children) {\n          for (var i = 0, ci; ci = this.children[i]; i++) {\n            if (ci === node) {\n              this.children.splice(i, 1);ci.parentNode = null;if (keepChildren && ci.children && ci.children.length) {\n                for (var j = 0, cj; cj = ci.children[j]; j++) {\n                  this.children.splice(i + j, 0, cj);cj.parentNode = this;\n                }\n              }return ci;\n            }\n          }\n        }\n      }, getAttr: function getAttr(attrName) {\n        return this.attrs && this.attrs[attrName.toLowerCase()];\n      }, setAttr: function setAttr(attrName, attrVal) {\n        if (!attrName) {\n          delete this.attrs;return;\n        }if (!this.attrs) {\n          this.attrs = {};\n        }if (utils.isObject(attrName)) {\n          for (var a in attrName) {\n            if (!attrName[a]) {\n              delete this.attrs[a];\n            } else {\n              this.attrs[a.toLowerCase()] = attrName[a];\n            }\n          }\n        } else {\n          if (!attrVal) {\n            delete this.attrs[attrName];\n          } else {\n            this.attrs[attrName.toLowerCase()] = attrVal;\n          }\n        }\n      }, getIndex: function getIndex() {\n        var parent = this.parentNode;for (var i = 0, ci; ci = parent.children[i]; i++) {\n          if (ci === this) {\n            return i;\n          }\n        }return -1;\n      }, getNodeById: function getNodeById(id) {\n        var node;if (this.children && this.children.length) {\n          for (var i = 0, ci; ci = this.children[i++];) {\n            if (node = _getNodeById(ci, id)) {\n              return node;\n            }\n          }\n        }\n      }, getNodesByTagName: function getNodesByTagName(tagNames) {\n        tagNames = utils.trim(tagNames).replace(/[ ]{2,}/g, \" \").split(\" \");var arr = [],\n            me = this;utils.each(tagNames, function (tagName) {\n          if (me.children && me.children.length) {\n            for (var i = 0, ci; ci = me.children[i++];) {\n              _getNodesByTagName(ci, tagName, arr);\n            }\n          }\n        });return arr;\n      }, getStyle: function getStyle(name) {\n        var cssStyle = this.getAttr(\"style\");if (!cssStyle) {\n          return \"\";\n        }var reg = new RegExp(\"(^|;)\\\\s*\" + name + \":([^;]+)\", \"i\");var match = cssStyle.match(reg);if (match && match[0]) {\n          return match[2];\n        }return \"\";\n      }, setStyle: function setStyle(name, val) {\n        function exec(name, val) {\n          var reg = new RegExp(\"(^|;)\\\\s*\" + name + \":([^;]+;?)\", \"gi\");cssStyle = cssStyle.replace(reg, \"$1\");if (val) {\n            cssStyle = name + \":\" + utils.unhtml(val) + \";\" + cssStyle;\n          }\n        }var cssStyle = this.getAttr(\"style\");if (!cssStyle) {\n          cssStyle = \"\";\n        }if (utils.isObject(name)) {\n          for (var a in name) {\n            exec(a, name[a]);\n          }\n        } else {\n          exec(name, val);\n        }this.setAttr(\"style\", utils.trim(cssStyle));\n      }, traversal: function traversal(fn) {\n        if (this.children && this.children.length) {\n          nodeTraversal(this, fn);\n        }return this;\n      } };\n  }();var htmlparser = UE.htmlparser = function (htmlstr, ignoreBlank) {\n    var re_tag = /<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)-->)|(?:([^\\s\\/<>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'<>])*)\\/?>))/g,\n        re_attr = /([\\w\\-:.]+)(?:(?:\\s*=\\s*(?:(?:\"([^\"]*)\")|(?:'([^']*)')|([^\\s>]+)))|(?=\\s|$))/g;var allowEmptyTags = { b: 1, code: 1, i: 1, u: 1, strike: 1, s: 1, tt: 1, strong: 1, q: 1, samp: 1, em: 1, span: 1, sub: 1, img: 1, sup: 1, font: 1, big: 1, small: 1, iframe: 1, a: 1, br: 1, pre: 1 };htmlstr = htmlstr.replace(new RegExp(domUtils.fillChar, \"g\"), \"\");if (!ignoreBlank) {\n      htmlstr = htmlstr.replace(new RegExp(\"[\\\\r\\\\t\\\\n\" + (ignoreBlank ? \"\" : \" \") + \"]*</?(\\\\w+)\\\\s*(?:[^>]*)>[\\\\r\\\\t\\\\n\" + (ignoreBlank ? \"\" : \" \") + \"]*\", \"g\"), function (a, b) {\n        if (b && allowEmptyTags[b.toLowerCase()]) {\n          return a.replace(/(^[\\n\\r]+)|([\\n\\r]+$)/g, \"\");\n        }return a.replace(new RegExp(\"^[\\\\r\\\\n\" + (ignoreBlank ? \"\" : \" \") + \"]+\"), \"\").replace(new RegExp(\"[\\\\r\\\\n\" + (ignoreBlank ? \"\" : \" \") + \"]+$\"), \"\");\n      });\n    }var notTransAttrs = { href: 1, src: 1 };var uNode = UE.uNode,\n        needParentNode = { td: \"tr\", tr: [\"tbody\", \"thead\", \"tfoot\"], tbody: \"table\", th: \"tr\", thead: \"table\", tfoot: \"table\", caption: \"table\", li: [\"ul\", \"ol\"], dt: \"dl\", dd: \"dl\", option: \"select\" },\n        needChild = { ol: \"li\", ul: \"li\" };function text(parent, data) {\n      if (needChild[parent.tagName]) {\n        var tmpNode = uNode.createElement(needChild[parent.tagName]);parent.appendChild(tmpNode);tmpNode.appendChild(uNode.createText(data));parent = tmpNode;\n      } else {\n        parent.appendChild(uNode.createText(data));\n      }\n    }function element(parent, tagName, htmlattr) {\n      var needParentTag;if (needParentTag = needParentNode[tagName]) {\n        var tmpParent = parent,\n            hasParent;while (tmpParent.type != \"root\") {\n          if (utils.isArray(needParentTag) ? utils.indexOf(needParentTag, tmpParent.tagName) != -1 : needParentTag == tmpParent.tagName) {\n            parent = tmpParent;hasParent = true;break;\n          }tmpParent = tmpParent.parentNode;\n        }if (!hasParent) {\n          parent = element(parent, utils.isArray(needParentTag) ? needParentTag[0] : needParentTag);\n        }\n      }var elm = new uNode({ parentNode: parent, type: \"element\", tagName: tagName.toLowerCase(), children: dtd.$empty[tagName] ? null : [] });if (htmlattr) {\n        var attrs = {},\n            match;while (match = re_attr.exec(htmlattr)) {\n          attrs[match[1].toLowerCase()] = notTransAttrs[match[1].toLowerCase()] ? match[2] || match[3] || match[4] : utils.unhtml(match[2] || match[3] || match[4]);\n        }elm.attrs = attrs;\n      }parent.children.push(elm);return dtd.$empty[tagName] ? parent : elm;\n    }function comment(parent, data) {\n      parent.children.push(new uNode({ type: \"comment\", data: data, parentNode: parent }));\n    }var match,\n        currentIndex = 0,\n        nextIndex = 0;var root = new uNode({ type: \"root\", children: [] });var currentParent = root;while (match = re_tag.exec(htmlstr)) {\n      currentIndex = match.index;try {\n        if (currentIndex > nextIndex) {\n          text(currentParent, htmlstr.slice(nextIndex, currentIndex));\n        }if (match[3]) {\n          if (dtd.$cdata[currentParent.tagName]) {\n            text(currentParent, match[0]);\n          } else {\n            currentParent = element(currentParent, match[3].toLowerCase(), match[4]);\n          }\n        } else if (match[1]) {\n          if (currentParent.type != \"root\") {\n            if (dtd.$cdata[currentParent.tagName] && !dtd.$cdata[match[1]]) {\n              text(currentParent, match[0]);\n            } else {\n              var tmpParent = currentParent;while (currentParent.type == \"element\" && currentParent.tagName != match[1].toLowerCase()) {\n                currentParent = currentParent.parentNode;if (currentParent.type == \"root\") {\n                  currentParent = tmpParent;throw \"break\";\n                }\n              }currentParent = currentParent.parentNode;\n            }\n          }\n        } else if (match[2]) {\n          comment(currentParent, match[2]);\n        }\n      } catch (e) {}nextIndex = re_tag.lastIndex;\n    }if (nextIndex < htmlstr.length) {\n      text(currentParent, htmlstr.slice(nextIndex));\n    }return root;\n  };var filterNode = UE.filterNode = function () {\n    function filterNode(node, rules) {\n      switch (node.type) {case \"text\":\n          break;case \"element\":\n          var val;if (val = rules[node.tagName]) {\n            if (val === \"-\") {\n              node.parentNode.removeChild(node);\n            } else if (utils.isFunction(val)) {\n              var parentNode = node.parentNode,\n                  index = node.getIndex();val(node);if (node.parentNode) {\n                if (node.children) {\n                  for (var i = 0, ci; ci = node.children[i];) {\n                    filterNode(ci, rules);if (ci.parentNode) {\n                      i++;\n                    }\n                  }\n                }\n              } else {\n                for (var i = index, ci; ci = parentNode.children[i];) {\n                  filterNode(ci, rules);if (ci.parentNode) {\n                    i++;\n                  }\n                }\n              }\n            } else {\n              var attrs = val[\"$\"];if (attrs && node.attrs) {\n                var tmpAttrs = {},\n                    tmpVal;for (var a in attrs) {\n                  tmpVal = node.getAttr(a);if (a == \"style\" && utils.isArray(attrs[a])) {\n                    var tmpCssStyle = [];utils.each(attrs[a], function (v) {\n                      var tmp;if (tmp = node.getStyle(v)) {\n                        tmpCssStyle.push(v + \":\" + tmp);\n                      }\n                    });tmpVal = tmpCssStyle.join(\";\");\n                  }if (tmpVal) {\n                    tmpAttrs[a] = tmpVal;\n                  }\n                }node.attrs = tmpAttrs;\n              }if (node.children) {\n                for (var i = 0, ci; ci = node.children[i];) {\n                  filterNode(ci, rules);if (ci.parentNode) {\n                    i++;\n                  }\n                }\n              }\n            }\n          } else {\n            if (dtd.$cdata[node.tagName]) {\n              node.parentNode.removeChild(node);\n            } else {\n              var parentNode = node.parentNode,\n                  index = node.getIndex();node.parentNode.removeChild(node, true);for (var i = index, ci; ci = parentNode.children[i];) {\n                filterNode(ci, rules);if (ci.parentNode) {\n                  i++;\n                }\n              }\n            }\n          }break;case \"comment\":\n          node.parentNode.removeChild(node);}\n    }return function (root, rules) {\n      if (utils.isEmptyObject(rules)) {\n        return root;\n      }var val;if (val = rules[\"-\"]) {\n        utils.each(val.split(\" \"), function (k) {\n          rules[k] = \"-\";\n        });\n      }for (var i = 0, ci; ci = root.children[i];) {\n        filterNode(ci, rules);if (ci.parentNode) {\n          i++;\n        }\n      }return root;\n    };\n  }();UE.plugin = function () {\n    var _plugins = {};return { register: function register(pluginName, fn, oldOptionName, afterDisabled) {\n        if (oldOptionName && utils.isFunction(oldOptionName)) {\n          afterDisabled = oldOptionName;oldOptionName = null;\n        }_plugins[pluginName] = { optionName: oldOptionName || pluginName, execFn: fn, afterDisabled: afterDisabled };\n      }, load: function load(editor) {\n        utils.each(_plugins, function (plugin) {\n          var _export = plugin.execFn.call(editor);if (editor.options[plugin.optionName] !== false) {\n            if (_export) {\n              utils.each(_export, function (v, k) {\n                switch (k.toLowerCase()) {case \"shortcutkey\":\n                    editor.addshortcutkey(v);break;case \"bindevents\":\n                    utils.each(v, function (fn, eventName) {\n                      editor.addListener(eventName, fn);\n                    });break;case \"bindmultievents\":\n                    utils.each(utils.isArray(v) ? v : [v], function (event) {\n                      var types = utils.trim(event.type).split(/\\s+/);utils.each(types, function (eventName) {\n                        editor.addListener(eventName, event.handler);\n                      });\n                    });break;case \"commands\":\n                    utils.each(v, function (execFn, execName) {\n                      editor.commands[execName] = execFn;\n                    });break;case \"outputrule\":\n                    editor.addOutputRule(v);break;case \"inputrule\":\n                    editor.addInputRule(v);break;case \"defaultoptions\":\n                    editor.setOpt(v);}\n              });\n            }\n          } else if (plugin.afterDisabled) {\n            plugin.afterDisabled.call(editor);\n          }\n        });utils.each(UE.plugins, function (plugin) {\n          plugin.call(editor);\n        });\n      }, run: function run(pluginName, editor) {\n        var plugin = _plugins[pluginName];if (plugin) {\n          plugin.exeFn.call(editor);\n        }\n      } };\n  }();var keymap = UE.keymap = { Backspace: 8, Tab: 9, Enter: 13, Shift: 16, Control: 17, Alt: 18, CapsLock: 20, Esc: 27, Spacebar: 32, PageUp: 33, PageDown: 34, End: 35, Home: 36, Left: 37, Up: 38, Right: 39, Down: 40, Insert: 45, Del: 46, NumLock: 144, Cmd: 91, \"=\": 187, \"-\": 189, b: 66, i: 73, z: 90, y: 89, v: 86, x: 88, s: 83, n: 78 };var LocalStorage = UE.LocalStorage = function () {\n    var storage = window.localStorage || getUserData() || null,\n        LOCAL_FILE = \"localStorage\";return { saveLocalData: function saveLocalData(key, data) {\n        if (storage && data) {\n          storage.setItem(key, data);return true;\n        }return false;\n      }, getLocalData: function getLocalData(key) {\n        if (storage) {\n          return storage.getItem(key);\n        }return null;\n      }, removeItem: function removeItem(key) {\n        storage && storage.removeItem(key);\n      } };function getUserData() {\n      var container = document.createElement(\"div\");container.style.display = \"none\";if (!container.addBehavior) {\n        return null;\n      }container.addBehavior(\"#default#userdata\");return { getItem: function getItem(key) {\n          var result = null;try {\n            document.body.appendChild(container);container.load(LOCAL_FILE);result = container.getAttribute(key);document.body.removeChild(container);\n          } catch (e) {}return result;\n        }, setItem: function setItem(key, value) {\n          document.body.appendChild(container);container.setAttribute(key, value);container.save(LOCAL_FILE);document.body.removeChild(container);\n        }, removeItem: function removeItem(key) {\n          document.body.appendChild(container);container.removeAttribute(key);container.save(LOCAL_FILE);document.body.removeChild(container);\n        } };\n    }\n  }();!function () {\n    var ROOTKEY = \"ueditor_preference\";UE.Editor.prototype.setPreferences = function (key, value) {\n      var obj = {};if (utils.isString(key)) {\n        obj[key] = value;\n      } else {\n        obj = key;\n      }var data = LocalStorage.getLocalData(ROOTKEY);if (data && (data = utils.str2json(data))) {\n        utils.extend(data, obj);\n      } else {\n        data = obj;\n      }data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));\n    };UE.Editor.prototype.getPreferences = function (key) {\n      var data = LocalStorage.getLocalData(ROOTKEY);if (data && (data = utils.str2json(data))) {\n        return key ? data[key] : data;\n      }return null;\n    };UE.Editor.prototype.removePreferences = function (key) {\n      var data = LocalStorage.getLocalData(ROOTKEY);if (data && (data = utils.str2json(data))) {\n        data[key] = undefined;delete data[key];\n      }data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));\n    };\n  }();UE.plugins[\"defaultfilter\"] = function () {\n    var me = this;me.setOpt({ allowDivTransToP: true, disabledTableInTable: true });me.addInputRule(function (root) {\n      var allowDivTransToP = this.options.allowDivTransToP;var val;function tdParent(node) {\n        while (node && node.type == \"element\") {\n          if (node.tagName == \"td\") {\n            return true;\n          }node = node.parentNode;\n        }return false;\n      }root.traversal(function (node) {\n        if (node.type == \"element\") {\n          if (!dtd.$cdata[node.tagName] && me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && (!node.attrs || utils.isEmptyObject(node.attrs))) {\n            if (!node.firstChild()) node.parentNode.removeChild(node);else if (node.tagName == \"span\" && (!node.attrs || utils.isEmptyObject(node.attrs))) {\n              node.parentNode.removeChild(node, true);\n            }return;\n          }switch (node.tagName) {case \"style\":case \"script\":\n              node.setAttr({ cdata_tag: node.tagName, cdata_data: node.innerHTML() || \"\", _ue_custom_node_: \"true\" });node.tagName = \"div\";node.innerHTML(\"\");break;case \"a\":\n              if (val = node.getAttr(\"href\")) {\n                node.setAttr(\"_href\", val);\n              }break;case \"img\":\n              if (val = node.getAttr(\"src\")) {\n                if (/^data:/.test(val)) {\n                  node.parentNode.removeChild(node);break;\n                }\n              }node.setAttr(\"_src\", node.getAttr(\"src\"));break;case \"span\":\n              if (browser.webkit && (val = node.getStyle(\"white-space\"))) {\n                if (/nowrap|normal/.test(val)) {\n                  node.setStyle(\"white-space\", \"\");if (me.options.autoClearEmptyNode && utils.isEmptyObject(node.attrs)) {\n                    node.parentNode.removeChild(node, true);\n                  }\n                }\n              }val = node.getAttr(\"id\");if (val && /^_baidu_bookmark_/i.test(val)) {\n                node.parentNode.removeChild(node);\n              }break;case \"p\":\n              if (val = node.getAttr(\"align\")) {\n                node.setAttr(\"align\");node.setStyle(\"text-align\", val);\n              }utils.each(node.children, function (n) {\n                if (n.type == \"element\" && n.tagName == \"p\") {\n                  var next = n.nextSibling();node.parentNode.insertAfter(n, node);var last = n;while (next) {\n                    var tmp = next.nextSibling();node.parentNode.insertAfter(next, last);last = next;next = tmp;\n                  }return false;\n                }\n              });if (!node.firstChild()) {\n                node.innerHTML(browser.ie ? \"&nbsp;\" : \"<br/>\");\n              }break;case \"div\":\n              if (node.getAttr(\"cdata_tag\")) {\n                break;\n              }val = node.getAttr(\"class\");if (val && /^line number\\d+/.test(val)) {\n                break;\n              }if (!allowDivTransToP) {\n                break;\n              }var tmpNode,\n                  p = UE.uNode.createElement(\"p\");while (tmpNode = node.firstChild()) {\n                if (tmpNode.type == \"text\" || !UE.dom.dtd.$block[tmpNode.tagName]) {\n                  p.appendChild(tmpNode);\n                } else {\n                  if (p.firstChild()) {\n                    node.parentNode.insertBefore(p, node);p = UE.uNode.createElement(\"p\");\n                  } else {\n                    node.parentNode.insertBefore(tmpNode, node);\n                  }\n                }\n              }if (p.firstChild()) {\n                node.parentNode.insertBefore(p, node);\n              }node.parentNode.removeChild(node);break;case \"dl\":\n              node.tagName = \"ul\";break;case \"dt\":case \"dd\":\n              node.tagName = \"li\";break;case \"li\":\n              var className = node.getAttr(\"class\");if (!className || !/list\\-/.test(className)) {\n                node.setAttr();\n              }var tmpNodes = node.getNodesByTagName(\"ol ul\");UE.utils.each(tmpNodes, function (n) {\n                node.parentNode.insertAfter(n, node);\n              });break;case \"td\":case \"th\":case \"caption\":\n              if (!node.children || !node.children.length) {\n                node.appendChild(browser.ie11below ? UE.uNode.createText(\" \") : UE.uNode.createElement(\"br\"));\n              }break;case \"table\":\n              if (me.options.disabledTableInTable && tdParent(node)) {\n                node.parentNode.insertBefore(UE.uNode.createText(node.innerText()), node);node.parentNode.removeChild(node);\n              }}\n        }\n      });\n    });me.addOutputRule(function (root) {\n      var val;root.traversal(function (node) {\n        if (node.type == \"element\") {\n          if (me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && (!node.attrs || utils.isEmptyObject(node.attrs))) {\n            if (!node.firstChild()) node.parentNode.removeChild(node);else if (node.tagName == \"span\" && (!node.attrs || utils.isEmptyObject(node.attrs))) {\n              node.parentNode.removeChild(node, true);\n            }return;\n          }switch (node.tagName) {case \"div\":\n              if (val = node.getAttr(\"cdata_tag\")) {\n                node.tagName = val;node.appendChild(UE.uNode.createText(node.getAttr(\"cdata_data\")));node.setAttr({ cdata_tag: \"\", cdata_data: \"\", _ue_custom_node_: \"\" });\n              }break;case \"a\":\n              if (val = node.getAttr(\"_href\")) {\n                node.setAttr({ href: utils.html(val), _href: \"\" });\n              }break;break;case \"span\":\n              val = node.getAttr(\"id\");if (val && /^_baidu_bookmark_/i.test(val)) {\n                node.parentNode.removeChild(node);\n              }break;case \"img\":\n              if (val = node.getAttr(\"_src\")) {\n                node.setAttr({ src: node.getAttr(\"_src\"), _src: \"\" });\n              }}\n        }\n      });\n    });\n  };UE.commands[\"inserthtml\"] = { execCommand: function execCommand(command, html, notNeedFilter) {\n      var me = this,\n          range,\n          div;if (!html) {\n        return;\n      }if (me.fireEvent(\"beforeinserthtml\", html) === true) {\n        return;\n      }range = me.selection.getRange();div = range.document.createElement(\"div\");div.style.display = \"inline\";if (!notNeedFilter) {\n        var root = UE.htmlparser(html);if (me.options.filterRules) {\n          UE.filterNode(root, me.options.filterRules);\n        }me.filterInputRule(root);html = root.toHtml();\n      }div.innerHTML = utils.trim(html);if (!range.collapsed) {\n        var tmpNode = range.startContainer;if (domUtils.isFillChar(tmpNode)) {\n          range.setStartBefore(tmpNode);\n        }tmpNode = range.endContainer;if (domUtils.isFillChar(tmpNode)) {\n          range.setEndAfter(tmpNode);\n        }range.txtToElmBoundary();if (range.endContainer && range.endContainer.nodeType == 1) {\n          tmpNode = range.endContainer.childNodes[range.endOffset];if (tmpNode && domUtils.isBr(tmpNode)) {\n            range.setEndAfter(tmpNode);\n          }\n        }if (range.startOffset == 0) {\n          tmpNode = range.startContainer;if (domUtils.isBoundaryNode(tmpNode, \"firstChild\")) {\n            tmpNode = range.endContainer;if (range.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode, \"lastChild\")) {\n              me.body.innerHTML = \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";range.setStart(me.body.firstChild, 0).collapse(true);\n            }\n          }\n        }!range.collapsed && range.deleteContents();if (range.startContainer.nodeType == 1) {\n          var child = range.startContainer.childNodes[range.startOffset],\n              pre;if (child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(pre)) {\n            range.setEnd(pre, pre.childNodes.length).collapse();while (child.firstChild) {\n              pre.appendChild(child.firstChild);\n            }domUtils.remove(child);\n          }\n        }\n      }var child,\n          parent,\n          pre,\n          tmp,\n          hadBreak = 0,\n          nextNode;if (range.inFillChar()) {\n        child = range.startContainer;if (domUtils.isFillChar(child)) {\n          range.setStartBefore(child).collapse(true);domUtils.remove(child);\n        } else if (domUtils.isFillChar(child, true)) {\n          child.nodeValue = child.nodeValue.replace(fillCharReg, \"\");range.startOffset--;range.collapsed && range.collapse(true);\n        }\n      }var li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (li) {\n        var next, last;while (child = div.firstChild) {\n          while (child && (child.nodeType == 3 || !domUtils.isBlockElm(child) || child.tagName == \"HR\")) {\n            next = child.nextSibling;range.insertNode(child).collapse();last = child;child = next;\n          }if (child) {\n            if (/^(ol|ul)$/i.test(child.tagName)) {\n              while (child.firstChild) {\n                last = child.firstChild;domUtils.insertAfter(li, child.firstChild);li = li.nextSibling;\n              }domUtils.remove(child);\n            } else {\n              var tmpLi;next = child.nextSibling;tmpLi = me.document.createElement(\"li\");domUtils.insertAfter(li, tmpLi);tmpLi.appendChild(child);last = child;child = next;li = tmpLi;\n            }\n          }\n        }li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (domUtils.isEmptyBlock(li)) {\n          domUtils.remove(li);\n        }if (last) {\n          range.setStartAfter(last).collapse(true).select(true);\n        }\n      } else {\n        while (child = div.firstChild) {\n          if (hadBreak) {\n            var p = me.document.createElement(\"p\");while (child && (child.nodeType == 3 || !dtd.$block[child.tagName])) {\n              nextNode = child.nextSibling;p.appendChild(child);child = nextNode;\n            }if (p.firstChild) {\n              child = p;\n            }\n          }range.insertNode(child);nextNode = child.nextSibling;if (!hadBreak && child.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm(child)) {\n            parent = domUtils.findParent(child, function (node) {\n              return domUtils.isBlockElm(node);\n            });if (parent && parent.tagName.toLowerCase() != \"body\" && !(dtd[parent.tagName][child.nodeName] && child.parentNode === parent)) {\n              if (!dtd[parent.tagName][child.nodeName]) {\n                pre = parent;\n              } else {\n                tmp = child.parentNode;while (tmp !== parent) {\n                  pre = tmp;tmp = tmp.parentNode;\n                }\n              }domUtils.breakParent(child, pre || tmp);var pre = child.previousSibling;domUtils.trimWhiteTextNode(pre);if (!pre.childNodes.length) {\n                domUtils.remove(pre);\n              }if (!browser.ie && (next = child.nextSibling) && domUtils.isBlockElm(next) && next.lastChild && !domUtils.isBr(next.lastChild)) {\n                next.appendChild(me.document.createElement(\"br\"));\n              }hadBreak = 1;\n            }\n          }var next = child.nextSibling;if (!div.firstChild && next && domUtils.isBlockElm(next)) {\n            range.setStart(next, 0).collapse(true);break;\n          }range.setEndAfter(child).collapse();\n        }child = range.startContainer;if (nextNode && domUtils.isBr(nextNode)) {\n          domUtils.remove(nextNode);\n        }if (domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)) {\n          if (nextNode = child.nextSibling) {\n            domUtils.remove(child);if (nextNode.nodeType == 1 && dtd.$block[nextNode.tagName]) {\n              range.setStart(nextNode, 0).collapse(true).shrinkBoundary();\n            }\n          } else {\n            try {\n              child.innerHTML = browser.ie ? domUtils.fillChar : \"<br/>\";\n            } catch (e) {\n              range.setStartBefore(child);domUtils.remove(child);\n            }\n          }\n        }try {\n          range.select(true);\n        } catch (e) {}\n      }setTimeout(function () {\n        range = me.selection.getRange();range.scrollToView(me.autoHeightEnabled, me.autoHeightEnabled ? domUtils.getXY(me.iframe).y : 0);me.fireEvent(\"afterinserthtml\", html);\n      }, 200);\n    } };UE.commands[\"imagefloat\"] = { execCommand: function execCommand(cmd, align) {\n      var me = this,\n          range = me.selection.getRange();if (!range.collapsed) {\n        var img = range.getClosedNode();if (img && img.tagName == \"IMG\") {\n          switch (align) {case \"left\":case \"right\":case \"none\":\n              var pN = img.parentNode,\n                  tmpNode,\n                  pre,\n                  next;while (dtd.$inline[pN.tagName] || pN.tagName == \"A\") {\n                pN = pN.parentNode;\n              }tmpNode = pN;if (tmpNode.tagName == \"P\" && domUtils.getStyle(tmpNode, \"text-align\") == \"center\") {\n                if (!domUtils.isBody(tmpNode) && domUtils.getChildCount(tmpNode, function (node) {\n                  return !domUtils.isBr(node) && !domUtils.isWhitespace(node);\n                }) == 1) {\n                  pre = tmpNode.previousSibling;next = tmpNode.nextSibling;if (pre && next && pre.nodeType == 1 && next.nodeType == 1 && pre.tagName == next.tagName && domUtils.isBlockElm(pre)) {\n                    pre.appendChild(tmpNode.firstChild);while (next.firstChild) {\n                      pre.appendChild(next.firstChild);\n                    }domUtils.remove(tmpNode);domUtils.remove(next);\n                  } else {\n                    domUtils.setStyle(tmpNode, \"text-align\", \"\");\n                  }\n                }range.selectNode(img).select();\n              }domUtils.setStyle(img, \"float\", align == \"none\" ? \"\" : align);if (align == \"none\") {\n                domUtils.removeAttributes(img, \"align\");\n              }break;case \"center\":\n              if (me.queryCommandValue(\"imagefloat\") != \"center\") {\n                pN = img.parentNode;domUtils.setStyle(img, \"float\", \"\");domUtils.removeAttributes(img, \"align\");tmpNode = img;while (pN && domUtils.getChildCount(pN, function (node) {\n                  return !domUtils.isBr(node) && !domUtils.isWhitespace(node);\n                }) == 1 && (dtd.$inline[pN.tagName] || pN.tagName == \"A\")) {\n                  tmpNode = pN;pN = pN.parentNode;\n                }range.setStartBefore(tmpNode).setCursor(false);pN = me.document.createElement(\"div\");pN.appendChild(tmpNode);domUtils.setStyle(tmpNode, \"float\", \"\");me.execCommand(\"insertHtml\", '<p id=\"_img_parent_tmp\" style=\"text-align:center\">' + pN.innerHTML + \"</p>\");tmpNode = me.document.getElementById(\"_img_parent_tmp\");tmpNode.removeAttribute(\"id\");tmpNode = tmpNode.firstChild;range.selectNode(tmpNode).select();next = tmpNode.parentNode.nextSibling;if (next && domUtils.isEmptyNode(next)) {\n                  domUtils.remove(next);\n                }\n              }break;}\n        }\n      }\n    }, queryCommandValue: function queryCommandValue() {\n      var range = this.selection.getRange(),\n          startNode,\n          floatStyle;if (range.collapsed) {\n        return \"none\";\n      }startNode = range.getClosedNode();if (startNode && startNode.nodeType == 1 && startNode.tagName == \"IMG\") {\n        floatStyle = domUtils.getComputedStyle(startNode, \"float\") || startNode.getAttribute(\"align\");if (floatStyle == \"none\") {\n          floatStyle = domUtils.getComputedStyle(startNode.parentNode, \"text-align\") == \"center\" ? \"center\" : floatStyle;\n        }return { left: 1, right: 1, center: 1 }[floatStyle] ? floatStyle : \"none\";\n      }return \"none\";\n    }, queryCommandState: function queryCommandState() {\n      var range = this.selection.getRange(),\n          startNode;if (range.collapsed) return -1;startNode = range.getClosedNode();if (startNode && startNode.nodeType == 1 && startNode.tagName == \"IMG\") {\n        return 0;\n      }return -1;\n    } };UE.commands[\"insertimage\"] = { execCommand: function execCommand(cmd, opt) {\n      opt = utils.isArray(opt) ? opt : [opt];if (!opt.length) {\n        return;\n      }var me = this,\n          range = me.selection.getRange(),\n          img = range.getClosedNode();if (me.fireEvent(\"beforeinsertimage\", opt) === true) {\n        return;\n      }if (img && /img/i.test(img.tagName) && (img.className != \"edui-faked-video\" || img.className.indexOf(\"edui-upload-video\") != -1) && !img.getAttribute(\"word_img\")) {\n        var first = opt.shift();var floatStyle = first[\"floatStyle\"];delete first[\"floatStyle\"];domUtils.setAttributes(img, first);me.execCommand(\"imagefloat\", floatStyle);if (opt.length > 0) {\n          range.setStartAfter(img).setCursor(false, true);me.execCommand(\"insertimage\", opt);\n        }\n      } else {\n        var html = [],\n            str = \"\",\n            ci;ci = opt[0];if (opt.length == 1) {\n          str = '<img src=\"' + ci.src + '\" ' + (ci._src ? ' _src=\"' + ci._src + '\" ' : \"\") + (ci.width ? 'width=\"' + ci.width + '\" ' : \"\") + (ci.height ? ' height=\"' + ci.height + '\" ' : \"\") + (ci[\"floatStyle\"] == \"left\" || ci[\"floatStyle\"] == \"right\" ? ' style=\"float:' + ci[\"floatStyle\"] + ';\"' : \"\") + (ci.title && ci.title != \"\" ? ' title=\"' + ci.title + '\"' : \"\") + (ci.border && ci.border != \"0\" ? ' border=\"' + ci.border + '\"' : \"\") + (ci.alt && ci.alt != \"\" ? ' alt=\"' + ci.alt + '\"' : \"\") + (ci.hspace && ci.hspace != \"0\" ? ' hspace = \"' + ci.hspace + '\"' : \"\") + (ci.vspace && ci.vspace != \"0\" ? ' vspace = \"' + ci.vspace + '\"' : \"\") + \"/>\";if (ci[\"floatStyle\"] == \"center\") {\n            str = '<p style=\"text-align: center\">' + str + \"</p>\";\n          }html.push(str);\n        } else {\n          for (var i = 0; ci = opt[i++];) {\n            str = \"<p \" + (ci[\"floatStyle\"] == \"center\" ? 'style=\"text-align: center\" ' : \"\") + '><img src=\"' + ci.src + '\" ' + (ci.width ? 'width=\"' + ci.width + '\" ' : \"\") + (ci._src ? ' _src=\"' + ci._src + '\" ' : \"\") + (ci.height ? ' height=\"' + ci.height + '\" ' : \"\") + ' style=\"' + (ci[\"floatStyle\"] && ci[\"floatStyle\"] != \"center\" ? \"float:\" + ci[\"floatStyle\"] + \";\" : \"\") + (ci.border || \"\") + '\" ' + (ci.title ? ' title=\"' + ci.title + '\"' : \"\") + \" /></p>\";html.push(str);\n          }\n        }me.execCommand(\"insertHtml\", html.join(\"\"));\n      }me.fireEvent(\"afterinsertimage\", opt);\n    } };UE.plugins[\"justify\"] = function () {\n    var me = this,\n        block = domUtils.isBlockElm,\n        defaultValue = { left: 1, right: 1, center: 1, justify: 1 },\n        doJustify = function doJustify(range, style) {\n      var bookmark = range.createBookmark(),\n          filterFn = function filterFn(node) {\n        return node.nodeType == 1 ? node.tagName.toLowerCase() != \"br\" && !domUtils.isBookmarkNode(node) : !domUtils.isWhitespace(node);\n      };range.enlarge(true);var bookmark2 = range.createBookmark(),\n          current = domUtils.getNextDomNode(bookmark2.start, false, filterFn),\n          tmpRange = range.cloneRange(),\n          tmpNode;while (current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING)) {\n        if (current.nodeType == 3 || !block(current)) {\n          tmpRange.setStartBefore(current);while (current && current !== bookmark2.end && !block(current)) {\n            tmpNode = current;current = domUtils.getNextDomNode(current, false, null, function (node) {\n              return !block(node);\n            });\n          }tmpRange.setEndAfter(tmpNode);var common = tmpRange.getCommonAncestor();if (!domUtils.isBody(common) && block(common)) {\n            domUtils.setStyles(common, utils.isString(style) ? { \"text-align\": style } : style);current = common;\n          } else {\n            var p = range.document.createElement(\"p\");domUtils.setStyles(p, utils.isString(style) ? { \"text-align\": style } : style);var frag = tmpRange.extractContents();p.appendChild(frag);tmpRange.insertNode(p);current = p;\n          }current = domUtils.getNextDomNode(current, false, filterFn);\n        } else {\n          current = domUtils.getNextDomNode(current, true, filterFn);\n        }\n      }return range.moveToBookmark(bookmark2).moveToBookmark(bookmark);\n    };UE.commands[\"justify\"] = { execCommand: function execCommand(cmdName, align) {\n        var range = this.selection.getRange(),\n            txt;if (range.collapsed) {\n          txt = this.document.createTextNode(\"p\");range.insertNode(txt);\n        }doJustify(range, align);if (txt) {\n          range.setStartBefore(txt).collapse(true);domUtils.remove(txt);\n        }range.select();return true;\n      }, queryCommandValue: function queryCommandValue() {\n        var startNode = this.selection.getStart(),\n            value = domUtils.getComputedStyle(startNode, \"text-align\");return defaultValue[value] ? value : \"left\";\n      }, queryCommandState: function queryCommandState() {\n        var start = this.selection.getStart(),\n            cell = start && domUtils.findParentByTagName(start, [\"td\", \"th\", \"caption\"], true);return cell ? -1 : 0;\n      } };\n  };UE.plugins[\"font\"] = function () {\n    var me = this,\n        fonts = { forecolor: \"color\", backcolor: \"background-color\", fontsize: \"font-size\", fontfamily: \"font-family\", underline: \"text-decoration\", strikethrough: \"text-decoration\", fontborder: \"border\" },\n        needCmd = { underline: 1, strikethrough: 1, fontborder: 1 },\n        needSetChild = { forecolor: \"color\", backcolor: \"background-color\", fontsize: \"font-size\", fontfamily: \"font-family\" };me.setOpt({ fontfamily: [{ name: \"songti\", val: \"宋体,SimSun\" }, { name: \"yahei\", val: \"微软雅黑,Microsoft YaHei\" }, { name: \"kaiti\", val: \"楷体,楷体_GB2312, SimKai\" }, { name: \"heiti\", val: \"黑体, SimHei\" }, { name: \"lishu\", val: \"隶书, SimLi\" }, { name: \"andaleMono\", val: \"andale mono\" }, { name: \"arial\", val: \"arial, helvetica,sans-serif\" }, { name: \"arialBlack\", val: \"arial black,avant garde\" }, { name: \"comicSansMs\", val: \"comic sans ms\" }, { name: \"impact\", val: \"impact,chicago\" }, { name: \"timesNewRoman\", val: \"times new roman\" }], fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36] });function mergeWithParent(node) {\n      var parent;while (parent = node.parentNode) {\n        if (parent.tagName == \"SPAN\" && domUtils.getChildCount(parent, function (child) {\n          return !domUtils.isBookmarkNode(child) && !domUtils.isBr(child);\n        }) == 1) {\n          parent.style.cssText += node.style.cssText;domUtils.remove(node, true);node = parent;\n        } else {\n          break;\n        }\n      }\n    }function mergeChild(rng, cmdName, value) {\n      if (needSetChild[cmdName]) {\n        rng.adjustmentBoundary();if (!rng.collapsed && rng.startContainer.nodeType == 1) {\n          var start = rng.startContainer.childNodes[rng.startOffset];if (start && domUtils.isTagNode(start, \"span\")) {\n            var bk = rng.createBookmark();utils.each(domUtils.getElementsByTagName(start, \"span\"), function (span) {\n              if (!span.parentNode || domUtils.isBookmarkNode(span)) return;if (cmdName == \"backcolor\" && domUtils.getComputedStyle(span, \"background-color\").toLowerCase() === value) {\n                return;\n              }domUtils.removeStyle(span, needSetChild[cmdName]);if (span.style.cssText.replace(/^\\s+$/, \"\").length == 0) {\n                domUtils.remove(span, true);\n              }\n            });rng.moveToBookmark(bk);\n          }\n        }\n      }\n    }function mergesibling(rng, cmdName, value) {\n      var collapsed = rng.collapsed,\n          bk = rng.createBookmark(),\n          common;if (collapsed) {\n        common = bk.start.parentNode;while (dtd.$inline[common.tagName]) {\n          common = common.parentNode;\n        }\n      } else {\n        common = domUtils.getCommonAncestor(bk.start, bk.end);\n      }utils.each(domUtils.getElementsByTagName(common, \"span\"), function (span) {\n        if (!span.parentNode || domUtils.isBookmarkNode(span)) return;if (/\\s*border\\s*:\\s*none;?\\s*/i.test(span.style.cssText)) {\n          if (/^\\s*border\\s*:\\s*none;?\\s*$/.test(span.style.cssText)) {\n            domUtils.remove(span, true);\n          } else {\n            domUtils.removeStyle(span, \"border\");\n          }return;\n        }if (/border/i.test(span.style.cssText) && span.parentNode.tagName == \"SPAN\" && /border/i.test(span.parentNode.style.cssText)) {\n          span.style.cssText = span.style.cssText.replace(/border[^:]*:[^;]+;?/gi, \"\");\n        }if (!(cmdName == \"fontborder\" && value == \"none\")) {\n          var next = span.nextSibling;while (next && next.nodeType == 1 && next.tagName == \"SPAN\") {\n            if (domUtils.isBookmarkNode(next) && cmdName == \"fontborder\") {\n              span.appendChild(next);next = span.nextSibling;continue;\n            }if (next.style.cssText == span.style.cssText) {\n              domUtils.moveChild(next, span);domUtils.remove(next);\n            }if (span.nextSibling === next) break;next = span.nextSibling;\n          }\n        }mergeWithParent(span);if (browser.ie && browser.version > 8) {\n          var parent = domUtils.findParent(span, function (n) {\n            return n.tagName == \"SPAN\" && /background-color/.test(n.style.cssText);\n          });if (parent && !/background-color/.test(span.style.cssText)) {\n            span.style.backgroundColor = parent.style.backgroundColor;\n          }\n        }\n      });rng.moveToBookmark(bk);mergeChild(rng, cmdName, value);\n    }me.addInputRule(function (root) {\n      utils.each(root.getNodesByTagName(\"u s del font strike\"), function (node) {\n        if (node.tagName == \"font\") {\n          var cssStyle = [];for (var p in node.attrs) {\n            switch (p) {case \"size\":\n                cssStyle.push(\"font-size:\" + ({ 1: \"10\", 2: \"12\", 3: \"16\", 4: \"18\", 5: \"24\", 6: \"32\", 7: \"48\" }[node.attrs[p]] || node.attrs[p]) + \"px\");break;case \"color\":\n                cssStyle.push(\"color:\" + node.attrs[p]);break;case \"face\":\n                cssStyle.push(\"font-family:\" + node.attrs[p]);break;case \"style\":\n                cssStyle.push(node.attrs[p]);}\n          }node.attrs = { style: cssStyle.join(\";\") };\n        } else {\n          var val = node.tagName == \"u\" ? \"underline\" : \"line-through\";node.attrs = { style: (node.getAttr(\"style\") || \"\") + \"text-decoration:\" + val + \";\" };\n        }node.tagName = \"span\";\n      });\n    });for (var p in fonts) {\n      !function (cmd, style) {\n        UE.commands[cmd] = { execCommand: function execCommand(cmdName, value) {\n            value = value || (this.queryCommandState(cmdName) ? \"none\" : cmdName == \"underline\" ? \"underline\" : cmdName == \"fontborder\" ? \"1px solid #000\" : \"line-through\");var me = this,\n                range = this.selection.getRange(),\n                text;if (value == \"default\") {\n              if (range.collapsed) {\n                text = me.document.createTextNode(\"font\");range.insertNode(text).select();\n              }me.execCommand(\"removeFormat\", \"span,a\", style);if (text) {\n                range.setStartBefore(text).collapse(true);\n                domUtils.remove(text);\n              }mergesibling(range, cmdName, value);range.select();\n            } else {\n              if (!range.collapsed) {\n                if (needCmd[cmd] && me.queryCommandValue(cmd)) {\n                  me.execCommand(\"removeFormat\", \"span,a\", style);\n                }range = me.selection.getRange();range.applyInlineStyle(\"span\", { style: style + \":\" + value });mergesibling(range, cmdName, value);range.select();\n              } else {\n                var span = domUtils.findParentByTagName(range.startContainer, \"span\", true);text = me.document.createTextNode(\"font\");if (span && !span.children.length && !span[browser.ie ? \"innerText\" : \"textContent\"].replace(fillCharReg, \"\").length) {\n                  range.insertNode(text);if (needCmd[cmd]) {\n                    range.selectNode(text).select();me.execCommand(\"removeFormat\", \"span,a\", style, null);span = domUtils.findParentByTagName(text, \"span\", true);range.setStartBefore(text);\n                  }span && (span.style.cssText += \";\" + style + \":\" + value);range.collapse(true).select();\n                } else {\n                  range.insertNode(text);range.selectNode(text).select();span = range.document.createElement(\"span\");if (needCmd[cmd]) {\n                    if (domUtils.findParentByTagName(text, \"a\", true)) {\n                      range.setStartBefore(text).setCursor();domUtils.remove(text);return;\n                    }me.execCommand(\"removeFormat\", \"span,a\", style);\n                  }span.style.cssText = style + \":\" + value;text.parentNode.insertBefore(span, text);if (!browser.ie || browser.ie && browser.version == 9) {\n                    var spanParent = span.parentNode;while (!domUtils.isBlockElm(spanParent)) {\n                      if (spanParent.tagName == \"SPAN\") {\n                        span.style.cssText = spanParent.style.cssText + \";\" + span.style.cssText;\n                      }spanParent = spanParent.parentNode;\n                    }\n                  }if (opera) {\n                    setTimeout(function () {\n                      range.setStart(span, 0).collapse(true);mergesibling(range, cmdName, value);range.select();\n                    });\n                  } else {\n                    range.setStart(span, 0).collapse(true);mergesibling(range, cmdName, value);range.select();\n                  }\n                }domUtils.remove(text);\n              }\n            }return true;\n          }, queryCommandValue: function queryCommandValue(cmdName) {\n            var startNode = this.selection.getStart();if (cmdName == \"underline\" || cmdName == \"strikethrough\") {\n              var tmpNode = startNode,\n                  value;while (tmpNode && !domUtils.isBlockElm(tmpNode) && !domUtils.isBody(tmpNode)) {\n                if (tmpNode.nodeType == 1) {\n                  value = domUtils.getComputedStyle(tmpNode, style);if (value != \"none\") {\n                    return value;\n                  }\n                }tmpNode = tmpNode.parentNode;\n              }return \"none\";\n            }if (cmdName == \"fontborder\") {\n              var tmp = startNode,\n                  val;while (tmp && dtd.$inline[tmp.tagName]) {\n                if (val = domUtils.getComputedStyle(tmp, \"border\")) {\n                  if (/1px/.test(val) && /solid/.test(val)) {\n                    return val;\n                  }\n                }tmp = tmp.parentNode;\n              }return \"\";\n            }if (cmdName == \"FontSize\") {\n              var styleVal = domUtils.getComputedStyle(startNode, style),\n                  tmp = /^([\\d\\.]+)(\\w+)$/.exec(styleVal);if (tmp) {\n                return Math.floor(tmp[1]) + tmp[2];\n              }return styleVal;\n            }return domUtils.getComputedStyle(startNode, style);\n          }, queryCommandState: function queryCommandState(cmdName) {\n            if (!needCmd[cmdName]) return 0;var val = this.queryCommandValue(cmdName);if (cmdName == \"fontborder\") {\n              return (/1px/.test(val) && /solid/.test(val)\n              );\n            } else {\n              return cmdName == \"underline\" ? /underline/.test(val) : /line\\-through/.test(val);\n            }\n          } };\n      }(p, fonts[p]);\n    }\n  };UE.plugins[\"link\"] = function () {\n    function optimize(range) {\n      var start = range.startContainer,\n          end = range.endContainer;if (start = domUtils.findParentByTagName(start, \"a\", true)) {\n        range.setStartBefore(start);\n      }if (end = domUtils.findParentByTagName(end, \"a\", true)) {\n        range.setEndAfter(end);\n      }\n    }UE.commands[\"unlink\"] = { execCommand: function execCommand() {\n        var range = this.selection.getRange(),\n            bookmark;if (range.collapsed && !domUtils.findParentByTagName(range.startContainer, \"a\", true)) {\n          return;\n        }bookmark = range.createBookmark();optimize(range);range.removeInlineStyle(\"a\").moveToBookmark(bookmark).select();\n      }, queryCommandState: function queryCommandState() {\n        return !this.highlight && this.queryCommandValue(\"link\") ? 0 : -1;\n      } };function doLink(range, opt, me) {\n      var rngClone = range.cloneRange(),\n          link = me.queryCommandValue(\"link\");optimize(range = range.adjustmentBoundary());var start = range.startContainer;if (start.nodeType == 1 && link) {\n        start = start.childNodes[range.startOffset];if (start && start.nodeType == 1 && start.tagName == \"A\" && /^(?:https?|ftp|file)\\s*:\\s*\\/\\//.test(start[browser.ie ? \"innerText\" : \"textContent\"])) {\n          start[browser.ie ? \"innerText\" : \"textContent\"] = utils.html(opt.textValue || opt.href);\n        }\n      }if (!rngClone.collapsed || link) {\n        range.removeInlineStyle(\"a\");rngClone = range.cloneRange();\n      }if (rngClone.collapsed) {\n        var a = range.document.createElement(\"a\"),\n            text = \"\";if (opt.textValue) {\n          text = utils.html(opt.textValue);delete opt.textValue;\n        } else {\n          text = utils.html(opt.href);\n        }domUtils.setAttributes(a, opt);start = domUtils.findParentByTagName(rngClone.startContainer, \"a\", true);if (start && domUtils.isInNodeEndBoundary(rngClone, start)) {\n          range.setStartAfter(start).collapse(true);\n        }a[browser.ie ? \"innerText\" : \"textContent\"] = text;range.insertNode(a).selectNode(a);\n      } else {\n        range.applyInlineStyle(\"a\", opt);\n      }\n    }UE.commands[\"link\"] = { execCommand: function execCommand(cmdName, opt) {\n        var range;opt._href && (opt._href = utils.unhtml(opt._href, /[<\">]/g));opt.href && (opt.href = utils.unhtml(opt.href, /[<\">]/g));opt.textValue && (opt.textValue = utils.unhtml(opt.textValue, /[<\">]/g));doLink(range = this.selection.getRange(), opt, this);range.collapse().select(true);\n      }, queryCommandValue: function queryCommandValue() {\n        var range = this.selection.getRange(),\n            node;if (range.collapsed) {\n          node = range.startContainer;node = node.nodeType == 1 ? node : node.parentNode;if (node && (node = domUtils.findParentByTagName(node, \"a\", true)) && !domUtils.isInNodeEndBoundary(range, node)) {\n            return node;\n          }\n        } else {\n          range.shrinkBoundary();var start = range.startContainer.nodeType == 3 || !range.startContainer.childNodes[range.startOffset] ? range.startContainer : range.startContainer.childNodes[range.startOffset],\n              end = range.endContainer.nodeType == 3 || range.endOffset == 0 ? range.endContainer : range.endContainer.childNodes[range.endOffset - 1],\n              common = range.getCommonAncestor();node = domUtils.findParentByTagName(common, \"a\", true);if (!node && common.nodeType == 1) {\n            var as = common.getElementsByTagName(\"a\"),\n                ps,\n                pe;for (var i = 0, ci; ci = as[i++];) {\n              ps = domUtils.getPosition(ci, start), pe = domUtils.getPosition(ci, end);if ((ps & domUtils.POSITION_FOLLOWING || ps & domUtils.POSITION_CONTAINS) && (pe & domUtils.POSITION_PRECEDING || pe & domUtils.POSITION_CONTAINS)) {\n                node = ci;break;\n              }\n            }\n          }return node;\n        }\n      }, queryCommandState: function queryCommandState() {\n        var img = this.selection.getRange().getClosedNode(),\n            flag = img && (img.className == \"edui-faked-video\" || img.className.indexOf(\"edui-upload-video\") != -1);return flag ? -1 : 0;\n      } };\n  };UE.plugins[\"paragraph\"] = function () {\n    var me = this,\n        block = domUtils.isBlockElm,\n        notExchange = [\"TD\", \"LI\", \"PRE\"],\n        doParagraph = function doParagraph(range, style, attrs, sourceCmdName) {\n      var bookmark = range.createBookmark(),\n          filterFn = function filterFn(node) {\n        return node.nodeType == 1 ? node.tagName.toLowerCase() != \"br\" && !domUtils.isBookmarkNode(node) : !domUtils.isWhitespace(node);\n      },\n          para;range.enlarge(true);var bookmark2 = range.createBookmark(),\n          current = domUtils.getNextDomNode(bookmark2.start, false, filterFn),\n          tmpRange = range.cloneRange(),\n          tmpNode;while (current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING)) {\n        if (current.nodeType == 3 || !block(current)) {\n          tmpRange.setStartBefore(current);while (current && current !== bookmark2.end && !block(current)) {\n            tmpNode = current;current = domUtils.getNextDomNode(current, false, null, function (node) {\n              return !block(node);\n            });\n          }tmpRange.setEndAfter(tmpNode);para = range.document.createElement(style);if (attrs) {\n            domUtils.setAttributes(para, attrs);if (sourceCmdName && sourceCmdName == \"customstyle\" && attrs.style) {\n              para.style.cssText = attrs.style;\n            }\n          }para.appendChild(tmpRange.extractContents());if (domUtils.isEmptyNode(para)) {\n            domUtils.fillChar(range.document, para);\n          }tmpRange.insertNode(para);var parent = para.parentNode;if (block(parent) && !domUtils.isBody(para.parentNode) && utils.indexOf(notExchange, parent.tagName) == -1) {\n            if (!(sourceCmdName && sourceCmdName == \"customstyle\")) {\n              parent.getAttribute(\"dir\") && para.setAttribute(\"dir\", parent.getAttribute(\"dir\"));parent.style.cssText && (para.style.cssText = parent.style.cssText + \";\" + para.style.cssText);parent.style.textAlign && !para.style.textAlign && (para.style.textAlign = parent.style.textAlign);parent.style.textIndent && !para.style.textIndent && (para.style.textIndent = parent.style.textIndent);parent.style.padding && !para.style.padding && (para.style.padding = parent.style.padding);\n            }if (attrs && /h\\d/i.test(parent.tagName) && !/h\\d/i.test(para.tagName)) {\n              domUtils.setAttributes(parent, attrs);if (sourceCmdName && sourceCmdName == \"customstyle\" && attrs.style) {\n                parent.style.cssText = attrs.style;\n              }domUtils.remove(para, true);para = parent;\n            } else {\n              domUtils.remove(para.parentNode, true);\n            }\n          }if (utils.indexOf(notExchange, parent.tagName) != -1) {\n            current = parent;\n          } else {\n            current = para;\n          }current = domUtils.getNextDomNode(current, false, filterFn);\n        } else {\n          current = domUtils.getNextDomNode(current, true, filterFn);\n        }\n      }return range.moveToBookmark(bookmark2).moveToBookmark(bookmark);\n    };me.setOpt(\"paragraph\", { p: \"\", h1: \"\", h2: \"\", h3: \"\", h4: \"\", h5: \"\", h6: \"\" });me.commands[\"paragraph\"] = { execCommand: function execCommand(cmdName, style, attrs, sourceCmdName) {\n        var range = this.selection.getRange();if (range.collapsed) {\n          var txt = this.document.createTextNode(\"p\");range.insertNode(txt);if (browser.ie) {\n            var node = txt.previousSibling;if (node && domUtils.isWhitespace(node)) {\n              domUtils.remove(node);\n            }node = txt.nextSibling;if (node && domUtils.isWhitespace(node)) {\n              domUtils.remove(node);\n            }\n          }\n        }range = doParagraph(range, style, attrs, sourceCmdName);if (txt) {\n          range.setStartBefore(txt).collapse(true);pN = txt.parentNode;domUtils.remove(txt);if (domUtils.isBlockElm(pN) && domUtils.isEmptyNode(pN)) {\n            domUtils.fillNode(this.document, pN);\n          }\n        }if (browser.gecko && range.collapsed && range.startContainer.nodeType == 1) {\n          var child = range.startContainer.childNodes[range.startOffset];if (child && child.nodeType == 1 && child.tagName.toLowerCase() == style) {\n            range.setStart(child, 0).collapse(true);\n          }\n        }range.select();return true;\n      }, queryCommandValue: function queryCommandValue() {\n        var node = domUtils.filterNodeList(this.selection.getStartElementPath(), \"p h1 h2 h3 h4 h5 h6\");return node ? node.tagName.toLowerCase() : \"\";\n      } };\n  };UE.commands[\"time\"] = UE.commands[\"date\"] = { execCommand: function execCommand(cmd, format) {\n      var date = new Date();function formatTime(date, format) {\n        var hh = (\"0\" + date.getHours()).slice(-2),\n            ii = (\"0\" + date.getMinutes()).slice(-2),\n            ss = (\"0\" + date.getSeconds()).slice(-2);format = format || \"hh:ii:ss\";return format.replace(/hh/gi, hh).replace(/ii/gi, ii).replace(/ss/gi, ss);\n      }function formatDate(date, format) {\n        var yyyy = (\"000\" + date.getFullYear()).slice(-4),\n            yy = yyyy.slice(-2),\n            mm = (\"0\" + (date.getMonth() + 1)).slice(-2),\n            dd = (\"0\" + date.getDate()).slice(-2);format = format || \"yyyy-mm-dd\";return format.replace(/yyyy/gi, yyyy).replace(/yy/gi, yy).replace(/mm/gi, mm).replace(/dd/gi, dd);\n      }this.execCommand(\"insertHtml\", cmd == \"time\" ? formatTime(date, format) : formatDate(date, format));\n    } };UE.plugins[\"rowspacing\"] = function () {\n    var me = this;me.setOpt({ rowspacingtop: [\"5\", \"10\", \"15\", \"20\", \"25\"], rowspacingbottom: [\"5\", \"10\", \"15\", \"20\", \"25\"] });me.commands[\"rowspacing\"] = { execCommand: function execCommand(cmdName, value, dir) {\n        this.execCommand(\"paragraph\", \"p\", { style: \"margin-\" + dir + \":\" + value + \"px\" });return true;\n      }, queryCommandValue: function queryCommandValue(cmdName, dir) {\n        var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), function (node) {\n          return domUtils.isBlockElm(node);\n        }),\n            value;if (pN) {\n          value = domUtils.getComputedStyle(pN, \"margin-\" + dir).replace(/[^\\d]/g, \"\");return !value ? 0 : value;\n        }return 0;\n      } };\n  };UE.plugins[\"lineheight\"] = function () {\n    var me = this;me.setOpt({ lineheight: [\"1\", \"1.5\", \"1.75\", \"2\", \"3\", \"4\", \"5\"] });me.commands[\"lineheight\"] = { execCommand: function execCommand(cmdName, value) {\n        this.execCommand(\"paragraph\", \"p\", { style: \"line-height:\" + (value == \"1\" ? \"normal\" : value + \"em\") });return true;\n      }, queryCommandValue: function queryCommandValue() {\n        var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), function (node) {\n          return domUtils.isBlockElm(node);\n        });if (pN) {\n          var value = domUtils.getComputedStyle(pN, \"line-height\");return value == \"normal\" ? 1 : value.replace(/[^\\d.]*/gi, \"\");\n        }\n      } };\n  };UE.plugins[\"pagebreak\"] = function () {\n    var me = this,\n        notBreakTags = [\"td\"];me.setOpt(\"pageBreakTag\", \"_ueditor_page_break_tag_\");function fillNode(node) {\n      if (domUtils.isEmptyBlock(node)) {\n        var firstChild = node.firstChild,\n            tmpNode;while (firstChild && firstChild.nodeType == 1 && domUtils.isEmptyBlock(firstChild)) {\n          tmpNode = firstChild;firstChild = firstChild.firstChild;\n        }!tmpNode && (tmpNode = node);domUtils.fillNode(me.document, tmpNode);\n      }\n    }me.ready(function () {\n      utils.cssRule(\"pagebreak\", \".pagebreak{display:block;clear:both !important;cursor:default !important;width: 100% !important;margin:0;}\", me.document);\n    });function isHr(node) {\n      return node && node.nodeType == 1 && node.tagName == \"HR\" && node.className == \"pagebreak\";\n    }me.addInputRule(function (root) {\n      root.traversal(function (node) {\n        if (node.type == \"text\" && node.data == me.options.pageBreakTag) {\n          var hr = UE.uNode.createElement('<hr class=\"pagebreak\" noshade=\"noshade\" size=\"5\" style=\"-webkit-user-select: none;\">');node.parentNode.insertBefore(hr, node);node.parentNode.removeChild(node);\n        }\n      });\n    });me.addOutputRule(function (node) {\n      utils.each(node.getNodesByTagName(\"hr\"), function (n) {\n        if (n.getAttr(\"class\") == \"pagebreak\") {\n          var txt = UE.uNode.createText(me.options.pageBreakTag);n.parentNode.insertBefore(txt, n);n.parentNode.removeChild(n);\n        }\n      });\n    });me.commands[\"pagebreak\"] = { execCommand: function execCommand() {\n        var range = me.selection.getRange(),\n            hr = me.document.createElement(\"hr\");domUtils.setAttributes(hr, { \"class\": \"pagebreak\", noshade: \"noshade\", size: \"5\" });domUtils.unSelectable(hr);var node = domUtils.findParentByTagName(range.startContainer, notBreakTags, true),\n            parents = [],\n            pN;if (node) {\n          switch (node.tagName) {case \"TD\":\n              pN = node.parentNode;if (!pN.previousSibling) {\n                var table = domUtils.findParentByTagName(pN, \"table\");table.parentNode.insertBefore(hr, table);parents = domUtils.findParents(hr, true);\n              } else {\n                pN.parentNode.insertBefore(hr, pN);parents = domUtils.findParents(hr);\n              }pN = parents[1];if (hr !== pN) {\n                domUtils.breakParent(hr, pN);\n              }me.fireEvent(\"afteradjusttable\", me.document);}\n        } else {\n          if (!range.collapsed) {\n            range.deleteContents();var start = range.startContainer;while (!domUtils.isBody(start) && domUtils.isBlockElm(start) && domUtils.isEmptyNode(start)) {\n              range.setStartBefore(start).collapse(true);domUtils.remove(start);start = range.startContainer;\n            }\n          }range.insertNode(hr);var pN = hr.parentNode,\n              nextNode;while (!domUtils.isBody(pN)) {\n            domUtils.breakParent(hr, pN);nextNode = hr.nextSibling;if (nextNode && domUtils.isEmptyBlock(nextNode)) {\n              domUtils.remove(nextNode);\n            }pN = hr.parentNode;\n          }nextNode = hr.nextSibling;var pre = hr.previousSibling;if (isHr(pre)) {\n            domUtils.remove(pre);\n          } else {\n            pre && fillNode(pre);\n          }if (!nextNode) {\n            var p = me.document.createElement(\"p\");hr.parentNode.appendChild(p);domUtils.fillNode(me.document, p);range.setStart(p, 0).collapse(true);\n          } else {\n            if (isHr(nextNode)) {\n              domUtils.remove(nextNode);\n            } else {\n              fillNode(nextNode);\n            }range.setEndAfter(hr).collapse(false);\n          }range.select(true);\n        }\n      } };\n  };UE.plugins[\"dragdrop\"] = function () {\n    var me = this;me.ready(function () {\n      domUtils.on(this.body, \"dragend\", function () {\n        var rng = me.selection.getRange();var node = rng.getClosedNode() || me.selection.getStart();if (node && node.tagName == \"IMG\") {\n          var pre = node.previousSibling,\n              next;while (next = node.nextSibling) {\n            if (next.nodeType == 1 && next.tagName == \"SPAN\" && !next.firstChild) {\n              domUtils.remove(next);\n            } else {\n              break;\n            }\n          }if ((pre && pre.nodeType == 1 && !domUtils.isEmptyBlock(pre) || !pre) && (!next || next && !domUtils.isEmptyBlock(next))) {\n            if (pre && pre.tagName == \"P\" && !domUtils.isEmptyBlock(pre)) {\n              pre.appendChild(node);domUtils.moveChild(next, pre);domUtils.remove(next);\n            } else if (next && next.tagName == \"P\" && !domUtils.isEmptyBlock(next)) {\n              next.insertBefore(node, next.firstChild);\n            }if (pre && pre.tagName == \"P\" && domUtils.isEmptyBlock(pre)) {\n              domUtils.remove(pre);\n            }if (next && next.tagName == \"P\" && domUtils.isEmptyBlock(next)) {\n              domUtils.remove(next);\n            }rng.selectNode(node).select();me.fireEvent(\"saveScene\");\n          }\n        }\n      });\n    });me.addListener(\"keyup\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which;if (keyCode == 13) {\n        var rng = me.selection.getRange(),\n            node;if (node = domUtils.findParentByTagName(rng.startContainer, \"p\", true)) {\n          if (domUtils.getComputedStyle(node, \"text-align\") == \"center\") {\n            domUtils.removeStyle(node, \"text-align\");\n          }\n        }\n      }\n    });\n  };UE.plugins[\"undo\"] = function () {\n    var saveSceneTimer;var me = this,\n        maxUndoCount = me.options.maxUndoCount || 20,\n        maxInputCount = me.options.maxInputCount || 20,\n        fillchar = new RegExp(domUtils.fillChar + \"|</hr>\", \"gi\");var noNeedFillCharTags = { ol: 1, ul: 1, table: 1, tbody: 1, tr: 1, body: 1 };var orgState = me.options.autoClearEmptyNode;function compareAddr(indexA, indexB) {\n      if (indexA.length != indexB.length) return 0;for (var i = 0, l = indexA.length; i < l; i++) {\n        if (indexA[i] != indexB[i]) return 0;\n      }return 1;\n    }function compareRangeAddress(rngAddrA, rngAddrB) {\n      if (rngAddrA.collapsed != rngAddrB.collapsed) {\n        return 0;\n      }if (!compareAddr(rngAddrA.startAddress, rngAddrB.startAddress) || !compareAddr(rngAddrA.endAddress, rngAddrB.endAddress)) {\n        return 0;\n      }return 1;\n    }function UndoManager() {\n      this.list = [];this.index = 0;this.hasUndo = false;this.hasRedo = false;this.undo = function () {\n        if (this.hasUndo) {\n          if (!this.list[this.index - 1] && this.list.length == 1) {\n            this.reset();return;\n          }while (this.list[this.index].content == this.list[this.index - 1].content) {\n            this.index--;if (this.index == 0) {\n              return this.restore(0);\n            }\n          }this.restore(--this.index);\n        }\n      };this.redo = function () {\n        if (this.hasRedo) {\n          while (this.list[this.index].content == this.list[this.index + 1].content) {\n            this.index++;if (this.index == this.list.length - 1) {\n              return this.restore(this.index);\n            }\n          }this.restore(++this.index);\n        }\n      };this.restore = function () {\n        var me = this.editor;var scene = this.list[this.index];var root = UE.htmlparser(scene.content.replace(fillchar, \"\"));me.options.autoClearEmptyNode = false;me.filterInputRule(root);me.options.autoClearEmptyNode = orgState;me.document.body.innerHTML = root.toHtml();me.fireEvent(\"afterscencerestore\");if (browser.ie) {\n          utils.each(domUtils.getElementsByTagName(me.document, \"td th caption p\"), function (node) {\n            if (domUtils.isEmptyNode(node)) {\n              domUtils.fillNode(me.document, node);\n            }\n          });\n        }try {\n          var rng = new dom.Range(me.document).moveToAddress(scene.address);rng.select(noNeedFillCharTags[rng.startContainer.nodeName.toLowerCase()]);\n        } catch (e) {}this.update();this.clearKey();me.fireEvent(\"reset\", true);\n      };this.getScene = function () {\n        var me = this.editor;var rng = me.selection.getRange(),\n            rngAddress = rng.createAddress(false, true);me.fireEvent(\"beforegetscene\");var root = UE.htmlparser(me.body.innerHTML);me.options.autoClearEmptyNode = false;me.filterOutputRule(root);me.options.autoClearEmptyNode = orgState;var cont = root.toHtml();me.fireEvent(\"aftergetscene\");return { address: rngAddress, content: cont };\n      };this.save = function (notCompareRange, notSetCursor) {\n        clearTimeout(saveSceneTimer);var currentScene = this.getScene(notSetCursor),\n            lastScene = this.list[this.index];if (lastScene && lastScene.content != currentScene.content) {\n          me.trigger(\"contentchange\");\n        }if (lastScene && lastScene.content == currentScene.content && (notCompareRange ? 1 : compareRangeAddress(lastScene.address, currentScene.address))) {\n          return;\n        }this.list = this.list.slice(0, this.index + 1);this.list.push(currentScene);if (this.list.length > maxUndoCount) {\n          this.list.shift();\n        }this.index = this.list.length - 1;this.clearKey();this.update();\n      };this.update = function () {\n        this.hasRedo = !!this.list[this.index + 1];this.hasUndo = !!this.list[this.index - 1];\n      };this.reset = function () {\n        this.list = [];this.index = 0;this.hasUndo = false;this.hasRedo = false;this.clearKey();\n      };this.clearKey = function () {\n        keycont = 0;lastKeyCode = null;\n      };\n    }me.undoManger = new UndoManager();me.undoManger.editor = me;function saveScene() {\n      this.undoManger.save();\n    }me.addListener(\"saveScene\", function () {\n      var args = Array.prototype.splice.call(arguments, 1);this.undoManger.save.apply(this.undoManger, args);\n    });me.addListener(\"reset\", function (type, exclude) {\n      if (!exclude) {\n        this.undoManger.reset();\n      }\n    });me.commands[\"redo\"] = me.commands[\"undo\"] = { execCommand: function execCommand(cmdName) {\n        this.undoManger[cmdName]();\n      }, queryCommandState: function queryCommandState(cmdName) {\n        return this.undoManger[\"has\" + (cmdName.toLowerCase() == \"undo\" ? \"Undo\" : \"Redo\")] ? 0 : -1;\n      }, notNeedUndo: 1 };var keys = { 16: 1, 17: 1, 18: 1, 37: 1, 38: 1, 39: 1, 40: 1 },\n        keycont = 0,\n        lastKeyCode;var inputType = false;me.addListener(\"ready\", function () {\n      domUtils.on(this.body, \"compositionstart\", function () {\n        inputType = true;\n      });domUtils.on(this.body, \"compositionend\", function () {\n        inputType = false;\n      });\n    });me.addshortcutkey({ Undo: \"ctrl+90\", Redo: \"ctrl+89\" });var isCollapsed = true;me.addListener(\"keydown\", function (type, evt) {\n      var me = this;var keyCode = evt.keyCode || evt.which;if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {\n        var _ret2 = function () {\n          var save = function save(cont) {\n            cont.undoManger.save(false, true);cont.fireEvent(\"selectionchange\");\n          };\n\n          if (inputType) return {\n              v: void 0\n            };if (!me.selection.getRange().collapsed) {\n            me.undoManger.save(false, true);isCollapsed = false;return {\n              v: void 0\n            };\n          }if (me.undoManger.list.length == 0) {\n            me.undoManger.save(true);\n          }clearTimeout(saveSceneTimer);saveSceneTimer = setTimeout(function () {\n            if (inputType) {\n              var interalTimer = setInterval(function () {\n                if (!inputType) {\n                  save(me);clearInterval(interalTimer);\n                }\n              }, 300);return;\n            }save(me);\n          }, 200);lastKeyCode = keyCode;keycont++;if (keycont >= maxInputCount) {\n            save(me);\n          }\n        }();\n\n        if ((typeof _ret2 === \"undefined\" ? \"undefined\" : _typeof(_ret2)) === \"object\") return _ret2.v;\n      }\n    });me.addListener(\"keyup\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which;if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {\n        if (inputType) return;if (!isCollapsed) {\n          this.undoManger.save(false, true);isCollapsed = true;\n        }\n      }\n    });me.stopCmdUndo = function () {\n      me.__hasEnterExecCommand = true;\n    };me.startCmdUndo = function () {\n      me.__hasEnterExecCommand = false;\n    };\n  };UE.plugins[\"paste\"] = function () {\n    function getClipboardData(callback) {\n      var doc = this.document;if (doc.getElementById(\"baidu_pastebin\")) {\n        return;\n      }var range = this.selection.getRange(),\n          bk = range.createBookmark(),\n          pastebin = doc.createElement(\"div\");pastebin.id = \"baidu_pastebin\";browser.webkit && pastebin.appendChild(doc.createTextNode(domUtils.fillChar + domUtils.fillChar));doc.body.appendChild(pastebin);bk.start.style.display = \"\";pastebin.style.cssText = \"position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:\" + domUtils.getXY(bk.start).y + \"px\";range.selectNodeContents(pastebin).select(true);setTimeout(function () {\n        if (browser.webkit) {\n          for (var i = 0, pastebins = doc.querySelectorAll(\"#baidu_pastebin\"), pi; pi = pastebins[i++];) {\n            if (domUtils.isEmptyNode(pi)) {\n              domUtils.remove(pi);\n            } else {\n              pastebin = pi;break;\n            }\n          }\n        }try {\n          pastebin.parentNode.removeChild(pastebin);\n        } catch (e) {}range.moveToBookmark(bk).select(true);callback(pastebin);\n      }, 0);\n    }var me = this;me.setOpt({ retainOnlyLabelPasted: false });var txtContent, htmlContent, address;function getPureHtml(html) {\n      return html.replace(/<(\\/?)([\\w\\-]+)([^>]*)>/gi, function (a, b, tagName, attrs) {\n        tagName = tagName.toLowerCase();if ({ img: 1 }[tagName]) {\n          return a;\n        }attrs = attrs.replace(/([\\w\\-]*?)\\s*=\\s*((\"([^\"]*)\")|('([^']*)')|([^\\s>]+))/gi, function (str, atr, val) {\n          if ({ src: 1, href: 1, name: 1 }[atr.toLowerCase()]) {\n            return atr + \"=\" + val + \" \";\n          }return \"\";\n        });if ({ span: 1, div: 1 }[tagName]) {\n          return \"\";\n        } else {\n          return \"<\" + b + tagName + \" \" + utils.trim(attrs) + \">\";\n        }\n      });\n    }function filter(div) {\n      var html;if (div.firstChild) {\n        var nodes = domUtils.getElementsByTagName(div, \"span\");for (var i = 0, ni; ni = nodes[i++];) {\n          if (ni.id == \"_baidu_cut_start\" || ni.id == \"_baidu_cut_end\") {\n            domUtils.remove(ni);\n          }\n        }if (browser.webkit) {\n          var brs = div.querySelectorAll(\"div br\");for (var i = 0, bi; bi = brs[i++];) {\n            var pN = bi.parentNode;if (pN.tagName == \"DIV\" && pN.childNodes.length == 1) {\n              pN.innerHTML = \"<p><br/></p>\";domUtils.remove(pN);\n            }\n          }var divs = div.querySelectorAll(\"#baidu_pastebin\");for (var i = 0, di; di = divs[i++];) {\n            var tmpP = me.document.createElement(\"p\");di.parentNode.insertBefore(tmpP, di);while (di.firstChild) {\n              tmpP.appendChild(di.firstChild);\n            }domUtils.remove(di);\n          }var metas = div.querySelectorAll(\"meta\");for (var i = 0, ci; ci = metas[i++];) {\n            domUtils.remove(ci);\n          }var brs = div.querySelectorAll(\"br\");for (i = 0; ci = brs[i++];) {\n            if (/^apple-/i.test(ci.className)) {\n              domUtils.remove(ci);\n            }\n          }\n        }if (browser.gecko) {\n          var dirtyNodes = div.querySelectorAll(\"[_moz_dirty]\");for (i = 0; ci = dirtyNodes[i++];) {\n            ci.removeAttribute(\"_moz_dirty\");\n          }\n        }if (!browser.ie) {\n          var spans = div.querySelectorAll(\"span.Apple-style-span\");for (var i = 0, ci; ci = spans[i++];) {\n            domUtils.remove(ci, true);\n          }\n        }html = div.innerHTML;html = UE.filterWord(html);var root = UE.htmlparser(html);if (me.options.filterRules) {\n          UE.filterNode(root, me.options.filterRules);\n        }me.filterInputRule(root);if (browser.webkit) {\n          var br = root.lastChild();if (br && br.type == \"element\" && br.tagName == \"br\") {\n            root.removeChild(br);\n          }utils.each(me.body.querySelectorAll(\"div\"), function (node) {\n            if (domUtils.isEmptyBlock(node)) {\n              domUtils.remove(node, true);\n            }\n          });\n        }html = { html: root.toHtml() };me.fireEvent(\"beforepaste\", html, root);if (!html.html) {\n          return;\n        }root = UE.htmlparser(html.html, true);if (me.queryCommandState(\"pasteplain\") === 1) {\n          me.execCommand(\"insertHtml\", UE.filterNode(root, me.options.filterTxtRules).toHtml(), true);\n        } else {\n          UE.filterNode(root, me.options.filterTxtRules);txtContent = root.toHtml();htmlContent = html.html;address = me.selection.getRange().createAddress(true);me.execCommand(\"insertHtml\", me.getOpt(\"retainOnlyLabelPasted\") === true ? getPureHtml(htmlContent) : htmlContent, true);\n        }me.fireEvent(\"afterpaste\", html);\n      }\n    }me.addListener(\"pasteTransfer\", function (cmd, plainType) {\n      if (address && txtContent && htmlContent && txtContent != htmlContent) {\n        var range = me.selection.getRange();range.moveToAddress(address, true);if (!range.collapsed) {\n          while (!domUtils.isBody(range.startContainer)) {\n            var start = range.startContainer;if (start.nodeType == 1) {\n              start = start.childNodes[range.startOffset];if (!start) {\n                range.setStartBefore(range.startContainer);continue;\n              }var pre = start.previousSibling;if (pre && pre.nodeType == 3 && new RegExp(\"^[\\n\\r\t \" + domUtils.fillChar + \"]*$\").test(pre.nodeValue)) {\n                range.setStartBefore(pre);\n              }\n            }if (range.startOffset == 0) {\n              range.setStartBefore(range.startContainer);\n            } else {\n              break;\n            }\n          }while (!domUtils.isBody(range.endContainer)) {\n            var end = range.endContainer;if (end.nodeType == 1) {\n              end = end.childNodes[range.endOffset];if (!end) {\n                range.setEndAfter(range.endContainer);continue;\n              }var next = end.nextSibling;if (next && next.nodeType == 3 && new RegExp(\"^[\\n\\r\t\" + domUtils.fillChar + \"]*$\").test(next.nodeValue)) {\n                range.setEndAfter(next);\n              }\n            }if (range.endOffset == range.endContainer[range.endContainer.nodeType == 3 ? \"nodeValue\" : \"childNodes\"].length) {\n              range.setEndAfter(range.endContainer);\n            } else {\n              break;\n            }\n          }\n        }range.deleteContents();range.select(true);me.__hasEnterExecCommand = true;var html = htmlContent;if (plainType === 2) {\n          html = getPureHtml(html);\n        } else if (plainType) {\n          html = txtContent;\n        }me.execCommand(\"inserthtml\", html, true);me.__hasEnterExecCommand = false;var rng = me.selection.getRange();while (!domUtils.isBody(rng.startContainer) && !rng.startOffset && rng.startContainer[rng.startContainer.nodeType == 3 ? \"nodeValue\" : \"childNodes\"].length) {\n          rng.setStartBefore(rng.startContainer);\n        }var tmpAddress = rng.createAddress(true);address.endAddress = tmpAddress.startAddress;\n      }\n    });me.addListener(\"ready\", function () {\n      domUtils.on(me.body, \"cut\", function () {\n        var range = me.selection.getRange();if (!range.collapsed && me.undoManger) {\n          me.undoManger.save();\n        }\n      });domUtils.on(me.body, browser.ie || browser.opera ? \"keydown\" : \"paste\", function (e) {\n        if ((browser.ie || browser.opera) && (!e.ctrlKey && !e.metaKey || e.keyCode != \"86\")) {\n          return;\n        }getClipboardData.call(me, function (div) {\n          filter(div);\n        });\n      });\n    });me.commands[\"paste\"] = { execCommand: function execCommand(cmd) {\n        if (browser.ie) {\n          getClipboardData.call(me, function (div) {\n            filter(div);\n          });me.document.execCommand(\"paste\");\n        } else {\n          alert(me.getLang(\"pastemsg\"));\n        }\n      } };\n  };UE.plugins[\"pasteplain\"] = function () {\n    var me = this;me.setOpt({ pasteplain: false, filterTxtRules: function () {\n        function transP(node) {\n          node.tagName = \"p\";node.setStyle();\n        }function removeNode(node) {\n          node.parentNode.removeChild(node, true);\n        }return { \"-\": \"script style object iframe embed input select\", p: { $: {} }, br: { $: {} }, div: function div(node) {\n            var tmpNode,\n                p = UE.uNode.createElement(\"p\");while (tmpNode = node.firstChild()) {\n              if (tmpNode.type == \"text\" || !UE.dom.dtd.$block[tmpNode.tagName]) {\n                p.appendChild(tmpNode);\n              } else {\n                if (p.firstChild()) {\n                  node.parentNode.insertBefore(p, node);p = UE.uNode.createElement(\"p\");\n                } else {\n                  node.parentNode.insertBefore(tmpNode, node);\n                }\n              }\n            }if (p.firstChild()) {\n              node.parentNode.insertBefore(p, node);\n            }node.parentNode.removeChild(node);\n          }, ol: removeNode, ul: removeNode, dl: removeNode, dt: removeNode, dd: removeNode, li: removeNode, caption: transP, th: transP, tr: transP, h1: transP, h2: transP, h3: transP, h4: transP, h5: transP, h6: transP, td: function td(node) {\n            var txt = !!node.innerText();if (txt) {\n              node.parentNode.insertAfter(UE.uNode.createText(\" &nbsp; &nbsp;\"), node);\n            }node.parentNode.removeChild(node, node.innerText());\n          } };\n      }() });var pasteplain = me.options.pasteplain;me.commands[\"pasteplain\"] = { queryCommandState: function queryCommandState() {\n        return pasteplain ? 1 : 0;\n      }, execCommand: function execCommand() {\n        pasteplain = !pasteplain | 0;\n      }, notNeedUndo: 1 };\n  };UE.plugins[\"list\"] = function () {\n    var me = this,\n        notExchange = { TD: 1, PRE: 1, BLOCKQUOTE: 1 };var customStyle = { cn: \"cn-1-\", cn1: \"cn-2-\", cn2: \"cn-3-\", num: \"num-1-\", num1: \"num-2-\", num2: \"num-3-\", dash: \"dash\", dot: \"dot\" };me.setOpt({ autoTransWordToList: false, insertorderedlist: { num: \"\", num1: \"\", num2: \"\", cn: \"\", cn1: \"\", cn2: \"\", decimal: \"\", \"lower-alpha\": \"\", \"lower-roman\": \"\", \"upper-alpha\": \"\", \"upper-roman\": \"\" }, insertunorderedlist: { circle: \"\", disc: \"\", square: \"\", dash: \"\", dot: \"\" }, listDefaultPaddingLeft: \"30\", listiconpath: \"http://bs.baidu.com/listicon/\", maxListLevel: -1, disablePInList: false });function listToArray(list) {\n      var arr = [];for (var p in list) {\n        arr.push(p);\n      }return arr;\n    }var listStyle = { OL: listToArray(me.options.insertorderedlist), UL: listToArray(me.options.insertunorderedlist) };var liiconpath = me.options.listiconpath;for (var s in customStyle) {\n      if (!me.options.insertorderedlist.hasOwnProperty(s) && !me.options.insertunorderedlist.hasOwnProperty(s)) {\n        delete customStyle[s];\n      }\n    }me.ready(function () {\n      var customCss = [];for (var p in customStyle) {\n        if (p == \"dash\" || p == \"dot\") {\n          customCss.push(\"li.list-\" + customStyle[p] + \"{background-image:url(\" + liiconpath + customStyle[p] + \".gif)}\");customCss.push(\"ul.custom_\" + p + \"{list-style:none;}ul.custom_\" + p + \" li{background-position:0 3px;background-repeat:no-repeat}\");\n        } else {\n          for (var i = 0; i < 99; i++) {\n            customCss.push(\"li.list-\" + customStyle[p] + i + \"{background-image:url(\" + liiconpath + \"list-\" + customStyle[p] + i + \".gif)}\");\n          }customCss.push(\"ol.custom_\" + p + \"{list-style:none;}ol.custom_\" + p + \" li{background-position:0 3px;background-repeat:no-repeat}\");\n        }switch (p) {case \"cn\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft-1{padding-left:25px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-2{padding-left:40px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-3{padding-left:55px}\");break;case \"cn1\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft-1{padding-left:30px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-2{padding-left:40px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-3{padding-left:55px}\");break;case \"cn2\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft-1{padding-left:40px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-2{padding-left:55px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-3{padding-left:68px}\");break;case \"num\":case \"num1\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft-1{padding-left:25px}\");break;case \"num2\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft-1{padding-left:35px}\");customCss.push(\"li.list-\" + p + \"-paddingleft-2{padding-left:40px}\");break;case \"dash\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft{padding-left:35px}\");break;case \"dot\":\n            customCss.push(\"li.list-\" + p + \"-paddingleft{padding-left:20px}\");}\n      }customCss.push(\".list-paddingleft-1{padding-left:0}\");customCss.push(\".list-paddingleft-2{padding-left:\" + me.options.listDefaultPaddingLeft + \"px}\");customCss.push(\".list-paddingleft-3{padding-left:\" + me.options.listDefaultPaddingLeft * 2 + \"px}\");utils.cssRule(\"list\", \"ol,ul{margin:0;pading:0;\" + (browser.ie ? \"\" : \"width:95%\") + \"}li{clear:both;}\" + customCss.join(\"\\n\"), me.document);\n    });me.ready(function () {\n      domUtils.on(me.body, \"cut\", function () {\n        setTimeout(function () {\n          var rng = me.selection.getRange(),\n              li;if (!rng.collapsed) {\n            if (li = domUtils.findParentByTagName(rng.startContainer, \"li\", true)) {\n              if (!li.nextSibling && domUtils.isEmptyBlock(li)) {\n                var pn = li.parentNode,\n                    node;if (node = pn.previousSibling) {\n                  domUtils.remove(pn);rng.setStartAtLast(node).collapse(true);rng.select(true);\n                } else if (node = pn.nextSibling) {\n                  domUtils.remove(pn);rng.setStartAtFirst(node).collapse(true);rng.select(true);\n                } else {\n                  var tmpNode = me.document.createElement(\"p\");domUtils.fillNode(me.document, tmpNode);pn.parentNode.insertBefore(tmpNode, pn);domUtils.remove(pn);rng.setStart(tmpNode, 0).collapse(true);rng.select(true);\n                }\n              }\n            }\n          }\n        });\n      });\n    });function getStyle(node) {\n      var cls = node.className;if (domUtils.hasClass(node, /custom_/)) {\n        return cls.match(/custom_(\\w+)/)[1];\n      }return domUtils.getStyle(node, \"list-style-type\");\n    }me.addListener(\"beforepaste\", function (type, html) {\n      var me = this,\n          rng = me.selection.getRange(),\n          li;var root = UE.htmlparser(html.html, true);if (li = domUtils.findParentByTagName(rng.startContainer, \"li\", true)) {\n        var list = li.parentNode,\n            tagName = list.tagName == \"OL\" ? \"ul\" : \"ol\";utils.each(root.getNodesByTagName(tagName), function (n) {\n          n.tagName = list.tagName;n.setAttr();if (n.parentNode === root) {\n            type = getStyle(list) || (list.tagName == \"OL\" ? \"decimal\" : \"disc\");\n          } else {\n            var className = n.parentNode.getAttr(\"class\");if (className && /custom_/.test(className)) {\n              type = className.match(/custom_(\\w+)/)[1];\n            } else {\n              type = n.parentNode.getStyle(\"list-style-type\");\n            }if (!type) {\n              type = list.tagName == \"OL\" ? \"decimal\" : \"disc\";\n            }\n          }var index = utils.indexOf(listStyle[list.tagName], type);if (n.parentNode !== root) index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;var currentStyle = listStyle[list.tagName][index];\n          if (customStyle[currentStyle]) {\n            n.setAttr(\"class\", \"custom_\" + currentStyle);\n          } else {\n            n.setStyle(\"list-style-type\", currentStyle);\n          }\n        });\n      }html.html = root.toHtml();\n    });me.getOpt(\"disablePInList\") === true && me.addOutputRule(function (root) {\n      utils.each(root.getNodesByTagName(\"li\"), function (li) {\n        var newChildrens = [],\n            index = 0;utils.each(li.children, function (n) {\n          if (n.tagName == \"p\") {\n            var tmpNode;while (tmpNode = n.children.pop()) {\n              newChildrens.splice(index, 0, tmpNode);tmpNode.parentNode = li;lastNode = tmpNode;\n            }tmpNode = newChildrens[newChildrens.length - 1];if (!tmpNode || tmpNode.type != \"element\" || tmpNode.tagName != \"br\") {\n              var br = UE.uNode.createElement(\"br\");br.parentNode = li;newChildrens.push(br);\n            }index = newChildrens.length;\n          }\n        });if (newChildrens.length) {\n          li.children = newChildrens;\n        }\n      });\n    });me.addInputRule(function (root) {\n      utils.each(root.getNodesByTagName(\"li\"), function (li) {\n        var tmpP = UE.uNode.createElement(\"p\");for (var i = 0, ci; ci = li.children[i];) {\n          if (ci.type == \"text\" || dtd.p[ci.tagName]) {\n            tmpP.appendChild(ci);\n          } else {\n            if (tmpP.firstChild()) {\n              li.insertBefore(tmpP, ci);tmpP = UE.uNode.createElement(\"p\");i = i + 2;\n            } else {\n              i++;\n            }\n          }\n        }if (tmpP.firstChild() && !tmpP.parentNode || !li.firstChild()) {\n          li.appendChild(tmpP);\n        }if (!tmpP.firstChild()) {\n          tmpP.innerHTML(browser.ie ? \"&nbsp;\" : \"<br/>\");\n        }var p = li.firstChild();var lastChild = p.lastChild();if (lastChild && lastChild.type == \"text\" && /^\\s*$/.test(lastChild.data)) {\n          p.removeChild(lastChild);\n        }\n      });if (me.options.autoTransWordToList) {\n        var orderlisttype, unorderlisttype;\n\n        (function () {\n          var checkListType = function checkListType(content, container) {\n            var span = container.firstChild();if (span && span.type == \"element\" && span.tagName == \"span\" && /Wingdings|Symbol/.test(span.getStyle(\"font-family\"))) {\n              for (var p in unorderlisttype) {\n                if (unorderlisttype[p] == span.data) {\n                  return p;\n                }\n              }return \"disc\";\n            }for (var p in orderlisttype) {\n              if (orderlisttype[p].test(content)) {\n                return p;\n              }\n            }\n          };\n\n          orderlisttype = { num1: /^\\d+\\)/, decimal: /^\\d+\\./, \"lower-alpha\": /^[a-z]+\\)/, \"upper-alpha\": /^[A-Z]+\\./, cn: /^[\\u4E00\\u4E8C\\u4E09\\u56DB\\u516d\\u4e94\\u4e03\\u516b\\u4e5d]+[\\u3001]/, cn2: /^\\([\\u4E00\\u4E8C\\u4E09\\u56DB\\u516d\\u4e94\\u4e03\\u516b\\u4e5d]+\\)/ };\n          unorderlisttype = { square: \"n\" };\n          utils.each(root.getNodesByTagName(\"p\"), function (node) {\n            if (node.getAttr(\"class\") != \"MsoListParagraph\") {\n              return;\n            }node.setStyle(\"margin\", \"\");node.setStyle(\"margin-left\", \"\");node.setAttr(\"class\", \"\");function appendLi(list, p, type) {\n              if (list.tagName == \"ol\") {\n                if (browser.ie) {\n                  var first = p.firstChild();if (first.type == \"element\" && first.tagName == \"span\" && orderlisttype[type].test(first.innerText())) {\n                    p.removeChild(first);\n                  }\n                } else {\n                  p.innerHTML(p.innerHTML().replace(orderlisttype[type], \"\"));\n                }\n              } else {\n                p.removeChild(p.firstChild());\n              }var li = UE.uNode.createElement(\"li\");li.appendChild(p);list.appendChild(li);\n            }var tmp = node,\n                type,\n                cacheNode = node;if (node.parentNode.tagName != \"li\" && (type = checkListType(node.innerText(), node))) {\n              var list = UE.uNode.createElement(me.options.insertorderedlist.hasOwnProperty(type) ? \"ol\" : \"ul\");if (customStyle[type]) {\n                list.setAttr(\"class\", \"custom_\" + type);\n              } else {\n                list.setStyle(\"list-style-type\", type);\n              }while (node && node.parentNode.tagName != \"li\" && checkListType(node.innerText(), node)) {\n                tmp = node.nextSibling();if (!tmp) {\n                  node.parentNode.insertBefore(list, node);\n                }appendLi(list, node, type);node = tmp;\n              }if (!list.parentNode && node && node.parentNode) {\n                node.parentNode.insertBefore(list, node);\n              }\n            }var span = cacheNode.firstChild();if (span && span.type == \"element\" && span.tagName == \"span\" && /^\\s*(&nbsp;)+\\s*$/.test(span.innerText())) {\n              span.parentNode.removeChild(span);\n            }\n          });\n        })();\n      }\n    });me.addListener(\"contentchange\", function () {\n      adjustListStyle(me.document);\n    });function adjustListStyle(doc, ignore) {\n      utils.each(domUtils.getElementsByTagName(doc, \"ol ul\"), function (node) {\n        if (!domUtils.inDoc(node, doc)) return;var parent = node.parentNode;if (parent.tagName == node.tagName) {\n          var nodeStyleType = getStyle(node) || (node.tagName == \"OL\" ? \"decimal\" : \"disc\"),\n              parentStyleType = getStyle(parent) || (parent.tagName == \"OL\" ? \"decimal\" : \"disc\");if (nodeStyleType == parentStyleType) {\n            var styleIndex = utils.indexOf(listStyle[node.tagName], nodeStyleType);styleIndex = styleIndex + 1 == listStyle[node.tagName].length ? 0 : styleIndex + 1;setListStyle(node, listStyle[node.tagName][styleIndex]);\n          }\n        }var index = 0,\n            type = 2;if (domUtils.hasClass(node, /custom_/)) {\n          if (!(/[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent, /custom_/))) {\n            type = 1;\n          }\n        } else {\n          if (/[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent, /custom_/)) {\n            type = 3;\n          }\n        }var style = domUtils.getStyle(node, \"list-style-type\");style && (node.style.cssText = \"list-style-type:\" + style);node.className = utils.trim(node.className.replace(/list-paddingleft-\\w+/, \"\")) + \" list-paddingleft-\" + type;utils.each(domUtils.getElementsByTagName(node, \"li\"), function (li) {\n          li.style.cssText && (li.style.cssText = \"\");if (!li.firstChild) {\n            domUtils.remove(li);return;\n          }if (li.parentNode !== node) {\n            return;\n          }index++;if (domUtils.hasClass(node, /custom_/)) {\n            var paddingLeft = 1,\n                currentStyle = getStyle(node);if (node.tagName == \"OL\") {\n              if (currentStyle) {\n                switch (currentStyle) {case \"cn\":case \"cn1\":case \"cn2\":\n                    if (index > 10 && (index % 10 == 0 || index > 10 && index < 20)) {\n                      paddingLeft = 2;\n                    } else if (index > 20) {\n                      paddingLeft = 3;\n                    }break;case \"num2\":\n                    if (index > 9) {\n                      paddingLeft = 2;\n                    }}\n              }li.className = \"list-\" + customStyle[currentStyle] + index + \" \" + \"list-\" + currentStyle + \"-paddingleft-\" + paddingLeft;\n            } else {\n              li.className = \"list-\" + customStyle[currentStyle] + \" \" + \"list-\" + currentStyle + \"-paddingleft\";\n            }\n          } else {\n            li.className = li.className.replace(/list-[\\w\\-]+/gi, \"\");\n          }var className = li.getAttribute(\"class\");if (className !== null && !className.replace(/\\s/g, \"\")) {\n            domUtils.removeAttributes(li, \"class\");\n          }\n        });!ignore && adjustList(node, node.tagName.toLowerCase(), getStyle(node) || domUtils.getStyle(node, \"list-style-type\"), true);\n      });\n    }function adjustList(list, tag, style, ignoreEmpty) {\n      var nextList = list.nextSibling;if (nextList && nextList.nodeType == 1 && nextList.tagName.toLowerCase() == tag && (getStyle(nextList) || domUtils.getStyle(nextList, \"list-style-type\") || (tag == \"ol\" ? \"decimal\" : \"disc\")) == style) {\n        domUtils.moveChild(nextList, list);if (nextList.childNodes.length == 0) {\n          domUtils.remove(nextList);\n        }\n      }if (nextList && domUtils.isFillChar(nextList)) {\n        domUtils.remove(nextList);\n      }var preList = list.previousSibling;if (preList && preList.nodeType == 1 && preList.tagName.toLowerCase() == tag && (getStyle(preList) || domUtils.getStyle(preList, \"list-style-type\") || (tag == \"ol\" ? \"decimal\" : \"disc\")) == style) {\n        domUtils.moveChild(list, preList);\n      }if (preList && domUtils.isFillChar(preList)) {\n        domUtils.remove(preList);\n      }!ignoreEmpty && domUtils.isEmptyBlock(list) && domUtils.remove(list);if (getStyle(list)) {\n        adjustListStyle(list.ownerDocument, true);\n      }\n    }function setListStyle(list, style) {\n      if (customStyle[style]) {\n        list.className = \"custom_\" + style;\n      }try {\n        domUtils.setStyle(list, \"list-style-type\", style);\n      } catch (e) {}\n    }function clearEmptySibling(node) {\n      var tmpNode = node.previousSibling;if (tmpNode && domUtils.isEmptyBlock(tmpNode)) {\n        domUtils.remove(tmpNode);\n      }tmpNode = node.nextSibling;if (tmpNode && domUtils.isEmptyBlock(tmpNode)) {\n        domUtils.remove(tmpNode);\n      }\n    }me.addListener(\"keydown\", function (type, evt) {\n      function preventAndSave() {\n        evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;me.fireEvent(\"contentchange\");me.undoManger && me.undoManger.save();\n      }function findList(node, filterFn) {\n        while (node && !domUtils.isBody(node)) {\n          if (filterFn(node)) {\n            return null;\n          }if (node.nodeType == 1 && /[ou]l/i.test(node.tagName)) {\n            return node;\n          }node = node.parentNode;\n        }return null;\n      }var keyCode = evt.keyCode || evt.which;if (keyCode == 13 && !evt.shiftKey) {\n        var rng = me.selection.getRange(),\n            parent = domUtils.findParent(rng.startContainer, function (node) {\n          return domUtils.isBlockElm(node);\n        }, true),\n            li = domUtils.findParentByTagName(rng.startContainer, \"li\", true);if (parent && parent.tagName != \"PRE\" && !li) {\n          var html = parent.innerHTML.replace(new RegExp(domUtils.fillChar, \"g\"), \"\");if (/^\\s*1\\s*\\.[^\\d]/.test(html)) {\n            parent.innerHTML = html.replace(/^\\s*1\\s*\\./, \"\");rng.setStartAtLast(parent).collapse(true).select();me.__hasEnterExecCommand = true;me.execCommand(\"insertorderedlist\");me.__hasEnterExecCommand = false;\n          }\n        }var range = me.selection.getRange(),\n            start = findList(range.startContainer, function (node) {\n          return node.tagName == \"TABLE\";\n        }),\n            end = range.collapsed ? start : findList(range.endContainer, function (node) {\n          return node.tagName == \"TABLE\";\n        });if (start && end && start === end) {\n          if (!range.collapsed) {\n            start = domUtils.findParentByTagName(range.startContainer, \"li\", true);end = domUtils.findParentByTagName(range.endContainer, \"li\", true);if (start && end && start === end) {\n              range.deleteContents();li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (li && domUtils.isEmptyBlock(li)) {\n                pre = li.previousSibling;next = li.nextSibling;p = me.document.createElement(\"p\");domUtils.fillNode(me.document, p);parentList = li.parentNode;if (pre && next) {\n                  range.setStart(next, 0).collapse(true).select(true);domUtils.remove(li);\n                } else {\n                  if (!pre && !next || !pre) {\n                    parentList.parentNode.insertBefore(p, parentList);\n                  } else {\n                    li.parentNode.parentNode.insertBefore(p, parentList.nextSibling);\n                  }domUtils.remove(li);if (!parentList.firstChild) {\n                    domUtils.remove(parentList);\n                  }range.setStart(p, 0).setCursor();\n                }preventAndSave();return;\n              }\n            } else {\n              var tmpRange = range.cloneRange(),\n                  bk = tmpRange.collapse(false).createBookmark();range.deleteContents();tmpRange.moveToBookmark(bk);var li = domUtils.findParentByTagName(tmpRange.startContainer, \"li\", true);clearEmptySibling(li);tmpRange.select();preventAndSave();return;\n            }\n          }li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (li) {\n            if (domUtils.isEmptyBlock(li)) {\n              bk = range.createBookmark();var parentList = li.parentNode;if (li !== parentList.lastChild) {\n                domUtils.breakParent(li, parentList);clearEmptySibling(li);\n              } else {\n                parentList.parentNode.insertBefore(li, parentList.nextSibling);if (domUtils.isEmptyNode(parentList)) {\n                  domUtils.remove(parentList);\n                }\n              }if (!dtd.$list[li.parentNode.tagName]) {\n                if (!domUtils.isBlockElm(li.firstChild)) {\n                  p = me.document.createElement(\"p\");li.parentNode.insertBefore(p, li);while (li.firstChild) {\n                    p.appendChild(li.firstChild);\n                  }domUtils.remove(li);\n                } else {\n                  domUtils.remove(li, true);\n                }\n              }range.moveToBookmark(bk).select();\n            } else {\n              var first = li.firstChild;if (!first || !domUtils.isBlockElm(first)) {\n                var p = me.document.createElement(\"p\");!li.firstChild && domUtils.fillNode(me.document, p);while (li.firstChild) {\n                  p.appendChild(li.firstChild);\n                }li.appendChild(p);first = p;\n              }var span = me.document.createElement(\"span\");range.insertNode(span);domUtils.breakParent(span, li);var nextLi = span.nextSibling;first = nextLi.firstChild;if (!first) {\n                p = me.document.createElement(\"p\");domUtils.fillNode(me.document, p);nextLi.appendChild(p);first = p;\n              }if (domUtils.isEmptyNode(first)) {\n                first.innerHTML = \"\";domUtils.fillNode(me.document, first);\n              }range.setStart(first, 0).collapse(true).shrinkBoundary().select();domUtils.remove(span);var pre = nextLi.previousSibling;if (pre && domUtils.isEmptyBlock(pre)) {\n                pre.innerHTML = \"<p></p>\";domUtils.fillNode(me.document, pre.firstChild);\n              }\n            }preventAndSave();\n          }\n        }\n      }if (keyCode == 8) {\n        range = me.selection.getRange();if (range.collapsed && domUtils.isStartInblock(range)) {\n          tmpRange = range.cloneRange().trimBoundary();li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (li && domUtils.isStartInblock(tmpRange)) {\n            start = domUtils.findParentByTagName(range.startContainer, \"p\", true);if (start && start !== li.firstChild) {\n              var parentList = domUtils.findParentByTagName(start, [\"ol\", \"ul\"]);domUtils.breakParent(start, parentList);clearEmptySibling(start);me.fireEvent(\"contentchange\");range.setStart(start, 0).setCursor(false, true);me.fireEvent(\"saveScene\");domUtils.preventDefault(evt);return;\n            }if (li && (pre = li.previousSibling)) {\n              if (keyCode == 46 && li.childNodes.length) {\n                return;\n              }if (dtd.$list[pre.tagName]) {\n                pre = pre.lastChild;\n              }me.undoManger && me.undoManger.save();first = li.firstChild;if (domUtils.isBlockElm(first)) {\n                if (domUtils.isEmptyNode(first)) {\n                  pre.appendChild(first);range.setStart(first, 0).setCursor(false, true);while (li.firstChild) {\n                    pre.appendChild(li.firstChild);\n                  }\n                } else {\n                  span = me.document.createElement(\"span\");range.insertNode(span);if (domUtils.isEmptyBlock(pre)) {\n                    pre.innerHTML = \"\";\n                  }domUtils.moveChild(li, pre);range.setStartBefore(span).collapse(true).select(true);domUtils.remove(span);\n                }\n              } else {\n                if (domUtils.isEmptyNode(li)) {\n                  var p = me.document.createElement(\"p\");pre.appendChild(p);range.setStart(p, 0).setCursor();\n                } else {\n                  range.setEnd(pre, pre.childNodes.length).collapse().select(true);while (li.firstChild) {\n                    pre.appendChild(li.firstChild);\n                  }\n                }\n              }domUtils.remove(li);me.fireEvent(\"contentchange\");me.fireEvent(\"saveScene\");domUtils.preventDefault(evt);return;\n            }if (li && !li.previousSibling) {\n              var parentList = li.parentNode;var bk = range.createBookmark();if (domUtils.isTagNode(parentList.parentNode, \"ol ul\")) {\n                parentList.parentNode.insertBefore(li, parentList);if (domUtils.isEmptyNode(parentList)) {\n                  domUtils.remove(parentList);\n                }\n              } else {\n                while (li.firstChild) {\n                  parentList.parentNode.insertBefore(li.firstChild, parentList);\n                }domUtils.remove(li);if (domUtils.isEmptyNode(parentList)) {\n                  domUtils.remove(parentList);\n                }\n              }range.moveToBookmark(bk).setCursor(false, true);me.fireEvent(\"contentchange\");me.fireEvent(\"saveScene\");domUtils.preventDefault(evt);return;\n            }\n          }\n        }\n      }\n    });me.addListener(\"keyup\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which;if (keyCode == 8) {\n        var rng = me.selection.getRange(),\n            list;if (list = domUtils.findParentByTagName(rng.startContainer, [\"ol\", \"ul\"], true)) {\n          adjustList(list, list.tagName.toLowerCase(), getStyle(list) || domUtils.getComputedStyle(list, \"list-style-type\"), true);\n        }\n      }\n    });me.addListener(\"tabkeydown\", function () {\n      var range = me.selection.getRange();function checkLevel(li) {\n        if (me.options.maxListLevel != -1) {\n          var level = li.parentNode,\n              levelNum = 0;while (/[ou]l/i.test(level.tagName)) {\n            levelNum++;level = level.parentNode;\n          }if (levelNum >= me.options.maxListLevel) {\n            return true;\n          }\n        }\n      }var li = domUtils.findParentByTagName(range.startContainer, \"li\", true);if (li) {\n        var bk;if (range.collapsed) {\n          if (checkLevel(li)) return true;var parentLi = li.parentNode,\n              list = me.document.createElement(parentLi.tagName),\n              index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi) || domUtils.getComputedStyle(parentLi, \"list-style-type\"));index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;var currentStyle = listStyle[list.tagName][index];setListStyle(list, currentStyle);if (domUtils.isStartInblock(range)) {\n            me.fireEvent(\"saveScene\");bk = range.createBookmark();parentLi.insertBefore(list, li);list.appendChild(li);adjustList(list, list.tagName.toLowerCase(), currentStyle);me.fireEvent(\"contentchange\");range.moveToBookmark(bk).select(true);return true;\n          }\n        } else {\n          me.fireEvent(\"saveScene\");bk = range.createBookmark();for (var i = 0, closeList, parents = domUtils.findParents(li), ci; ci = parents[i++];) {\n            if (domUtils.isTagNode(ci, \"ol ul\")) {\n              closeList = ci;break;\n            }\n          }var current = li;if (bk.end) {\n            while (current && !(domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING)) {\n              if (checkLevel(current)) {\n                current = domUtils.getNextDomNode(current, false, null, function (node) {\n                  return node !== closeList;\n                });continue;\n              }var parentLi = current.parentNode,\n                  list = me.document.createElement(parentLi.tagName),\n                  index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi) || domUtils.getComputedStyle(parentLi, \"list-style-type\"));var currentIndex = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;var currentStyle = listStyle[list.tagName][currentIndex];setListStyle(list, currentStyle);parentLi.insertBefore(list, current);while (current && !(domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING)) {\n                li = current.nextSibling;list.appendChild(current);if (!li || domUtils.isTagNode(li, \"ol ul\")) {\n                  if (li) {\n                    while (li = li.firstChild) {\n                      if (li.tagName == \"LI\") {\n                        break;\n                      }\n                    }\n                  } else {\n                    li = domUtils.getNextDomNode(current, false, null, function (node) {\n                      return node !== closeList;\n                    });\n                  }break;\n                }current = li;\n              }adjustList(list, list.tagName.toLowerCase(), currentStyle);current = li;\n            }\n          }me.fireEvent(\"contentchange\");range.moveToBookmark(bk).select();return true;\n        }\n      }\n    });function getLi(start) {\n      while (start && !domUtils.isBody(start)) {\n        if (start.nodeName == \"TABLE\") {\n          return null;\n        }if (start.nodeName == \"LI\") {\n          return start;\n        }start = start.parentNode;\n      }\n    }me.commands[\"insertorderedlist\"] = me.commands[\"insertunorderedlist\"] = { execCommand: function execCommand(command, style) {\n        if (!style) {\n          style = command.toLowerCase() == \"insertorderedlist\" ? \"decimal\" : \"disc\";\n        }var me = this,\n            range = this.selection.getRange(),\n            filterFn = function filterFn(node) {\n          return node.nodeType == 1 ? node.tagName.toLowerCase() != \"br\" : !domUtils.isWhitespace(node);\n        },\n            tag = command.toLowerCase() == \"insertorderedlist\" ? \"ol\" : \"ul\",\n            frag = me.document.createDocumentFragment();range.adjustmentBoundary().shrinkBoundary();var bko = range.createBookmark(true),\n            start = getLi(me.document.getElementById(bko.start)),\n            modifyStart = 0,\n            end = getLi(me.document.getElementById(bko.end)),\n            modifyEnd = 0,\n            startParent,\n            endParent,\n            list,\n            tmp;if (start || end) {\n          start && (startParent = start.parentNode);if (!bko.end) {\n            end = start;\n          }end && (endParent = end.parentNode);if (startParent === endParent) {\n            while (start !== end) {\n              tmp = start;start = start.nextSibling;if (!domUtils.isBlockElm(tmp.firstChild)) {\n                var p = me.document.createElement(\"p\");while (tmp.firstChild) {\n                  p.appendChild(tmp.firstChild);\n                }tmp.appendChild(p);\n              }frag.appendChild(tmp);\n            }tmp = me.document.createElement(\"span\");startParent.insertBefore(tmp, end);if (!domUtils.isBlockElm(end.firstChild)) {\n              p = me.document.createElement(\"p\");while (end.firstChild) {\n                p.appendChild(end.firstChild);\n              }end.appendChild(p);\n            }frag.appendChild(end);domUtils.breakParent(tmp, startParent);if (domUtils.isEmptyNode(tmp.previousSibling)) {\n              domUtils.remove(tmp.previousSibling);\n            }if (domUtils.isEmptyNode(tmp.nextSibling)) {\n              domUtils.remove(tmp.nextSibling);\n            }var nodeStyle = getStyle(startParent) || domUtils.getComputedStyle(startParent, \"list-style-type\") || (command.toLowerCase() == \"insertorderedlist\" ? \"decimal\" : \"disc\");if (startParent.tagName.toLowerCase() == tag && nodeStyle == style) {\n              for (var i = 0, ci, tmpFrag = me.document.createDocumentFragment(); ci = frag.firstChild;) {\n                if (domUtils.isTagNode(ci, \"ol ul\")) {\n                  tmpFrag.appendChild(ci);\n                } else {\n                  while (ci.firstChild) {\n                    tmpFrag.appendChild(ci.firstChild);domUtils.remove(ci);\n                  }\n                }\n              }tmp.parentNode.insertBefore(tmpFrag, tmp);\n            } else {\n              list = me.document.createElement(tag);setListStyle(list, style);list.appendChild(frag);tmp.parentNode.insertBefore(list, tmp);\n            }domUtils.remove(tmp);list && adjustList(list, tag, style);range.moveToBookmark(bko).select();return;\n          }if (start) {\n            while (start) {\n              tmp = start.nextSibling;if (domUtils.isTagNode(start, \"ol ul\")) {\n                frag.appendChild(start);\n              } else {\n                var tmpfrag = me.document.createDocumentFragment(),\n                    hasBlock = 0;while (start.firstChild) {\n                  if (domUtils.isBlockElm(start.firstChild)) {\n                    hasBlock = 1;\n                  }tmpfrag.appendChild(start.firstChild);\n                }if (!hasBlock) {\n                  var tmpP = me.document.createElement(\"p\");tmpP.appendChild(tmpfrag);frag.appendChild(tmpP);\n                } else {\n                  frag.appendChild(tmpfrag);\n                }domUtils.remove(start);\n              }start = tmp;\n            }startParent.parentNode.insertBefore(frag, startParent.nextSibling);if (domUtils.isEmptyNode(startParent)) {\n              range.setStartBefore(startParent);domUtils.remove(startParent);\n            } else {\n              range.setStartAfter(startParent);\n            }modifyStart = 1;\n          }if (end && domUtils.inDoc(endParent, me.document)) {\n            start = endParent.firstChild;while (start && start !== end) {\n              tmp = start.nextSibling;if (domUtils.isTagNode(start, \"ol ul\")) {\n                frag.appendChild(start);\n              } else {\n                tmpfrag = me.document.createDocumentFragment();hasBlock = 0;while (start.firstChild) {\n                  if (domUtils.isBlockElm(start.firstChild)) {\n                    hasBlock = 1;\n                  }tmpfrag.appendChild(start.firstChild);\n                }if (!hasBlock) {\n                  tmpP = me.document.createElement(\"p\");tmpP.appendChild(tmpfrag);frag.appendChild(tmpP);\n                } else {\n                  frag.appendChild(tmpfrag);\n                }domUtils.remove(start);\n              }start = tmp;\n            }var tmpDiv = domUtils.createElement(me.document, \"div\", { tmpDiv: 1 });domUtils.moveChild(end, tmpDiv);frag.appendChild(tmpDiv);domUtils.remove(end);endParent.parentNode.insertBefore(frag, endParent);range.setEndBefore(endParent);if (domUtils.isEmptyNode(endParent)) {\n              domUtils.remove(endParent);\n            }modifyEnd = 1;\n          }\n        }if (!modifyStart) {\n          range.setStartBefore(me.document.getElementById(bko.start));\n        }if (bko.end && !modifyEnd) {\n          range.setEndAfter(me.document.getElementById(bko.end));\n        }range.enlarge(true, function (node) {\n          return notExchange[node.tagName];\n        });frag = me.document.createDocumentFragment();var bk = range.createBookmark(),\n            current = domUtils.getNextDomNode(bk.start, false, filterFn),\n            tmpRange = range.cloneRange(),\n            tmpNode,\n            block = domUtils.isBlockElm;while (current && current !== bk.end && domUtils.getPosition(current, bk.end) & domUtils.POSITION_PRECEDING) {\n          if (current.nodeType == 3 || dtd.li[current.tagName]) {\n            if (current.nodeType == 1 && dtd.$list[current.tagName]) {\n              while (current.firstChild) {\n                frag.appendChild(current.firstChild);\n              }tmpNode = domUtils.getNextDomNode(current, false, filterFn);domUtils.remove(current);current = tmpNode;continue;\n            }tmpNode = current;tmpRange.setStartBefore(current);while (current && current !== bk.end && (!block(current) || domUtils.isBookmarkNode(current))) {\n              tmpNode = current;current = domUtils.getNextDomNode(current, false, null, function (node) {\n                return !notExchange[node.tagName];\n              });\n            }if (current && block(current)) {\n              tmp = domUtils.getNextDomNode(tmpNode, false, filterFn);if (tmp && domUtils.isBookmarkNode(tmp)) {\n                current = domUtils.getNextDomNode(tmp, false, filterFn);tmpNode = tmp;\n              }\n            }tmpRange.setEndAfter(tmpNode);current = domUtils.getNextDomNode(tmpNode, false, filterFn);var li = range.document.createElement(\"li\");li.appendChild(tmpRange.extractContents());if (domUtils.isEmptyNode(li)) {\n              var tmpNode = range.document.createElement(\"p\");while (li.firstChild) {\n                tmpNode.appendChild(li.firstChild);\n              }li.appendChild(tmpNode);\n            }frag.appendChild(li);\n          } else {\n            current = domUtils.getNextDomNode(current, true, filterFn);\n          }\n        }range.moveToBookmark(bk).collapse(true);list = me.document.createElement(tag);setListStyle(list, style);list.appendChild(frag);range.insertNode(list);adjustList(list, tag, style);for (var i = 0, ci, tmpDivs = domUtils.getElementsByTagName(list, \"div\"); ci = tmpDivs[i++];) {\n          if (ci.getAttribute(\"tmpDiv\")) {\n            domUtils.remove(ci, true);\n          }\n        }range.moveToBookmark(bko).select();\n      }, queryCommandState: function queryCommandState(command) {\n        var tag = command.toLowerCase() == \"insertorderedlist\" ? \"ol\" : \"ul\";var path = this.selection.getStartElementPath();for (var i = 0, ci; ci = path[i++];) {\n          if (ci.nodeName == \"TABLE\") {\n            return 0;\n          }if (tag == ci.nodeName.toLowerCase()) {\n            return 1;\n          }\n        }return 0;\n      }, queryCommandValue: function queryCommandValue(command) {\n        var tag = command.toLowerCase() == \"insertorderedlist\" ? \"ol\" : \"ul\";var path = this.selection.getStartElementPath(),\n            node;for (var i = 0, ci; ci = path[i++];) {\n          if (ci.nodeName == \"TABLE\") {\n            node = null;break;\n          }if (tag == ci.nodeName.toLowerCase()) {\n            node = ci;break;\n          }\n        }return node ? getStyle(node) || domUtils.getComputedStyle(node, \"list-style-type\") : null;\n      } };\n  };!function () {\n    var sourceEditors = { textarea: function textarea(editor, holder) {\n        var textarea = holder.ownerDocument.createElement(\"textarea\");textarea.style.cssText = \"position:absolute;resize:none;width:100%;height:100%;border:0;padding:0;margin:0;overflow-y:auto;\";if (browser.ie && browser.version < 8) {\n          textarea.style.width = holder.offsetWidth + \"px\";textarea.style.height = holder.offsetHeight + \"px\";holder.onresize = function () {\n            textarea.style.width = holder.offsetWidth + \"px\";textarea.style.height = holder.offsetHeight + \"px\";\n          };\n        }holder.appendChild(textarea);return { setContent: function setContent(content) {\n            textarea.value = content;\n          }, getContent: function getContent() {\n            return textarea.value;\n          }, select: function select() {\n            var range;if (browser.ie) {\n              range = textarea.createTextRange();range.collapse(true);range.select();\n            } else {\n              textarea.setSelectionRange(0, 0);textarea.focus();\n            }\n          }, dispose: function dispose() {\n            holder.removeChild(textarea);holder.onresize = null;textarea = null;holder = null;\n          } };\n      }, codemirror: function codemirror(editor, holder) {\n        var codeEditor = window.CodeMirror(holder, { mode: \"text/html\", tabMode: \"indent\", lineNumbers: true, lineWrapping: true });var dom = codeEditor.getWrapperElement();dom.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;font-family:consolas,\"Courier new\",monospace;font-size:13px;';codeEditor.getScrollerElement().style.cssText = \"position:absolute;left:0;top:0;width:100%;height:100%;\";codeEditor.refresh();return { getCodeMirror: function getCodeMirror() {\n            return codeEditor;\n          }, setContent: function setContent(content) {\n            codeEditor.setValue(content);\n          }, getContent: function getContent() {\n            return codeEditor.getValue();\n          }, select: function select() {\n            codeEditor.focus();\n          }, dispose: function dispose() {\n            holder.removeChild(dom);dom = null;codeEditor = null;\n          } };\n      } };UE.plugins[\"source\"] = function () {\n      var me = this;var opt = this.options;var sourceMode = false;var sourceEditor;var orgSetContent;opt.sourceEditor = browser.ie ? \"textarea\" : opt.sourceEditor || \"codemirror\";me.setOpt({ sourceEditorFirst: false });function createSourceEditor(holder) {\n        return sourceEditors[opt.sourceEditor == \"codemirror\" && window.CodeMirror ? \"codemirror\" : \"textarea\"](me, holder);\n      }var bakCssText;var oldGetContent, bakAddress;me.commands[\"source\"] = { execCommand: function execCommand() {\n          sourceMode = !sourceMode;if (sourceMode) {\n            bakAddress = me.selection.getRange().createAddress(false, true);me.undoManger && me.undoManger.save(true);if (browser.gecko) {\n              me.body.contentEditable = false;\n            }bakCssText = me.iframe.style.cssText;me.iframe.style.cssText += \"position:absolute;left:-32768px;top:-32768px;\";me.fireEvent(\"beforegetcontent\");var root = UE.htmlparser(me.body.innerHTML);me.filterOutputRule(root);root.traversal(function (node) {\n              if (node.type == \"element\") {\n                switch (node.tagName) {case \"td\":case \"th\":case \"caption\":\n                    if (node.children && node.children.length == 1) {\n                      if (node.firstChild().tagName == \"br\") {\n                        node.removeChild(node.firstChild());\n                      }\n                    };break;case \"pre\":\n                    node.innerText(node.innerText().replace(/&nbsp;/g, \" \"));}\n              }\n            });me.fireEvent(\"aftergetcontent\");var content = root.toHtml(true);sourceEditor = createSourceEditor(me.iframe.parentNode);sourceEditor.setContent(content);orgSetContent = me.setContent;me.setContent = function (html) {\n              var root = UE.htmlparser(html);me.filterInputRule(root);html = root.toHtml();sourceEditor.setContent(html);\n            };setTimeout(function () {\n              sourceEditor.select();me.addListener(\"fullscreenchanged\", function () {\n                try {\n                  sourceEditor.getCodeMirror().refresh();\n                } catch (e) {}\n              });\n            });oldGetContent = me.getContent;me.getContent = function () {\n              return sourceEditor.getContent() || \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";\n            };\n          } else {\n            me.iframe.style.cssText = bakCssText;var cont = sourceEditor.getContent() || \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";cont = cont.replace(new RegExp(\"[\\\\r\\\\t\\\\n ]*</?(\\\\w+)\\\\s*(?:[^>]*)>\", \"g\"), function (a, b) {\n              if (b && !dtd.$inlineWithA[b.toLowerCase()]) {\n                return a.replace(/(^[\\n\\r\\t ]*)|([\\n\\r\\t ]*$)/g, \"\");\n              }return a.replace(/(^[\\n\\r\\t]*)|([\\n\\r\\t]*$)/g, \"\");\n            });me.setContent = orgSetContent;me.setContent(cont);sourceEditor.dispose();sourceEditor = null;me.getContent = oldGetContent;var first = me.body.firstChild;if (!first) {\n              me.body.innerHTML = \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";first = me.body.firstChild;\n            }me.undoManger && me.undoManger.save(true);if (browser.gecko) {\n              var input = document.createElement(\"input\");input.style.cssText = \"position:absolute;left:0;top:-32768px\";document.body.appendChild(input);me.body.contentEditable = false;setTimeout(function () {\n                domUtils.setViewportOffset(input, { left: -32768, top: 0 });input.focus();setTimeout(function () {\n                  me.body.contentEditable = true;me.selection.getRange().moveToAddress(bakAddress).select(true);domUtils.remove(input);\n                });\n              });\n            } else {\n              try {\n                me.selection.getRange().moveToAddress(bakAddress).select(true);\n              } catch (e) {}\n            }\n          }this.fireEvent(\"sourcemodechanged\", sourceMode);\n        }, queryCommandState: function queryCommandState() {\n          return sourceMode | 0;\n        }, notNeedUndo: 1 };var oldQueryCommandState = me.queryCommandState;me.queryCommandState = function (cmdName) {\n        cmdName = cmdName.toLowerCase();if (sourceMode) {\n          return cmdName in { source: 1, fullscreen: 1 } ? 1 : -1;\n        }return oldQueryCommandState.apply(this, arguments);\n      };if (opt.sourceEditor == \"codemirror\") {\n        me.addListener(\"ready\", function () {\n          utils.loadFile(document, { src: opt.codeMirrorJsUrl || opt.UEDITOR_HOME_URL + \"third-party/codemirror/codemirror.js\", tag: \"script\", type: \"text/javascript\", defer: \"defer\" }, function () {\n            if (opt.sourceEditorFirst) {\n              setTimeout(function () {\n                me.execCommand(\"source\");\n              }, 0);\n            }\n          });utils.loadFile(document, { tag: \"link\", rel: \"stylesheet\", type: \"text/css\", href: opt.codeMirrorCssUrl || opt.UEDITOR_HOME_URL + \"third-party/codemirror/codemirror.css\" });\n        });\n      }\n    };\n  }();UE.plugins[\"enterkey\"] = function () {\n    var hTag,\n        me = this,\n        tag = me.options.enterTag;me.addListener(\"keyup\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which;if (keyCode == 13) {\n        var range = me.selection.getRange(),\n            start = range.startContainer,\n            doSave;if (!browser.ie) {\n          if (/h\\d/i.test(hTag)) {\n            if (browser.gecko) {\n              var h = domUtils.findParentByTagName(start, [\"h1\", \"h2\", \"h3\", \"h4\", \"h5\", \"h6\", \"blockquote\", \"caption\", \"table\"], true);if (!h) {\n                me.document.execCommand(\"formatBlock\", false, \"<p>\");doSave = 1;\n              }\n            } else {\n              if (start.nodeType == 1) {\n                var tmp = me.document.createTextNode(\"\"),\n                    div;range.insertNode(tmp);div = domUtils.findParentByTagName(tmp, \"div\", true);if (div) {\n                  var p = me.document.createElement(\"p\");while (div.firstChild) {\n                    p.appendChild(div.firstChild);\n                  }div.parentNode.insertBefore(p, div);domUtils.remove(div);range.setStartBefore(tmp).setCursor();doSave = 1;\n                }domUtils.remove(tmp);\n              }\n            }if (me.undoManger && doSave) {\n              me.undoManger.save();\n            }\n          }browser.opera && range.select();\n        } else {\n          me.fireEvent(\"saveScene\", true, true);\n        }\n      }\n    });me.addListener(\"keydown\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which;if (keyCode == 13) {\n        if (me.fireEvent(\"beforeenterkeydown\")) {\n          domUtils.preventDefault(evt);return;\n        }me.fireEvent(\"saveScene\", true, true);hTag = \"\";var range = me.selection.getRange();if (!range.collapsed) {\n          var start = range.startContainer,\n              end = range.endContainer,\n              startTd = domUtils.findParentByTagName(start, \"td\", true),\n              endTd = domUtils.findParentByTagName(end, \"td\", true);if (startTd && endTd && startTd !== endTd || !startTd && endTd || startTd && !endTd) {\n            evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;return;\n          }\n        }if (tag == \"p\") {\n          if (!browser.ie) {\n            start = domUtils.findParentByTagName(range.startContainer, [\"ol\", \"ul\", \"p\", \"h1\", \"h2\", \"h3\", \"h4\", \"h5\", \"h6\", \"blockquote\", \"caption\"], true);if (!start && !browser.opera) {\n              me.document.execCommand(\"formatBlock\", false, \"<p>\");if (browser.gecko) {\n                range = me.selection.getRange();start = domUtils.findParentByTagName(range.startContainer, \"p\", true);start && domUtils.removeDirtyAttr(start);\n              }\n            } else {\n              hTag = start.tagName;start.tagName.toLowerCase() == \"p\" && browser.gecko && domUtils.removeDirtyAttr(start);\n            }\n          }\n        } else {\n          evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;if (!range.collapsed) {\n            range.deleteContents();start = range.startContainer;if (start.nodeType == 1 && (start = start.childNodes[range.startOffset])) {\n              while (start.nodeType == 1) {\n                if (dtd.$empty[start.tagName]) {\n                  range.setStartBefore(start).setCursor();if (me.undoManger) {\n                    me.undoManger.save();\n                  }return false;\n                }if (!start.firstChild) {\n                  var br = range.document.createElement(\"br\");start.appendChild(br);range.setStart(start, 0).setCursor();if (me.undoManger) {\n                    me.undoManger.save();\n                  }return false;\n                }start = start.firstChild;\n              }if (start === range.startContainer.childNodes[range.startOffset]) {\n                br = range.document.createElement(\"br\");range.insertNode(br).setCursor();\n              } else {\n                range.setStart(start, 0).setCursor();\n              }\n            } else {\n              br = range.document.createElement(\"br\");range.insertNode(br).setStartAfter(br).setCursor();\n            }\n          } else {\n            br = range.document.createElement(\"br\");range.insertNode(br);var parent = br.parentNode;if (parent.lastChild === br) {\n              br.parentNode.insertBefore(br.cloneNode(true), br);range.setStartBefore(br);\n            } else {\n              range.setStartAfter(br);\n            }range.setCursor();\n          }\n        }\n      }\n    });\n  };UE.plugins[\"keystrokes\"] = function () {\n    var me = this;var collapsed = true;me.addListener(\"keydown\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which,\n          rng = me.selection.getRange();if (!rng.collapsed && !(evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) && (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111 || { 13: 1, 8: 1, 46: 1 }[keyCode])) {\n        var tmpNode = rng.startContainer;if (domUtils.isFillChar(tmpNode)) {\n          rng.setStartBefore(tmpNode);\n        }tmpNode = rng.endContainer;if (domUtils.isFillChar(tmpNode)) {\n          rng.setEndAfter(tmpNode);\n        }rng.txtToElmBoundary();if (rng.endContainer && rng.endContainer.nodeType == 1) {\n          tmpNode = rng.endContainer.childNodes[rng.endOffset];if (tmpNode && domUtils.isBr(tmpNode)) {\n            rng.setEndAfter(tmpNode);\n          }\n        }if (rng.startOffset == 0) {\n          tmpNode = rng.startContainer;if (domUtils.isBoundaryNode(tmpNode, \"firstChild\")) {\n            tmpNode = rng.endContainer;if (rng.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode, \"lastChild\")) {\n              me.fireEvent(\"saveScene\");me.body.innerHTML = \"<p>\" + (browser.ie ? \"\" : \"<br/>\") + \"</p>\";rng.setStart(me.body.firstChild, 0).setCursor(false, true);me._selectionChange();return;\n            }\n          }\n        }\n      }if (keyCode == keymap.Backspace) {\n        rng = me.selection.getRange();collapsed = rng.collapsed;if (me.fireEvent(\"delkeydown\", evt)) {\n          return;\n        }var start, end;if (rng.collapsed && rng.inFillChar()) {\n          start = rng.startContainer;if (domUtils.isFillChar(start)) {\n            rng.setStartBefore(start).shrinkBoundary(true).collapse(true);domUtils.remove(start);\n          } else {\n            start.nodeValue = start.nodeValue.replace(new RegExp(\"^\" + domUtils.fillChar), \"\");rng.startOffset--;rng.collapse(true).select(true);\n          }\n        }if (start = rng.getClosedNode()) {\n          me.fireEvent(\"saveScene\");rng.setStartBefore(start);domUtils.remove(start);rng.setCursor();me.fireEvent(\"saveScene\");domUtils.preventDefault(evt);return;\n        }if (!browser.ie) {\n          start = domUtils.findParentByTagName(rng.startContainer, \"table\", true);end = domUtils.findParentByTagName(rng.endContainer, \"table\", true);if (start && !end || !start && end || start !== end) {\n            evt.preventDefault();return;\n          }\n        }\n      }if (keyCode == keymap.Tab) {\n        var excludeTagNameForTabKey = { ol: 1, ul: 1, table: 1 };if (me.fireEvent(\"tabkeydown\", evt)) {\n          domUtils.preventDefault(evt);return;\n        }var range = me.selection.getRange();me.fireEvent(\"saveScene\");for (var i = 0, txt = \"\", tabSize = me.options.tabSize || 4, tabNode = me.options.tabNode || \"&nbsp;\"; i < tabSize; i++) {\n          txt += tabNode;\n        }var span = me.document.createElement(\"span\");span.innerHTML = txt + domUtils.fillChar;if (range.collapsed) {\n          range.insertNode(span.cloneNode(true).firstChild).setCursor(true);\n        } else {\n          var filterFn = function filterFn(node) {\n            return domUtils.isBlockElm(node) && !excludeTagNameForTabKey[node.tagName.toLowerCase()];\n          };start = domUtils.findParent(range.startContainer, filterFn, true);end = domUtils.findParent(range.endContainer, filterFn, true);if (start && end && start === end) {\n            range.deleteContents();range.insertNode(span.cloneNode(true).firstChild).setCursor(true);\n          } else {\n            var bookmark = range.createBookmark();range.enlarge(true);var bookmark2 = range.createBookmark(),\n                current = domUtils.getNextDomNode(bookmark2.start, false, filterFn);while (current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING)) {\n              current.insertBefore(span.cloneNode(true).firstChild, current.firstChild);current = domUtils.getNextDomNode(current, false, filterFn);\n            }range.moveToBookmark(bookmark2).moveToBookmark(bookmark).select();\n          }\n        }domUtils.preventDefault(evt);\n      }if (browser.gecko && keyCode == 46) {\n        range = me.selection.getRange();if (range.collapsed) {\n          start = range.startContainer;if (domUtils.isEmptyBlock(start)) {\n            var parent = start.parentNode;while (domUtils.getChildCount(parent) == 1 && !domUtils.isBody(parent)) {\n              start = parent;parent = parent.parentNode;\n            }if (start === parent.lastChild) evt.preventDefault();return;\n          }\n        }\n      }\n    });me.addListener(\"keyup\", function (type, evt) {\n      var keyCode = evt.keyCode || evt.which,\n          rng,\n          me = this;if (keyCode == keymap.Backspace) {\n        if (me.fireEvent(\"delkeyup\")) {\n          return;\n        }rng = me.selection.getRange();if (rng.collapsed) {\n          var tmpNode,\n              autoClearTagName = [\"h1\", \"h2\", \"h3\", \"h4\", \"h5\", \"h6\"];if (tmpNode = domUtils.findParentByTagName(rng.startContainer, autoClearTagName, true)) {\n            if (domUtils.isEmptyBlock(tmpNode)) {\n              var pre = tmpNode.previousSibling;if (pre && pre.nodeName != \"TABLE\") {\n                domUtils.remove(tmpNode);rng.setStartAtLast(pre).setCursor(false, true);return;\n              } else {\n                var next = tmpNode.nextSibling;if (next && next.nodeName != \"TABLE\") {\n                  domUtils.remove(tmpNode);rng.setStartAtFirst(next).setCursor(false, true);return;\n                }\n              }\n            }\n          }if (domUtils.isBody(rng.startContainer)) {\n            var tmpNode = domUtils.createElement(me.document, \"p\", { innerHTML: browser.ie ? domUtils.fillChar : \"<br/>\" });rng.insertNode(tmpNode).setStart(tmpNode, 0).setCursor(false, true);\n          }\n        }if (!collapsed && (rng.startContainer.nodeType == 3 || rng.startContainer.nodeType == 1 && domUtils.isEmptyBlock(rng.startContainer))) {\n          if (browser.ie) {\n            var span = rng.document.createElement(\"span\");rng.insertNode(span).setStartBefore(span).collapse(true);rng.select();domUtils.remove(span);\n          } else {\n            rng.select();\n          }\n        }\n      }\n    });\n  };UE.plugins[\"fiximgclick\"] = function () {\n    var elementUpdated = false;function Scale() {\n      this.editor = null;this.resizer = null;this.cover = null;this.doc = document;this.prePos = { x: 0, y: 0 };this.startPos = { x: 0, y: 0 };\n    }!function () {\n      var rect = [[0, 0, -1, -1], [0, 0, 0, -1], [0, 0, 1, -1], [0, 0, -1, 0], [0, 0, 1, 0], [0, 0, -1, 1], [0, 0, 0, 1], [0, 0, 1, 1]];Scale.prototype = { init: function init(editor) {\n          var me = this;me.editor = editor;me.startPos = this.prePos = { x: 0, y: 0 };me.dragId = -1;var hands = [],\n              cover = me.cover = document.createElement(\"div\"),\n              resizer = me.resizer = document.createElement(\"div\");cover.id = me.editor.ui.id + \"_imagescale_cover\";cover.style.cssText = \"position:absolute;display:none;z-index:\" + me.editor.options.zIndex + \";filter:alpha(opacity=0); opacity:0;background:#CCC;\";domUtils.on(cover, \"mousedown click\", function () {\n            me.hide();\n          });for (i = 0; i < 8; i++) {\n            hands.push('<span class=\"edui-editor-imagescale-hand' + i + '\"></span>');\n          }resizer.id = me.editor.ui.id + \"_imagescale\";resizer.className = \"edui-editor-imagescale\";resizer.innerHTML = hands.join(\"\");resizer.style.cssText += \";display:none;border:1px solid #3b77ff;z-index:\" + me.editor.options.zIndex + \";\";me.editor.ui.getDom().appendChild(cover);me.editor.ui.getDom().appendChild(resizer);me.initStyle();me.initEvents();\n        }, initStyle: function initStyle() {\n          utils.cssRule(\"imagescale\", \".edui-editor-imagescale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;}\" + \".edui-editor-imagescale span{position:absolute;width:6px;height:6px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}\" + \".edui-editor-imagescale .edui-editor-imagescale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}\");\n        }, initEvents: function initEvents() {\n          var me = this;me.startPos.x = me.startPos.y = 0;me.isDraging = false;\n        }, _eventHandler: function _eventHandler(e) {\n          var me = this;switch (e.type) {case \"mousedown\":\n              var hand = e.target || e.srcElement,\n                  hand;if (hand.className.indexOf(\"edui-editor-imagescale-hand\") != -1 && me.dragId == -1) {\n                me.dragId = hand.className.slice(-1);me.startPos.x = me.prePos.x = e.clientX;me.startPos.y = me.prePos.y = e.clientY;domUtils.on(me.doc, \"mousemove\", me.proxy(me._eventHandler, me));\n              }break;case \"mousemove\":\n              if (me.dragId != -1) {\n                me.updateContainerStyle(me.dragId, { x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y });me.prePos.x = e.clientX;me.prePos.y = e.clientY;elementUpdated = true;me.updateTargetElement();\n              }break;case \"mouseup\":\n              if (me.dragId != -1) {\n                me.updateContainerStyle(me.dragId, { x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y });me.updateTargetElement();if (me.target.parentNode) me.attachTo(me.target);me.dragId = -1;\n              }domUtils.un(me.doc, \"mousemove\", me.proxy(me._eventHandler, me));if (elementUpdated) {\n                elementUpdated = false;me.editor.fireEvent(\"contentchange\");\n              }break;default:\n              break;}\n        }, updateTargetElement: function updateTargetElement() {\n          var me = this;domUtils.setStyles(me.target, { width: me.resizer.style.width, height: me.resizer.style.height });me.target.width = parseInt(me.resizer.style.width);me.target.height = parseInt(me.resizer.style.height);me.attachTo(me.target);\n        }, updateContainerStyle: function updateContainerStyle(dir, offset) {\n          var me = this,\n              dom = me.resizer,\n              tmp;if (rect[dir][0] != 0) {\n            tmp = parseInt(dom.style.left) + offset.x;dom.style.left = me._validScaledProp(\"left\", tmp) + \"px\";\n          }if (rect[dir][1] != 0) {\n            tmp = parseInt(dom.style.top) + offset.y;dom.style.top = me._validScaledProp(\"top\", tmp) + \"px\";\n          }if (rect[dir][2] != 0) {\n            tmp = dom.clientWidth + rect[dir][2] * offset.x;dom.style.width = me._validScaledProp(\"width\", tmp) + \"px\";\n          }if (rect[dir][3] != 0) {\n            tmp = dom.clientHeight + rect[dir][3] * offset.y;dom.style.height = me._validScaledProp(\"height\", tmp) + \"px\";\n          }\n        }, _validScaledProp: function _validScaledProp(prop, value) {\n          var ele = this.resizer,\n              wrap = document;value = isNaN(value) ? 0 : value;switch (prop) {case \"left\":\n              return value < 0 ? 0 : value + ele.clientWidth > wrap.clientWidth ? wrap.clientWidth - ele.clientWidth : value;case \"top\":\n              return value < 0 ? 0 : value + ele.clientHeight > wrap.clientHeight ? wrap.clientHeight - ele.clientHeight : value;case \"width\":\n              return value <= 0 ? 1 : value + ele.offsetLeft > wrap.clientWidth ? wrap.clientWidth - ele.offsetLeft : value;case \"height\":\n              return value <= 0 ? 1 : value + ele.offsetTop > wrap.clientHeight ? wrap.clientHeight - ele.offsetTop : value;}\n        }, hideCover: function hideCover() {\n          this.cover.style.display = \"none\";\n        }, showCover: function showCover() {\n          var me = this,\n              editorPos = domUtils.getXY(me.editor.ui.getDom()),\n              iframePos = domUtils.getXY(me.editor.iframe);domUtils.setStyles(me.cover, { width: me.editor.iframe.offsetWidth + \"px\", height: me.editor.iframe.offsetHeight + \"px\", top: iframePos.y - editorPos.y + \"px\", left: iframePos.x - editorPos.x + \"px\", position: \"absolute\", display: \"\" });\n        }, show: function show(targetObj) {\n          var me = this;me.resizer.style.display = \"block\";if (targetObj) me.attachTo(targetObj);domUtils.on(this.resizer, \"mousedown\", me.proxy(me._eventHandler, me));domUtils.on(me.doc, \"mouseup\", me.proxy(me._eventHandler, me));me.showCover();me.editor.fireEvent(\"afterscaleshow\", me);me.editor.fireEvent(\"saveScene\");\n        }, hide: function hide() {\n          var me = this;me.hideCover();me.resizer.style.display = \"none\";domUtils.un(me.resizer, \"mousedown\", me.proxy(me._eventHandler, me));domUtils.un(me.doc, \"mouseup\", me.proxy(me._eventHandler, me));me.editor.fireEvent(\"afterscalehide\", me);\n        }, proxy: function proxy(fn, context) {\n          return function (e) {\n            return fn.apply(context || this, arguments);\n          };\n        }, attachTo: function attachTo(targetObj) {\n          var me = this,\n              target = me.target = targetObj,\n              resizer = this.resizer,\n              imgPos = domUtils.getXY(target),\n              iframePos = domUtils.getXY(me.editor.iframe),\n              editorPos = domUtils.getXY(resizer.parentNode);domUtils.setStyles(resizer, { width: target.width + \"px\", height: target.height + \"px\", left: iframePos.x + imgPos.x - me.editor.document.body.scrollLeft - editorPos.x - parseInt(resizer.style.borderLeftWidth) + \"px\", top: iframePos.y + imgPos.y - me.editor.document.body.scrollTop - editorPos.y - parseInt(resizer.style.borderTopWidth) + \"px\" });\n        } };\n    }();return function () {\n      var me = this,\n          imageScale;me.setOpt(\"imageScaleEnabled\", true);if (!browser.ie && me.options.imageScaleEnabled) {\n        me.addListener(\"click\", function (type, e) {\n          var range = me.selection.getRange(),\n              img = range.getClosedNode();if (img && img.tagName == \"IMG\" && me.body.contentEditable != \"false\") {\n            if (img.className.indexOf(\"edui-faked-music\") != -1 || img.getAttribute(\"anchorname\") || domUtils.hasClass(img, \"loadingclass\") || domUtils.hasClass(img, \"loaderrorclass\")) {\n              return;\n            }if (!imageScale) {\n              imageScale = new Scale();imageScale.init(me);me.ui.getDom().appendChild(imageScale.resizer);var _keyDownHandler = function _keyDownHandler(e) {\n                imageScale.hide();if (imageScale.target) me.selection.getRange().selectNode(imageScale.target).select();\n              },\n                  _mouseDownHandler = function _mouseDownHandler(e) {\n                var ele = e.target || e.srcElement;if (ele && (ele.className === undefined || ele.className.indexOf(\"edui-editor-imagescale\") == -1)) {\n                  _keyDownHandler(e);\n                }\n              },\n                  timer;me.addListener(\"afterscaleshow\", function (e) {\n                me.addListener(\"beforekeydown\", _keyDownHandler);me.addListener(\"beforemousedown\", _mouseDownHandler);domUtils.on(document, \"keydown\", _keyDownHandler);domUtils.on(document, \"mousedown\", _mouseDownHandler);me.selection.getNative().removeAllRanges();\n              });me.addListener(\"afterscalehide\", function (e) {\n                me.removeListener(\"beforekeydown\", _keyDownHandler);me.removeListener(\"beforemousedown\", _mouseDownHandler);domUtils.un(document, \"keydown\", _keyDownHandler);domUtils.un(document, \"mousedown\", _mouseDownHandler);var target = imageScale.target;if (target.parentNode) {\n                  me.selection.getRange().selectNode(target).select();\n                }\n              });domUtils.on(imageScale.resizer, \"mousedown\", function (e) {\n                me.selection.getNative().removeAllRanges();var ele = e.target || e.srcElement;if (ele && ele.className.indexOf(\"edui-editor-imagescale-hand\") == -1) {\n                  timer = setTimeout(function () {\n                    imageScale.hide();if (imageScale.target) me.selection.getRange().selectNode(ele).select();\n                  }, 200);\n                }\n              });domUtils.on(imageScale.resizer, \"mouseup\", function (e) {\n                var ele = e.target || e.srcElement;if (ele && ele.className.indexOf(\"edui-editor-imagescale-hand\") == -1) {\n                  clearTimeout(timer);\n                }\n              });\n            }imageScale.show(img);\n          } else {\n            if (imageScale && imageScale.resizer.style.display != \"none\") imageScale.hide();\n          }\n        });\n      }if (browser.webkit) {\n        me.addListener(\"click\", function (type, e) {\n          if (e.target.tagName == \"IMG\" && me.body.contentEditable != \"false\") {\n            var range = new dom.Range(me.document);range.selectNode(e.target).select();\n          }\n        });\n      }\n    };\n  }();UE.plugins[\"basestyle\"] = function () {\n    var basestyles = { bold: [\"strong\", \"b\"], italic: [\"em\", \"i\"], subscript: [\"sub\"], superscript: [\"sup\"] },\n        getObj = function getObj(editor, tagNames) {\n      return domUtils.filterNodeList(editor.selection.getStartElementPath(), tagNames);\n    },\n        me = this;me.addshortcutkey({ Bold: \"ctrl+66\", Italic: \"ctrl+73\", Underline: \"ctrl+85\" });me.addInputRule(function (root) {\n      utils.each(root.getNodesByTagName(\"b i\"), function (node) {\n        switch (node.tagName) {case \"b\":\n            node.tagName = \"strong\";break;case \"i\":\n            node.tagName = \"em\";}\n      });\n    });for (var style in basestyles) {\n      !function (cmd, tagNames) {\n        me.commands[cmd] = { execCommand: function execCommand(cmdName) {\n            var range = me.selection.getRange(),\n                obj = getObj(this, tagNames);if (range.collapsed) {\n              if (obj) {\n                var tmpText = me.document.createTextNode(\"\");range.insertNode(tmpText).removeInlineStyle(tagNames);range.setStartBefore(tmpText);domUtils.remove(tmpText);\n              } else {\n                var tmpNode = range.document.createElement(tagNames[0]);if (cmdName == \"superscript\" || cmdName == \"subscript\") {\n                  tmpText = me.document.createTextNode(\"\");range.insertNode(tmpText).removeInlineStyle([\"sub\", \"sup\"]).setStartBefore(tmpText).collapse(true);\n                }range.insertNode(tmpNode).setStart(tmpNode, 0);\n              }range.collapse(true);\n            } else {\n              if (cmdName == \"superscript\" || cmdName == \"subscript\") {\n                if (!obj || obj.tagName.toLowerCase() != cmdName) {\n                  range.removeInlineStyle([\"sub\", \"sup\"]);\n                }\n              }obj ? range.removeInlineStyle(tagNames) : range.applyInlineStyle(tagNames[0]);\n            }range.select();\n          }, queryCommandState: function queryCommandState() {\n            return getObj(this, tagNames) ? 1 : 0;\n          } };\n      }(style, basestyles[style]);\n    }\n  };UE.plugin.register(\"simpleupload\", function () {\n    var me = this,\n        isLoaded = false,\n        containerBtn;function initUploadBtn() {\n      var w = containerBtn.offsetWidth || 20,\n          h = containerBtn.offsetHeight || 20,\n          btnIframe = document.createElement(\"iframe\"),\n          btnStyle = \"display:block;width:\" + w + \"px;height:\" + h + \"px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;\";domUtils.on(btnIframe, \"load\", function () {\n        var timestrap = (+new Date()).toString(36),\n            wrapper,\n            btnIframeDoc,\n            btnIframeBody;btnIframeDoc = btnIframe.contentDocument || btnIframe.contentWindow.document;btnIframeBody = btnIframeDoc.body;wrapper = btnIframeDoc.createElement(\"div\");wrapper.innerHTML = '<form id=\"edui_form_' + timestrap + '\" target=\"edui_iframe_' + timestrap + '\" method=\"POST\" enctype=\"multipart/form-data\" action=\"' + me.getOpt(\"serverUrl\") + '\" ' + 'style=\"' + btnStyle + '\">' + '<input id=\"edui_input_' + timestrap + '\" type=\"file\" accept=\"image/*\" name=\"' + me.options.imageFieldName + '\" ' + 'style=\"' + btnStyle + '\">' + \"</form>\" + '<iframe id=\"edui_iframe_' + timestrap + '\" name=\"edui_iframe_' + timestrap + '\" style=\"display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;\"></iframe>';wrapper.className = \"edui-\" + me.options.theme;wrapper.id = me.ui.id + \"_iframeupload\";btnIframeBody.style.cssText = btnStyle;btnIframeBody.style.width = w + \"px\";btnIframeBody.style.height = h + \"px\";btnIframeBody.appendChild(wrapper);if (btnIframeBody.parentNode) {\n          btnIframeBody.parentNode.style.width = w + \"px\";btnIframeBody.parentNode.style.height = w + \"px\";\n        }var form = btnIframeDoc.getElementById(\"edui_form_\" + timestrap);var input = btnIframeDoc.getElementById(\"edui_input_\" + timestrap);var iframe = btnIframeDoc.getElementById(\"edui_iframe_\" + timestrap);domUtils.on(input, \"change\", function () {\n          if (!input.value) return;var loadingId = \"loading_\" + (+new Date()).toString(36);var params = utils.serializeParam(me.queryCommandValue(\"serverparam\")) || \"\";var imageActionUrl = me.getActionUrl(me.getOpt(\"imageActionName\"));var allowFiles = me.getOpt(\"imageAllowFiles\");me.focus();me.execCommand(\"inserthtml\", '<img class=\"loadingclass\" id=\"' + loadingId + '\" src=\"' + me.options.themePath + me.options.theme + '/images/spacer.gif\" title=\"' + (me.getLang(\"simpleupload.loading\") || \"\") + '\" >');function callback() {\n            try {\n              var link,\n                  json,\n                  loader,\n                  body = (iframe.contentDocument || iframe.contentWindow.document).body,\n                  result = body.innerText || body.textContent || \"\";json = new Function(\"return \" + result)();link = me.options.imageUrlPrefix + json.url;if (json.state == \"SUCCESS\" && json.url) {\n                loader = me.document.getElementById(loadingId);loader.setAttribute(\"src\", link);loader.setAttribute(\"_src\", link);loader.setAttribute(\"title\", json.title || \"\");loader.setAttribute(\"alt\", json.original || \"\");loader.removeAttribute(\"id\");domUtils.removeClasses(loader, \"loadingclass\");\n              } else {\n                showErrorLoader && showErrorLoader(json.state);\n              }\n            } catch (er) {\n              showErrorLoader && showErrorLoader(me.getLang(\"simpleupload.loadError\"));\n            }form.reset();domUtils.un(iframe, \"load\", callback);\n          }function showErrorLoader(title) {\n            if (loadingId) {\n              var loader = me.document.getElementById(loadingId);loader && domUtils.remove(loader);me.fireEvent(\"showmessage\", { id: loadingId, content: title, type: \"error\", timeout: 4e3 });\n            }\n          }if (!me.getOpt(\"imageActionName\")) {\n            errorHandler(me.getLang(\"autoupload.errorLoadConfig\"));return;\n          }var filename = input.value,\n              fileext = filename ? filename.substr(filename.lastIndexOf(\".\")) : \"\";if (!fileext || allowFiles && (allowFiles.join(\"\") + \".\").indexOf(fileext.toLowerCase() + \".\") == -1) {\n            showErrorLoader(me.getLang(\"simpleupload.exceedTypeError\"));return;\n          }domUtils.on(iframe, \"load\", callback);form.action = utils.formatUrl(imageActionUrl + (imageActionUrl.indexOf(\"?\") == -1 ? \"?\" : \"&\") + params);form.submit();\n        });var stateTimer;me.addListener(\"selectionchange\", function () {\n          clearTimeout(stateTimer);stateTimer = setTimeout(function () {\n            var state = me.queryCommandState(\"simpleupload\");if (state == -1) {\n              input.disabled = \"disabled\";\n            } else {\n              input.disabled = false;\n            }\n          }, 400);\n        });isLoaded = true;\n      });btnIframe.style.cssText = btnStyle;containerBtn.appendChild(btnIframe);\n    }return { bindEvents: { ready: function ready() {\n          utils.cssRule(\"loading\", \".loadingclass{display:inline-block;cursor:default;background: url('\" + this.options.themePath + this.options.theme + \"/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\\n\" + \".loaderrorclass{display:inline-block;cursor:default;background: url('\" + this.options.themePath + this.options.theme + \"/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;\" + \"}\", this.document);\n        }, simpleuploadbtnready: function simpleuploadbtnready(type, container) {\n          containerBtn = container;me.afterConfigReady(initUploadBtn);\n        } }, outputRule: function outputRule(root) {\n        utils.each(root.getNodesByTagName(\"img\"), function (n) {\n          if (/\\b(loaderrorclass)|(bloaderrorclass)\\b/.test(n.getAttr(\"class\"))) {\n            n.parentNode.removeChild(n);\n          }\n        });\n      }, commands: { simpleupload: { queryCommandState: function queryCommandState() {\n            return isLoaded ? 0 : -1;\n          } } } };\n  });UE.plugin.register(\"serverparam\", function () {\n    var me = this,\n        serverParam = {};return { commands: { serverparam: { execCommand: function execCommand(cmd, key, value) {\n            if (key === undefined || key === null) {\n              serverParam = {};\n            } else if (utils.isString(key)) {\n              if (value === undefined || value === null) {\n                delete serverParam[key];\n              } else {\n                serverParam[key] = value;\n              }\n            } else if (utils.isObject(key)) {\n              utils.extend(serverParam, key, true);\n            } else if (utils.isFunction(key)) {\n              utils.extend(serverParam, key(), true);\n            }\n          }, queryCommandValue: function queryCommandValue() {\n            return serverParam || {};\n          } } } };\n  });var baidu = baidu || {};baidu.editor = baidu.editor || {};UE.ui = baidu.editor.ui = {};!function () {\n    var browser = baidu.editor.browser,\n        domUtils = baidu.editor.dom.domUtils;var magic = \"$EDITORUI\";var root = window[magic] = {};var uidMagic = \"ID\" + magic;var uidCount = 0;var uiUtils = baidu.editor.ui.uiUtils = { uid: function uid(obj) {\n        return obj ? obj[uidMagic] || (obj[uidMagic] = ++uidCount) : ++uidCount;\n      }, hook: function hook(fn, callback) {\n        var _dg;if (fn && fn._callbacks) {\n          _dg = fn;\n        } else {\n          _dg = function dg() {\n            var q;if (fn) {\n              q = fn.apply(this, arguments);\n            }var callbacks = _dg._callbacks;var k = callbacks.length;while (k--) {\n              var r = callbacks[k].apply(this, arguments);if (q === undefined) {\n                q = r;\n              }\n            }return q;\n          };_dg._callbacks = [];\n        }_dg._callbacks.push(callback);return _dg;\n      }, createElementByHtml: function createElementByHtml(html) {\n        var el = document.createElement(\"div\");el.innerHTML = html;el = el.firstChild;el.parentNode.removeChild(el);return el;\n      }, getViewportElement: function getViewportElement() {\n        return browser.ie && browser.quirks ? document.body : document.documentElement;\n      }, getClientRect: function getClientRect(element) {\n        var bcr;try {\n          bcr = element.getBoundingClientRect();\n        } catch (e) {\n          bcr = { left: 0, top: 0, height: 0, width: 0 };\n        }var rect = { left: Math.round(bcr.left), top: Math.round(bcr.top), height: Math.round(bcr.bottom - bcr.top), width: Math.round(bcr.right - bcr.left) };var doc;while ((doc = element.ownerDocument) !== document && (element = domUtils.getWindow(doc).frameElement)) {\n          bcr = element.getBoundingClientRect();rect.left += bcr.left;rect.top += bcr.top;\n        }rect.bottom = rect.top + rect.height;rect.right = rect.left + rect.width;return rect;\n      }, getViewportRect: function getViewportRect() {\n        var viewportEl = uiUtils.getViewportElement();var width = (window.innerWidth || viewportEl.clientWidth) | 0;var height = (window.innerHeight || viewportEl.clientHeight) | 0;return { left: 0, top: 0, height: height, width: width, bottom: height, right: width };\n      }, setViewportOffset: function setViewportOffset(element, offset) {\n        var rect;var fixedLayer = uiUtils.getFixedLayer();if (element.parentNode === fixedLayer) {\n          element.style.left = offset.left + \"px\";element.style.top = offset.top + \"px\";\n        } else {\n          domUtils.setViewportOffset(element, offset);\n        }\n      }, getEventOffset: function getEventOffset(evt) {\n        var el = evt.target || evt.srcElement;var rect = uiUtils.getClientRect(el);var offset = uiUtils.getViewportOffsetByEvent(evt);return { left: offset.left - rect.left, top: offset.top - rect.top };\n      }, getViewportOffsetByEvent: function getViewportOffsetByEvent(evt) {\n        var el = evt.target || evt.srcElement;var frameEl = domUtils.getWindow(el).frameElement;var offset = { left: evt.clientX, top: evt.clientY };if (frameEl && el.ownerDocument !== document) {\n          var rect = uiUtils.getClientRect(frameEl);offset.left += rect.left;offset.top += rect.top;\n        }return offset;\n      }, setGlobal: function setGlobal(id, obj) {\n        root[id] = obj;return magic + '[\"' + id + '\"]';\n      }, unsetGlobal: function unsetGlobal(id) {\n        delete root[id];\n      }, copyAttributes: function copyAttributes(tgt, src) {\n        var attributes = src.attributes;var k = attributes.length;while (k--) {\n          var attrNode = attributes[k];if (attrNode.nodeName != \"style\" && attrNode.nodeName != \"class\" && (!browser.ie || attrNode.specified)) {\n            tgt.setAttribute(attrNode.nodeName, attrNode.nodeValue);\n          }\n        }if (src.className) {\n          domUtils.addClass(tgt, src.className);\n        }if (src.style.cssText) {\n          tgt.style.cssText += \";\" + src.style.cssText;\n        }\n      }, removeStyle: function removeStyle(el, styleName) {\n        if (el.style.removeProperty) {\n          el.style.removeProperty(styleName);\n        } else if (el.style.removeAttribute) {\n          el.style.removeAttribute(styleName);\n        } else throw \"\";\n      }, contains: function contains(elA, elB) {\n        return elA && elB && (elA === elB ? false : elA.contains ? elA.contains(elB) : elA.compareDocumentPosition(elB) & 16);\n      }, startDrag: function startDrag(evt, callbacks, doc) {\n        var doc = doc || document;var startX = evt.clientX;var startY = evt.clientY;function handleMouseMove(evt) {\n          var x = evt.clientX - startX;var y = evt.clientY - startY;callbacks.ondragmove(x, y, evt);if (evt.stopPropagation) {\n            evt.stopPropagation();\n          } else {\n            evt.cancelBubble = true;\n          }\n        }if (doc.addEventListener) {\n          (function () {\n            var handleMouseUp = function handleMouseUp(evt) {\n              doc.removeEventListener(\"mousemove\", handleMouseMove, true);doc.removeEventListener(\"mouseup\", handleMouseUp, true);window.removeEventListener(\"mouseup\", handleMouseUp, true);callbacks.ondragstop();\n            };\n\n            doc.addEventListener(\"mousemove\", handleMouseMove, true);doc.addEventListener(\"mouseup\", handleMouseUp, true);window.addEventListener(\"mouseup\", handleMouseUp, true);evt.preventDefault();\n          })();\n        } else {\n          var elm;\n\n          (function () {\n            var releaseCaptrue = function releaseCaptrue() {\n              elm.releaseCapture();elm.detachEvent(\"onmousemove\", handleMouseMove);elm.detachEvent(\"onmouseup\", releaseCaptrue);elm.detachEvent(\"onlosecaptrue\", releaseCaptrue);callbacks.ondragstop();\n            };\n\n            elm = evt.srcElement;\n            elm.setCapture();elm.attachEvent(\"onmousemove\", handleMouseMove);elm.attachEvent(\"onmouseup\", releaseCaptrue);elm.attachEvent(\"onlosecaptrue\", releaseCaptrue);evt.returnValue = false;\n          })();\n        }callbacks.ondragstart();\n      }, getFixedLayer: function getFixedLayer() {\n        var layer = document.getElementById(\"edui_fixedlayer\");if (layer == null) {\n          layer = document.createElement(\"div\");layer.id = \"edui_fixedlayer\";document.body.appendChild(layer);if (browser.ie && browser.version <= 8) {\n            layer.style.position = \"absolute\";bindFixedLayer();setTimeout(updateFixedOffset);\n          } else {\n            layer.style.position = \"fixed\";\n          }layer.style.left = \"0\";layer.style.top = \"0\";layer.style.width = \"0\";layer.style.height = \"0\";\n        }return layer;\n      }, makeUnselectable: function makeUnselectable(element) {\n        if (browser.opera || browser.ie && browser.version < 9) {\n          element.unselectable = \"on\";if (element.hasChildNodes()) {\n            for (var i = 0; i < element.childNodes.length; i++) {\n              if (element.childNodes[i].nodeType == 1) {\n                uiUtils.makeUnselectable(element.childNodes[i]);\n              }\n            }\n          }\n        } else {\n          if (element.style.MozUserSelect !== undefined) {\n            element.style.MozUserSelect = \"none\";\n          } else if (element.style.WebkitUserSelect !== undefined) {\n            element.style.WebkitUserSelect = \"none\";\n          } else if (element.style.KhtmlUserSelect !== undefined) {\n            element.style.KhtmlUserSelect = \"none\";\n          }\n        }\n      } };function updateFixedOffset() {\n      var layer = document.getElementById(\"edui_fixedlayer\");uiUtils.setViewportOffset(layer, { left: 0, top: 0 });\n    }function bindFixedLayer(adjOffset) {\n      domUtils.on(window, \"scroll\", updateFixedOffset);domUtils.on(window, \"resize\", baidu.editor.utils.defer(updateFixedOffset, 0, true));\n    }\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        EventBase = baidu.editor.EventBase,\n        UIBase = baidu.editor.ui.UIBase = function () {};UIBase.prototype = { className: \"\", uiName: \"\", initOptions: function initOptions(options) {\n        var me = this;for (var k in options) {\n          me[k] = options[k];\n        }this.id = this.id || \"edui\" + uiUtils.uid();\n      }, initUIBase: function initUIBase() {\n        this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));\n      }, render: function render(holder) {\n        var html = this.renderHtml();var el = uiUtils.createElementByHtml(html);var list = domUtils.getElementsByTagName(el, \"*\");var theme = \"edui-\" + (this.theme || this.editor.options.theme);var layer = document.getElementById(\"edui_fixedlayer\");for (var i = 0, node; node = list[i++];) {\n          domUtils.addClass(node, theme);\n        }domUtils.addClass(el, theme);if (layer) {\n          layer.className = \"\";domUtils.addClass(layer, theme);\n        }var seatEl = this.getDom();if (seatEl != null) {\n          seatEl.parentNode.replaceChild(el, seatEl);uiUtils.copyAttributes(el, seatEl);\n        } else {\n          if (typeof holder == \"string\") {\n            holder = document.getElementById(holder);\n          }holder = holder || uiUtils.getFixedLayer();domUtils.addClass(holder, theme);holder.appendChild(el);\n        }this.postRender();\n      }, getDom: function getDom(name) {\n        if (!name) {\n          return document.getElementById(this.id);\n        } else {\n          return document.getElementById(this.id + \"_\" + name);\n        }\n      }, postRender: function postRender() {\n        this.fireEvent(\"postrender\");\n      }, getHtmlTpl: function getHtmlTpl() {\n        return \"\";\n      }, formatHtml: function formatHtml(tpl) {\n        var prefix = \"edui-\" + this.uiName;return tpl.replace(/##/g, this.id).replace(/%%-/g, this.uiName ? prefix + \"-\" : \"\").replace(/%%/g, (this.uiName ? prefix : \"\") + \" \" + this.className).replace(/\\$\\$/g, this._globalKey);\n      }, renderHtml: function renderHtml() {\n        return this.formatHtml(this.getHtmlTpl());\n      }, dispose: function dispose() {\n        var box = this.getDom();if (box) baidu.editor.dom.domUtils.remove(box);uiUtils.unsetGlobal(this.id);\n      } };utils.inherits(UIBase, EventBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        UIBase = baidu.editor.ui.UIBase,\n        Separator = baidu.editor.ui.Separator = function (options) {\n      this.initOptions(options);this.initSeparator();\n    };Separator.prototype = { uiName: \"separator\", initSeparator: function initSeparator() {\n        this.initUIBase();\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-box %%\"></div>';\n      } };utils.inherits(Separator, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        domUtils = baidu.editor.dom.domUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        uiUtils = baidu.editor.ui.uiUtils;var Mask = baidu.editor.ui.Mask = function (options) {\n      this.initOptions(options);this.initUIBase();\n    };Mask.prototype = { getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-mask %%\" onclick=\"return $$._onClick(event, this);\" onmousedown=\"return $$._onMouseDown(event, this);\"></div>';\n      }, postRender: function postRender() {\n        var me = this;domUtils.on(window, \"resize\", function () {\n          setTimeout(function () {\n            if (!me.isHidden()) {\n              me._fill();\n            }\n          });\n        });\n      }, show: function show(zIndex) {\n        this._fill();this.getDom().style.display = \"\";this.getDom().style.zIndex = zIndex;\n      }, hide: function hide() {\n        this.getDom().style.display = \"none\";this.getDom().style.zIndex = \"\";\n      }, isHidden: function isHidden() {\n        return this.getDom().style.display == \"none\";\n      }, _onMouseDown: function _onMouseDown() {\n        return false;\n      }, _onClick: function _onClick(e, target) {\n        this.fireEvent(\"click\", e, target);\n      }, _fill: function _fill() {\n        var el = this.getDom();var vpRect = uiUtils.getViewportRect();el.style.width = vpRect.width + \"px\";el.style.height = vpRect.height + \"px\";\n      } };utils.inherits(Mask, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        domUtils = baidu.editor.dom.domUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        Popup = baidu.editor.ui.Popup = function (options) {\n      this.initOptions(options);this.initPopup();\n    };var allPopups = [];function closeAllPopup(evt, el) {\n      for (var i = 0; i < allPopups.length; i++) {\n        var pop = allPopups[i];if (!pop.isHidden()) {\n          if (pop.queryAutoHide(el) !== false) {\n            if (evt && /scroll/gi.test(evt.type) && pop.className == \"edui-wordpastepop\") return;pop.hide();\n          }\n        }\n      }if (allPopups.length) pop.editor.fireEvent(\"afterhidepop\");\n    }Popup.postHide = closeAllPopup;var ANCHOR_CLASSES = [\"edui-anchor-topleft\", \"edui-anchor-topright\", \"edui-anchor-bottomleft\", \"edui-anchor-bottomright\"];Popup.prototype = { SHADOW_RADIUS: 5, content: null, _hidden: false, autoRender: true, canSideLeft: true, canSideUp: true, initPopup: function initPopup() {\n        this.initUIBase();allPopups.push(this);\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-popup %%\" onmousedown=\"return false;\">' + ' <div id=\"##_body\" class=\"edui-popup-body\">' + ' <iframe style=\"position:absolute;z-index:-1;left:0;top:0;background-color: transparent;\" frameborder=\"0\" width=\"100%\" height=\"100%\" src=\"about:blank\"></iframe>' + ' <div class=\"edui-shadow\"></div>' + ' <div id=\"##_content\" class=\"edui-popup-content\">' + this.getContentHtmlTpl() + \"  </div>\" + \" </div>\" + \"</div>\";\n      }, getContentHtmlTpl: function getContentHtmlTpl() {\n        if (this.content) {\n          if (typeof this.content == \"string\") {\n            return this.content;\n          }return this.content.renderHtml();\n        } else {\n          return \"\";\n        }\n      }, _UIBase_postRender: UIBase.prototype.postRender, postRender: function postRender() {\n        if (this.content instanceof UIBase) {\n          this.content.postRender();\n        }if (this.captureWheel && !this.captured) {\n          this.captured = true;var winHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 80,\n              _height = this.getDom().offsetHeight,\n              _top = uiUtils.getClientRect(this.combox.getDom()).top,\n              content = this.getDom(\"content\"),\n              ifr = this.getDom(\"body\").getElementsByTagName(\"iframe\"),\n              me = this;ifr.length && (ifr = ifr[0]);while (_top + _height > winHeight) {\n            _height -= 30;\n          }content.style.height = _height + \"px\";ifr && (ifr.style.height = _height + \"px\");if (window.XMLHttpRequest) {\n            domUtils.on(content, \"onmousewheel\" in document.body ? \"mousewheel\" : \"DOMMouseScroll\", function (e) {\n              if (e.preventDefault) {\n                e.preventDefault();\n              } else {\n                e.returnValue = false;\n              }if (e.wheelDelta) {\n                content.scrollTop -= e.wheelDelta / 120 * 60;\n              } else {\n                content.scrollTop -= e.detail / -3 * 60;\n              }\n            });\n          } else {\n            domUtils.on(this.getDom(), \"mousewheel\", function (e) {\n              e.returnValue = false;me.getDom(\"content\").scrollTop -= e.wheelDelta / 120 * 60;\n            });\n          }\n        }this.fireEvent(\"postRenderAfter\");this.hide(true);this._UIBase_postRender();\n      }, _doAutoRender: function _doAutoRender() {\n        if (!this.getDom() && this.autoRender) {\n          this.render();\n        }\n      }, mesureSize: function mesureSize() {\n        var box = this.getDom(\"content\");return uiUtils.getClientRect(box);\n      }, fitSize: function fitSize() {\n        if (this.captureWheel && this.sized) {\n          return this.__size;\n        }this.sized = true;var popBodyEl = this.getDom(\"body\");popBodyEl.style.width = \"\";popBodyEl.style.height = \"\";var size = this.mesureSize();if (this.captureWheel) {\n          popBodyEl.style.width = -(-20 - size.width) + \"px\";var height = parseInt(this.getDom(\"content\").style.height, 10);!window.isNaN(height) && (size.height = height);\n        } else {\n          popBodyEl.style.width = size.width + \"px\";\n        }popBodyEl.style.height = size.height + \"px\";this.__size = size;this.captureWheel && (this.getDom(\"content\").style.overflow = \"auto\");return size;\n      }, showAnchor: function showAnchor(element, hoz) {\n        this.showAnchorRect(uiUtils.getClientRect(element), hoz);\n      }, showAnchorRect: function showAnchorRect(rect, hoz, adj) {\n        this._doAutoRender();var vpRect = uiUtils.getViewportRect();this.getDom().style.visibility = \"hidden\";this._show();var popSize = this.fitSize();var sideLeft, sideUp, left, top;if (hoz) {\n          sideLeft = this.canSideLeft && rect.right + popSize.width > vpRect.right && rect.left > popSize.width;sideUp = this.canSideUp && rect.top + popSize.height > vpRect.bottom && rect.bottom > popSize.height;left = sideLeft ? rect.left - popSize.width : rect.right;top = sideUp ? rect.bottom - popSize.height : rect.top;\n        } else {\n          sideLeft = this.canSideLeft && rect.right + popSize.width > vpRect.right && rect.left > popSize.width;sideUp = this.canSideUp && rect.top + popSize.height > vpRect.bottom && rect.bottom > popSize.height;left = sideLeft ? rect.right - popSize.width : rect.left;top = sideUp ? rect.top - popSize.height : rect.bottom;\n        }var popEl = this.getDom();uiUtils.setViewportOffset(popEl, { left: left, top: top });domUtils.removeClasses(popEl, ANCHOR_CLASSES);popEl.className += \" \" + ANCHOR_CLASSES[(sideUp ? 1 : 0) * 2 + (sideLeft ? 1 : 0)];if (this.editor) {\n          popEl.style.zIndex = this.editor.container.style.zIndex * 1 + 10;baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = popEl.style.zIndex - 1;\n        }this.getDom().style.visibility = \"visible\";\n      }, showAt: function showAt(offset) {\n        var left = offset.left;var top = offset.top;var rect = { left: left, top: top, right: left, bottom: top, height: 0, width: 0 };this.showAnchorRect(rect, false, true);\n      }, _show: function _show() {\n        if (this._hidden) {\n          var box = this.getDom();box.style.display = \"\";this._hidden = false;this.fireEvent(\"show\");\n        }\n      }, isHidden: function isHidden() {\n        return this._hidden;\n      }, show: function show() {\n        this._doAutoRender();this._show();\n      }, hide: function hide(notNofity) {\n        if (!this._hidden && this.getDom()) {\n          this.getDom().style.display = \"none\";this._hidden = true;if (!notNofity) {\n            this.fireEvent(\"hide\");\n          }\n        }\n      }, queryAutoHide: function queryAutoHide(el) {\n        return !el || !uiUtils.contains(this.getDom(), el);\n      } };utils.inherits(Popup, UIBase);domUtils.on(document, \"mousedown\", function (evt) {\n      var el = evt.target || evt.srcElement;closeAllPopup(evt, el);\n    });domUtils.on(window, \"scroll\", function (evt, el) {\n      closeAllPopup(evt, el);\n    });\n  }();!function () {\n    var utils = baidu.editor.utils,\n        UIBase = baidu.editor.ui.UIBase,\n        ColorPicker = baidu.editor.ui.ColorPicker = function (options) {\n      this.initOptions(options);this.noColorText = this.noColorText || this.editor.getLang(\"clearColor\");this.initUIBase();\n    };ColorPicker.prototype = { getHtmlTpl: function getHtmlTpl() {\n        return genColorPicker(this.noColorText, this.editor);\n      }, _onTableClick: function _onTableClick(evt) {\n        var tgt = evt.target || evt.srcElement;var color = tgt.getAttribute(\"data-color\");if (color) {\n          this.fireEvent(\"pickcolor\", color);\n        }\n      }, _onTableOver: function _onTableOver(evt) {\n        var tgt = evt.target || evt.srcElement;var color = tgt.getAttribute(\"data-color\");if (color) {\n          this.getDom(\"preview\").style.backgroundColor = color;\n        }\n      }, _onTableOut: function _onTableOut() {\n        this.getDom(\"preview\").style.backgroundColor = \"\";\n      }, _onPickNoColor: function _onPickNoColor() {\n        this.fireEvent(\"picknocolor\");\n      } };utils.inherits(ColorPicker, UIBase);var COLORS = (\"ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,\" + \"f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,\" + \"d8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,\" + \"bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,\" + \"a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,\" + \"7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,\" + \"c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,\").split(\",\");function genColorPicker(noColorText, editor) {\n      var html = '<div id=\"##\" class=\"edui-colorpicker %%\">' + '<div class=\"edui-colorpicker-topbar edui-clearfix\">' + '<div unselectable=\"on\" id=\"##_preview\" class=\"edui-colorpicker-preview\"></div>' + '<div unselectable=\"on\" class=\"edui-colorpicker-nocolor\" onclick=\"$$._onPickNoColor(event, this);\">' + noColorText + \"</div>\" + \"</div>\" + '<table  class=\"edui-box\" style=\"border-collapse: collapse;\" onmouseover=\"$$._onTableOver(event, this);\" onmouseout=\"$$._onTableOut(event, this);\" onclick=\"return $$._onTableClick(event, this);\" cellspacing=\"0\" cellpadding=\"0\">' + '<tr style=\"border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px\"><td colspan=\"10\">' + editor.getLang(\"themeColor\") + \"</td> </tr>\" + '<tr class=\"edui-colorpicker-tablefirstrow\" >';for (var i = 0; i < COLORS.length; i++) {\n        if (i && i % 10 === 0) {\n          html += \"</tr>\" + (i == 60 ? '<tr style=\"border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;\"><td colspan=\"10\">' + editor.getLang(\"standardColor\") + \"</td></tr>\" : \"\") + \"<tr\" + (i == 60 ? ' class=\"edui-colorpicker-tablefirstrow\"' : \"\") + \">\";\n        }html += i < 70 ? '<td style=\"padding: 0 2px;\"><a hidefocus title=\"' + COLORS[i] + '\" onclick=\"return false;\" href=\"javascript:\" unselectable=\"on\" class=\"edui-box edui-colorpicker-colorcell\"' + ' data-color=\"#' + COLORS[i] + '\"' + ' style=\"background-color:#' + COLORS[i] + \";border:solid #ccc;\" + (i < 10 || i >= 60 ? \"border-width:1px;\" : i >= 10 && i < 20 ? \"border-width:1px 1px 0 1px;\" : \"border-width:0 1px 0 1px;\") + '\"' + \"></a></td>\" : \"\";\n      }html += \"</tr></table></div>\";return html;\n    }\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        UIBase = baidu.editor.ui.UIBase;var TablePicker = baidu.editor.ui.TablePicker = function (options) {\n      this.initOptions(options);this.initTablePicker();\n    };TablePicker.prototype = { defaultNumRows: 10, defaultNumCols: 10, maxNumRows: 20, maxNumCols: 20, numRows: 10, numCols: 10, lengthOfCellSide: 22, initTablePicker: function initTablePicker() {\n        this.initUIBase();\n      }, getHtmlTpl: function getHtmlTpl() {\n        var me = this;return '<div id=\"##\" class=\"edui-tablepicker %%\">' + '<div class=\"edui-tablepicker-body\">' + '<div class=\"edui-infoarea\">' + '<span id=\"##_label\" class=\"edui-label\"></span>' + \"</div>\" + '<div class=\"edui-pickarea\"' + ' onmousemove=\"$$._onMouseMove(event, this);\"' + ' onmouseover=\"$$._onMouseOver(event, this);\"' + ' onmouseout=\"$$._onMouseOut(event, this);\"' + ' onclick=\"$$._onClick(event, this);\"' + \">\" + '<div id=\"##_overlay\" class=\"edui-overlay\"></div>' + \"</div>\" + \"</div>\" + \"</div>\";\n      }, _UIBase_render: UIBase.prototype.render, render: function render(holder) {\n        this._UIBase_render(holder);this.getDom(\"label\").innerHTML = \"0\" + this.editor.getLang(\"t_row\") + \" x 0\" + this.editor.getLang(\"t_col\");\n      }, _track: function _track(numCols, numRows) {\n        var style = this.getDom(\"overlay\").style;var sideLen = this.lengthOfCellSide;style.width = numCols * sideLen + \"px\";style.height = numRows * sideLen + \"px\";var label = this.getDom(\"label\");label.innerHTML = numCols + this.editor.getLang(\"t_col\") + \" x \" + numRows + this.editor.getLang(\"t_row\");this.numCols = numCols;this.numRows = numRows;\n      }, _onMouseOver: function _onMouseOver(evt, el) {\n        var rel = evt.relatedTarget || evt.fromElement;if (!uiUtils.contains(el, rel) && el !== rel) {\n          this.getDom(\"label\").innerHTML = \"0\" + this.editor.getLang(\"t_col\") + \" x 0\" + this.editor.getLang(\"t_row\");this.getDom(\"overlay\").style.visibility = \"\";\n        }\n      }, _onMouseOut: function _onMouseOut(evt, el) {\n        var rel = evt.relatedTarget || evt.toElement;if (!uiUtils.contains(el, rel) && el !== rel) {\n          this.getDom(\"label\").innerHTML = \"0\" + this.editor.getLang(\"t_col\") + \" x 0\" + this.editor.getLang(\"t_row\");this.getDom(\"overlay\").style.visibility = \"hidden\";\n        }\n      }, _onMouseMove: function _onMouseMove(evt, el) {\n        var style = this.getDom(\"overlay\").style;var offset = uiUtils.getEventOffset(evt);var sideLen = this.lengthOfCellSide;var numCols = Math.ceil(offset.left / sideLen);var numRows = Math.ceil(offset.top / sideLen);this._track(numCols, numRows);\n      }, _onClick: function _onClick() {\n        this.fireEvent(\"picktable\", this.numCols, this.numRows);\n      } };utils.inherits(TablePicker, UIBase);\n  }();!function () {\n    var browser = baidu.editor.browser,\n        domUtils = baidu.editor.dom.domUtils,\n        uiUtils = baidu.editor.ui.uiUtils;var TPL_STATEFUL = 'onmousedown=\"$$.Stateful_onMouseDown(event, this);\"' + ' onmouseup=\"$$.Stateful_onMouseUp(event, this);\"' + (browser.ie ? ' onmouseenter=\"$$.Stateful_onMouseEnter(event, this);\"' + ' onmouseleave=\"$$.Stateful_onMouseLeave(event, this);\"' : ' onmouseover=\"$$.Stateful_onMouseOver(event, this);\"' + ' onmouseout=\"$$.Stateful_onMouseOut(event, this);\"');baidu.editor.ui.Stateful = { alwalysHoverable: false, target: null, Stateful_init: function Stateful_init() {\n        this._Stateful_dGetHtmlTpl = this.getHtmlTpl;this.getHtmlTpl = this.Stateful_getHtmlTpl;\n      }, Stateful_getHtmlTpl: function Stateful_getHtmlTpl() {\n        var tpl = this._Stateful_dGetHtmlTpl();return tpl.replace(/stateful/g, function () {\n          return TPL_STATEFUL;\n        });\n      }, Stateful_onMouseEnter: function Stateful_onMouseEnter(evt, el) {\n        this.target = el;if (!this.isDisabled() || this.alwalysHoverable) {\n          this.addState(\"hover\");this.fireEvent(\"over\");\n        }\n      }, Stateful_onMouseLeave: function Stateful_onMouseLeave(evt, el) {\n        if (!this.isDisabled() || this.alwalysHoverable) {\n          this.removeState(\"hover\");this.removeState(\"active\");this.fireEvent(\"out\");\n        }\n      }, Stateful_onMouseOver: function Stateful_onMouseOver(evt, el) {\n        var rel = evt.relatedTarget;if (!uiUtils.contains(el, rel) && el !== rel) {\n          this.Stateful_onMouseEnter(evt, el);\n        }\n      }, Stateful_onMouseOut: function Stateful_onMouseOut(evt, el) {\n        var rel = evt.relatedTarget;if (!uiUtils.contains(el, rel) && el !== rel) {\n          this.Stateful_onMouseLeave(evt, el);\n        }\n      }, Stateful_onMouseDown: function Stateful_onMouseDown(evt, el) {\n        if (!this.isDisabled()) {\n          this.addState(\"active\");\n        }\n      }, Stateful_onMouseUp: function Stateful_onMouseUp(evt, el) {\n        if (!this.isDisabled()) {\n          this.removeState(\"active\");\n        }\n      }, Stateful_postRender: function Stateful_postRender() {\n        if (this.disabled && !this.hasState(\"disabled\")) {\n          this.addState(\"disabled\");\n        }\n      }, hasState: function hasState(state) {\n        return domUtils.hasClass(this.getStateDom(), \"edui-state-\" + state);\n      }, addState: function addState(state) {\n        if (!this.hasState(state)) {\n          this.getStateDom().className += \" edui-state-\" + state;\n        }\n      }, removeState: function removeState(state) {\n        if (this.hasState(state)) {\n          domUtils.removeClasses(this.getStateDom(), [\"edui-state-\" + state]);\n        }\n      }, getStateDom: function getStateDom() {\n        return this.getDom(\"state\");\n      }, isChecked: function isChecked() {\n        return this.hasState(\"checked\");\n      }, setChecked: function setChecked(checked) {\n        if (!this.isDisabled() && checked) {\n          this.addState(\"checked\");\n        } else {\n          this.removeState(\"checked\");\n        }\n      }, isDisabled: function isDisabled() {\n        return this.hasState(\"disabled\");\n      }, setDisabled: function setDisabled(disabled) {\n        if (disabled) {\n          this.removeState(\"hover\");this.removeState(\"checked\");this.removeState(\"active\");this.addState(\"disabled\");\n        } else {\n          this.removeState(\"disabled\");\n        }\n      } };\n  }();!function () {\n    var utils = baidu.editor.utils,\n        UIBase = baidu.editor.ui.UIBase,\n        Stateful = baidu.editor.ui.Stateful,\n        Button = baidu.editor.ui.Button = function (options) {\n      if (options.name) {\n        var btnName = options.name;var cssRules = options.cssRules;if (!options.className) {\n          options.className = \"edui-for-\" + btnName;\n        }options.cssRules = \".edui-default  .edui-for-\" + btnName + \" .edui-icon {\" + cssRules + \"}\";\n      }this.initOptions(options);this.initButton();\n    };Button.prototype = { uiName: \"button\", label: \"\", title: \"\", showIcon: true, showText: true, cssRules: \"\", initButton: function initButton() {\n        this.initUIBase();this.Stateful_init();if (this.cssRules) {\n          utils.cssRule(\"edui-customize-\" + this.name + \"-style\", this.cssRules);\n        }\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-box %%\">' + '<div id=\"##_state\" stateful>' + '<div class=\"%%-wrap\"><div id=\"##_body\" unselectable=\"on\" ' + (this.title ? 'title=\"' + this.title + '\"' : \"\") + ' class=\"%%-body\" onmousedown=\"return $$._onMouseDown(event, this);\" onclick=\"return $$._onClick(event, this);\">' + (this.showIcon ? '<div class=\"edui-box edui-icon\"></div>' : \"\") + (this.showText ? '<div class=\"edui-box edui-label\">' + this.label + \"</div>\" : \"\") + \"</div>\" + \"</div>\" + \"</div></div>\";\n      }, postRender: function postRender() {\n        this.Stateful_postRender();this.setDisabled(this.disabled);\n      }, _onMouseDown: function _onMouseDown(e) {\n        var target = e.target || e.srcElement,\n            tagName = target && target.tagName && target.tagName.toLowerCase();if (tagName == \"input\" || tagName == \"object\" || tagName == \"object\") {\n          return false;\n        }\n      }, _onClick: function _onClick() {\n        if (!this.isDisabled()) {\n          this.fireEvent(\"click\");\n        }\n      }, setTitle: function setTitle(text) {\n        var label = this.getDom(\"label\");label.innerHTML = text;\n      } };utils.inherits(Button, UIBase);utils.extend(Button.prototype, Stateful);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        domUtils = baidu.editor.dom.domUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        Stateful = baidu.editor.ui.Stateful,\n        SplitButton = baidu.editor.ui.SplitButton = function (options) {\n      this.initOptions(options);this.initSplitButton();\n    };SplitButton.prototype = { popup: null, uiName: \"splitbutton\", title: \"\", initSplitButton: function initSplitButton() {\n        this.initUIBase();this.Stateful_init();var me = this;if (this.popup != null) {\n          var popup = this.popup;this.popup = null;this.setPopup(popup);\n        }\n      }, _UIBase_postRender: UIBase.prototype.postRender, postRender: function postRender() {\n        this.Stateful_postRender();this._UIBase_postRender();\n      }, setPopup: function setPopup(popup) {\n        if (this.popup === popup) return;if (this.popup != null) {\n          this.popup.dispose();\n        }popup.addListener(\"show\", utils.bind(this._onPopupShow, this));popup.addListener(\"hide\", utils.bind(this._onPopupHide, this));popup.addListener(\"postrender\", utils.bind(function () {\n          popup.getDom(\"body\").appendChild(uiUtils.createElementByHtml('<div id=\"' + this.popup.id + '_bordereraser\" class=\"edui-bordereraser edui-background\" style=\"width:' + (uiUtils.getClientRect(this.getDom()).width + 20) + 'px\"></div>'));popup.getDom().className += \" \" + this.className;\n        }, this));this.popup = popup;\n      }, _onPopupShow: function _onPopupShow() {\n        this.addState(\"opened\");\n      }, _onPopupHide: function _onPopupHide() {\n        this.removeState(\"opened\");\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-box %%\">' + \"<div \" + (this.title ? 'title=\"' + this.title + '\"' : \"\") + ' id=\"##_state\" stateful><div class=\"%%-body\">' + '<div id=\"##_button_body\" class=\"edui-box edui-button-body\" onclick=\"$$._onButtonClick(event, this);\">' + '<div class=\"edui-box edui-icon\"></div>' + \"</div>\" + '<div class=\"edui-box edui-splitborder\"></div>' + '<div class=\"edui-box edui-arrow\" onclick=\"$$._onArrowClick();\"></div>' + \"</div></div></div>\";\n      }, showPopup: function showPopup() {\n        var rect = uiUtils.getClientRect(this.getDom());rect.top -= this.popup.SHADOW_RADIUS;rect.height += this.popup.SHADOW_RADIUS;this.popup.showAnchorRect(rect);\n      }, _onArrowClick: function _onArrowClick(event, el) {\n        if (!this.isDisabled()) {\n          this.showPopup();\n        }\n      }, _onButtonClick: function _onButtonClick() {\n        if (!this.isDisabled()) {\n          this.fireEvent(\"buttonclick\");\n        }\n      } };utils.inherits(SplitButton, UIBase);utils.extend(SplitButton.prototype, Stateful, true);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        ColorPicker = baidu.editor.ui.ColorPicker,\n        Popup = baidu.editor.ui.Popup,\n        SplitButton = baidu.editor.ui.SplitButton,\n        ColorButton = baidu.editor.ui.ColorButton = function (options) {\n      this.initOptions(options);this.initColorButton();\n    };ColorButton.prototype = { initColorButton: function initColorButton() {\n        var me = this;this.popup = new Popup({ content: new ColorPicker({ noColorText: me.editor.getLang(\"clearColor\"), editor: me.editor, onpickcolor: function onpickcolor(t, color) {\n              me._onPickColor(color);\n            }, onpicknocolor: function onpicknocolor(t, color) {\n              me._onPickNoColor(color);\n            } }), editor: me.editor });this.initSplitButton();\n      }, _SplitButton_postRender: SplitButton.prototype.postRender, postRender: function postRender() {\n        this._SplitButton_postRender();this.getDom(\"button_body\").appendChild(uiUtils.createElementByHtml('<div id=\"' + this.id + '_colorlump\" class=\"edui-colorlump\"></div>'));this.getDom().className += \" edui-colorbutton\";\n      }, setColor: function setColor(color) {\n        this.getDom(\"colorlump\").style.backgroundColor = color;this.color = color;\n      }, _onPickColor: function _onPickColor(color) {\n        if (this.fireEvent(\"pickcolor\", color) !== false) {\n          this.setColor(color);this.popup.hide();\n        }\n      }, _onPickNoColor: function _onPickNoColor(color) {\n        if (this.fireEvent(\"picknocolor\") !== false) {\n          this.popup.hide();\n        }\n      } };utils.inherits(ColorButton, SplitButton);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Popup = baidu.editor.ui.Popup,\n        TablePicker = baidu.editor.ui.TablePicker,\n        SplitButton = baidu.editor.ui.SplitButton,\n        TableButton = baidu.editor.ui.TableButton = function (options) {\n      this.initOptions(options);this.initTableButton();\n    };TableButton.prototype = { initTableButton: function initTableButton() {\n        var me = this;this.popup = new Popup({ content: new TablePicker({ editor: me.editor, onpicktable: function onpicktable(t, numCols, numRows) {\n              me._onPickTable(numCols, numRows);\n            } }), editor: me.editor });this.initSplitButton();\n      }, _onPickTable: function _onPickTable(numCols, numRows) {\n        if (this.fireEvent(\"picktable\", numCols, numRows) !== false) {\n          this.popup.hide();\n        }\n      } };utils.inherits(TableButton, SplitButton);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        UIBase = baidu.editor.ui.UIBase;var AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker = function (options) {\n      this.initOptions(options);this.initAutoTypeSetPicker();\n    };AutoTypeSetPicker.prototype = { initAutoTypeSetPicker: function initAutoTypeSetPicker() {\n        this.initUIBase();\n      }, getHtmlTpl: function getHtmlTpl() {\n        var me = this.editor,\n            opt = me.options.autotypeset,\n            lang = me.getLang(\"autoTypeSet\");var textAlignInputName = \"textAlignValue\" + me.uid,\n            imageBlockInputName = \"imageBlockLineValue\" + me.uid,\n            symbolConverInputName = \"symbolConverValue\" + me.uid;return '<div id=\"##\" class=\"edui-autotypesetpicker %%\">' + '<div class=\"edui-autotypesetpicker-body\">' + \"<table >\" + '<tr><td nowrap><input type=\"checkbox\" name=\"mergeEmptyline\" ' + (opt[\"mergeEmptyline\"] ? \"checked\" : \"\") + \">\" + lang.mergeLine + '</td><td colspan=\"2\"><input type=\"checkbox\" name=\"removeEmptyline\" ' + (opt[\"removeEmptyline\"] ? \"checked\" : \"\") + \">\" + lang.delLine + \"</td></tr>\" + '<tr><td nowrap><input type=\"checkbox\" name=\"removeClass\" ' + (opt[\"removeClass\"] ? \"checked\" : \"\") + \">\" + lang.removeFormat + '</td><td colspan=\"2\"><input type=\"checkbox\" name=\"indent\" ' + (opt[\"indent\"] ? \"checked\" : \"\") + \">\" + lang.indent + \"</td></tr>\" + \"<tr>\" + '<td nowrap><input type=\"checkbox\" name=\"textAlign\" ' + (opt[\"textAlign\"] ? \"checked\" : \"\") + \">\" + lang.alignment + \"</td>\" + '<td colspan=\"2\" id=\"' + textAlignInputName + '\">' + '<input type=\"radio\" name=\"' + textAlignInputName + '\" value=\"left\" ' + (opt[\"textAlign\"] && opt[\"textAlign\"] == \"left\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifyleft\") + '<input type=\"radio\" name=\"' + textAlignInputName + '\" value=\"center\" ' + (opt[\"textAlign\"] && opt[\"textAlign\"] == \"center\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifycenter\") + '<input type=\"radio\" name=\"' + textAlignInputName + '\" value=\"right\" ' + (opt[\"textAlign\"] && opt[\"textAlign\"] == \"right\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifyright\") + \"</td>\" + \"</tr>\" + \"<tr>\" + '<td nowrap><input type=\"checkbox\" name=\"imageBlockLine\" ' + (opt[\"imageBlockLine\"] ? \"checked\" : \"\") + \">\" + lang.imageFloat + \"</td>\" + '<td nowrap id=\"' + imageBlockInputName + '\">' + '<input type=\"radio\" name=\"' + imageBlockInputName + '\" value=\"none\" ' + (opt[\"imageBlockLine\"] && opt[\"imageBlockLine\"] == \"none\" ? \"checked\" : \"\") + \">\" + me.getLang(\"default\") + '<input type=\"radio\" name=\"' + imageBlockInputName + '\" value=\"left\" ' + (opt[\"imageBlockLine\"] && opt[\"imageBlockLine\"] == \"left\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifyleft\") + '<input type=\"radio\" name=\"' + imageBlockInputName + '\" value=\"center\" ' + (opt[\"imageBlockLine\"] && opt[\"imageBlockLine\"] == \"center\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifycenter\") + '<input type=\"radio\" name=\"' + imageBlockInputName + '\" value=\"right\" ' + (opt[\"imageBlockLine\"] && opt[\"imageBlockLine\"] == \"right\" ? \"checked\" : \"\") + \">\" + me.getLang(\"justifyright\") + \"</td>\" + \"</tr>\" + '<tr><td nowrap><input type=\"checkbox\" name=\"clearFontSize\" ' + (opt[\"clearFontSize\"] ? \"checked\" : \"\") + \">\" + lang.removeFontsize + '</td><td colspan=\"2\"><input type=\"checkbox\" name=\"clearFontFamily\" ' + (opt[\"clearFontFamily\"] ? \"checked\" : \"\") + \">\" + lang.removeFontFamily + \"</td></tr>\" + '<tr><td nowrap colspan=\"3\"><input type=\"checkbox\" name=\"removeEmptyNode\" ' + (opt[\"removeEmptyNode\"] ? \"checked\" : \"\") + \">\" + lang.removeHtml + \"</td></tr>\" + '<tr><td nowrap colspan=\"3\"><input type=\"checkbox\" name=\"pasteFilter\" ' + (opt[\"pasteFilter\"] ? \"checked\" : \"\") + \">\" + lang.pasteFilter + \"</td></tr>\" + \"<tr>\" + '<td nowrap><input type=\"checkbox\" name=\"symbolConver\" ' + (opt[\"bdc2sb\"] || opt[\"tobdc\"] ? \"checked\" : \"\") + \">\" + lang.symbol + \"</td>\" + '<td id=\"' + symbolConverInputName + '\">' + '<input type=\"radio\" name=\"bdc\" value=\"bdc2sb\" ' + (opt[\"bdc2sb\"] ? \"checked\" : \"\") + \">\" + lang.bdc2sb + '<input type=\"radio\" name=\"bdc\" value=\"tobdc\" ' + (opt[\"tobdc\"] ? \"checked\" : \"\") + \">\" + lang.tobdc + \"\" + \"</td>\" + '<td nowrap align=\"right\"><button >' + lang.run + \"</button></td>\" + \"</tr>\" + \"</table>\" + \"</div>\" + \"</div>\";\n      }, _UIBase_render: UIBase.prototype.render };utils.inherits(AutoTypeSetPicker, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Popup = baidu.editor.ui.Popup,\n        AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker,\n        SplitButton = baidu.editor.ui.SplitButton,\n        AutoTypeSetButton = baidu.editor.ui.AutoTypeSetButton = function (options) {\n      this.initOptions(options);this.initAutoTypeSetButton();\n    };function getPara(me) {\n      var opt = {},\n          cont = me.getDom(),\n          editorId = me.editor.uid,\n          inputType = null,\n          attrName = null,\n          ipts = domUtils.getElementsByTagName(cont, \"input\");for (var i = ipts.length - 1, ipt; ipt = ipts[i--];) {\n        inputType = ipt.getAttribute(\"type\");if (inputType == \"checkbox\") {\n          attrName = ipt.getAttribute(\"name\");opt[attrName] && delete opt[attrName];if (ipt.checked) {\n            var attrValue = document.getElementById(attrName + \"Value\" + editorId);if (attrValue) {\n              if (/input/gi.test(attrValue.tagName)) {\n                opt[attrName] = attrValue.value;\n              } else {\n                var iptChilds = attrValue.getElementsByTagName(\"input\");for (var j = iptChilds.length - 1, iptchild; iptchild = iptChilds[j--];) {\n                  if (iptchild.checked) {\n                    opt[attrName] = iptchild.value;break;\n                  }\n                }\n              }\n            } else {\n              opt[attrName] = true;\n            }\n          } else {\n            opt[attrName] = false;\n          }\n        } else {\n          opt[ipt.getAttribute(\"value\")] = ipt.checked;\n        }\n      }var selects = domUtils.getElementsByTagName(cont, \"select\");for (var i = 0, si; si = selects[i++];) {\n        var attr = si.getAttribute(\"name\");opt[attr] = opt[attr] ? si.value : \"\";\n      }utils.extend(me.editor.options.autotypeset, opt);me.editor.setPreferences(\"autotypeset\", opt);\n    }AutoTypeSetButton.prototype = { initAutoTypeSetButton: function initAutoTypeSetButton() {\n        var me = this;this.popup = new Popup({ content: new AutoTypeSetPicker({ editor: me.editor }), editor: me.editor, hide: function hide() {\n            if (!this._hidden && this.getDom()) {\n              getPara(this);this.getDom().style.display = \"none\";this._hidden = true;this.fireEvent(\"hide\");\n            }\n          } });var flag = 0;this.popup.addListener(\"postRenderAfter\", function () {\n          var popupUI = this;if (flag) return;var cont = this.getDom(),\n              btn = cont.getElementsByTagName(\"button\")[0];btn.onclick = function () {\n            getPara(popupUI);me.editor.execCommand(\"autotypeset\");popupUI.hide();\n          };domUtils.on(cont, \"click\", function (e) {\n            var target = e.target || e.srcElement,\n                editorId = me.editor.uid;if (target && target.tagName == \"INPUT\") {\n              if (target.name == \"imageBlockLine\" || target.name == \"textAlign\" || target.name == \"symbolConver\") {\n                var checked = target.checked,\n                    radioTd = document.getElementById(target.name + \"Value\" + editorId),\n                    radios = radioTd.getElementsByTagName(\"input\"),\n                    defalutSelect = { imageBlockLine: \"none\", textAlign: \"left\", symbolConver: \"tobdc\" };for (var i = 0; i < radios.length; i++) {\n                  if (checked) {\n                    if (radios[i].value == defalutSelect[target.name]) {\n                      radios[i].checked = \"checked\";\n                    }\n                  } else {\n                    radios[i].checked = false;\n                  }\n                }\n              }if (target.name == \"imageBlockLineValue\" + editorId || target.name == \"textAlignValue\" + editorId || target.name == \"bdc\") {\n                var checkboxs = target.parentNode.previousSibling.getElementsByTagName(\"input\");checkboxs && (checkboxs[0].checked = true);\n              }getPara(popupUI);\n            }\n          });flag = 1;\n        });this.initSplitButton();\n      } };utils.inherits(AutoTypeSetButton, SplitButton);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Popup = baidu.editor.ui.Popup,\n        Stateful = baidu.editor.ui.Stateful,\n        UIBase = baidu.editor.ui.UIBase;var CellAlignPicker = baidu.editor.ui.CellAlignPicker = function (options) {\n      this.initOptions(options);this.initSelected();this.initCellAlignPicker();\n    };CellAlignPicker.prototype = { initSelected: function initSelected() {\n        var status = { valign: { top: 0, middle: 1, bottom: 2 }, align: { left: 0, center: 1, right: 2 }, count: 3 },\n            result = -1;if (this.selected) {\n          this.selectedIndex = status.valign[this.selected.valign] * status.count + status.align[this.selected.align];\n        }\n      }, initCellAlignPicker: function initCellAlignPicker() {\n        this.initUIBase();this.Stateful_init();\n      }, getHtmlTpl: function getHtmlTpl() {\n        var alignType = [\"left\", \"center\", \"right\"],\n            COUNT = 9,\n            tempClassName = null,\n            tempIndex = -1,\n            tmpl = [];for (var i = 0; i < COUNT; i++) {\n          tempClassName = this.selectedIndex === i ? ' class=\"edui-cellalign-selected\" ' : \"\";tempIndex = i % 3;tempIndex === 0 && tmpl.push(\"<tr>\");tmpl.push('<td index=\"' + i + '\" ' + tempClassName + ' stateful><div class=\"edui-icon edui-' + alignType[tempIndex] + '\"></div></td>');tempIndex === 2 && tmpl.push(\"</tr>\");\n        }return '<div id=\"##\" class=\"edui-cellalignpicker %%\">' + '<div class=\"edui-cellalignpicker-body\">' + '<table onclick=\"$$._onClick(event);\">' + tmpl.join(\"\") + \"</table>\" + \"</div>\" + \"</div>\";\n      }, getStateDom: function getStateDom() {\n        return this.target;\n      }, _onClick: function _onClick(evt) {\n        var target = evt.target || evt.srcElement;if (/icon/.test(target.className)) {\n          this.items[target.parentNode.getAttribute(\"index\")].onclick();Popup.postHide(evt);\n        }\n      }, _UIBase_render: UIBase.prototype.render };utils.inherits(CellAlignPicker, UIBase);utils.extend(CellAlignPicker.prototype, Stateful, true);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Stateful = baidu.editor.ui.Stateful,\n        uiUtils = baidu.editor.ui.uiUtils,\n        UIBase = baidu.editor.ui.UIBase;var PastePicker = baidu.editor.ui.PastePicker = function (options) {\n      this.initOptions(options);this.initPastePicker();\n    };PastePicker.prototype = { initPastePicker: function initPastePicker() {\n        this.initUIBase();this.Stateful_init();\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div class=\"edui-pasteicon\" onclick=\"$$._onClick(this)\"></div>' + '<div class=\"edui-pastecontainer\">' + '<div class=\"edui-title\">' + this.editor.getLang(\"pasteOpt\") + \"</div>\" + '<div class=\"edui-button\">' + '<div title=\"' + this.editor.getLang(\"pasteSourceFormat\") + '\" onclick=\"$$.format(false)\" stateful>' + '<div class=\"edui-richtxticon\"></div></div>' + '<div title=\"' + this.editor.getLang(\"tagFormat\") + '\" onclick=\"$$.format(2)\" stateful>' + '<div class=\"edui-tagicon\"></div></div>' + '<div title=\"' + this.editor.getLang(\"pasteTextFormat\") + '\" onclick=\"$$.format(true)\" stateful>' + '<div class=\"edui-plaintxticon\"></div></div>' + \"</div>\" + \"</div>\" + \"</div>\";\n      }, getStateDom: function getStateDom() {\n        return this.target;\n      }, format: function format(param) {\n        this.editor.ui._isTransfer = true;this.editor.fireEvent(\"pasteTransfer\", param);\n      }, _onClick: function _onClick(cur) {\n        var node = domUtils.getNextDomNode(cur),\n            screenHt = uiUtils.getViewportRect().height,\n            subPop = uiUtils.getClientRect(node);if (subPop.top + subPop.height > screenHt) node.style.top = -subPop.height - cur.offsetHeight + \"px\";else node.style.top = \"\";if (/hidden/gi.test(domUtils.getComputedStyle(node, \"visibility\"))) {\n          node.style.visibility = \"visible\";domUtils.addClass(cur, \"edui-state-opened\");\n        } else {\n          node.style.visibility = \"hidden\";domUtils.removeClasses(cur, \"edui-state-opened\");\n        }\n      }, _UIBase_render: UIBase.prototype.render };utils.inherits(PastePicker, UIBase);utils.extend(PastePicker.prototype, Stateful, true);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        Toolbar = baidu.editor.ui.Toolbar = function (options) {\n      this.initOptions(options);this.initToolbar();\n    };Toolbar.prototype = { items: null, initToolbar: function initToolbar() {\n        this.items = this.items || [];this.initUIBase();\n      }, add: function add(item, index) {\n        if (index === undefined) {\n          this.items.push(item);\n        } else {\n          this.items.splice(index, 0, item);\n        }\n      }, getHtmlTpl: function getHtmlTpl() {\n        var buff = [];for (var i = 0; i < this.items.length; i++) {\n          buff[i] = this.items[i].renderHtml();\n        }return '<div id=\"##\" class=\"edui-toolbar %%\" onselectstart=\"return false;\" onmousedown=\"return $$._onMouseDown(event, this);\">' + buff.join(\"\") + \"</div>\";\n      }, postRender: function postRender() {\n        var box = this.getDom();for (var i = 0; i < this.items.length; i++) {\n          this.items[i].postRender();\n        }uiUtils.makeUnselectable(box);\n      }, _onMouseDown: function _onMouseDown(e) {\n        var target = e.target || e.srcElement,\n            tagName = target && target.tagName && target.tagName.toLowerCase();if (tagName == \"input\" || tagName == \"object\" || tagName == \"object\") {\n          return false;\n        }\n      } };utils.inherits(Toolbar, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        domUtils = baidu.editor.dom.domUtils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        Popup = baidu.editor.ui.Popup,\n        Stateful = baidu.editor.ui.Stateful,\n        CellAlignPicker = baidu.editor.ui.CellAlignPicker,\n        Menu = baidu.editor.ui.Menu = function (options) {\n      this.initOptions(options);this.initMenu();\n    };var menuSeparator = { renderHtml: function renderHtml() {\n        return '<div class=\"edui-menuitem edui-menuseparator\"><div class=\"edui-menuseparator-inner\"></div></div>';\n      }, postRender: function postRender() {}, queryAutoHide: function queryAutoHide() {\n        return true;\n      } };Menu.prototype = { items: null, uiName: \"menu\", initMenu: function initMenu() {\n        this.items = this.items || [];this.initPopup();this.initItems();\n      }, initItems: function initItems() {\n        for (var i = 0; i < this.items.length; i++) {\n          var item = this.items[i];if (item == \"-\") {\n            this.items[i] = this.getSeparator();\n          } else if (!(item instanceof MenuItem)) {\n            item.editor = this.editor;item.theme = this.editor.options.theme;this.items[i] = this.createItem(item);\n          }\n        }\n      }, getSeparator: function getSeparator() {\n        return menuSeparator;\n      }, createItem: function createItem(item) {\n        item.menu = this;return new MenuItem(item);\n      }, _Popup_getContentHtmlTpl: Popup.prototype.getContentHtmlTpl, getContentHtmlTpl: function getContentHtmlTpl() {\n        if (this.items.length == 0) {\n          return this._Popup_getContentHtmlTpl();\n        }var buff = [];for (var i = 0; i < this.items.length; i++) {\n          var item = this.items[i];buff[i] = item.renderHtml();\n        }return '<div class=\"%%-body\">' + buff.join(\"\") + \"</div>\";\n      }, _Popup_postRender: Popup.prototype.postRender, postRender: function postRender() {\n        var me = this;for (var i = 0; i < this.items.length; i++) {\n          var item = this.items[i];item.ownerMenu = this;item.postRender();\n        }domUtils.on(this.getDom(), \"mouseover\", function (evt) {\n          evt = evt || event;var rel = evt.relatedTarget || evt.fromElement;var el = me.getDom();if (!uiUtils.contains(el, rel) && el !== rel) {\n            me.fireEvent(\"over\");\n          }\n        });this._Popup_postRender();\n      }, queryAutoHide: function queryAutoHide(el) {\n        if (el) {\n          if (uiUtils.contains(this.getDom(), el)) {\n            return false;\n          }for (var i = 0; i < this.items.length; i++) {\n            var item = this.items[i];if (item.queryAutoHide(el) === false) {\n              return false;\n            }\n          }\n        }\n      }, clearItems: function clearItems() {\n        for (var i = 0; i < this.items.length; i++) {\n          var item = this.items[i];clearTimeout(item._showingTimer);clearTimeout(item._closingTimer);if (item.subMenu) {\n            item.subMenu.destroy();\n          }\n        }this.items = [];\n      }, destroy: function destroy() {\n        if (this.getDom()) {\n          domUtils.remove(this.getDom());\n        }this.clearItems();\n      }, dispose: function dispose() {\n        this.destroy();\n      } };utils.inherits(Menu, Popup);var MenuItem = baidu.editor.ui.MenuItem = function (options) {\n      this.initOptions(options);this.initUIBase();this.Stateful_init();if (this.subMenu && !(this.subMenu instanceof Menu)) {\n        if (options.className && options.className.indexOf(\"aligntd\") != -1) {\n          var me = this;this.subMenu.selected = this.editor.queryCommandValue(\"cellalignment\");this.subMenu = new Popup({ content: new CellAlignPicker(this.subMenu), parentMenu: me, editor: me.editor, destroy: function destroy() {\n              if (this.getDom()) {\n                domUtils.remove(this.getDom());\n              }\n            } });this.subMenu.addListener(\"postRenderAfter\", function () {\n            domUtils.on(this.getDom(), \"mouseover\", function () {\n              me.addState(\"opened\");\n            });\n          });\n        } else {\n          this.subMenu = new Menu(this.subMenu);\n        }\n      }\n    };MenuItem.prototype = { label: \"\", subMenu: null, ownerMenu: null, uiName: \"menuitem\", alwalysHoverable: true, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"%%\" stateful onclick=\"$$._onClick(event, this);\">' + '<div class=\"%%-body\">' + this.renderLabelHtml() + \"</div>\" + \"</div>\";\n      }, postRender: function postRender() {\n        var me = this;this.addListener(\"over\", function () {\n          me.ownerMenu.fireEvent(\"submenuover\", me);if (me.subMenu) {\n            me.delayShowSubMenu();\n          }\n        });if (this.subMenu) {\n          this.getDom().className += \" edui-hassubmenu\";this.subMenu.render();this.addListener(\"out\", function () {\n            me.delayHideSubMenu();\n          });this.subMenu.addListener(\"over\", function () {\n            clearTimeout(me._closingTimer);me._closingTimer = null;me.addState(\"opened\");\n          });this.ownerMenu.addListener(\"hide\", function () {\n            me.hideSubMenu();\n          });this.ownerMenu.addListener(\"submenuover\", function (t, subMenu) {\n            if (subMenu !== me) {\n              me.delayHideSubMenu();\n            }\n          });this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide;this.subMenu.queryAutoHide = function (el) {\n            if (el && uiUtils.contains(me.getDom(), el)) {\n              return false;\n            }return this._bakQueryAutoHide(el);\n          };\n        }this.getDom().style.tabIndex = \"-1\";uiUtils.makeUnselectable(this.getDom());this.Stateful_postRender();\n      }, delayShowSubMenu: function delayShowSubMenu() {\n        var me = this;if (!me.isDisabled()) {\n          me.addState(\"opened\");clearTimeout(me._showingTimer);clearTimeout(me._closingTimer);me._closingTimer = null;me._showingTimer = setTimeout(function () {\n            me.showSubMenu();\n          }, 250);\n        }\n      }, delayHideSubMenu: function delayHideSubMenu() {\n        var me = this;if (!me.isDisabled()) {\n          me.removeState(\"opened\");clearTimeout(me._showingTimer);if (!me._closingTimer) {\n            me._closingTimer = setTimeout(function () {\n              if (!me.hasState(\"opened\")) {\n                me.hideSubMenu();\n              }me._closingTimer = null;\n            }, 400);\n          }\n        }\n      }, renderLabelHtml: function renderLabelHtml() {\n        return '<div class=\"edui-arrow\"></div>' + '<div class=\"edui-box edui-icon\"></div>' + '<div class=\"edui-box edui-label %%-label\">' + (this.label || \"\") + \"</div>\";\n      }, getStateDom: function getStateDom() {\n        return this.getDom();\n      }, queryAutoHide: function queryAutoHide(el) {\n        if (this.subMenu && this.hasState(\"opened\")) {\n          return this.subMenu.queryAutoHide(el);\n        }\n      }, _onClick: function _onClick(event, this_) {\n        if (this.hasState(\"disabled\")) return;if (this.fireEvent(\"click\", event, this_) !== false) {\n          if (this.subMenu) {\n            this.showSubMenu();\n          } else {\n            Popup.postHide(event);\n          }\n        }\n      }, showSubMenu: function showSubMenu() {\n        var rect = uiUtils.getClientRect(this.getDom());rect.right -= 5;rect.left += 2;rect.width -= 7;rect.top -= 4;rect.bottom += 4;rect.height += 8;this.subMenu.showAnchorRect(rect, true, true);\n      }, hideSubMenu: function hideSubMenu() {\n        this.subMenu.hide();\n      } };utils.inherits(MenuItem, UIBase);utils.extend(MenuItem.prototype, Stateful, true);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        Menu = baidu.editor.ui.Menu,\n        SplitButton = baidu.editor.ui.SplitButton,\n        Combox = baidu.editor.ui.Combox = function (options) {\n      this.initOptions(options);this.initCombox();\n    };Combox.prototype = { uiName: \"combox\", onbuttonclick: function onbuttonclick() {\n        this.showPopup();\n      }, initCombox: function initCombox() {\n        var me = this;this.items = this.items || [];for (var i = 0; i < this.items.length; i++) {\n          var item = this.items[i];item.uiName = \"listitem\";item.index = i;item.onclick = function () {\n            me.selectByIndex(this.index);\n          };\n        }this.popup = new Menu({ items: this.items, uiName: \"list\", editor: this.editor, captureWheel: true, combox: this });this.initSplitButton();\n      }, _SplitButton_postRender: SplitButton.prototype.postRender, postRender: function postRender() {\n        this._SplitButton_postRender();this.setLabel(this.label || \"\");this.setValue(this.initValue || \"\");\n      }, showPopup: function showPopup() {\n        var rect = uiUtils.getClientRect(this.getDom());rect.top += 1;rect.bottom -= 1;rect.height -= 2;this.popup.showAnchorRect(rect);\n      }, getValue: function getValue() {\n        return this.value;\n      }, setValue: function setValue(value) {\n        var index = this.indexByValue(value);if (index != -1) {\n          this.selectedIndex = index;this.setLabel(this.items[index].label);this.value = this.items[index].value;\n        } else {\n          this.selectedIndex = -1;this.setLabel(this.getLabelForUnknowValue(value));this.value = value;\n        }\n      }, setLabel: function setLabel(label) {\n        this.getDom(\"button_body\").innerHTML = label;this.label = label;\n      }, getLabelForUnknowValue: function getLabelForUnknowValue(value) {\n        return value;\n      }, indexByValue: function indexByValue(value) {\n        for (var i = 0; i < this.items.length; i++) {\n          if (value == this.items[i].value) {\n            return i;\n          }\n        }return -1;\n      }, getItem: function getItem(index) {\n        return this.items[index];\n      }, selectByIndex: function selectByIndex(index) {\n        if (index < this.items.length && this.fireEvent(\"select\", index) !== false) {\n          this.selectedIndex = index;this.value = this.items[index].value;\n          this.setLabel(this.items[index].label);\n        }\n      } };utils.inherits(Combox, SplitButton);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        domUtils = baidu.editor.dom.domUtils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        Mask = baidu.editor.ui.Mask,\n        UIBase = baidu.editor.ui.UIBase,\n        Button = baidu.editor.ui.Button,\n        Dialog = baidu.editor.ui.Dialog = function (options) {\n      if (options.name) {\n        var name = options.name;var cssRules = options.cssRules;if (!options.className) {\n          options.className = \"edui-for-\" + name;\n        }if (cssRules) {\n          options.cssRules = \".edui-default .edui-for-\" + name + \" .edui-dialog-content  {\" + cssRules + \"}\";\n        }\n      }this.initOptions(utils.extend({ autoReset: true, draggable: true, onok: function onok() {}, oncancel: function oncancel() {}, onclose: function onclose(t, ok) {\n          return ok ? this.onok() : this.oncancel();\n        }, holdScroll: false }, options));this.initDialog();\n    };var modalMask;var dragMask;var activeDialog;Dialog.prototype = { draggable: false, uiName: \"dialog\", initDialog: function initDialog() {\n        var me = this,\n            theme = this.editor.options.theme;if (this.cssRules) {\n          utils.cssRule(\"edui-customize-\" + this.name + \"-style\", this.cssRules);\n        }this.initUIBase();this.modalMask = modalMask || (modalMask = new Mask({ className: \"edui-dialog-modalmask\", theme: theme, onclick: function onclick() {\n            activeDialog && activeDialog.close(false);\n          } }));this.dragMask = dragMask || (dragMask = new Mask({ className: \"edui-dialog-dragmask\", theme: theme }));this.closeButton = new Button({ className: \"edui-dialog-closebutton\", title: me.closeDialog, theme: theme, onclick: function onclick() {\n            me.close(false);\n          } });this.fullscreen && this.initResizeEvent();if (this.buttons) {\n          for (var i = 0; i < this.buttons.length; i++) {\n            if (!(this.buttons[i] instanceof Button)) {\n              this.buttons[i] = new Button(utils.extend(this.buttons[i], { editor: this.editor }, true));\n            }\n          }\n        }\n      }, initResizeEvent: function initResizeEvent() {\n        var me = this;domUtils.on(window, \"resize\", function () {\n          if (me._hidden || me._hidden === undefined) {\n            return;\n          }if (me.__resizeTimer) {\n            window.clearTimeout(me.__resizeTimer);\n          }me.__resizeTimer = window.setTimeout(function () {\n            me.__resizeTimer = null;var dialogWrapNode = me.getDom(),\n                contentNode = me.getDom(\"content\"),\n                wrapRect = UE.ui.uiUtils.getClientRect(dialogWrapNode),\n                contentRect = UE.ui.uiUtils.getClientRect(contentNode),\n                vpRect = uiUtils.getViewportRect();contentNode.style.width = vpRect.width - wrapRect.width + contentRect.width + \"px\";contentNode.style.height = vpRect.height - wrapRect.height + contentRect.height + \"px\";dialogWrapNode.style.width = vpRect.width + \"px\";dialogWrapNode.style.height = vpRect.height + \"px\";me.fireEvent(\"resize\");\n          }, 100);\n        });\n      }, fitSize: function fitSize() {\n        var popBodyEl = this.getDom(\"body\");var size = this.mesureSize();popBodyEl.style.width = size.width + \"px\";popBodyEl.style.height = size.height + \"px\";return size;\n      }, safeSetOffset: function safeSetOffset(offset) {\n        var me = this;var el = me.getDom();var vpRect = uiUtils.getViewportRect();var rect = uiUtils.getClientRect(el);var left = offset.left;if (left + rect.width > vpRect.right) {\n          left = vpRect.right - rect.width;\n        }var top = offset.top;if (top + rect.height > vpRect.bottom) {\n          top = vpRect.bottom - rect.height;\n        }el.style.left = Math.max(left, 0) + \"px\";el.style.top = Math.max(top, 0) + \"px\";\n      }, showAtCenter: function showAtCenter() {\n        var vpRect = uiUtils.getViewportRect();if (!this.fullscreen) {\n          this.getDom().style.display = \"\";var popSize = this.fitSize();var titleHeight = this.getDom(\"titlebar\").offsetHeight | 0;var left = vpRect.width / 2 - popSize.width / 2;var top = vpRect.height / 2 - (popSize.height - titleHeight) / 2 - titleHeight;var popEl = this.getDom();this.safeSetOffset({ left: Math.max(left | 0, 0), top: Math.max(top | 0, 0) });if (!domUtils.hasClass(popEl, \"edui-state-centered\")) {\n            popEl.className += \" edui-state-centered\";\n          }\n        } else {\n          var dialogWrapNode = this.getDom(),\n              contentNode = this.getDom(\"content\");dialogWrapNode.style.display = \"block\";var wrapRect = UE.ui.uiUtils.getClientRect(dialogWrapNode),\n              contentRect = UE.ui.uiUtils.getClientRect(contentNode);dialogWrapNode.style.left = \"-100000px\";contentNode.style.width = vpRect.width - wrapRect.width + contentRect.width + \"px\";contentNode.style.height = vpRect.height - wrapRect.height + contentRect.height + \"px\";dialogWrapNode.style.width = vpRect.width + \"px\";dialogWrapNode.style.height = vpRect.height + \"px\";dialogWrapNode.style.left = 0;this._originalContext = { html: { overflowX: document.documentElement.style.overflowX, overflowY: document.documentElement.style.overflowY }, body: { overflowX: document.body.style.overflowX, overflowY: document.body.style.overflowY } };document.documentElement.style.overflowX = \"hidden\";document.documentElement.style.overflowY = \"hidden\";document.body.style.overflowX = \"hidden\";document.body.style.overflowY = \"hidden\";\n        }this._show();\n      }, getContentHtml: function getContentHtml() {\n        var contentHtml = \"\";if (typeof this.content == \"string\") {\n          contentHtml = this.content;\n        } else if (this.iframeUrl) {\n          contentHtml = '<span id=\"' + this.id + '_contmask\" class=\"dialogcontmask\"></span><iframe id=\"' + this.id + '_iframe\" class=\"%%-iframe\" height=\"100%\" width=\"100%\" frameborder=\"0\" src=\"' + this.iframeUrl + '\"></iframe>';\n        }return contentHtml;\n      }, getHtmlTpl: function getHtmlTpl() {\n        var footHtml = \"\";if (this.buttons) {\n          var buff = [];for (var i = 0; i < this.buttons.length; i++) {\n            buff[i] = this.buttons[i].renderHtml();\n          }footHtml = '<div class=\"%%-foot\">' + '<div id=\"##_buttons\" class=\"%%-buttons\">' + buff.join(\"\") + \"</div>\" + \"</div>\";\n        }return '<div id=\"##\" class=\"%%\"><div ' + (!this.fullscreen ? 'class=\"%%\"' : 'class=\"%%-wrap edui-dialog-fullscreen-flag\"') + '><div id=\"##_body\" class=\"%%-body\">' + '<div class=\"%%-shadow\"></div>' + '<div id=\"##_titlebar\" class=\"%%-titlebar\">' + '<div class=\"%%-draghandle\" onmousedown=\"$$._onTitlebarMouseDown(event, this);\">' + '<span class=\"%%-caption\">' + (this.title || \"\") + \"</span>\" + \"</div>\" + this.closeButton.renderHtml() + \"</div>\" + '<div id=\"##_content\" class=\"%%-content\">' + (this.autoReset ? \"\" : this.getContentHtml()) + \"</div>\" + footHtml + \"</div></div></div>\";\n      }, postRender: function postRender() {\n        if (!this.modalMask.getDom()) {\n          this.modalMask.render();this.modalMask.hide();\n        }if (!this.dragMask.getDom()) {\n          this.dragMask.render();this.dragMask.hide();\n        }var me = this;this.addListener(\"show\", function () {\n          me.modalMask.show(this.getDom().style.zIndex - 2);\n        });this.addListener(\"hide\", function () {\n          me.modalMask.hide();\n        });if (this.buttons) {\n          for (var i = 0; i < this.buttons.length; i++) {\n            this.buttons[i].postRender();\n          }\n        }domUtils.on(window, \"resize\", function () {\n          setTimeout(function () {\n            if (!me.isHidden()) {\n              me.safeSetOffset(uiUtils.getClientRect(me.getDom()));\n            }\n          });\n        });this._hide();\n      }, mesureSize: function mesureSize() {\n        var body = this.getDom(\"body\");var width = uiUtils.getClientRect(this.getDom(\"content\")).width;var dialogBodyStyle = body.style;dialogBodyStyle.width = width;return uiUtils.getClientRect(body);\n      }, _onTitlebarMouseDown: function _onTitlebarMouseDown(evt, el) {\n        if (this.draggable) {\n          var rect;var vpRect = uiUtils.getViewportRect();var me = this;uiUtils.startDrag(evt, { ondragstart: function ondragstart() {\n              rect = uiUtils.getClientRect(me.getDom());me.getDom(\"contmask\").style.visibility = \"visible\";me.dragMask.show(me.getDom().style.zIndex - 1);\n            }, ondragmove: function ondragmove(x, y) {\n              var left = rect.left + x;var top = rect.top + y;me.safeSetOffset({ left: left, top: top });\n            }, ondragstop: function ondragstop() {\n              me.getDom(\"contmask\").style.visibility = \"hidden\";domUtils.removeClasses(me.getDom(), [\"edui-state-centered\"]);me.dragMask.hide();\n            } });\n        }\n      }, reset: function reset() {\n        this.getDom(\"content\").innerHTML = this.getContentHtml();this.fireEvent(\"dialogafterreset\");\n      }, _show: function _show() {\n        if (this._hidden) {\n          this.getDom().style.display = \"\";this.editor.container.style.zIndex && (this.getDom().style.zIndex = this.editor.container.style.zIndex * 1 + 10);this._hidden = false;this.fireEvent(\"show\");baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4;\n        }\n      }, isHidden: function isHidden() {\n        return this._hidden;\n      }, _hide: function _hide() {\n        if (!this._hidden) {\n          var wrapNode = this.getDom();wrapNode.style.display = \"none\";wrapNode.style.zIndex = \"\";wrapNode.style.width = \"\";wrapNode.style.height = \"\";this._hidden = true;this.fireEvent(\"hide\");\n        }\n      }, open: function open() {\n        if (this.autoReset) {\n          try {\n            this.reset();\n          } catch (e) {\n            this.render();this.open();\n          }\n        }this.showAtCenter();if (this.iframeUrl) {\n          try {\n            this.getDom(\"iframe\").focus();\n          } catch (ex) {}\n        }activeDialog = this;\n      }, _onCloseButtonClick: function _onCloseButtonClick(evt, el) {\n        this.close(false);\n      }, close: function close(ok) {\n        if (this.fireEvent(\"close\", ok) !== false) {\n          if (this.fullscreen) {\n            document.documentElement.style.overflowX = this._originalContext.html.overflowX;document.documentElement.style.overflowY = this._originalContext.html.overflowY;document.body.style.overflowX = this._originalContext.body.overflowX;document.body.style.overflowY = this._originalContext.body.overflowY;delete this._originalContext;\n          }this._hide();var content = this.getDom(\"content\");var iframe = this.getDom(\"iframe\");if (content && iframe) {\n            var doc = iframe.contentDocument || iframe.contentWindow.document;doc && (doc.body.innerHTML = \"\");domUtils.remove(content);\n          }\n        }\n      } };utils.inherits(Dialog, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Menu = baidu.editor.ui.Menu,\n        SplitButton = baidu.editor.ui.SplitButton,\n        MenuButton = baidu.editor.ui.MenuButton = function (options) {\n      this.initOptions(options);this.initMenuButton();\n    };MenuButton.prototype = { initMenuButton: function initMenuButton() {\n        var me = this;this.uiName = \"menubutton\";this.popup = new Menu({ items: me.items, className: me.className, editor: me.editor });this.popup.addListener(\"show\", function () {\n          var list = this;for (var i = 0; i < list.items.length; i++) {\n            list.items[i].removeState(\"checked\");if (list.items[i].value == me._value) {\n              list.items[i].addState(\"checked\");this.value = me._value;\n            }\n          }\n        });this.initSplitButton();\n      }, setValue: function setValue(value) {\n        this._value = value;\n      } };utils.inherits(MenuButton, SplitButton);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        Popup = baidu.editor.ui.Popup,\n        SplitButton = baidu.editor.ui.SplitButton,\n        MultiMenuPop = baidu.editor.ui.MultiMenuPop = function (options) {\n      this.initOptions(options);this.initMultiMenu();\n    };MultiMenuPop.prototype = { initMultiMenu: function initMultiMenu() {\n        var me = this;this.popup = new Popup({ content: \"\", editor: me.editor, iframe_rendered: false, onshow: function onshow() {\n            if (!this.iframe_rendered) {\n              this.iframe_rendered = true;this.getDom(\"content\").innerHTML = '<iframe id=\"' + me.id + '_iframe\" src=\"' + me.iframeUrl + '\" frameborder=\"0\"></iframe>';me.editor.container.style.zIndex && (this.getDom().style.zIndex = me.editor.container.style.zIndex * 1 + 1);\n            }\n          } });this.onbuttonclick = function () {\n          this.showPopup();\n        };this.initSplitButton();\n      } };utils.inherits(MultiMenuPop, SplitButton);\n  }();!function () {\n    var UI = baidu.editor.ui,\n        UIBase = UI.UIBase,\n        uiUtils = UI.uiUtils,\n        utils = baidu.editor.utils,\n        domUtils = baidu.editor.dom.domUtils;var allMenus = [],\n        timeID,\n        isSubMenuShow = false;var ShortCutMenu = UI.ShortCutMenu = function (options) {\n      this.initOptions(options);this.initShortCutMenu();\n    };ShortCutMenu.postHide = hideAllMenu;ShortCutMenu.prototype = { isHidden: true, SPACE: 5, initShortCutMenu: function initShortCutMenu() {\n        this.items = this.items || [];this.initUIBase();this.initItems();this.initEvent();allMenus.push(this);\n      }, initEvent: function initEvent() {\n        var me = this,\n            doc = me.editor.document;domUtils.on(doc, \"mousemove\", function (e) {\n          if (me.isHidden === false) {\n            if (me.getSubMenuMark() || me.eventType == \"contextmenu\") return;var flag = true,\n                el = me.getDom(),\n                wt = el.offsetWidth,\n                ht = el.offsetHeight,\n                distanceX = wt / 2 + me.SPACE,\n                distanceY = ht / 2,\n                x = Math.abs(e.screenX - me.left),\n                y = Math.abs(e.screenY - me.top);clearTimeout(timeID);timeID = setTimeout(function () {\n              if (y > 0 && y < distanceY) {\n                me.setOpacity(el, \"1\");\n              } else if (y > distanceY && y < distanceY + 70) {\n                me.setOpacity(el, \"0.5\");flag = false;\n              } else if (y > distanceY + 70 && y < distanceY + 140) {\n                me.hide();\n              }if (flag && x > 0 && x < distanceX) {\n                me.setOpacity(el, \"1\");\n              } else if (x > distanceX && x < distanceX + 70) {\n                me.setOpacity(el, \"0.5\");\n              } else if (x > distanceX + 70 && x < distanceX + 140) {\n                me.hide();\n              }\n            });\n          }\n        });if (browser.chrome) {\n          domUtils.on(doc, \"mouseout\", function (e) {\n            var relatedTgt = e.relatedTarget || e.toElement;if (relatedTgt == null || relatedTgt.tagName == \"HTML\") {\n              me.hide();\n            }\n          });\n        }me.editor.addListener(\"afterhidepop\", function () {\n          if (!me.isHidden) {\n            isSubMenuShow = true;\n          }\n        });\n      }, initItems: function initItems() {\n        if (utils.isArray(this.items)) {\n          for (var i = 0, len = this.items.length; i < len; i++) {\n            var item = this.items[i].toLowerCase();if (UI[item]) {\n              this.items[i] = new UI[item](this.editor);this.items[i].className += \" edui-shortcutsubmenu \";\n            }\n          }\n        }\n      }, setOpacity: function setOpacity(el, value) {\n        if (browser.ie && browser.version < 9) {\n          el.style.filter = \"alpha(opacity = \" + parseFloat(value) * 100 + \");\";\n        } else {\n          el.style.opacity = value;\n        }\n      }, getSubMenuMark: function getSubMenuMark() {\n        isSubMenuShow = false;var layerEle = uiUtils.getFixedLayer();var list = domUtils.getElementsByTagName(layerEle, \"div\", function (node) {\n          return domUtils.hasClass(node, \"edui-shortcutsubmenu edui-popup\");\n        });for (var i = 0, node; node = list[i++];) {\n          if (node.style.display != \"none\") {\n            isSubMenuShow = true;\n          }\n        }return isSubMenuShow;\n      }, show: function show(e, hasContextmenu) {\n        var me = this,\n            offset = {},\n            el = this.getDom(),\n            fixedlayer = uiUtils.getFixedLayer();function setPos(offset) {\n          if (offset.left < 0) {\n            offset.left = 0;\n          }if (offset.top < 0) {\n            offset.top = 0;\n          }el.style.cssText = \"position:absolute;left:\" + offset.left + \"px;top:\" + offset.top + \"px;\";\n        }function setPosByCxtMenu(menu) {\n          if (!menu.tagName) {\n            menu = menu.getDom();\n          }offset.left = parseInt(menu.style.left);offset.top = parseInt(menu.style.top);offset.top -= el.offsetHeight + 15;setPos(offset);\n        }me.eventType = e.type;el.style.cssText = \"display:block;left:-9999px\";if (e.type == \"contextmenu\" && hasContextmenu) {\n          var menu = domUtils.getElementsByTagName(fixedlayer, \"div\", \"edui-contextmenu\")[0];if (menu) {\n            setPosByCxtMenu(menu);\n          } else {\n            me.editor.addListener(\"aftershowcontextmenu\", function (type, menu) {\n              setPosByCxtMenu(menu);\n            });\n          }\n        } else {\n          offset = uiUtils.getViewportOffsetByEvent(e);offset.top -= el.offsetHeight + me.SPACE;offset.left += me.SPACE + 20;setPos(offset);me.setOpacity(el, .2);\n        }me.isHidden = false;me.left = e.screenX + el.offsetWidth / 2 - me.SPACE;me.top = e.screenY - el.offsetHeight / 2 - me.SPACE;if (me.editor) {\n          el.style.zIndex = me.editor.container.style.zIndex * 1 + 10;fixedlayer.style.zIndex = el.style.zIndex - 1;\n        }\n      }, hide: function hide() {\n        if (this.getDom()) {\n          this.getDom().style.display = \"none\";\n        }this.isHidden = true;\n      }, postRender: function postRender() {\n        if (utils.isArray(this.items)) {\n          for (var i = 0, item; item = this.items[i++];) {\n            item.postRender();\n          }\n        }\n      }, getHtmlTpl: function getHtmlTpl() {\n        var buff;if (utils.isArray(this.items)) {\n          buff = [];for (var i = 0; i < this.items.length; i++) {\n            buff[i] = this.items[i].renderHtml();\n          }buff = buff.join(\"\");\n        } else {\n          buff = this.items;\n        }return '<div id=\"##\" class=\"%% edui-toolbar\" data-src=\"shortcutmenu\" onmousedown=\"return false;\" onselectstart=\"return false;\" >' + buff + \"</div>\";\n      } };utils.inherits(ShortCutMenu, UIBase);function hideAllMenu(e) {\n      var tgt = e.target || e.srcElement,\n          cur = domUtils.findParent(tgt, function (node) {\n        return domUtils.hasClass(node, \"edui-shortcutmenu\") || domUtils.hasClass(node, \"edui-popup\");\n      }, true);if (!cur) {\n        for (var i = 0, menu; menu = allMenus[i++];) {\n          menu.hide();\n        }\n      }\n    }domUtils.on(document, \"mousedown\", function (e) {\n      hideAllMenu(e);\n    });domUtils.on(window, \"scroll\", function (e) {\n      hideAllMenu(e);\n    });\n  }();!function () {\n    var utils = baidu.editor.utils,\n        UIBase = baidu.editor.ui.UIBase,\n        Breakline = baidu.editor.ui.Breakline = function (options) {\n      this.initOptions(options);this.initSeparator();\n    };Breakline.prototype = { uiName: \"Breakline\", initSeparator: function initSeparator() {\n        this.initUIBase();\n      }, getHtmlTpl: function getHtmlTpl() {\n        return \"<br/>\";\n      } };utils.inherits(Breakline, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils,\n        domUtils = baidu.editor.dom.domUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        Message = baidu.editor.ui.Message = function (options) {\n      this.initOptions(options);this.initMessage();\n    };Message.prototype = { initMessage: function initMessage() {\n        this.initUIBase();\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"edui-message %%\">' + ' <div id=\"##_closer\" class=\"edui-message-closer\">×</div>' + ' <div id=\"##_body\" class=\"edui-message-body edui-message-type-info\">' + ' <iframe style=\"position:absolute;z-index:-1;left:0;top:0;background-color: transparent;\" frameborder=\"0\" width=\"100%\" height=\"100%\" src=\"about:blank\"></iframe>' + ' <div class=\"edui-shadow\"></div>' + ' <div id=\"##_content\" class=\"edui-message-content\">' + \"  </div>\" + \" </div>\" + \"</div>\";\n      }, reset: function reset(opt) {\n        var me = this;if (!opt.keepshow) {\n          clearTimeout(this.timer);me.timer = setTimeout(function () {\n            me.hide();\n          }, opt.timeout || 4e3);\n        }opt.content !== undefined && me.setContent(opt.content);opt.type !== undefined && me.setType(opt.type);me.show();\n      }, postRender: function postRender() {\n        var me = this,\n            closer = this.getDom(\"closer\");closer && domUtils.on(closer, \"click\", function () {\n          me.hide();\n        });\n      }, setContent: function setContent(content) {\n        this.getDom(\"content\").innerHTML = content;\n      }, setType: function setType(type) {\n        type = type || \"info\";var body = this.getDom(\"body\");body.className = body.className.replace(/edui-message-type-[\\w-]+/, \"edui-message-type-\" + type);\n      }, getContent: function getContent() {\n        return this.getDom(\"content\").innerHTML;\n      }, getType: function getType() {\n        var arr = this.getDom(\"body\").match(/edui-message-type-([\\w-]+)/);return arr ? arr[1] : \"\";\n      }, show: function show() {\n        this.getDom().style.display = \"block\";\n      }, hide: function hide() {\n        var dom = this.getDom();if (dom) {\n          dom.style.display = \"none\";dom.parentNode && dom.parentNode.removeChild(dom);\n        }\n      } };utils.inherits(Message, UIBase);\n  }();!function () {\n    var utils = baidu.editor.utils;var editorui = baidu.editor.ui;var _Dialog = editorui.Dialog;editorui.buttons = {};editorui.Dialog = function (options) {\n      var dialog = new _Dialog(options);dialog.addListener(\"hide\", function () {\n        if (dialog.editor) {\n          var editor = dialog.editor;try {\n            if (browser.gecko) {\n              var y = editor.window.scrollY,\n                  x = editor.window.scrollX;editor.body.focus();editor.window.scrollTo(x, y);\n            } else {\n              editor.focus();\n            }\n          } catch (ex) {}\n        }\n      });return dialog;\n    };var iframeUrlMap = { anchor: \"~/dialogs/anchor/anchor.html\", insertimage: \"~/dialogs/image/image.html\", link: \"~/dialogs/link/link.html\", spechars: \"~/dialogs/spechars/spechars.html\", searchreplace: \"~/dialogs/searchreplace/searchreplace.html\", map: \"~/dialogs/map/map.html\", gmap: \"~/dialogs/gmap/gmap.html\", insertvideo: \"~/dialogs/video/video.html\", help: \"~/dialogs/help/help.html\", preview: \"~/dialogs/preview/preview.html\", emotion: \"~/dialogs/emotion/emotion.html\", wordimage: \"~/dialogs/wordimage/wordimage.html\", attachment: \"~/dialogs/attachment/attachment.html\", insertframe: \"~/dialogs/insertframe/insertframe.html\", edittip: \"~/dialogs/table/edittip.html\", edittable: \"~/dialogs/table/edittable.html\", edittd: \"~/dialogs/table/edittd.html\", webapp: \"~/dialogs/webapp/webapp.html\", snapscreen: \"~/dialogs/snapscreen/snapscreen.html\", scrawl: \"~/dialogs/scrawl/scrawl.html\", music: \"~/dialogs/music/music.html\", template: \"~/dialogs/template/template.html\", background: \"~/dialogs/background/background.html\", charts: \"~/dialogs/charts/charts.html\" };var btnCmds = [\"undo\", \"redo\", \"formatmatch\", \"bold\", \"italic\", \"underline\", \"fontborder\", \"touppercase\", \"tolowercase\", \"strikethrough\", \"subscript\", \"superscript\", \"source\", \"indent\", \"outdent\", \"blockquote\", \"pasteplain\", \"pagebreak\", \"selectall\", \"print\", \"horizontal\", \"removeformat\", \"time\", \"date\", \"unlink\", \"insertparagraphbeforetable\", \"insertrow\", \"insertcol\", \"mergeright\", \"mergedown\", \"deleterow\", \"deletecol\", \"splittorows\", \"splittocols\", \"splittocells\", \"mergecells\", \"deletetable\", \"drafts\"];for (var i = 0, ci; ci = btnCmds[i++];) {\n      ci = ci.toLowerCase();editorui[ci] = function (cmd) {\n        return function (editor) {\n          var ui = new editorui.Button({ className: \"edui-for-\" + cmd, title: editor.options.labelMap[cmd] || editor.getLang(\"labelMap.\" + cmd) || \"\", onclick: function onclick() {\n              editor.execCommand(cmd);\n            }, theme: editor.options.theme, showText: false });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n            var state = editor.queryCommandState(cmd);if (state == -1) {\n              ui.setDisabled(true);ui.setChecked(false);\n            } else {\n              if (!uiReady) {\n                ui.setDisabled(false);ui.setChecked(state);\n              }\n            }\n          });return ui;\n        };\n      }(ci);\n    }editorui.cleardoc = function (editor) {\n      var ui = new editorui.Button({ className: \"edui-for-cleardoc\", title: editor.options.labelMap.cleardoc || editor.getLang(\"labelMap.cleardoc\") || \"\", theme: editor.options.theme, onclick: function onclick() {\n          if (confirm(editor.getLang(\"confirmClear\"))) {\n            editor.execCommand(\"cleardoc\");\n          }\n        } });editorui.buttons[\"cleardoc\"] = ui;editor.addListener(\"selectionchange\", function () {\n        ui.setDisabled(editor.queryCommandState(\"cleardoc\") == -1);\n      });return ui;\n    };var typeset = { justify: [\"left\", \"right\", \"center\", \"justify\"], imagefloat: [\"none\", \"left\", \"center\", \"right\"], directionality: [\"ltr\", \"rtl\"] };for (var p in typeset) {\n      !function (cmd, val) {\n        for (var i = 0, ci; ci = val[i++];) {\n          !function (cmd2) {\n            editorui[cmd.replace(\"float\", \"\") + cmd2] = function (editor) {\n              var ui = new editorui.Button({ className: \"edui-for-\" + cmd.replace(\"float\", \"\") + cmd2, title: editor.options.labelMap[cmd.replace(\"float\", \"\") + cmd2] || editor.getLang(\"labelMap.\" + cmd.replace(\"float\", \"\") + cmd2) || \"\", theme: editor.options.theme, onclick: function onclick() {\n                  editor.execCommand(cmd, cmd2);\n                } });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n                ui.setDisabled(editor.queryCommandState(cmd) == -1);ui.setChecked(editor.queryCommandValue(cmd) == cmd2 && !uiReady);\n              });return ui;\n            };\n          }(ci);\n        }\n      }(p, typeset[p]);\n    }for (var i = 0, ci; ci = [\"backcolor\", \"forecolor\"][i++];) {\n      editorui[ci] = function (cmd) {\n        return function (editor) {\n          var ui = new editorui.ColorButton({ className: \"edui-for-\" + cmd, color: \"default\", title: editor.options.labelMap[cmd] || editor.getLang(\"labelMap.\" + cmd) || \"\", editor: editor, onpickcolor: function onpickcolor(t, color) {\n              editor.execCommand(cmd, color);\n            }, onpicknocolor: function onpicknocolor() {\n              editor.execCommand(cmd, \"default\");this.setColor(\"transparent\");this.color = \"default\";\n            }, onbuttonclick: function onbuttonclick() {\n              editor.execCommand(cmd, this.color);\n            } });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function () {\n            ui.setDisabled(editor.queryCommandState(cmd) == -1);\n          });return ui;\n        };\n      }(ci);\n    }var dialogBtns = { noOk: [\"searchreplace\", \"help\", \"spechars\", \"webapp\", \"preview\"], ok: [\"attachment\", \"anchor\", \"link\", \"insertimage\", \"map\", \"gmap\", \"insertframe\", \"wordimage\", \"insertvideo\", \"insertframe\", \"edittip\", \"edittable\", \"edittd\", \"scrawl\", \"template\", \"music\", \"background\", \"charts\"] };for (var p in dialogBtns) {\n      !function (type, vals) {\n        for (var i = 0, ci; ci = vals[i++];) {\n          if (browser.opera && ci === \"searchreplace\") {\n            continue;\n          }!function (cmd) {\n            editorui[cmd] = function (editor, iframeUrl, title) {\n              iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd];title = editor.options.labelMap[cmd] || editor.getLang(\"labelMap.\" + cmd) || \"\";var dialog;if (iframeUrl) {\n                dialog = new editorui.Dialog(utils.extend({ iframeUrl: editor.ui.mapUrl(iframeUrl), editor: editor, className: \"edui-for-\" + cmd, title: title, holdScroll: cmd === \"insertimage\", fullscreen: /charts|preview/.test(cmd), closeDialog: editor.getLang(\"closeDialog\") }, type == \"ok\" ? { buttons: [{ className: \"edui-okbutton\", label: editor.getLang(\"ok\"), editor: editor, onclick: function onclick() {\n                      dialog.close(true);\n                    } }, { className: \"edui-cancelbutton\", label: editor.getLang(\"cancel\"), editor: editor, onclick: function onclick() {\n                      dialog.close(false);\n                    } }] } : {}));editor.ui._dialogs[cmd + \"Dialog\"] = dialog;\n              }var ui = new editorui.Button({ className: \"edui-for-\" + cmd, title: title, onclick: function onclick() {\n                  if (dialog) {\n                    switch (cmd) {case \"wordimage\":\n                        var images = editor.execCommand(\"wordimage\");if (images && images.length) {\n                          dialog.render();dialog.open();\n                        }break;case \"scrawl\":\n                        if (editor.queryCommandState(\"scrawl\") != -1) {\n                          dialog.render();dialog.open();\n                        }break;default:\n                        dialog.render();dialog.open();}\n                  }\n                }, theme: editor.options.theme, disabled: cmd == \"scrawl\" && editor.queryCommandState(\"scrawl\") == -1 || cmd == \"charts\" });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function () {\n                var unNeedCheckState = { edittable: 1 };if (cmd in unNeedCheckState) return;var state = editor.queryCommandState(cmd);if (ui.getDom()) {\n                  ui.setDisabled(state == -1);ui.setChecked(state);\n                }\n              });return ui;\n            };\n          }(ci.toLowerCase());\n        }\n      }(p, dialogBtns[p]);\n    }editorui.snapscreen = function (editor, iframeUrl, title) {\n      title = editor.options.labelMap[\"snapscreen\"] || editor.getLang(\"labelMap.snapscreen\") || \"\";var ui = new editorui.Button({ className: \"edui-for-snapscreen\", title: title, onclick: function onclick() {\n          editor.execCommand(\"snapscreen\");\n        }, theme: editor.options.theme });editorui.buttons[\"snapscreen\"] = ui;iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})[\"snapscreen\"] || iframeUrlMap[\"snapscreen\"];if (iframeUrl) {\n        var dialog = new editorui.Dialog({ iframeUrl: editor.ui.mapUrl(iframeUrl), editor: editor, className: \"edui-for-snapscreen\", title: title, buttons: [{ className: \"edui-okbutton\", label: editor.getLang(\"ok\"), editor: editor, onclick: function onclick() {\n              dialog.close(true);\n            } }, { className: \"edui-cancelbutton\", label: editor.getLang(\"cancel\"), editor: editor, onclick: function onclick() {\n              dialog.close(false);\n            } }] });dialog.render();editor.ui._dialogs[\"snapscreenDialog\"] = dialog;\n      }editor.addListener(\"selectionchange\", function () {\n        ui.setDisabled(editor.queryCommandState(\"snapscreen\") == -1);\n      });return ui;\n    };editorui.insertcode = function (editor, list, title) {\n      list = editor.options[\"insertcode\"] || [];title = editor.options.labelMap[\"insertcode\"] || editor.getLang(\"labelMap.insertcode\") || \"\";var items = [];utils.each(list, function (key, val) {\n        items.push({ label: key, value: val, theme: editor.options.theme, renderLabelHtml: function renderLabelHtml() {\n            return '<div class=\"edui-label %%-label\" >' + (this.label || \"\") + \"</div>\";\n          } });\n      });var ui = new editorui.Combox({ editor: editor, items: items, onselect: function onselect(t, index) {\n          editor.execCommand(\"insertcode\", this.items[index].value);\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        }, title: title, initValue: title, className: \"edui-for-insertcode\", indexByValue: function indexByValue(value) {\n          if (value) {\n            for (var i = 0, ci; ci = this.items[i]; i++) {\n              if (ci.value.indexOf(value) != -1) return i;\n            }\n          }return -1;\n        } });editorui.buttons[\"insertcode\"] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        if (!uiReady) {\n          var state = editor.queryCommandState(\"insertcode\");if (state == -1) {\n            ui.setDisabled(true);\n          } else {\n            ui.setDisabled(false);var value = editor.queryCommandValue(\"insertcode\");if (!value) {\n              ui.setValue(title);return;\n            }value && (value = value.replace(/['\"]/g, \"\").split(\",\")[0]);ui.setValue(value);\n          }\n        }\n      });return ui;\n    };editorui.fontfamily = function (editor, list, title) {\n      list = editor.options[\"fontfamily\"] || [];title = editor.options.labelMap[\"fontfamily\"] || editor.getLang(\"labelMap.fontfamily\") || \"\";if (!list.length) return;for (var i = 0, ci, items = []; ci = list[i]; i++) {\n        var langLabel = editor.getLang(\"fontfamily\")[ci.name] || \"\";!function (key, val) {\n          items.push({ label: key, value: val, theme: editor.options.theme, renderLabelHtml: function renderLabelHtml() {\n              return '<div class=\"edui-label %%-label\" style=\"font-family:' + utils.unhtml(this.value) + '\">' + (this.label || \"\") + \"</div>\";\n            } });\n        }(ci.label || langLabel, ci.val);\n      }var ui = new editorui.Combox({ editor: editor, items: items, onselect: function onselect(t, index) {\n          editor.execCommand(\"FontFamily\", this.items[index].value);\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        }, title: title, initValue: title, className: \"edui-for-fontfamily\", indexByValue: function indexByValue(value) {\n          if (value) {\n            for (var i = 0, ci; ci = this.items[i]; i++) {\n              if (ci.value.indexOf(value) != -1) return i;\n            }\n          }return -1;\n        } });editorui.buttons[\"fontfamily\"] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        if (!uiReady) {\n          var state = editor.queryCommandState(\"FontFamily\");if (state == -1) {\n            ui.setDisabled(true);\n          } else {\n            ui.setDisabled(false);var value = editor.queryCommandValue(\"FontFamily\");value && (value = value.replace(/['\"]/g, \"\").split(\",\")[0]);ui.setValue(value);\n          }\n        }\n      });return ui;\n    };editorui.fontsize = function (editor, list, title) {\n      title = editor.options.labelMap[\"fontsize\"] || editor.getLang(\"labelMap.fontsize\") || \"\";list = list || editor.options[\"fontsize\"] || [];if (!list.length) return;var items = [];for (var i = 0; i < list.length; i++) {\n        var size = list[i] + \"px\";items.push({ label: size, value: size, theme: editor.options.theme, renderLabelHtml: function renderLabelHtml() {\n            return '<div class=\"edui-label %%-label\" style=\"line-height:1;font-size:' + this.value + '\">' + (this.label || \"\") + \"</div>\";\n          } });\n      }var ui = new editorui.Combox({ editor: editor, items: items, title: title, initValue: title, onselect: function onselect(t, index) {\n          editor.execCommand(\"FontSize\", this.items[index].value);\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        }, className: \"edui-for-fontsize\" });editorui.buttons[\"fontsize\"] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        if (!uiReady) {\n          var state = editor.queryCommandState(\"FontSize\");if (state == -1) {\n            ui.setDisabled(true);\n          } else {\n            ui.setDisabled(false);ui.setValue(editor.queryCommandValue(\"FontSize\"));\n          }\n        }\n      });return ui;\n    };editorui.paragraph = function (editor, list, title) {\n      title = editor.options.labelMap[\"paragraph\"] || editor.getLang(\"labelMap.paragraph\") || \"\";list = editor.options[\"paragraph\"] || [];if (utils.isEmptyObject(list)) return;var items = [];for (var i in list) {\n        items.push({ value: i, label: list[i] || editor.getLang(\"paragraph\")[i], theme: editor.options.theme, renderLabelHtml: function renderLabelHtml() {\n            return '<div class=\"edui-label %%-label\"><span class=\"edui-for-' + this.value + '\">' + (this.label || \"\") + \"</span></div>\";\n          } });\n      }var ui = new editorui.Combox({ editor: editor, items: items, title: title, initValue: title, className: \"edui-for-paragraph\", onselect: function onselect(t, index) {\n          editor.execCommand(\"Paragraph\", this.items[index].value);\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        } });editorui.buttons[\"paragraph\"] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        if (!uiReady) {\n          var state = editor.queryCommandState(\"Paragraph\");if (state == -1) {\n            ui.setDisabled(true);\n          } else {\n            ui.setDisabled(false);var value = editor.queryCommandValue(\"Paragraph\");var index = ui.indexByValue(value);if (index != -1) {\n              ui.setValue(value);\n            } else {\n              ui.setValue(ui.initValue);\n            }\n          }\n        }\n      });return ui;\n    };editorui.customstyle = function (editor) {\n      var list = editor.options[\"customstyle\"] || [],\n          title = editor.options.labelMap[\"customstyle\"] || editor.getLang(\"labelMap.customstyle\") || \"\";if (!list.length) return;var langCs = editor.getLang(\"customstyle\");for (var i = 0, items = [], t; t = list[i++];) {\n        !function (t) {\n          var ck = {};ck.label = t.label ? t.label : langCs[t.name];ck.style = t.style;ck.className = t.className;ck.tag = t.tag;items.push({ label: ck.label, value: ck, theme: editor.options.theme, renderLabelHtml: function renderLabelHtml() {\n              return '<div class=\"edui-label %%-label\">' + \"<\" + ck.tag + \" \" + (ck.className ? ' class=\"' + ck.className + '\"' : \"\") + (ck.style ? ' style=\"' + ck.style + '\"' : \"\") + \">\" + ck.label + \"</\" + ck.tag + \">\" + \"</div>\";\n            } });\n        }(t);\n      }var ui = new editorui.Combox({ editor: editor, items: items, title: title, initValue: title, className: \"edui-for-customstyle\", onselect: function onselect(t, index) {\n          editor.execCommand(\"customstyle\", this.items[index].value);\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        }, indexByValue: function indexByValue(value) {\n          for (var i = 0, ti; ti = this.items[i++];) {\n            if (ti.label == value) {\n              return i - 1;\n            }\n          }return -1;\n        } });editorui.buttons[\"customstyle\"] = ui;editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        if (!uiReady) {\n          var state = editor.queryCommandState(\"customstyle\");if (state == -1) {\n            ui.setDisabled(true);\n          } else {\n            ui.setDisabled(false);var value = editor.queryCommandValue(\"customstyle\");var index = ui.indexByValue(value);if (index != -1) {\n              ui.setValue(value);\n            } else {\n              ui.setValue(ui.initValue);\n            }\n          }\n        }\n      });return ui;\n    };editorui.inserttable = function (editor, iframeUrl, title) {\n      title = editor.options.labelMap[\"inserttable\"] || editor.getLang(\"labelMap.inserttable\") || \"\";var ui = new editorui.TableButton({ editor: editor, title: title, className: \"edui-for-inserttable\", onpicktable: function onpicktable(t, numCols, numRows) {\n          editor.execCommand(\"InsertTable\", { numRows: numRows, numCols: numCols, border: 1 });\n        }, onbuttonclick: function onbuttonclick() {\n          this.showPopup();\n        } });editorui.buttons[\"inserttable\"] = ui;editor.addListener(\"selectionchange\", function () {\n        ui.setDisabled(editor.queryCommandState(\"inserttable\") == -1);\n      });return ui;\n    };editorui.lineheight = function (editor) {\n      var val = editor.options.lineheight || [];if (!val.length) return;for (var i = 0, ci, items = []; ci = val[i++];) {\n        items.push({ label: ci, value: ci, theme: editor.options.theme, onclick: function onclick() {\n            editor.execCommand(\"lineheight\", this.value);\n          } });\n      }var ui = new editorui.MenuButton({ editor: editor, className: \"edui-for-lineheight\", title: editor.options.labelMap[\"lineheight\"] || editor.getLang(\"labelMap.lineheight\") || \"\", items: items, onbuttonclick: function onbuttonclick() {\n          var value = editor.queryCommandValue(\"LineHeight\") || this.value;editor.execCommand(\"LineHeight\", value);\n        } });editorui.buttons[\"lineheight\"] = ui;editor.addListener(\"selectionchange\", function () {\n        var state = editor.queryCommandState(\"LineHeight\");if (state == -1) {\n          ui.setDisabled(true);\n        } else {\n          ui.setDisabled(false);var value = editor.queryCommandValue(\"LineHeight\");value && ui.setValue((value + \"\").replace(/cm/, \"\"));ui.setChecked(state);\n        }\n      });return ui;\n    };var rowspacings = [\"top\", \"bottom\"];for (var r = 0, ri; ri = rowspacings[r++];) {\n      !function (cmd) {\n        editorui[\"rowspacing\" + cmd] = function (editor) {\n          var val = editor.options[\"rowspacing\" + cmd] || [];if (!val.length) return null;for (var i = 0, ci, items = []; ci = val[i++];) {\n            items.push({ label: ci, value: ci, theme: editor.options.theme, onclick: function onclick() {\n                editor.execCommand(\"rowspacing\", this.value, cmd);\n              } });\n          }var ui = new editorui.MenuButton({ editor: editor, className: \"edui-for-rowspacing\" + cmd, title: editor.options.labelMap[\"rowspacing\" + cmd] || editor.getLang(\"labelMap.rowspacing\" + cmd) || \"\", items: items, onbuttonclick: function onbuttonclick() {\n              var value = editor.queryCommandValue(\"rowspacing\", cmd) || this.value;editor.execCommand(\"rowspacing\", value, cmd);\n            } });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function () {\n            var state = editor.queryCommandState(\"rowspacing\", cmd);if (state == -1) {\n              ui.setDisabled(true);\n            } else {\n              ui.setDisabled(false);var value = editor.queryCommandValue(\"rowspacing\", cmd);value && ui.setValue((value + \"\").replace(/%/, \"\"));ui.setChecked(state);\n            }\n          });return ui;\n        };\n      }(ri);\n    }var lists = [\"insertorderedlist\", \"insertunorderedlist\"];for (var l = 0, cl; cl = lists[l++];) {\n      !function (cmd) {\n        editorui[cmd] = function (editor) {\n          var vals = editor.options[cmd],\n              _onMenuClick = function _onMenuClick() {\n            editor.execCommand(cmd, this.value);\n          },\n              items = [];for (var i in vals) {\n            items.push({ label: vals[i] || editor.getLang()[cmd][i] || \"\", value: i, theme: editor.options.theme, onclick: _onMenuClick });\n          }var ui = new editorui.MenuButton({ editor: editor, className: \"edui-for-\" + cmd, title: editor.getLang(\"labelMap.\" + cmd) || \"\", items: items, onbuttonclick: function onbuttonclick() {\n              var value = editor.queryCommandValue(cmd) || this.value;editor.execCommand(cmd, value);\n            } });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function () {\n            var state = editor.queryCommandState(cmd);if (state == -1) {\n              ui.setDisabled(true);\n            } else {\n              ui.setDisabled(false);var value = editor.queryCommandValue(cmd);ui.setValue(value);ui.setChecked(state);\n            }\n          });return ui;\n        };\n      }(cl);\n    }editorui.fullscreen = function (editor, title) {\n      title = editor.options.labelMap[\"fullscreen\"] || editor.getLang(\"labelMap.fullscreen\") || \"\";var ui = new editorui.Button({ className: \"edui-for-fullscreen\", title: title, theme: editor.options.theme, onclick: function onclick() {\n          if (editor.ui) {\n            editor.ui.setFullScreen(!editor.ui.isFullScreen());\n          }this.setChecked(editor.ui.isFullScreen());\n        } });editorui.buttons[\"fullscreen\"] = ui;editor.addListener(\"selectionchange\", function () {\n        var state = editor.queryCommandState(\"fullscreen\");ui.setDisabled(state == -1);ui.setChecked(editor.ui.isFullScreen());\n      });return ui;\n    };editorui[\"emotion\"] = function (editor, iframeUrl) {\n      var cmd = \"emotion\";var ui = new editorui.MultiMenuPop({ title: editor.options.labelMap[cmd] || editor.getLang(\"labelMap.\" + cmd + \"\") || \"\", editor: editor, className: \"edui-for-\" + cmd, iframeUrl: editor.ui.mapUrl(iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd]) });editorui.buttons[cmd] = ui;editor.addListener(\"selectionchange\", function () {\n        ui.setDisabled(editor.queryCommandState(cmd) == -1);\n      });return ui;\n    };editorui.autotypeset = function (editor) {\n      var ui = new editorui.AutoTypeSetButton({ editor: editor, title: editor.options.labelMap[\"autotypeset\"] || editor.getLang(\"labelMap.autotypeset\") || \"\", className: \"edui-for-autotypeset\", onbuttonclick: function onbuttonclick() {\n          editor.execCommand(\"autotypeset\");\n        } });editorui.buttons[\"autotypeset\"] = ui;editor.addListener(\"selectionchange\", function () {\n        ui.setDisabled(editor.queryCommandState(\"autotypeset\") == -1);\n      });return ui;\n    };editorui[\"simpleupload\"] = function (editor) {\n      var name = \"simpleupload\",\n          ui = new editorui.Button({ className: \"edui-for-\" + name, title: editor.options.labelMap[name] || editor.getLang(\"labelMap.\" + name) || \"\", onclick: function onclick() {}, theme: editor.options.theme, showText: false });editorui.buttons[name] = ui;editor.addListener(\"ready\", function () {\n        var b = ui.getDom(\"body\"),\n            iconSpan = b.children[0];editor.fireEvent(\"simpleuploadbtnready\", iconSpan);\n      });editor.addListener(\"selectionchange\", function (type, causeByUi, uiReady) {\n        var state = editor.queryCommandState(name);if (state == -1) {\n          ui.setDisabled(true);ui.setChecked(false);\n        } else {\n          if (!uiReady) {\n            ui.setDisabled(false);ui.setChecked(state);\n          }\n        }\n      });return ui;\n    };\n  }();!function () {\n    var utils = baidu.editor.utils,\n        uiUtils = baidu.editor.ui.uiUtils,\n        UIBase = baidu.editor.ui.UIBase,\n        domUtils = baidu.editor.dom.domUtils;var nodeStack = [];function EditorUI(options) {\n      this.initOptions(options);this.initEditorUI();\n    }EditorUI.prototype = { uiName: \"editor\", initEditorUI: function initEditorUI() {\n        this.editor.ui = this;this._dialogs = {};this.initUIBase();this._initToolbars();var editor = this.editor,\n            me = this;editor.addListener(\"ready\", function () {\n          editor.getDialog = function (name) {\n            return editor.ui._dialogs[name + \"Dialog\"];\n          };domUtils.on(editor.window, \"scroll\", function (evt) {\n            baidu.editor.ui.Popup.postHide(evt);\n          });editor.ui._actualFrameWidth = editor.options.initialFrameWidth;UE.browser.ie && UE.browser.version === 6 && editor.container.ownerDocument.execCommand(\"BackgroundImageCache\", false, true);if (editor.options.elementPathEnabled) {\n            editor.ui.getDom(\"elementpath\").innerHTML = '<div class=\"edui-editor-breadcrumb\">' + editor.getLang(\"elementPathTip\") + \":</div>\";\n          }if (editor.options.wordCount) {\n            var countFn = function countFn() {\n              setCount(editor, me);domUtils.un(editor.document, \"click\", arguments.callee);\n            };\n\n            domUtils.on(editor.document, \"click\", countFn);editor.ui.getDom(\"wordcount\").innerHTML = editor.getLang(\"wordCountTip\");\n          }editor.ui._scale();if (editor.options.scaleEnabled) {\n            if (editor.autoHeightEnabled) {\n              editor.disableAutoHeight();\n            }me.enableScale();\n          } else {\n            me.disableScale();\n          }if (!editor.options.elementPathEnabled && !editor.options.wordCount && !editor.options.scaleEnabled) {\n            editor.ui.getDom(\"elementpath\").style.display = \"none\";editor.ui.getDom(\"wordcount\").style.display = \"none\";editor.ui.getDom(\"scale\").style.display = \"none\";\n          }if (!editor.selection.isFocus()) return;editor.fireEvent(\"selectionchange\", false, true);\n        });editor.addListener(\"mousedown\", function (t, evt) {\n          var el = evt.target || evt.srcElement;baidu.editor.ui.Popup.postHide(evt, el);baidu.editor.ui.ShortCutMenu.postHide(evt);\n        });editor.addListener(\"delcells\", function () {\n          if (UE.ui[\"edittip\"]) {\n            new UE.ui[\"edittip\"](editor);\n          }editor.getDialog(\"edittip\").open();\n        });var pastePop,\n            isPaste = false,\n            timer;editor.addListener(\"afterpaste\", function () {\n          if (editor.queryCommandState(\"pasteplain\")) return;if (baidu.editor.ui.PastePicker) {\n            pastePop = new baidu.editor.ui.Popup({ content: new baidu.editor.ui.PastePicker({ editor: editor }), editor: editor, className: \"edui-wordpastepop\" });pastePop.render();\n          }isPaste = true;\n        });editor.addListener(\"afterinserthtml\", function () {\n          clearTimeout(timer);timer = setTimeout(function () {\n            if (pastePop && (isPaste || editor.ui._isTransfer)) {\n              if (pastePop.isHidden()) {\n                var span = domUtils.createElement(editor.document, \"span\", { style: \"line-height:0px;\", innerHTML: \"﻿\" }),\n                    range = editor.selection.getRange();range.insertNode(span);var tmp = getDomNode(span, \"firstChild\", \"previousSibling\");tmp && pastePop.showAnchor(tmp.nodeType == 3 ? tmp.parentNode : tmp);domUtils.remove(span);\n              } else {\n                pastePop.show();\n              }delete editor.ui._isTransfer;isPaste = false;\n            }\n          }, 200);\n        });editor.addListener(\"contextmenu\", function (t, evt) {\n          baidu.editor.ui.Popup.postHide(evt);\n        });editor.addListener(\"keydown\", function (t, evt) {\n          if (pastePop) pastePop.dispose(evt);var keyCode = evt.keyCode || evt.which;if (evt.altKey && keyCode == 90) {\n            UE.ui.buttons[\"fullscreen\"].onclick();\n          }\n        });editor.addListener(\"wordcount\", function (type) {\n          setCount(this, me);\n        });function setCount(editor, ui) {\n          editor.setOpt({ wordCount: true, maximumWords: 1e4, wordCountMsg: editor.options.wordCountMsg || editor.getLang(\"wordCountMsg\"), wordOverFlowMsg: editor.options.wordOverFlowMsg || editor.getLang(\"wordOverFlowMsg\") });var opt = editor.options,\n              max = opt.maximumWords,\n              msg = opt.wordCountMsg,\n              errMsg = opt.wordOverFlowMsg,\n              countDom = ui.getDom(\"wordcount\");if (!opt.wordCount) {\n            return;\n          }var count = editor.getContentLength(true);if (count > max) {\n            countDom.innerHTML = errMsg;editor.fireEvent(\"wordcountoverflow\");\n          } else {\n            countDom.innerHTML = msg.replace(\"{#leave}\", max - count).replace(\"{#count}\", count);\n          }\n        }editor.addListener(\"selectionchange\", function () {\n          if (editor.options.elementPathEnabled) {\n            me[(editor.queryCommandState(\"elementpath\") == -1 ? \"dis\" : \"en\") + \"ableElementPath\"]();\n          }if (editor.options.scaleEnabled) {\n            me[(editor.queryCommandState(\"scale\") == -1 ? \"dis\" : \"en\") + \"ableScale\"]();\n          }\n        });var popup = new baidu.editor.ui.Popup({ editor: editor, content: \"\", className: \"edui-bubble\", _onEditButtonClick: function _onEditButtonClick() {\n            this.hide();editor.ui._dialogs.linkDialog.open();\n          }, _onImgEditButtonClick: function _onImgEditButtonClick(name) {\n            this.hide();editor.ui._dialogs[name] && editor.ui._dialogs[name].open();\n          }, _onImgSetFloat: function _onImgSetFloat(value) {\n            this.hide();editor.execCommand(\"imagefloat\", value);\n          }, _setIframeAlign: function _setIframeAlign(value) {\n            var frame = popup.anchorEl;var newFrame = frame.cloneNode(true);switch (value) {case -2:\n                newFrame.setAttribute(\"align\", \"\");break;case -1:\n                newFrame.setAttribute(\"align\", \"left\");break;case 1:\n                newFrame.setAttribute(\"align\", \"right\");break;}frame.parentNode.insertBefore(newFrame, frame);domUtils.remove(frame);popup.anchorEl = newFrame;popup.showAnchor(popup.anchorEl);\n          }, _updateIframe: function _updateIframe() {\n            var frame = editor._iframe = popup.anchorEl;if (domUtils.hasClass(frame, \"ueditor_baidumap\")) {\n              editor.selection.getRange().selectNode(frame).select();editor.ui._dialogs.mapDialog.open();popup.hide();\n            } else {\n              editor.ui._dialogs.insertframeDialog.open();popup.hide();\n            }\n          }, _onRemoveButtonClick: function _onRemoveButtonClick(cmdName) {\n            editor.execCommand(cmdName);this.hide();\n          }, queryAutoHide: function queryAutoHide(el) {\n            if (el && el.ownerDocument == editor.document) {\n              if (el.tagName.toLowerCase() == \"img\" || domUtils.findParentByTagName(el, \"a\", true)) {\n                return el !== popup.anchorEl;\n              }\n            }return baidu.editor.ui.Popup.prototype.queryAutoHide.call(this, el);\n          } });popup.render();if (editor.options.imagePopup) {\n          editor.addListener(\"mouseover\", function (t, evt) {\n            evt = evt || window.event;var el = evt.target || evt.srcElement;if (editor.ui._dialogs.insertframeDialog && /iframe/gi.test(el.tagName)) {\n              var html = popup.formatHtml(\"<nobr>\" + editor.getLang(\"property\") + ': <span onclick=$$._setIframeAlign(-2) class=\"edui-clickable\">' + editor.getLang(\"default\") + '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(-1) class=\"edui-clickable\">' + editor.getLang(\"justifyleft\") + '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(1) class=\"edui-clickable\">' + editor.getLang(\"justifyright\") + \"</span>&nbsp;&nbsp;\" + ' <span onclick=\"$$._updateIframe( this);\" class=\"edui-clickable\">' + editor.getLang(\"modify\") + \"</span></nobr>\");if (html) {\n                popup.getDom(\"content\").innerHTML = html;popup.anchorEl = el;popup.showAnchor(popup.anchorEl);\n              } else {\n                popup.hide();\n              }\n            }\n          });editor.addListener(\"selectionchange\", function (t, causeByUi) {\n            if (!causeByUi) return;var html = \"\",\n                str = \"\",\n                img = editor.selection.getRange().getClosedNode(),\n                dialogs = editor.ui._dialogs;if (img && img.tagName == \"IMG\") {\n              var dialogName = \"insertimageDialog\";if (img.className.indexOf(\"edui-faked-video\") != -1 || img.className.indexOf(\"edui-upload-video\") != -1) {\n                dialogName = \"insertvideoDialog\";\n              }if (img.className.indexOf(\"edui-faked-webapp\") != -1) {\n                dialogName = \"webappDialog\";\n              }if (img.src.indexOf(\"http://api.map.baidu.com\") != -1) {\n                dialogName = \"mapDialog\";\n              }if (img.className.indexOf(\"edui-faked-music\") != -1) {\n                dialogName = \"musicDialog\";\n              }if (img.src.indexOf(\"http://maps.google.com/maps/api/staticmap\") != -1) {\n                dialogName = \"gmapDialog\";\n              }if (img.getAttribute(\"anchorname\")) {\n                dialogName = \"anchorDialog\";html = popup.formatHtml(\"<nobr>\" + editor.getLang(\"property\") + ': <span onclick=$$._onImgEditButtonClick(\"anchorDialog\") class=\"edui-clickable\">' + editor.getLang(\"modify\") + \"</span>&nbsp;&nbsp;\" + \"<span onclick=$$._onRemoveButtonClick('anchor') class=\\\"edui-clickable\\\">\" + editor.getLang(\"delete\") + \"</span></nobr>\");\n              }if (img.getAttribute(\"word_img\")) {\n                editor.word_img = [img.getAttribute(\"word_img\")];dialogName = \"wordimageDialog\";\n              }if (domUtils.hasClass(img, \"loadingclass\") || domUtils.hasClass(img, \"loaderrorclass\")) {\n                dialogName = \"\";\n              }if (!dialogs[dialogName]) {\n                return;\n              }str = \"<nobr>\" + editor.getLang(\"property\") + \": \" + '<span onclick=$$._onImgSetFloat(\"none\") class=\"edui-clickable\">' + editor.getLang(\"default\") + \"</span>&nbsp;&nbsp;\" + '<span onclick=$$._onImgSetFloat(\"left\") class=\"edui-clickable\">' + editor.getLang(\"justifyleft\") + \"</span>&nbsp;&nbsp;\" + '<span onclick=$$._onImgSetFloat(\"right\") class=\"edui-clickable\">' + editor.getLang(\"justifyright\") + \"</span>&nbsp;&nbsp;\" + '<span onclick=$$._onImgSetFloat(\"center\") class=\"edui-clickable\">' + editor.getLang(\"justifycenter\") + \"</span>&nbsp;&nbsp;\" + \"<span onclick=\\\"$$._onImgEditButtonClick('\" + dialogName + '\\');\" class=\"edui-clickable\">' + editor.getLang(\"modify\") + \"</span></nobr>\";!html && (html = popup.formatHtml(str));\n            }if (editor.ui._dialogs.linkDialog) {\n              var link = editor.queryCommandValue(\"link\");var url;if (link && (url = link.getAttribute(\"_href\") || link.getAttribute(\"href\", 2))) {\n                var txt = url;if (url.length > 30) {\n                  txt = url.substring(0, 20) + \"...\";\n                }if (html) {\n                  html += '<div style=\"height:5px;\"></div>';\n                }html += popup.formatHtml(\"<nobr>\" + editor.getLang(\"anthorMsg\") + ': <a target=\"_blank\" href=\"' + url + '\" title=\"' + url + '\" >' + txt + \"</a>\" + ' <span class=\"edui-clickable\" onclick=\"$$._onEditButtonClick();\">' + editor.getLang(\"modify\") + \"</span>\" + ' <span class=\"edui-clickable\" onclick=\"$$._onRemoveButtonClick(\\'unlink\\');\"> ' + editor.getLang(\"clear\") + \"</span></nobr>\");popup.showAnchor(link);\n              }\n            }if (html) {\n              popup.getDom(\"content\").innerHTML = html;popup.anchorEl = img || link;popup.showAnchor(popup.anchorEl);\n            } else {\n              popup.hide();\n            }\n          });\n        }\n      }, _initToolbars: function _initToolbars() {\n        var editor = this.editor;var toolbars = this.toolbars || [];var toolbarUis = [];for (var i = 0; i < toolbars.length; i++) {\n          var toolbar = toolbars[i];var toolbarUi = new baidu.editor.ui.Toolbar({ theme: editor.options.theme });for (var j = 0; j < toolbar.length; j++) {\n            var toolbarItem = toolbar[j];var toolbarItemUi = null;if (typeof toolbarItem == \"string\") {\n              toolbarItem = toolbarItem.toLowerCase();if (toolbarItem == \"|\") {\n                toolbarItem = \"Separator\";\n              }if (toolbarItem == \"||\") {\n                toolbarItem = \"Breakline\";\n              }if (baidu.editor.ui[toolbarItem]) {\n                toolbarItemUi = new baidu.editor.ui[toolbarItem](editor);\n              }if (toolbarItem == \"fullscreen\") {\n                if (toolbarUis && toolbarUis[0]) {\n                  toolbarUis[0].items.splice(0, 0, toolbarItemUi);\n                } else {\n                  toolbarItemUi && toolbarUi.items.splice(0, 0, toolbarItemUi);\n                }continue;\n              }\n            } else {\n              toolbarItemUi = toolbarItem;\n            }if (toolbarItemUi && toolbarItemUi.id) {\n              toolbarUi.add(toolbarItemUi);\n            }\n          }toolbarUis[i] = toolbarUi;\n        }utils.each(UE._customizeUI, function (obj, key) {\n          var itemUI, index;if (obj.id && obj.id != editor.key) {\n            return false;\n          }itemUI = obj.execFn.call(editor, editor, key);if (itemUI) {\n            index = obj.index;if (index === undefined) {\n              index = toolbarUi.items.length;\n            }toolbarUi.add(itemUI, index);\n          }\n        });this.toolbars = toolbarUis;\n      }, getHtmlTpl: function getHtmlTpl() {\n        return '<div id=\"##\" class=\"%%\">' + '<div id=\"##_toolbarbox\" class=\"%%-toolbarbox\">' + (this.toolbars.length ? '<div id=\"##_toolbarboxouter\" class=\"%%-toolbarboxouter\"><div class=\"%%-toolbarboxinner\">' + this.renderToolbarBoxHtml() + \"</div></div>\" : \"\") + '<div id=\"##_toolbarmsg\" class=\"%%-toolbarmsg\" style=\"display:none;\">' + '<div id = \"##_upload_dialog\" class=\"%%-toolbarmsg-upload\" onclick=\"$$.showWordImageDialog();\">' + this.editor.getLang(\"clickToUpload\") + \"</div>\" + '<div class=\"%%-toolbarmsg-close\" onclick=\"$$.hideToolbarMsg();\">x</div>' + '<div id=\"##_toolbarmsg_label\" class=\"%%-toolbarmsg-label\"></div>' + '<div style=\"height:0;overflow:hidden;clear:both;\"></div>' + \"</div>\" + '<div id=\"##_message_holder\" class=\"%%-messageholder\"></div>' + \"</div>\" + '<div id=\"##_iframeholder\" class=\"%%-iframeholder\">' + \"</div>\" + '<div id=\"##_bottombar\" class=\"%%-bottomContainer\"><table><tr>' + '<td id=\"##_elementpath\" class=\"%%-bottombar\"></td>' + '<td id=\"##_wordcount\" class=\"%%-wordcount\"></td>' + '<td id=\"##_scale\" class=\"%%-scale\"><div class=\"%%-icon\"></div></td>' + \"</tr></table></div>\" + '<div id=\"##_scalelayer\"></div>' + \"</div>\";\n      }, showWordImageDialog: function showWordImageDialog() {\n        this._dialogs[\"wordimageDialog\"].open();\n      }, renderToolbarBoxHtml: function renderToolbarBoxHtml() {\n        var buff = [];for (var i = 0; i < this.toolbars.length; i++) {\n          buff.push(this.toolbars[i].renderHtml());\n        }return buff.join(\"\");\n      }, setFullScreen: function setFullScreen(fullscreen) {\n        var editor = this.editor,\n            container = editor.container.parentNode.parentNode;if (this._fullscreen != fullscreen) {\n          this._fullscreen = fullscreen;this.editor.fireEvent(\"beforefullscreenchange\", fullscreen);if (baidu.editor.browser.gecko) {\n            var bk = editor.selection.getRange().createBookmark();\n          }if (fullscreen) {\n            while (container.tagName != \"BODY\") {\n              var position = baidu.editor.dom.domUtils.getComputedStyle(container, \"position\");nodeStack.push(position);container.style.position = \"static\";container = container.parentNode;\n            }this._bakHtmlOverflow = document.documentElement.style.overflow;this._bakBodyOverflow = document.body.style.overflow;this._bakAutoHeight = this.editor.autoHeightEnabled;this._bakScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);this._bakEditorContaninerWidth = editor.iframe.parentNode.offsetWidth;if (this._bakAutoHeight) {\n              editor.autoHeightEnabled = false;this.editor.disableAutoHeight();\n            }document.documentElement.style.overflow = \"hidden\";window.scrollTo(0, window.scrollY);this._bakCssText = this.getDom().style.cssText;this._bakCssText1 = this.getDom(\"iframeholder\").style.cssText;editor.iframe.parentNode.style.width = \"\";this._updateFullScreen();\n          } else {\n            while (container.tagName != \"BODY\") {\n              container.style.position = nodeStack.shift();container = container.parentNode;\n            }this.getDom().style.cssText = this._bakCssText;this.getDom(\"iframeholder\").style.cssText = this._bakCssText1;if (this._bakAutoHeight) {\n              editor.autoHeightEnabled = true;this.editor.enableAutoHeight();\n            }document.documentElement.style.overflow = this._bakHtmlOverflow;document.body.style.overflow = this._bakBodyOverflow;editor.iframe.parentNode.style.width = this._bakEditorContaninerWidth + \"px\";window.scrollTo(0, this._bakScrollTop);\n          }if (browser.gecko && editor.body.contentEditable === \"true\") {\n            var input = document.createElement(\"input\");document.body.appendChild(input);editor.body.contentEditable = false;setTimeout(function () {\n              input.focus();setTimeout(function () {\n                editor.body.contentEditable = true;editor.fireEvent(\"fullscreenchanged\", fullscreen);editor.selection.getRange().moveToBookmark(bk).select(true);baidu.editor.dom.domUtils.remove(input);fullscreen && window.scroll(0, 0);\n              }, 0);\n            }, 0);\n          }if (editor.body.contentEditable === \"true\") {\n            this.editor.fireEvent(\"fullscreenchanged\", fullscreen);this.triggerLayout();\n          }\n        }\n      }, _updateFullScreen: function _updateFullScreen() {\n        if (this._fullscreen) {\n          var vpRect = uiUtils.getViewportRect();this.getDom().style.cssText = \"border:0;position:absolute;left:0;top:\" + (this.editor.options.topOffset || 0) + \"px;width:\" + vpRect.width + \"px;height:\" + vpRect.height + \"px;z-index:\" + (this.getDom().style.zIndex * 1 + 100);uiUtils.setViewportOffset(this.getDom(), { left: 0, top: this.editor.options.topOffset || 0 });this.editor.setHeight(vpRect.height - this.getDom(\"toolbarbox\").offsetHeight - this.getDom(\"bottombar\").offsetHeight - (this.editor.options.topOffset || 0), true);if (browser.gecko) {\n            try {\n              window.onresize();\n            } catch (e) {}\n          }\n        }\n      }, _updateElementPath: function _updateElementPath() {\n        var bottom = this.getDom(\"elementpath\"),\n            list;if (this.elementPathEnabled && (list = this.editor.queryCommandValue(\"elementpath\"))) {\n          var buff = [];for (var i = 0, ci; ci = list[i]; i++) {\n            buff[i] = this.formatHtml('<span unselectable=\"on\" onclick=\"$$.editor.execCommand(&quot;elementpath&quot;, &quot;' + i + '&quot;);\">' + ci + \"</span>\");\n          }bottom.innerHTML = '<div class=\"edui-editor-breadcrumb\" onmousedown=\"return false;\">' + this.editor.getLang(\"elementPathTip\") + \": \" + buff.join(\" &gt; \") + \"</div>\";\n        } else {\n          bottom.style.display = \"none\";\n        }\n      }, disableElementPath: function disableElementPath() {\n        var bottom = this.getDom(\"elementpath\");bottom.innerHTML = \"\";bottom.style.display = \"none\";this.elementPathEnabled = false;\n      }, enableElementPath: function enableElementPath() {\n        var bottom = this.getDom(\"elementpath\");bottom.style.display = \"\";this.elementPathEnabled = true;this._updateElementPath();\n      }, _scale: function _scale() {\n        var doc = document,\n            editor = this.editor,\n            editorHolder = editor.container,\n            editorDocument = editor.document,\n            toolbarBox = this.getDom(\"toolbarbox\"),\n            bottombar = this.getDom(\"bottombar\"),\n            scale = this.getDom(\"scale\"),\n            scalelayer = this.getDom(\"scalelayer\");var isMouseMove = false,\n            position = null,\n            minEditorHeight = 0,\n            minEditorWidth = editor.options.minFrameWidth,\n            pageX = 0,\n            pageY = 0,\n            scaleWidth = 0,\n            scaleHeight = 0;function down() {\n          position = domUtils.getXY(editorHolder);if (!minEditorHeight) {\n            minEditorHeight = editor.options.minFrameHeight + toolbarBox.offsetHeight + bottombar.offsetHeight;\n          }scalelayer.style.cssText = \"position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:\" + editorHolder.offsetWidth + \"px;height:\" + editorHolder.offsetHeight + \"px;z-index:\" + (editor.options.zIndex + 1);domUtils.on(doc, \"mousemove\", move);domUtils.on(editorDocument, \"mouseup\", up);domUtils.on(doc, \"mouseup\", up);\n        }var me = this;this.editor.addListener(\"fullscreenchanged\", function (e, fullScreen) {\n          if (fullScreen) {\n            me.disableScale();\n          } else {\n            if (me.editor.options.scaleEnabled) {\n              me.enableScale();var tmpNode = me.editor.document.createElement(\"span\");me.editor.body.appendChild(tmpNode);me.editor.body.style.height = Math.max(domUtils.getXY(tmpNode).y, me.editor.iframe.offsetHeight - 20) + \"px\";domUtils.remove(tmpNode);\n            }\n          }\n        });function move(event) {\n          clearSelection();var e = event || window.event;pageX = e.pageX || doc.documentElement.scrollLeft + e.clientX;pageY = e.pageY || doc.documentElement.scrollTop + e.clientY;scaleWidth = pageX - position.x;scaleHeight = pageY - position.y;if (scaleWidth >= minEditorWidth) {\n            isMouseMove = true;scalelayer.style.width = scaleWidth + \"px\";\n          }if (scaleHeight >= minEditorHeight) {\n            isMouseMove = true;scalelayer.style.height = scaleHeight + \"px\";\n          }\n        }function up() {\n          if (isMouseMove) {\n            isMouseMove = false;editor.ui._actualFrameWidth = scalelayer.offsetWidth - 2;editorHolder.style.width = editor.ui._actualFrameWidth + \"px\";editor.setHeight(scalelayer.offsetHeight - bottombar.offsetHeight - toolbarBox.offsetHeight - 2, true);\n          }if (scalelayer) {\n            scalelayer.style.display = \"none\";\n          }clearSelection();domUtils.un(doc, \"mousemove\", move);domUtils.un(editorDocument, \"mouseup\", up);domUtils.un(doc, \"mouseup\", up);\n        }function clearSelection() {\n          if (browser.ie) doc.selection.clear();else window.getSelection().removeAllRanges();\n        }this.enableScale = function () {\n          if (editor.queryCommandState(\"source\") == 1) return;scale.style.display = \"\";this.scaleEnabled = true;domUtils.on(scale, \"mousedown\", down);\n        };this.disableScale = function () {\n          scale.style.display = \"none\";this.scaleEnabled = false;domUtils.un(scale, \"mousedown\", down);\n        };\n      }, isFullScreen: function isFullScreen() {\n        return this._fullscreen;\n      }, postRender: function postRender() {\n        UIBase.prototype.postRender.call(this);for (var i = 0; i < this.toolbars.length; i++) {\n          this.toolbars[i].postRender();\n        }var me = this;var timerId,\n            domUtils = baidu.editor.dom.domUtils,\n            updateFullScreenTime = function updateFullScreenTime() {\n          clearTimeout(timerId);timerId = setTimeout(function () {\n            me._updateFullScreen();\n          });\n        };domUtils.on(window, \"resize\", updateFullScreenTime);me.addListener(\"destroy\", function () {\n          domUtils.un(window, \"resize\", updateFullScreenTime);clearTimeout(timerId);\n        });\n      }, showToolbarMsg: function showToolbarMsg(msg, flag) {\n        this.getDom(\"toolbarmsg_label\").innerHTML = msg;this.getDom(\"toolbarmsg\").style.display = \"\";if (!flag) {\n          var w = this.getDom(\"upload_dialog\");w.style.display = \"none\";\n        }\n      }, hideToolbarMsg: function hideToolbarMsg() {\n        this.getDom(\"toolbarmsg\").style.display = \"none\";\n      }, mapUrl: function mapUrl(url) {\n        return url ? url.replace(\"~/\", this.editor.options.UEDITOR_HOME_URL || \"\") : \"\";\n      }, triggerLayout: function triggerLayout() {\n        var dom = this.getDom();if (dom.style.zoom == \"1\") {\n          dom.style.zoom = \"100%\";\n        } else {\n          dom.style.zoom = \"1\";\n        }\n      } };utils.inherits(EditorUI, baidu.editor.ui.UIBase);var instances = {};UE.ui.Editor = function (options) {\n      var editor = new UE.Editor(options);editor.options.editor = editor;utils.loadFile(document, { href: editor.options.themePath + editor.options.theme + \"/css/ueditor.css\", tag: \"link\", type: \"text/css\", rel: \"stylesheet\" });var oldRender = editor.render;editor.render = function (holder) {\n        if (holder.constructor === String) {\n          editor.key = holder;instances[holder] = editor;\n        }utils.domReady(function () {\n          editor.langIsReady ? renderUI() : editor.addListener(\"langReady\", renderUI);function renderUI() {\n            editor.setOpt({ labelMap: editor.options.labelMap || editor.getLang(\"labelMap\") });new EditorUI(editor.options);if (holder) {\n              if (holder.constructor === String) {\n                holder = document.getElementById(holder);\n              }holder && holder.getAttribute(\"name\") && (editor.options.textarea = holder.getAttribute(\"name\"));if (holder && /script|textarea/gi.test(holder.tagName)) {\n                var newDiv = document.createElement(\"div\");holder.parentNode.insertBefore(newDiv, holder);var cont = holder.value || holder.innerHTML;editor.options.initialContent = /^[\\t\\r\\n ]*$/.test(cont) ? editor.options.initialContent : cont.replace(/>[\\n\\r\\t]+([ ]{4})+/g, \">\").replace(/[\\n\\r\\t]+([ ]{4})+</g, \"<\").replace(/>[\\n\\r\\t]+</g, \"><\");holder.className && (newDiv.className = holder.className);holder.style.cssText && (newDiv.style.cssText = holder.style.cssText);if (/textarea/i.test(holder.tagName)) {\n                  editor.textarea = holder;editor.textarea.style.display = \"none\";\n                } else {\n                  holder.parentNode.removeChild(holder);\n                }if (holder.id) {\n                  newDiv.id = holder.id;domUtils.removeAttributes(holder, \"id\");\n                }holder = newDiv;holder.innerHTML = \"\";\n              }\n            }domUtils.addClass(holder, \"edui-\" + editor.options.theme);editor.ui.render(holder);var opt = editor.options;editor.container = editor.ui.getDom();var parents = domUtils.findParents(holder, true);var displays = [];for (var i = 0, ci; ci = parents[i]; i++) {\n              displays[i] = ci.style.display;ci.style.display = \"block\";\n            }if (opt.initialFrameWidth) {\n              opt.minFrameWidth = opt.initialFrameWidth;\n            } else {\n              opt.minFrameWidth = opt.initialFrameWidth = holder.offsetWidth;var styleWidth = holder.style.width;if (/%$/.test(styleWidth)) {\n                opt.initialFrameWidth = styleWidth;\n              }\n            }if (opt.initialFrameHeight) {\n              opt.minFrameHeight = opt.initialFrameHeight;\n            } else {\n              opt.initialFrameHeight = opt.minFrameHeight = holder.offsetHeight;\n            }for (var i = 0, ci; ci = parents[i]; i++) {\n              ci.style.display = displays[i];\n            }if (holder.style.height) {\n              holder.style.height = \"\";\n            }editor.container.style.width = opt.initialFrameWidth + (/%$/.test(opt.initialFrameWidth) ? \"\" : \"px\");editor.container.style.zIndex = opt.zIndex;oldRender.call(editor, editor.ui.getDom(\"iframeholder\"));editor.fireEvent(\"afteruiready\");\n          }\n        });\n      };return editor;\n    };UE.getEditor = function (id, opt) {\n      var editor = instances[id];if (!editor) {\n        editor = instances[id] = new UE.ui.Editor(opt);editor.render(id);\n      }return editor;\n    };UE.delEditor = function (id) {\n      var editor;if (editor = instances[id]) {\n        editor.key && editor.destroy();delete instances[id];\n      }\n    };UE.registerUI = function (uiName, fn, index, editorId) {\n      utils.each(uiName.split(/\\s+/), function (name) {\n        UE._customizeUI[name] = { id: editorId, execFn: fn, index: index };\n      });\n    };\n  }();UE.registerUI(\"message\", function (editor) {\n    var editorui = baidu.editor.ui;var Message = editorui.Message;var holder;var _messageItems = [];var me = editor;me.addListener(\"ready\", function () {\n      holder = document.getElementById(me.ui.id + \"_message_holder\");updateHolderPos();setTimeout(function () {\n        updateHolderPos();\n      }, 500);\n    });me.addListener(\"showmessage\", function (type, opt) {\n      opt = utils.isString(opt) ? { content: opt } : opt;var message = new Message({ timeout: opt.timeout, type: opt.type, content: opt.content, keepshow: opt.keepshow, editor: me }),\n          mid = opt.id || \"msg_\" + (+new Date()).toString(36);message.render(holder);_messageItems[mid] = message;message.reset(opt);updateHolderPos();return mid;\n    });me.addListener(\"updatemessage\", function (type, id, opt) {\n      opt = utils.isString(opt) ? { content: opt } : opt;var message = _messageItems[id];message.render(holder);message && message.reset(opt);\n    });me.addListener(\"hidemessage\", function (type, id) {\n      var message = _messageItems[id];message && message.hide();\n    });function updateHolderPos() {\n      var toolbarbox = me.ui.getDom(\"toolbarbox\");if (toolbarbox) {\n        holder.style.top = toolbarbox.offsetHeight + 3 + \"px\";\n      }holder.style.zIndex = Math.max(me.options.zIndex, me.iframe.style.zIndex) + 1;\n    }\n  });UE.registerUI(\"autosave\", function (editor) {\n    var timer = null,\n        uid = null;editor.on(\"afterautosave\", function () {\n      clearTimeout(timer);timer = setTimeout(function () {\n        if (uid) {\n          editor.trigger(\"hidemessage\", uid);\n        }uid = editor.trigger(\"showmessage\", { content: editor.getLang(\"autosave.success\"), timeout: 2e3 });\n      }, 2e3);\n    });\n  });\n}();"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "/**\r\n * ueditor完整配置项\r\n * 可以在这里配置整个编辑器的特性\r\n */\n/**************************提示********************************\r\n * 所有被注释的配置项均为UEditor默认值。\r\n * 修改默认配置请首先确保已经完全明确该参数的真实用途。\r\n * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化编辑器时传入对应参数。\r\n * 当升级编辑器时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。\r\n **************************提示********************************/\n\n(function () {\n\n        /**\r\n         * 编辑器资源文件根路径。它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。\r\n         * 鉴于很多同学在使用编辑器的时候出现的种种路径问题，此处强烈建议大家使用\"相对于网站根目录的相对路径\"进行配置。\r\n         * \"相对于网站根目录的相对路径\"也就是以斜杠开头的形如\"/myProject/ueditor/\"这样的路径。\r\n         * 如果站点中有多个不在同一层级的页面需要实例化编辑器，且引用了同一UEditor的时候，此处的URL可能不适用于每个页面的编辑器。\r\n         * 因此，UEditor提供了针对不同页面的编辑器可单独配置的根路径，具体来说，在需要实例化编辑器的页面最顶部写上如下代码即可。当然，需要令此处的URL等于对应的配置。\r\n         * window.UEDITOR_HOME_URL = \"/xxxx/xxxx/\";\r\n         */\n        window.UEDITOR_HOME_URL = '/js/ueditor/';\n\n        var URL = window.UEDITOR_HOME_URL || getUEBasePath();\n\n        /**\r\n         * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。\r\n         */\n        window.UEDITOR_CONFIG = {\n\n                //为编辑器实例添加一个路径，这个不能被注释\n                UEDITOR_HOME_URL: URL\n\n                // 服务器统一请求接口路径\n                , serverUrl: URL + 'ue'\n\n                //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义\n\n                , toolbars: [[\"fullscreen\", \"source\", \"undo\", \"redo\", \"insertunorderedlist\", \"insertorderedlist\", \"link\", \"unlink\", \"help\", \"attachment\", \"simpleupload\", \"insertimage\", \"emotion\", \"pagebreak\", \"date\", \"bold\", \"italic\", \"fontborder\", \"strikethrough\", \"underline\", \"forecolor\", \"justifyleft\", \"justifycenter\", \"justifyright\", \"justifyjustify\", \"paragraph\", \"rowspacingbottom\", \"rowspacingtop\", \"lineheight\"]]\n                //当鼠标放在工具栏上时显示的tooltip提示,留空支持自动多语言配置，否则以配置值为准\n                //,labelMap:{\n                //    'anchor':'', 'undo':''\n                //}\n\n                //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式来自动多语言切换，当然，前提条件是lang文件夹下存在对应的语言文件：\n                //lang值也可以通过自动获取 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()\n                //,lang:\"zh-cn\"\n                //,langPath:URL +\"lang/\"\n\n                //主题配置项,默认是default。有需要的话也可以使用如下这样的方式来自动多主题切换，当然，前提条件是themes文件夹下存在对应的主题文件：\n                //现有如下皮肤:default\n                //,theme:'default'\n                //,themePath:URL +\"themes/\"\n\n                //,zIndex : 900     //编辑器层级的基数,默认是900\n\n                //针对getAllHtml方法，会在对应的head标签中增加该编码设置。\n                //,charset:\"utf-8\"\n\n                //若实例化编辑器的页面手动修改的domain，此处需要设置为true\n                //,customDomain:false\n\n                //常用配置项目\n                //,isShow : true    //默认显示编辑器\n\n                //,textarea:'editorValue' // 提交表单时，服务器获取编辑器提交内容的所用的参数，多实例时可以给容器name属性，会将name给定的值最为每个实例的键值，不用每次实例化的时候都设置这个值\n\n                //,initialContent:'欢迎使用ueditor!'    //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子\n\n                //,autoClearinitialContent:true //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了\n\n                //,focus:false //初始化时，是否让编辑器获得焦点true或false\n\n                //如果自定义，最好给p标签如下的行高，要不输入中文时，会有跳动感\n                //,initialStyle:'p{line-height:1em}'//编辑器层级的基数,可以用来改变字体等\n\n                //,iframeCssUrl: URL + '/themes/iframe.css' //给编辑器内部引入一个css文件\n\n                //,initialFrameWidth:1000  //初始化编辑器宽度,默认1000\n                //,initialFrameHeight:320  //初始化编辑器高度,默认320\n\n                //,readonly : false //编辑器初始化结束后,编辑区域是否是只读的，默认是false\n\n                //,autoClearEmptyNode : true //getContent时，是否删除空的inlineElement节点（包括嵌套的情况）\n\n                //,fullscreen : false //是否开启初始化时即全屏，默认关闭\n\n                //,imagePopup:true      //图片操作的浮层开关，默认打开\n\n                //,emotionLocalization:false //是否开启表情本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images表情文件夹\n\n                //粘贴只保留标签，去除标签所有属性\n                //,retainOnlyLabelPasted: false\n\n                //,pasteplain:false  //是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴\n                //纯文本粘贴模式下的过滤规则\n                //'filterTxtRules' : function(){\n                //    function transP(node){\n                //        node.tagName = 'p';\n                //        node.setStyle();\n                //    }\n                //    return {\n                //        //直接删除及其字节点内容\n                //        '-' : 'script style object iframe embed input select',\n                //        'p': {$:{}},\n                //        'br':{$:{}},\n                //        'div':{'$':{}},\n                //        'li':{'$':{}},\n                //        'caption':transP,\n                //        'th':transP,\n                //        'tr':transP,\n                //        'h1':transP,'h2':transP,'h3':transP,'h4':transP,'h5':transP,'h6':transP,\n                //        'td':function(node){\n                //            //没有内容的td直接删掉\n                //            var txt = !!node.innerText();\n                //            if(txt){\n                //                node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);\n                //            }\n                //            node.parentNode.removeChild(node,node.innerText())\n                //        }\n                //    }\n                //}()\n\n                //,allHtmlEnabled:false //提交到后台的数据是否包含整个html字符串\n\n                //insertorderedlist\n                //有序列表的下拉配置,值留空时支持多语言自动识别，若配置值，则以此值为准\n                //,'insertorderedlist':{\n                //      //自定的样式\n                //        'num':'1,2,3...',\n                //        'num1':'1),2),3)...',\n                //        'num2':'(1),(2),(3)...',\n                //        'cn':'一,二,三....',\n                //        'cn1':'一),二),三)....',\n                //        'cn2':'(一),(二),(三)....',\n                //     //系统自带\n                //     'decimal' : '' ,         //'1,2,3...'\n                //     'lower-alpha' : '' ,    // 'a,b,c...'\n                //     'lower-roman' : '' ,    //'i,ii,iii...'\n                //     'upper-alpha' : '' , lang   //'A,B,C'\n                //     'upper-roman' : ''      //'I,II,III...'\n                //}\n\n                //insertunorderedlist\n                //无序列表的下拉配置，值留空时支持多语言自动识别，若配置值，则以此值为准\n                //,insertunorderedlist : { //自定的样式\n                //    'dash' :'— 破折号', //-破折号\n                //    'dot':' 。 小圆圈', //系统自带\n                //    'circle' : '',  // '○ 小圆圈'\n                //    'disc' : '',    // '● 小圆点'\n                //    'square' : ''   //'■ 小方块'\n                //}\n                //,listDefaultPaddingLeft : '30'//默认的左边缩进的基数倍\n                //,listiconpath : 'http://bs.baidu.com/listicon/'//自定义标号的路径\n                //,maxListLevel : 3 //限制可以tab的级数, 设置-1为不限制\n\n                //,autoTransWordToList:false  //禁止word中粘贴进来的列表自动变成列表标签\n\n                //paragraph\n                //段落格式 值留空时支持多语言自动识别，若配置，则以配置值为准\n                //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}\n\n                //rowspacingtop\n                //段间距 值和显示的名字相同\n                //,'rowspacingtop':['5', '10', '15', '20', '25']\n\n                //rowspacingBottom\n                //段间距 值和显示的名字相同\n                //,'rowspacingbottom':['5', '10', '15', '20', '25']\n\n                //lineheight\n                //行内间距 值和显示的名字相同\n                //,'lineheight':['1', '1.5','1.75','2', '3', '4', '5']\n\n                //快捷菜单\n                //,shortcutMenu:[\"fontfamily\", \"fontsize\", \"bold\", \"italic\", \"underline\", \"forecolor\", \"backcolor\", \"insertorderedlist\", \"insertunorderedlist\"]\n\n                //tab\n                //点击tab键时移动的距离,tabSize倍数，tabNode什么字符做为单位\n                //,tabSize:4\n                //,tabNode:'&nbsp;'\n\n                //undo\n                //可以最多回退的次数,默认20\n                //,maxUndoCount:20\n                //当输入的字符数超过该值时，保存一次现场\n                //,maxInputCount:1\n\n                //scaleEnabled\n                //是否可以拉伸长高,默认true(当开启时，自动长高失效)\n                //,scaleEnabled:false\n                //,minFrameWidth:800    //编辑器拖动时最小宽度,默认800\n                //,minFrameHeight:220  //编辑器拖动时最小高度,默认220\n\n                //pageBreakTag\n                //分页标识符,默认是_ueditor_page_break_tag_\n                //,pageBreakTag:'_ueditor_page_break_tag_'\n\n                //sourceEditor\n                //源码的查看方式,codemirror 是代码高亮，textarea是文本框,默认是codemirror\n                //注意默认codemirror只能在ie8+和非ie中使用\n                //,sourceEditor:\"codemirror\"\n                //如果sourceEditor是codemirror，还用配置一下两个参数\n                //codeMirrorJsUrl js加载的路径，默认是 URL + \"third-party/codemirror/codemirror.js\"\n                //,codeMirrorJsUrl:URL + \"third-party/codemirror/codemirror.js\"\n                //codeMirrorCssUrl css加载的路径，默认是 URL + \"third-party/codemirror/codemirror.css\"\n                //,codeMirrorCssUrl:URL + \"third-party/codemirror/codemirror.css\"\n                //编辑器初始化完成后是否进入源码模式，默认为否。\n                //,sourceEditorFirst:false\n\n                //iframeUrlMap\n                //dialog内容的路径 ～会被替换成URL,垓属性一旦打开，将覆盖所有的dialog的默认路径\n                //,iframeUrlMap:{\n                //    'anchor':'~/dialogs/anchor/anchor.html',\n                //}\n\n        };\n\n        function getUEBasePath(docUrl, confUrl) {\n\n                return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());\n        }\n\n        function getConfigFilePath() {\n\n                var configPath = document.getElementsByTagName('script');\n\n                return configPath[configPath.length - 1].src;\n        }\n\n        function getBasePath(docUrl, confUrl) {\n\n                var basePath = confUrl;\n\n                if (/^(\\/|\\\\\\\\)/.test(confUrl)) {\n\n                        basePath = /^.+?\\w(\\/|\\\\\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\\/|\\\\\\\\)/, '');\n                } else if (!/^[a-z]+:/i.test(confUrl)) {\n\n                        docUrl = docUrl.split(\"#\")[0].split(\"?\")[0].replace(/[^\\\\\\/]+$/, '');\n\n                        basePath = docUrl + \"\" + confUrl;\n                }\n\n                return optimizationPath(basePath);\n        }\n\n        function optimizationPath(path) {\n\n                var protocol = /^[a-z]+:\\/\\//.exec(path)[0],\n                    tmp = null,\n                    res = [];\n\n                path = path.replace(protocol, \"\").split(\"?\")[0].split(\"#\")[0];\n\n                path = path.replace(/\\\\/g, '/').split(/\\//);\n\n                path[path.length - 1] = \"\";\n\n                while (path.length) {\n\n                        if ((tmp = path.shift()) === \"..\") {\n                                res.pop();\n                        } else if (tmp !== \".\") {\n                                res.push(tmp);\n                        }\n                }\n\n                return protocol + res.join(\"/\");\n        }\n        function upFiles() {\n                var myFiles = _editor.getDialog(\"attachment\");\n                myFiles.open();\n        }\n        window.UE = {\n                getUEBasePath: getUEBasePath\n        };\n})();"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "/**\r\n * Created with JetBrains PhpStorm.\r\n * User: taoqili\r\n * Date: 12-6-12\r\n * Time: 下午5:02\r\n * To change this template use File | Settings | File Templates.\r\n */\nUE.I18N['zh-cn'] = {\n    'labelMap': {\n        'anchor': '锚点', 'undo': '撤销', 'redo': '重做', 'bold': '加粗', 'indent': '首行缩进', 'snapscreen': '截图',\n        'italic': '斜体', 'underline': '下划线', 'strikethrough': '删除线', 'subscript': '下标', 'fontborder': '字符边框',\n        'superscript': '上标', 'formatmatch': '格式刷', 'source': '源代码', 'blockquote': '引用',\n        'pasteplain': '纯文本粘贴模式', 'selectall': '全选', 'print': '打印', 'preview': '预览',\n        'horizontal': '分隔线', 'removeformat': '清除格式', 'time': '时间', 'date': '日期',\n        'unlink': '取消链接', 'insertrow': '前插入行', 'insertcol': '前插入列', 'mergeright': '右合并单元格', 'mergedown': '下合并单元格',\n        'deleterow': '删除行', 'deletecol': '删除列', 'splittorows': '拆分成行',\n        'splittocols': '拆分成列', 'splittocells': '完全拆分单元格', 'deletecaption': '删除表格标题', 'inserttitle': '插入标题',\n        'mergecells': '合并多个单元格', 'deletetable': '删除表格', 'cleardoc': '清空文档', 'insertparagraphbeforetable': \"表格前插入行\", 'insertcode': '代码语言',\n        'fontfamily': '字体', 'fontsize': '字号', 'paragraph': '段落格式', 'simpleupload': '单图上传', 'insertimage': '多图上传', 'edittable': '表格属性', 'edittd': '单元格属性', 'link': '超链接',\n        'emotion': '表情', 'spechars': '特殊字符', 'searchreplace': '查询替换', 'map': 'Baidu地图', 'gmap': 'Google地图',\n        'insertvideo': '视频', 'help': '帮助', 'justifyleft': '居左对齐', 'justifyright': '居右对齐', 'justifycenter': '居中对齐',\n        'justifyjustify': '两端对齐', 'forecolor': '字体颜色', 'backcolor': '背景色', 'insertorderedlist': '有序列表',\n        'insertunorderedlist': '无序列表', 'fullscreen': '全屏', 'directionalityltr': '从左向右输入', 'directionalityrtl': '从右向左输入',\n        'rowspacingtop': '段前距', 'rowspacingbottom': '段后距', 'pagebreak': '分页', 'insertframe': '插入Iframe', 'imagenone': '默认',\n        'imageleft': '左浮动', 'imageright': '右浮动', 'attachment': '附件', 'imagecenter': '居中', 'wordimage': '图片转存',\n        'lineheight': '行间距', 'edittip': '编辑提示', 'customstyle': '自定义标题', 'autotypeset': '自动排版',\n        'webapp': '百度应用', 'touppercase': '字母大写', 'tolowercase': '字母小写', 'background': '背景', 'template': '模板', 'scrawl': '涂鸦',\n        'music': '音乐', 'inserttable': '插入表格', 'drafts': '从草稿箱加载', 'charts': '图表'\n    },\n    'insertorderedlist': {\n        'num': '1,2,3...',\n        'num1': '1),2),3)...',\n        'num2': '(1),(2),(3)...',\n        'cn': '一,二,三....',\n        'cn1': '一),二),三)....',\n        'cn2': '(一),(二),(三)....',\n        'decimal': '1,2,3...',\n        'lower-alpha': 'a,b,c...',\n        'lower-roman': 'i,ii,iii...',\n        'upper-alpha': 'A,B,C...',\n        'upper-roman': 'I,II,III...'\n    },\n    'insertunorderedlist': {\n        'circle': '○ 大圆圈',\n        'disc': '● 小黑点',\n        'square': '■ 小方块 ',\n        'dash': '— 破折号',\n        'dot': ' 。 小圆圈'\n    },\n    'paragraph': { 'p': '段落', 'h1': '标题 1', 'h2': '标题 2', 'h3': '标题 3', 'h4': '标题 4', 'h5': '标题 5', 'h6': '标题 6' },\n    'fontfamily': {\n        'songti': '宋体',\n        'kaiti': '楷体',\n        'heiti': '黑体',\n        'lishu': '隶书',\n        'yahei': '微软雅黑',\n        'andaleMono': 'andale mono',\n        'arial': 'arial',\n        'arialBlack': 'arial black',\n        'comicSansMs': 'comic sans ms',\n        'impact': 'impact',\n        'timesNewRoman': 'times new roman'\n    },\n    'customstyle': {\n        'tc': '标题居中',\n        'tl': '标题居左',\n        'im': '强调',\n        'hi': '明显强调'\n    },\n    'autoupload': {\n        'exceedSizeError': '文件大小超出限制',\n        'exceedTypeError': '文件格式不允许',\n        'jsonEncodeError': '服务器返回格式错误',\n        'loading': \"正在上传...\",\n        'loadError': \"上传错误\",\n        'errorLoadConfig': '后端配置项没有正常加载，上传插件不能正常使用！'\n    },\n    'simpleupload': {\n        'exceedSizeError': '文件大小超出限制',\n        'exceedTypeError': '文件格式不允许',\n        'jsonEncodeError': '服务器返回格式错误',\n        'loading': \"正在上传...\",\n        'loadError': \"上传错误\",\n        'errorLoadConfig': '后端配置项没有正常加载，上传插件不能正常使用！'\n    },\n    'elementPathTip': \"元素路径\",\n    'wordCountTip': \"字数统计\",\n    'wordCountMsg': '当前已输入{#count}个字符, 您还可以输入{#leave}个字符。 ',\n    'wordOverFlowMsg': '<span style=\"color:red;\">字数超出最大允许值，服务器可能拒绝保存！</span>',\n    'ok': \"确认\",\n    'cancel': \"取消\",\n    'closeDialog': \"关闭对话框\",\n    'tableDrag': \"表格拖动必须引入uiUtils.js文件！\",\n    'autofloatMsg': \"工具栏浮动依赖编辑器UI，您首先需要引入UI文件!\",\n    'loadconfigError': '获取后台配置项请求出错，上传功能将不能正常使用！',\n    'loadconfigFormatError': '后台配置项返回格式出错，上传功能将不能正常使用！',\n    'loadconfigHttpError': '请求后台配置项http错误，上传功能将不能正常使用！',\n    'snapScreen_plugin': {\n        'browserMsg': \"仅支持IE浏览器！\",\n        'callBackErrorMsg': \"服务器返回数据有误，请检查配置项之后重试。\",\n        'uploadErrorMsg': \"截图上传失败，请检查服务器端环境! \"\n    },\n    'insertcode': {\n        'as3': 'ActionScript 3',\n        'bash': 'Bash/Shell',\n        'cpp': 'C/C++',\n        'css': 'CSS',\n        'cf': 'ColdFusion',\n        'c#': 'C#',\n        'delphi': 'Delphi',\n        'diff': 'Diff',\n        'erlang': 'Erlang',\n        'groovy': 'Groovy',\n        'html': 'HTML',\n        'java': 'Java',\n        'jfx': 'JavaFX',\n        'js': 'JavaScript',\n        'pl': 'Perl',\n        'php': 'PHP',\n        'plain': 'Plain Text',\n        'ps': 'PowerShell',\n        'python': 'Python',\n        'ruby': 'Ruby',\n        'scala': 'Scala',\n        'sql': 'SQL',\n        'vb': 'Visual Basic',\n        'xml': 'XML'\n    },\n    'confirmClear': \"确定清空当前文档么？\",\n    'contextMenu': {\n        'delete': \"删除\",\n        'selectall': \"全选\",\n        'deletecode': \"删除代码\",\n        'cleardoc': \"清空文档\",\n        'confirmclear': \"确定清空当前文档么？\",\n        'unlink': \"删除超链接\",\n        'paragraph': \"段落格式\",\n        'edittable': \"表格属性\",\n        'aligntd': \"单元格对齐方式\",\n        'aligntable': '表格对齐方式',\n        'tableleft': '左浮动',\n        'tablecenter': '居中显示',\n        'tableright': '右浮动',\n        'edittd': \"单元格属性\",\n        'setbordervisible': '设置表格边线可见',\n        'justifyleft': '左对齐',\n        'justifyright': '右对齐',\n        'justifycenter': '居中对齐',\n        'justifyjustify': '两端对齐',\n        'table': \"表格\",\n        'inserttable': '插入表格',\n        'deletetable': \"删除表格\",\n        'insertparagraphbefore': \"前插入段落\",\n        'insertparagraphafter': '后插入段落',\n        'deleterow': \"删除当前行\",\n        'deletecol': \"删除当前列\",\n        'insertrow': \"前插入行\",\n        'insertcol': \"左插入列\",\n        'insertrownext': '后插入行',\n        'insertcolnext': '右插入列',\n        'insertcaption': '插入表格名称',\n        'deletecaption': '删除表格名称',\n        'inserttitle': '插入表格标题行',\n        'deletetitle': '删除表格标题行',\n        'inserttitlecol': '插入表格标题列',\n        'deletetitlecol': '删除表格标题列',\n        'averageDiseRow': '平均分布各行',\n        'averageDisCol': '平均分布各列',\n        'mergeright': \"向右合并\",\n        'mergeleft': \"向左合并\",\n        'mergedown': \"向下合并\",\n        'mergecells': \"合并单元格\",\n        'splittocells': \"完全拆分单元格\",\n        'splittocols': \"拆分成列\",\n        'splittorows': \"拆分成行\",\n        'tablesort': '表格排序',\n        'enablesort': '设置表格可排序',\n        'disablesort': '取消表格可排序',\n        'reversecurrent': '逆序当前',\n        'orderbyasc': '按ASCII字符升序',\n        'reversebyasc': '按ASCII字符降序',\n        'orderbynum': '按数值大小升序',\n        'reversebynum': '按数值大小降序',\n        'borderbk': '边框底纹',\n        'setcolor': '表格隔行变色',\n        'unsetcolor': '取消表格隔行变色',\n        'setbackground': '选区背景隔行',\n        'unsetbackground': '取消选区背景',\n        'redandblue': '红蓝相间',\n        'threecolorgradient': '三色渐变',\n        'copy': \"复制(Ctrl + c)\",\n        'copymsg': \"浏览器不支持,请使用 'Ctrl + c'\",\n        'paste': \"粘贴(Ctrl + v)\",\n        'pastemsg': \"浏览器不支持,请使用 'Ctrl + v'\"\n    },\n    'copymsg': \"浏览器不支持,请使用 'Ctrl + c'\",\n    'pastemsg': \"浏览器不支持,请使用 'Ctrl + v'\",\n    'anthorMsg': \"链接\",\n    'clearColor': '清空颜色',\n    'standardColor': '标准颜色',\n    'themeColor': '主题颜色',\n    'property': '属性',\n    'default': '默认',\n    'modify': '修改',\n    'justifyleft': '左对齐',\n    'justifyright': '右对齐',\n    'justifycenter': '居中',\n    'justify': '默认',\n    'clear': '清除',\n    'anchorMsg': '锚点',\n    'delete': '删除',\n    'clickToUpload': \"点击上传\",\n    'unset': '尚未设置语言文件',\n    't_row': '行',\n    't_col': '列',\n    'more': '更多',\n    'pasteOpt': '粘贴选项',\n    'pasteSourceFormat': \"保留源格式\",\n    'tagFormat': '只保留标签',\n    'pasteTextFormat': '只保留文本',\n    'autoTypeSet': {\n        'mergeLine': \"合并空行\",\n        'delLine': \"清除空行\",\n        'removeFormat': \"清除格式\",\n        'indent': \"首行缩进\",\n        'alignment': \"对齐方式\",\n        'imageFloat': \"图片浮动\",\n        'removeFontsize': \"清除字号\",\n        'removeFontFamily': \"清除字体\",\n        'removeHtml': \"清除冗余HTML代码\",\n        'pasteFilter': \"粘贴过滤\",\n        'run': \"执行\",\n        'symbol': '符号转换',\n        'bdc2sb': '全角转半角',\n        'tobdc': '半角转全角'\n    },\n\n    'background': {\n        'static': {\n            'lang_background_normal': '背景设置',\n            'lang_background_local': '在线图片',\n            'lang_background_set': '选项',\n            'lang_background_none': '无背景色',\n            'lang_background_colored': '有背景色',\n            'lang_background_color': '颜色设置',\n            'lang_background_netimg': '网络图片',\n            'lang_background_align': '对齐方式',\n            'lang_background_position': '精确定位',\n            'repeatType': { 'options': [\"居中\", \"横向重复\", \"纵向重复\", \"平铺\", \"自定义\"] }\n\n        },\n        'noUploadImage': \"当前未上传过任何图片！\",\n        'toggleSelect': \"单击可切换选中状态\\n原图尺寸: \"\n    },\n    //===============dialog i18N=======================\n    'insertimage': {\n        'static': {\n            'lang_tab_remote': \"插入图片\", //节点\n            'lang_tab_upload': \"本地上传\",\n            'lang_tab_online': \"在线管理\",\n            'lang_tab_search': \"图片搜索\",\n            'lang_input_url': \"地 址：\",\n            'lang_input_size': \"大 小：\",\n            'lang_input_width': \"宽度\",\n            'lang_input_height': \"高度\",\n            'lang_input_border': \"边 框：\",\n            'lang_input_vhspace': \"边 距：\",\n            'lang_input_title': \"描 述：\",\n            'lang_input_align': '图片浮动方式：',\n            'lang_imgLoading': \"　图片加载中……\",\n            'lang_start_upload': \"开始上传\",\n            'lock': { 'title': \"锁定宽高比例\" }, //属性\n            'searchType': { 'title': \"图片类型\", 'options': [\"新闻\", \"壁纸\", \"表情\", \"头像\"] }, //select的option\n            'searchTxt': { 'value': \"请输入搜索关键词\" },\n            'searchBtn': { 'value': \"百度一下\" },\n            'searchReset': { 'value': \"清空搜索\" },\n            'noneAlign': { 'title': '无浮动' },\n            'leftAlign': { 'title': '左浮动' },\n            'rightAlign': { 'title': '右浮动' },\n            'centerAlign': { 'title': '居中独占一行' }\n        },\n        'uploadSelectFile': '点击选择图片',\n        'uploadAddFile': '继续添加',\n        'uploadStart': '开始上传',\n        'uploadPause': '暂停上传',\n        'uploadContinue': '继续上传',\n        'uploadRetry': '重试上传',\n        'uploadDelete': '删除',\n        'uploadTurnLeft': '向左旋转',\n        'uploadTurnRight': '向右旋转',\n        'uploadPreview': '预览中',\n        'uploadNoPreview': '不能预览',\n        'updateStatusReady': '选中_张图片，共_KB。',\n        'updateStatusConfirm': '已成功上传_张照片，_张照片上传失败',\n        'updateStatusFinish': '共_张（_KB），_张上传成功',\n        'updateStatusError': '，_张上传失败。',\n        'errorNotSupport': 'WebUploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器。',\n        'errorLoadConfig': '后端配置项没有正常加载，上传插件不能正常使用！',\n        'errorExceedSize': '文件大小超出',\n        'errorFileType': '文件格式不允许',\n        'errorInterrupt': '文件传输中断',\n        'errorUploadRetry': '上传失败，请重试',\n        'errorHttp': 'http请求错误',\n        'errorServerUpload': '服务器返回出错',\n        'remoteLockError': \"宽高不正确,不能所定比例\",\n        'numError': \"请输入正确的长度或者宽度值！例如：123，400\",\n        'imageUrlError': \"不允许的图片格式或者图片域！\",\n        'imageLoadError': \"图片加载失败！请检查链接地址或网络状态！\",\n        'searchRemind': \"请输入搜索关键词\",\n        'searchLoading': \"图片加载中，请稍后……\",\n        'searchRetry': \" :( ，抱歉，没有找到图片！请重试一次！\"\n    },\n    'attachment': {\n        'static': {\n            'lang_tab_upload': '上传附件',\n            'lang_tab_online': '在线附件',\n            'lang_start_upload': \"开始上传\",\n            'lang_drop_remind': \"可以将文件拖到这里，单次最多可选100个文件\"\n        },\n        'uploadSelectFile': '点击选择文件',\n        'uploadAddFile': '继续添加',\n        'uploadStart': '开始上传',\n        'uploadPause': '暂停上传',\n        'uploadContinue': '继续上传',\n        'uploadRetry': '重试上传',\n        'uploadDelete': '删除',\n        'uploadTurnLeft': '向左旋转',\n        'uploadTurnRight': '向右旋转',\n        'uploadPreview': '预览中',\n        'updateStatusReady': '选中_个文件，共_KB。',\n        'updateStatusConfirm': '已成功上传_个文件，_个文件上传失败',\n        'updateStatusFinish': '共_个（_KB），_个上传成功',\n        'updateStatusError': '，_张上传失败。',\n        'errorNotSupport': 'WebUploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器。',\n        'errorLoadConfig': '后端配置项没有正常加载，上传插件不能正常使用！',\n        'errorExceedSize': '文件大小超出',\n        'errorFileType': '文件格式不允许',\n        'errorInterrupt': '文件传输中断',\n        'errorUploadRetry': '上传失败，请重试',\n        'errorHttp': 'http请求错误',\n        'errorServerUpload': '服务器返回出错'\n    },\n    'insertvideo': {\n        'static': {\n            'lang_tab_insertV': \"插入视频\",\n            'lang_tab_searchV': \"搜索视频\",\n            'lang_tab_uploadV': \"上传视频\",\n            'lang_video_url': \"视频网址\",\n            'lang_video_size': \"视频尺寸\",\n            'lang_videoW': \"宽度\",\n            'lang_videoH': \"高度\",\n            'lang_alignment': \"对齐方式\",\n            'videoSearchTxt': { 'value': \"请输入搜索关键字！\" },\n            'videoType': { 'options': [\"全部\", \"热门\", \"娱乐\", \"搞笑\", \"体育\", \"科技\", \"综艺\"] },\n            'videoSearchBtn': { 'value': \"百度一下\" },\n            'videoSearchReset': { 'value': \"清空结果\" },\n\n            'lang_input_fileStatus': ' 当前未上传文件',\n            'startUpload': { 'style': \"background:url(upload.png) no-repeat;\" },\n\n            'lang_upload_size': \"视频尺寸\",\n            'lang_upload_width': \"宽度\",\n            'lang_upload_height': \"高度\",\n            'lang_upload_alignment': \"对齐方式\",\n            'lang_format_advice': \"建议使用mp4格式.\"\n\n        },\n        'numError': \"请输入正确的数值，如123,400\",\n        'floatLeft': \"左浮动\",\n        'floatRight': \"右浮动\",\n        '\"default\"': \"默认\",\n        'block': \"独占一行\",\n        'urlError': \"输入的视频地址有误，请检查后再试！\",\n        'loading': \" &nbsp;视频加载中，请等待……\",\n        'clickToSelect': \"点击选中\",\n        'goToSource': '访问源视频',\n        'noVideo': \" &nbsp; &nbsp;抱歉，找不到对应的视频，请重试！\",\n\n        'browseFiles': '浏览文件',\n        'uploadSuccess': '上传成功!',\n        'delSuccessFile': '从成功队列中移除',\n        'delFailSaveFile': '移除保存失败文件',\n        'statusPrompt': ' 个文件已上传！ ',\n        'flashVersionError': '当前Flash版本过低，请更新FlashPlayer后重试！',\n        'flashLoadingError': 'Flash加载失败!请检查路径或网络状态',\n        'fileUploadReady': '等待上传……',\n        'delUploadQueue': '从上传队列中移除',\n        'limitPrompt1': '单次不能选择超过',\n        'limitPrompt2': '个文件！请重新选择！',\n        'delFailFile': '移除失败文件',\n        'fileSizeLimit': '文件大小超出限制！',\n        'emptyFile': '空文件无法上传！',\n        'fileTypeError': '文件类型不允许！',\n        'unknownError': '未知错误！',\n        'fileUploading': '上传中，请等待……',\n        'cancelUpload': '取消上传',\n        'netError': '网络错误',\n        'failUpload': '上传失败!',\n        'serverIOError': '服务器IO错误！',\n        'noAuthority': '无权限！',\n        'fileNumLimit': '上传个数限制',\n        'failCheck': '验证失败，本次上传被跳过！',\n        'fileCanceling': '取消中，请等待……',\n        'stopUploading': '上传已停止……',\n\n        'uploadSelectFile': '点击选择文件',\n        'uploadAddFile': '继续添加',\n        'uploadStart': '开始上传',\n        'uploadPause': '暂停上传',\n        'uploadContinue': '继续上传',\n        'uploadRetry': '重试上传',\n        'uploadDelete': '删除',\n        'uploadTurnLeft': '向左旋转',\n        'uploadTurnRight': '向右旋转',\n        'uploadPreview': '预览中',\n        'updateStatusReady': '选中_个文件，共_KB。',\n        'updateStatusConfirm': '成功上传_个，_个失败',\n        'updateStatusFinish': '共_个(_KB)，_个成功上传',\n        'updateStatusError': '，_张上传失败。',\n        'errorNotSupport': 'WebUploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器。',\n        'errorLoadConfig': '后端配置项没有正常加载，上传插件不能正常使用！',\n        'errorExceedSize': '文件大小超出',\n        'errorFileType': '文件格式不允许',\n        'errorInterrupt': '文件传输中断',\n        'errorUploadRetry': '上传失败，请重试',\n        'errorHttp': 'http请求错误',\n        'errorServerUpload': '服务器返回出错'\n    },\n    'webapp': {\n        'tip1': \"本功能由百度APP提供，如看到此页面，请各位站长首先申请百度APPKey!\",\n        'tip2': \"申请完成之后请至ueditor.config.js中配置获得的appkey! \",\n        'applyFor': \"点此申请\",\n        'anthorApi': \"百度API\"\n    },\n    'template': {\n        'static': {\n            'lang_template_bkcolor': '背景颜色',\n            'lang_template_clear': '保留原有内容',\n            'lang_template_select': '选择模板'\n        },\n        'blank': \"空白文档\",\n        'blog': \"博客文章\",\n        'resume': \"个人简历\",\n        'richText': \"图文混排\",\n        'sciPapers': \"科技论文\"\n\n    },\n    'scrawl': {\n        'static': {\n            'lang_input_previousStep': \"上一步\",\n            'lang_input_nextsStep': \"下一步\",\n            'lang_input_clear': '清空',\n            'lang_input_addPic': '添加背景',\n            'lang_input_ScalePic': '缩放背景',\n            'lang_input_removePic': '删除背景',\n            'J_imgTxt': { title: '添加背景图片' }\n        },\n        'noScarwl': \"尚未作画，白纸一张~\",\n        'scrawlUpLoading': \"涂鸦上传中,别急哦~\",\n        'continueBtn': \"继续\",\n        'imageError': \"糟糕，图片读取失败了！\",\n        'backgroundUploading': '背景图片上传中,别急哦~'\n    },\n    'music': {\n        'static': {\n            'lang_input_tips': \"输入歌手/歌曲/专辑，搜索您感兴趣的音乐！\",\n            'J_searchBtn': { value: '搜索歌曲' }\n        },\n        'emptyTxt': '未搜索到相关音乐结果，请换一个关键词试试。',\n        'chapter': '歌曲',\n        'singer': '歌手',\n        'special': '专辑',\n        'listenTest': '试听'\n    },\n    'anchor': {\n        'static': {\n            'lang_input_anchorName': '锚点名字：'\n        }\n    },\n    'charts': {\n        'static': {\n            'lang_data_source': '数据源：',\n            'lang_chart_format': '图表格式：',\n            'lang_data_align': '数据对齐方式',\n            'lang_chart_align_same': '数据源与图表X轴Y轴一致',\n            'lang_chart_align_reverse': '数据源与图表X轴Y轴相反',\n            'lang_chart_title': '图表标题',\n            'lang_chart_main_title': '主标题：',\n            'lang_chart_sub_title': '子标题：',\n            'lang_chart_x_title': 'X轴标题：',\n            'lang_chart_y_title': 'Y轴标题：',\n            'lang_chart_tip': '提示文字',\n            'lang_cahrt_tip_prefix': '提示文字前缀：',\n            'lang_cahrt_tip_description': '仅饼图有效， 当鼠标移动到饼图中相应的块上时，提示框内的文字的前缀',\n            'lang_chart_data_unit': '数据单位',\n            'lang_chart_data_unit_title': '单位：',\n            'lang_chart_data_unit_description': '显示在每个数据点上的数据的单位， 比如： 温度的单位 ℃',\n            'lang_chart_type': '图表类型：',\n            'lang_prev_btn': '上一个',\n            'lang_next_btn': '下一个'\n        }\n    },\n    'emotion': {\n        'static': {\n            'lang_input_choice': '精选',\n            'lang_input_Tuzki': '兔斯基',\n            'lang_input_BOBO': 'BOBO',\n            'lang_input_lvdouwa': '绿豆蛙',\n            'lang_input_babyCat': 'baby猫',\n            'lang_input_bubble': '泡泡',\n            'lang_input_youa': '有啊'\n        }\n    },\n    'gmap': {\n        'static': {\n            'lang_input_address': '地址',\n            'lang_input_search': '搜索',\n            'address': { value: \"北京\" }\n        },\n        searchError: '无法定位到该地址!'\n    },\n    'help': {\n        'static': {\n            'lang_input_about': '关于UEditor',\n            'lang_input_shortcuts': '快捷键',\n            'lang_input_introduction': 'UEditor是由百度web前端研发部开发的所见即所得富文本web编辑器，具有轻量，可定制，注重用户体验等特点。开源基于BSD协议，允许自由使用和修改代码。',\n            'lang_Txt_shortcuts': '快捷键',\n            'lang_Txt_func': '功能',\n            'lang_Txt_bold': '给选中字设置为加粗',\n            'lang_Txt_copy': '复制选中内容',\n            'lang_Txt_cut': '剪切选中内容',\n            'lang_Txt_Paste': '粘贴',\n            'lang_Txt_undo': '重新执行上次操作',\n            'lang_Txt_redo': '撤销上一次操作',\n            'lang_Txt_italic': '给选中字设置为斜体',\n            'lang_Txt_underline': '给选中字加下划线',\n            'lang_Txt_selectAll': '全部选中',\n            'lang_Txt_visualEnter': '软回车',\n            'lang_Txt_fullscreen': '全屏'\n        }\n    },\n    'insertframe': {\n        'static': {\n            'lang_input_address': '地址：',\n            'lang_input_width': '宽度：',\n            'lang_input_height': '高度：',\n            'lang_input_isScroll': '允许滚动条：',\n            'lang_input_frameborder': '显示框架边框：',\n            'lang_input_alignMode': '对齐方式：',\n            'align': { title: \"对齐方式\", options: [\"默认\", \"左对齐\", \"右对齐\", \"居中\"] }\n        },\n        'enterAddress': '请输入地址!'\n    },\n    'link': {\n        'static': {\n            'lang_input_text': '文本内容：',\n            'lang_input_url': '链接地址：',\n            'lang_input_title': '标题：',\n            'lang_input_target': '是否在新窗口打开：'\n        },\n        'validLink': '只支持选中一个链接时生效',\n        'httpPrompt': '您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀'\n    },\n    'map': {\n        'static': {\n            lang_city: \"城市\",\n            lang_address: \"地址\",\n            city: { value: \"北京\" },\n            lang_search: \"搜索\",\n            lang_dynamicmap: \"插入动态地图\"\n        },\n        cityMsg: \"请选择城市\",\n        errorMsg: \"抱歉，找不到该位置！\"\n    },\n    'searchreplace': {\n        'static': {\n            lang_tab_search: \"查找\",\n            lang_tab_replace: \"替换\",\n            lang_search1: \"查找\",\n            lang_search2: \"查找\",\n            lang_replace: \"替换\",\n            lang_searchReg: '支持正则表达式，添加前后斜杠标示为正则表达式，例如“/表达式/”',\n            lang_searchReg1: '支持正则表达式，添加前后斜杠标示为正则表达式，例如“/表达式/”',\n            lang_case_sensitive1: \"区分大小写\",\n            lang_case_sensitive2: \"区分大小写\",\n            nextFindBtn: { value: \"下一个\" },\n            preFindBtn: { value: \"上一个\" },\n            nextReplaceBtn: { value: \"下一个\" },\n            preReplaceBtn: { value: \"上一个\" },\n            repalceBtn: { value: \"替换\" },\n            repalceAllBtn: { value: \"全部替换\" }\n        },\n        getEnd: \"已经搜索到文章末尾！\",\n        getStart: \"已经搜索到文章头部\",\n        countMsg: \"总共替换了{#count}处！\"\n    },\n    'snapscreen': {\n        'static': {\n            lang_showMsg: \"截图功能需要首先安装UEditor截图插件！ \",\n            lang_download: \"点此下载\",\n            lang_step1: \"第一步，下载UEditor截图插件并运行安装。\",\n            lang_step2: \"第二步，插件安装完成后即可使用，如不生效，请重启浏览器后再试！\"\n        }\n    },\n    'spechars': {\n        'static': {},\n        tsfh: \"特殊字符\",\n        lmsz: \"罗马字符\",\n        szfh: \"数学字符\",\n        rwfh: \"日文字符\",\n        xlzm: \"希腊字母\",\n        ewzm: \"俄文字符\",\n        pyzm: \"拼音字母\",\n        yyyb: \"英语音标\",\n        zyzf: \"其他\"\n    },\n    'edittable': {\n        'static': {\n            'lang_tableStyle': '表格样式',\n            'lang_insertCaption': '添加表格名称行',\n            'lang_insertTitle': '添加表格标题行',\n            'lang_insertTitleCol': '添加表格标题列',\n            'lang_orderbycontent': \"使表格内容可排序\",\n            'lang_tableSize': '自动调整表格尺寸',\n            'lang_autoSizeContent': '按表格文字自适应',\n            'lang_autoSizePage': '按页面宽度自适应',\n            'lang_example': '示例',\n            'lang_borderStyle': '表格边框',\n            'lang_color': '颜色:'\n        },\n        captionName: '表格名称',\n        titleName: '标题',\n        cellsName: '内容',\n        errorMsg: '有合并单元格，不可排序'\n    },\n    'edittip': {\n        'static': {\n            lang_delRow: '删除整行',\n            lang_delCol: '删除整列'\n        }\n    },\n    'edittd': {\n        'static': {\n            lang_tdBkColor: '背景颜色:'\n        }\n    },\n    'formula': {\n        'static': {}\n    },\n    'wordimage': {\n        'static': {\n            lang_resave: \"转存步骤\",\n            uploadBtn: { src: \"upload.png\", alt: \"上传\" },\n            clipboard: { style: \"background: url(copy.png) -153px -1px no-repeat;\" },\n            lang_step: \"1、点击顶部复制按钮，将地址复制到剪贴板；2、点击添加照片按钮，在弹出的对话框中使用Ctrl+V粘贴地址；3、点击打开后选择图片上传流程。\"\n        },\n        'fileType': \"图片\",\n        'flashError': \"FLASH初始化失败，请检查FLASH插件是否正确安装！\",\n        'netError': \"网络连接错误，请重试！\",\n        'copySuccess': \"图片地址已经复制！\",\n        'flashI18n': {} //留空默认中文\n    },\n    'autosave': {\n        'saving': '保存中...',\n        'success': '本地保存成功'\n    }\n};"

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {// 将bootstrap样式引入js模块中
__webpack_require__(27);
__webpack_require__(26);
__webpack_require__(20);
__webpack_require__(10);
__webpack_require__(3);
__webpack_require__(24);
__webpack_require__(23);
__webpack_require__(25);
__webpack_require__(17);
__webpack_require__(21);

$(function () {
    NProgress.start();
    setTimeout(function () {
        NProgress.done();
    }, 200);

    // 屏幕最小化
    $('.glyphicon-chevron-left').click(function () {
        $('.right-page').animate({
            left: '0px',
            width: '100%'
        });
        $('.glyphicon-chevron-left').addClass('hide');
        $('.glyphicon-chevron-right').removeClass('hide');
    });

    // 屏幕最大化
    $('.glyphicon-chevron-right').click(function () {
        $('.right-page').animate({
            left: '16.5%',
            width: '83.5%'
        });
        $('.glyphicon-chevron-right').addClass('hide');
        $('.glyphicon-chevron-left').removeClass('hide');
    });

    // 一级菜单被点击时，切换背景并判断是否展开二级菜单
    $('.nav-side ul li').click(function (event) {

        if (!$(event.target).hasClass('catalog')) {
            // 这个if，实在是迫于无奈之举啊
            $('.nav-side ul li.side-first-level-active').removeClass('side-first-level-active');
            // 先收缩所有的二级菜单
            $('.nav-side ul li .side-second-level').delay(0).slideUp(300);
            $(this).addClass('side-first-level-active');

            // 如果存在二级菜单，展开
            if ($(this).children('ul').hasClass('side-second-level')) {
                // 判断二级菜单当前状态
                if ($(this).children('.side-second-level').css('display') === 'none') {
                    $(this).children(".side-second-level").delay(0).slideDown(300);
                } else {
                    $(this).children(".side-second-level").delay(0).slideUp(300);
                }
            }
        }
    });

    // 二级菜单被点击时，添加样式
    $('.side-first-level .side-second-level li a').click(function (event) {
        if (!$(event.target).hasClass('catalog')) {
            event.stopPropagation();
        }
        $('.side-first-level .side-second-level li a').removeClass('side-second-level-active');
        $(this).addClass('side-second-level-active');
    });

    // blog中的公共函数
    var Command = {
        // 添加
        add: function add(event, element, content) {
            var that = this;
            var type = 'add';

            // 操作提醒框
            if ($('.main ' + element + ' .edit').length === 0) {
                // 尚未创建编辑栏目框

                that.showNewEdit(element, null, type, content);
            } else {
                // 已经存在创建好的编辑栏目框，注意替换其中的Id

                that.showExistEdit(element, null, type, content);
            }
        },
        // 编辑管理
        edit: function edit(event, element, content) {
            var that = this;
            var type = 'edit';
            var Id = $(event.target).attr('name');

            // 操作提醒框
            if ($('.main ' + element + ' .edit').length === 0) {
                // 尚未创建编辑栏目框

                that.showNewEdit(element, Id, type, content);
            } else {
                // 已经存在创建好的编辑栏目框，注意替换其中的Id

                that.showExistEdit(element, Id, type, content);
            }
        },
        // 创建编辑框，为添加与编辑所共用
        buildEdit: function buildEdit(Id, type, content) {
            var name = '';
            if (Id) {
                name += 'name="' + Id + '"';
            }

            var html = "<div class='edit' name='" + type + "'>";
            html += "<div class='edit-header'><i class='glyphicon glyphicon-info-sign'></i><span>" + content + "</span>";
            html += "<a href='javascript:;'><i class='glyphicon glyphicon-remove edit-remove'></i></a></div>";
            html += "<div class='edit-body'><input type='text' class='edit-input'></div>";
            html += "<div class='edit-footer pull-right'><input type='button' value='确定' class='btn btn-success'" + name + ">";
            html += "<input type='button' value='取消' class='btn btn-default edit-cancel'></div></div>";
            return html;
        },
        showNewEdit: function showNewEdit(element, Id, type, content) {

            var that = this;
            $('#shadow').show().animate({ opacity: 1 }, function () {

                var html = that.buildEdit(Id, type, content);
                $('.main ' + element).append(html);
            });
        },
        // showExistEdit函数为添加与编辑两者所共用
        showExistEdit: function showExistEdit(element, Id, type, content) {
            // 如果存在Id，代表该次操作为编辑目录
            if (Id) {
                $('.main .edit .edit-footer input').attr('name', Id);
            }

            // 清空输入框
            $('.main .edit .edit-input').val('');
            $('.main .edit').attr('name', type);
            $('.main .edit .edit-header span').html(content);

            $('#shadow').show().animate({ opacity: 1 }, function () {
                $('.main .edit').removeClass('hidden');
            });
        },
        closeEdit: function closeEdit() {

            $('.main .edit .edit-header').css('color', '#000'); // 先清除因警告用户而出现的红色字体
            $('.main .edit .edit-input').val(''); // 清空输入框
            $('.main .edit').addClass('hidden');
            $('#shadow').hide().animate({ opacity: 0 });
        },
        // 表格中的全选与反选，但不包括状态为disabled的checkbox
        selectAll: function selectAll(event, element) {
            if ($(event.target).attr('checked')) {
                $(event.target).removeAttr('checked');
                $('.main ' + element + " input[type='checkbox']:not(:disabled)").prop("checked", false);
            } else {
                $(event.target).attr('checked', 'checked');
                $('.main ' + element + " input[type='checkbox']:not(:disabled)").prop("checked", true);
            }
        },

        // 表格中的单一删除
        singleDel: function singleDel(event, element) {

            var that = this;
            var type = "singleDel";
            var Id = $(event.target).attr('name');
            var content_enabled = "确定删除?";
            var content_disabled = "不允许删除！";

            // 如果点击垃圾箱，则勾选对应的复选框，不包括状态为disabled的checkbox
            if ($('.main ' + element + ' input[name="' + Id + '"]').is(':disabled')) {
                that.showReminder(element, null, type, content_disabled);
            } else {

                $('.main ' + element + ' input[name="' + Id + '"]').prop("checked", true);
                that.showReminder(element, Id, type, content_enabled);
            }
        },
        // 表格中的批量删除
        batchDel: function batchDel(event, element) {
            var that = this;
            var type_warn = 'warn';
            var type_batch = 'batchDel';
            var content_warn = "至少勾选一个！！";
            var content_batch = "确定删除所选项?";

            // 至少勾选一个选项
            if ($('.main ' + element + ' table input[type="checkbox"]:checked').length === 0) {
                that.showReminder(element, null, type_warn, content_warn);
                return false;
            }

            that.showReminder(element, null, type_batch, content_batch);
        },
        // 构建操作提醒框，为单一删除、批量删除以及批量删除提醒框三者所共用
        buildReminder: function buildReminder(Id, type, content) {

            var name = '';
            if (Id) {
                // 存在Id表明为单一删除，不存在Id则指的是批量删除，只有在单一删除的情况下需要name
                name += 'name ="' + Id + '"';
            }

            var html = "<div class='reminder' name = '" + type + "'>";
            html += "<div class='reminder-header'><i class='glyphicon glyphicon-info-sign'></i><span>操作提醒</span>";
            html += "<a href='javascript:;'><i class='glyphicon glyphicon-remove reminder-remove'" + name + "></i></a></div>";
            html += "<div class='reminder-body'><p>" + content + "</p></div>";
            html += "<div class='reminder-footer pull-right'><input type='button' value='确定' class='btn btn-delete'" + name + ">";
            html += "<input type='button' value='取消' class='btn btn-default reminder-cancel'" + name + "></div></div>";
            return html;
        },
        // 展示提醒操作框
        showReminder: function showReminder(element, Id, type, content) {
            if ($('.main .reminder').length === 0) {
                // 尚未创建操作提醒
                this.showNewReminder(element, Id, type, content);
            } else {
                // 已经存在创建好的操作提醒，注意替换其中的Id

                this.showExistReminder(Id, type, content);
            }
        },
        showNewReminder: function showNewReminder(element, Id, type, content) {

            var that = this;

            $('#shadow').show().animate({ opacity: 1 }, function () {
                var html = that.buildReminder(Id, type, content);
                $('.main ' + element).append(html);
            });
        },
        showExistReminder: function showExistReminder(Id, type, content) {

            $('.main .reminder .reminder-remove').attr('name', Id);
            $('.main .reminder .reminder-footer input').attr('name', Id);
            $('.main .reminder').attr('name', type);
            $('.main .reminder .reminder-body p').html(content);

            $('#shadow').show().animate({ opacity: 1 }, function () {
                $('.reminder').removeClass('hidden');
            });
        },
        // 关闭操作提醒框
        closeReminder: function closeReminder(event, element) {
            var type = $('.main .reminder').attr('name');
            var Id = $(event.target).attr('name');

            // 关闭单一删除提醒框时，取消勾选该选项
            if (type === 'singleDel' || type === 'warn') {
                $('.main ' + element + ' input[name="' + Id + '"]').prop("checked", false);
            } else if (type === 'batchDel') {
                // 关闭全部删除提醒框时，取消勾选全部选项
                $('.main ' + element + ' input[type="checkbox"]').prop("checked", false);
            }

            $('.main .reminder').addClass('hidden');
            $('#shadow').hide().animate({ opacity: 0 });
        },
        clearEdit: function clearEdit(element) {
            $('.main ' + element + ' input[name="title"]').val('');
            $('.main ' + element + ' .dropify-preview .dropify-filename-inner').html('');
            $('.main ' + element + ' .dropify-preview .dropify-render img').removeAttr('src');
            $('.main ' + element + ' #sticky').removeClass('switch-on').addClass('switch-off').css({
                'border-color': '#dfdfdf',
                'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                'background-color': 'rgb(255, 255, 255)'
            });
            $('.main ' + element + ' #lastest').removeClass('switch-off').addClass('switch-on').css({
                'border-color': '#4C3B2F',
                'box-shadow': '#4C3B2F' + ' 0px 0px 0px 16px inset',
                'background-color': '#4C3B2F'
            });
            UE.getEditor('editor').setContent('');
        },
        getAjax: function getAjax(url) {
            var that = this;
            return $.ajax({
                type: 'get',
                url: url,
                beforeSend: function beforeSend() {
                    NProgress.start();
                }
            });
        },
        // 由于不同的业务需求，postAjax后的done函数应有不宜写在公共函数中
        postAjax: function postAjax(url, data) {
            var that = this;
            return $.ajax({
                type: 'post',
                url: url,
                data: data,
                beforeSend: function beforeSend() {
                    NProgress.start();
                }
            });
        },
        // 用于文件上传
        fileAjax: function fileAjax(url, data) {
            var that = this;
            return $.ajax({
                type: 'post',
                url: url,
                data: data,
                processData: false,
                contentType: false,
                beforeSend: function beforeSend() {
                    NProgress.start();
                }
            });
        },
        isEmpty: function isEmpty(value) {
            if (value.trim().length === 0) {
                return true;
            }
        }
    };

    // 开关按钮
    var Switch = {
        themeColor: '#4C3B2F',
        init: function init() {
            var html = "<span class='slider'></span>";
            $('[class^=switch]').append(html); // 给含有switch开头的class添加该html
            // 初始化颜色与状态：存在自定义主题颜色
            if ($('[themeColor]').length > 0) {
                $('[themeColor]').each(function () {
                    var color = $(this).attr('themeColor');
                    if ($(this).hasClass("switch-on")) {
                        $(this).css({
                            'border-color': color,
                            'box-shadow': color + ' 0px 0px 0px 16px inset',
                            'background-color': color
                        });
                    } else {
                        $(".switch-off").css({
                            'border-color': '#dfdfdf',
                            'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                            'background-color': 'rgb(255, 255, 255)'
                        });
                    }
                });
            } else {
                // 使用默认颜色
                $('.switch-on').each(function () {
                    var color = Switch.themeColor;
                    $(this).css({
                        'border-color': color,
                        'box-shadow': color + ' 0px 0px 0px 16px inset',
                        'background-color': color
                    });
                });
            }
            // 点击或滑动下的颜色与状态
            $('[class^=switch]').click(function () {
                if ($(this).hasClass('switch-disabled')) {
                    // 该按钮不能滑动
                    return;
                }

                if ($(this).hasClass('switch-on')) {
                    $(this).removeClass('switch-on').addClass('switch-off');
                    $(".switch-off").css({
                        'border-color': '#dfdfdf',
                        'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                        'background-color': 'rgb(255, 255, 255)'
                    });
                } else {
                    $(this).removeClass('switch-off').addClass('switch-on');
                    var color = $(this).attr('themeColor') || Switch.themeColor;
                    $(this).css({
                        'border-color': color,
                        'box-shadow': color + ' 0px 0px 0px 16px inset',
                        'background-color': color
                    });
                }
            });
        }
    };

    // 首页
    $('.nav-side .nav-home').click(function () {
        Command.getAjax('/backstage.html/nav_home').done(function (data) {
            NProgress.done();

            var html = ejs.render($('#home').html(), { acticles: data[0], updateNumber: data[1], readingNumber: data[2] });
            $('.main').html(html);
        });
    });

    // 目录管理
    $('.nav-side .nav-catalog').click(function () {
        Command.getAjax('/backstage.html/nav_catalog').done(function (data) {
            NProgress.done();

            var catalogName = data[0];
            var catalogNumber = data[1];

            for (var i in catalogName) {
                for (var j in catalogNumber) {
                    if (catalogName[i]._id == catalogNumber[j]._id) {
                        catalogName[i].sum = catalogNumber[j].num_tutorial;
                    }
                }
            }
            var html = ejs.render($('#catalog').html(), { total: catalogName.length, catalogs: catalogName });
            $('.main').html(html);
        });
    });

    // 文章管理
    $('.nav-side .side-first-level .side-second-level').on('click', 'li .catalog', function (event) {

        var catalogId = $(event.target).attr('name');

        Command.getAjax('/backstage.html/nav_article/?catalogId=' + catalogId).done(function (data) {
            NProgress.done();
            // 判断是否为第一次加载
            var first = true;
            var html = ejs.render($('#article').html(), { total: data[0], acticles: data[1] });
            $('.main').html(html);

            var curr = Acticle.curr;
            var pages = Math.ceil(data[0] / Acticle.limit);
            // 初次加载，给分页绑定事件，当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
            Acticle.laypage(first, curr, pages, catalogId);
        });
    });

    // 发布文章
    $('.nav-side .nav-public').click(function () {
        Command.getAjax('/backstage.html/nav_public').done(function (data) {
            NProgress.done();
            var html = ejs.render($('#public').html(), { catalogs: data });

            $('.main').html(html);
            // ueditor编辑器:因为ajax不能重复加载editor,所以在加载前先销毁editor
            UE.delEditor('editor');
            var ue = UE.getEditor('editor', {
                initialFrameWidth: null // 随屏幕大小自适应 
            });
            // 初始化开关按钮
            Switch.init();
            // 初始化文件上传
            $('.dropify').dropify();
        });
    });

    // 相册管理：缩略图片管理
    $('.nav-side .nav-album').click(function (event) {
        $.ajax({
            type: 'get',
            url: '/js/ueditor/ue?action=listimage',
            beforeSend: function beforeSend() {
                NProgress.start();
            }
        }).done(function (data) {
            NProgress.done();

            var pages = Math.ceil(data.total / Album.limit);
            var start = (Album.curr - 1) * Album.limit;
            var end = (Album.curr - 1) * Album.limit + Album.limit;
            var albums = data.list.slice(start, end);
            var html = ejs.render($('#album').html(), { albums: albums, total: data.total });
            $('.main').html(html);

            var first = true;
            Album.laypage(first, Album.curr, pages, data.list);
        });
    });

    // 帐号管理：帐号修改
    $('.nav-side .accounts-modify').click(function (event) {
        NProgress.start();
        var html = ejs.render($('#accounts-modify').html());
        setTimeout(function () {
            NProgress.done();
            $('.main').html(html);
        }, 200);
    });

    // 帐号管理： 管理员列表
    $('.nav-side .accounts-list').click(function () {
        Command.getAjax('/backstage.html/nav_accounts/administrator_list').done(function (data) {
            NProgress.done();
            var html = ejs.render($('#accounts-list').html(), { total: data[0], administrators: data[1] });
            $('.main').html(html);
        });
    });

    // 目录管理
    var Catalog = {
        element: '#catalog-page',
        addUrl: '/backstage.html/nav_catalog/catalog_add',
        editUrl: '/backstage.html/nav_catalog/catalog_edit',
        deleteUrl: '/backstage.html/nav_catalog/catalog_del',
        add: function add(catalogId, catalogName) {

            var data = {
                catalogName: catalogName
            };
            Command.postAjax(this.addUrl, data).done(function (data) {
                NProgress.done();
                if (data.code !== 1) {
                    $('.main .edit-header').css('color', 'red');

                    return $('.main .edit-header span').html(data.message);
                }
                Command.closeEdit();
                $('.nav-side .nav-catalog').click();
                // 需要更新文章管理
                var html = '<li><a name="' + data.catalogId + '" class="catalog" href="javascript:;">' + catalogName + '</a></li>';
                $('.nav-side .nav-article').next().append(html);
            });
        },
        edit: function edit(catalogId, catalogName) {
            var data = {
                catalogId: catalogId,
                catalogName: catalogName
            };
            Command.postAjax(this.editUrl, data).done(function (data) {
                NProgress.done();
                if (data.code !== 1) {
                    $('.main .edit-header').css('color', 'red');

                    return $('.main .edit-header span').html(data.message);
                }
                Command.closeEdit();
                $('.main input[name="' + catalogId + '"]').parent().next().next().children('strong').html(catalogName);
                // 需要更新文章管理
                $('.nav-side .side-first-level .side-second-level li a[name="' + catalogId + '"] ').html(catalogName);
            });
        },
        delete: function _delete(event, element, catalogs) {
            var data = {
                catalogs: catalogs
            };

            var total = $('.main .main-header span:last-child strong').html();

            Command.postAjax(this.deleteUrl, data).done(function (data) {
                NProgress.done();
                if (data.code === 1) {
                    catalogs.forEach(function (catalogId) {
                        $('.main table input[name="' + catalogId + '"]').parents('tr').remove();
                        $('.main .main-header span:last-child strong').html(total - catalogs.length);
                        // 需要更新文章管理
                        $('.nav-side .side-first-level .side-second-level li a[name="' + catalogId + '"] ').parent().remove();
                    });
                }
                Command.closeReminder(event, element);
            });
        },
        confirmEdit: function confirmEdit(event, element) {
            var type = $('.main .edit').attr('name');
            var catalogId = $(event.target).attr('name');
            var catalogName = $('.main .edit .edit-input').val();

            if (Command.isEmpty(catalogName)) {
                $('.main .edit-header').css('color', 'red');

                return $('.main .edit-header span').html('目录名称不能为空');
            }
            this[type](catalogId, catalogName);
        },
        // 三种情况下：1.单一删除提醒、2.全部删除提醒、3.至少勾选一个选项，点击操作提醒框确定键会导致三种情况下所产生的动作不同
        confirmDel: function confirmDel(event, element) {
            var catalogs = [];
            var type = $('.main .reminder').attr('name');

            // 在至少勾选一个选项的情况下
            if (type === 'warn') {
                return Command.closeReminder(event, element);
            } else if (type === 'singleDel') {
                var catalogId = $(event.target).attr('name');
                catalogs.push(catalogId);
            } else if (type === 'batchDel') {

                // 批量获取catalogId
                $('.main input[type="checkbox"]:checked').each(function () {
                    var catalogId = $(this).attr('name');
                    catalogs.push(catalogId);
                });
                //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                if (catalogs[0] === undefined) {
                    catalogs.shift(1);
                }
            }
            this.delete(event, element, catalogs);
        }
    };

    // 文章管理
    var Acticle = {
        element: '#article-page',
        editElement: '#article-edit',
        curr: 1, // 默认当前页面
        limit: 2, // 默认显示数量
        editUrl: '/backstage.html/nav_article/article_edit',
        deleteUrl: '/backstage.html/nav_article/article_del',
        acticleUrl: '/backstage.html/nav_article/article_det',
        create: function create(acticles) {
            var html = '';
            acticles.forEach(function (acticle) {
                var stickyPost = '';
                var lastest = '';
                // 是否置顶
                if (acticle.stickyPost) {
                    stickyPost += '<td><strong>是</strong></td>';
                } else {
                    stickyPost += '<td><strong>否</strong></td>';
                }
                // 是否公开
                if (acticle.lastest) {
                    lastest += '<td><strong>是</strong></td>';
                } else {
                    lastest += '<td><strong>否</strong></td>';
                }

                html += '<tr>';
                html += '    <th><input type="checkbox" name="' + acticle._id + '"></th>';
                html += '    <td>';
                html += '       <img src="/img/thumbnail/' + acticle.thumbnail + '" height="60px">';
                html += '    </td>';
                html += '    <td>' + acticle.title + '</td>';
                html += stickyPost;
                html += lastest;
                html += '    <td>';
                html += '       <a href="javascript:;" class="tooltip-test" data-toggle="tooltip" title="修改文章">';
                html += '           <i class="glyphicon glyphicon-pencil" name="' + acticle._id + '"></i>';
                html += '       </a>';
                html += '       <a href="javascript:;" class="tooltip-test" data-toggle="tooltip" title="删除文章">';
                html += '           <i class="glyphicon glyphicon-trash" name="' + acticle._id + '"></i>';
                html += '       </a>';
                html += '    </td>';
                html += '</tr>';
            });
            return html;
        },
        delete: function _delete(event, element, catalogId, acticles, imageUrls, curr) {

            var data = {
                catalogId: catalogId,
                acticles: acticles,
                imageUrls: imageUrls,
                curr: curr
            };

            // 删除所选文章并更新该页内容，所该页已经不存在内容的情况下，获取上一页的内容
            Command.postAjax(this.deleteUrl, data).done(function (data) {
                NProgress.done();

                var html = Acticle.create(data[1]);
                $('.main #article-page table tbody').html(html);
                $('.main .catalog-page-header span:last-child strong').html(data[0]);

                var curr = data[2];
                var pages = Math.ceil(data[0] / Acticle.limit);
                Acticle.laypage(false, curr, pages, catalogId);
                Command.closeReminder(event, element);
            });
        },
        confirmDel: function confirmDel(event, element) {
            var acticles = [];
            var imageUrls = [];
            var type = $('.main .reminder').attr('name');
            // 获取当前页数
            var curr = $('#article-page .paging .laypage_curr').html();
            var catalogId = $('.nav-side .catalog.side-second-level-active').attr('name');

            // 在至少勾选一个选项的情况下
            if (type === 'warn') {
                return Command.closeReminder(event, element);
            } else if (type === 'singleDel') {

                var acticleId = $(event.target).attr('name');
                var imageUrl = $('.main #article-page input[name="' + acticleId + '"]').parent().next().children('img').attr('src');

                acticles.push(acticleId);
                imageUrls.push(imageUrl.split('/img/thumbnail/')[1]);
            } else if (type === 'batchDel') {
                // 批量获取acticleId
                $('.main input[type="checkbox"]:checked').each(function () {
                    var acticleId = $(this).attr('name');
                    var imageUrl = $('.main #article-page input[name="' + acticleId + '"]').parent().next().children('img').attr('src');

                    if (acticleId) {
                        acticles.push(acticleId);
                    }
                    //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                    if (imageUrl) {
                        imageUrls.push(imageUrl.split('/img/thumbnail/')[1]);
                    }
                });
            }

            this.delete(event, element, catalogId, acticles, imageUrls, curr);
        },
        edit: function edit(event, element) {
            var catalogId = $('.nav-side .catalog.side-second-level-active').attr('name');

            var acticleId = $(event.target).attr('name');
            // 获取当前页数
            var curr = $('#article-page .paging .laypage_curr').html();

            var data = {
                acticleId: acticleId
            };
            Command.postAjax(this.acticleUrl, data).done(function (data) {
                NProgress.done();
                var catalogs = data[0];
                var acticle = data[1][0];

                var html = ejs.render($('#article-update').html(), { catalogs: catalogs, acticle: acticle });
                $('.main').html(html);

                $('.main #article-edit select option[name="' + catalogId + '"]').attr('selected', 'selected');

                UE.delEditor('editor');
                var ue = UE.getEditor('editor', {
                    initialFrameWidth: null // 随屏幕大小自适应 
                });

                ue.addListener("ready", function () {
                    // editor准备好之后才可以使用
                    ue.setContent(acticle.content);
                });

                // 如果文章置顶
                if (acticle.stickyPost) {

                    $('.main #article-edit #sticky').addClass('switch-on');
                } else {

                    $('.main #article-edit #sticky').addClass('switch-off');
                }

                // 如果文章公开
                if (acticle.lastest) {
                    $('.main #article-edit #lastest').addClass('switch-on');
                } else {
                    $('.main #article-edit #lastest').addClass('switch-off');
                }

                Switch.init();
            });
        },
        confrimEdit: function confrimEdit(event, element) {
            var that = this;
            var acticleId = $('.main ' + element + ' input[name="acticleId"]').val();
            var catalogId = $('.main ' + element + ' select option:selected').attr('name');
            var title = $('.main ' + element + ' input[name="title"]').val();
            var outline = UE.getEditor('editor').getContentTxt().slice(0, 100);
            var content = UE.getEditor('editor').getContent();
            var sticky = $('.main ' + element + ' #sticky').hasClass('switch-on');
            var lastest = $('.main ' + element + ' #lastest').hasClass('switch-on');

            // 文章不能为空
            if (!title || !UE.getEditor('editor').hasContents()) {
                return Command.showReminder(element, null, 'warn', '发布文章失败，请重新检查！');
            }

            var acticle = {
                acticleId: acticleId,
                superior: catalogId,
                title: title,
                outline: outline,
                content: content,
                stickyPost: sticky,
                lastest: lastest
            };

            Command.postAjax(this.editUrl, acticle).done(function (data) {
                NProgress.done();
                Command.clearEdit(element);
                Command.showReminder(element, null, null, '文章修改成功');
            });
        },
        laypage: function (_laypage) {
            function laypage(_x, _x2, _x3, _x4) {
                return _laypage.apply(this, arguments);
            }

            laypage.toString = function () {
                return _laypage.toString();
            };

            return laypage;
        }(function (first, curr, pages, catalogId) {
            laypage({
                cont: $('#article-page .paging'),
                curr: curr,
                pages: pages,
                groups: 3,
                skin: '#4C3B2F',
                // 当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
                jump: function jump(data) {
                    // 如果是首次加载并且当前页为第一页
                    if (first && data.curr === 1) {
                        first = false;
                        return;
                    }
                    var url = '/backstage.html/nav_article/?catalogId=' + catalogId + '&curr=' + data.curr;
                    Command.getAjax(url).done(function (data) {
                        NProgress.done();
                        // 动态生成下一页的内容
                        var html = Acticle.create(data[1]);
                        $('.main #article-page table tbody').html(html);
                    });
                }
            });
        })
    };

    // 图片管理
    var Album = {
        element: '#album-page',
        curr: 1,
        limit: 12,
        create: function create(albums) {
            var html = '';
            albums.forEach(function (album) {
                html += '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">';
                html += '   <a href="javascript:;" class="thumbnail">';
                html += '       <img src="/img/ueditor/' + album + '">';
                html += '   </a>';
                html += '</div>';
            });
            return html;
        },
        laypage: function (_laypage2) {
            function laypage(_x5, _x6, _x7, _x8) {
                return _laypage2.apply(this, arguments);
            }

            laypage.toString = function () {
                return _laypage2.toString();
            };

            return laypage;
        }(function (first, curr, pages, list) {
            laypage({
                cont: $('.main #album-page .paging'),
                curr: curr,
                pages: pages,
                groups: 3,
                skin: '#4C3B2F',
                // 当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
                jump: function jump(data) {

                    // 如果是首次加载并且当前页为第一页
                    if (first && data.curr === 1) {
                        first = false;
                        return;
                    }

                    var start = (data.curr - 1) * Album.limit;
                    var end = (data.curr - 1) * Album.limit + Album.limit;

                    var albums = list.slice(start, end);

                    var html = Album.create(albums);
                    $('.main #album-page .main-body').html(html);
                }
            });
        })
    };

    // 发布文章
    var Public = {
        element: '#public-page',
        thumbnailUrl: '/backstage.html/nav_public/thumbnail_save',
        mainBodyUrl: '/backstage.html/nav_public/main_body_save',
        thumbnail: function thumbnail(file) {
            var data = file;

            return Command.fileAjax(this.thumbnailUrl, file);
        },
        mainBody: function mainBody(acticle) {
            var data = acticle;
            return Command.postAjax(this.mainBodyUrl, data);
        },
        save: function save(element) {
            var that = this;
            var catalogId = $('.main ' + element + ' select option:selected').attr('name');
            var title = $('.main ' + element + ' input[name="title"]').val();
            var thumbnail = $('.main ' + element + ' input[type="file"]')[0].files[0];
            var outline = UE.getEditor('editor').getContentTxt().slice(0, 100);
            var content = UE.getEditor('editor').getContent();
            var sticky = $('.main ' + element + ' #sticky').hasClass('switch-on');
            var lastest = $('.main ' + element + ' #lastest').hasClass('switch-on');

            // 低版本浏览器不一定支持FormData对象
            if (!window.FormData) {
                return Command.showReminder(element, null, 'warn', '请更换高级的浏览器');
            }
            // 文章不能为空
            if (!title || !thumbnail || !UE.getEditor('editor').hasContents()) {
                return Command.showReminder(element, null, 'warn', '发布文章失败，请重新检查！');
            }

            // 缩略图类型
            var type = thumbnail.type;
            var size = parseInt(thumbnail.type);
            var limit = 5 * 1024 * 1024;

            // 文章缩略图仅支持上传图片
            if (type.indexOf('image/') === -1) {
                return Command.showReminder(element, null, 'warn', '文章缩略图仅支持上传图片');
            }

            // 文章缩略图限制在5M以下
            if (parseInt(thumbnail.size) > limit) {
                return Command.showReminder(element, null, 'warn', '图片大于5M，请更换图片');
            }

            // 上传文章缩略图
            var formData = new FormData();
            formData.append('avatar', thumbnail);

            var acticle = {
                superior: catalogId,
                title: title,
                outline: outline,
                content: content,
                stickyPost: sticky,
                lastest: lastest
            };

            that.thumbnail(formData).done(function (data) {
                if (data.code === 1) {
                    NProgress.set(0.4);

                    acticle.thumbnail = data.path;
                    that.mainBody(acticle).done(function (data) {
                        NProgress.done();
                        // 清空
                        Command.clearEdit(element);
                        Command.showReminder(element, null, null, '文章发布成功');
                    });
                }
            });
        }
    };

    // 帐号管理
    var Account = {
        element: {
            modify: '#modify-password',
            list: '#administrator-list'
        },
        initialPwd: '123456',
        addUrl: '/backstage.html/nav_accounts/administrator_add',
        editUrl: '/backstage.html/nav_accounts/administrator_edit',
        deleteUrl: '/backstage.html/nav_accounts/administrator_del',
        modifyUrl: '/backstage.html/nav_accounts/modify_password',
        modify: function modify(element, passwords) {
            var data = {
                oldPwd: passwords[0].value,
                newPwd: passwords[1].value
            };
            Command.postAjax(this.modifyUrl, data).done(function (data) {
                NProgress.done();
                if (data.code === 1) {
                    Command.showReminder(element, null, null, '修改密码成功！');
                    $('.main ' + element + ' form input[type="password"]').val('');
                } else {
                    Command.showReminder(element, null, null, data.message);
                }
            });
        },
        add: function add(adminId, adminName) {
            var data = {
                adminName: adminName,
                password: this.initialPwd
            };
            Command.postAjax(this.addUrl, data).done(function (data) {
                NProgress.done();
                if (data.code !== 1) {
                    $('.main .edit-header').css('color', 'red');

                    return $('.main .edit-header span').html(data.message);
                }
                Command.closeEdit();
                $('.nav-side .accounts-list').click();
            });
        },
        edit: function edit(adminId, adminName) {
            var data = {
                adminId: adminId,
                adminName: adminName
            };
            Command.postAjax(this.editUrl, data).done(function (data) {
                NProgress.done();
                if (data.code !== 1) {
                    $('.main .edit-header').css('color', 'red');

                    return $('.main .edit-header span').html(data.message);
                }
                Command.closeEdit();
                $('.main input[name="' + adminId + '"]').parent().next().next().children('strong').html(adminName);
            });
        },
        delete: function _delete(event, element, adminIds) {
            var data = {
                adminIds: adminIds
            };

            var total = $('.main .main-header span:last-child strong').html();
            Command.postAjax(this.deleteUrl, data).done(function (data) {
                NProgress.done();
                if (data.code !== 1) {
                    $('.main .reminder').attr('name', 'warn');

                    return $('.main .reminder .reminder-body p').html(data.message);
                }
                Command.closeReminder(event, element);
                adminIds.forEach(function (adminId) {
                    $('.main table input[name="' + adminId + '"]').parents('tr').remove();
                    $('.main .main-header span:last-child strong').html(total - adminIds.length);
                });
            });
        },

        removeRed: function removeRed(event) {
            if ($(event.target).next().css('color') === 'rgb(255, 0, 0)') {
                setTimeout(function () {
                    $(event.target).next().removeAttr('style');
                }, 200);
            }
        },

        confirmEdit: function confirmEdit(event, element) {
            var type = $('.main .edit').attr('name');
            var adminId = $(event.target).attr('name');
            var adminName = $('.main .edit .edit-input').val();

            if (Command.isEmpty(adminName)) {
                $('.main .edit-header').css('color', 'red');

                return $('.main .edit-header span').html('管理员名称不能为空');
            }
            this[type](adminId, adminName);
        },

        // 三种情况下：1.单一删除提醒、2.全部删除提醒、3.至少勾选一个选项，点击操作提醒框确定键会导致三种情况下所产生的动作不同
        confirmDel: function confirmDel(event, element) {
            var adminIds = [];
            var type = $('.main .reminder').attr('name');

            // 在至少勾选一个选项的情况下
            if (type === 'warn') {
                return Command.closeReminder(event, element);
            } else if (type === 'singleDel') {
                var adminId = $(event.target).attr('name');

                // 正常情况下是存在adminId的，若不存在，则指的是不能删除的管理员
                if (!adminId) {
                    return Command.closeReminder(event, element);
                }

                adminIds.push(adminId);
            } else if (type === 'batchDel') {

                // 批量获取adminId
                $('.main ' + element + ' input[type="checkbox"]:checked').each(function () {
                    var adminId = $(this).attr('name');
                    adminIds.push(adminId);
                });
                //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                if (adminIds[0] === undefined) {
                    adminIds.shift(1);
                }
            }
            this.delete(event, element, adminIds);
        },
        confrimModify: function confrimModify(event, element) {
            var passwords = $('.main ' + element + ' form').serializeArray();

            // 判断是否存在空值，在这里使用for循环比较合适，不宜使用forEach
            for (var i = 0, password; password = passwords[i++];) {
                if (Command.isEmpty(password.value)) {
                    $('.main ' + element + ' form input[name=' + password.name + ']').next().css('color', 'rgb(255, 0, 0)');
                    return false;
                }
            }
            if (passwords[1].value !== passwords[2].value) {
                return Command.showReminder(element, null, null, '前后两次密码不正确');
            }

            this.modify(element, passwords);
        }
    };

    // 通过on给尚未出现的节点绑定事件
    // on方法 将click等事件绑定在document对象上，页面上任何元素发生的click事件都冒泡到document对象上得到处理。
    // 增加了绑定效率。当事件冒泡到document对象时，检测事件的target，如果与传入的选择符（这里是button）匹配，就触发事件，否则不触发。
    // 目录管理
    $('.main').on('click', Catalog.element, function (event) {
        var className = event.target.className;
        switch (className) {
            // 添加目录
            case 'btn btn-add':
                Command.add(event, Catalog.element, '请输入需要添加的目录名称');
                break;
            // 编辑管理
            case 'glyphicon glyphicon-pencil':
                Command.edit(event, Catalog.element, '请输入新的目录名称');
                break;
            // 关闭编辑管理
            case 'glyphicon glyphicon-remove edit-remove':
                Command.closeEdit();
                break;
            // 关闭编辑管理                        
            case 'btn btn-default edit-cancel':
                Command.closeEdit();
                break;
            // 确定更新栏目或编辑栏目
            case 'btn btn-success':
                Catalog.confirmEdit(event, Catalog.element);
                break;
            // 全选与反选
            case 'batch-selection':
                Command.selectAll(event, Catalog.element);
                break;
            // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel(event, Catalog.element);
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel(event, Catalog.element);
                break;
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel(event, Catalog.element);
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Catalog.element);
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Catalog.element);
                break;
            // 确定删除
            case 'btn btn-delete':
                Catalog.confirmDel(event, Catalog.element);
                break;
        }
    });

    // 文章管理
    $('.main').on('click', Acticle.element, function (event) {
        var className = event.target.className;
        switch (className) {
            // 全选与反选
            case 'batch-selection':
                Command.selectAll(event, Acticle.element);
                break;
            // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel(event, Acticle.element);
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel(event, Acticle.element);
                break;
            // 批量删除
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel(event, Acticle.element);
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Acticle.element);
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Acticle.element);
                break;
            // 确定删除
            case 'btn btn-delete':
                Acticle.confirmDel(event, Acticle.element);
                break;
            // 编辑
            case 'glyphicon glyphicon-pencil':
                Acticle.edit(event, Acticle.element);
                break;
        }
    });

    // 文章编辑
    $('.main').on('click', Acticle.editElement, function (event) {
        var className = event.target.className;
        switch (className) {
            case 'btn btn-add':
                Acticle.confrimEdit(event, Acticle.editElement);
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Acticle.editElement);
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Acticle.editElement);
                break;
            // 关闭操作提醒框 
            case 'btn btn-delete':
                Command.closeReminder(event, Acticle.editElement);
                break;
        }
    });

    // // 相册管理：缩略图片管理
    // $('.nav-side .nav-album').click(function( event ){
    //     $.ajax({
    //         type: 'get',
    //         url: '/js/ueditor/ue?action=listimage',
    //         beforeSend: function(){
    //             NProgress.start();
    //         }
    //     }).done(function(data){
    //         NProgress.done();
    //         let pages = Math.ceil(data.total/Album.limit)                    
    //         let start = (Album.curr-1) * Album.limit;
    //         let end = (Album.curr-1) * Album.limit + Album.limit;
    //         let albums = data.list.slice( start,end );
    //         let html = ejs.render( $('#album').html(), {albums: albums,total: data.total});
    //         $('.main').html( html );

    //         let first = true;
    //         Album.laypage( first,Album.curr,pages,data.list );
    //     })
    // })

    // 发布文章
    $('.main').on('click', Public.element, function (event) {
        var className = event.target.className;
        switch (className) {
            // 发布文章
            case 'btn btn-add':
                Public.save(Public.element);
                break;
            // 关闭操作提醒框
            case 'btn btn-delete':
                Command.closeReminder(event, Public.element);
                break;
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Public.element);
                break;
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Public.element);
                break;

        }
    });

    // 帐号管理：修改密码
    $('.main').on('click', Account.element.modify, function (event) {
        var className = event.target.className;

        switch (className) {
            // 输入框
            case 'form-control':
                Account.removeRed(event);
                break;
            // 确定修改密码
            case 'btn btn-add confrim-modify':
                Account.confrimModify(event, Account.element.modify);
                break;
            // 移除操作提醒框
            case 'btn btn-delete':
                Command.closeReminder(event, Account.element.modify);
                break;
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Account.element.modify);
                break;
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Account.element.modify);
                break;
        }
    });

    // 帐号管理：管理员列表
    $('.main').on('click', Account.element.list, function (event) {
        var className = event.target.className;
        switch (className) {
            // 添加管理员
            case 'btn btn-add':
                Command.add(event, Account.element.list, '请输入需要添加的管理员名称');
                break;
            // 添加管理员
            case 'glyphicon glyphicon-plus':
                Command.add(event, Account.element.list, '请输入需要添加的管理员名称');
                break;
            // 编辑管理员
            case 'glyphicon glyphicon-pencil':
                Command.edit(event, Account.element.list, '请输入新的管理员名称');
                break;
            case 'btn btn-success':
                Account.confirmEdit(event, Account.element.list);
                break;
            // 关闭操作提醒框
            case 'btn btn-default edit-cancel':
                Command.closeEdit();
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove edit-remove':
                Command.closeEdit();
                break;
            // 全选与反选
            case 'batch-selection':
                Command.selectAll(event, Account.element.list);
                break;
            // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel(event, Account.element.list);
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel(event, Account.element.list);
                break;
            // 批量删除
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel(event, Account.element.list);
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder(event, Account.element.list);
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel':
                Command.closeReminder(event, Account.element.list);
                break;
            // 确定删除 
            case 'btn btn-delete':
                Account.confirmDel(event, Account.element.list);
                break;
        }
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);