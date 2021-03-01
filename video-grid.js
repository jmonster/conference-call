import {LitElement, html, css} from 'lit-element';

export class VideoGrid extends LitElement {
  static get styles() {
    return css`
      :host {
        overflow: hidden;
        height: 100%;
      }

      ::slotted(video) {
        object-fit: cover;
        float: left;
      }
    `;
  }

  static get properties() {
    return {};
  }

  render() {
    return html`
      <slot name="video" @slotchange="${this._onSlotChange}"></slot>
    `;
  }

  _onSlotChange() {
    this.recalculateVideoDimensions()
  }

  connectedCallback() {
    super.connectedCallback()
    // TODO don't use the global 'onresize' but instead addEventListener
    window.onresize = this.recalculateVideoDimensions.bind(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    delete window.onresize // TODO removeEventListener
  }

  recalculateVideoDimensions() {
    const slot = this.shadowRoot.querySelector('slot[name="video"]');
    const childNodes = slot && slot.assignedNodes({flatten: true});
    const videos = Array.prototype.filter.call(childNodes, (node) => node.nodeType == Node.ELEMENT_NODE);

    const {clientWidth, clientHeight} = this

    videos.forEach(async (v) => {
      if (videos.length  <= 1) { v.width = clientWidth; v.height = clientHeight; }
      else if (videos.length <= 2) { v.width = clientWidth/2 ; v.height = clientHeight; }
      else if (videos.length <= 4) { v.width = clientWidth/2; v.height = clientHeight/2; }
      else if (videos.length <= 6) { v.width = clientWidth/3; v.height = clientHeight/2; }
      else if (videos.length <= 9) { v.width = clientWidth/3; v.height = clientHeight/3; } 
      else if (videos.length < 17) { v.width = clientWidth/4; v.height = clientHeight/4; }

      v.oncanplay = v.play // leak?
    })
  }
}

window.customElements.define('video-grid', VideoGrid);
