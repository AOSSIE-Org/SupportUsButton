/** The package ships plain JavaScript; these are the parts of its API the demo's share button uses. */
declare module "@aossie-org/social-share-button" {
  export default class SocialShareButton {
    constructor(options: Record<string, unknown>);
    options: { theme: string };
    updateOptions(options: { url: string; title: string }): void;
    openModal(): void;
    destroy(): void;
  }
}
