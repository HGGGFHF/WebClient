import DOMPurify from 'dompurify';

import { unicodeTag } from '../../../helpers/string';

/* @ngInject */
function sanitize() {
    const CONFIG = {
        default: {
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|blob|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i, // eslint-disable-line no-useless-escape
            ADD_TAGS: ['proton-src', 'base'],
            ADD_ATTR: ['target', 'proton-src'],
            FORBID_TAGS: ['style', 'input', 'form'],
            FORBID_ATTR: ['srcset']
        },
        // When we display a message we need to be global and return more informations
        raw: { WHOLE_DOCUMENT: true, RETURN_DOM: true },
        html: { WHOLE_DOCUMENT: false, RETURN_DOM: true },
        content: {
            ALLOW_UNKNOWN_PROTOCOLS: true,
            WHOLE_DOCUMENT: false,
            RETURN_DOM: true,
            RETURN_DOM_FRAGMENT: true
        }
    };

    const getConfig = (type) => ({ ...CONFIG.default, ...(CONFIG[type] || {}) });
    const clean = (mode) => (input) => DOMPurify.sanitize(input, getConfig(mode));

    /**
     * Custom config only for messages
     * @param  {String} input
     * @param  {Boolean} raw Format the message and return the whole document
     * @return {String|Document}
     */
    const message = clean();

    /**
     * Sanitize input with a config similar than Squire + ours
     * @param  {String} input
     * @return {Document}
     */
    const html = clean('raw');

    /**
     * Sanitize input and returns the whole document
     * @param  {String} input
     * @return {Document}
     */
    const content = clean('content');

    /**
     * Default config we don't want any custom behaviour
     */
    const input = DOMPurify.sanitize;

    const toTagUnicode = unicodeTag;

    return { message, input, html, content, toTagUnicode };
}
export default sanitize;
