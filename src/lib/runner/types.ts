/*eslint @typescript-eslint/no-explicit-any: off -- we update this version 0.1.x => 0.2.x where we do not use these lines anymore*/
export type CdnClient = {
    install: (p, p2?) => Promise<Window>
    LoadingScreenView: any
    getUrlBase: any
    CdnMessageEvent: any
}
export type Lib = { renderElement: (elem: HTMLElement, ...args) => void }
