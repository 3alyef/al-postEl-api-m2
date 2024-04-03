class RefObject<T> {
    constructor(public current: T | null) {}
}

class CustomHooks {
    private previousDependencies: RefObject<any[]> = new RefObject<any[]>([]);

    useEffect(callback: (userRoomMap: Map<string, string[]>) => void, dependencies: any[], userRoomMap: Map<string, string[]>) {
        const dependenciesChanged = (prevDeps: any[], newDeps: any[]) => {
            if (prevDeps.length !== newDeps.length) {
                return true;
            }
            return prevDeps.some((dep, index) => dep !== newDeps[index]);
        };

        if(this.previousDependencies.current){
            if (dependenciesChanged(this.previousDependencies.current, dependencies)) {
                callback(userRoomMap);
                this.previousDependencies.current = dependencies;
            }
        }
        
    }

    useRef<T>(initialValue: T | null): RefObject<T> {
        return new RefObject(initialValue);
    }
}




export { CustomHooks };