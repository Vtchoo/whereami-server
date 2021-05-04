export default class ArrayUtils {

    static Sum<T>(array: T[], func: (obj: T) => number, initialValue = 0): number {
        return array?.reduce((prev, curr) => prev + func(curr), initialValue)
    }

    static Avg<T>(array: T[], func: (obj: T) => number): number {
        return ArrayUtils.Sum(array, func, 0) / array.length
    }

    static Prod<T>(array: T[], func: (obj: T) => number): number {
        return array?.reduce((prev, curr) => prev * func(curr), 1)
    }

    static Join<T>(array: T[], func: (obj: T) => string, separator = ','): string {
        return array?.map(item => func(item)).join(separator)
    }

    static Remove<T>(array: T[], item: T): T[] {
        return array?.filter(i => i !== item)
    }

    static CustomFlat<T, U, V>(array: T[], object: (object: T) => U[], func: (sub_object: U) => V): V[] {
        const objects = array.map(obj => object(obj))
        return objects.reduce((array: V[], curr_object) => [...array, ...curr_object.map((sub_object: U) => func(sub_object))], [])
    }

    // static DeepCustomFlat<T>(array: T[], ...extractors: any[]) {
    
    //     let result = [...array]
    //     extractors.forEach((extractor, i) => {
            
    //         result = result.reduce((arr, obj) => {
    
    //             const currentObject = typeof extractor === 'function' ?
    //                 extractor(obj) :
    //                 obj[extractor]
    
    //             if (i === extractors.length - 1)
    //                 return [...arr, currentObject]
    //             else
    //                 return [...arr, ...currentObject]
    //         }, [])
    //     })
    
    //     return result
    // }
    
    static DeepCustomFlatRecursive(array: any[], ...extractors: (string | ((obj: any) => any))[]): any {
        
        const [currentExtractor, ...restOfExtractors] = extractors;
    
        const result = array.reduce((arr, obj) => {
    
            const currentObject = typeof currentExtractor === 'function' ?
                currentExtractor(obj) :
                obj[currentExtractor]
    
            if (restOfExtractors.length > 0)
                return [...arr, ...ArrayUtils.DeepCustomFlatRecursive(currentObject, ...restOfExtractors)];
            else
                return [...arr, currentObject];
        }, []);
    
        return result
    }
}
