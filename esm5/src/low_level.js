/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
function errorObservable(message) {
    return defer(function () { return throwError(new Error(message)); });
}
/**
 * @publicApi
 */
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            var controllerChanges = controllerChangeEvents.pipe(map(function () { return serviceWorker.controller; }));
            var currentController = defer(function () { return of(serviceWorker.controller); });
            var controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter(function (c) { return !!c; }));
            this.registration = (this.worker.pipe(switchMap(function () { return serviceWorker.getRegistration(); })));
            var rawEvents = fromEvent(serviceWorker, 'message');
            var rawEventPayload = rawEvents.pipe(map(function (event) { return event.data; }));
            var eventsUnconnected = rawEventPayload.pipe(filter(function (event) { return event && event.type; }));
            var events = eventsUnconnected.pipe(publish());
            events.connect();
            this.events = events;
        }
    }
    NgswCommChannel.prototype.postMessage = function (action, payload) {
        return this.worker
            .pipe(take(1), tap(function (sw) {
            sw.postMessage(tslib_1.__assign({ action: action }, payload));
        }))
            .toPromise()
            .then(function () { return undefined; });
    };
    NgswCommChannel.prototype.postMessageWithStatus = function (type, payload, nonce) {
        var waitForStatus = this.waitForStatus(nonce);
        var postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    NgswCommChannel.prototype.generateNonce = function () { return Math.round(Math.random() * 10000000); };
    NgswCommChannel.prototype.eventsOfType = function (type) {
        var filterFn = function (event) { return event.type === type; };
        return this.events.pipe(filter(filterFn));
    };
    NgswCommChannel.prototype.nextEventOfType = function (type) {
        return this.eventsOfType(type).pipe(take(1));
    };
    NgswCommChannel.prototype.waitForStatus = function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter(function (event) { return event.nonce === nonce; }), take(1), map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(event.error);
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    return NgswCommChannel;
}());
export { NgswCommChannel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFvQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUcsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTFFLE1BQU0sQ0FBQyxJQUFNLG9CQUFvQixHQUFHLCtEQUErRCxDQUFDO0FBNENwRyxTQUFTLGVBQWUsQ0FBQyxPQUFlO0lBQ3RDLE9BQU8sS0FBSyxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFFRDs7R0FFRztBQUNIO0lBT0UseUJBQW9CLGFBQStDO1FBQS9DLGtCQUFhLEdBQWIsYUFBYSxDQUFrQztRQUNqRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3ZGO2FBQU07WUFDTCxJQUFNLHNCQUFzQixHQUFHLFNBQVMsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUM1RSxJQUFNLGlCQUFpQixHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLGFBQWEsQ0FBQyxVQUFVLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQzNGLElBQU0saUJBQWlCLEdB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Q0FBQztJQUMvQyxDQUFDO0lBRUQsdUNBQWEsR0FBYixVQUFjLEtBQWE7UUFDekIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFjLFFBQVEsQ0FBQzthQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQXJCLENBQXFCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQUEsS0FBSztZQUN4RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7YUFDUixTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQUksc0NBQVM7YUFBYixjQUEyQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDM0Qsc0JBQUM7QUFBRCxDQUFDLEFBdkVELElBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgY29uY2F0LCBkZWZlciwgZnJvbUV2ZW50LCBvZiAsIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgcHVibGlzaCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGNvbnN0IEVSUl9TV19OT1RfU1VQUE9SVEVEID0gJ1NlcnZpY2Ugd29ya2VycyBhcmUgZGlzYWJsZWQgb3Igbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXInO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBhcHAgaXMgYXZhaWxhYmxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBdmFpbGFibGVFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQVZBSUxBQkxFJztcbiAgY3VycmVudDoge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG4gIGF2YWlsYWJsZToge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgbmV3IHZlcnNpb24gb2YgdGhlIGFwcCBoYXMgYmVlbiBkb3dubG9hZGVkIGFuZCBhY3RpdmF0ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUFjdGl2YXRlZEV2ZW50IHtcbiAgdHlwZTogJ1VQREFURV9BQ1RJVkFURUQnO1xuICBwcmV2aW91cz86IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xuICBjdXJyZW50OiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBgUHVzaEV2ZW50YCBpcyByZWNlaXZlZCBieSB0aGUgc2VydmljZSB3b3JrZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHVzaEV2ZW50IHtcbiAgdHlwZTogJ1BVU0gnO1xuICBkYXRhOiBhbnk7XG59XG5cbmV4cG9ydCB0eXBlIEluY29taW5nRXZlbnQgPSBVcGRhdGVBdmFpbGFibGVFdmVudCB8IFVwZGF0ZUFjdGl2YXRlZEV2ZW50O1xuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVkRXZlbnQgeyB0eXBlOiBzdHJpbmc7IH1cblxuaW50ZXJmYWNlIFN0YXR1c0V2ZW50IHtcbiAgdHlwZTogJ1NUQVRVUyc7XG4gIG5vbmNlOiBudW1iZXI7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cblxuZnVuY3Rpb24gZXJyb3JPYnNlcnZhYmxlKG1lc3NhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBkZWZlcigoKSA9PiB0aHJvd0Vycm9yKG5ldyBFcnJvcihtZXNzYWdlKSkpO1xufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJlYWRvbmx5IHdvcmtlcjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyPjtcblxuICByZWFkb25seSByZWdpc3RyYXRpb246IE9ic2VydmFibGU8U2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbj47XG5cbiAgcmVhZG9ubHkgZXZlbnRzOiBPYnNlcnZhYmxlPFR5cGVkRXZlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lcnx1bmRlZmluZWQpIHtcbiAgICBpZiAoIXNlcnZpY2VXb3JrZXIpIHtcbiAgICAgIHRoaXMud29ya2VyID0gdGhpcy5ldmVudHMgPSB0aGlzLnJlZ2lzdHJhdGlvbiA9IGVycm9yT2JzZXJ2YWJsZShFUlJfU1dfTk9UX1NVUFBPUlRFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMgPSBmcm9tRXZlbnQoc2VydmljZVdvcmtlciwgJ2NvbnRyb2xsZXJjaGFuZ2UnKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VzID0gY29udHJvbGxlckNoYW5nZUV2ZW50cy5waXBlKG1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb250cm9sbGVyID0gZGVmZXIoKCkgPT4gb2YgKHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpO1xuICAgICAgY29uc3QgY29udHJvbGxlcldpdGhDaGFuZ2VzID0gY29uY2F0KGN1cnJlbnRDb250cm9sbGVyLCBjb250cm9sbGVyQ2hhbmdlcyk7XG5cbiAgICAgIHRoaXMud29ya2VyID0gY29udHJvbGxlcldpdGhDaGFuZ2VzLnBpcGUoZmlsdGVyKChjKTogYyBpcyBTZXJ2aWNlV29ya2VyID0+ICEhYykpO1xuXG4gICAgICB0aGlzLnJlZ2lzdHJhdGlvbiA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+PihcbiAgICAgICAgICB0aGlzLndvcmtlci5waXBlKHN3aXRjaE1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpKSkpO1xuXG4gICAgICBjb25zdCByYXdFdmVudHMgPSBmcm9tRXZlbnQ8TWVzc2FnZUV2ZW50PihzZXJ2aWNlV29ya2VyLCAnbWVzc2FnZScpO1xuICAgICAgY29uc3QgcmF3RXZlbnRQYXlsb2FkID0gcmF3RXZlbnRzLnBpcGUobWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpKTtcbiAgICAgIGNvbnN0IGV2ZW50c1VuY29ubmVjdGVkID0gcmF3RXZlbnRQYXlsb2FkLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50ICYmIGV2ZW50LnR5cGUpKTtcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50c1VuY29ubmVjdGVkLnBpcGUocHVibGlzaCgpKSBhcyBDb25uZWN0YWJsZU9ic2VydmFibGU8SW5jb21pbmdFdmVudD47XG4gICAgICBldmVudHMuY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICB9XG4gIH1cblxuICBwb3N0TWVzc2FnZShhY3Rpb246IHN0cmluZywgcGF5bG9hZDogT2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud29ya2VyXG4gICAgICAgIC5waXBlKHRha2UoMSksIHRhcCgoc3c6IFNlcnZpY2VXb3JrZXIpID0+IHtcbiAgICAgICAgICAgICAgICBzdy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiwgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2VXaXRoU3RhdHVzKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXR1cyA9IHRoaXMud2FpdEZvclN0YXR1cyhub25jZSk7XG4gICAgY29uc3QgcG9zdE1lc3NhZ2UgPSB0aGlzLnBvc3RNZXNzYWdlKHR5cGUsIHBheWxvYWQpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbd2FpdEZvclN0YXR1cywgcG9zdE1lc3NhZ2VdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7IHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCk7IH1cblxuICBldmVudHNPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IFRbJ3R5cGUnXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGZpbHRlckZuID0gKGV2ZW50OiBUeXBlZEV2ZW50KTogZXZlbnQgaXMgVCA9PiBldmVudC50eXBlID09PSB0eXBlO1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5waXBlKGZpbHRlcihmaWx0ZXJGbikpO1xuICB9XG5cbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKTtcbiAgfVxuXG4gIHdhaXRGb3JTdGF0dXMobm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZTxTdGF0dXNFdmVudD4oJ1NUQVRVUycpXG4gICAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudC5ub25jZSA9PT0gbm9uY2UpLCB0YWtlKDEpLCBtYXAoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciAhKTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuc2VydmljZVdvcmtlcjsgfVxufVxuIl19