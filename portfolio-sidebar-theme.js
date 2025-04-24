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

  // Define reactive properties including sidebarLinks (an array of link objects)
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      sidebarLinks: { type: Array }
    };
  }

  // Scoped styles including layout for sidebar and content area
  static get styles() {
    return [super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .container {
          display: flex;
        }
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 200px;
          height: 100vh;
          background: #333;
          color: #fff;
          overflow-y: auto;
          padding: var(--ddd-spacing-2);
          box-sizing: border-box;
          z-index: 1000;
        }
        .sidebar a {
          color: #fff;
          text-decoration: none;
          display: block;
          margin-bottom: 1em;
          cursor: pointer;
          transition: background 0.3s;
        }
        .sidebar a:hover {
          background: #444;
        }
        .content {
          margin-left: 200px;
          scroll-behavior: smooth;
        }
        h3 span {
          font-size: var(--portfolio-sidebar-theme-label-font-size, var(--ddd-font-size-s));
        }
      `];
  }

  // Render the sidebar and the content slot
  render() {
    return html`
      <div class="container">
        <div class="sidebar">
          <h3><span>${this.t.title}:</span> ${this.title}</h3>
          ${this.sidebarLinks.map(link => html`
            <a href="#${link.id}" @click="${() => this.navigate(link.id)}">${link.title}</a>
          `)}
        </div>
        <div class="content">
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  // When the slot content changes, update the sidebar links from any portfolio-screen element.
  handleSlotChange(e) {
    const nodes = e.target.assignedElements({ flatten: true });
    const links = [];
    nodes.forEach(el => {
      if (el.tagName && el.tagName.toLowerCase() === 'portfolio-screen') {
        let id = el.getAttribute("id");
        if (!id) {
          // If no ID is set, generate one.
          id = "screen-" + Math.random().toString(36).substring(2, 7);
          el.setAttribute("id", id);
        }
        links.push({
          id: id,
          title: el.getAttribute("title") || "Screen"
        });
      }
    });
    this.sidebarLinks = links;
  }

  // Handle clicking on sidebar links: scroll to the target element and update URL hash.
  navigate(id) {
    const target = this.querySelector(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  }

  // On load, if a hash is set in the URL, scroll to that section.
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("load", () => {
      if (window.location.hash) {
        const target = this.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
        }
      }
    });
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(PortfolioSidebarTheme.tag, PortfolioSidebarTheme);
