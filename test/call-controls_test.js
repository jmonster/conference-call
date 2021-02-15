import {ConferenceCall} from '../conference-call.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('conference-call', () => {
  test('is defined', () => {
    const el = document.createElement('conference-call');
    assert.instanceOf(el, ConferenceCall);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<conference-call></conference-call>`);
    assert.shadowDom.equal(
      el,
      `
      <!---->
      <sp-theme scale="medium" color="light" dir="ltr">
        
      <!-- microphone, camera, participants -->
      <sp-button-group dir="ltr">
        <sp-button data-test-target="microphone-btn" size="s" variant="secondary" dir="ltr" focusable="" tabindex="0" role="button">
          <svg slot="icon" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img">
            <path d="M10.403,15.231v2.035h2.827c0.223,0,0.403,0.181,0.403,0.404c0,0.223-0.181,0.403-0.403,0.403H6.77c-0.223,0-0.404-0.181-0.404-0.403c0-0.224,0.181-0.404,0.404-0.404h2.826v-2.035C6.89,15.024,4.751,12.758,4.751,10c0-0.223,0.181-0.403,0.404-0.403S5.559,9.777,5.559,10c0,2.449,1.992,4.441,4.441,4.441c2.449,0,4.441-1.992,4.441-4.441c0-0.223,0.182-0.403,0.404-0.403s0.403,0.18,0.403,0.403C15.248,12.758,13.108,15.024,10.403,15.231 M13.026,4.953V10c0,1.669-1.357,3.027-3.027,3.027S6.972,11.669,6.972,10V4.953c0-1.669,1.358-3.028,3.028-3.028S13.026,3.284,13.026,4.953M12.221,4.953c0-1.225-0.996-2.22-2.221-2.22s-2.221,0.995-2.221,2.22V10c0,1.225,0.996,2.22,2.221,2.22s2.221-0.995,2.221-2.22V4.953z"></path>
          </svg>
        </sp-button>

          <sp-button data-test-target="camera-btn" size="s" variant="secondary" dir="ltr" focusable="" tabindex="0" role="button">
            <svg slot="icon" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img">
              <path d="M17.919,4.633l-3.833,2.48V6.371c0-1-0.815-1.815-1.816-1.815H3.191c-1.001,0-1.816,0.814-1.816,1.815v7.261c0,1.001,0.815,1.815,1.816,1.815h9.079c1.001,0,1.816-0.814,1.816-1.815v-0.739l3.833,2.478c0.428,0.226,0.706-0.157,0.706-0.377V5.01C18.625,4.787,18.374,4.378,17.919,4.633 M13.178,13.632c0,0.501-0.406,0.907-0.908,0.907H3.191c-0.501,0-0.908-0.406-0.908-0.907V6.371c0-0.501,0.407-0.907,0.908-0.907h9.079c0.502,0,0.908,0.406,0.908,0.907V13.632zM17.717,14.158l-3.631-2.348V8.193l3.631-2.348V14.158z"></path>
            </svg>
          </sp-button>

          <sp-button size="s" variant="secondary" dir="ltr" focusable="" tabindex="0" role="button">
            <svg slot="icon" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img">
              <path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path>
            </svg>
          </sp-button>
        </sp-button-group>

        <!-- end call -->
        <sp-button-group dir="ltr">
          <sp-button data-test-target="end-call-btn" size="s" variant="negative" dir="ltr" focusable="" tabindex="0" role="button">End Call</sp-button>
        </sp-button-group>
        
        <!-- sharing -->
        <sp-button-group dir="ltr">
          <sp-button data-test-target="present-screen-btn" size="s" variant="primary" dir="ltr" focusable="" tabindex="0" role="button">
            <svg slot="icon" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img">
              <path d="M17.237,3.056H2.93c-0.694,0-1.263,0.568-1.263,1.263v8.837c0,0.694,0.568,1.263,1.263,1.263h4.629v0.879c-0.015,0.086-0.183,0.306-0.273,0.423c-0.223,0.293-0.455,0.592-0.293,0.92c0.07,0.139,0.226,0.303,0.577,0.303h4.819c0.208,0,0.696,0,0.862-0.379c0.162-0.37-0.124-0.682-0.374-0.955c-0.089-0.097-0.231-0.252-0.268-0.328v-0.862h4.629c0.694,0,1.263-0.568,1.263-1.263V4.319C18.5,3.625,17.932,3.056,17.237,3.056 M8.053,16.102C8.232,15.862,8.4,15.597,8.4,15.309v-0.89h3.366v0.89c0,0.303,0.211,0.562,0.419,0.793H8.053z M17.658,13.156c0,0.228-0.193,0.421-0.421,0.421H2.93c-0.228,0-0.421-0.193-0.421-0.421v-1.263h15.149V13.156z M17.658,11.052H2.509V4.319c0-0.228,0.193-0.421,0.421-0.421h14.308c0.228,0,0.421,0.193,0.421,0.421V11.052z"></path>
            </svg>
            Share Screen
          </sp-button>

          <sp-button data-test-target="present-file-btn" size="s" variant="primary" dir="ltr" focusable="" tabindex="0" role="button">
            <svg slot="icon" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img">
              <path d="M18.555,15.354V4.592c0-0.248-0.202-0.451-0.45-0.451H1.888c-0.248,0-0.451,0.203-0.451,0.451v10.808c0,0.559,0.751,0.451,0.451,0.451h16.217h0.005C18.793,15.851,18.478,14.814,18.555,15.354 M2.8,14.949l4.944-6.464l4.144,5.419c0.003,0.003,0.003,0.003,0.003,0.005l0.797,1.04H2.8z M13.822,14.949l-1.006-1.317l1.689-2.218l2.688,3.535H13.822z M17.654,14.064l-2.791-3.666c-0.181-0.237-0.535-0.237-0.716,0l-1.899,2.493l-4.146-5.42c-0.18-0.237-0.536-0.237-0.716,0l-5.047,6.598V5.042h15.316V14.064z M12.474,6.393c-0.869,0-1.577,0.707-1.577,1.576s0.708,1.576,1.577,1.576s1.577-0.707,1.577-1.576S13.343,6.393,12.474,6.393 M12.474,8.645c-0.371,0-0.676-0.304-0.676-0.676s0.305-0.676,0.676-0.676c0.372,0,0.676,0.304,0.676,0.676S12.846,8.645,12.474,8.645"></path>
            </svg>
            Present File
          </sp-button>

          <slot name="sharing"></slot>
        </sp-button-group>
      </sp-theme>
    <!---->
    `
    );
  });

  test('dispatches microphone clicked event', async () => {
    const el = await fixture(html`<conference-call></conference-call>`)
    let didToggle = false;

    el.addEventListener('microphone', () => {
      didToggle = true;
    })

    const button = el.shadowRoot.querySelector('[data-test-target="microphone-btn"]');
    button.click();
    await el.updateComplete;
    
    assert.isTrue(didToggle);
  });

  test('dispatches camera clicked event', async () => {
    const el = await fixture(html`<conference-call></conference-call>`)
    let didToggle = false;

    el.addEventListener('camera', () => {
      didToggle = true;
    })

    const button = el.shadowRoot.querySelector('[data-test-target="camera-btn"]');
    button.click();
    await el.updateComplete;
    
    assert.isTrue(didToggle);
  });

  test('dispatches present-screen clicked event', async () => {
    const el = await fixture(html`<conference-call></conference-call>`)
    let didToggle = false;

    el.addEventListener('present-screen', () => {
      didToggle = true;
    })

    const button = el.shadowRoot.querySelector('[data-test-target="present-screen-btn"]');
    button.click();
    await el.updateComplete;
    
    assert.isTrue(didToggle);
  });

  test('dispatches present-file clicked event', async () => {
    const el = await fixture(html`<conference-call></conference-call>`)
    let didToggle = false;

    el.addEventListener('present-file', () => {
      didToggle = true;
    })

    const button = el.shadowRoot.querySelector('[data-test-target="present-file-btn"]');
    button.click();
    await el.updateComplete;
    
    assert.isTrue(didToggle);
  });
});
