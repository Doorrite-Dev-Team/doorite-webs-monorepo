declare module "@socket.io/component-emitter" {
  export interface Emitter {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener?: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
  }

  export function mixin(obj: any): Emitter;
  export function on(emitter: Emitter, event: string, listener: (...args: any[]) => void): void;
}
