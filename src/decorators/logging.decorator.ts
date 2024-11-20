// Logger decorator
export function logging(logging: boolean) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // Check if logging is enabled before wrapping the method
    descriptor.value = async function (...args: any[]) {
      if (logging) {
        console.log(`Calling ${key} with arguments:`, args);
      }
      try {
        const result = await originalMethod.apply(this, args);
        if (logging) {
          console.log(`${key} returned:`, result);
        }
        return result;
      } catch (error) {
        if (logging) {
          console.error(`${key} failed:`, error);
        }
        throw error;
      }
    };

    return descriptor;
  };
}
