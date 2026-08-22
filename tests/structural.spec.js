import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';

const htmlPath = resolve(process.cwd(), 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const { window } = new JSDOM(html);
const { document } = window;

const headingLevel = (el) => Number(el.tagName[1]);

function headingOrder() {
  return [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(headingLevel);
}

describe('Clínica Aurora landing — spec-defined markup outcomes', () => {
  it('has exactly one <h1>', () => {
    expect(document.querySelectorAll('h1').length).toBe(1);
  });

  it('declares lang="pt-BR"', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });

  it('uses the required landmarks (header, main, footer, nav)', () => {
    expect(document.querySelectorAll('header').length).toBe(1);
    expect(document.querySelectorAll('main').length).toBe(1);
    expect(document.querySelectorAll('footer').length).toBe(1);
    expect(document.querySelectorAll('nav').length).toBeGreaterThanOrEqual(1);
  });

  it('provides a skip link that targets the main landmark', () => {
    const skip = document.querySelector('a.skip-link[href="#main"]');
    expect(skip).toBeTruthy();
    expect(document.getElementById('main')).toBeTruthy();
  });

  it('contains every required section anchor', () => {
    for (const id of ['tratamentos', 'como-funciona', 'depoimentos', 'faq', 'sobre', 'agendar']) {
      expect(document.getElementById(id), `missing section #${id}`).toBeTruthy();
    }
  });

  it('does not skip heading levels', () => {
    const levels = headingOrder();
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i], `heading spike at index ${i}`).toBeLessThanOrEqual(levels[i - 1] + 1);
    }
  });

  it('has an h2 in every new section (como-funciona, depoimentos, faq)', () => {
    for (const id of ['como-funciona', 'depoimentos', 'faq']) {
      expect(document.querySelector(`#${id} h2`), `#${id} missing h2`).toBeTruthy();
    }
  });

  it('wraps every form control with a label', () => {
    const inputs = [...document.querySelectorAll('input')];
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      const labeled = input.closest('label')
        || (input.id && document.querySelector(`label[for="${input.id}"]`));
      expect(labeled, `input #${input.id} has no label`).toBeTruthy();
    }
  });

  it('implements the FAQ as an accessible disclosure (4–6 items)', () => {
    const detailsList = [...document.querySelectorAll('details.faq')];
    expect(detailsList.length).toBeGreaterThanOrEqual(4);
    expect(detailsList.length).toBeLessThanOrEqual(6);
    for (const details of detailsList) {
      expect(details.querySelector('summary')).toBeTruthy();
    }
  });

  it('points every main-nav anchor at an existing element id', () => {
    const hrefs = [...document.querySelectorAll('header nav a[href^="#"]')].map((a) => a.getAttribute('href'));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const id = href.slice(1);
      expect(document.getElementById(id), `nav link ${href} has no target`).toBeTruthy();
    }
  });

  it('gives every image a meaningful (non-empty) alt', () => {
    const imgs = [...document.querySelectorAll('img')];
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      expect(img.getAttribute('alt')?.trim(), 'image missing alt').toBeTruthy();
    }
  });

  it('keeps interactive controls explicitly typed where required', () => {
    const buttons = [...document.querySelectorAll('button')];
    expect(buttons.length).toBeGreaterThan(0);
    for (const btn of buttons) {
      expect(btn.getAttribute('type'), 'button missing type').toBeTruthy();
    }
  });
});
