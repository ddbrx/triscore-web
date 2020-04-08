import {
    RouteReuseStrategy,
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
} from '@angular/router';

export class RouteReuseService implements RouteReuseStrategy {
    private handles: { [key: string]: DetachedRouteHandle } = {};
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig || route.routeConfig.loadChildren) {
            return false;
        }
        let shouldReuse = false;
        if (route.routeConfig.data) {
            route.routeConfig.data.reuse ? shouldReuse = true : shouldReuse = false;
        }
        return shouldReuse;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (handle) {
            this.handles[this.getUrl(route)] = handle;
        }
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handles[this.getUrl(route)];
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig || route.routeConfig.loadChildren) {
            return null;
        };
        return this.handles[this.getUrl(route)];
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        let reUseUrl = false;
        if (future.routeConfig) {
            if (future.routeConfig.data) {
                reUseUrl = future.routeConfig.data.reuse;
            }
        }
        const defaultReuse = (future.routeConfig === current.routeConfig);
        return reUseUrl || defaultReuse;
    }
    getUrl(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig) {
            const url = route.routeConfig.path;
            return url;
        }
    }
}