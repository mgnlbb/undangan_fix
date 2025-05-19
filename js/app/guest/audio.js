import { progress } from './progress.js';
import { cache } from '../../connection/cache.js';

export const audio = (() => {

    /**
     * @type {HTMLButtonElement|null}
     */
    let music = null;

    /**
     * @type {HTMLAudioElement|null}
     */
    let audioEl = null;

    /**
     * @type {Promise<void>|null}
     */
    // let canPlay = null;

    let isPlay = false;

    const statePlay = '<i class="fa-solid fa-circle-pause spin-button"></i>';
    const statePause = '<i class="fa-solid fa-circle-play"></i>';

    /**
     * @returns {Promise<void>}
     */
    const play = async () => {
        if (!navigator.onLine || !music) {
            return;
        }

        music.disabled = true;
        try {
            // await canPlay;
            await audioEl.play();
            isPlay = true;
            music.disabled = false;
            music.innerHTML = statePlay;
        } catch (err) {
            isPlay = false;
            alert(err);
        }
    };

    /**
     * @returns {void}
     */
    const pause = () => {
        isPlay = false;
        audioEl.pause();
        music.innerHTML = statePause;
    };

    /**
     * @returns {Promise<void>}
     */
    const init = async () => {
        console.log('Audio init start'); // <-- LOG 1

        if (!document.body.getAttribute('data-audio')) {
            console.log('No data-audio attribute found. Skipping audio setup.'); // <-- LOG 2
            progress.complete('audio', true);
            return;
        }

        music = document.getElementById('button-music');
        document.addEventListener('undangan.open', () => {
            music.classList.remove('d-none');
        });

        try {
            console.log('Fetching audio URL from cache...'); // <-- LOG 3

            const cancel = new Promise((res) => document.addEventListener('progress.invalid', res, { once: true }));
            // const url = await cache('audio').get(document.body.getAttribute('data-audio'), cancel);
            const url = document.body.getAttribute('data-audio');

            console.log('Audio URL obtained:', url); // <-- LOG 4

            audioEl = new Audio(url);
            audioEl.volume = 1;
            audioEl.loop = true;
            audioEl.muted = false;
            audioEl.currentTime = 0;
            audioEl.autoplay = false;
            audioEl.controls = false;

            // canPlay = new Promise((res) => audioEl.addEventListener('canplay', res));

            progress.complete('audio');

            console.log('Audio is ready for playback.'); // <-- LOG 5
        } catch (error) {
            console.error('Error while setting up audio:', error); // <-- LOG 6
            progress.invalid('audio');
        }

        music.addEventListener('offline', pause);
        music.addEventListener('click', () => isPlay ? pause() : play());
    };

    return {
        init,
        play,
    };
})();
