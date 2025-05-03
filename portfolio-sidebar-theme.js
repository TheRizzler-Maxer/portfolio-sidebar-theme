/**
 * Copyright 2025 ProdByBobo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/scroll-button/scroll-button.js';

/**
 * `portfolio-sidebar-theme`
 * 
 * This component wraps the page’s content and auto-generates a fixed sidebar
 * with navigation links based on slotted <portfolio-screen> elements.
 *
 * @demo index.html
 * @element portfolio-sidebar-theme
 */
export class PortfolioSidebarTheme extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "portfolio-sidebar-theme";
  }

  constructor() {
    super();
    this.title = "";
    this.sidebarLinks = [];
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Navigation"
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/portfolio-sidebar-theme.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      sidebarLinks: { type: Array }
    };
  }

  static get styles() {
    return [super.styles,
      css`
        :host { display: block; }
        .container { display: flex; }
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 200px;
          height: 100vh;
          background: #041E42;
          color: #fff;
          overflow-y: auto;
          padding: var(--ddd-spacing-2);
          box-sizing: border-box;
          z-index: 1000;
        }
        .sidebar a { color: #fff; text-decoration: none; display: block; margin-bottom: 1em; }
        .sidebar a:hover { filter: brightness(0.5); }
        .content { margin-left: 200px; scroll-behavior: smooth; }
      `]
  }

  render() {
    return html`
      <div class="container">
        <div class="sidebar">
          <h3><span>${this.t.title}:</span> ${this.title}</h3>
          ${this.sidebarLinks.map(link => html`
            <a href="#${link.id}" @click="${e => this.navigate(e, link.id)}">${link.title}</a>
          `)}
        </div>
        <div class="content">
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  handleSlotChange(e) {
    const nodes = e.target.assignedElements({ flatten: true });
    const links = [];
    nodes.forEach(el => {
      if (el.tagName && el.tagName.toLowerCase() === 'portfolio-screen') {
        let id = el.getAttribute("id");
        if (!id) {
          id = "screen-" + Math.random().toString(36).substring(2, 7);
          el.setAttribute("id", id);
        }
        links.push({ id, title: el.getAttribute("title") || "Screen" });
      }
    });
    this.sidebarLinks = links;
  }

  navigate(event, id) {
    event.preventDefault();
    const target = this.querySelector(`#${id}`);
    if (target) {
      // Calculate offsets for fixed header/sidebar
      const headerEl = document.querySelector('header');
      const sidebarEl = this.shadowRoot
        ? this.shadowRoot.querySelector('.sidebar')
        : document.querySelector('.sidebar');
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;
      const navWidth = sidebarEl ? sidebarEl.offsetWidth : 0;
      const topOffset = headerHeight;
      const rect = target.getBoundingClientRect();
      const scrollY = window.pageYOffset + rect.top - topOffset;
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('load', () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => this.navigate({ preventDefault:()=>{} }, id), 100);
      }
    });
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(PortfolioSidebarTheme.tag, PortfolioSidebarTheme);
