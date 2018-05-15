/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
function errorObservable(message) {
    return defer(function () { return throwError(new Error(message)); });
}
/**
 * @experimental
*/
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker, platformId) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker || !isPlatformBrowser(platformId)) {
            this.serviceWorker = undefined;
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var controllerChangeEvents = (fromEvent(serviceWorker, 'controllerchange'));
            var controllerChanges = (controllerChangeEvents.pipe(map(function () { return serviceWorker.controller; })));
            var currentController = (defer(function () { return of(serviceWorker.controller); }));
            var controllerWithChanges = (concat(currentController, controllerChanges));
            this.worker = (controllerWithChanges.pipe(filter(function (c) { return !!c; })));
            this.registration = (this.worker.pipe(switchMap(function () { return serviceWorker.getRegistration(); })));
            var rawEvents = fromEvent(serviceWorker, 'message');
            var rawEventPayload = rawEvents.pipe(map(function (event) { return event.data; }));
            var eventsUnconnected = (rawEventPayload.pipe(filter(function (event) { return !!event && !!event['type']; })));
            var events = eventsUnconnected.pipe(publish());
            this.events = events;
            events.connect();
        }
    }
    /**
     * @internal
     */
    /**
       * @internal
       */
    NgswCommChannel.prototype.postMessage = /**
       * @internal
       */
    function (action, payload) {
        return this.worker
            .pipe(take(1), tap(function (sw) {
            sw.postMessage(tslib_1.__assign({ action: action }, payload));
        }))
            .toPromise()
            .then(function () { return undefined; });
    };
    /**
     * @internal
     */
    /**
       * @internal
       */
    NgswCommChannel.prototype.postMessageWithStatus = /**
       * @internal
       */
    function (type, payload, nonce) {
        var waitForStatus = this.waitForStatus(nonce);
        var postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    /**
     * @internal
     */
    /**
       * @internal
       */
    NgswCommChannel.prototype.generateNonce = /**
       * @internal
       */
    function () { return Math.round(Math.random() * 10000000); };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    /**
       * @internal
       */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    NgswCommChannel.prototype.eventsOfType = /**
       * @internal
       */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    function (type) {
        return this.events.pipe(filter(function (event) { return event.type === type; }));
    };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    /**
       * @internal
       */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    NgswCommChannel.prototype.nextEventOfType = /**
       * @internal
       */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    function (type) {
        return (this.eventsOfType(type).pipe(take(1)));
    };
    /**
     * @internal
     */
    /**
       * @internal
       */
    NgswCommChannel.prototype.waitForStatus = /**
       * @internal
       */
    function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter(function (event) { return event.nonce === nonce; }), take(1), map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error((event.error));
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    /** @nocollapse */
    NgswCommChannel.ctorParameters = function () { return [
        null,
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    ]; };
    return NgswCommChannel;
}());
export { NgswCommChannel };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRSxNQUFNLENBQUMsSUFBTSxvQkFBb0IsR0FBRywrREFBK0QsQ0FBQztBQXFDcEcseUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxLQUFLLENBQUMsY0FBTSxPQUFBLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE5QixDQUE4QixDQUFDLENBQUM7Q0FDcEQ7Ozs7O0lBcUJDLHlCQUNZLGFBQStDLEVBQ2xDO1FBRGIsa0JBQWEsR0FBYixhQUFhLENBQWtDO1FBRXpELElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNwRCxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2RjthQUFNO1lBQ0wsSUFBTSxzQkFBc0IsR0FDUCxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsa0JB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Ozs7OztJQUFaLFVBQW1DLElBQVk7UUFDN0MsT0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxJQUFPLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM1RjtJQUVEOztPQUVHO0lBQ0gsNkZBQTZGO0lBQzdGLHVCQUF1Qjs7Ozs7O0lBQ3ZCLHlDQUFlOzs7OztJQUFmLFVBQXNDLElBQVk7UUFDaEQsT0FBc0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0lBRUQ7O09BRUc7Ozs7SUFDSCx1Q0FBYTs7O0lBQWIsVUFBYyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUNELE1BQU0sQ0FBQyxVQUFDLEtBQWtCLElBQUssT0FBQSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBckIsQ0FBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDOUQsR0FBRyxDQUFDLFVBQUMsS0FBa0I7WUFDckIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQSxLQUFLLENBQUMsS0FBTyxDQUFBLENBQUMsQ0FBQztTQUNoQyxDQUFDLENBQUM7YUFDTixTQUFTLEVBQUUsQ0FBQztLQUNsQjtJQUVELHNCQUFJLHNDQUFTO2FBQWIsY0FBMkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFOzs7T0FBQTs7OztnREE5RnBELE1BQU0sU0FBQyxXQUFXOzswQkEzRXpCOztTQXlEYSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29ubmVjdGFibGVPYnNlcnZhYmxlLCBPYnNlcnZhYmxlLCBjb25jYXQsIGRlZmVyLCBmcm9tRXZlbnQsIG9mICwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwLCBwdWJsaXNoLCBzd2l0Y2hNYXAsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgRVJSX1NXX05PVF9TVVBQT1JURUQgPSAnU2VydmljZSB3b3JrZXJzIGFyZSBkaXNhYmxlZCBvciBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbiB7XG4gIGhhc2g6IHN0cmluZztcbiAgYXBwRGF0YT86IE9iamVjdDtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQXZhaWxhYmxlRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRSc7XG4gIGN1cnJlbnQ6IFZlcnNpb247XG4gIGF2YWlsYWJsZTogVmVyc2lvbjtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQWN0aXZhdGVkRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FDVElWQVRFRCc7XG4gIHByZXZpb3VzPzogVmVyc2lvbjtcbiAgY3VycmVudDogVmVyc2lvbjtcbn1cblxuZXhwb3J0IHR5cGUgSW5jb21pbmdFdmVudCA9IFVwZGF0ZUF2YWlsYWJsZUV2ZW50IHwgVXBkYXRlQWN0aXZhdGVkRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRFdmVudCB7IHR5cGU6IHN0cmluZzsgfVxuXG5pbnRlcmZhY2UgU3RhdHVzRXZlbnQge1xuICB0eXBlOiAnU1RBVFVTJztcbiAgbm9uY2U6IG51bWJlcjtcbiAgc3RhdHVzOiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuXG5mdW5jdGlvbiBlcnJvck9ic2VydmFibGUobWVzc2FnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRlZmVyKCgpID0+IHRocm93RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKSk7XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuKi9cbmV4cG9ydCBjbGFzcyBOZ3N3Q29tbUNoYW5uZWwge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSB3b3JrZXI6IE9ic2VydmFibGU8U2VydmljZVdvcmtlcj47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaXN0cmF0aW9uOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+O1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50czogT2JzZXJ2YWJsZTxUeXBlZEV2ZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lcnx1bmRlZmluZWQsXG4gICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNlcnZpY2VXb3JrZXIgfHwgIWlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLnNlcnZpY2VXb3JrZXIgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLndvcmtlciA9IHRoaXMuZXZlbnRzID0gdGhpcy5yZWdpc3RyYXRpb24gPSBlcnJvck9ic2VydmFibGUoRVJSX1NXX05PVF9TVVBQT1JURUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlRXZlbnRzID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxhbnk+Pihmcm9tRXZlbnQoc2VydmljZVdvcmtlciwgJ2NvbnRyb2xsZXJjaGFuZ2UnKSk7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlcyA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJ8bnVsbD4+KFxuICAgICAgICAgIGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMucGlwZShtYXAoKCkgPT4gc2VydmljZVdvcmtlci5jb250cm9sbGVyKSkpO1xuXG4gICAgICBjb25zdCBjdXJyZW50Q29udHJvbGxlciA9XG4gICAgICAgICAgPE9ic2VydmFibGU8U2VydmljZVdvcmtlcnxudWxsPj4oZGVmZXIoKCkgPT4gb2YgKHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpKTtcblxuICAgICAgY29uc3QgY29udHJvbGxlcldpdGhDaGFuZ2VzID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyfG51bGw+Pihjb25jYXQoY3VycmVudENvbnRyb2xsZXIsIGNvbnRyb2xsZXJDaGFuZ2VzKSk7XG4gICAgICB0aGlzLndvcmtlciA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+PihcbiAgICAgICAgICBjb250cm9sbGVyV2l0aENoYW5nZXMucGlwZShmaWx0ZXIoKGM6IFNlcnZpY2VXb3JrZXIpID0+ICEhYykpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50KHNlcnZpY2VXb3JrZXIsICdtZXNzYWdlJyk7XG5cbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcCgoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4gZXZlbnQuZGF0YSkpO1xuICAgICAgY29uc3QgZXZlbnRzVW5jb25uZWN0ZWQgPVxuICAgICAgICAgIChyYXdFdmVudFBheWxvYWQucGlwZShmaWx0ZXIoKGV2ZW50OiBPYmplY3QpID0+ICEhZXZlbnQgJiYgISEoZXZlbnQgYXMgYW55KVsndHlwZSddKSkpO1xuICAgICAgY29uc3QgZXZlbnRzID0gZXZlbnRzVW5jb25uZWN0ZWQucGlwZShwdWJsaXNoKCkpIGFzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxJbmNvbWluZ0V2ZW50PjtcbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwb3N0TWVzc2FnZShhY3Rpb246IHN0cmluZywgcGF5bG9hZDogT2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud29ya2VyXG4gICAgICAgIC5waXBlKHRha2UoMSksIHRhcCgoc3c6IFNlcnZpY2VXb3JrZXIpID0+IHtcbiAgICAgICAgICAgICAgICBzdy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiwgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcG9zdE1lc3NhZ2VXaXRoU3RhdHVzKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXR1cyA9IHRoaXMud2FpdEZvclN0YXR1cyhub25jZSk7XG4gICAgY29uc3QgcG9zdE1lc3NhZ2UgPSB0aGlzLnBvc3RNZXNzYWdlKHR5cGUsIHBheWxvYWQpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbd2FpdEZvclN0YXR1cywgcG9zdE1lc3NhZ2VdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7IHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCk7IH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGkpOiB0aGUgdHlwaW5ncyBhbmQgY2FzdHMgaW4gdGhpcyBtZXRob2QgYXJlIHdvbmt5LCB3ZSBzaG91bGQgcmV2aXNpdCBpdCBhbmQgbWFrZSB0aGVcbiAgLy8gdHlwZXMgZmxvdyBjb3JyZWN0bHlcbiAgZXZlbnRzT2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8VD4+dGhpcy5ldmVudHMucGlwZShmaWx0ZXIoKGV2ZW50KSA9PiB7IHJldHVybiBldmVudC50eXBlID09PSB0eXBlOyB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGkpOiB0aGUgdHlwaW5ncyBhbmQgY2FzdHMgaW4gdGhpcyBtZXRob2QgYXJlIHdvbmt5LCB3ZSBzaG91bGQgcmV2aXNpdCBpdCBhbmQgbWFrZSB0aGVcbiAgLy8gdHlwZXMgZmxvdyBjb3JyZWN0bHlcbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8VD4+KHRoaXMuZXZlbnRzT2ZUeXBlKHR5cGUpLnBpcGUodGFrZSgxKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgd2FpdEZvclN0YXR1cyhub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzT2ZUeXBlPFN0YXR1c0V2ZW50PignU1RBVFVTJylcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoKGV2ZW50OiBTdGF0dXNFdmVudCkgPT4gZXZlbnQubm9uY2UgPT09IG5vbmNlKSwgdGFrZSgxKSxcbiAgICAgICAgICAgIG1hcCgoZXZlbnQ6IFN0YXR1c0V2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciAhKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gIH1cblxuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7IH1cbn1cbiJdfQ==