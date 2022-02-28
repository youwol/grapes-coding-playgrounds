export type CdnClient = {
    install: (p, p2?) => Promise<Window>
    LoadingScreenView: any
    getUrlBase: any
    CdnMessageEvent: any
}
export type Lib = { renderElement: (elem: HTMLElement, ...args) => void }
