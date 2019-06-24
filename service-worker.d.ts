/**
 * @license Angular v8.0.2+24.sha-980bcaf.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */

import { InjectionToken } from '@angular/core';
import { Injector } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @publicApi
 */
export declare class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script: string, opts?: SwRegistrationOptions): ModuleWithProviders<ServiceWorkerModule>;
}

/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * @publicApi
 */
export declare class SwPush {
    private sw;
    /**
     * Emits the payloads of the received push notification messages.
     */
    readonly messages: Observable<object>;
    /**
     * Emits the payloads of the received push notification messages as well as the action the user
     * interacted with. If no action was used the action property will be an empty string `''`.
     *
     * Note that the `notification` property is **not** a [Notification][Mozilla Notification] object
     * but rather a
     * [NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)
     * object that also includes the `title` of the [Notification][Mozilla Notification] object.
     *
     * [Mozilla Notification]: https://developer.mozilla.org/en-US/docs/Web/API/Notification
     */
    readonly notificationClicks: Observable<{
        action: string;
        notification: NotificationOptions & {
            title: string;
        };
    }>;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     */
    readonly subscription: Observable<PushSubscription | null>;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    readonly isEnabled: boolean;
    private pushManager;
    private subscriptionChanges;
    constructor(sw: ɵangular_packages_service_worker_service_worker_a);
    requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription>;
    unsubscribe(): Promise<void>;
    private decodeBase64;
}

/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * {@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts" linenums="false"}
 *
 * @publicApi
 */
export declare abstract class SwRegistrationOptions {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     */
    enabled?: boolean;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     */
    scope?: string;
    /**
     * Defines the ServiceWorker registration strategy, which determines when it will be registered
     * with the browser.
     *
     * The default behavior of registering once the application stabilizes (i.e. as soon as there are
     * no pending micro- and macro-tasks), is designed register the ServiceWorker as soon as possible
     * but without affecting the application's first time load.
     *
     * Still, there might be cases where you want more control over when the ServiceWorker is
     * registered (e.g. there might be a long-running timeout or polling interval, preventing the app
     * to stabilize). The available option are:
     *
     * - `registerWhenStable`: Register as soon as the application stabilizes (no pending
     *      micro-/macro-tasks).
     * - `registerImmediately`: Register immediately.
     * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
     *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
     *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
     *     as possible but still asynchronously, once all pending micro-tasks are completed.
     * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable'
     */
    registrationStrategy?: string | (() => Observable<unknown>);
}

/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @publicApi
 */
export declare class SwUpdate {
    private sw;
    /**
     * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
     */
    readonly available: Observable<UpdateAvailableEvent>;
    /**
     * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
     */
    readonly activated: Observable<UpdateActivatedEvent>;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    readonly isEnabled: boolean;
    constructor(sw: ɵangular_packages_service_worker_service_worker_a);
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
}

declare interface TypedEvent {
    type: string;
}

/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * @publicApi
 */
export declare interface UpdateActivatedEvent {
    type: 'UPDATE_ACTIVATED';
    previous?: {
        hash: string;
        appData?: Object;
    };
    current: {
        hash: string;
        appData?: Object;
    };
}

/**
 * An event emitted when a new version of the app is available.
 *
 * @publicApi
 */
export declare interface UpdateAvailableEvent {
    type: 'UPDATE_AVAILABLE';
    current: {
        hash: string;
        appData?: Object;
    };
    available: {
        hash: string;
        appData?: Object;
    };
}

/**
 * @publicApi
 */
export declare class ɵangular_packages_service_worker_service_worker_a {
    private serviceWorker;
    readonly worker: Observable<ServiceWorker>;
    readonly registration: Observable<ServiceWorkerRegistration>;
    readonly events: Observable<TypedEvent>;
    constructor(serviceWorker: ServiceWorkerContainer | undefined);
    postMessage(action: string, payload: Object): Promise<void>;
    postMessageWithStatus(type: string, payload: Object, nonce: number): Promise<void>;
    generateNonce(): number;
    eventsOfType<T extends TypedEvent>(type: T['type']): Observable<T>;
    nextEventOfType<T extends TypedEvent>(type: T['type']): Observable<T>;
    waitForStatus(nonce: number): Promise<void>;
    readonly isEnabled: boolean;
}

export declare const ɵangular_packages_service_worker_service_worker_b: InjectionToken<string>;

export declare function ɵangular_packages_service_worker_service_worker_c(injector: Injector, script: string, options: SwRegistrationOptions, platformId: string): Function;

export declare function ɵangular_packages_service_worker_service_worker_d(opts: SwRegistrationOptions, platformId: string): ɵangular_packages_service_worker_service_worker_a;

export { }
