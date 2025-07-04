/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.jpeg" {
    const value: string;
    export default value;
}

declare module "*.gif" {
    const value: string;
    export default value;
}

declare module "*.ico" {
    const value: string;
    export default value;
}
