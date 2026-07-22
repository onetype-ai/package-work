import { browser } from './browser.js';

const cookie = process.env.OT_SESSION;
const page = await browser('http://localhost:3000/work', 9431, cookie);

await new Promise((settle) => setTimeout(settle, 5000));

const result = await page.evaluate(`(async () => {
    document.querySelector('.e-310b2af1 .card').click();
    await new Promise((tick) => setTimeout(tick, 1200));
    [...document.querySelectorAll('.e-1a8b6ac1 .tab')].find((tab) => tab.textContent.includes('Comments')).click();
    await new Promise((tick) => setTimeout(tick, 800));

    const area = document.querySelector('.e-24227249 .composer textarea');
    area.focus();
    area.value = 'enter-test';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((tick) => setTimeout(tick, 300));

    document.querySelector('.e-24227249 .composer textarea').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await new Promise((tick) => setTimeout(tick, 800));

    const texts = [...document.querySelectorAll('.e-24227249 .entry .text')].map((node) => node.textContent);

    return JSON.stringify({ sent: texts.includes('enter-test'), cleared: document.querySelector('.e-24227249 .composer textarea').value === '' });
})()`);

console.log('RESULT:', result);
console.log('CONSOLE:', page.console.join('\n') || 'clean');
console.log('ERRORS:', page.errors.join('\n') || 'clean');
await page.close();
process.exit(0);
